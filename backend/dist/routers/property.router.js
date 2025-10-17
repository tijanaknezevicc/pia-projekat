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
        cb(null, JSON.parse(req.body.user).username + ext);
    }
});
const upload = (0, multer_1.default)({ storage });
const propertyRouter = express_1.default.Router();
propertyRouter.route('/guest-stats').get((req, res) => new property_controller_1.PropertyController().getGuestStats(req, res));
propertyRouter.route('/all-properties').get((req, res) => new property_controller_1.PropertyController().getProperties(req, res));
exports.default = propertyRouter;
