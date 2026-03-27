import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

import Attendance from '../models/Attendance.js';
import Transaction from '../models/Transaction.js';
import ExamResult from '../models/ExamResult.js';
import Class from '../models/Class.js';

export const getStudents = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { 
        page = 1, 
        limit = 10, 
        search, 
        searchBy = 'Name', 
        class: className, 
        section,
        feeStatus,
        attendanceRange,
        performanceRange
    } = req.query;

    let query = { school: schoolId };

    // Teacher scoping: restrict to only the teacher's assigned class/sections
    if (req.user.role === 'teacher') {
        const classes = await Class.find({ school: schoolId, 'sections.classTeacher': req.user._id }).lean();
        const allowedPairs = [];
        classes.forEach((c) => {
            (c.sections || []).forEach((s) => {
                if (s.classTeacher && s.classTeacher.toString() === req.user._id.toString()) {
                    allowedPairs.push({ class: c.name, section: s.name });
                }
            });
        });
        if (allowedPairs.length === 0) {
            return res.json({ data: [], total: 0, page: parseInt(page) || 1, totalPages: 0 });
        }
        query.$or = allowedPairs;
    }

    if (className) {
        const classes = className.split(',');
        query.class = classes.length > 1 ? { $in: classes } : className;
    }
    if (section) {
        const sections = section.split(',');
        query.section = sections.length > 1 ? { $in: sections } : section;
    }

    if (search) {
        if (searchBy === 'Parent Name') query.parentName = { $regex: search, $options: 'i' };
        if (searchBy === 'Admission Number') query.admissionNumber = { $regex: search, $options: 'i' };
    }

    let students = await StudentProfile.find(query).populate('user', 'firstName lastName email role');

    // Name search must be handled after populate
    if (search && searchBy === 'Name') {
        const lowerSearch = search.toLowerCase();
        students = students.filter(s => {
            const name = `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.toLowerCase();
            return name.includes(lowerSearch);
        });
    }

    // Resolve stats for each student
    let formattedStudents = await Promise.all(students.map(async (s) => {
        // Attendance
        const attRecords = await Attendance.find({ student: s.user?._id });
        let attendance = 'N/A';
        if (attRecords.length > 0) {
            const present = attRecords.filter(r => r.status === 'Present' || r.status === 'Late').length;
            attendance = Math.round((present / attRecords.length) * 100);
        }

        // Fee Status
        const tx = await Transaction.findOne({ student: s.user?._id, type: 'Income' }).sort({ date: -1 });
        let resolvedFeeStatus = 'Not Set';
        if (tx) {
            if (tx.status === 'Paid') resolvedFeeStatus = 'Paid';
            else if (tx.status === 'Pending') resolvedFeeStatus = 'Pending';
            else if (tx.status === 'Failed') resolvedFeeStatus = 'Overdue';
        }

        // Performance
        const exams = await ExamResult.find({ student: s.user?._id });
        let performance = 0;
        if (exams.length > 0) {
            const avg = exams.reduce((acc, curr) => acc + curr.percentage, 0) / exams.length;
            if (avg >= 90) performance = 5;
            else if (avg >= 75) performance = 4;
            else if (avg >= 60) performance = 3;
            else if (avg >= 45) performance = 2;
            else performance = 1;
        }

        return {
            _id: s._id,
            userId: s.user?._id,
            name: `${s.user?.firstName || ''} ${s.user?.lastName || ''}`.trim(),
            email: s.user?.email,
            admissionNumber: s.admissionNumber,
            rollNumber: s.rollNumber,
            class: s.class,
            section: s.section,
            parentName: s.parentName,
            parentPhone: s.parentPhone,
            gender: s.gender,
            feeStatus: resolvedFeeStatus,
            attendance,
            performance,
            photo: s.photo,
        };
    }));

    // Apply remaining filters
    if (feeStatus) {
        const statuses = feeStatus.split(',');
        formattedStudents = formattedStudents.filter(s => statuses.includes(s.feeStatus));
    }

    if (attendanceRange) {
        if (attendanceRange === 'Below 50%') formattedStudents = formattedStudents.filter(s => s.attendance !== 'N/A' && s.attendance < 50);
        if (attendanceRange === '50-75%') formattedStudents = formattedStudents.filter(s => s.attendance >= 50 && s.attendance <= 75);
        if (attendanceRange === 'Above 75%') formattedStudents = formattedStudents.filter(s => s.attendance > 75);
    }

    if (performanceRange) {
        const stars = parseInt(performanceRange);
        if (!isNaN(stars)) {
            formattedStudents = formattedStudents.filter(s => s.performance === stars);
        }
    }

    // Server-side Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const total = formattedStudents.length;
    
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = pageNum * limitNum;
    const paginated = formattedStudents.slice(startIndex, endIndex);

    res.json({
        data: paginated,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, admissionNumber, rollNumber, class: className, section, parentName, parentPhone, gender } = req.body;
    const schoolId = req.user.school;

    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: 'User with this email already exists' });
    }

    // 2. Create User
    user = new User({
      firstName,
      lastName,
      email,
      role: 'student',
      school: schoolId,
      passwordHash: 'temporaryPasswordHash' // In real app, send email with set password link
    });
    await user.save();

    // 3. Create Student Profile
    const studentProfile = new StudentProfile({
      user: user._id,
      school: schoolId,
      admissionNumber,
      rollNumber,
      class: className,
      section,
      parentName,
      parentPhone,
      gender
    });
    await studentProfile.save();

    res.status(201).json({ message: 'Student created successfully', student: studentProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { firstName, lastName, email, admissionNumber, rollNumber, class: className, section, parentName, parentPhone, gender, feeStatus, attendance, performance } = req.body;
    const studentProfile = await StudentProfile.findById(req.params.id).populate('user');
    
    if (!studentProfile) {
        return res.status(404).json({ message: 'Student not found' });
    }

    // Update User
    if (studentProfile.user) {
        const user = await User.findById(studentProfile.user._id);
        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.email = email || user.email;
            await user.save();
        }
    }

    // Update Profile
    studentProfile.admissionNumber = admissionNumber || studentProfile.admissionNumber;
    studentProfile.rollNumber = rollNumber || studentProfile.rollNumber;
    studentProfile.class = className || studentProfile.class;
    studentProfile.section = section || studentProfile.section;
    studentProfile.parentName = parentName || studentProfile.parentName;
    studentProfile.parentPhone = parentPhone || studentProfile.parentPhone;
    studentProfile.gender = gender || studentProfile.gender;
    studentProfile.feeStatus = feeStatus || studentProfile.feeStatus;
    studentProfile.attendance = attendance !== undefined ? attendance : studentProfile.attendance;
    studentProfile.performance = performance !== undefined ? performance : studentProfile.performance;

    await studentProfile.save();
    res.json({ message: 'Student updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const studentProfile = await StudentProfile.findById(req.params.id);
    if (!studentProfile) {
        return res.status(404).json({ message: 'Student not found' });
    }

    // Delete User and Profile
    await User.findByIdAndDelete(studentProfile.user);
    await studentProfile.deleteOne();

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
