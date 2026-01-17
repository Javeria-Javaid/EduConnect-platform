import React from 'react';
import { DollarSign, CreditCard, PieChart, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { financeStats, recentTransactions, expenseCategories } from './reports/mockData';
import './parents/ParentsOverview.css';

const SchoolFinanceView = () => {
    const { collectedToday, collectedMonth, pendingDues, expensesMonth } = financeStats;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumSignificantDigits: 3 }).format(amount);
    };

    const kpiCards = [
        { title: "Collected Today", value: formatCurrency(collectedToday), icon: <DollarSign size={28} />, color: "#10b981", trend: "daily revenue" },
        { title: "Collected This Month", value: formatCurrency(collectedMonth), icon: <TrendingUp size={28} />, color: "#3b82f6", trend: "monthly revenue" },
        { title: "Pending Dues", value: formatCurrency(pendingDues), icon: <AlertCircle size={28} />, color: "#ef4444", trend: "needs attention" },
        { title: "Monthly Expenses", value: formatCurrency(expensesMonth), icon: <CreditCard size={28} />, color: "#f59e0b", trend: "total spending" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Finance Management</h1>
                    <p className="overview-subtitle">Track fees, expenses, and financial health</p>
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
                    <div className="activity-list">
                        {recentTransactions.map((trx, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-avatar" style={{ background: trx.status === 'Paid' ? '#10b981' : '#f59e0b' }}>
                                    {trx.type[0]}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent">{trx.student} ({trx.class})</div>
                                    <div className="activity-action">{trx.type} • {trx.method} • {trx.date}</div>
                                </div>
                                <div className="activity-time" style={{ fontWeight: 600 }}>
                                    {formatCurrency(trx.amount)}
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
                        {expenseCategories.map((cat, index) => (
                            <div key={index} className="alert-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.9rem', fontWeight: 500 }}>
                                    <span>{cat.category}</span>
                                    <span>{cat.percentage}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${cat.percentage}%`, height: '100%', background: index === 0 ? '#3b82f6' : index === 1 ? '#10b981' : '#f59e0b' }}></div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{formatCurrency(cat.amount)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolFinanceView;
