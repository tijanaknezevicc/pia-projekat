"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ['owner', 'tourist'], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, enum: ['M', 'F', 'O'], required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    payment: { type: String, required: true },
    pfp: { type: String },
    approved: { type: Boolean }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('UserModel', userSchema, 'users');
