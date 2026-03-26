import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true },
    type: { type: String, enum: ['Income', 'Expense'], required: true },
    category: { type: String, required: true }, // e.g. Tuition Fee, Salary, Utility
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference for Income
    description: { type: String },
    method: { type: String, enum: ['Cash', 'Bank Transfer', 'Online', 'Cheque', 'Other'], default: 'Cash' }
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
