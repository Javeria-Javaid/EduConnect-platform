import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicantRef: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    resumeUrl: { type: String },
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
