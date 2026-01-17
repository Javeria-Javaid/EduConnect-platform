import React from 'react';
import { DollarSign, FileText, Download, CheckCircle } from 'lucide-react';
import './VendorViews.css';

const VendorBillingView = () => {
    const invoices = [
        { id: 1, invoice: 'INV-001', school: 'Greenwood High', amount: '$1,200', date: 'Dec 1, 2025', status: 'paid' },
        { id: 2, invoice: 'INV-002', school: 'Riverside Academy', amount: '$850', date: 'Nov 28, 2025', status: 'paid' },
        { id: 3, invoice: 'INV-003', school: 'Sunshine Elementary', amount: '$450', date: 'Dec 5, 2025', status: 'pending' },
    ];

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
                        <div className="invoices-table">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="invoice-row">
                                    <div className="invoice-info">
                                        <h4>{invoice.invoice}</h4>
                                        <p>{invoice.school}</p>
                                        <span className="invoice-date">{invoice.date}</span>
                                    </div>
                                    <div className="invoice-amount">{invoice.amount}</div>
                                    <div className="invoice-status">
                                        {invoice.status === 'paid' ? (
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorBillingView;

