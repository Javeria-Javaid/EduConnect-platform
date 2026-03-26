import React, { useState, useEffect } from 'react';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Calendar, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import './TeacherDashboardOverview.css';

const TeacherHomeworkView = () => {
    const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState(null);
    const [homeworkList, setHomeworkList] = useState([]);
    const [teacherClasses, setTeacherClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '', classId: '', description: '', dueDate: '', maxMarks: 100
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const classesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const hwRes = await fetch(`${import.meta.env.VITE_API_URL}/api/homework`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (classesRes.ok && hwRes.ok) {
                    const classesData = await classesRes.json();
                    const assignedClasses = [];
                    classesData.forEach(c => {
                        c.sections.forEach(s => {
                            if (s.classTeacher && s.classTeacher._id === user._id) {
                                assignedClasses.push({
                                    id: `${c.name}-${s.name}`,
                                    grade: c.name,
                                    section: s.name,
                                    subject: c.name + ' - ' + s.name
                                });
                            }
                        });
                    });
                    setTeacherClasses(assignedClasses);
                    setHomeworkList(await hwRes.json());
                }
            } catch (error) { toast.error('Failed to load data'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    const handleCreateHomework = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const classObj = teacherClasses.find(c => c.id === formData.classId);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/homework`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    class: classObj.grade,
                    section: classObj.section,
                    subject: classObj.subject,
                    dueDate: formData.dueDate,
                    maxMarks: formData.maxMarks
                })
            });
            if (res.ok) {
                const newHw = await res.json();
                setHomeworkList([newHw, ...homeworkList]);
                setShowCreateForm(false);
                toast.success('Homework created successfully');
            } else {
                toast.error('Failed to create homework');
            }
        } catch (error) { toast.error('Networking error'); }
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Homework & Assignments</h1>
                    <p className="page-subtitle">Create, track, and grade homework assignments</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus size={16} /> Create Homework
                </button>
            </div>

            {/* Stats Overview */}
            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                        <FileText size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Total Assignments</h3>
                        <div className="kpi-value">{homeworkList.length}</div>
                        <div className="kpi-change">Active</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Submitted</h3>
                        <div className="kpi-value">65</div>
                        <div className="kpi-change">Out of 90 total</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Pending Grading</h3>
                        <div className="kpi-value">35</div>
                        <div className="kpi-change">To be graded</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Overdue</h3>
                        <div className="kpi-value">8</div>
                        <div className="kpi-change">Not submitted</div>
                    </div>
                </div>
            </div>

            {showCreateForm && (
                <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <h2 className="card-title">Create New Homework</h2>
                        <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                    </div>
                    <div className="card-body">
                        <form style={{ display: 'grid', gap: '16px' }} onSubmit={handleCreateHomework}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Assignment title" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Class</label>
                                <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                    <option value="">{teacherClasses.length === 0 ? "No classes assigned to you" : "Select Class"}</option>
                                    {teacherClasses.map(c => (
                                        <option key={c.id} value={c.id}>{c.subject}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Due Date</label>
                                    <input type="date" required value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Max Marks</label>
                                    <input type="number" required value={formData.maxMarks} onChange={e => setFormData({...formData, maxMarks: e.target.value})} placeholder="100" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                                <textarea rows="4" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Assignment details and instructions" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Attach Files</label>
                                <div style={{ border: '2px dashed #e5e7eb', borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                                    <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
                                    <p style={{ color: '#6b7280' }}>Click to upload or drag and drop</p>
                                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>PDF, DOC, or images (max 10MB)</p>
                                </div>
                            </div>
                            <button type="submit" className="btn-primary">
                                Create Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Homework List */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">All Assignments</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {loading ? <p>Loading homework...</p> : homeworkList.length === 0 ? <p>No assignments created yet.</p> : homeworkList.map((hw) => (
                            <div key={hw._id} style={{
                                padding: '20px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onClick={() => setSelectedHomework(selectedHomework?._id === hw._id ? null : hw)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{hw.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{hw.class} {hw.section} • {hw.subject}</p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        backgroundColor: new Date(hw.dueDate) > new Date() ? '#dbeafe' : '#fee2e2',
                                        color: new Date(hw.dueDate) > new Date() ? '#1e40af' : '#991b1b'
                                    }}>
                                        {new Date(hw.dueDate) > new Date() ? 'Active' : 'Overdue'}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', fontSize: '14px' }}>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Due:</span>
                                        <p style={{ fontWeight: '500' }}>{new Date(hw.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Max Marks:</span>
                                        <p style={{ fontWeight: '500' }}>{hw.maxMarks}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Submitted:</span>
                                        <p style={{ fontWeight: '500', color: '#10b981' }}>{hw.submissions?.length || 0}</p>
                                    </div>
                                </div>

                                {selectedHomework?._id === hw._id && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{hw.description}</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-primary" style={{ fontSize: '14px' }}>Grade Submissions</button>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>View Details</button>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>Send Reminder</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHomeworkView;
