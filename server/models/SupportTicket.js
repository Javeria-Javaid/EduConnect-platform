import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    subject: { type: String, required: true },
    user: { type: String, required: true }, // Name/Role of requester
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    messages: [
      {
        sender: { type: String, required: true }, // 'admin' or 'user'
        text: { type: String, required: true },
        time: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('SupportTicket', supportTicketSchema);
