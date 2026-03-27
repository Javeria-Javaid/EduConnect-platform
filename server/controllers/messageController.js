import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';

// 1. GET /api/messages/conversations
export const getConversations = async (req, res) => {
    try {
        const schoolId = req.user.school;
        const userId = req.user._id;

        const conversations = await Conversation.find({ 
            school: schoolId, 
            participants: userId 
        })
        .populate('participants', 'firstName lastName role email photo')
        .sort({ lastMessageAt: -1 });

        res.json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. GET /api/messages/conversations/:conversationId
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
        if (!conversation) {
            return res.status(403).json({ message: 'Access denied to this conversation' });
        }

        const messages = await Message.find({ conversation: conversationId })
            .populate('sender', 'firstName lastName photo')
            .sort({ sentAt: 1 });

        // Mark messages as read asynchronously without blocking response
        Message.updateMany(
            { conversation: conversationId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        ).exec();

        // Reset unread count
        if (conversation.unreadCount && conversation.unreadCount.get(userId.toString()) > 0) {
            conversation.unreadCount.set(userId.toString(), 0);
            await conversation.save();
        }

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. POST /api/messages/conversations
export const createConversation = async (req, res) => {
    try {
        const { recipientId, content } = req.body;
        const schoolId = req.user.school;
        const userId = req.user._id;

        if (userId.toString() === recipientId.toString()) {
            return res.status(400).json({ message: 'Cannot start conversation with yourself' });
        }

        // Validate recipient
        const recipient = await User.findOne({ _id: recipientId, school: schoolId });
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found in this school' });
        }

        // Find existing conversation
        let conversation = await Conversation.findOne({
            school: schoolId,
            participants: { $all: [userId, recipientId] }
        });

        if (!conversation) {
            conversation = new Conversation({
                school: schoolId,
                participants: [userId, recipientId],
                unreadCount: { [recipientId.toString()]: 0, [userId.toString()]: 0 }
            });
            await conversation.save();
        }

        // Create initial message
        const message = new Message({
            conversation: conversation._id,
            sender: userId,
            content,
            readBy: [userId],
            sentAt: Date.now()
        });
        await message.save();

        // Update conversation
        conversation.lastMessage = content;
        conversation.lastMessageAt = Date.now();
        const currentUnread = conversation.unreadCount.get(recipientId.toString()) || 0;
        conversation.unreadCount.set(recipientId.toString(), currentUnread + 1);
        await conversation.save();

        res.status(201).json({ conversation, message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// 4. POST /api/messages/conversations/:conversationId
export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
        if (!conversation) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const message = new Message({
            conversation: conversationId,
            sender: userId,
            content,
            readBy: [userId],
            sentAt: Date.now()
        });
        await message.save();

        const populatedMessage = await Message.findById(message._id).populate('sender', 'firstName lastName photo');

        const otherParticipants = conversation.participants.filter(p => p.toString() !== userId.toString());
        
        conversation.lastMessage = content;
        conversation.lastMessageAt = Date.now();
        
        otherParticipants.forEach(pId => {
            const currentUnread = conversation.unreadCount.get(pId.toString()) || 0;
            conversation.unreadCount.set(pId.toString(), currentUnread + 1);
        });
        
        await conversation.save();

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. PATCH /api/messages/conversations/:conversationId/read
export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.user._id;

        const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
        if (!conversation) {
            return res.status(403).json({ message: 'Access denied' });
        }

        Message.updateMany(
            { conversation: conversationId, readBy: { $ne: userId } },
            { $addToSet: { readBy: userId } }
        ).exec();

        conversation.unreadCount.set(userId.toString(), 0);
        await conversation.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. GET /api/messages/unread-count
export const getUnreadCount = async (req, res) => {
    try {
        const schoolId = req.user.school;
        const userId = req.user._id;

        const conversations = await Conversation.find({ 
            school: schoolId, 
            participants: userId 
        });

        let totalUnread = 0;
        conversations.forEach(conv => {
            if (conv.unreadCount && conv.unreadCount.get(userId.toString())) {
                totalUnread += conv.unreadCount.get(userId.toString());
            }
        });

        res.json({ unreadCount: totalUnread });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
