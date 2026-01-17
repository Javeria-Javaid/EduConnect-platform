import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    ClipboardCheck,
    Book,
    FileSpreadsheet,
    Megaphone,
    Calendar,
    TrendingUp,
    Clock,
    AlertCircle,
    CheckCircle,
    Briefcase,
    Search
} from 'lucide-react';
import './TeacherDashboardOverview.css';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboardOverview = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]); // Schools looking for teachers
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch my applications
    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/teacher/applications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setApplications(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Search schools to apply
    const searchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const query = city ? `?city=${city}` : '';
            const res = await fetch(`http://localhost:5000/api/schools${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setJobs(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const applyForJob = async (schoolId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/teacher/apply/${schoolId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Body not needed if ID is in params, but coverLetter might be needed. 
                // Controller uses req.body.coverLetter.
                body: JSON.stringify({ coverLetter: "I am interested in this position." }) 
            });
            const data = await res.json();
            if (res.ok) {
                alert('Applied successfully!');
                fetchApplications();
            } else {
                alert(data.message || 'Failed to apply');
            }
        } catch (error) {
            alert('Network error');
        }
    };

    useEffect(() => {
        if (user) {
            fetchApplications();
            searchJobs(); // Load initial list
        }
    }, [user]);

    // KPI Data
    const kpiData = [
        { title: 'Total Assigned Classes', value: '5', change: 'Active Classes', icon: BookOpen, color: '#3b82f6' },
        { title: 'Total Students', value: '142', change: 'Across all classes', icon: Users, color: '#10b981' },
        { title: "Today's Attendance Pending", value: '2', change: 'Classes remaining', icon: ClipboardCheck, color: '#f59e0b' },
        { title: 'Homework Due Today', value: '3', change: 'Assignments to grade', icon: Book, color: '#8b5cf6' },
        { title: 'Upcoming Exams', value: '2', change: 'Next week', icon: FileSpreadsheet, color: '#ef4444' },
    ];

    // Today's Classes
    const todaysClasses = [
        { id: 1, subject: 'Mathematics', class: 'Class 10-A', time: '09:00 AM - 10:00 AM', room: 'Room 101', students: 28 },
        { id: 2, subject: 'Physics', class: 'Class 9-B', time: '10:15 AM - 11:15 AM', room: 'Lab 2', students: 30 },
        { id: 3, subject: 'Mathematics', class: 'Class 10-B', time: '11:30 AM - 12:30 PM', room: 'Room 102', students: 29 },
    ];

    // Pending Tasks
    const pendingTasks = [
        { id: 1, title: 'Grade Math Quiz (10-A)', due: 'Today', type: 'grading', priority: 'high' },
        { id: 2, title: 'Upload Physics Notes (9-B)', due: 'Tomorrow', type: 'upload', priority: 'medium' },
        { id: 3, title: 'Mark Attendance (10-B)', due: 'Today', type: 'attendance', priority: 'high' },
    ];

    // Announcements
    const announcements = [
        { id: 1, title: 'Staff Meeting', date: 'Dec 5, 2025', content: 'Monthly staff meeting at 2:00 PM in the conference room.' },
        { id: 2, title: 'Winter Break', date: 'Dec 20, 2025', content: 'School will remain closed for winter break from Dec 24.' },
    ];

    // Student Performance Data (for chart)
    const performanceData = [
        { name: 'Week 1', score: 75 },
        { name: 'Week 2', score: 82 },
        { name: 'Week 3', score: 78 },
        { name: 'Week 4', score: 88 },
        { name: 'Week 5', score: 85 },
    ];

    // Attendance Data (for donut chart)
    const attendanceData = {
        present: 135,
        absent: 7,
        late: 3,
        total: 145
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Teacher Dashboard</h1>
                    <p className="page-subtitle">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                {kpiData.map((kpi, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-icon-wrapper" style={{ backgroundColor: `${kpi.color}20`, color: kpi.color }}>
                            <kpi.icon size={24} />
                        </div>
                        <div className="kpi-content">
                            <h3 className="kpi-title">{kpi.title}</h3>
                            <div className="kpi-value">{kpi.value}</div>
                            <div className="kpi-change">{kpi.change}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Job Search Section */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Find Teaching Jobs</h2>
                        <Search size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                            <input 
                                placeholder="Filter by City" 
                                value={city} 
                                onChange={e => setCity(e.target.value)}
                                style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                            <button onClick={searchJobs} className="btn-primary" disabled={loading}>
                                {loading ? '...' : 'Search'}
                            </button>
                        </div>
                        <div className="schedule-list">
                            {jobs.map((school) => (
                                <div key={school._id} className="schedule-item">
                                    <div className="schedule-details">
                                        <h4>{school.name}</h4>
                                        <p>{school.city}</p>
                                    </div>
                                    <button 
                                        onClick={() => applyForJob(school._id)}
                                        style={{ padding: '5px 10px', background: '#3b82f6', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* My Applications */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">My Applications</h2>
                        <Briefcase size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="schedule-list">
                            {applications.length === 0 ? <p>No applications yet.</p> : applications.map((app) => (
                                <div key={app._id} className="schedule-item">
                                    <div className="schedule-details">
                                        <h4>{app.school?.name || 'Unknown School'}</h4>
                                        <p>Status: {app.status}</p>
                                    </div>
                                    <div className="schedule-time">
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboardOverview;
