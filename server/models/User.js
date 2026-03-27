import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'school_admin', 'teacher', 'parent', 'student', 'vendor'],
    required: true
  },
  school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
  provider: { type: String, default: 'local' },
  googleId: { type: String },
  githubId: { type: String },

  // Personal Info
  phone: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  profilePhoto: { type: String },

  // Account Status
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: Date.now },

  // Preferences
  language: { type: String, default: 'English' },
  timezone: { type: String, default: 'PKT (UTC+5)' },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },

  // Notifications
  notifyEmail: { type: Boolean, default: true },
  notifySMS: { type: Boolean, default: false },
  notifyPush: { type: Boolean, default: true },
  notifyMarketing: { type: Boolean, default: false },
  notifySecurity: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
