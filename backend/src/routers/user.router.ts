import express from 'express'
import { UserController } from '../controllers/user.controller'
import { PropertyController } from '../controllers/property.controller'
import multer from 'multer';
import path from 'path';

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

userRouter.route('/admin-login').post(
    (req, res) => new UserController().adminLogin(req, res)    
)

userRouter.route('/register').post(
    upload.single('pfp'),
    (req, res) => new UserController().register(req, res)
  )

userRouter.route('/update-user').post(
    upload.single('pfp'),
    (req, res) => new UserController().updateUser(req, res)
  )

userRouter.route('/change-password').post(
    (req, res) => new UserController().changePassword(req, res)
)

userRouter.route('/get-users').get(
    (req, res) => new UserController().getAllUsers(req, res)
)

userRouter.route('/change-active-status').post(
    (req, res) => new UserController().changeActiveStatus(req, res)
)

userRouter.route('/approve-user').post(
    (req, res) => new UserController().approveUser(req, res)
)

userRouter.route('/reject-user').post(
    (req, res) => new UserController().rejectUser(req, res)
)

userRouter.route('/get-reservations-owner').post(
    (req, res) => new UserController().getReservationsOwner(req, res)
)

userRouter.route('/get-reservations-tourist').post(
    (req, res) => new UserController().getReservationsTourist(req, res)
)

userRouter.route('/process-reservation').post(
    (req, res) => new UserController().processReservation(req, res)
)

userRouter.route('/cancel-reservation').post(
    (req, res) => new UserController().cancelReservation(req, res)
)

userRouter.route('/add-rating').post(
    (req, res) => new UserController().addRating(req, res)
)

export default userRouter