import express from 'express'
import { PropertyController } from '../controllers/property.controller'
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../src/assets'));
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname)
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      cb(null, `${timestamp}_${randomString}${ext}`)
    }
  })
  
  const upload = multer({ storage }).array('images', 5)

const propertyRouter = express.Router()

propertyRouter.route('/guest-stats').get(
    (req, res) => new PropertyController().getGuestStats(req, res)
)

propertyRouter.route('/all-properties').get(
    (req, res) => new PropertyController().getProperties(req, res)
)

propertyRouter.route('/property-details/:name').get(
    (req, res) => new PropertyController().getPropertyByName(req, res)
)

propertyRouter.route('/delete-property/:name').get(
    (req, res) => new PropertyController().deleteProperty(req, res)
)  

propertyRouter.route('/add-property').post(
    upload,
    (req, res) => new PropertyController().addProperty(req, res)
)

propertyRouter.route('/update-property/:name').post(
    upload,
    (req, res) => new PropertyController().updateProperty(req, res)
)

propertyRouter.route('/get-my-properties').post(
    (req, res) => new PropertyController().getPropertiesByOwner(req, res)
)

propertyRouter.route('/add-reservation').post(
    (req, res) => new PropertyController().addReservation(req, res)
)

propertyRouter.route('/block-property').post(
    (req, res) => new PropertyController().blockProperty(req, res)
)

export default propertyRouter