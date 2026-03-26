import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';

export const getExams = async (req, res) => {
    try {
        const exams = await Exam.find({ school: req.user.school }).sort({ startDate: -1 });
        res.json(exams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createExam = async (req, res) => {
    try {
        const exam = new Exam({ ...req.body, school: req.user.school });
        await exam.save();
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findOneAndUpdate(
            { _id: req.params.id, school: req.user.school }, 
            req.body, 
            { new: true }
        );
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findOneAndDelete({ _id: req.params.id, school: req.user.school });
        if (!exam) return res.status(404).json({ message: 'Exam not found' });
        await ExamResult.deleteMany({ exam: req.params.id });
        res.json({ message: 'Exam deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getExamStats = async (req, res) => {
    try {
        const school = req.user.school;
        const [upcoming, active, completed] = await Promise.all([
            Exam.countDocuments({ school, status: 'Scheduled' }),
            Exam.countDocuments({ school, status: 'Active' }),
            Exam.countDocuments({ school, status: 'Completed' })
        ]);

        res.json({ upcomingCount: upcoming, activeCount: active, completedCount: completed, pendingResults: active, topClass: 'N/A', lowClass: 'N/A' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const saveMarks = async (req, res) => {
    try {
        const { marksData } = req.body;
        // marksData: [{ student: id, class: name, section: name, marks: [{ subject, obtained, total }] }]
        const examId = req.params.id;
        const schoolId = req.user.school;

        const results = await Promise.all(marksData.map(async (data) => {
            const totalMax = data.marks.reduce((sum, m) => sum + m.total, 0);
            const totalObtained = data.marks.reduce((sum, m) => sum + m.obtained, 0);
            const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
            return await ExamResult.findOneAndUpdate(
                { exam: examId, student: data.student },
                {
                    exam: examId,
                    school: schoolId,
                    student: data.student,
                    class: data.class,
                    section: data.section,
                    marks: data.marks,
                    totalObtained,
                    totalMax,
                    percentage
                },
                { upsert: true, new: true }
            );
        }));

        res.json({ message: 'Marks saved successfully', results });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
