import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Filter } from 'lucide-react';
import { performanceTrends, teacherClasses } from './mockData';
import './TeacherDashboardOverview.css';

const TeacherReportsView = () => {
    const [selectedClass, setSelectedClass] = useState('all');
    const [dateRange, setDateRange] = useState('This Month');

    // Filter classes based on selection
    const filteredClasses = selectedClass === 'all'
        ? teacherClasses
        : teacherClasses.filter(c => c.id === selectedClass);

    const exportAllReports = () => {
        try {
            const csvData = [
                ['Teacher Reports & Analytics'],
                ['Generated on', new Date().toLocaleDateString()],
                ['Filter', selectedClass === 'all' ? 'All Classes' : filteredClasses[0]?.subject + ' - ' + filteredClasses[0]?.grade],
                ['Date Range', dateRange],
                [''],
                ['Subject-wise Performance'],
                ['Subject', 'Class', 'Students', 'Performance'],
                ...filteredClasses.map((cls, idx) => [
                    cls.subject,
                    cls.grade,
                    cls.students,
                    (75 + idx * 3) + '%'
                ]),
                [''],
                ['Homework Completion Statistics'],
                ['Metric', 'Percentage'],
                ['On Time', '87.5%'],
                ['Late Submissions', '8.5%'],
                ['Not Submitted', '4%'],
                ['Average Score', '82/100'],
                [''],
                ['Top Performers'],
                ['Rank', 'Student', 'Class', 'Average', 'Trend'],
                ['1', 'Sara Khan', '10-A', '92%', 'Up'],
                ['2', 'Aisha Tariq', '11-B', '90%', 'Up'],
                ['3', 'Maryam Siddiqui', '10-B', '88%', 'Stable'],
                ['4', 'Ahmed Ali', '10-A', '88%', 'Up'],
                ['5', 'Zainab Ahmed', '11-B', '86%', 'Down']
            ];

            const csvContent = csvData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `Teacher_Reports_${new Date().toISOString().split('T')[0]}.csv`;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            console.log('Reports exported successfully');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export reports. Please try again.');
        }
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Track performance, attendance, and homework statistics</p>
                </div>
                <button className="btn-primary" onClick={exportAllReports}>
                    <Download size={16} /> Export All Reports
                </button>
            </div>

            {/* Filters */}
            <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Filter size={16} color="#6b7280" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', minWidth: '200px' }}
                        >
                            <option value="all">All Classes</option>
                            {teacherClasses.map(c => (
                                <option key={c.id} value={c.id}>{c.subject} - {c.grade}</option>
                            ))}
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', minWidth: '150px' }}
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Term</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Performance Overview */}
            <div className="dashboard-grid">
                {/* Subject-wise Performance */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Subject-wise Performance</h2>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {filteredClasses.length > 0 ? (
                                filteredClasses.map((cls, idx) => (
                                    <div key={cls.id} style={{ padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                            <div>
                                                <h4 style={{ fontWeight: '600', fontSize: '14px' }}>{cls.subject} - {cls.grade}</h4>
                                                <p style={{ fontSize: '12px', color: '#6b7280' }}>{cls.students} students</p>
                                            </div>
                                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                                                {75 + idx * 3}%
                                            </div>
                                        </div>
                                        {/* Progress Bar */}
                                        <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                                            <div style={{
                                                width: `${75 + idx * 3}%`,
                                                height: '100%',
                                                backgroundColor: '#3b82f6',
                                                borderRadius: '4px',
                                                transition: 'width 0.3s'
                                            }}></div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#6b7280', padding: '20px' }}>No classes match the selected filter</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance Trends Chart */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2 className="card-title">Performance Trends</h2>
                    </div>
                    <div className="card-body">
                        <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '8px', padding: '20px 0' }}>
                            {performanceTrends.map((trend, idx) => (
                                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#3b82f6', marginBottom: '4px' }}>
                                        {trend.math10A}
                                    </div>
                                    <div style={{
                                        width: '100%',
                                        height: `${trend.math10A * 3}px`,
                                        backgroundColor: '#3b82f6',
                                        borderRadius: '4px 4px 0 0',
                                        transition: 'height 0.3s'
                                    }}></div>
                                    <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '8px' }}>
                                        {trend.week}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Homework Completion Stats */}
            <div className="dashboard-card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                    <h2 className="card-title">Homework Completion Statistics</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                            <p style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px', fontWeight: '500' }}>On Time</p>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>87.5%</p>
                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fde68a' }}>
                            <p style={{ fontSize: '12px', color: '#92400e', marginBottom: '8px', fontWeight: '500' }}>Late Submissions</p>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>8.5%</p>
                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#fee2e2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                            <p style={{ fontSize: '12px', color: '#991b1b', marginBottom: '8px', fontWeight: '500' }}>Not Submitted</p>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>4%</p>
                        </div>
                        <div style={{ padding: '20px', backgroundColor: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                            <p style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px', fontWeight: '500' }}>Average Score</p>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>82/100</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Comparison */}
            <div className="dashboard-card" style={{ marginTop: '24px' }}>
                <div className="card-header">
                    <h2 className="card-title">Top Performers</h2>
                </div>
                <div className="card-body">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Rank</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Class</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Average</th>
                                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { name: 'Sara Khan', class: '10-A', avg: 92, trend: 'up' },
                                { name: 'Aisha Tariq', class: '11-B', avg: 90, trend: 'up' },
                                { name: 'Maryam Siddiqui', class: '10-B', avg: 88, trend: 'stable' },
                                { name: 'Ahmed Ali', class: '10-A', avg: 88, trend: 'up' },
                                { name: 'Zainab Ahmed', class: '11-B', avg: 86, trend: 'down' }
                            ].map((student, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#cd7f32' : '#e5e7eb',
                                            color: 'white',
                                            textAlign: 'center',
                                            lineHeight: '24px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {idx + 1}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px', fontWeight: '500' }}>{student.name}</td>
                                    <td style={{ padding: '12px', color: '#6b7280' }}>{student.class}</td>
                                    <td style={{ padding: '12px', fontWeight: '600', color: '#3b82f6' }}>{student.avg}%</td>
                                    <td style={{ padding: '12px' }}>
                                        <span style={{ color: student.trend === 'up' ? '#10b981' : student.trend === 'down' ? '#ef4444' : '#6b7280' }}>
                                            {student.trend === 'up' ? '↗' : student.trend === 'down' ? '↘' : '→'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherReportsView;
