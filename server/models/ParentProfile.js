import mongoose from 'mongoose';

const parentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  { timestamps: true }
);

export default mongoose.model('ParentProfile', parentProfileSchema);
