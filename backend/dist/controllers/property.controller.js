"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyController = void 0;
const user_1 = __importDefault(require("../models/user"));
const property_1 = __importDefault(require("../models/property"));
const reservation_1 = __importDefault(require("../models/reservation"));
class PropertyController {
    constructor() {
        this.getGuestStats = (req, res) => {
            let propertyCount = property_1.default.countDocuments({});
            let ownerCount = user_1.default.countDocuments({ type: 'owner' });
            let touristCount = user_1.default.countDocuments({ type: 'tourist' });
            let reservations24h = this.getRecentReservations(24);
            let reservations7d = this.getRecentReservations(24 * 7);
            let reservations30d = this.getRecentReservations(24 * 30);
            Promise.all([propertyCount, ownerCount, touristCount, reservations24h, reservations7d, reservations30d])
                .then(([propertyCount, ownerCount, touristCount, res24h, res7d, res30d]) => {
                res.status(200).json({
                    propertyCount: propertyCount,
                    ownerCount: ownerCount,
                    touristCount: touristCount,
                    res24h: res24h.length,
                    res7d: res7d.length,
                    res30d: res30d.length
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.getRecentReservations = (hoursAgo) => {
            let now = new Date();
            let start = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
            return reservation_1.default.find({
                dateReserved: { $gte: start, $lte: now }
            });
        };
        this.getProperties = (req, res) => {
            const { searchName, searchLocation, sortBy, sortOrder } = req.query;
            let searchQuery = {};
            if (searchName || searchLocation) {
                const conditions = [];
                if (searchName) {
                    conditions.push({ name: { $regex: searchName, $options: 'i' } });
                }
                if (searchLocation) {
                    conditions.push({ location: { $regex: searchLocation, $options: 'i' } });
                }
                searchQuery = { $and: conditions };
            }
            let sortQuery = {};
            if (sortBy) {
                const sortField = sortBy;
                const sortDirection = sortOrder === 'desc' ? -1 : 1;
                if (['name', 'location'].includes(sortField)) {
                    sortQuery[sortField] = sortDirection;
                }
            }
            property_1.default.find(searchQuery)
                .sort(sortQuery)
                .then(properties => {
                res.json(properties);
            })
                .catch(error => {
                console.error(error);
                res.status(500).json('greska');
            });
        };
        this.getPropertyByName = (req, res) => {
            let name = req.params.name;
            property_1.default.findOne({ name: name })
                .then(property => {
                if (property) {
                    res.json(property);
                }
                else {
                    res.status(404).json(null);
                }
            })
                .catch(error => {
                console.error(error);
                res.status(500).json('greska');
            });
        };
        // addReservation = (req: express.Request, res: express.Response) => {
        //     let reservation = new ReservationModel(req.body)
        //     reservation.save().then(() => {
        //         res.status(200).json('ok')
        //     }).catch(err => {
        //         console.log(err)
        //         res.status(500).json('greska')
        //     })
        // }
        this.addReservation = (req, res) => {
            let reservation = req.body;
            property_1.default.findOne({ name: reservation.propertyName })
                .then(property => {
                if (!property) {
                    res.status(404).json('vikendica nije pronadjena');
                    return;
                }
                let blocked = this.checkPropertyBlocked(reservation.dateBeg, reservation.dateEnd, property);
                if (blocked) {
                    res.status(406).json('vikendica je blokirana tokom odabranog perioda');
                    return;
                }
                this.checkDateConflicts(reservation, res);
            })
                .catch(err => {
                res.status(500).json('greska');
            });
        };
        this.checkPropertyBlocked = (dateBeg, dateEnd, property) => {
            if (!property.dateBlocked) {
                return false;
            }
            const blockEnd = new Date(property.dateBlocked);
            blockEnd.setHours(blockEnd.getHours() + 48);
            return dateBeg < blockEnd && property.dateBlocked < dateEnd;
        };
        this.checkDateConflicts = (reservation, res) => {
            reservation_1.default.find({
                propertyName: reservation.propertyName, approved: true, dateBeg: { $lt: reservation.dateEnd }, dateEnd: { $gt: reservation.dateBeg }
            })
                .then(conflicts => {
                if (conflicts.length > 0) {
                    return res.status(409).json('vikendica je rezervisana u odabranom periodu');
                }
                this.saveReservation(reservation, res);
            })
                .catch(err => {
                res.status(500).json('greska');
            });
        };
        this.saveReservation = (reservationData, res) => {
            const reservation = new reservation_1.default(reservationData);
            reservation.save()
                .then(ok => {
                res.status(200).json('rezervacija kreirana');
            })
                .catch(err => {
                res.status(500).json('greska');
            });
        };
    }
}
exports.PropertyController = PropertyController;
