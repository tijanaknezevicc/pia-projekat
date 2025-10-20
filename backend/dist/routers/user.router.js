"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
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
const userRouter = express_1.default.Router();
userRouter.route('/login').post((req, res) => new user_controller_1.UserController().login(req, res));
userRouter.route('/admin-login').post((req, res) => new user_controller_1.UserController().adminLogin(req, res));
userRouter.route('/register').post(upload.single('pfp'), (req, res) => new user_controller_1.UserController().register(req, res));
userRouter.route('/updateUser').post(upload.single('pfp'), (req, res) => new user_controller_1.UserController().updateUser(req, res));
userRouter.route('/change-password').post((req, res) => new user_controller_1.UserController().changePassword(req, res));
userRouter.route('/get-reservations-owner').post((req, res) => new user_controller_1.UserController().getReservationsOwner(req, res));
userRouter.route('/get-reservations-tourist').post((req, res) => new user_controller_1.UserController().getReservationsTourist(req, res));
userRouter.route('/process-reservation').post((req, res) => new user_controller_1.UserController().processReservation(req, res));
userRouter.route('/cancel-reservation').post((req, res) => new user_controller_1.UserController().cancelReservation(req, res));
userRouter.route('/add-rating').post((req, res) => new user_controller_1.UserController().addRating(req, res));
exports.default = userRouter;
