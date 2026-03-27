import TeacherProfile from '../models/TeacherProfile.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';

export const getTeacherStats = async (req, res) => {
    try {
        const schoolId = req.user.school;
        
        const users = await User.find({ school: schoolId, role: 'teacher' }).select('_id');
        const userIds = users.map(u => u._id);

        const totalTeachers = await TeacherProfile.countDocuments({ user: { $in: userIds } });
        const activeTeachers = await TeacherProfile.countDocuments({ user: { $in: userIds }, status: 'Active' });
        const onLeaveTeachers = await TeacherProfile.countDocuments({ user: { $in: userIds }, status: 'On Leave' });
        
        res.json({
            totalTeachers,
            activeTeachers,
            onLeaveTeachers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTeachers = async (req, res) => {
    try {
        const schoolId = req.user.school;
        const { 
            search, searchBy, subjects, classes, 
            status, employmentType, attendanceRange, performanceRange,
            page = 1, limit = 10 
        } = req.query;

        const users = await User.find({ school: schoolId, role: 'teacher' }).select('_id firstName lastName email');
        const userIds = users.map(u => u._id);

        let query = { user: { $in: userIds } };

        if (status) query.status = status;
        if (employmentType) query.employmentType = employmentType;
        if (subjects) {
            const subjectList = subjects.split(',');
            query.subjects = { $in: subjectList };
        }

        const teachers = await TeacherProfile.find(query).populate('user', 'firstName lastName email').lean();
        
        // Fetch all classes for this school once to map class assignments
        const allClasses = await Class.find({ school: schoolId }).lean();
        
        let formattedTeachers = await Promise.all(teachers.map(async (t) => {
            if (!t.user) return null;

            // Find all classes where this teacher is assigned to any section
            let assignedClasses = [];
            allClasses.forEach(cls => {
                if (cls.sections && cls.sections.some(sec => sec.classTeacher?.toString() === t.user._id.toString())) {
                    assignedClasses.push(cls.name);
                }
            });
            // Deduplicate class names
            assignedClasses = [...new Set(assignedClasses)];

            // Calculate exact attendance %
            const attendances = await Attendance.find({ 
                school: schoolId, 
                student: t.user._id // Notice: Using student field as generic user ref for attendance
            });
            
            let attendancePercent = 'N/A';
            if (attendances.length > 0) {
                const totalDays = attendances.length;
                const presentDays = attendances.filter(a => a.status === 'Present' || a.status === 'Late').length;
                attendancePercent = Math.round((presentDays / totalDays) * 100);
            }

            return {
                _id: t._id,
                userId: t.user._id,
                name: `${t.user.firstName} ${t.user.lastName}`,
                email: t.user.email,
                employeeId: t.employeeId || 'N/A',
                phone: t.phone || 'N/A',
                address: t.address || 'N/A',
                joiningDate: t.joiningDate,
                subjects: t.subjects || [],
                classesAssigned: assignedClasses,
                qualification: t.qualification,
                experience: t.experience,
                designation: t.designation,
                weeklyLoad: t.weeklyLoad,
                attendance: attendancePercent,
                performance: t.performance || 0,
                salary: t.salary || 0,
                employmentType: t.employmentType,
                status: t.status,
                photo: t.photo || null,
            };
        }));

        // Remove any nulls (if a TeacherProfile lacked a User link)
        formattedTeachers = formattedTeachers.filter(t => t !== null);

        // Apply in-memory search across virtuals
        if (search) {
            const s = search.toLowerCase();
            formattedTeachers = formattedTeachers.filter(t => {
                if (searchBy === 'Name' || !searchBy) return t.name.toLowerCase().includes(s);
                if (searchBy === 'Email') return t.email.toLowerCase().includes(s);
                if (searchBy === 'Subject') return t.subjects.some(sub => sub.toLowerCase().includes(s));
                if (searchBy === 'Employee ID') return (t.employeeId && t.employeeId.toLowerCase().includes(s));
                return false;
            });
        }

        // Apply in-memory custom filters
        // ... (rest of filtering logic)
        if (classes) {
            const classFilters = classes.split(',');
            formattedTeachers = formattedTeachers.filter(t => 
                t.classesAssigned.some(c => classFilters.includes(c))
            );
        }

        if (attendanceRange) {
            formattedTeachers = formattedTeachers.filter(t => {
                if (t.attendance === 'N/A') return false;
                if (attendanceRange === 'Below 50%') return t.attendance < 50;
                if (attendanceRange === '50-75%') return t.attendance >= 50 && t.attendance <= 75;
                if (attendanceRange === 'Above 75%') return t.attendance > 75;
                return true;
            });
        }

        if (performanceRange) {
            formattedTeachers = formattedTeachers.filter(t => {
                if (t.performance === 0 || !t.performance) return false;
                return t.performance === Number(performanceRange);
            });
        }

        // Apply Pagination
        const total = formattedTeachers.length;
        const p = parseInt(page);
        const l = parseInt(limit);
        const startIndex = (p - 1) * l;
        const endIndex = p * l;
        
        const paginatedData = formattedTeachers.slice(startIndex, endIndex);

        res.json({
            data: paginatedData,
            total,
            page: p,
            totalPages: Math.ceil(total / l)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const { firstName, lastName, email, qualification, experience, subjects, designation, employmentType, salary, status, employeeId, phone, address, joiningDate } = req.body;
        const schoolId = req.user.school;

        if (!firstName || !lastName || !email || !qualification) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'A user with this email already exists' });

        user = new User({
            firstName,
            lastName,
            email,
            role: 'teacher',
            school: schoolId,
            passwordHash: 'tempPassword123'
        });
        await user.save();

        const teacherProfile = new TeacherProfile({
            user: user._id,
            qualification,
            experience: Number(experience) || 0,
            subjects: subjects || [],
            designation: designation || 'Teacher',
            employmentType: employmentType || 'Full-time',
            salary: Number(salary) || 0,
            status: status || 'Active',
            employeeId,
            phone,
            address,
            joiningDate: joiningDate || Date.now()
        });
        await teacherProfile.save();

        res.status(201).json({ message: 'Teacher created', teacher: teacherProfile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { firstName, lastName, email, qualification, experience, subjects, designation, employmentType, status, attendance, classCount, weeklyLoad, performance, salary, employeeId, phone, address, joiningDate } = req.body;
        const teacherProfile = await TeacherProfile.findById(req.params.id).populate('user');
        
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher not found' });

        if (teacherProfile.user) {
            const user = await User.findById(teacherProfile.user._id);
            if (user) {
                user.firstName = firstName || user.firstName;
                user.lastName = lastName || user.lastName;
                
                if (email && email !== user.email) {
                    const existingUser = await User.findOne({ email });
                    if (existingUser) return res.status(400).json({ message: 'Email already in use' });
                    user.email = email;
                }
                await user.save();
            }
        }

        if (qualification) teacherProfile.qualification = qualification;
        if (experience !== undefined) teacherProfile.experience = Number(experience);
        if (subjects) teacherProfile.subjects = subjects;
        if (designation) teacherProfile.designation = designation;
        if (employmentType) teacherProfile.employmentType = employmentType;
        if (status) teacherProfile.status = status;
        if (attendance !== undefined) teacherProfile.attendance = Number(attendance);
        if (classCount !== undefined) teacherProfile.classCount = Number(classCount);
        if (weeklyLoad !== undefined) teacherProfile.weeklyLoad = Number(weeklyLoad);
        if (performance !== undefined) teacherProfile.performance = Number(performance);
        if (salary !== undefined) teacherProfile.salary = Number(salary);
        if (employeeId !== undefined) teacherProfile.employeeId = employeeId;
        if (phone !== undefined) teacherProfile.phone = phone;
        if (address !== undefined) teacherProfile.address = address;
        if (joiningDate !== undefined) teacherProfile.joiningDate = joiningDate;

        await teacherProfile.save();
        res.json({ message: 'Teacher updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const teacherProfile = await TeacherProfile.findById(req.params.id);
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher not found' });

        const schoolId = req.user.school;
        
        const classes = await Class.find({ school: schoolId, 'sections.classTeacher': teacherProfile.user });
        for (const cls of classes) {
            let updated = false;
            cls.sections.forEach(sec => {
                if (sec.classTeacher?.toString() === teacherProfile.user.toString()) {
                    sec.classTeacher = null;
                    updated = true;
                }
            });
            if (updated) await cls.save();
        }

        await User.findByIdAndDelete(teacherProfile.user._id);
        await teacherProfile.deleteOne();

        res.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTeacherStudents = async (req, res) => {
    try {
        const teacherProfile = await TeacherProfile.findById(req.params.id);
        if (!teacherProfile) return res.status(404).json({ message: 'Teacher not found' });

        const schoolId = req.user.school;
        const teacherUserId = teacherProfile.user;

        // Find classes where this teacher is assigned to any section
        const classes = await Class.find({ 
            school: schoolId, 
            'sections.classTeacher': teacherUserId 
        }).populate('sections.students');

        let students = [];
        classes.forEach(cls => {
            cls.sections.forEach(sec => {
                if (sec.classTeacher?.toString() === teacherUserId.toString()) {
                    // sec.students is populated with full student objects
                    sec.students.forEach(st => {
                        students.push({
                            _id: st._id,
                            name: `${st.firstName} ${st.lastName}`, // Assuming Student model has firstName/lastName
                            firstName: st.firstName,
                            lastName: st.lastName,
                            rollNumber: st.rollNumber || 'N/A',
                            photo: st.photo || null,
                            className: cls.name,
                            sectionName: sec.name
                        });
                    });
                }
            });
        });

        // Deduplicate students by ID just in case
        students = Array.from(new Map(students.map(s => [s._id.toString(), s])).values());

        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
