import express from 'express';
const router = express.Router();
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  verifySchool,
  getSchoolStats,
} from '../controllers/schoolController.js';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { getTeachers, createTeacher, updateTeacher, deleteTeacher } from '../controllers/teacherAdminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.get('/stats', protect, authorize('admin', 'school_admin'), getSchoolStats);

// Student Management
router.get('/students', protect, authorize('school_admin', 'admin'), getStudents);
router.post('/students', protect, authorize('school_admin', 'admin'), createStudent);
router.put('/students/:id', protect, authorize('school_admin', 'admin'), updateStudent);
router.delete('/students/:id', protect, authorize('school_admin', 'admin'), deleteStudent);

// Teacher Management
router.get('/teachers', protect, authorize('school_admin', 'admin'), getTeachers);
router.post('/teachers', protect, authorize('school_admin', 'admin'), createTeacher);
router.put('/teachers/:id', protect, authorize('school_admin', 'admin'), updateTeacher);
router.delete('/teachers/:id', protect, authorize('school_admin', 'admin'), deleteTeacher);

router.route('/')
  .get(getSchools)
  .post(protect, authorize('vendor', 'admin'), createSchool);

router.route('/:id')
  .get(getSchoolById)
  .put(protect, authorize('vendor', 'admin'), updateSchool)
  .delete(protect, authorize('vendor', 'admin'), deleteSchool);

router.patch('/:id/verify', protect, authorize('admin'), verifySchool);

export default router;
