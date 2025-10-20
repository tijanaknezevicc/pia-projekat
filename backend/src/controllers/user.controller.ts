import express from 'express'
import UserModel from '../models/user'
import PropertyModel from '../models/property'
import ReservationModel from '../models/reservation'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export class UserController {
    login = async (req: express.Request, res: express.Response) => {
        try {
            let username = req.body.username
            let password = req.body.password

            let user = await UserModel.findOne({username: username, active: true, type: {$in: ['owner', 'tourist']}})

            if (!user) {
               res.status(404).json(null)
            }

            else {
                let correct = await bcrypt.compare(password, user.password)
                if (!correct) {
                    res.status(401).json('pogresna lozinka')
                }
                else {
                    res.status(200).json(user)
                }
            }         
        } catch (err) {
            console.log(err)
            res.status(500).json('greska')
        }
    }

    adminLogin = async (req: express.Request, res: express.Response) => {
        try {
            let username = req.body.username
            let password = req.body.password

            let user = await UserModel.findOne({username: username, active: true, type: 'admin'})

            if (!user) {
               res.status(404).json(null)
            }

            else {
                let correct = await bcrypt.compare(password, user.password)
                if (!correct) {
                    res.status(401).json('pogresna lozinka')
                }
                else {
                    res.status(200).json(user)
                }
            }         
        } catch (err) {
            console.log(err)
            res.status(500).json('greska')
        }
    }

    register = async (req: express.Request, res: express.Response) => {
        try {
            let user = JSON.parse(req.body.user)
            
            let exists = await UserModel.findOne({email: user.email})
            if (exists) {
                res.status(400).json('email vec postoji u bazi')
            }

            else {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS)

                user.pfp = req.file ? `${req.file.filename}` : 'default.png'

                await new UserModel(user).save()

                res.status(200).json('registracija uspesna')
            }            
            
        } catch (err) {
            console.log(err)
            res.status(500).json('registracija neuspesna')
        }
    }

    updateUser = async (req: express.Request, res: express.Response) => {
        try {
            let user = JSON.parse(req.body.user)

            let exists = await UserModel.findOne({username: {$ne: user.username},email: user.email})
            if (exists) {
                res.status(400).json('email vec postoji u bazi')
                return
            }

            if (req.file) {
                user.pfp = req.file ? `${req.file.filename}` : 'default.png'
            }
            await UserModel.updateOne({username: user.username}, user)

            let updated = await UserModel.findOne({username: user.username})

            res.status(200).json(updated)           
        } 
        catch (err) {     
            console.log(err)
            res.status(500).json('update neuspesan')
        }
    }

    changePassword = async (req: express.Request, res: express.Response) => {
        try {
            let username = req.body.username
            let oldPassword = req.body.oldPassword
            let newPassword = req.body.newPassword
            let user = await UserModel.findOne({username: username, active: true})

            let correct = await bcrypt.compare(oldPassword, user!.password)
            
            if (!correct) {
                res.status(401).json('pogresna stara lozinka')
                return
            }

            user!.password = await bcrypt.hash(newPassword, SALT_ROUNDS)
            await user!.save()

            res.status(200).json('lozinka promenjena')
        } catch (err) {
            console.log(err)
            res.status(500).json('greska')
        }
    }

    getReservationsOwner = (req: express.Request, res: express.Response) => {
        let username = req.body.username

        ReservationModel.find({owner: username}).sort({ dateBeg: -1 })
            .then(reservations => {
                res.status(200).json(reservations)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json('greska')
            })
    }

    getReservationsTourist = (req: express.Request, res: express.Response) => {
        let username = req.body.username

        ReservationModel.find({renter: username, approved: true}).sort({ dateBeg: -1 })
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json('greska')
            })
    }

    addRating = (req: express.Request, res: express.Response) => {
        let reservation = req.body

        let newComment = {
            user: reservation.renter,
            text: reservation.comment,
            rating: reservation.rating
        }

        ReservationModel.updateOne({_id: reservation._id}, {comment: reservation.comment, rating: reservation.rating}).then(ok => {
            PropertyModel.updateOne({ name: reservation.propertyName }, {$push: {comments: newComment}}).then(ok => {
                res.status(200).json('uspesno dodavanje komentara')
                }).catch(err => {
                    console.log(err)
                    res.status(500).json('greska')
                })
            }).catch(err => {
                console.log(err)
                res.status(500).json('greska')
            })
    }

    cancelReservation = (req: express.Request, res: express.Response) => {
        let reservation = req.body

        ReservationModel.deleteOne({_id: reservation._id}).then(ok => {
            res.status(200).json('otkazana rezervacija')
        }).catch(err => {
            console.log(err)
            res.status(500).json('greska')
        })
    }

    processReservation = (req: express.Request, res: express.Response) => {
        let reservation = req.body

        ReservationModel.updateOne({_id: reservation._id}, {approved: reservation.approved, pending: false, rejectionReason: reservation.rejectionReason}).then(ok => {
            res.status(200).json('obradjena rezervacija')
        }).catch(err => {
            console.log(err)
            res.status(500).json('greska')
        })
    }
}
