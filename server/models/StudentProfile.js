import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    admissionNumber: { type: String, required: true, unique: true },
    rollNumber: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    parentName: { type: String, required: true },
    parentPhone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    feeStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    attendance: { type: Number, default: 0 },
    performance: { type: Number, default: 0 },
    photo: { type: String, default: 'https://images.unsplash.com/photo-1544717297-fa154da09f9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80' },
  },
  { timestamps: true }
);

export default mongoose.model('StudentProfile', studentProfileSchema);
