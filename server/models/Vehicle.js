import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    number: { type: String, required: true },
    type: { type: String, required: true }, // e.g. Bus, Van
    capacity: { type: Number, required: true },
    driver: { type: String, required: true },
    status: { type: String, enum: ['Active', 'In Maintenance', 'Out of Service'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Vehicle', vehicleSchema);
