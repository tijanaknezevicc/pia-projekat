import express from 'express'
import { UserController } from '../controllers/user.controller'
import { PropertyController } from '../controllers/property.controller'
import multer from 'multer';
import path from 'path';
import user from '../models/user';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../src/assets'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      cb(null, JSON.parse(req.body.user).username + ext)
    }
  })
  
  const upload = multer({ storage })

const userRouter = express.Router()

userRouter.route('/login').post(
    (req, res) => new UserController().login(req, res)    
)

userRouter.route('/register').post(
    upload.single('pfp'),
    (req, res) => new UserController().register(req, res)
  )

userRouter.route('/updateUser').post(
    upload.single('pfp'),
    (req, res) => new UserController().updateUser(req, res)
  )

userRouter.route('/changePassword').post(
    (req, res) => new UserController().changePassword(req, res)
)

userRouter.route('/getReservationsOwner').post(
    (req, res) => new UserController().getReservationsOwner(req, res)
)

userRouter.route('/getReservationsTourist').post(
    (req, res) => new UserController().getReservationsTourist(req, res)
)

userRouter.route('/processReservation').post(
    (req, res) => new UserController().processReservation(req, res)
)

userRouter.route('/cancelReservation').post(
    (req, res) => new UserController().cancelReservation(req, res)
)

userRouter.route('/addRating').post(
    (req, res) => new UserController().addRating(req, res)
)

export default userRouter