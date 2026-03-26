import express from 'express';
import { getTransactions, createTransaction, deleteTransaction, getFinanceStats } from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'school_admin'));

router.get('/stats', getFinanceStats);
router.route('/')
    .get(getTransactions)
    .post(createTransaction);

router.route('/:id')
    .delete(deleteTransaction);

export default router;
