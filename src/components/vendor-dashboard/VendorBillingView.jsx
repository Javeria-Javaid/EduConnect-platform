import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import './VendorViews.css';

const VendorBillingView = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/orders`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data);
                }
            } catch (error) { toast.error('Failed to load invoices'); }
            finally { setLoading(false); }
        };
        fetchInvoices();
    }, []);

    return (
        <div className="vendor-view-container">
            <div className="view-header">
                <h1 className="view-title">Billing & Payments</h1>
                <p className="view-subtitle">Manage invoices and payment history</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Invoices</h2>
                        <FileText size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading billing info...</p> : invoices.length === 0 ? <p>No billing records found.</p> : (
                            <div className="invoices-table">
                                {invoices.map((invoice) => (
                                    <div key={invoice._id} className="invoice-row">
                                        <div className="invoice-info">
                                            <h4>{invoice._id.toString().substring(0,8).toUpperCase()}</h4>
                                            <p>{invoice.school?.schoolName || 'Unknown School'}</p>
                                            <span className="invoice-date">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="invoice-amount">${invoice.totalAmount}</div>
                                        <div className="invoice-status">
                                            {invoice.status === 'completed' || invoice.status === 'delivered' ? (
                                                <span className="badge badge-success">Paid</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending</span>
                                            )}
                                        </div>
                                        <button className="btn-download">
                                            <Download size={16} />
                                            Download
                                        </button>
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

export default VendorBillingView;

