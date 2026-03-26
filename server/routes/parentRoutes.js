import express from 'express';
const router = express.Router();
import { getParentStats, getChildren, linkChild, getDashboardData } from '../controllers/parentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.get('/stats', protect, authorize('parent'), getParentStats);
router.get('/children', protect, authorize('parent'), getChildren);
router.post('/children/link', protect, authorize('parent'), linkChild);
router.get('/dashboard-data', protect, authorize('parent'), getDashboardData);

export default router;
