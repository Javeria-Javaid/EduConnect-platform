import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    day: { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    periods: [{
        subject: { type: String, required: true },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        room: { type: String }
    }]
}, { timestamps: true });

// Ensure unique timetable per class, section, and day
timetableSchema.index({ school: 1, class: 1, section: 1, day: 1 }, { unique: true });

export default mongoose.model('Timetable', timetableSchema);
