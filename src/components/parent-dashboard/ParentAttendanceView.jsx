import React from 'react';
import { ClipboardCheck, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import './ParentViews.css';

const ParentAttendanceView = () => {
    const monthlyStats = {
        present: 22,
        absent: 1,
        late: 2,
        total: 25,
        percentage: 88
    };

    const dailyRecords = [
        { date: 'Dec 5, 2025', status: 'present', time: '08:45 AM' },
        { date: 'Dec 4, 2025', status: 'present', time: '08:50 AM' },
        { date: 'Dec 3, 2025', status: 'late', time: '09:15 AM' },
        { date: 'Dec 2, 2025', status: 'present', time: '08:55 AM' },
        { date: 'Dec 1, 2025', status: 'absent', time: '-' },
    ];

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Attendance Monitoring</h1>
                <p className="view-subtitle">Track your child's daily attendance records</p>
            </div>

            <div className="view-content">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon bg-green-100 text-green-600">
                            <CheckCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Present Days</h3>
                            <p className="stat-value">{monthlyStats.present}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-red-100 text-red-600">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Absent Days</h3>
                            <p className="stat-value">{monthlyStats.absent}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-yellow-100 text-yellow-600">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Late Arrivals</h3>
                            <p className="stat-value">{monthlyStats.late}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-blue-100 text-blue-600">
                            <ClipboardCheck size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Attendance Rate</h3>
                            <p className="stat-value">{monthlyStats.percentage}%</p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Daily Attendance Records</h2>
                        <Calendar size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <div className="attendance-list">
                            {dailyRecords.map((record, index) => (
                                <div key={index} className="attendance-item">
                                    <div className="attendance-date">
                                        <span>{record.date}</span>
                                    </div>
                                    <div className="attendance-status">
                                        {record.status === 'present' && (
                                            <span className="badge badge-success">Present</span>
                                        )}
                                        {record.status === 'absent' && (
                                            <span className="badge badge-danger">Absent</span>
                                        )}
                                        {record.status === 'late' && (
                                            <span className="badge badge-warning">Late</span>
                                        )}
                                    </div>
                                    <div className="attendance-time">
                                        <span>{record.time}</span>
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

export default ParentAttendanceView;

