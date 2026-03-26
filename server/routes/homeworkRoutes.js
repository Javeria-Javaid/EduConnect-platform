import express from 'express';
import { getHomeworks, createHomework, updateHomework, deleteHomework, gradeSubmission } from '../controllers/homeworkController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('teacher', 'admin', 'school_admin'));

router.route('/')
    .get(getHomeworks)
    .post(createHomework);

router.route('/:id')
    .put(updateHomework)
    .delete(deleteHomework);

router.put('/:id/grade', gradeSubmission);

export default router;
