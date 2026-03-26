import mongoose from 'mongoose';

const examResultSchema = new mongoose.Schema({
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    marks: [{
        subject: { type: String, required: true },
        obtained: { type: Number, required: true },
        total: { type: Number, required: true },
        grade: { type: String }
    }],
    totalObtained: { type: Number, default: 0 },
    totalMax: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    overallGrade: { type: String },
    remarks: { type: String }
}, { timestamps: true });

export default mongoose.model('ExamResult', examResultSchema);
