import mongoose from 'mongoose';

const homeworkSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'TeacherProfile', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: Date, required: true },
    maxMarks: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Closed'], default: 'Active' },
    submissions: [{
        student: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' },
        submittedAt: { type: Date },
        marks: { type: Number },
        feedback: { type: String },
        status: { type: String, enum: ['Pending', 'Submitted', 'Graded'], default: 'Pending' }
    }]
}, { timestamps: true });

export default mongoose.model('Homework', homeworkSchema);
