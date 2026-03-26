import express from 'express';
import { getExams, createExam, updateExam, deleteExam, getExamStats, saveMarks } from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'school_admin', 'teacher'));

router.get('/stats', getExamStats);
router.route('/')
    .get(getExams)
    .post(createExam);
router.route('/:id')
    .put(updateExam)
    .delete(deleteExam);
router.post('/:id/marks', saveMarks);

export default router;
