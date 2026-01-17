import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, index: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    website: { type: String },
    admissionOpen: { type: Boolean, default: false },
    facilities: [{ type: String }],
    fees: { type: Number }, // Average yearly fee
  },
  { timestamps: true }
);

export default mongoose.model('School', schoolSchema);
