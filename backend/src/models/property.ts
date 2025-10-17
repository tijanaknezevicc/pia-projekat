import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true }
}, { _id: false });

const pricingSchema = new mongoose.Schema({
    summer: { type: Number, required: true },
    winter: { type: Number, required: true }
}, { _id: false });

const coordinatesSchema = new mongoose.Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true }
}, { _id: false });

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    owner: { type: String, required: true },
    dateBlocked: { type: Date },
    images: { type: [String], required: true },
    services: { type: String, required: true },
    pricing: { type: pricingSchema, required: true },
    phone: { type: String, required: true },
    comments: { type: [commentSchema], default: [] },
    ratings: { type: [Number], default: [] },
    coordinates: { type: coordinatesSchema, required: true }
}, {
    versionKey: false
});

export default mongoose.model('PropertyModel', propertySchema, 'properties');
