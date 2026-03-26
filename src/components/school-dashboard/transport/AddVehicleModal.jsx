import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddVehicleModal = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        number: '',
        type: 'Bus',
        capacity: 40,
        driver: '',
        status: 'Active'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transport/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSave();
                setFormData({ number: '', type: 'Bus', capacity: 40, driver: '', status: 'Active' });
            }
        } catch (error) { console.error('Error saving vehicle'); }
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">Add Vehicle</h2>
                    <button className="simple-modal-close" onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid">
                        <div className="simple-form-group">
                            <label>Vehicle Number *</label>
                            <input required value={formData.number} onChange={e => setFormData({ ...formData, number: e.target.value })} placeholder="e.g. ABC-123" />
                        </div>
                        <div className="simple-form-group">
                            <label>Type *</label>
                            <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                <option value="Bus">Bus</option>
                                <option value="Van">Van</option>
                                <option value="Car">Car</option>
                            </select>
                        </div>
                        <div className="simple-form-group">
                            <label>Capacity *</label>
                            <input required type="number" min="1" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })} />
                        </div>
                        <div className="simple-form-group">
                            <label>Driver Name *</label>
                            <input required value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })} />
                        </div>
                        <div className="simple-form-group">
                            <label>Status *</label>
                            <select required value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Active">Active</option>
                                <option value="In Maintenance">In Maintenance</option>
                                <option value="Out of Service">Out of Service</option>
                            </select>
                        </div>
                    </div>
                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="simple-btn-primary">Save Vehicle</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddVehicleModal;
