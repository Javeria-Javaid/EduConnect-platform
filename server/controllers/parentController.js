import ParentProfile from '../models/ParentProfile.js';
import StudentProfile from '../models/StudentProfile.js';
import ExamResult from '../models/ExamResult.js';
import Timetable from '../models/Timetable.js';
import Attendance from '../models/Attendance.js';
import Transaction from '../models/Transaction.js';

export const getParentStats = async (req, res) => {
  try {
    const parentProfile = await ParentProfile.findOne({ user: req.user._id }).populate('children');
    
    if (!parentProfile || parentProfile.children.length === 0) {
        return res.json({
            attendance: '0%',
            pendingHomework: 0,
            upcomingExams: 0,
            feeStatus: 'N/A'
        });
    }

    // Just take the first child for stats for now
    const child = parentProfile.children[0];
    const childUserId = child.user;

    const recentAttendance = await Attendance.find({ student: childUserId }).sort({ date: -1 }).limit(30).lean();
    const presentCount = recentAttendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
    const attendanceRate = recentAttendance.length > 0 ? ((presentCount / recentAttendance.length) * 100).toFixed(1) : '0.0';

    // Upcoming exams (best-effort): based on timetable/exams models being school-wide; keep 0 if not implemented
    const upcomingExams = await ExamResult.countDocuments({ student: childUserId }); // placeholder signal of exams existence
    
    res.json({
      attendance: `${attendanceRate}%`,
      pendingHomework: 0,
      upcomingExams: upcomingExams > 0 ? 1 : 0,
      feeStatus: child.feeStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChildren = async (req, res) => {
    try {
        const parentProfile = await ParentProfile.findOne({ user: req.user._id }).populate({
            path: 'children',
            populate: { path: 'user', select: 'firstName lastName' }
        });
        res.json(parentProfile ? parentProfile.children : []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const linkChild = async (req, res) => {
    try {
        const { admissionNumber } = req.body;
        const student = await StudentProfile.findOne({ admissionNumber });
        
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Ensure parent user is scoped to the child's school (required for school-scoped messaging/routes)
        if (!req.user.school) {
            const User = (await import('../models/User.js')).default;
            await User.findByIdAndUpdate(req.user._id, { school: student.school });
            req.user.school = student.school;
        }

        let parentProfile = await ParentProfile.findOne({ user: req.user._id });
        if (!parentProfile) {
            parentProfile = new ParentProfile({ user: req.user._id, children: [] });
        }

        if (parentProfile.children.includes(student._id)) {
            return res.status(400).json({ message: 'Child already linked' });
        }

        parentProfile.children.push(student._id);
        await parentProfile.save();
        
        res.json({ message: 'Child linked successfully', child: student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getDashboardData = async (req, res) => {
    try {
        const parentProfile = await ParentProfile.findOne({ user: req.user._id }).populate({
            path: 'children',
            populate: { path: 'user', select: 'firstName lastName email' }
        });
        
        if (!parentProfile || parentProfile.children.length === 0) {
            return res.json({ children: [], activeChildData: null });
        }

        const childProfileId = req.query.childId || parentProfile.children[0]._id;
        const child = await StudentProfile.findById(childProfileId).populate('user', 'firstName lastName email');
        
        if (!child) return res.status(404).json({ message: 'Child not found' });
        const childUserId = child.user?._id || child.user;

        // Fetch Exam Results
        const examResults = await ExamResult.find({ student: childUserId }).populate('exam', 'name startDate endDate');
        
        // Fetch Attendance
        const attendance = await Attendance.find({ student: childUserId }).sort({ date: -1 }).limit(30);
        const presentCount = attendance.filter(a => a.status === 'Present').length;
        const absentCount = attendance.filter(a => a.status === 'Absent').length;
        const attendanceRate = attendance.length > 0 ? ((presentCount / attendance.length) * 100).toFixed(1) : 0;

        // Fetch Timetable
        const timetables = await Timetable.find({ class: child.currentClass, section: child.section, school: child.school });

        // Fetch Fees
        const transactions = await Transaction.find({ student: childUserId }).sort({ date: -1 });

        res.json({
            children: parentProfile.children,
            activeChildData: {
                profile: child,
                examResults,
                attendanceRecords: attendance,
                attendanceStats: { presentCount, absentCount, attendanceRate },
                timetables,
                transactions
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
