import express from 'express';
const router = express.Router();
import { updateProfile, getMyProfile, applyForJob, getMyApplications, uploadMaterial, downloadMaterial, sendMessage } from '../controllers/teacherController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Profile routes
router.get('/profile/me', protect, authorize('teacher'), getMyProfile);
router.post('/profile', protect, authorize('teacher'), updateProfile);

// Application routes
router.post('/apply/:schoolId', protect, authorize('teacher'), applyForJob);
router.get('/applications', protect, authorize('teacher'), getMyApplications);

// Material routes
router.post('/upload-material', protect, authorize('teacher'), upload.single('file'), uploadMaterial);
router.get('/download-material/:id', protect, authorize('teacher'), downloadMaterial);

// Messaging routes
router.post('/send-message', protect, authorize('teacher'), sendMessage);

export default router;

