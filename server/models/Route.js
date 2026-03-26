import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    stops: [{ type: String }],
    status: { type: String, enum: ['On Time', 'Delayed'], default: 'On Time' }
}, { timestamps: true });

export default mongoose.model('Route', routeSchema);
