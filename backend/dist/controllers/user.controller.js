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
const property_1 = __importDefault(require("../models/property"));
const reservation_1 = __importDefault(require("../models/reservation"));
const burn_book_1 = __importDefault(require("../models/burn-book"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
class UserController {
    constructor() {
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                let password = req.body.password;
                let user = yield user_1.default.findOne({ username: username, active: true, type: { $in: ['owner', 'tourist'] } });
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
        this.adminLogin = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                let password = req.body.password;
                let user = yield user_1.default.findOne({ username: username, active: true, type: 'admin' });
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
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let user = JSON.parse(req.body.user);
                let exists = yield user_1.default.findOne({ username: { $ne: user.username }, email: user.email });
                if (exists) {
                    res.status(400).json('email vec postoji u bazi');
                    return;
                }
                if (req.file) {
                    user.pfp = req.file ? `${req.file.filename}` : 'default.png';
                }
                yield user_1.default.updateOne({ username: user.username }, user);
                let updated = yield user_1.default.findOne({ username: user.username });
                res.status(200).json(updated);
            }
            catch (err) {
                console.log(err);
                res.status(500).json('update neuspesan');
            }
        });
        this.changePassword = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let username = req.body.username;
                let oldPassword = req.body.oldPassword;
                let newPassword = req.body.newPassword;
                let user = yield user_1.default.findOne({ username: username, active: true });
                let correct = yield bcryptjs_1.default.compare(oldPassword, user.password);
                if (!correct) {
                    res.status(401).json('pogresna stara lozinka');
                    return;
                }
                user.password = yield bcryptjs_1.default.hash(newPassword, SALT_ROUNDS);
                yield user.save();
                res.status(200).json('lozinka promenjena');
            }
            catch (err) {
                console.log(err);
                res.status(500).json('greska');
            }
        });
        this.getAllUsers = (req, res) => {
            user_1.default.find({}).then(users => {
                res.status(200).json(users);
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.changeActiveStatus = (req, res) => {
            let user = req.body;
            user_1.default.updateOne({ username: user.username }, { active: !user.active }).then(ok => {
                res.status(200).json('status promenjen');
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.approveUser = (req, res) => {
            let user = req.body;
            user_1.default.updateOne({ username: user.username }, { approved: true }).then(ok => {
                res.status(200).json('korisnik odobren');
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.rejectUser = (req, res) => {
            let user = req.body;
            let banned = {
                username: user.username,
                email: user.email
            };
            new burn_book_1.default(banned).save().then(ok => {
                user_1.default.deleteOne({ username: user.username }).then(ok => {
                    res.status(200).json('korisnik odbijen');
                }).catch(err => {
                    console.log(err);
                    res.status(500).json('greska');
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.getReservationsOwner = (req, res) => {
            let username = req.body.username;
            reservation_1.default.find({ owner: username }).sort({ dateBeg: -1 })
                .then(reservations => {
                res.status(200).json(reservations);
            })
                .catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.getReservationsTourist = (req, res) => {
            let username = req.body.username;
            reservation_1.default.find({ renter: username, approved: true }).sort({ dateBeg: -1 })
                .then(data => {
                res.status(200).json(data);
            })
                .catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.addRating = (req, res) => {
            let reservation = req.body;
            let newComment = {
                user: reservation.renter,
                text: reservation.comment,
                rating: reservation.rating
            };
            reservation_1.default.updateOne({ _id: reservation._id }, { comment: reservation.comment, rating: reservation.rating }).then(ok => {
                property_1.default.updateOne({ name: reservation.propertyName }, { $push: { comments: newComment } }).then(ok => {
                    res.status(200).json('uspesno dodavanje komentara');
                }).catch(err => {
                    console.log(err);
                    res.status(500).json('greska');
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.cancelReservation = (req, res) => {
            let reservation = req.body;
            reservation_1.default.deleteOne({ _id: reservation._id }).then(ok => {
                res.status(200).json('otkazana rezervacija');
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
        this.processReservation = (req, res) => {
            let reservation = req.body;
            reservation_1.default.updateOne({ _id: reservation._id }, { approved: reservation.approved, pending: false, rejectionReason: reservation.rejectionReason }).then(ok => {
                res.status(200).json('obradjena rezervacija');
            }).catch(err => {
                console.log(err);
                res.status(500).json('greska');
            });
        };
    }
}
exports.UserController = UserController;
