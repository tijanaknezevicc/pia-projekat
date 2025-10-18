"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    user: { type: String, required: true },
    rating: { type: Number, required: true },
    text: { type: String, default: '' }
}, { _id: false });
const pricingSchema = new mongoose_1.default.Schema({
    summer: { type: Number, required: true },
    winter: { type: Number, required: true }
}, { _id: false });
const coordinatesSchema = new mongoose_1.default.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
}, { _id: false });
const propertySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    owner: { type: String, required: true },
    dateBlocked: { type: Date },
    images: { type: [String], required: true },
    services: { type: String, required: true },
    pricing: { type: pricingSchema, required: true },
    phone: { type: String, required: true },
    comments: { type: [commentSchema], default: [] },
    coordinates: { type: coordinatesSchema, required: true }
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('PropertyModel', propertySchema, 'properties');
