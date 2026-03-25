import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    // If school_admin, only show users from their school
    if (req.user.role === 'school_admin' && req.user.school) {
        query.school = req.user.school;
    }

    const users = await User.find(query).select('-passwordHash').populate('school');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.school = req.body.school || user.school;
    
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolStats = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const targetSchoolId = req.user.role === 'admin' ? req.query.schoolId : schoolId;

    if (!targetSchoolId) {
       const totalStudents = await User.countDocuments({ role: 'parent' });
       const totalTeachers = await User.countDocuments({ role: 'teacher' });
       return res.json({ totalStudents, totalTeachers, activeClasses: 0, attendance: '0%' });
    }

    const totalStudents = await User.countDocuments({ school: targetSchoolId, role: 'parent' });
    const totalTeachers = await User.countDocuments({ school: targetSchoolId, role: 'teacher' });
    
    res.json({
      totalStudents,
      totalTeachers,
      activeClasses: 12,
      attendance: '95%'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
