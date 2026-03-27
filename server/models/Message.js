import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: String,
        trim: true
    },
    recipientType: {
        type: String,
        enum: ['parent', 'student', 'group', 'all', 'individual'], // Added individual
        default: 'parent'
    },
    subject: {
        type: String,
        trim: true
    },
    // New Fields for Chat Conversations
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    content: {
        type: String,
        trim: true
    },
    readBy: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }],
    sentAt: {
        type: Date,
        default: Date.now
    },
    body: {
        type: String
    },
    sentDate: {
        type: Date,
        default: Date.now
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readDate: {
        type: Date
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
