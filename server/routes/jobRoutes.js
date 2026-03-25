import express from 'express';
const router = express.Router();
import { getJobs, createJob, updateJob, deleteJob, getJobApplicants } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/')
  .get(getJobs)
  .post(protect, authorize('admin', 'school_admin'), createJob);

router.route('/:id/applicants').get(protect, authorize('admin', 'school_admin'), getJobApplicants);

router.route('/:id')
  .put(protect, authorize('admin', 'school_admin'), updateJob)
  .delete(protect, authorize('admin', 'school_admin'), deleteJob);

export default router;
