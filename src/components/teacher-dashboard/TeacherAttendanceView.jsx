import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Calendar, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import './TeacherDashboardOverview.css';

const TeacherAttendanceView = () => {
    const { user } = useAuth();
    const [selectedClass, setSelectedClass] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState({});
    
    const [teacherClasses, setTeacherClasses] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [attendanceStats, setAttendanceStats] = useState({
        totalPresent: 0,
        totalAbsent: 0,
        totalLate: 0,
        todayAttendance: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const classRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const studentsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/students`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (classRes.ok && studentsRes.ok) {
                    const classesData = await classRes.json();
                    const studentsData = await studentsRes.json();
                    
                    const assignedClasses = [];
                    classesData.forEach(c => {
                        c.sections.forEach(s => {
                            if (s.classTeacher && s.classTeacher._id === user._id) {
                                assignedClasses.push({
                                    classId: `${c._id}-${s._id}`,
                                    grade: c.name,
                                    section: s.name,
                                    className: c.name + ' - ' + s.name,
                                    subject: c.name + ' - ' + s.name,
                                    totalStudents: studentsData.filter(stu => stu.class === c.name && stu.section === s.name).length,
                                });
                            }
                        });
                    });
                    setTeacherClasses(assignedClasses);
                    setAllStudents(studentsData);
                }

                const statsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/attendance/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    setAttendanceStats({
                        totalPresent: stats.totalPresent || 0,
                        totalAbsent: stats.totalAbsent || 0,
                        totalLate: stats.totalLate || 0,
                        todayAttendance: stats.todayAttendance || 0
                    });
                }
            } catch (error) { toast.error('Failed to load data'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [user]);

    const getClassStudents = () => {
        if (!selectedClass) return [];
        return allStudents.filter(s => s.class === selectedClass.grade && s.section === selectedClass.section);
    };

    const markAttendance = (studentId, status) => {
        setAttendanceRecords(prev => ({ ...prev, [studentId]: status }));
    };

    const saveAttendance = async () => {
        try {
            const token = localStorage.getItem('token');
            const recordsToSubmit = Object.keys(attendanceRecords).map(studentId => ({
                studentId,
                status: attendanceRecords[studentId] === 'present' ? 'Present' : attendanceRecords[studentId] === 'absent' ? 'Absent' : 'Late',
                remark: ''
            }));

            if (recordsToSubmit.length === 0) {
                toast.error('No attendance marked');
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/attendance/mark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    attendanceRecords: recordsToSubmit,
                    date: new Date().toISOString(),
                    class: selectedClass.grade,
                    section: selectedClass.section
                })
            });

            if (res.ok) {
                toast.success('Attendance saved successfully!');
                setSelectedClass(null);
                setAttendanceRecords({});
            } else {
                toast.error('Failed to save attendance');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const markAllPresent = () => {
        const students = getClassStudents();
        const newRecords = {};
        students.forEach(s => { newRecords[s._id] = 'present'; });
        setAttendanceRecords(newRecords);
    };

    const markAllAbsent = () => {
        const students = getClassStudents();
        const newRecords = {};
        students.forEach(s => { newRecords[s._id] = 'absent'; });
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
                ...teacherClasses.map(c => [
                    c.className,
                    c.totalStudents,
                    c.marked ? c.present : 'Not Marked',
                    c.marked ? c.absent : 'Not Marked',
                    c.marked ? 'Completed' : 'Pending'
                ]),
                [''],
                ['Today Summary'],
                ['Metric', 'Value'],
                ['Total Present', attendanceStats.totalPresent],
                ['Total Absent', attendanceStats.totalAbsent],
                ['Late Arrivals', attendanceStats.totalLate],
                ['Average Attendance', attendanceStats.todayAttendance + '%']
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

            toast.success('Attendance report exported');
        } catch (error) {
            toast.error('Failed to export report. Please try again.');
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
                                <div className="kpi-value">{attendanceStats.totalPresent}</div>
                                <div className="kpi-change">Today</div>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                                <XCircle size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Total Absent</h3>
                                <div className="kpi-value">{attendanceStats.totalAbsent}</div>
                                <div className="kpi-change">Today</div>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                                <Clock size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Late Arrivals</h3>
                                <div className="kpi-value">{attendanceStats.totalLate}</div>
                                <div className="kpi-change">Today</div>
                            </div>
                        </div>
                        <div className="kpi-card">
                            <div className="kpi-icon-wrapper" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                                <Calendar size={24} />
                            </div>
                            <div className="kpi-content">
                                <h3 className="kpi-title">Attendance Rate</h3>
                                <div className="kpi-value">{attendanceStats.todayAttendance}%</div>
                                <div className="kpi-change">Average</div>
                            </div>
                        </div>
                    </div>

                    {/* Today's Classes - Attendance Status */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2 className="card-title">My Classes Attendance</h2>
                        </div>
                        <div className="card-body">
                            {loading ? <p>Loading classes...</p> : teacherClasses.length === 0 ? <p>No classes assigned.</p> : (
                                <div style={{ display: 'grid', gap: '16px' }}>
                                    {teacherClasses.map((classItem) => (
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
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => setSelectedClass(classItem)}
                                                >
                                                    Mark Attendance
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                        {getClassStudents().length === 0 ? <tr><td colSpan="3" style={{ padding: '12px', textAlign: 'center' }}>No students in this class</td></tr> : getClassStudents().map((student) => (
                                            <tr key={student._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                                <td style={{ padding: '12px' }}>{student.rollNo || '-'}</td>
                                                <td style={{ padding: '12px', fontWeight: '500' }}>{student.firstName} {student.lastName}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                        <button
                                                            onClick={() => markAttendance(student._id, 'present')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                border: attendanceRecords[student._id] === 'present' ? '2px solid #10b981' : '1px solid #e5e7eb',
                                                                backgroundColor: attendanceRecords[student._id] === 'present' ? '#d1fae5' : 'white',
                                                                color: attendanceRecords[student._id] === 'present' ? '#065f46' : '#6b7280',
                                                                cursor: 'pointer',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            ✓ Present
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student._id, 'absent')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                border: attendanceRecords[student._id] === 'absent' ? '2px solid #ef4444' : '1px solid #e5e7eb',
                                                                backgroundColor: attendanceRecords[student._id] === 'absent' ? '#fee2e2' : 'white',
                                                                color: attendanceRecords[student._id] === 'absent' ? '#991b1b' : '#6b7280',
                                                                cursor: 'pointer',
                                                                fontWeight: '500'
                                                            }}
                                                        >
                                                            ✗ Absent
                                                        </button>
                                                        <button
                                                            onClick={() => markAttendance(student._id, 'late')}
                                                            style={{
                                                                padding: '8px 16px',
                                                                borderRadius: '6px',
                                                                border: attendanceRecords[student._id] === 'late' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
                                                                backgroundColor: attendanceRecords[student._id] === 'late' ? '#fef3c7' : 'white',
                                                                color: attendanceRecords[student._id] === 'late' ? '#92400e' : '#6b7280',
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
                                        Not Marked: {getClassStudents().length - Object.keys(attendanceRecords).length}
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
