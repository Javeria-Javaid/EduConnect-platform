import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    qualification: { type: String, required: true },
    experience: { type: Number, default: 0 },
    subjects: [{ type: String }],
    bio: { type: String },
    resumeUrl: { type: String }, // For file upload later
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('TeacherProfile', teacherProfileSchema);
