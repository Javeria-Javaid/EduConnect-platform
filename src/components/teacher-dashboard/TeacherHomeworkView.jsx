import React, { useEffect, useMemo, useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
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
    const [gradeDrafts, setGradeDrafts] = useState({});

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

    const kpis = useMemo(() => {
        const now = new Date();
        const list = homeworkList || [];

        const assignmentsWithAnySubmission = list.filter(hw => (hw.submissions || []).length > 0).length;
        const submittedAssignments = list.filter(hw => (hw.submissions || []).some(s => s.status === 'Submitted' || s.status === 'Graded')).length;
        const pendingGradingAssignments = list.filter(hw => (hw.submissions || []).some(s => s.status === 'Submitted')).length;
        const overdueAssignments = list.filter(hw => {
            if (!hw.dueDate) return false;
            const isOverdue = new Date(hw.dueDate) < now;
            if (!isOverdue) return false;
            return (hw.submissions || []).some(s => s.status !== 'Graded');
        }).length;

        return {
            totalAssignments: list.length,
            submittedAssignments: submittedAssignments || assignmentsWithAnySubmission,
            pendingGradingAssignments,
            overdueAssignments
        };
    }, [homeworkList]);

    const handleGradeSubmission = async (homeworkId, studentId) => {
        const draft = gradeDrafts[studentId] || {};
        const marks = Number(draft.marks);
        const feedback = draft.feedback || '';

        if (!Number.isFinite(marks)) {
            toast.error('Enter marks to grade.');
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/homework/${homeworkId}/grade`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ marks, feedback, studentId })
            });

            const data = await res.json().catch(() => null);
            if (!res.ok) {
                toast.error(data?.message || 'Failed to grade submission');
                return;
            }

            setHomeworkList(prev => prev.map(hw => hw._id === homeworkId ? data : hw));
            setSelectedHomework(prev => (prev && prev._id === homeworkId ? data : prev));
            setGradeDrafts(prev => {
                const next = { ...prev };
                delete next[studentId];
                return next;
            });
            toast.success('Submission graded');
        } catch {
            toast.error('Network error while grading');
        }
    };

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
                        <div className="kpi-value">{kpis.totalAssignments}</div>
                        <div className="kpi-change">Active</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Submitted</h3>
                        <div className="kpi-value">{kpis.submittedAssignments}</div>
                        <div className="kpi-change">Based on submissions</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Pending Grading</h3>
                        <div className="kpi-value">{kpis.pendingGradingAssignments}</div>
                        <div className="kpi-change">To be graded</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Overdue</h3>
                        <div className="kpi-value">{kpis.overdueAssignments}</div>
                        <div className="kpi-change">Needs attention</div>
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
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            {(hw.submissions || []).length === 0 ? (
                                                <p style={{ color: '#64748b' }}>No submissions yet.</p>
                                            ) : (
                                                (hw.submissions || []).map((sub) => {
                                                    const studentId =
                                                        typeof sub.student === 'object' ? sub.student?._id || sub.student?.id : sub.student;
                                                    const studentLabel = typeof sub.student === 'object' ? sub.student?.admissionNumber : studentId;

                                                    const status = sub.status || 'Pending';
                                                    const isGraded = status === 'Graded';

                                                    const draft = gradeDrafts[studentId] || { marks: '', feedback: sub.feedback || '' };

                                                    return (
                                                        <div key={`${hw._id}-${studentId}`} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12, background: '#fff' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 8 }}>
                                                                <div>
                                                                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Student: {studentLabel || '—'}</div>
                                                                    <div style={{ fontSize: 12, color: '#64748b' }}>Current status: {status}</div>
                                                                </div>
                                                                <span className={isGraded ? 'badge badge-success' : 'badge badge-warning'}>
                                                                    {isGraded ? 'Graded' : status}
                                                                </span>
                                                            </div>

                                                            {!isGraded && (
                                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                                                    <div>
                                                                        <label style={{ display: 'block', fontSize: 12, color: '#475569', fontWeight: 600, marginBottom: 6 }}>Marks</label>
                                                                        <input
                                                                            type="number"
                                                                            value={draft.marks}
                                                                            onChange={(e) => setGradeDrafts(prev => ({
                                                                                ...prev,
                                                                                [studentId]: { ...(prev[studentId] || {}), marks: e.target.value, feedback: draft.feedback }
                                                                            }))}
                                                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: 6 }}
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label style={{ display: 'block', fontSize: 12, color: '#475569', fontWeight: 600, marginBottom: 6 }}>Feedback</label>
                                                                        <input
                                                                            type="text"
                                                                            value={draft.feedback}
                                                                            onChange={(e) => setGradeDrafts(prev => ({
                                                                                ...prev,
                                                                                [studentId]: { ...(prev[studentId] || {}), feedback: e.target.value, marks: draft.marks }
                                                                            }))}
                                                                            placeholder="Short feedback"
                                                                            style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: 6 }}
                                                                        />
                                                                    </div>

                                                                    <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
                                                                        <button
                                                                            type="button"
                                                                            className="btn-primary"
                                                                            onClick={() => handleGradeSubmission(hw._id, studentId)}
                                                                        >
                                                                            Grade Submission
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })
                                            )}
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
