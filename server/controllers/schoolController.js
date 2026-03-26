import School from '../models/School.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Attendance from '../models/Attendance.js';
import Admission from '../models/Admission.js';

export const getParentStatsForAdmin = async (req, res) => {
  try {
    const schoolId = req.user.school;
    const now = new Date();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [totalParents, newThisWeek, newThisMonth] = await Promise.all([
      User.countDocuments({ school: schoolId, role: 'parent' }),
      User.countDocuments({ school: schoolId, role: 'parent', createdAt: { $gte: weekAgo } }),
      User.countDocuments({ school: schoolId, role: 'parent', createdAt: { $gte: monthAgo } }),
    ]);

    res.json({
      totalParents,
      newParents: { week: newThisWeek, month: newThisMonth },
      linkedParents: totalParents,
      unlinkedParents: 0,
      activeToday: 0,
      communication: { messagesSent: 0, unreadMessages: 0, announcementsViewed: 0, announcementsTotal: 0 },
      alerts: [],
      recentActivity: []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSchoolStats = async (req, res) => {
  try {
    const schoolId = req.user.school;

    if (!schoolId && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'User is not assigned to a school' });
    }

    const targetSchoolId = req.user.role === 'admin' ? (req.query.schoolId || schoolId) : schoolId;

    if (!targetSchoolId) {
        return res.status(400).json({ message: 'School ID is required for admins' });
    }

    const [totalStudents, totalTeachers, activeClassesCount, pendingAdmissionsCount, newAdmissionsCount] = await Promise.all([
        User.countDocuments({ school: targetSchoolId, role: 'student' }),
        User.countDocuments({ school: targetSchoolId, role: 'teacher' }),
        Class.countDocuments({ school: targetSchoolId, active: true }),
        Admission.countDocuments({ school: targetSchoolId, status: 'Pending' }),
        Admission.countDocuments({ school: targetSchoolId, date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } })
    ]);
    
    // Calculate Attendance Percentage for Today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalAttendanceToday, presentAttendanceToday] = await Promise.all([
      Attendance.countDocuments({ school: targetSchoolId, date: { $gte: today, $lt: tomorrow } }),
      Attendance.countDocuments({ school: targetSchoolId, date: { $gte: today, $lt: tomorrow }, status: 'Present' })
    ]);

    let attendancePercent = '0%';
    if (totalAttendanceToday > 0) {
      attendancePercent = `${Math.round((presentAttendanceToday / totalAttendanceToday) * 100)}%`;
    } else if (totalStudents > 0) {
      // Fallback if no attendance marked today yet, maybe show a generic active stat or N/A
      attendancePercent = 'N/A';
    }

    res.json({
      totalStudents,
      totalTeachers,
      activeClasses: activeClassesCount,
      attendance: attendancePercent,
      newApplications: newAdmissionsCount,
      pendingReview: pendingAdmissionsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSchools = async (req, res) => {
  const { city, vendor } = req.query;
  let query = {};
  if (city) {
    query.city = { $regex: city, $options: 'i' };
  }
  if (vendor) {
    query.vendor = vendor;
  }
  
  try {
    const schools = await School.find(query).populate('vendor', 'firstName lastName email');
    res.status(200).json(schools); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getSchoolById = async (req, res) => {
  try {
    const school = await School.findById(req.params.id).populate('vendor', 'firstName lastName email');
    if (school) {
      res.status(200).json(school);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createSchool = async (req, res) => {
  const { name, address, city, description, contactEmail, contactPhone, website, admissionOpen, facilities, fees } = req.body;

  try {
    const school = new School({
      name,
      address,
      city,
      description,
      contactEmail,
      contactPhone,
      website,
      admissionOpen,
      facilities,
      fees,
      vendor: req.user._id,
    });

    const createdSchool = await school.save();
    res.status(201).json(createdSchool);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (school) {
      // Check if user is vendor of this school or admin
      if (school.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized to update this school' });
      }

      school.name = req.body.name || school.name;
      school.address = req.body.address || school.address;
      school.city = req.body.city || school.city;
      school.description = req.body.description || school.description;
      school.contactEmail = req.body.contactEmail || school.contactEmail;
      school.contactPhone = req.body.contactPhone || school.contactPhone;
      school.website = req.body.website || school.website;
      school.admissionOpen = req.body.admissionOpen !== undefined ? req.body.admissionOpen : school.admissionOpen;
      school.facilities = req.body.facilities || school.facilities;
      school.fees = req.body.fees || school.fees;

      const updatedSchool = await school.save();
      res.json(updatedSchool);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);

    if (school) {
        if (school.vendor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this school' });
        }
      await school.deleteOne();
      res.json({ message: 'School removed' });
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifySchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (school) {
      school.isVerified = !school.isVerified;
      const updatedSchool = await school.save();
      res.json(updatedSchool);
    } else {
      res.status(404).json({ message: 'School not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
