import Timetable from '../models/Timetable.js';

export const getTimetables = async (req, res) => {
    try {
        const timetables = await Timetable.find({ school: req.user.school }).populate('periods.teacher', 'firstName lastName');
        res.json(timetables);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveTimetable = async (req, res) => {
    try {
        const { class: className, section, day, periods } = req.body;
        const schoolId = req.user.school;

        const timetable = await Timetable.findOneAndUpdate(
            { school: schoolId, class: className, section, day },
            { periods },
            { upsert: true, new: true }
        ).populate('periods.teacher', 'firstName lastName');

        res.json(timetable);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTimetable = async (req, res) => {
    try {
        await Timetable.findByIdAndDelete(req.params.id);
        res.json({ message: 'Timetable deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
