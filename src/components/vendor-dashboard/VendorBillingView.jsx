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

    const downloadInvoice = (invoice) => {
        try {
            const rows = [
                ['Invoice ID', invoice._id],
                ['School', invoice.school?.name || invoice.school?.schoolName || 'Unknown School'],
                ['Date', new Date(invoice.createdAt).toLocaleDateString()],
                ['Status', invoice.status || 'pending'],
                ['Amount', invoice.totalAmount || invoice.amount || 0],
                [''],
                ['Item', 'Qty', 'Price']
            ];

            (invoice.items || []).forEach((it) => {
                rows.push([it.name || it.productName || 'Item', it.quantity || 1, it.price || 0]);
            });

            const csv = rows.map(r => r.join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Invoice_${invoice._id?.toString().slice(0, 8)}.csv`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            toast.success('Invoice downloaded');
        } catch {
            toast.error('Failed to download invoice');
        }
    };

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
                                            <p>{invoice.school?.name || invoice.school?.schoolName || 'Unknown School'}</p>
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
                                        <button className="btn-download" onClick={() => downloadInvoice(invoice)}>
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

