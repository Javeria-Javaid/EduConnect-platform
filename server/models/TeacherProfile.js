import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, unique: true, sparse: true }, // Added for MVP
    phone: { type: String }, // Added for MVP
    address: { type: String }, // Added for MVP
    joiningDate: { type: Date, default: Date.now }, // Added for MVP
    qualification: { type: String, required: true },
    experience: { type: Number, default: 0 },
    subjects: [{ type: String }],
    bio: { type: String },
    resumeUrl: { type: String },
    availability: { type: Boolean, default: true },
    designation: { type: String, default: 'Teacher' },
    classCount: { type: Number, default: 0 },
    weeklyLoad: { type: Number, default: 0 },
    attendance: { type: Number, default: 0 },
    performance: { type: Number, default: 0 },
    salary: { type: Number, default: 0 },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive', 'Suspended'], default: 'Active' },
    photo: { type: String }, // Removed hardcoded default
  },
  { timestamps: true }
);

export default mongoose.model('TeacherProfile', teacherProfileSchema);
