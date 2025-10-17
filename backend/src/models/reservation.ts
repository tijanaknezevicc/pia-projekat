import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    dateBeg: { type: Date, required: true },
    dateEnd: { type: Date, required: true },
    dateReserved: { type: Date, default: Date.now },
    propertyName: { type: String, required: true },
    propertyLocation: { type: String, required: true },
    owner: { type: String, required: true },
    renter: { type: String, required: true },
    adults: { type: Number, required: true },
    children: { type: Number, required: true },
    requests: { type: String, maxlength: 500 },
    approved: { type: Boolean, default: false },
    pending: { type: Boolean, default: true },
    rating: { type: Number, default: 0 },
    comment: { type: String, default: "" },  
    rejectionReason: { type: String, default: "" } 
}, {
    versionKey: false
});

export default mongoose.model('ReservationModel', reservationSchema, 'reservations');
