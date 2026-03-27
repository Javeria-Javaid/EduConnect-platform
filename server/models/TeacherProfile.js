import mongoose from 'mongoose';

const teacherProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    employeeId: { type: String, unique: true, sparse: true },
    phone: { type: String },
    address: { type: String },
    joiningDate: { type: Date, default: Date.now },
    qualification: { type: String, required: true },
    experience: { type: Number, default: 0 },
    subjects: [{ type: String }],
    skills: [{ type: String }],
    bio: { type: String },
    resumeUrl: { type: String },
    availability: { type: Boolean, default: true },
    designation: { type: String, default: 'Teacher' },
    salary: { type: Number, default: 0 },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'], default: 'Full-time' },
    status: { type: String, enum: ['Active', 'On Leave', 'Inactive', 'Suspended'], default: 'Active' },
  },
  { timestamps: true }
);

export default mongoose.model('TeacherProfile', teacherProfileSchema);
