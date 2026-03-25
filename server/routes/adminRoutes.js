import express from 'express';
const router = express.Router();
import { getAllUsers, updateUser, deleteUser, getSchoolStats } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.get('/users', protect, authorize('admin', 'school_admin'), getAllUsers);
router.get('/stats', protect, authorize('admin', 'school_admin'), getSchoolStats);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

export default router;
