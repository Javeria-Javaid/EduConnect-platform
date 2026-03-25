import express from 'express';
const router = express.Router();
import { getAdmissions, createAdmission, updateAdmissionStatus } from '../controllers/admissionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/')
  .get(protect, authorize('admin'), getAdmissions)
  .post(createAdmission);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateAdmissionStatus);

export default router;
