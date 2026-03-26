import Homework from '../models/Homework.js';

export const getHomeworks = async (req, res) => {
    try {
        const homeworks = await Homework.find({ school: req.user.school, teacher: req.user._id }).sort({ createdAt: -1 });
        res.json(homeworks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createHomework = async (req, res) => {
    try {
        const newHomework = new Homework({
            ...req.body,
            school: req.user.school,
            teacher: req.user._id
        });
        await newHomework.save();
        res.status(201).json(newHomework);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateHomework = async (req, res) => {
    try {
        const homework = await Homework.findOneAndUpdate(
            { _id: req.params.id, school: req.user.school },
            req.body,
            { new: true }
        );
        if (!homework) return res.status(404).json({ message: 'Homework not found' });
        res.json(homework);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteHomework = async (req, res) => {
    try {
        const homework = await Homework.findOneAndDelete({ _id: req.params.id, school: req.user.school });
        if (!homework) return res.status(404).json({ message: 'Homework not found' });
        res.json({ message: 'Homework deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const gradeSubmission = async (req, res) => {
    try {
        const { marks, feedback, studentId } = req.body;
        const homework = await Homework.findOneAndUpdate(
            { _id: req.params.id, 'submissions.student': studentId },
            { $set: { 'submissions.$.marks': marks, 'submissions.$.feedback': feedback, 'submissions.$.status': 'Graded' } },
            { new: true }
        );
        res.json(homework);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
