import React, { useState, useEffect } from 'react';
import {
    Users,
    ClipboardCheck,
    Book,
    FileSpreadsheet,
    DollarSign,
    Calendar,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    MapPin
} from 'lucide-react';
import './ParentDashboardOverview.css';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const ParentDashboardOverview = () => {
    const { user } = useAuth();
    const [schools, setSchools] = useState([]);
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        attendance: '0%',
        pendingHomework: 0,
        upcomingExams: 0,
        feeStatus: 'N/A'
    });
    const [error, setError] = useState('');
    const [dashboardData, setDashboardData] = useState({ children: [], activeChildData: null });

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (err) {
            toast.error('Failed to load parent stats');
        }
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setDashboardData(data || { children: [], activeChildData: null });
            }
        } catch {
            toast.error('Failed to load dashboard details');
        }
    };

    const searchSchools = async () => {
        setLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const query = city ? `?city=${city}` : '';
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools${query}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setSchools(Array.isArray(data) ? data : []);
            } else {
                setError(data.message || 'Failed to fetch schools');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchSchools();
        fetchStats();
        fetchDashboardData();
    }, []);

    const kpiData = [
        { title: 'Child Attendance', value: stats.attendance, change: 'This Month', icon: ClipboardCheck, color: '#3b82f6' },
        { title: 'Pending Homework', value: stats.pendingHomework, change: 'Due Soon', icon: Book, color: '#f59e0b' },
        { title: 'Upcoming Exams', value: stats.upcomingExams, change: 'Next Week', icon: FileSpreadsheet, color: '#8b5cf6' },
        { title: 'Fee Status', value: stats.feeStatus, change: 'Current Month', icon: DollarSign, color: '#10b981' },
    ];

    const activeChildData = dashboardData?.activeChildData;
    const attendanceStats = activeChildData?.attendanceStats || { presentCount: 0, absentCount: 0, attendanceRate: 0 };
    const transactions = activeChildData?.transactions || [];
    const examResults = activeChildData?.examResults || [];
    const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    const todaySchedule = (activeChildData?.timetables || [])
        .filter(t => t.day === todayDayName)
        .flatMap(t => (t.periods || []).map((p, index) => ({
            id: `${t._id}-${index}`,
            subject: p.subject,
            time: `${p.startTime} - ${p.endTime}`,
            teacher: p.room ? `Room ${p.room}` : 'Class Session'
        })));

    const upcomingExams = examResults
        .filter(r => r?.exam?.startDate && new Date(r.exam.startDate) >= new Date())
        .sort((a, b) => new Date(a.exam.startDate) - new Date(b.exam.startDate))
        .slice(0, 3)
        .map((r, idx) => ({
            id: r._id || idx,
            date: new Date(r.exam.startDate),
            title: r.exam?.name || 'Upcoming Exam',
        }));

    const announcements = [
        ...(upcomingExams[0] ? [{
            id: 'exam-reminder',
            title: 'Exam Reminder',
            date: upcomingExams[0].date.toLocaleDateString(),
            content: `${upcomingExams[0].title} is scheduled soon.`
        }] : []),
        ...(transactions[0] ? [{
            id: 'fee-update',
            title: 'Latest Fee Update',
            date: new Date(transactions[0].date || transactions[0].createdAt || Date.now()).toLocaleDateString(),
            content: `Recent ${transactions[0].type || 'fee'} transaction status: ${transactions[0].status || 'Recorded'}.`
        }] : [])
    ];

    const homeworkAlerts = upcomingExams.map(exam => ({
        id: exam.id,
        subject: 'Exam',
        title: exam.title,
        due: exam.date.toLocaleDateString(),
        status: 'pending'
    }));

    return (
        <div className="parent-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Parent Dashboard</h1>
                    <p className="page-subtitle">Welcome back! Here's your child's academic overview.</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* School Search Section (Added for Backend Integration) */}
            <div className="dashboard-card" style={{ marginBottom: '20px' }}>
                <div className="card-header">
                    <h2 className="card-title">Find Schools</h2>
                    <Search size={20} className="text-gray-400" />
                </div>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                        <input 
                            type="text" 
                            placeholder="Enter city (e.g., New York)" 
                            value={city} 
                            onChange={(e) => setCity(e.target.value)}
                            style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <button 
                            onClick={searchSchools}
                            className="btn-primary" 
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>
                    
                    {error && <p className="text-red-500">{error}</p>}

                    <div className="schools-list" style={{ display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                        {schools.length === 0 ? (
                            <p>No schools found. Try searching for a city.</p>
                        ) : (
                            schools.map(school => (
                                <div key={school._id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', background: '#f9fafb' }}>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '5px' }}>{school.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#666', fontSize: '0.9rem' }}>
                                        <MapPin size={16} />
                                        <span>{school.city}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '5px' }}>{school.address}</p>
                                </div>
                            ))
                        )}
                    </div>
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
                {/* Today's Schedule */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Today's Class Schedule</h2>
                        <Calendar size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="schedule-list">
                            {todaySchedule.length === 0 ? (
                                <p>No classes scheduled for today.</p>
                            ) : todaySchedule.map((item) => (
                                <div key={item.id} className="schedule-item">
                                    <div className="schedule-time">{item.time}</div>
                                    <div className="schedule-details">
                                        <h4>{item.subject}</h4>
                                        <p>{item.teacher}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Homework Alerts */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Homework Alerts</h2>
                        <AlertCircle size={20} className="text-orange-500" />
                    </div>
                    <div className="card-body">
                        <div className="homework-list">
                            {homeworkAlerts.length === 0 ? (
                                <p>No pending exam alerts right now.</p>
                            ) : homeworkAlerts.map((hw) => (
                                <div key={hw.id} className="homework-item">
                                    <div className="homework-status">
                                        {hw.status === 'submitted' ? (
                                            <CheckCircle size={18} className="text-green-600" />
                                        ) : (
                                            <Clock size={18} className="text-orange-500" />
                                        )}
                                    </div>
                                    <div className="homework-details">
                                        <h4>{hw.subject}</h4>
                                        <p>{hw.title}</p>
                                        <span className="homework-due">Due: {hw.due}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Attendance Summary */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Attendance Summary</h2>
                        <TrendingUp size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="attendance-chart-placeholder">
                            <div className="attendance-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Present Days</span>
                                    <span className="stat-value">{attendanceStats.presentCount}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Absent Days</span>
                                    <span className="stat-value">{attendanceStats.absentCount}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Attendance Rate</span>
                                    <span className="stat-value text-green-600">{attendanceStats.attendanceRate || 0}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* School Announcements */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">School Announcements</h2>
                    </div>
                    <div className="card-body">
                        <div className="announcements-list">
                            {announcements.length === 0 ? (
                                <p>No recent announcements.</p>
                            ) : announcements.map((ann) => (
                                <div key={ann.id} className="announcement-item">
                                    <h4>{ann.title}</h4>
                                    <p>{ann.content}</p>
                                    <span className="announcement-date">{ann.date}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fee Reminders */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Fee Status</h2>
                        <DollarSign size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="fee-summary">
                            <div className="fee-item">
                                <span className="fee-label">Current Month</span>
                                <span className="fee-value text-green-600">{stats.feeStatus || 'N/A'}</span>
                            </div>
                            <div className="fee-item">
                                <span className="fee-label">Latest Transaction</span>
                                <span className="fee-value">
                                    {transactions[0]
                                        ? new Date(transactions[0].date || transactions[0].createdAt || Date.now()).toLocaleDateString()
                                        : 'No records'}
                                </span>
                            </div>
                            <button className="btn-primary w-full mt-4" onClick={() => toast.info('Use the Fees section for full payment history')}>
                                Open Fees
                            </button>
                        </div>
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Upcoming Exams</h2>
                        <FileSpreadsheet size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="exams-list">
                            {upcomingExams.length === 0 ? (
                                <p>No upcoming exams.</p>
                            ) : upcomingExams.map((exam) => (
                                <div key={exam.id} className="exam-item">
                                    <div className="exam-date">
                                        {exam.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="exam-details">
                                        <h4>{exam.title}</h4>
                                        <p>{exam.date.toLocaleDateString()}</p>
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

export default ParentDashboardOverview;

