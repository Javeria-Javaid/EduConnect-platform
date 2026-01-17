import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'reviewed', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    coverLetter: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Application', applicationSchema);
