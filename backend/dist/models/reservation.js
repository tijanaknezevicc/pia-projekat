"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const guestsSchema = new mongoose_1.default.Schema({
    adults: { type: Number, required: true },
    children: { type: Number, required: true, default: 0 },
    text: { type: String, default: '' }
}, { _id: false });
const reservationSchema = new mongoose_1.default.Schema({
    dateBeg: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    dateReserved: { type: Date, default: Date.now },
    propertyName: { type: String, required: true },
    propertyLocation: { type: String, required: true },
    owner: { type: String, required: true },
    renter: { type: String, required: true },
    guests: { type: guestsSchema, required: true },
    requests: { type: String, maxlength: 500 },
    approved: { type: Boolean, default: false },
    pending: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, default: "" },
    rejectionReason: { type: String, default: "" }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('ReservationModel', reservationSchema, 'reservations');
