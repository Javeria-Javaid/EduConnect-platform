import express from 'express';
const router = express.Router();
import { updateProfile, getMyProfile, applyForJob, getMyApplications, uploadMaterial, getMyMaterials, downloadMaterial, sendMessage, getMyMessages, getTeacherStats, getLinkedParentForStudent } from '../controllers/teacherController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

// Stats route
router.get('/stats', protect, authorize('teacher'), getTeacherStats);

// Profile routes
router.get('/profile/me', protect, authorize('teacher'), getMyProfile);
router.post('/profile', protect, authorize('teacher'), updateProfile);

// Application routes
router.post('/apply/:schoolId', protect, authorize('teacher'), applyForJob);
router.get('/applications', protect, authorize('teacher'), getMyApplications);

// Material routes
router.get('/materials/me', protect, authorize('teacher'), getMyMaterials);
router.post('/upload-material', protect, authorize('teacher'), upload.single('file'), uploadMaterial);
router.get('/download-material/:id', protect, authorize('teacher'), downloadMaterial);

// Messaging routes
router.post('/send-message', protect, authorize('teacher'), sendMessage);
router.get('/messages', protect, authorize('teacher'), getMyMessages);

// Student/Parent linkage helpers
router.get('/students/:studentUserId/linked-parent', protect, authorize('teacher'), getLinkedParentForStudent);

export default router;

