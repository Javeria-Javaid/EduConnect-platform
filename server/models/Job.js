import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    type: { type: String, required: true, enum: ['Full-time', 'Part-time', 'Contract', 'Temporary'] },
    description: { type: String },
    status: { type: String, required: true, enum: ['Active', 'Closed', 'Draft'], default: 'Active' },
    applicants: { type: Number, default: 0 },
    posted: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Job', jobSchema);
