import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Download } from 'lucide-react';
import { teacherClasses, attendanceData, todaysSchedule } from './mockData';
import './TeacherDashboardOverview.css';

const TeacherAttendanceView = () => {
    const [selectedClass, setSelectedClass] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState({});

    const markAttendance = (studentId, status) => {
        setAttendanceRecords(prev => ({
            ...prev,
            [studentId]: status
        }));
    };

    const saveAttendance = () => {
        alert('Attendance saved successfully!');
        setSelectedClass(null);
        setAttendanceRecords({});
    };

    const markAllPresent = () => {
        const allStudents = Array.from({ length: 10 }, (_, i) => `STU${i + 1}`);
        const newRecords = {};
        allStudents.forEach(studentId => {
            newRecords[studentId] = 'present';
        });
        setAttendanceRecords(newRecords);
    };

    const markAllAbsent = () => {
        const allStudents = Array.from({ length: 10 }, (_, i) => `STU${i + 1}`);
        const newRecords = {};
        allStudents.forEach(studentId => {
            newRecords[studentId] = 'absent';
        });
        setAttendanceRecords(newRecords);
    };

    const exportAttendanceReport = () => {
        try {
            const csvData = [
                ['Attendance Report'],
                ['Generated on', new Date().toLocaleDateString()],
                ['Date', new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })],
                [''],
                ['Today\'s Classes'],
                ['Class', 'Total Students', 'Present', 'Absent', 'Status'],
                ...attendanceData.today.classes.map(c => [
                    c.className,
                    c.totalStudents,
                    c.marked ? c.present : 'Not Marked',
                    c.marked ? c.absent : 'Not Marked',
                    c.marked ? 'Completed' : 'Pending'
                ]),
                [''],
                ['Monthly Summary'],
                ['Metric', 'Value'],
                ['Total Present', attendanceData.monthly.present],
                ['Total Absent', attendanceData.monthly.absent],
                ['Late Arrivals', attendanceData.monthly.late],
                ['Average Attendance', attendanceData.monthly.averageAttendance + '%']
            ];

            const csvContent = csvData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `Attendance_Report_${new Date().toISOString().split('T')[0]}.csv`;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            console.log('Attendance report exported successfully');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export report. Please try again.');
        }
    };

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Attendance Management</h1>
                    <p className="page-subtitle">Mark and track student attendance</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </div>

            {!selectedClass ? (
                <div>
                    {/* Attendance Summary */}
                    <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                                <CheckCircle size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Total Present</h3>
                                <div className="kpi-value">{attendanceData.monthly.present}</div>
                                <div className="kpi-change">This month</div>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                                <XCircle size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Total Absent</h3>
                                <div className="kpi-value">{attendanceData.monthly.absent}</div>
                                <div className="kpi-change">This month</div>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                                <Clock size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Late Arrivals</h3>
                                <div className="kpi-value">{attendanceData.monthly.late}</div>
                                <div className="kpi-change">This month</div>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                                <Calendar size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Attendance Rate</h3>
                                <div className="kpi-value">{attendanceData.monthly.averageAttendance}%</div>
                                <div className="kpi-change">Average</div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Classes - Attendance Status */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2 className="card-title">Today's Attendance</h2>
                            <button className="btn-primary" onClick={exportAttendanceReport}>
                                <Download size={16} /> Export Report
                            </button>
                        </div>
                        <div className="card-body">
                            <div style={{ display: 'grid', gap: '16px' }}>
                                {attendanceData.today.classes.map((classItem) => (
                                    <div key={classItem.classId} style={{
                                        padding: '20px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                                                {classItem.className}
                                            </h3>
                                            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6b7280' }}>
                                                <span>👥 {classItem.totalStudents} students</span>
                                                {classItem.marked && (
                                                    <>
                                                        <span style={{ color: '#10b981' }}>✓ {classItem.present} Present</span>
                                                        <span style={{ color: '#ef4444' }}>✗ {classItem.absent} Absent</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            {classItem.marked ? (
                                                <span style={{
                                                    padding: '8px 16px',
                                                    backgroundColor: '#d1fae5',
                                                    color: '#065f46',
                                                    borderRadius: '6px',
                                                    fontSize: '14px',
                                                    fontWeight: '500'
                                                }}>
                                                    ✓ Marked
                                                </span>
                                            ) : (
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => {
                                                        const selectedClassData = teacherClasses.find(c => c.id === classItem.classId);
                                                        setSelectedClass(selectedClassData);
                                                    }}
                                                >
                                                    Mark Attendance
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // Attendance Marking Interface
                <div>
                    <button onClick={() => { setSelectedClass(null); setAttendanceRecords({}); }} className="btn-secondary" style={{ marginBottom: '20px' }}>
                        ← Back to Overview
                    </button>

                    <div className="dashboard-card">
                        <div className="card-header">
                            <div>
                                <h2 className="card-title">Mark Attendance - {selectedClass.subject} ({selectedClass.grade})</h2>
                                <p style={{ color: '#6b7280', fontSize: '14px' }}>{selectedClass.schedule} • {selectedClass.room}</p>
                            </div>
                            <button className="btn-primary" onClick={saveAttendance}>
                                Save Attendance
                            </button>
                        </div>
                        <div className="card-body">
                            {/* Bulk Actions */}
                            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
                                <button className="btn-secondary" onClick={markAllPresent}>Mark All Present</button>
                                <button className="btn-secondary" onClick={markAllAbsent}>Mark All Absent</button>
                            </div>

                            {/* Student List */}
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Roll No</th>
                                            <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Student Name</th>
                                            <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Attendance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.from({ length: 10 }, (_, i) => ({
                                            id: `STU${i + 1}`,
                                            rollNo: i + 1,
                                            name: `Student ${i + 1}`
                                        })).map((student) => (
                                            <tr key={student.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px' }}>{student.rollNo}</td>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>{student.name}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'present')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                border: attendanceRecords[student.id] === 'present' ? '2px solid #10b981' : '1px solid #e5e7eb',
                                                                backgroundColor: attendanceRecords[student.id] === 'present' ? '#d1fae5' : 'white',
                                                                color: attendanceRecords[student.id] === 'present' ? '#065f46' : '#6b7280',
                                                                cursor: 'pointer',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            ✓ Present
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'absent')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                border: attendanceRecords[student.id] === 'absent' ? '2px solid #ef4444' : '1px solid #e5e7eb',
                                                                backgroundColor: attendanceRecords[student.id] === 'absent' ? '#fee2e2' : 'white',
                                                                color: attendanceRecords[student.id] === 'absent' ? '#991b1b' : '#6b7280',
                                                                cursor: 'pointer',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            ✗ Absent
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student.id, 'late')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                border: attendanceRecords[student.id] === 'late' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                                                                backgroundColor: attendanceRecords[student.id] === 'late' ? '#fef3c7' : 'white',
                                                                color: attendanceRecords[student.id] === 'late' ? '#92400e' : '#6b7280',
                                                                cursor: 'pointer',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            ⏰ Late
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Summary</h4>
                                <div style={{ display: 'flex', gap: '24px', fontSize: '14px' }}>
                                    <span style={{ color: '#10b981' }}>
                                        Present: {Object.values(attendanceRecords).filter(s => s === 'present').length}
                                    </span>
                                    <span style={{ color: '#ef4444' }}>
                                        Absent: {Object.values(attendanceRecords).filter(s => s === 'absent').length}
                                    </span>
                                    <span style={{ color: '#f59e0b' }}>
                                        Late: {Object.values(attendanceRecords).filter(s => s === 'late').length}
                                    </span>
                                    <span style={{ color: '#6b7280' }}>
                                        Not Marked: {10 - Object.keys(attendanceRecords).length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherAttendanceView;
