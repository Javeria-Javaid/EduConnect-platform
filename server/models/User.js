import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String }, // Optional: OAuth users won't have a password
    role: { type: String, required: true, enum: ['admin', 'school_admin', 'teacher', 'parent', 'vendor'] },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    // OAuth provider fields
    provider: { type: String, enum: ['local', 'google', 'github'], default: 'local' },
    googleId: { type: String, sparse: true },
    githubId: { type: String, sparse: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
