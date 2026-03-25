import express from 'express';
const router = express.Router();
import { getTickets, createTicket, addMessage } from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/')
  .get(protect, authorize('admin'), getTickets)
  .post(protect, createTicket);

router.route('/:id/messages')
  .post(protect, addMessage);

export default router;
