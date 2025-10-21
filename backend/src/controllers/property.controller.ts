import express from 'express'
import UserModel from '../models/user'
import PropertyModel from '../models/property'
import ReservationModel from '../models/reservation'

export class PropertyController {
    getGuestStats = (req: express.Request, res: express.Response) => {
        let propertyCount = PropertyModel.countDocuments({})
        let ownerCount = UserModel.countDocuments({type: 'owner'})
        let touristCount = UserModel.countDocuments({type: 'tourist'})

        let reservations24h = this.getRecentReservations(24)
        let reservations7d = this.getRecentReservations(24 * 7)
        let reservations30d = this.getRecentReservations(24 * 30)

        Promise.all([propertyCount, ownerCount, touristCount, reservations24h, reservations7d, reservations30d])
            .then(([propertyCount, ownerCount, touristCount, res24h, res7d, res30d]) => {
                res.status(200).json({
                    propertyCount: propertyCount,
                    ownerCount: ownerCount,
                    touristCount: touristCount,
                    res24h: res24h.length,
                    res7d: res7d.length,
                    res30d: res30d.length
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json('greska')
            })
    }

    private getRecentReservations = (hoursAgo: number) => {
        let now = new Date()
        let start = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000)

        return ReservationModel.find({
            dateReserved: { $gte: start, $lte: now }
        });
    }

    getProperties = (req: express.Request, res: express.Response) => {
        const { 
            searchName, 
            searchLocation, 
            sortBy, 
            sortOrder 
        } = req.query

        let searchQuery: any = {}
        
        if (searchName || searchLocation) {
            const conditions: any[] = []
            
            if (searchName) { conditions.push({name: { $regex: searchName as string, $options: 'i'}}) }
            
            if (searchLocation) { conditions.push({location: { $regex: searchLocation as string, $options:'i' }}) }
            
            searchQuery = { $and: conditions }
        }

        let sortQuery: any = {}

        if (sortBy) {
            const sortField = sortBy as string
            const sortDirection = sortOrder === 'desc' ? -1 : 1
            
            if (['name', 'location'].includes(sortField)) { sortQuery[sortField] = sortDirection }
        }

        PropertyModel.find(searchQuery)
            .sort(sortQuery)
            .then(properties => {
                res.json(properties)
            })
            .catch(error => {
                console.error(error)
                res.status(500).json('greska')
            });
    }

    getPropertyByName = (req: express.Request, res: express.Response) => {
        let name = req.params.name

        PropertyModel.findOne({ name: name })
            .then(property => {
                if (property) {
                    res.json(property)
                } else {
                    res.status(404).json(null)
                }
            })
            .catch(error => {
                console.error(error)
                res.status(500).json('greska')
            });
    }

    getPropertiesByOwner = (req: express.Request, res: express.Response) => {
        let owner = req.body

        PropertyModel.find({ owner: owner.username })
            .then(properties => {
                if (properties.length === 0) {
                    res.status(404).json('nema vikendica')
                    return
                }
                res.json(properties)
            })
            .catch(error => {
                console.error(error)
                res.status(500).json('greska')
            });
    }

    deleteProperty = (req: express.Request, res: express.Response) => {
        let property = req.params.name
        PropertyModel.deleteOne({ name: property }).then(ok => {
            res.status(200).json('obrisana vikendica')
        }).catch(err => {
            console.log(err)
            res.status(500).json('greska')
        })
    }

    addProperty = (req: express.Request, res: express.Response) => {
        try {
            let property = JSON.parse(req.body.property);
            
            const files = req.files as Express.Multer.File[];
            if (files && files.length > 0) {
                property.images = files.map(file => file.filename);
            } else if (!property.images) {
                property.images = [];
            }
    
            PropertyModel.create(property)
                .then(() => {
                    res.status(201).json('vikendica dodata');
                })
                .catch(err => {
                    res.status(500).json('greska pri dodavanju vikendice');
                });
                
        } catch (err) {
            res.status(400).json('neispravni podaci');
        }
    }

    updateProperty = (req: express.Request, res: express.Response) => {
    try {
        const propertyName = req.params.name;        
        let property = JSON.parse(req.body.property);
        
        const files = req.files as Express.Multer.File[];
        
        if (files && files.length > 0) {
            let newImageFilenames = files.map(file => file.filename)
            property.images = [...(property.images || []), ...newImageFilenames]
        }

        PropertyModel.updateOne({ name: propertyName }, property)
            .then(result => {
                if (result.matchedCount === 0) {
                    res.status(404).json('vikendica nije pronadjena')
                    return
                }
                res.status(200).json('vikendica azurirana')
            })
            .catch(err => {
                res.status(500).json('greska')
            });
            
    } catch (err) {
        res.status(400).json('neispravni podaci');
    }
}  

    addReservation = (req: express.Request, res: express.Response) => {
        let reservation = req.body
        PropertyModel.findOne({ name: reservation.propertyName })
            .then(property => {
                if (!property) {
                    res.status(404).json('vikendica nije pronadjena')
                    return
                }

                let blocked = this.checkPropertyBlocked(reservation.dateBeg, reservation.dateEnd, property)
                if (blocked) {
                    res.status(406).json('vikendica je blokirana tokom odabranog perioda')
                    return
                }
    
                this.checkDateConflicts(reservation, res);
            })
            .catch(err => {
                res.status(500).json('greska')
            })
    }
    
    private checkPropertyBlocked = (dateBeg: any, dateEnd: any, property: any) => {
        if (!property.dateBlocked) {  return false }
    
        const blockEnd = new Date(property.dateBlocked)
        blockEnd.setHours(blockEnd.getHours() + 48)

        return dateBeg < blockEnd && property.dateBlocked < dateEnd;

    }

    private checkDateConflicts = (reservation: any, res: express.Response) => {
        ReservationModel.find({
            propertyName: reservation.propertyName, approved: true, dateBeg: { $lt: reservation.dateEnd }, dateEnd: { $gt: reservation.dateBeg }
        })
        .then(conflicts => {
            if (conflicts.length > 0) {
                return res.status(409).json('vikendica je rezervisana u odabranom periodu')
            }
    
            this.saveReservation(reservation, res);
        })
        .catch(err => {
            res.status(500).json('greska')
        });
    }
    
    private saveReservation = (reservationData: any, res: express.Response) => {
        const reservation = new ReservationModel(reservationData);
        
        reservation.save()
            .then(ok => {
                res.status(200).json('rezervacija kreirana')
            })
            .catch(err => {
                res.status(500).json('greska')
            })
    }  
    
    blockProperty = (req: express.Request, res: express.Response) => {
        let property = req.body
        let now = new Date()
        
        PropertyModel.updateOne({name: property.name}, {dateBlocked: now}).then(ok => {
            res.status(200).json('blokirana vikendica')
        }).catch(err => {
            console.log(err)
            res.status(500).json('greska')
        })
    }

    getReservationsByProperty = (req: express.Request, res: express.Response) => {
        let property = req.body
        
        ReservationModel.find({ propertyName: property.name })
            .then(reservations => {
                res.status(200).json(reservations)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json('greska')
            })  
    }
}