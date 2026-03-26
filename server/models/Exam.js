import mongoose from 'mongoose';

const examSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    name: { type: String, required: true }, // e.g. "Mid Term 2024"
    term: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    classes: [{ type: String }], // e.g. ["Grade 10", "Grade 9"]
    status: { type: String, enum: ['Scheduled', 'Active', 'Completed'], default: 'Scheduled' }
}, { timestamps: true });

export default mongoose.model('Exam', examSchema);
