import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // Made optional for general applications
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }, // Added school ref
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Added teacher ref
    applicantRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicantName: { type: String }, // Made optional, can be derived
    applicantEmail: { type: String }, // Made optional
    resumeUrl: { type: String },
    coverLetter: { type: String }, // Added coverLetter
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);
