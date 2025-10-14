import express from 'express'
import UserModel from '../models/user'
import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10

export class UserController {
    login = async (req: express.Request, res: express.Response) => {
        try {
            let username = req.body.username
            let password = req.body.password

            let user = await UserModel.findOne({username: username, active: true})

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
            let user = req.body
            
            let exists = await UserModel.findOne({email: user.email})
            if (exists) {
                res.status(400).json('email vec postoji u bazi')
            }

            else {
                user.password = await bcrypt.hash(user.password, SALT_ROUNDS)

                await new UserModel(user).save()

                res.status(200).json('registracija uspesna')
            }            
            
        } catch (err) {
            console.log(err)
            res.status(500).json('registracija neuspesna')
        }
    }
}