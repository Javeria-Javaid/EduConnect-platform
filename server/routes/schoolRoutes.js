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
  getParentStatsForAdmin,
} from '../controllers/schoolController.js';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../controllers/studentController.js';
import { getTeachers, getTeacherStats, createTeacher, updateTeacher, deleteTeacher, getTeacherStudents } from '../controllers/teacherAdminController.js';
import { getClasses, createClass, updateClass, deleteClass, getClassesStats } from '../controllers/classController.js';
import { markAttendance, getAttendanceStats } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.get('/stats', protect, authorize('admin', 'school_admin'), getSchoolStats);
router.get('/parent-stats', protect, authorize('admin', 'school_admin'), getParentStatsForAdmin);

// Attendance Management
router.get('/attendance/stats', protect, authorize('school_admin', 'admin', 'teacher'), getAttendanceStats);
router.post('/attendance/mark', protect, authorize('school_admin', 'admin', 'teacher'), markAttendance);

// Student Management
router.get('/students', protect, authorize('school_admin', 'admin', 'teacher'), getStudents);
router.post('/students', protect, authorize('school_admin', 'admin'), createStudent);
router.put('/students/:id', protect, authorize('school_admin', 'admin'), updateStudent);
router.delete('/students/:id', protect, authorize('school_admin', 'admin'), deleteStudent);

// Teacher Management
router.get('/teachers/stats', protect, authorize('school_admin', 'admin'), getTeacherStats);
router.get('/teachers', protect, authorize('school_admin', 'admin'), getTeachers);
router.get('/teachers/:id/students', protect, authorize('school_admin', 'admin', 'teacher'), getTeacherStudents);
router.post('/teachers', protect, authorize('school_admin', 'admin'), createTeacher);
router.put('/teachers/:id', protect, authorize('school_admin', 'admin'), updateTeacher);
router.delete('/teachers/:id', protect, authorize('school_admin', 'admin'), deleteTeacher);

// Class Management
router.get('/classes', protect, authorize('school_admin', 'admin', 'teacher'), getClasses);
router.get('/classes/stats', protect, authorize('school_admin', 'admin'), getClassesStats);
router.post('/classes', protect, authorize('school_admin', 'admin'), createClass);
router.put('/classes/:id', protect, authorize('school_admin', 'admin'), updateClass);
router.delete('/classes/:id', protect, authorize('school_admin', 'admin'), deleteClass);

router.route('/')
  .get(getSchools)
  .post(protect, authorize('vendor', 'admin'), createSchool);

router.route('/:id')
  .get(getSchoolById)
  .put(protect, authorize('vendor', 'admin'), updateSchool)
  .delete(protect, authorize('vendor', 'admin'), deleteSchool);

router.patch('/:id/verify', protect, authorize('admin'), verifySchool);

export default router;
