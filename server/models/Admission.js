import mongoose from 'mongoose';

const admissionSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true },
    grade: { type: String, required: true },
    parentName: { type: String, required: true },
    parentEmail: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['Pending', 'Accepted', 'Rejected', 'On Hold'], 
      default: 'Pending' 
    },
    documents: [{ type: String }],
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School' },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('Admission', admissionSchema);
