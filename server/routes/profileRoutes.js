import express from 'express';
const router = express.Router();
import {
  getProfile,
  updateProfile,
  updateExtendedProfile,
  updateEmail,
  updatePassword,
  uploadPhoto,
  deletePhoto,
  updatePreferences,
  updateNotifications,
  getProfileActivity
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/photoUploadMiddleware.js';

// All profile routes are protected
router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/extended', updateExtendedProfile);
router.put('/me/email', updateEmail);
router.put('/me/password', updatePassword);
router.post('/me/photo', upload.single('photo'), uploadPhoto);
router.delete('/me/photo', deletePhoto);
router.put('/me/preferences', updatePreferences);
router.put('/me/notifications', updateNotifications);
router.get('/me/activity', getProfileActivity);

export default router;
