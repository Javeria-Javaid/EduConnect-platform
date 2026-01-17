import React from 'react';
import { DollarSign, CreditCard, FileText, CheckCircle, Download } from 'lucide-react';
import './ParentViews.css';

const ParentFeesView = () => {
    const feeInvoices = [
        { id: 1, month: 'December 2025', amount: '$500', dueDate: 'Dec 5, 2025', status: 'paid', paymentDate: 'Dec 1, 2025' },
        { id: 2, month: 'January 2026', amount: '$500', dueDate: 'Jan 5, 2026', status: 'pending', paymentDate: null },
    ];

    const paymentHistory = [
        { id: 1, date: 'Dec 1, 2025', amount: '$500', method: 'Online Payment', receipt: 'REC-001' },
        { id: 2, date: 'Nov 1, 2025', amount: '$500', method: 'Bank Transfer', receipt: 'REC-002' },
    ];

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Fees & Payments</h1>
                <p className="view-subtitle">Manage fee payments and view payment history</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Fee Invoices</h2>
                        <FileText size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="invoices-list">
                            {feeInvoices.map((invoice) => (
                                <div key={invoice.id} className="invoice-item">
                                    <div className="invoice-info">
                                        <h4>{invoice.month}</h4>
                                        <p>Due Date: {invoice.dueDate}</p>
                                    </div>
                                    <div className="invoice-amount">
                                        <span className="amount">{invoice.amount}</span>
                                        {invoice.status === 'paid' ? (
                                            <span className="badge badge-success">Paid</span>
                                        ) : (
                                            <span className="badge badge-warning">Pending</span>
                                        )}
                                    </div>
                                    {invoice.status === 'pending' && (
                                        <button className="btn-primary">Pay Now</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Payment History</h2>
                        <CreditCard size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="payments-list">
                            {paymentHistory.map((payment) => (
                                <div key={payment.id} className="payment-item">
                                    <div className="payment-info">
                                        <h4>{payment.date}</h4>
                                        <p>{payment.method}</p>
                                        <span className="payment-receipt">Receipt: {payment.receipt}</span>
                                    </div>
                                    <div className="payment-amount">
                                        <span>{payment.amount}</span>
                                        <button className="btn-download">
                                            <Download size={16} />
                                            Receipt
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentFeesView;

