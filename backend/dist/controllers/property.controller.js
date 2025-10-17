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
    }
}
exports.PropertyController = PropertyController;
