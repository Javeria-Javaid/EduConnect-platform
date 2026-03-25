import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, CalendarCheck, School, TrendingUp, UserPlus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import './SchoolDashboardOverview.css';

const SchoolDashboardOverview = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        activeClasses: 0,
        attendance: '0%'
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/stats`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setStats(data);
            }
        } catch (error) {
            toast.error('Error fetching school stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const kpiData = [
        { title: 'Total Students', value: stats.totalStudents, change: 'Family Registrations', icon: Users, color: '#3b82f6' },
        { title: 'Total Teachers', value: stats.totalTeachers, change: 'Registered Staff', icon: GraduationCap, color: '#10b981' },
        { title: 'Attendance Today', value: stats.attendance, change: 'Daily average', icon: CalendarCheck, color: '#f59e0b' },
        { title: 'Active Classes', value: stats.activeClasses, change: 'Curriculum sessions', icon: School, color: '#8b5cf6' },
    ];

    return (
        <div className="school-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">School Overview</h1>
                    <p className="page-subtitle">Real-time statistics for your institution.</p>
                </div>
            </div>

            {loading ? (
                <div className="loading-state">Loading analysis...</div>
            ) : (
                <>
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

                    <div className="dashboard-grid">
                        <div className="dashboard-card">
                            <div className="card-header"><h2 className="card-title">Admissions Pipeline</h2><UserPlus size={20} /></div>
                            <div className="card-body">
                                <div className="pipeline-stats">
                                    <div className="pipeline-item"><div className="pipeline-count">0</div><div className="pipeline-label">New Applications</div></div>
                                    <div className="pipeline-item"><div className="pipeline-count">0</div><div className="pipeline-label">Pending Review</div></div>
                                </div>
                                <button className="btn-primary w-full mt-4" onClick={() => toast.info('Admissions logic integration pending')}>Manage Admissions</button>
                            </div>
                        </div>

                        <div className="dashboard-card">
                            <div className="card-header"><h2 className="card-title">Academic Trending</h2><TrendingUp size={20} /></div>
                            <div className="card-body">
                                <div className="placeholder-chart" style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
                                    <p className="text-gray-500">Live academic charts coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SchoolDashboardOverview;
