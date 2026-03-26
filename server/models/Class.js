import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    sections: [{
      name: { type: String, required: true },
      roomNumber: { type: String },
      classTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      capacity: { type: Number, default: 30 },
    }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Class', classSchema);
