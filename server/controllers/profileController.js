import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import TeacherProfile from '../models/TeacherProfile.js';
import ParentProfile from '../models/ParentProfile.js';
import VendorProfile from '../models/VendorProfile.js';

// Supabase Setup
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// @desc    Get current user profile (Unified)
// @route   GET /api/profile/me
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let extendedProfile = null;
    if (user.role === 'teacher') {
      extendedProfile = await TeacherProfile.findOne({ user: user._id });
    } else if (user.role === 'parent') {
      extendedProfile = await ParentProfile.findOne({ user: user._id });
    } else if (user.role === 'vendor') {
      extendedProfile = await VendorProfile.findOne({ user: user._id });
    }

    res.json({
      user,
      extendedProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update basic user profile
// @route   PUT /api/profile/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, gender, address, city, country } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.phone = phone || user.phone;
      user.dateOfBirth = dateOfBirth || user.dateOfBirth;
      user.gender = gender || user.gender;
      user.address = address || user.address;
      user.city = city || user.city;
      user.country = country || user.country;

      const updatedUser = await user.save();
      const { passwordHash, ...userResponse } = updatedUser.toObject();
      res.json(userResponse);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update extended role-specific profile
// @route   PUT /api/profile/me/extended
// @access  Private
export const updateExtendedProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let extendedProfile;

    if (user.role === 'teacher') {
      extendedProfile = await TeacherProfile.findOneAndUpdate(
        { user: user._id },
        { ...req.body, user: user._id },
        { new: true, upsert: true }
      );
    } else if (user.role === 'parent') {
      extendedProfile = await ParentProfile.findOneAndUpdate(
        { user: user._id },
        { ...req.body, user: user._id },
        { new: true, upsert: true }
      );
    } else if (user.role === 'vendor') {
      extendedProfile = await VendorProfile.findOneAndUpdate(
        { user: user._id },
        { ...req.body, user: user._id },
        { new: true, upsert: true }
      );
    } else {
      return res.status(400).json({ message: 'No extended profile for this role' });
    }

    res.json(extendedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update email
// @route   PUT /api/profile/me/email
// @access  Private
export const updateEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

        // Check if email already taken
        const emailExists = await User.findOne({ email });
        if (emailExists && emailExists._id.toString() !== user._id.toString()) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        user.email = email;
        await user.save();
        res.json({ message: 'Email updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update password
// @route   PUT /api/profile/me/password
// @access  Private
export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update theme/preferences
// @route   PUT /api/profile/me/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
    try {
        const { language, timezone, theme } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.language = language || user.language;
            user.timezone = timezone || user.timezone;
            user.theme = theme || user.theme;
            await user.save();
            res.json({ language: user.language, timezone: user.timezone, theme: user.theme });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update notification settings
// @route   PUT /api/profile/me/notifications
// @access  Private
export const updateNotifications = async (req, res) => {
    try {
        const { notifyEmail, notifySMS, notifyPush, notifyMarketing, notifySecurity } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            if (notifyEmail !== undefined) user.notifyEmail = notifyEmail;
            if (notifySMS !== undefined) user.notifySMS = notifySMS;
            if (notifyPush !== undefined) user.notifyPush = notifyPush;
            if (notifyMarketing !== undefined) user.notifyMarketing = notifyMarketing;
            if (notifySecurity !== undefined) user.notifySecurity = notifySecurity;
            
            await user.save();
            res.json({
                notifyEmail: user.notifyEmail,
                notifySMS: user.notifySMS,
                notifyPush: user.notifyPush,
                notifyMarketing: user.notifyMarketing,
                notifySecurity: user.notifySecurity
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ... Profile Photo logic ...

// @desc    Upload profile photo to Supabase
// @route   POST /api/profile/me/photo
// @access  Private
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const file = req.file;
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${user._id}-${Date.now()}.${fileExt}`;
    const filePath = `profiles/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('educonnect-uploads')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) throw error;

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from('educonnect-uploads')
      .getPublicUrl(filePath);

    // Update User record
    user.profilePhoto = publicUrl;
    await user.save();

    res.json({ profilePhoto: publicUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete profile photo
// @route   DELETE /api/profile/me/photo
// @access  Private
export const deletePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.profilePhoto) return res.status(400).json({ message: 'No photo to delete' });

    // Extract path from URL (simple version)
    const urlParts = user.profilePhoto.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `profiles/${fileName}`;

    // Delete from Supabase
    const { error } = await supabase.storage
      .from('educonnect-uploads')
      .remove([filePath]);

    if (error) console.error('Supabase delete error:', error.message);

    user.profilePhoto = null;
    await user.save();

    res.json({ message: 'Photo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfileActivity = async (req, res) => res.json([]);
