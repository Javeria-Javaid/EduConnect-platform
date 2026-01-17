import express from 'express';
const router = express.Router();
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from '../controllers/schoolController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/')
  .get(getSchools)
  .post(protect, authorize('vendor', 'admin'), createSchool);

router.route('/:id')
  .get(getSchoolById)
  .put(protect, authorize('vendor', 'admin'), updateSchool)
  .delete(protect, authorize('vendor', 'admin'), deleteSchool);

export default router;
