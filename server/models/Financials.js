import mongoose from 'mongoose';

const financialsSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ['Income', 'Expense'], required: true },
  category: { type: String, default: 'General' },
  description: { type: String },
  date: { type: Date, default: Date.now },
  schoolRef: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }
}, { timestamps: true });

const Financials = mongoose.model('Financials', financialsSchema);
export default Financials;
