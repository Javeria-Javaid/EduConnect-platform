import React, { useState, useEffect } from 'react';
import { Package, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import './VendorViews.css';

const VendorInventoryView = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', stock: '', category: '' });

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/products`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) setInventory(await res.json());
        } catch (error) { toast.error('Failed to load inventory'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProducts(); }, []);

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) || 0 })
            });
            if (res.ok) {
                toast.success('Product added');
                setIsAdding(false);
                setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
                fetchProducts();
            } else {
                toast.error('Error adding product');
            }
        } catch (error) { toast.error('Network error'); }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Deleted');
                fetchProducts();
            }
        } catch (error) { toast.error('Network error'); }
    };

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
                        {isAdding && (
                            <form onSubmit={handleAddProduct} style={{ marginBottom: '20px', padding: '15px', background: '#f0f9ff', borderRadius: '8px' }}>
                                <h3 style={{ marginBottom: '10px' }}>Add New Product</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <input placeholder="Product Name" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="Category" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="Price" type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                    <input placeholder="Stock Quantity" type="number" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                </div>
                                <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ width: '100%', marginTop: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                                <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                                    <button type="submit" className="btn-primary">Save Product</button>
                                    <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
                                </div>
                            </form>
                        )}

                        <div className="inventory-list">
                            {inventory.length === 0 && !loading && <p>No products found.</p>}
                            {inventory.map((item) => (
                                <div key={item._id} className="inventory-item">
                                    <div className="inventory-info" style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <h4>{item.name}</h4>
                                            <span style={{ fontSize: '0.85rem', color: '#666' }}>({item.category})</span>
                                        </div>
                                        <div className="stock-info">
                                            <span>Current Stock: {item.stock}</span>
                                            <span>Price: ${item.price}</span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>{item.description}</p>
                                    </div>
                                    <div className="inventory-status" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                        {item.stock < 5 ? (
                                            <span className="badge badge-warning">
                                                <AlertTriangle size={14} /> Low Stock
                                            </span>
                                        ) : (
                                            <span className="badge badge-success">In Stock</span>
                                        )}
                                        <button onClick={() => handleDeleteProduct(item._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '5px' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {!isAdding && (
                            <button className="btn-primary mt-4" onClick={() => setIsAdding(true)}>
                                <Plus size={16} /> Add New Item
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorInventoryView;

