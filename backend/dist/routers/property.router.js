"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../controllers/property.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, '../../src/assets'));
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        cb(null, `${timestamp}_${randomString}${ext}`);
    }
});
const upload = (0, multer_1.default)({ storage }).array('images', 5);
const propertyRouter = express_1.default.Router();
propertyRouter.route('/guest-stats').get((req, res) => new property_controller_1.PropertyController().getGuestStats(req, res));
propertyRouter.route('/all-properties').get((req, res) => new property_controller_1.PropertyController().getProperties(req, res));
propertyRouter.route('/property-details/:name').get((req, res) => new property_controller_1.PropertyController().getPropertyByName(req, res));
propertyRouter.route('/delete-property/:name').get((req, res) => new property_controller_1.PropertyController().deleteProperty(req, res));
propertyRouter.route('/add-property').post(upload, (req, res) => new property_controller_1.PropertyController().addProperty(req, res));
propertyRouter.route('/update-property/:name').post(upload, (req, res) => new property_controller_1.PropertyController().updateProperty(req, res));
propertyRouter.route('/get-my-properties').post((req, res) => new property_controller_1.PropertyController().getPropertiesByOwner(req, res));
propertyRouter.route('/add-reservation').post((req, res) => new property_controller_1.PropertyController().addReservation(req, res));
propertyRouter.route('/block-property').post((req, res) => new property_controller_1.PropertyController().blockProperty(req, res));
propertyRouter.route('/get-reservations-by-property').post((req, res) => new property_controller_1.PropertyController().getReservationsByProperty(req, res));
exports.default = propertyRouter;
