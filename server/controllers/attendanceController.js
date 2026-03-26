import Attendance from '../models/Attendance.js';
import StudentProfile from '../models/StudentProfile.js';
import Class from '../models/Class.js';

export const markAttendance = async (req, res) => {
  try {
    const { attendanceRecords, date, class: className, section } = req.body;
    const schoolId = req.user.school;

    const savedRecords = await Promise.all(attendanceRecords.map(async (record) => {
        return await Attendance.findOneAndUpdate(
            { student: record.studentId, date: new Date(date) },
            { 
                school: schoolId,
                student: record.studentId,
                date: new Date(date),
                status: record.status,
                class: className,
                section: section,
                remark: record.remark
            },
            { upsert: true, new: true }
        );
    }));

    res.json({ message: 'Attendance marked successfully', records: savedRecords });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceStats = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0,0,0,0);

    const totalStudents = await StudentProfile.countDocuments({ school: schoolId });
    
    const todayRecords = await Attendance.find({ 
        school: schoolId, 
        date: { $gte: date, $lt: new Date(date.getTime() + 24*60*60*1000) } 
    });

    const totalPresent = todayRecords.filter(r => r.status === 'Present').length;
    const totalAbsent = todayRecords.filter(r => r.status === 'Absent').length;
    const totalLeave = todayRecords.filter(r => r.status === 'Leave').length;
    const totalLate = todayRecords.filter(r => r.status === 'Late').length;

    const todayAttendance = totalStudents > 0 ? Math.round(((totalPresent + totalLate) / totalStudents) * 100) : 0;

    // Class wise attendance calculation
    const classes = await Class.find({ school: schoolId }).populate('sections.classTeacher');
    const classAttendance = [];
    let missing = 0;
    const pendingActions = [];

    classes.forEach(c => {
        c.sections.forEach(s => {
            const secRecords = todayRecords.filter(r => r.class === c.name && r.section === s.name);
            if (secRecords.length === 0) {
                missing++;
                if (s.classTeacher) {
                    pendingActions.push({
                        teacher: s.classTeacher.firstName + ' ' + s.classTeacher.lastName,
                        class: c.name,
                        section: s.name
                    });
                }
            } else {
                const secPresent = secRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
                const secAbsent = secRecords.filter(r => r.status === 'Absent').length;
                const secLeave = secRecords.filter(r => r.status === 'Leave').length;
                classAttendance.push({
                    class: `${c.name}-${s.name}`,
                    present: secPresent,
                    absent: secAbsent,
                    leave: secLeave,
                    attendance: secRecords.length > 0 ? Math.round((secPresent / secRecords.length) * 100) : 0
                });
            }
        });
    });

    res.json({
      todayAttendance,
      totalPresent,
      totalAbsent,
      totalLeave,
      totalLate,
      missingSubmissions: missing,
      irregularStudents: 0,
      classAttendance,
      missing,
      irregular: 0,
      pendingActions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
