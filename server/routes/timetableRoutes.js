import express from 'express';
import { getTimetables, saveTimetable, deleteTimetable } from '../controllers/timetableController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'school_admin', 'teacher'));

router.route('/')
    .get(getTimetables)
    .post(saveTimetable);

router.route('/:id')
    .delete(deleteTimetable);

export default router;
