import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

export const getStudents = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const { search, class: className, section } = req.query;

    let query = { school: schoolId };

    if (className) query.class = className;
    if (section) query.section = section;

    const students = await StudentProfile.find(query).populate('user', 'firstName lastName email role');
    
    // Format for frontend
    const formattedStudents = students.map(s => ({
      _id: s._id,
      userId: s.user?._id,
      name: `${s.user?.firstName} ${s.user?.lastName}`,
      email: s.user?.email,
      admissionNumber: s.admissionNumber,
      rollNumber: s.rollNumber,
      class: s.class,
      section: s.section,
      parentName: s.parentName,
      parentPhone: s.parentPhone,
      gender: s.gender,
      feeStatus: s.feeStatus,
      attendance: s.attendance,
      performance: s.performance,
      photo: s.photo,
    }));

    if (search) {
       const filtered = formattedStudents.filter(s => 
          s.name.toLowerCase().includes(search.toLowerCase()) || 
          s.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
          s.parentName.toLowerCase().includes(search.toLowerCase())
       );
       return res.json(filtered);
    }

    res.json(formattedStudents);
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
