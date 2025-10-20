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

    getReservationsByMonth = (req: express.Request, res: express.Response) => {
        let month = req.body.month // 0-11
        let property = req.body.propertyName

    }

    // getReservationsByMonth = (req: express.Request, res: express.Response) => {
    //     let owner = req.body.owner
    //     let year = req.body.year || new Date().getFullYear()
    
    //     // Pronađi sve vikendice vlasnika
    //     PropertyModel.find({ owner: owner }).then(properties => {
    //         if (properties.length === 0) {
    //             return res.status(404).json('nema vikendica za ovog vlasnika')
    //         }
    
    //         let results: any[] = []
    //         let processedCount = 0
    
    //         // Za svaku vikendicu
    //         properties.forEach((property, index) => {
    //             this.processPropertyReservations(property.name, year, (monthlyData) => {
    //                 results.push({
    //                     propertyName: property.name,
    //                     monthlyReservations: monthlyData
    //                 })
    
    //                 processedCount++
    
    //                 // Kada su sve obrađene, pošalji rezultat
    //                 if (processedCount === properties.length) {
    //                     res.status(200).json(results)
    //                 }
    //             })
    //         })
    
    //     }).catch(err => {
    //         console.log(err)
    //         res.status(500).json('greska')
    //     })
    // }
    
    // private processPropertyReservations = (propertyName: string, year: number, callback: (data: number[]) => void) => {
    //     let startOfYear = new Date(year, 0, 1)
    //     let endOfYear = new Date(year + 1, 0, 1)
    
    //     ReservationModel.find({
    //         propertyName: propertyName,
    //         approved: true,
    //         dateBeg: { $gte: startOfYear, $lt: endOfYear }
    //     }).then(reservations => {
    //         // Inicijalizuj niz sa 12 nula
    //         let monthlyCount = new Array(12).fill(0)
    
    //         // Prebroji rezervacije po mesecima
    //         reservations.forEach(reservation => {
    //             let month = new Date(reservation.dateBeg).getMonth()
    //             monthlyCount[month]++
    //         })
    
    //         callback(monthlyCount)
    //     }).catch(err => {
    //         console.log('Greška za vikendicu:', propertyName, err)
    //         // Vrati nule u slučaju greške
    //         callback(new Array(12).fill(0))
    //     })
    // }

}