import TeacherProfile from '../models/TeacherProfile.js';
import Application from '../models/Application.js';
import School from '../models/School.js';
import Material from '../models/Material.js';
import Message from '../models/Message.js';
import fs from 'fs';
import path from 'path';



export const updateProfile = async (req, res) => {
  const { qualification, experience, subjects, bio, availability } = req.body;

  const profileFields = {
    user: req.user._id,
    qualification,
    experience,
    subjects,
    bio,
    availability
  };

  try {
    let profile = await TeacherProfile.findOne({ user: req.user._id });

    if (profile) {
      // Update
      profile = await TeacherProfile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create
    profile = new TeacherProfile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const profile = await TeacherProfile.findOne({ user: req.user._id }).populate('user', ['firstName', 'lastName', 'email']);
    if (!profile) {
      return res.status(400).json({ message: 'There is no profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};


export const applyForJob = async (req, res) => {
  try {
    const school = await School.findById(req.params.schoolId);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }

    const existingApplication = await Application.findOne({
      teacher: req.user._id,
      school: req.params.schoolId
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this school' });
    }

    const application = new Application({
      teacher: req.user._id,
      school: req.params.schoolId,
      coverLetter: req.body.coverLetter
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


// Upload teaching material
export const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, class: className, subject } = req.body;

    const material = new Material({
      title: title || req.file.originalname,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      fileType: req.file.mimetype,
      uploadedBy: req.user._id,
      class: className,
      subject: subject
    });

    await material.save();

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      material: {
        id: material._id,
        title: material.title,
        fileName: material.fileName,
        fileSize: material.fileSize,
        uploadDate: material.uploadDate
      }
    });
  } catch (error) {
    // Clean up uploaded file if database save fails
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ message: error.message });
  }
};


// Download teaching material
export const downloadMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check if file exists
    if (!fs.existsSync(material.filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download counter
    material.downloads += 1;
    await material.save();

    // Set proper headers for file download
    res.setHeader('Content-Type', material.fileType);
    res.setHeader('Content-Disposition', `attachment; filename="${material.fileName}"`);
    res.setHeader('Content-Length', material.fileSize);

    // Stream the file
    const fileStream = fs.createReadStream(material.filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Send message to parents/students
export const sendMessage = async (req, res) => {
  try {
    const { recipient, recipientType, subject, body } = req.body;

    // Validate required fields
    if (!recipient || !subject || !body) {
      return res.status(400).json({
        message: 'Recipient, subject, and message body are required'
      });
    }

    const message = new Message({
      sender: req.user._id,
      recipient,
      recipientType: recipientType || 'parent',
      subject,
      body
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: {
        id: message._id,
        recipient: message.recipient,
        subject: message.subject,
        sentDate: message.sentDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
