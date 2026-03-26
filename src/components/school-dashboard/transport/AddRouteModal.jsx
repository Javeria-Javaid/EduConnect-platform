import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddRouteModal = ({ isOpen, onClose, onSave, vehicles }) => {
    const [formData, setFormData] = useState({
        name: '',
        vehicle: '',
        stops: '',
        status: 'On Time'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const stopsArray = formData.stops.split(',').map(s => s.trim()).filter(Boolean);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/transport/routes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ...formData, stops: stopsArray })
            });
            if (res.ok) {
                onSave();
                setFormData({ name: '', vehicle: '', stops: '', status: 'On Time' });
            }
        } catch (error) { console.error('Error saving route'); }
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">Add Route</h2>
                    <button className="simple-modal-close" onClick={onClose}><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid">
                        <div className="simple-form-group">
                            <label>Route Name *</label>
                            <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Route A - North City" />
                        </div>
                        <div className="simple-form-group">
                            <label>Assign Vehicle *</label>
                            <select required value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}>
                                <option value="">Select a vehicle</option>
                                {vehicles.map(v => <option key={v._id} value={v._id}>{v.number} ({v.type})</option>)}
                            </select>
                        </div>
                        <div className="simple-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Stops (Comma Separated) *</label>
                            <input required value={formData.stops} onChange={e => setFormData({ ...formData, stops: e.target.value })} placeholder="e.g. Station 1, Station 2, Main Gate" />
                        </div>
                        <div className="simple-form-group">
                            <label>Status</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                                <option value="On Time">On Time</option>
                                <option value="Delayed">Delayed</option>
                            </select>
                        </div>
                    </div>
                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="simple-btn-primary">Save Route</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddRouteModal;
