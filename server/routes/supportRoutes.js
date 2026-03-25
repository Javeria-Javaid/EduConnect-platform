import express from 'express';
const router = express.Router();
import { getTickets, createTicket, addMessage, resolveTicket } from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/')
  .get(protect, authorize('admin'), getTickets)
  .post(protect, createTicket);

router.route('/:id/messages')
  .post(protect, addMessage);

router.patch('/:id/resolve', protect, authorize('admin'), resolveTicket);

export default router;
