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
      cb(null, JSON.parse(req.body.user).username + ext)
    }
  })
  
  const upload = multer({ storage })

const propertyRouter = express.Router()

propertyRouter.route('/guest-stats').get(
    (req, res) => new PropertyController().getGuestStats(req, res)
)

propertyRouter.route('/all-properties').get(
    (req, res) => new PropertyController().getProperties(req, res)
)

export default propertyRouter