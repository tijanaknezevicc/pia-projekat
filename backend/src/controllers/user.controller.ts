import express from 'express'
import UserModel from '../models/user'

export class UserController {
    login = (req: express.Request, res: express.Response) => {
        let u = req.body.kor_ime
        let p = req.body.lozinka

        UserModel.findOne({kor_ime: u, lozinka: p}).then((user) => {
            res.json(user)
        }).catch((err) => {
            console.log(err)
            res.json(null)
        })
    } 
}