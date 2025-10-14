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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                let password = req.body.password;
                let user = yield user_1.default.findOne({ username: username, active: true });
                if (!user) {
                    res.status(404).json(null);
                }
                else {
                    let correct = yield bcryptjs_1.default.compare(password, user.password);
                    if (!correct) {
                        res.status(401).json('pogresna lozinka');
                    }
                    else {
                        res.status(200).json(user);
                    }
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json('greska');
            }
        });
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = JSON.parse(req.body.user);
                let exists = yield user_1.default.findOne({ email: user.email });
                if (exists) {
                    res.status(400).json('email vec postoji u bazi');
                }
                else {
                    user.password = yield bcryptjs_1.default.hash(user.password, SALT_ROUNDS);
                    user.pfp = req.file ? `${req.file.filename}` : 'default.png';
                    yield new user_1.default(user).save();
                    res.status(200).json('registracija uspesna');
                }
            }
            catch (err) {
                console.log(err);
                res.status(500).json('registracija neuspesna');
            }
        });
    }
}
exports.UserController = UserController;
