import React, { useState, useEffect } from 'react';
import { Book, Users, AlertCircle, TrendingUp, BookOpen, UserCheck, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AddClassModal from './classes/AddClassModal';
import './parents/ParentsOverview.css';

const SchoolClassesView = () => {
    const [stats, setStats] = useState({
        totalClasses: 0,
        totalSections: 0,
        avgStudents: 0,
        teacherAssignment: 0,
        recentlyAdded: 0,
        issues: []
    });
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [statsRes, classesRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (classesRes.ok) setClasses(await classesRes.json());
        } catch (error) {
            toast.error('Error fetching classes data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddClass = async (classData) => {
        try {
            const token = localStorage.getItem('token');
            const url = editingClass 
                ? `${import.meta.env.VITE_API_URL}/api/schools/classes/${editingClass._id}`
                : `${import.meta.env.VITE_API_URL}/api/schools/classes`;
            const method = editingClass ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(classData)
            });

            if (res.ok) {
                toast.success(editingClass ? 'Class updated' : 'Class added');
                setIsAddModalOpen(false);
                setEditingClass(null);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDeleteClass = async (id) => {
        if (!window.confirm('Are you sure you want to delete this class? All sections and associations will be removed.')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Class deleted');
                fetchData();
            } else {
                toast.error('Failed to delete class');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const kpiCards = [
        { title: "Total Classes", value: stats.totalClasses, icon: <Book size={28} />, color: "#3b82f6", trend: `${stats.totalSections} sections` },
        { title: "Avg Students", value: stats.avgStudents, icon: <Users size={28} />, color: "#10b981", trend: "per class" },
        { title: "Teacher Assignment", value: `${stats.teacherAssignment}%`, icon: <UserCheck size={28} />, color: "#f59e0b", trend: "completed" },
        { title: "Recently Added", value: stats.recentlyAdded, icon: <TrendingUp size={28} />, color: "#8b5cf6", trend: "this month" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Classes Management</h1>
                    <p className="overview-subtitle">Manage classes, sections, and student assignments</p>
                </div>
                <div className="header-actions">
                     <button className="btn-primary" onClick={() => { setEditingClass(null); setIsAddModalOpen(true); }}>
                        <Plus size={18} /> Add Class
                     </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading classes...</div>
            ) : (
                <>
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

                    <div className="stats-alerts-row">
                        <div className="communication-card">
                            <div className="card-header">
                                <h2 className="card-title"><BookOpen size={20} />Classes List</h2>
                            </div>
                            <div className="activity-list">
                                {classes.length === 0 ? (
                                    <p style={{ padding: '20px' }}>No classes found. Add your first class!</p>
                                ) : (
                                    classes.map((cls) => (
                                        <div key={cls._id} className="activity-item" style={{ marginBottom: '15px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{cls.name}</div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button onClick={() => { setEditingClass(cls); setIsAddModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={16} /></button>
                                                        <button onClick={() => handleDeleteClass(cls._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                                                    {cls.sections.map((sec, idx) => (
                                                        <div key={idx} style={{ background: '#f8fafc', padding: '8px', borderRadius: '6px', fontSize: '0.9rem' }}>
                                                            <div style={{ fontWeight: '600' }}>Section {sec.name}</div>
                                                            <div style={{ color: '#64748b' }}>Teacher: {sec.classTeacher ? `${sec.classTeacher.firstName} ${sec.classTeacher.lastName}` : 'Unassigned'}</div>
                                                            <div style={{ color: '#64748b' }}>Students: {sec.studentCount} / {sec.capacity}</div>
                                                            <div style={{ color: '#64748b' }}>Room: {sec.roomNumber || 'N/A'}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="alerts-card">
                            <div className="card-header">
                                <h2 className="card-title"><AlertCircle size={20} />Issues</h2>
                            </div>
                            <div className="alerts-list">
                                {stats.issues.length === 0 ? (
                                    <div className="alert-item alert-success" style={{ background: '#f0fdf4', color: '#166534', border: 'none' }}>
                                        <div className="alert-icon"><UserCheck size={18} /></div>
                                        <div className="alert-content">No issues detected</div>
                                    </div>
                                ) : (
                                    stats.issues.map((issue, index) => (
                                        <div key={index} className="alert-item alert-warning">
                                            <div className="alert-icon"><AlertCircle size={18} /></div>
                                            <div className="alert-content">
                                                <div className="alert-label">{issue.type}</div>
                                                <div className="alert-count">{issue.count} classes</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <AddClassModal 
                isOpen={isAddModalOpen} 
                onClose={() => { setIsAddModalOpen(false); setEditingClass(null); }} 
                onSubmit={handleAddClass} 
                editingClass={editingClass} 
            />
        </div>
    );
};

export default SchoolClassesView;
