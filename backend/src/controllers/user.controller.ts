import express from 'express'
import UserModel from '../models/user'

export class UserController {
    login = (req: express.Request, res: express.Response) => {
        let u = req.body.username
        let p = req.body.password

        UserModel.findOne({username: u, password: p, active: true}).then((user) => {
            res.json(user)
        }).catch((err) => {
            console.log(err)
            res.json(null)
        })
    } 

    register = async (req: express.Request, res: express.Response) => {
        let user = req.body
        let email = req.body.email

        UserModel.findOne({email: email}).then(existing => {
            if (existing) {
                res.status(400).json('email vec postoji u bazi')
            }
            else {
                new UserModel(user).save().then(ok => {
                    res.status(200).json('registered')
                }).catch((err) => {
                    console.log(err)
                    res.status(500).json('registration failed')
                }) 
            }
        }).catch((err) => {
            console.log(err)
            res.status(500).json('email error')
        }) 
    }
}