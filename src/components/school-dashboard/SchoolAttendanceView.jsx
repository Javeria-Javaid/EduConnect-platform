import React from 'react';
import { Users, CheckCircle, XCircle, Clock, AlertTriangle, TrendingUp, Calendar } from 'lucide-react';
import { attendanceStats, classAttendance, missingSubmissions, irregularStudents } from './reports/mockData';
import './SchoolAttendanceView.css';

const SchoolAttendanceView = () => {
    const { todayAttendance, totalPresent, totalAbsent, totalLeave, missingSubmissions: missing, irregularStudents: irregular } = attendanceStats;

    const kpiCards = [
        { title: "Today's Attendance", value: `${todayAttendance}%`, icon: <Users size={24} />, color: "#3AC47D", trend: `${totalPresent} present`, bgColor: "#dcfce7" },
        { title: "Present", value: totalPresent, icon: <CheckCircle size={24} />, color: "#2A6EF2", trend: "students", bgColor: "#dbeafe" },
        { title: "Absent", value: totalAbsent, icon: <XCircle size={24} />, color: "#EF4444", trend: "students", bgColor: "#fee2e2" },
        { title: "On Leave", value: totalLeave, icon: <Calendar size={24} />, color: "#F59E0B", trend: "approved", bgColor: "#fef3c7" }
    ];

    return (
        <div className="attendance-container">
            {/* Header */}
            <div className="attendance-header">
                <h1>Attendance Management</h1>
                <p>Track and manage student attendance</p>
            </div>

            {/* KPI Grid */}
            <div className="kpi-grid">
                {kpiCards.map((card, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-card-header">
                            <div className="kpi-icon" style={{ backgroundColor: card.bgColor, color: card.color }}>
                                {card.icon}
                            </div>
                            <span className="kpi-badge">Today</span>
                        </div>
                        <div className="kpi-content">
                            <h3>{card.title}</h3>
                            <div className="kpi-value-row">
                                <span className="kpi-value">{card.value}</span>
                                <span className="kpi-trend">{card.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="content-grid">
                {/* Class-wise Attendance */}
                <div className="class-attendance-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <TrendingUp size={20} style={{ color: '#2A6EF2' }} />
                            Class-wise Attendance
                        </h2>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="class-list">
                        {classAttendance.map((cls, index) => (
                            <div key={index} className="class-item">
                                <div className="class-item-left">
                                    <div
                                        className="attendance-badge"
                                        style={{
                                            background: cls.attendance >= 95 ? '#3AC47D' : cls.attendance >= 90 ? '#F59E0B' : '#EF4444'
                                        }}
                                    >
                                        {cls.attendance}%
                                    </div>
                                    <div className="class-info">
                                        <h4>Class {cls.class}</h4>
                                        <div className="class-stats">
                                            <span className="stat-present">{cls.present} Present</span> •
                                            <span className="stat-absent"> {cls.absent} Absent</span> •
                                            <span className="stat-leave"> {cls.leave} Leave</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {cls.attendance >= 95 ?
                                        <CheckCircle size={20} style={{ color: '#3AC47D' }} /> :
                                        <AlertTriangle size={20} style={{ color: '#F59E0B' }} />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts Column */}
                <div className="alerts-column">
                    {/* Critical Alerts */}
                    <div className="alert-card">
                        <h2 className="card-title">
                            <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                            Critical Alerts
                        </h2>
                        <div className="alert-list" style={{ marginTop: '24px' }}>
                            <div className="alert-item critical">
                                <div className="alert-icon" style={{ color: '#EF4444' }}>
                                    <Clock size={18} />
                                </div>
                                <div className="alert-content">
                                    <h3>Missing Submissions</h3>
                                    <p>{missing} teachers haven't submitted today's attendance.</p>
                                    <button className="alert-action-btn danger">Remind All</button>
                                </div>
                            </div>
                            <div className="alert-item warning">
                                <div className="alert-icon" style={{ color: '#F59E0B' }}>
                                    <AlertTriangle size={18} />
                                </div>
                                <div className="alert-content">
                                    <h3>Irregular Attendance</h3>
                                    <p>{irregular} students marked as irregular this week.</p>
                                    <button className="alert-action-btn warning">View List</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Missing Submissions List */}
                    <div className="alert-card">
                        <h2 className="card-title">
                            <Clock size={20} style={{ color: '#94a3b8' }} />
                            Pending Actions
                        </h2>
                        <div className="pending-list" style={{ marginTop: '16px' }}>
                            {missingSubmissions.map((sub, index) => (
                                <div key={index} className="pending-item">
                                    <div className="pending-item-left">
                                        <div className="pending-icon">!</div>
                                        <div className="pending-info">
                                            <h4>{sub.teacher}</h4>
                                            <p>Class {sub.class}-{sub.section}</p>
                                        </div>
                                    </div>
                                    <span className="pending-badge">Pending</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolAttendanceView;
