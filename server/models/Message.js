import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: String,
        required: true,
        trim: true
    },
    recipientType: {
        type: String,
        enum: ['parent', 'student', 'group', 'all'],
        default: 'parent'
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    body: {
        type: String,
        required: true
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
