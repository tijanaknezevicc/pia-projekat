"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const burnBookSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('BurnBookModel', burnBookSchema, 'burn-book');
