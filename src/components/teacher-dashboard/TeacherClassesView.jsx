import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Users, Calendar, MapPin, Upload, MessageSquare, BarChart3, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import Modal from '../ui/Modal';
import './TeacherDashboardOverview.css';

const TeacherClassesView = () => {
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);
    const [teacherClasses, setTeacherClasses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    // Announcement State
    const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');
    const [announcementPriority, setAnnouncementPriority] = useState('medium');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Fetch classes
                const classRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                // Fetch students
                const studentsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/students`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (classRes.ok && studentsRes.ok) {
                    const classesData = await classRes.json();
                    const studentsData = await studentsRes.json();
                    
                    // Filter classes assigned to this teacher
                    const assignedClasses = [];
                    classesData.forEach(c => {
                        c.sections.forEach(s => {
                            if (s.classTeacher && s.classTeacher._id === user?._id) {
                                assignedClasses.push({
                                    id: `${c._id}-${s._id}`,
                                    grade: c.name,
                                    section: s.name,
                                    subject: c.name + ' - ' + s.name,
                                    room: s.room || '—',
                                    schedule: 'Mon-Fri',
                                    students: studentsData.filter(stu => stu.class === c.name && stu.section === s.name).length,
                                });
                            }
                        });
                    });
                    setTeacherClasses(assignedClasses);
                    setAllStudents(studentsData);
                }
            } catch (error) { toast.error('Failed to load class data'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    const getClassStudents = () => {
        if (!selectedClass) return [];
        return allStudents.filter(s => s.class === selectedClass.grade && s.section === selectedClass.section);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size
        if (file.size > 25 * 1024 * 1024) {
            setUploadError('File size must be less than 25MB');
            return;
        }

        setUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name);
        formData.append('class', selectedClass?.grade || 'General');
        formData.append('subject', selectedClass?.subject || 'General');

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/upload-material`, {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Material uploaded successfully');
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setUploadError(data.message || 'Upload failed');
            }
        } catch (error) {
            setUploadError('Network error. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSendAnnouncement = async () => {
        if (!announcementTitle || !announcementContent) {
            toast.error('Please fill in title and content');
            return;
        }

        setSending(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/send-message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    recipient: `${selectedClass.grade} - ${selectedClass.section}`,
                    recipientType: 'group',
                    subject: `[CLASS ANNOUNCEMENT] ${announcementTitle}`,
                    body: announcementContent,
                    priority: announcementPriority
                })
            });

            if (response.ok) {
                toast.success('Announcement sent successfully!');
                setIsAnnouncementModalOpen(false);
                setAnnouncementTitle('');
                setAnnouncementContent('');
            } else {
                toast.error('Failed to send announcement');
            }
        } catch (error) {
            toast.error('Network error. Please try again.');
        } finally {
            setSending(false);
        }
    };


    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">My Classes</h1>
                    <p className="page-subtitle">Manage your classes, view rosters, and track performance</p>
                </div>
            </div>

            {!selectedClass ? (
                // Classes Grid View
                <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {loading ? <p>Loading classes...</p> : teacherClasses.length === 0 ? <p>No classes assigned to you.</p> : teacherClasses.map((classItem) => (
                        <div key={classItem.id} className="dashboard-card" style={{ cursor: 'pointer' }} onClick={() => setSelectedClass(classItem)}>
                            <div className="card-header">
                                <h3 className="card-title">{classItem.subject}</h3>
                                <span className="badge" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                                    {classItem.grade}
                                </span>
                            </div>
                            <div className="card-body">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Users size={16} color="#6b7280" />
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>{classItem.students} Students</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <Calendar size={16} color="#6b7280" />
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>{classItem.schedule}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <MapPin size={16} color="#6b7280" />
                                    <span style={{ color: '#6b7280', fontSize: '14px' }}>{classItem.room}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                                    {/* Roster + stats are shown in the detailed view below; buttons removed because they were no-ops */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                // Detailed Class View
                <div>
                    <button
                        onClick={() => setSelectedClass(null)}
                        className="btn-secondary"
                        style={{ marginBottom: '20px' }}
                    >
                        ← Back to Classes
                    </button>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <div>
                                <h2 className="card-title">{selectedClass.subject} - {selectedClass.grade}</h2>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>{selectedClass.schedule} • {selectedClass.room}</p>
                            </div>
                            <div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <button className="btn-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload Material'}
                                </button>
                                {uploadError && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>{uploadError}</p>}
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Quick Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>{selectedClass.students}</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Students</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>95.5%</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Attendance</div>
                                </div>
                                <div style={{ padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>78.2</div>
                                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Avg Score</div>
                                </div>
                            </div>

                            {/* Student Roster */}
                            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Student Roster</h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Roll No</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Attendance</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Avg Score</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getClassStudents().length === 0 ? <tr><td colSpan="5" style={{ padding: '12px', textAlign: 'center' }}>No students found in this class.</td></tr> : getClassStudents().map((student) => (
                                            <tr key={student._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px' }}>{student.rollNo || 'N/A'}</td>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>{student.firstName} {student.lastName}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        backgroundColor: '#d1fae5',
                                                        color: '#065f46'
                                                    }}>
                                                        N/A
                                                    </span>
                                                </td>
                                                <td style={{ padding: '12px' }}>N/A</td>
                                                <td style={{ padding: '12px' }}>
                                                    <button className="btn-secondary" style={{ fontSize: '12px', padding: '4px 8px' }}>
                                                        View Profile
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Class Announcements */}
                            <div style={{ marginTop: '32px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Class Announcements</h3>
                                    <button 
                                        className="btn-primary"
                                        onClick={() => setIsAnnouncementModalOpen(true)}
                                    >
                                        <MessageSquare size={16} /> New Announcement
                                    </button>
                                </div>
                                <div className="dashboard-card" style={{ backgroundColor: '#f9fafb' }}>
                                    <div className="card-body">
                                        <p style={{ color: '#6b7280', textAlign: 'center' }}>No announcements yet. Create one to notify students.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Announcement Modal */}
            <Modal
                isOpen={isAnnouncementModalOpen}
                onClose={() => setIsAnnouncementModalOpen(false)}
                title={`New Announcement for ${selectedClass?.subject || 'Class'}`}
                size="medium"
            >
                <div style={{ display: 'grid', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Title</label>
                        <input
                            type="text"
                            placeholder="Announcement title"
                            value={announcementTitle}
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px' }}
                        />
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Priority</label>
                        <select
                            value={announcementPriority}
                            onChange={(e) => setAnnouncementPriority(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white' }}
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>Announcement Content</label>
                        <textarea
                            rows="5"
                            placeholder="Type your announcement here..."
                            value={announcementContent}
                            onChange={(e) => setAnnouncementContent(e.target.value)}
                            style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px', color: '#1e40af', fontSize: '13px' }}>
                        <AlertCircle size={16} />
                        <span>This announcement will be visible to all parents and students of this class.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <button 
                            className="btn-secondary" 
                            style={{ flex: 1 }}
                            onClick={() => setIsAnnouncementModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button 
                            className="btn-primary" 
                            style={{ flex: 2 }}
                            onClick={handleSendAnnouncement}
                            disabled={sending}
                        >
                            {sending ? 'Sending...' : 'Send Announcement'}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TeacherClassesView;
