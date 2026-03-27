import React, { useEffect, useState } from 'react';
import { Users, Search, Phone, Mail, TrendingUp, Calendar, MessageSquare } from 'lucide-react';
import './TeacherDashboardOverview.css';
import MessageModal from '../school-dashboard/teachers/MessageModal';
import { toast } from 'sonner';

const TeacherStudentsView = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messageRecipient, setMessageRecipient] = useState(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const [meRes, studentsRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/schools/students?page=1&limit=500`, { headers: { Authorization: `Bearer ${token}` } }),
                ]);
                if (meRes.ok) {
                    const me = await meRes.json();
                    setCurrentUser(me.data || me);
                }
                if (studentsRes.ok) {
                    const json = await studentsRes.json();
                    setStudents(json.data || json || []);
                } else {
                    toast.error('Failed to load students');
                }
            } catch {
                toast.error('Network error loading students');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredStudents = students.filter((s) => {
        const name = String(s.name || '').toLowerCase();
        const cls = String(s.class || '').toLowerCase();
        return name.includes(searchTerm.toLowerCase()) || cls.includes(searchTerm.toLowerCase());
    });

    const openMessageToParent = async (student) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/students/${student.userId}/linked-parent`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || 'No linked parent found');
                return;
            }
            const parentUser = data.parentUser;
            setMessageRecipient({ userId: parentUser._id, name: `${parentUser.firstName} ${parentUser.lastName}`, email: parentUser.email });
            setIsMessageModalOpen(true);
        } catch {
            toast.error('Network error opening chat');
        }
    };


    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Student Profiles</h1>
                    <p className="page-subtitle">View student information and academic records</p>
                </div>
            </div>

            {!selectedStudent ? (
                <div>
                    {/* Search */}
                    <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                        <div className="card-body">
                            <div style={{ position: 'relative' }}>
                                <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    placeholder="Search students by name or class..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 44px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '14px'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Students Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                        {loading && (
                            <div className="dashboard-card">
                                <div className="card-body" style={{ color: '#6b7280' }}>Loading students…</div>
                            </div>
                        )}
                        {filteredStudents.map((student) => (
                            <div
                                key={student.userId || student._id}
                                className="dashboard-card"
                                style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                                onClick={() => setSelectedStudent(student)}
                            >
                                <div className="card-body">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '18px',
                                            fontWeight: '600'
                                        }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                                                {student.name}
                                            </h3>
                                            <p style={{ fontSize: '12px', color: '#6b7280' }}>
                                                {student.class} • Roll #{student.rollNumber || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Attendance</p>
                                            <p style={{ fontWeight: '600', fontSize: '14px', color: student.attendance !== 'N/A' && Number(student.attendance) >= 90 ? '#10b981' : '#f59e0b' }}>
                                                {student.attendance === 'N/A' ? 'N/A' : `${student.attendance}%`}
                                            </p>
                                        </div>
                                        <div style={{ padding: '8px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Avg Score</p>
                                            <p style={{ fontWeight: '600', fontSize: '14px', color: '#3b82f6' }}>
                                                {student.performance ? `${student.performance}★` : '—'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // Student Detail View
                <div>
                    <button onClick={() => setSelectedStudent(null)} className="btn-secondary" style={{ marginBottom: '20px' }}>
                        ← Back to Students
                    </button>

                    <div className="dashboard-grid">
                        {/* Profile Card */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Student Profile</h2>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        fontWeight: '600'
                                    }}>
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                                            {selectedStudent.name}
                                        </h3>
                                        <p style={{ color: '#6b7280' }}>
                                            {selectedStudent.class} • Roll #{selectedStudent.rollNo}
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <Users size={16} color="#6b7280" />
                                        <span style={{ color: '#4b5563' }}>Admission #: {selectedStudent.admissionNumber || '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <Mail size={16} color="#6b7280" />
                                        <span style={{ color: '#4b5563' }}>{selectedStudent.email || '—'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <Phone size={16} color="#6b7280" />
                                        <span style={{ color: '#4b5563' }}>{selectedStudent.parentPhone || '—'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Academic Record */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Academic Performance</h2>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <TrendingUp size={20} color="#10b981" />
                                            <h4 style={{ fontWeight: '600', color: '#065f46' }}>Average Score</h4>
                                        </div>
                                        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>{selectedStudent.avgScore}</p>
                                    </div>

                                    <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <Calendar size={20} color="#3b82f6" />
                                            <h4 style={{ fontWeight: '600', color: '#1e40af' }}>Attendance Rate</h4>
                                        </div>
                                        <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>{selectedStudent.attendance}%</p>
                                    </div>
                                </div>

                                <div style={{ marginTop: '24px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Recent Grades</h4>
                                    <div style={{ display: 'grid', gap: '8px' }}>
                                        {['Math Test', 'Physics Quiz', 'Homework'].map((item, idx) => (
                                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                                <span style={{ fontSize: '14px' }}>{item}</span>
                                                <span style={{ fontWeight: '600', color: '#3b82f6' }}>{85 + idx * 3}/100</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parent Contact */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Parent/Guardian Contact</h2>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Father's Name</h4>
                                    <p style={{ color: '#6b7280' }}>{selectedStudent.parentName || '—'}</p>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Contact Number</h4>
                                    <p style={{ color: '#6b7280' }}>{selectedStudent.parentPhone || '—'}</p>
                                </div>
                                <div style={{ marginBottom: '16px' }}>
                                    <h4 style={{ fontWeight: '600', marginBottom: '8px' }}>Email</h4>
                                    <p style={{ color: '#6b7280' }}>Linked parent required for chat</p>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => openMessageToParent(selectedStudent)}>
                                    <MessageSquare size={16} /> Message Parent
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    setIsMessageModalOpen(false);
                    setMessageRecipient(null);
                }}
                initialRecipient={messageRecipient}
                currentUser={currentUser}
            />
        </div>
    );
};


export default TeacherStudentsView;
