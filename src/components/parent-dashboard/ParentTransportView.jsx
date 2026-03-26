import React, { useState, useEffect } from 'react';
import { Bus, MapPin, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentTransportView = () => {
    const [data, setData] = useState({ activeChildData: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransportData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { toast.error('Error fetching transport data'); }
            finally { setLoading(false); }
        };
        fetchTransportData();
    }, []);

    const hasTransport = false; // Mocking false since no route explicit assign logic exists in the child data API yet.
    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Transport Tracking</h1>
                <p className="view-subtitle">View transport route and driver information</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Transport Information</h2>
                        <Bus size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading...</p> : !hasTransport ? <p>Student does not have an active transport route assigned.</p> : (
                            <div className="transport-details">
                                <div className="detail-item">
                                    <span className="detail-label">Route</span>
                                    <span className="detail-value">TBD</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Vehicle Number</span>
                                    <span className="detail-value">TBD</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Status</span>
                                    <span className="badge badge-success">active</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentTransportView;

