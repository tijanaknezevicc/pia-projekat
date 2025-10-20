import mongoose from "mongoose";

const burnBookSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true }
}, {
    versionKey: false
});

export default mongoose.model('BurnBookModel', burnBookSchema, 'burn-book');