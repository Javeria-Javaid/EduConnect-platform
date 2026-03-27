import mongoose from 'mongoose';

const parentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Linked to Student Users
    occupation: { type: String },
    relationshipToStudent: { type: String, enum: ['Father', 'Mother', 'Guardian', 'Other'] },
    emergencyContact: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('ParentProfile', parentProfileSchema);
