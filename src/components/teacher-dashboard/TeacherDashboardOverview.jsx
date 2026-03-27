import React, { useState, useEffect } from 'react';
import {
    BookOpen,
    Users,
    ClipboardCheck,
    Book,
    FileSpreadsheet,
    Briefcase,
    Search
} from 'lucide-react';
import './TeacherDashboardOverview.css';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const TeacherDashboardOverview = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]); // Schools looking for teachers
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalAssignedClasses: 0,
        totalStudents: 0,
        todayAttendancePending: 0,
        homeworkDueToday: 0,
        upcomingExams: 0
    });

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (error) {
            toast.error('Failed to load teacher stats');
        }
    };
    
    // Fetch my applications
    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/applications`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setApplications(data);
            }
        } catch (error) {
            toast.error('Failed to load applications');
        }
    };

    // Search schools to apply
    const searchJobs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const query = city ? `?city=${city}` : '';
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setJobs(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            toast.error('Failed to search schools');
        } finally {
            setLoading(false);
        }
    };

    const applyForJob = async (schoolId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/teacher/apply/${schoolId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ coverLetter: "I am interested in this position." }) 
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Applied successfully');
                fetchApplications();
            } else {
                toast.error(data.message || 'Failed to apply');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    useEffect(() => {
        if (user) {
            fetchApplications();
            searchJobs(); // Load initial list
            fetchStats();
        }
    }, [user]);

    // KPI Data
    const kpiData = [
        { title: 'Total Assigned Classes', value: stats.totalAssignedClasses, change: 'Active Classes', icon: BookOpen, color: '#3b82f6' },
        { title: 'Total Students', value: stats.totalStudents, change: 'Across all classes', icon: Users, color: '#10b981' },
        { title: "Today's Attendance Pending", value: stats.todayAttendancePending, change: 'Classes remaining', icon: ClipboardCheck, color: '#f59e0b' },
        { title: 'Homework Due Today', value: stats.homeworkDueToday, change: 'Assignments to grade', icon: Book, color: '#8b5cf6' },
        { title: 'Upcoming Exams', value: stats.upcomingExams, change: 'Next week', icon: FileSpreadsheet, color: '#ef4444' },
    ];

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
