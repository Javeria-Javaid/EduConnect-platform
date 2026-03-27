import express from 'express';
const router = express.Router();
import { getAllUsers, updateUser, deleteUser, getSchoolStats, getAdminStats, getAdminAnalytics, sendAnnouncement } from '../controllers/adminController.js';
import { getEnrollmentReport, getFinancialReport, getJobReport } from '../controllers/reportController.js';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

// User Management
router.get('/users', protect, authorize('admin', 'school_admin'), getAllUsers);
router.put('/users/:id', protect, authorize('admin', 'school_admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Dashboard & Stats
router.get('/stats', protect, authorize('admin'), getAdminStats);
router.get('/analytics', protect, authorize('admin'), getAdminAnalytics);
router.get('/school-stats', protect, authorize('admin', 'school_admin'), getSchoolStats);

// Reports
router.get('/reports/enrollment', protect, authorize('admin'), getEnrollmentReport);
router.get('/reports/financials', protect, authorize('admin'), getFinancialReport);
router.get('/reports/jobs', protect, authorize('admin'), getJobReport);

// System Settings
router.get('/settings', protect, authorize('admin'), getSettings);
router.patch('/settings', protect, authorize('admin'), updateSettings);

// Announcement
router.post('/announcement', protect, authorize('admin', 'school_admin'), sendAnnouncement);

export default router;
