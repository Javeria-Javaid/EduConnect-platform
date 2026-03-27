import mongoose from 'mongoose';

const vendorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    businessName: { type: String, required: true },
    category: { type: String, required: true },
    taxId: { type: String },
    bankAccount: { type: String },
    bankName: { type: String },
    isVerified: { type: Boolean, default: false },
    bio: { type: String },
    website: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('VendorProfile', vendorProfileSchema);
