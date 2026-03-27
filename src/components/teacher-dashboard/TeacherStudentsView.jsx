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
                    <div className="dashboard-card students-search-card">
                        <div className="card-body">
                            <div className="students-search-input-wrap">
                                <Search size={20} className="students-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search students by name or class..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="students-search-input"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Students Grid */}
                    <div className="students-grid">
                        {loading && (
                            <div className="dashboard-card">
                                <div className="card-body empty-state-message">Loading students...</div>
                            </div>
                        )}
                        {filteredStudents.map((student) => (
                            <div
                                key={student.userId || student._id}
                                className="dashboard-card student-card-clickable"
                                onClick={() => setSelectedStudent(student)}
                            >
                                <div className="card-body">
                                    <div className="student-card-head">
                                        <div className="student-avatar-md">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="student-card-title">
                                                {student.name}
                                            </h3>
                                            <p className="student-card-subtitle">
                                                {student.class} • Roll #{student.rollNumber || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="student-kpi-grid">
                                        <div className="student-kpi-card">
                                            <p className="student-kpi-label">Attendance</p>
                                            <p className={`student-kpi-value ${student.attendance !== 'N/A' && Number(student.attendance) >= 90 ? 'kpi-success' : 'kpi-warning'}`}>
                                                {student.attendance === 'N/A' ? 'N/A' : `${student.attendance}%`}
                                            </p>
                                        </div>
                                        <div className="student-kpi-card">
                                            <p className="student-kpi-label">Avg Score</p>
                                            <p className="student-kpi-value kpi-primary">
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
                    <button onClick={() => setSelectedStudent(null)} className="btn-secondary students-back-btn">
                        ← Back to Students
                    </button>

                    <div className="dashboard-grid">
                        {/* Profile Card */}
                        <div className="dashboard-card">
                            <div className="card-header">
                                <h2 className="card-title">Student Profile</h2>
                            </div>
                            <div className="card-body">
                                <div className="student-profile-head">
                                    <div className="student-avatar-lg">
                                        {selectedStudent.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="student-profile-name">
                                            {selectedStudent.name}
                                        </h3>
                                        <p className="student-profile-subtitle">
                                            {selectedStudent.class} • Roll #{selectedStudent.rollNo}
                                        </p>
                                    </div>
                                </div>

                                <div className="student-contact-list">
                                    <div className="student-contact-item">
                                        <Users size={16} color="#6b7280" />
                                        <span className="student-contact-text">Admission #: {selectedStudent.admissionNumber || '—'}</span>
                                    </div>
                                    <div className="student-contact-item">
                                        <Mail size={16} color="#6b7280" />
                                        <span className="student-contact-text">{selectedStudent.email || '—'}</span>
                                    </div>
                                    <div className="student-contact-item">
                                        <Phone size={16} color="#6b7280" />
                                        <span className="student-contact-text">{selectedStudent.parentPhone || '—'}</span>
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
                                <div className="student-metrics-grid">
                                    <div className="student-metric-card metric-green">
                                        <div className="student-metric-head">
                                            <TrendingUp size={20} color="#10b981" />
                                            <h4 className="student-metric-title metric-green-text">Average Score</h4>
                                        </div>
                                        <p className="student-metric-value metric-green-value">{selectedStudent.avgScore}</p>
                                    </div>

                                    <div className="student-metric-card metric-blue">
                                        <div className="student-metric-head">
                                            <Calendar size={20} color="#3b82f6" />
                                            <h4 className="student-metric-title metric-blue-text">Attendance Rate</h4>
                                        </div>
                                        <p className="student-metric-value metric-blue-value">{selectedStudent.attendance}%</p>
                                    </div>
                                </div>

                                <div className="recent-grades-section">
                                    <h4 className="recent-grades-title">Recent Grades</h4>
                                    <div className="recent-grades-list">
                                        {['Math Test', 'Physics Quiz', 'Homework'].map((item, idx) => (
                                            <div key={idx} className="recent-grade-item">
                                                <span className="recent-grade-label">{item}</span>
                                                <span className="recent-grade-score">{85 + idx * 3}/100</span>
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
                                <div className="parent-contact-field">
                                    <h4 className="parent-contact-label">Father's Name</h4>
                                    <p className="parent-contact-value">{selectedStudent.parentName || '—'}</p>
                                </div>
                                <div className="parent-contact-field">
                                    <h4 className="parent-contact-label">Contact Number</h4>
                                    <p className="parent-contact-value">{selectedStudent.parentPhone || '—'}</p>
                                </div>
                                <div className="parent-contact-field">
                                    <h4 className="parent-contact-label">Email</h4>
                                    <p className="parent-contact-value">Linked parent required for chat</p>
                                </div>
                                <button className="btn-primary parent-message-btn" onClick={() => openMessageToParent(selectedStudent)}>
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
