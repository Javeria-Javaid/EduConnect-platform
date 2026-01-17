import React from 'react';
import {
    Users,
    GraduationCap,
    CalendarCheck,
    School,
    AlertCircle,
    Calendar,
    TrendingUp,
    UserPlus,
    DollarSign,
    Clock
} from 'lucide-react';
import './SchoolDashboardOverview.css';

const SchoolDashboardOverview = () => {
    const kpiData = [
        { title: 'Total Students', value: '1,250', change: '+5%', icon: Users, color: '#3b82f6' },
        { title: 'Total Teachers', value: '85', change: '2 Vacancies', icon: GraduationCap, color: '#10b981' },
        { title: 'Attendance Today', value: '92%', change: 'Students + Teachers', icon: CalendarCheck, color: '#f59e0b' },
        { title: 'Active Classes', value: '42', change: 'Currently running', icon: School, color: '#8b5cf6' },
    ];

    return (
        <div className="school-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">School Overview</h1>
                    <p className="page-subtitle">Welcome back, Principal. Here's what's happening today.</p>
                </div>
                <div className="date-selector">
                    <select className="date-select">
                        <option>Today</option>
                        <option>This Week</option>
                        <option>This Month</option>
                    </select>
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
                {/* Attendance Snapshot */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Attendance Snapshot</h2>
                        <button className="card-action">View Details</button>
                    </div>
                    <div className="card-body">
                        <div className="placeholder-chart" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
                            <p className="text-gray-500">Attendance Chart Placeholder</p>
                        </div>
                        <div className="attendance-stats">
                            <div className="stat-item">
                                <span className="stat-label">Students Present</span>
                                <span className="stat-value">1,150</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Teachers Present</span>
                                <span className="stat-value">82</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Performance */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Academic Performance</h2>
                        <TrendingUp size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="placeholder-chart" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '8px' }}>
                            <p className="text-gray-500">Performance Graph Placeholder</p>
                        </div>
                        <div className="performance-list">
                            <div className="list-item">
                                <span>Class 10-A Math Average</span>
                                <span className="text-green-600 font-medium">85%</span>
                            </div>
                            <div className="list-item">
                                <span>Class 8-B Science Average</span>
                                <span className="text-green-600 font-medium">78%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admissions Overview */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Admissions Pipeline</h2>
                        <UserPlus size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="pipeline-stats">
                            <div className="pipeline-item">
                                <div className="pipeline-count">24</div>
                                <div className="pipeline-label">New Applications</div>
                            </div>
                            <div className="pipeline-item">
                                <div className="pipeline-count">12</div>
                                <div className="pipeline-label">Pending Review</div>
                            </div>
                            <div className="pipeline-item">
                                <div className="pipeline-count">8</div>
                                <div className="pipeline-label">Interviews Scheduled</div>
                            </div>
                        </div>
                        <button className="btn-primary w-full mt-4">Manage Admissions</button>
                    </div>
                </div>

                {/* Finance Snapshot */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Finance Snapshot</h2>
                        <DollarSign size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="finance-summary">
                            <div className="finance-item">
                                <span className="finance-label">Collected this Month</span>
                                <span className="finance-value text-green-600">$45,200</span>
                            </div>
                            <div className="finance-item">
                                <span className="finance-label">Pending Dues</span>
                                <span className="finance-value text-red-500">$12,500</span>
                            </div>
                        </div>
                        <div className="mode-breakdown mt-4">
                            <div className="text-sm text-gray-500 mb-2">Payment Modes</div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '60%', background: '#3b82f6' }}></div>
                                <div className="progress-fill" style={{ width: '30%', background: '#10b981' }}></div>
                                <div className="progress-fill" style={{ width: '10%', background: '#f59e0b' }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Online (60%)</span>
                                <span>Bank (30%)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity / Notifications */}
                <div className="dashboard-card full-width">
                    <div className="card-header">
                        <h2 className="card-title">Recent Activity & Alerts</h2>
                        <AlertCircle size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="activity-list">
                            <div className="activity-item">
                                <div className="activity-icon bg-blue-100 text-blue-600"><UserPlus size={16} /></div>
                                <div className="activity-details">
                                    <p className="activity-text">New admission application received from <strong>Sarah Jenkins</strong>.</p>
                                    <span className="activity-time">2 hours ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon bg-yellow-100 text-yellow-600"><AlertCircle size={16} /></div>
                                <div className="activity-details">
                                    <p className="activity-text">Low attendance alert for <strong>Class 9-C</strong> (65%).</p>
                                    <span className="activity-time">4 hours ago</span>
                                </div>
                            </div>
                            <div className="activity-item">
                                <div className="activity-icon bg-green-100 text-green-600"><DollarSign size={16} /></div>
                                <div className="activity-details">
                                    <p className="activity-text">Monthly fee collection report generated.</p>
                                    <span className="activity-time">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolDashboardOverview;
