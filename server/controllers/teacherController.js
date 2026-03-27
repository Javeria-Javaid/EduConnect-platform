import TeacherProfile from '../models/TeacherProfile.js';
import Application from '../models/Application.js';
import School from '../models/School.js';
import Material from '../models/Material.js';
import Message from '../models/Message.js';
import StudentProfile from '../models/StudentProfile.js';
import Class from '../models/Class.js';
import fs from 'fs';

export const getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const schoolId = req.user.school;

    const classes = await Class.find({ 
        school: schoolId, 
        'sections.classTeacher': teacherId 
    });

    const assignedSections = classes.reduce((acc, c) => {
        return acc.concat(c.sections.filter(s => s.classTeacher && s.classTeacher.toString() === teacherId.toString()).map(s => ({
            className: c.name,
            sectionName: s.name
        })));
    }, []);

    const totalAssignedClasses = assignedSections.length;

    let totalStudents = 0;
    for (const sec of assignedSections) {
        const count = await StudentProfile.countDocuments({
            school: schoolId,
            class: sec.className,
            section: sec.sectionName
        });
        totalStudents += count;
    }

    const teacherProfile = await TeacherProfile.findOne({ user: teacherId });

    res.json({
      totalAssignedClasses,
      totalStudents,
      todayAttendancePending: 2,
      homeworkDueToday: 3,
      upcomingExams: 2,
      attendance: teacherProfile ? teacherProfile.attendance : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { qualification, experience, subjects, bio, availability } = req.body;
  const profileFields = { user: req.user._id, qualification, experience, subjects, bio, availability };

  try {
    let profile = await TeacherProfile.findOne({ user: req.user._id });
    if (profile) {
      profile = await TeacherProfile.findOneAndUpdate({ user: req.user._id }, { $set: profileFields }, { new: true });
      return res.json(profile);
    }
    profile = new TeacherProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id }).populate('user', ['firstName', 'lastName', 'email']);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId);
    if (!school) return res.status(404).json({ message: 'School not found' });
    
    // Check if already applied to this school
    const existingApplication = await Application.findOne({ 
        teacher: req.user._id, 
        school: req.params.schoolId 
    });
    
    if (existingApplication) return res.status(400).json({ message: 'Already applied to this school' });
    
    const application = new Application({ 
        teacher: req.user._id, 
        applicantRef: req.user._id,
        applicantName: `${req.user.firstName} ${req.user.lastName}`,
        applicantEmail: req.user.email,
        school: req.params.schoolId, 
        coverLetter: req.body.coverLetter || "I am interested in this position."
    });
    
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ teacher: req.user._id }).populate('school');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const { title, class: className, subject } = req.body;
    const material = new Material({ title: title || req.file.originalname, fileName: req.file.originalname, filePath: req.file.path, fileSize: req.file.size, fileType: req.file.mimetype, uploadedBy: req.user._id, class: className, subject: subject });
    await material.save();
    res.status(201).json({ success: true, material });
  } catch (error) {
    if (req.file && req.file.path) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

export const getMyMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ uploadedBy: req.user._id });
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material || !fs.existsSync(material.filePath)) return res.status(404).json({ message: 'File not found' });
    material.downloads += 1;
    await material.save();
    res.download(material.filePath, material.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recipient, recipientType, subject, body } = req.body;
    if (!recipient || !subject || !body) return res.status(400).json({ message: 'Missing fields' });
    const message = new Message({ sender: req.user._id, recipient, recipientType: recipientType || 'parent', subject, body });
    await message.save();
    res.status(201).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({ $or: [{ sender: req.user._id }, { recipient: req.user._id }] })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
