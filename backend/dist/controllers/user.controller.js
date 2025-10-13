"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = __importDefault(require("../models/user"));
class UserController {
    constructor() {
        this.login = (req, res) => {
            let u = req.body.username;
            let p = req.body.password;
            user_1.default.findOne({ username: u, password: p, approved: true }).then((user) => {
                res.json(user);
            }).catch((err) => {
                console.log(err);
                res.json(null);
            });
        };
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let user = req.body;
            let email = req.body.email;
            user_1.default.findOne({ email: email }).then(existing => {
                if (existing) {
                    res.status(400).json('email vec postoji u bazi');
                }
                else {
                    new user_1.default(user).save().then(ok => {
                        res.status(200).json('registered');
                    }).catch((err) => {
                        console.log(err);
                        res.status(500).json('registration failed');
                    });
                }
            }).catch((err) => {
                console.log(err);
                res.status(500).json('email error');
            });
        });
    }
}
exports.UserController = UserController;
