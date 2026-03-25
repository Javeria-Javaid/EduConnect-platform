import express from 'express';
const router = express.Router();
import { getJobs, createJob, updateJob, deleteJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/')
  .get(getJobs)
  .post(protect, authorize('admin'), createJob);

router.route('/:id')
  .put(protect, authorize('admin'), updateJob)
  .delete(protect, authorize('admin'), deleteJob);

export default router;
