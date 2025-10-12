import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
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
    pfp: { type: String }
}, {
    versionKey: false
});

export default mongoose.model('UserModel', userSchema, 'users');

