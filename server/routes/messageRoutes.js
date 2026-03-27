import express from 'express';
import { 
    getConversations, 
    getMessages, 
    createConversation, 
    sendMessage, 
    markAsRead, 
    getUnreadCount 
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('school_admin', 'admin', 'teacher'));

router.get('/unread-count', getUnreadCount);
router.get('/conversations', getConversations);
router.post('/conversations', createConversation);
router.get('/conversations/:conversationId', getMessages);
router.post('/conversations/:conversationId', sendMessage);
router.patch('/conversations/:conversationId/read', markAsRead);

export default router;
