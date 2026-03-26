import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import './ParentViews.css';

const ParentAttendanceView = () => {
    const [data, setData] = useState({ activeChildData: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/parent/dashboard-data`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) setData(await res.json());
            } catch (error) { toast.error('Error fetching attendance data'); }
            finally { setLoading(false); }
        };
        fetchAttendanceData();
    }, []);

    const attendanceStats = data.activeChildData?.attendanceStats || { presentCount: 0, absentCount: 0, attendanceRate: 0 };
    const dailyRecords = data.activeChildData?.attendanceRecords || [];

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
                            <p className="stat-value">{attendanceStats.presentCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-red-100 text-red-600">
                            <AlertCircle size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Absent Days</h3>
                            <p className="stat-value">{attendanceStats.absentCount}</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-yellow-100 text-yellow-600">
                            <Clock size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Late Arrivals</h3>
                            <p className="stat-value">0</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon bg-blue-100 text-blue-600">
                            <ClipboardCheck size={24} />
                        </div>
                        <div className="stat-content">
                            <h3>Attendance Rate</h3>
                            <p className="stat-value">{attendanceStats.attendanceRate}%</p>
                        </div>
                    </div>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Daily Attendance Records</h2>
                        <Calendar size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        {loading ? <p>Loading attendance...</p> : dailyRecords.length === 0 ? <p>No attendance records found.</p> : (
                            <div className="attendance-list">
                                {dailyRecords.map((record, index) => (
                                    <div key={index} className="attendance-item">
                                        <div className="attendance-date">
                                            <span>{new Date(record.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="attendance-status">
                                            {record.status === 'Present' && (
                                                <span className="badge badge-success">Present</span>
                                            )}
                                            {record.status === 'Absent' && (
                                                <span className="badge badge-danger">Absent</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentAttendanceView;

