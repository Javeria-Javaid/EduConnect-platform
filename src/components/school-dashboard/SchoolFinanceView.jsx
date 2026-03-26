import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, PieChart, TrendingUp, FileText, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AddTransactionModal from './finance/AddTransactionModal';
import './parents/ParentsOverview.css';

const SchoolFinanceView = () => {
    const [stats, setStats] = useState({ collectedToday: 0, collectedMonth: 0, pendingDues: 0, expensesMonth: 0, expenseCategories: [] });
    const [transactions, setTransactions] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [statsRes, trxRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/finance/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_URL}/api/finance`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            if (statsRes.ok) setStats(await statsRes.json());
            if (trxRes.ok) setTransactions(await trxRes.json());
        } catch (error) { toast.error('Error fetching finance data'); }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/finance/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success('Deleted successfully');
                fetchData();
            }
        } catch (error) { toast.error('Error deleting'); }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumSignificantDigits: 3 }).format(amount);
    };

    const kpiCards = [
        { title: "Collected Today", value: formatCurrency(stats.collectedToday), icon: <DollarSign size={28} />, color: "#10b981", trend: "daily revenue" },
        { title: "Collected This Month", value: formatCurrency(stats.collectedMonth), icon: <TrendingUp size={28} />, color: "#3b82f6", trend: "monthly revenue" },
        { title: "Pending Dues", value: formatCurrency(stats.pendingDues), icon: <AlertCircle size={28} />, color: "#ef4444", trend: "needs attention" },
        { title: "Monthly Expenses", value: formatCurrency(stats.expensesMonth), icon: <CreditCard size={28} />, color: "#f59e0b", trend: "total spending" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Finance Management</h1>
                    <p className="overview-subtitle">Track fees, expenses, and financial health</p>
                </div>
                <div className="header-actions">
                     <button className="btn-primary" onClick={() => setIsAddModalOpen(true)}>
                        <Plus size={18} /> Add Transaction
                     </button>
                </div>
            </div>

            <div className="kpi-grid">
                {kpiCards.map((card, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-icon" style={{ background: `${card.color}15`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="kpi-content">
                            <h3 className="kpi-title">{card.title}</h3>
                            <div className="kpi-value" style={{ fontSize: '1.5rem' }}>{card.value}</div>
                            <div className="kpi-trend">{card.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-alerts-row">
                <div className="communication-card">
                    <div className="card-header">
                        <h2 className="card-title"><FileText size={20} />Recent Transactions</h2>
                    </div>
                    <div className="activity-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {transactions.length === 0 ? <p style={{ padding: '20px' }}>No transactions recorded.</p> : transactions.map((trx) => (
                            <div key={trx._id} className="activity-item">
                                <div className="activity-avatar" style={{ background: trx.type === 'Income' ? '#10b981' : '#f59e0b', fontSize: '0.8rem' }}>
                                    {trx.type.substring(0, 3).toUpperCase()}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent" style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                        {trx.category} {trx.student ? `(${trx.student.firstName} ${trx.student.lastName})` : ''}
                                        <button onClick={() => handleDelete(trx._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={13} /></button>
                                    </div>
                                    <div className="activity-action">{new Date(trx.date).toLocaleDateString()} • {trx.method} {trx.description ? `• ${trx.description}` : ''}</div>
                                </div>
                                <div className="activity-time" style={{ fontWeight: 600, color: trx.type === 'Income' ? '#10b981' : '#f59e0b' }}>
                                    {trx.type === 'Income' ? '+' : '-'}{formatCurrency(trx.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title"><PieChart size={20} />Expense Breakdown</h2>
                    </div>
                    <div className="alerts-list">
                        {stats.expenseCategories.length === 0 ? <p style={{ padding: '20px' }}>No expenses recorded.</p> : stats.expenseCategories.map((cat, index) => (
                            <div key={index} className="alert-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.9rem', fontWeight: 500 }}>
                                    <span>{cat.category}</span>
                                    <span>{cat.percentage}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${cat.percentage}%`, height: '100%', background: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : index === 2 ? '#f59e0b' : '#8b5cf6' }}></div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatCurrency(cat.amount)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <AddTransactionModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSave={() => { setIsAddModalOpen(false); fetchData(); toast.success('Transaction saved'); }} 
            />
        </div>
    );
};

export default SchoolFinanceView;
