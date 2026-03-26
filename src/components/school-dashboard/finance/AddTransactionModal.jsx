import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddTransactionModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        type: 'Income',
        category: 'Tuition Fee',
        amount: 0,
        status: 'Paid',
        method: 'Cash',
        description: ''
    });

    const incomeCategories = ['Tuition Fee', 'Transport Fee', 'Library Fee', 'Other Income'];
    const expenseCategories = ['Salary', 'Utilities', 'Maintenance', 'Supplies', 'Other Expense'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/finance`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSave();
                setFormData({ type: 'Income', category: 'Tuition Fee', amount: 0, status: 'Paid', method: 'Cash', description: '' });
            }
        } catch (error) {
            console.error('Failed to create transaction', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">Record Transaction</h2>
                    <button className="simple-modal-close" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid">
                        <div className="simple-form-group">
                            <label>Type *</label>
                            <select required value={formData.type} onChange={e => {
                                const newType = e.target.value;
                                setFormData({ ...formData, type: newType, category: newType === 'Income' ? 'Tuition Fee' : 'Salary' });
                            }}>
                                <option value="Income">Income (Fees)</option>
                                <option value="Expense">Expense</option>
                            </select>
                        </div>
                        <div className="simple-form-group">
                            <label>Category *</label>
                            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                {(formData.type === 'Income' ? incomeCategories : expenseCategories).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div className="simple-form-group">
                            <label>Amount (PKR) *</label>
                            <input required type="number" min="0" value={formData.amount} onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })} />
                        </div>
                        <div className="simple-form-group">
                            <label>Method *</label>
                            <select required value={formData.method} onChange={e => setFormData({ ...formData, method: e.target.value })}>
                                <option value="Cash">Cash</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Online">Online</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </div>
                        <div className="simple-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Description (Optional)</label>
                            <input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="e.g. August Tuition Fee" />
                        </div>
                    </div>
                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="simple-btn-primary">Save Transaction</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddTransactionModal;
