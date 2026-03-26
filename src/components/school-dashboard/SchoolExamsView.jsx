import React, { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, Award, TrendingUp, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AddExamModal from './AddExamModal';
import ManageMarksModal from './exams/ManageMarksModal';
import './parents/ParentsOverview.css';

const SchoolExamsView = () => {
    const [exams, setExams] = useState([]);
    const [stats, setStats] = useState({
        upcomingCount: 0,
        activeCount: 0,
        completedCount: 0,
        pendingResults: 0,
        topClass: 'N/A',
        lowClass: 'N/A'
    });
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [managingMarksExam, setManagingMarksExam] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const [statsRes, examsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/exams/stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${import.meta.env.VITE_API_URL}/api/exams`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (examsRes.ok) setExams(await examsRes.json());
        } catch (error) {
            toast.error('Error fetching exams data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddExam = async (examData) => {
        try {
            const token = localStorage.getItem('token');
            const url = editingExam ? `${import.meta.env.VITE_API_URL}/api/exams/${editingExam._id}` : `${import.meta.env.VITE_API_URL}/api/exams`;
            const method = editingExam ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(examData)
            });

            if (res.ok) {
                toast.success(editingExam ? 'Exam updated' : 'Exam scheduled');
                setIsAddModalOpen(false);
                setEditingExam(null);
                fetchData();
            } else {
                const err = await res.json();
                toast.error(err.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDeleteExam = async (id) => {
        if (!window.confirm('Are you sure you want to delete this exam? All results will also be deleted.')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Exam deleted');
                fetchData();
            } else {
                toast.error('Failed to delete exam');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const upcoming = exams.filter(e => e.status === 'Scheduled');
    const active = exams.filter(e => e.status === 'Active');

    const kpiCards = [
        { title: "Upcoming Exams", value: stats.upcomingCount, icon: <Calendar size={28} />, color: "#3b82f6", trend: "scheduled" },
        { title: "Active Sessions", value: stats.activeCount, icon: <Clock size={28} />, color: "#10b981", trend: "in progress" },
        { title: "Pending Results", value: stats.pendingResults, icon: <FileText size={28} />, color: "#f59e0b", trend: "to enter" },
        { title: "Completed", value: stats.completedCount, icon: <Award size={28} />, color: "#8b5cf6", trend: "this term" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Exams Management</h1>
                    <p className="overview-subtitle">Manage exam schedules, grades, and report cards</p>
                </div>
                <div className="header-actions">
                     <button className="btn-primary" onClick={() => { setEditingExam(null); setIsAddModalOpen(true); }}>
                        <Plus size={18} /> Schedule Exam
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

            <div className="stats-alerts-row">
                <div className="communication-card" style={{ flex: 2 }}>
                    <div className="card-header">
                        <h2 className="card-title"><Calendar size={20} />Upcoming Exams</h2>
                    </div>
                    <div className="activity-list">
                        {upcoming.length === 0 ? <p style={{ padding: '20px' }}>No upcoming exams.</p> : upcoming.map((exam) => (
                            <div key={exam._id} className="activity-item">
                                <div className="activity-avatar" style={{ background: '#3b82f6', fontSize: '0.8rem' }}>
                                    {exam.term.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {exam.name}
                                        <button onClick={() => { setEditingExam(exam); setIsAddModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={14} /></button>
                                        <button onClick={() => handleDeleteExam(exam._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                    </div>
                                    <div className="activity-action">{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</div>
                                </div>
                                <div className="activity-time">{exam.classes.join(', ')}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title"><TrendingUp size={20} />Performance</h2>
                    </div>
                    <div className="alerts-list">
                        <div className="alert-item alert-info">
                            <div className="alert-icon"><Award size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Top Performing</div>
                                <div className="alert-count">{stats.topClass}</div>
                            </div>
                        </div>
                        <div className="alert-item alert-warning">
                            <div className="alert-icon"><AlertCircle size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Needs Attention</div>
                                <div className="alert-count">{stats.lowClass}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {active.length > 0 && (
                <div className="activity-card">
                    <div className="card-header">
                        <h2 className="card-title"><Clock size={20} />Active Exam Sessions</h2>
                    </div>
                    <div className="activity-list">
                        {active.map((exam) => (
                            <div key={exam._id} className="activity-item">
                                <div className="activity-avatar" style={{ background: '#10b981', fontSize: '0.8rem' }}>
                                    {exam.term.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {exam.name}
                                        <button onClick={() => { setEditingExam(exam); setIsAddModalOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}><Edit size={14} /></button>
                                        <button onClick={() => handleDeleteExam(exam._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                    </div>
                                    <div className="activity-action">{new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}</div>
                                </div>
                                <div className="activity-time">
                                    <button className="btn-action-sm" onClick={() => setManagingMarksExam(exam)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Manage Marks</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AddExamModal 
                isOpen={isAddModalOpen} 
                onClose={() => { setIsAddModalOpen(false); setEditingExam(null); }} 
                onSubmit={handleAddExam} 
                editingExam={editingExam} 
            />

            <ManageMarksModal
                isOpen={!!managingMarksExam}
                onClose={() => setManagingMarksExam(null)}
                exam={managingMarksExam}
            />
        </div>
    );
};

export default SchoolExamsView;
