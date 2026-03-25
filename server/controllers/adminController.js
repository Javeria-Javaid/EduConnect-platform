import User from '../models/User.js';
import School from '../models/School.js';
import Job from '../models/Job.js';
import Admission from '../models/Admission.js';
import Application from '../models/Application.js';

export const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
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
    const { firstName, lastName, email, role, school, phone, address } = req.body;
    
    if (role && !['parent', 'student', 'admin', 'teacher', 'school_admin', 'vendor'].includes(role)) {
       return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.school = school || user.school;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    
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

export const getAdminStats = async (req, res) => {
  try {
    const [activeStudents, totalSchools, teachersCount, pendingApprovals] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      School.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
      Admission.countDocuments({ status: 'Pending' })
    ]);

    const totalJobs = await Job.countDocuments();
    const recentPendingAdmissions = await Admission.find({ status: 'Pending' }).sort({ createdAt: -1 }).limit(5);

    res.json({ 
      activeStudents, 
      totalSchools, 
      totalJobPosts: totalJobs, 
      pendingApprovals,
      recentPendingAdmissions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAnalytics = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const admissionsTrend = await Admission.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedAdmissions = admissionsTrend.map(item => ({
      name: monthNames[item._id - 1],
      value: item.count
    }));

    const jobsTrend = await Application.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          applications: { $sum: 1 }
        }
      },
       { $sort: { "_id": 1 } }
    ]);

    const formattedJobs = jobsTrend.map(item => ({
      name: monthNames[item._id - 1],
      applications: item.applications
    }));

    res.json({ 
      admissionsTrend: formattedAdmissions, 
      jobApplicationsTrend: formattedJobs 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
