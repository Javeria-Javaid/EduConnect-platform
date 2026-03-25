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
    designation: { type: String, default: 'Teacher' },
    classCount: { type: Number, default: 0 },
    weeklyLoad: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive'], default: 'Active' },
    photo: { type: String, default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
  },
  { timestamps: true }
);

export default mongoose.model('TeacherProfile', teacherProfileSchema);
