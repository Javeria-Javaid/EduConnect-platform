import User from '../models/User.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import Admission from '../models/Admission.js';
import ExamResult from '../models/ExamResult.js';
import Transaction from '../models/Transaction.js';
import TeacherProfile from '../models/TeacherProfile.js';

function getTargetSchoolId(req) {
  return req.user.role === 'admin' ? (req.query.schoolId || req.user.school) : req.user.school;
}

function monthLabel(date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[date.getMonth()];
}

export const getSchoolReportsOverview = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const [
      totalStudents,
      totalTeachers,
      totalClasses,
      attendanceTodayTotal,
      attendanceTodayPresent,
      enrollThisMonth,
      enrollLastMonth
    ] = await Promise.all([
      User.countDocuments({ school: schoolId, role: 'student' }),
      User.countDocuments({ school: schoolId, role: 'teacher' }),
      Class.countDocuments({ school: schoolId }),
      Attendance.countDocuments({ school: schoolId, date: { $gte: today, $lt: tomorrow } }),
      Attendance.countDocuments({ school: schoolId, date: { $gte: today, $lt: tomorrow }, status: 'Present' }),
      Admission.countDocuments({ school: schoolId, createdAt: { $gte: startOfThisMonth, $lt: startOfNextMonth } }),
      Admission.countDocuments({ school: schoolId, createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth } }),
    ]);

    const attendancePresentPercent =
      attendanceTodayTotal > 0 ? Math.round((attendanceTodayPresent / attendanceTodayTotal) * 100) : null;

    const enrollmentChange =
      enrollLastMonth > 0 ? Math.round(((enrollThisMonth - enrollLastMonth) / enrollLastMonth) * 100) : null;

    // Enrollment trend last 6 months
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const enrollmentTrendAgg = await Admission.aggregate([
      { $match: { school: schoolId, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          students: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const enrollmentTrend = enrollmentTrendAgg.map((item) => ({
      name: monthLabel(new Date(item._id.year, item._id.month - 1, 1)),
      students: item.students
    }));

    // Attendance distribution for today
    const attendanceDistAgg = await Attendance.aggregate([
      { $match: { school: schoolId, date: { $gte: today, $lt: tomorrow } } },
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ]);

    const fillByStatus = {
      Present: '#22c55e',
      Absent: '#ef4444',
      Late: '#f59e0b',
      Leave: '#94a3b8',
    };

    const attendanceDistribution = attendanceDistAgg.map((row) => ({
      name: row._id,
      value: row.value,
      fill: fillByStatus[row._id] || '#94a3b8',
    }));

    // Lightweight recent reports placeholder (generated-on-demand exports not implemented yet)
    const recentReports = [];

    res.json({
      summaryCards: [
        {
          title: 'Total Students',
          value: totalStudents.toLocaleString(),
          change: enrollmentChange === null ? '—' : `${enrollmentChange >= 0 ? '+' : ''}${enrollmentChange}%`,
          trend: enrollmentChange === null ? 'up' : (enrollmentChange >= 0 ? 'up' : 'down'),
        },
        {
          title: 'Active Teachers',
          value: totalTeachers.toLocaleString(),
          change: '—',
          trend: 'up',
        },
        {
          title: 'Classes',
          value: totalClasses.toLocaleString(),
          change: '—',
          trend: 'up',
        },
        {
          title: 'Attendance',
          value: attendancePresentPercent === null ? 'N/A' : `${attendancePresentPercent}%`,
          change: '—',
          trend: 'up',
        },
      ],
      recentReports,
      enrollmentTrend,
      attendanceDistribution,
      attendancePresentPercent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentsReport = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const { class: className, section } = req.query;
    const studentQuery = { school: schoolId, role: 'student' };

    const students = await User.find(studentQuery).select('firstName lastName email createdAt').lean();

    // Attendance % over last 30 days per student (best-effort)
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [attendanceAgg, lastPlacementAgg] = await Promise.all([
      Attendance.aggregate([
      { $match: { school: schoolId, date: { $gte: since } } },
      {
        $group: {
          _id: { student: "$student", status: "$status" },
          count: { $sum: 1 }
        }
      }
      ]),
      Attendance.aggregate([
        { $match: { school: schoolId } },
        { $sort: { date: -1 } },
        {
          $group: {
            _id: "$student",
            class: { $first: "$class" },
            section: { $first: "$section" },
          }
        }
      ])
    ]);

    const attByStudent = new Map();
    for (const row of attendanceAgg) {
      const sid = String(row._id.student);
      const existing = attByStudent.get(sid) || { total: 0, present: 0 };
      existing.total += row.count;
      if (row._id.status === 'Present') existing.present += row.count;
      attByStudent.set(sid, existing);
    }

    const placementByStudent = new Map(lastPlacementAgg.map((r) => [String(r._id), { class: r.class, section: r.section }]));

    const latestExamByStudent = await ExamResult.aggregate([
      { $match: { school: schoolId } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$student", percentage: { $first: "$percentage" } } }
    ]);
    const perfByStudent = new Map(latestExamByStudent.map((r) => {
      const pct = typeof r.percentage === 'number' ? r.percentage : null;
      let label = 'Not Set';
      if (pct !== null) {
        if (pct >= 85) label = 'Excellent';
        else if (pct >= 70) label = 'Good';
        else if (pct >= 55) label = 'Average';
        else label = 'Poor';
      }
      return [String(r._id), label];
    }));

    const table = students.map((s) => {
      const sid = String(s._id);
      const att = attByStudent.get(sid);
      const percent = att && att.total > 0 ? Math.round((att.present / att.total) * 100) : null;
      const placement = placementByStudent.get(sid);
      const perf = perfByStudent.get(sid) || 'Not Set';
      return {
        id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        class: placement?.class ? `${placement.class}${placement.section ? `-${placement.section}` : ''}` : '—',
        performance: perf,
        attendance: percent === null ? '—' : `${percent}%`,
        behavior: '—',
        lastReport: '—',
      };
    });

    let filtered = table;
    if (className) filtered = filtered.filter((r) => r.class?.startsWith(className));
    if (section) filtered = filtered.filter((r) => r.class?.includes(`-${section}`));

    res.json({
      summary: {
        totalStudents: students.length,
      },
      studentReports: filtered,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendanceReport = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const { startDate, endDate, class: className, section } = req.query;

    const match = { school: schoolId };
    if (className) match.class = className;
    if (section) match.section = section;
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    // Daily summary (last 30 days by default)
    const fallbackStart = new Date();
    fallbackStart.setDate(fallbackStart.getDate() - 30);
    if (!match.date) match.date = { $gte: fallbackStart };

    const dailyAgg = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            class: "$class"
          },
          present: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] } },
          total: { $sum: 1 },
        }
      },
      { $sort: { "_id.day": -1 } },
      { $limit: 120 }
    ]);

    const attendanceReports = dailyAgg.map((r) => {
      const pct = r.total > 0 ? Math.round((r.present / r.total) * 100) : 0;
      return {
        date: r._id.day,
        class: r._id.class,
        present: r.present,
        absent: r.absent,
        late: r.late,
        percentage: `${pct}%`,
      };
    });

    res.json({ attendanceReports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTeachersReport = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const { subject, performance } = req.query;

    const profiles = await TeacherProfile.find({})
      .populate({ path: 'user', select: 'firstName lastName school', match: { school: schoolId, role: 'teacher' } })
      .select('subjects weeklyLoad attendance performance updatedAt')
      .lean();

    let rows = profiles
      .filter((p) => p.user)
      .map((p) => {
        const perfLabel =
          p.performance >= 85 ? 'Excellent' : p.performance >= 70 ? 'Good' : p.performance >= 55 ? 'Average' : 'Needs Support';
        return {
          id: p._id,
          name: `${p.user.firstName} ${p.user.lastName}`,
          subject: (p.subjects && p.subjects[0]) || '—',
          workload: `${p.weeklyLoad || 0}h`,
          attendance: `${p.attendance || 0}%`,
          performance: perfLabel,
          lastEvaluation: p.updatedAt ? new Date(p.updatedAt).toISOString().slice(0, 10) : '—',
        };
      });

    if (subject) rows = rows.filter((r) => r.subject === subject);
    if (performance) rows = rows.filter((r) => r.performance === performance);

    res.json({ teacherReports: rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExamsReport = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const { class: className, section } = req.query;
    const match = { school: schoolId };
    if (className) match.class = className;
    if (section) match.section = section;

    const results = await ExamResult.find(match)
      .populate('exam', 'name')
      .select('exam class section percentage overallGrade createdAt')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    // Grade distribution (best-effort from overallGrade)
    const gradeCounts = new Map();
    for (const r of results) {
      const g = r.overallGrade || 'N/A';
      gradeCounts.set(g, (gradeCounts.get(g) || 0) + 1);
    }

    const gradeDistribution = Array.from(gradeCounts.entries()).map(([name, count]) => ({
      name,
      value: count,
      fill: name === 'A+' || name === 'A' ? '#22c55e' : name === 'B' ? '#3b82f6' : name === 'C' ? '#f59e0b' : '#94a3b8',
    }));

    const academicReports = results.map((r) => ({
      exam: r.exam?.name || 'Exam',
      class: r.class,
      subject: 'Overall',
      average: `${Math.round(r.percentage || 0)}%`,
      passRate: `${Math.round(r.percentage || 0)}%`,
    }));

    res.json({ academicReports, gradeDistribution });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFinanceReportForSchool = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const { startDate, endDate, type, status } = req.query;
    const match = { school: schoolId };
    if (type) match.type = type;
    if (status) match.status = status;
    if (startDate || endDate) {
      match.date = {};
      if (startDate) match.date.$gte = new Date(startDate);
      if (endDate) match.date.$lte = new Date(endDate);
    }

    const tx = await Transaction.find(match)
      .select('type category amount status date')
      .sort({ date: -1 })
      .limit(200)
      .lean();

    const financeReports = tx.map((t) => ({
      id: t._id,
      type: t.category || t.type,
      amount: t.amount,
      status: t.status === 'Paid' ? 'Collected' : t.status,
      date: new Date(t.date).toISOString().slice(0, 10),
    }));

    // Revenue sources (income by category)
    const incomeAgg = await Transaction.aggregate([
      { $match: { school: schoolId, type: 'Income' } },
      { $group: { _id: "$category", amount: { $sum: "$amount" } } },
      { $sort: { amount: -1 } },
      { $limit: 8 }
    ]);
    const totalIncome = incomeAgg.reduce((sum, r) => sum + (r.amount || 0), 0) || 1;
    const palette = ['#3AC47D', '#2A6EF2', '#F59E0B', '#6366F1', '#ef4444', '#14b8a6', '#a855f7', '#64748b'];
    const revenueData = incomeAgg.map((r, idx) => ({
      name: r._id || 'Other',
      value: Math.round((r.amount / totalIncome) * 100),
      color: palette[idx % palette.length]
    }));

    res.json({ financeReports, revenueData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdmissionsReportForSchool = async (req, res) => {
  try {
    const schoolId = getTargetSchoolId(req);
    if (!schoolId) return res.status(400).json({ message: 'School ID is required' });

    const { startDate, endDate, status } = req.query;
    const match = { school: schoolId };
    if (status) match.status = status;
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const statusAgg = await Admission.aggregate([
      { $match: match },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const byStatus = statusAgg.reduce((acc, r) => {
      acc[r._id] = r.count;
      return acc;
    }, {});

    res.json({ statusCounts: byStatus });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

