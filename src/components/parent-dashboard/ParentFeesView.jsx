import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, FileText, CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentFeesView = () => {
    const [data, setData] = useState({ activeChildData: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeeData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { toast.error('Error fetching fee data'); }
            finally { setLoading(false); }
        };
        fetchFeeData();
    }, []);

    const paymentHistory = data.activeChildData?.transactions || [];
    const feeInvoices = []; // Placeholders since we only do transactions. Or use pending transactions as invoices.

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
                        {loading ? <p>Loading invoices...</p> : feeInvoices.length === 0 ? <p>No generated invoices.</p> : (
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
                        )}
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Payment History</h2>
                        <CreditCard size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading payments...</p> : paymentHistory.length === 0 ? <p>No payment history found.</p> : (
                            <div className="payments-list">
                                {paymentHistory.map((payment) => (
                                    <div key={payment._id} className="payment-item">
                                        <div className="payment-info">
                                            <h4>{new Date(payment.date).toLocaleDateString()}</h4>
                                            <p>{payment.method} - {payment.category}</p>
                                        </div>
                                        <div className="payment-amount">
                                            <span>PKR {payment.amount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentFeesView;

