import React from 'react';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import './VendorViews.css';

const VendorInventoryView = () => {
    const inventory = [
        { id: 1, item: 'Notebooks (Pack of 10)', stock: 45, lowStock: 50, status: 'low' },
        { id: 2, item: 'Pens (Box of 50)', stock: 120, lowStock: 50, status: 'ok' },
        { id: 3, item: 'Pencils (Box of 100)', stock: 35, lowStock: 50, status: 'low' },
    ];

    return (
        <div className="vendor-view-container">
            <div className="view-header">
                <h1 className="view-title">Inventory Management</h1>
                <p className="view-subtitle">Track and manage your inventory</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Stock List</h2>
                        <Package size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="inventory-list">
                            {inventory.map((item) => (
                                <div key={item.id} className="inventory-item">
                                    <div className="inventory-info">
                                        <h4>{item.item}</h4>
                                        <div className="stock-info">
                                            <span>Current Stock: {item.stock}</span>
                                            <span>Low Stock Alert: {item.lowStock}</span>
                                        </div>
                                    </div>
                                    <div className="inventory-status">
                                        {item.status === 'low' && (
                                            <span className="badge badge-warning">
                                                <AlertTriangle size={14} /> Low Stock
                                            </span>
                                        )}
                                        {item.status === 'ok' && (
                                            <span className="badge badge-success">In Stock</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary mt-4">
                            <Plus size={16} />
                            Add New Item
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorInventoryView;

