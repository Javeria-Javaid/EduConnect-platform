import TeacherProfile from '../models/TeacherProfile.js';
import User from '../models/User.js';

export const getTeachers = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { search, subjects, status } = req.query;

    const users = await User.find({ school: schoolId, role: 'teacher' }).select('_id');
    const userIds = users.map(u => u._id);

    let query = { user: { $in: userIds } };

    if (subjects) {
      const subjectList = subjects.split(',');
      query.subjects = { $in: subjectList };
    }
    if (status) query.status = status;

    const teachers = await TeacherProfile.find(query).populate('user', 'firstName lastName email');
    
    // Format for frontend
    const formattedTeachers = teachers.map(t => ({
      _id: t._id,
      userId: t.user?._id,
      name: `${t.user?.firstName} ${t.user?.lastName}`,
      email: t.user?.email,
      subjects: t.subjects,
      qualification: t.qualification,
      experience: t.experience,
      designation: t.designation,
      classCount: t.classCount,
      weeklyLoad: t.weeklyLoad,
      attendance: t.attendance,
      employmentType: t.employmentType,
      status: t.status,
      photo: t.photo,
    }));

    if (search) {
       const filtered = formattedTeachers.filter(t => 
          t.name.toLowerCase().includes(search.toLowerCase()) || 
          t.email.toLowerCase().includes(search.toLowerCase()) ||
          t.subjects.some(sub => sub.toLowerCase().includes(search.toLowerCase()))
       );
       return res.json(filtered);
    }

    res.json(formattedTeachers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, qualification, experience, subjects, designation, employmentType } = req.body;
    const schoolId = req.user.school;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({
      firstName,
      lastName,
      email,
      role: 'teacher',
      school: schoolId,
      passwordHash: 'tempPassword'
    });
    await user.save();

    const teacherProfile = new TeacherProfile({
      user: user._id,
      qualification,
      experience,
      subjects,
      designation,
      employmentType
    });
    await teacherProfile.save();

    res.status(201).json({ message: 'Teacher created', teacher: teacherProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { firstName, lastName, email, qualification, experience, subjects, designation, employmentType, status, attendance, classCount, weeklyLoad } = req.body;
    const teacherProfile = await TeacherProfile.findById(req.params.id).populate('user');
    
    if (!teacherProfile) return res.status(404).json({ message: 'Teacher not found' });

    if (teacherProfile.user) {
        const user = await User.findById(teacherProfile.user._id);
        if (user) {
            user.firstName = firstName || user.firstName;
            user.lastName = lastName || user.lastName;
            user.email = email || user.email;
            await user.save();
        }
    }

    teacherProfile.qualification = qualification || teacherProfile.qualification;
    teacherProfile.experience = experience || teacherProfile.experience;
    teacherProfile.subjects = subjects || teacherProfile.subjects;
    teacherProfile.designation = designation || teacherProfile.designation;
    teacherProfile.employmentType = employmentType || teacherProfile.employmentType;
    teacherProfile.status = status || teacherProfile.status;
    teacherProfile.attendance = attendance !== undefined ? attendance : teacherProfile.attendance;
    teacherProfile.classCount = classCount !== undefined ? classCount : teacherProfile.classCount;
    teacherProfile.weeklyLoad = weeklyLoad !== undefined ? weeklyLoad : teacherProfile.weeklyLoad;

    await teacherProfile.save();
    res.json({ message: 'Teacher updated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const teacherProfile = await TeacherProfile.findById(req.params.id);
    if (!teacherProfile) return res.status(404).json({ message: 'Teacher not found' });

    await User.findByIdAndDelete(teacherProfile.user);
    await teacherProfile.deleteOne();

    res.json({ message: 'Teacher deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
