import express from 'express'
import UserModel from '../models/user'
import PropertyModel from '../models/property'
import ReservationModel from '../models/reservation'
import property from '../models/property'

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
            
            if (searchName) {
                conditions.push({name: { $regex: searchName as string, $options: 'i'}})
            }
            
            if (searchLocation) {
                conditions.push({location: { $regex: searchLocation as string, $options:'i' }})
            }
            
            searchQuery = { $and: conditions }
        }

        let sortQuery: any = {}

        if (sortBy) {
            const sortField = sortBy as string
            const sortDirection = sortOrder === 'desc' ? -1 : 1
            
            if (['name', 'location'].includes(sortField)) {
                sortQuery[sortField] = sortDirection
            }
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

    

}