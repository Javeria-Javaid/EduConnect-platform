import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Plus, TrendingUp, Download, Award, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import './TeacherDashboardOverview.css';

const TeacherExamsView = () => {
    const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [examsList, setExamsList] = useState([]);
    const [teacherClasses, setTeacherClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '', classId: '', totalMarks: 100, date: '', duration: '2 hours', type: 'Mid Term'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                const classesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                const examsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/exams`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (classesRes.ok && examsRes.ok) {
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
                    setExamsList(await examsRes.json());
                }
            } catch (error) { toast.error('Failed to load data'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const classObj = teacherClasses.find(c => c.id === formData.classId);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exams`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    title: formData.title,
                    type: formData.type,
                    class: classObj.grade,
                    section: classObj.section,
                    subject: classObj.subject,
                    startDate: formData.date,
                    endDate: formData.date,
                    totalMarks: formData.totalMarks,
                    status: 'Scheduled'
                })
            });
            if (res.ok) {
                const newExam = await res.json();
                setExamsList([newExam, ...examsList]);
                setShowCreateForm(false);
                toast.success('Exam created successfully');
            } else {
                toast.error('Failed to create exam');
            }
        } catch (error) { toast.error('Error creating exam'); }
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Exams & Results</h1>
                    <p className="page-subtitle">Manage exams, upload marks, and publish results</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus size={16} /> Create Exam
                </button>
            </div>

            {/* Stats */}
            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                        <FileSpreadsheet size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Total Exams</h3>
                        <div className="kpi-value">{examsList.length}</div>
                        <div className="kpi-change">This term</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Avg Score</h3>
                        <div className="kpi-value">76.5%</div>
                        <div className="kpi-change">Across all exams</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                        <Award size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Highest Score</h3>
                        <div className="kpi-value">98</div>
                        <div className="kpi-change">This term</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}>
                        <Users size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Students</h3>
                        <div className="kpi-value">116</div>
                        <div className="kpi-change">Evaluated</div>
                    </div>
                </div>
            </div>

            {showCreateForm && (
                <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <h2 className="card-title">Create New Exam</h2>
                        <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                    </div>
                    <div className="card-body">
                        <form style={{ display: 'grid', gap: '16px' }} onSubmit={handleCreateExam}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Title</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g., Mid-Term Mathematics" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Class</label>
                                    <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                        <option value="">Select Class</option>
                                        {teacherClasses.map(c => (
                                            <option key={c.id} value={c.id}>{c.subject}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Total Marks</label>
                                    <input type="number" required value={formData.totalMarks} onChange={e => setFormData({...formData, totalMarks: e.target.value})} placeholder="100" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Date</label>
                                    <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Duration</label>
                                    <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="2 hours" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <button type="submit" className="btn-primary">
                                Create Exam
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Exams List */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">All Exams</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {loading ? <p>Loading exams...</p> : examsList.length === 0 ? <p>No exams found.</p> : examsList.map((exam) => (
                            <div key={exam._id} style={{
                                padding: '20px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{exam.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{exam.class} {exam.section} • {exam.subject}</p>
                                    </div>
                                    {exam.status === 'Completed' ? (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#d1fae5',
                                            color: '#065f46'
                                        }}>
                                            ✓ Completed
                                        </span>
                                    ) : exam.status === 'Scheduled' ? (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#dbeafe',
                                            color: '#1e40af'
                                        }}>
                                            Scheduled
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#fef3c7',
                                            color: '#92400e'
                                        }}>
                                            Active
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Date</p>
                                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(exam.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Marks</p>
                                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{exam.totalMarks}</p>
                                    </div>
                                    {exam.status === 'Completed' && (
                                        <>
                                            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average</p>
                                                <p style={{ fontWeight: '600', fontSize: '14px', color: '#10b981' }}>N/A</p>
                                            </div>
                                            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Highest</p>
                                                <p style={{ fontWeight: '600', fontSize: '14px', color: '#3b82f6' }}>N/A</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {exam.status !== 'Completed' && (
                                        <button className="btn-primary" style={{ fontSize: '14px' }} onClick={() => toast('Marks upload module under construction')}>Upload Marks</button>
                                    )}
                                    {exam.status === 'Scheduled' && (
                                        <button className="btn-primary" style={{ fontSize: '14px' }} onClick={async () => {
                                            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${exam._id}`, {
                                                method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'Completed' })
                                            });
                                            if (res.ok) setExamsList(examsList.map(e => e._id === exam._id ? {...e, status: 'Completed'} : e));
                                        }}>Mark Completed</button>
                                    )}
                                    {exam.status === 'Completed' && (
                                        <>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>
                                                <Download size={14} /> Export PDF
                                            </button>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>View Rank List</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherExamsView;
