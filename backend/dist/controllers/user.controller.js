"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
class UserController {
    constructor() {
        this.login = (req, res) => {
            let u = req.body.kor_ime;
            let p = req.body.lozinka;
            user_1.default.findOne({ kor_ime: u, lozinka: p }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
                res.json(null);
            });
        };
    }
}
exports.UserController = UserController;
