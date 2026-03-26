import React, { useState, useEffect } from 'react';
import { Clock, Calendar, AlertTriangle, Check, Users, BookOpen, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ManageTimetableModal from './timetable/ManageTimetableModal';
import './parents/ParentsOverview.css';

const SchoolTimetableView = () => {
    const [timetables, setTimetables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const [editingTimetable, setEditingTimetable] = useState(null);

    const fetchTimetables = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timetables`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setTimetables(await res.json());
        } catch (error) {
            toast.error('Failed to load timetables');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTimetables();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this timetable?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timetables/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) {
                toast.success('Deleted successfully');
                fetchTimetables();
            }
        } catch (error) { toast.error('Error deleting'); }
    };

    const kpiCards = [
        { title: "Total Timetables", value: timetables.length, icon: <Calendar size={28} />, color: "#3b82f6", trend: "all classes" },
        { title: "Recently Updated", value: timetables.length, icon: <Clock size={28} />, color: "#10b981", trend: "active" },
        { title: "Conflicts Detected", value: 0, icon: <AlertTriangle size={28} />, color: "#ef4444", trend: "clear" },
        { title: "Teacher Free Periods", value: "N/A", icon: <Users size={28} />, color: "#8b5cf6", trend: "computed dynamically" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Timetable Management</h1>
                    <p className="overview-subtitle">Manage class schedules and teacher assignments</p>
                </div>
                <div className="header-actions">
                     <button className="btn-primary" onClick={() => { setEditingTimetable(null); setIsManageModalOpen(true); }}>
                        <Plus size={18} /> Add Timetable
                     </button>
                </div>
            </div>

            <div className="kpi-grid">
                {kpiCards.map((card, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-icon" style={{ background: `${card.color}15`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="kpi-content">
                            <h3 className="kpi-title">{card.title}</h3>
                            <div className="kpi-value">{card.value}</div>
                            <div className="kpi-trend">{card.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="activity-card" style={{ marginTop: '20px' }}>
                <div className="card-header">
                    <h2 className="card-title"><BookOpen size={20} />Timetables List</h2>
                </div>
                <div className="activity-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', padding: '20px' }}>
                    {timetables.length === 0 ? <p>No timetables added yet.</p> : timetables.map(t => (
                        <div key={t._id} style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{t.class} - {t.section} ({t.day})</h3>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => { setEditingTimetable(t); setIsManageModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(t._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                                </div>
                            </div>
                            <div>
                                {t.periods.map((p, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #cbd5e1', padding: '5px 0', fontSize: '0.9rem' }}>
                                        <span><strong>{p.subject}</strong> ({p.startTime} - {p.endTime})</span>
                                        <span style={{ color: '#64748b' }}>{p.teacher ? `${p.teacher.firstName} ${p.teacher.lastName}` : 'Unassigned'} • RM: {p.room || 'N/A'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ManageTimetableModal 
                isOpen={isManageModalOpen} 
                onClose={() => setIsManageModalOpen(false)} 
                onSave={() => { setIsManageModalOpen(false); fetchTimetables(); }} 
                editingTimetable={editingTimetable} 
            />
        </div>
    );
};

export default SchoolTimetableView;
