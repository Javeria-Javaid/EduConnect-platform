import express from 'express';
const router = express.Router();
import {
  getAdmissions,
  createAdmission,
  updateAdmissionStatus,
  deleteAdmission,
  getAdmissionStats
} from '../controllers/admissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

// Stats for school admin dashboard
router.get('/stats', protect, authorize('admin', 'school_admin'), getAdmissionStats);

// List all admissions (school-scoped), create new one (public)
router.route('/')
  .get(protect, authorize('admin', 'school_admin'), getAdmissions)
  .post(createAdmission);

// Update status or delete a specific admission
router.route('/:id/status')
  .put(protect, authorize('admin', 'school_admin'), updateAdmissionStatus);

router.route('/:id')
  .delete(protect, authorize('admin', 'school_admin'), deleteAdmission);

export default router;
