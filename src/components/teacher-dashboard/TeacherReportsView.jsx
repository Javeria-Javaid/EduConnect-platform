import React, { useEffect, useMemo, useState } from 'react';
import { Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import './TeacherDashboardOverview.css';

const TeacherReportsView = () => {
    const [selectedClass, setSelectedClass] = useState('all');
    const [dateRange, setDateRange] = useState('This Month');
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) return;

                const [meRes, studentsRes, classesRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/schools/students?page=1&limit=500`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);

                const meJson = meRes.ok ? await meRes.json() : null;
                const me = meJson?.data || meJson;

                if (studentsRes.ok) {
                    const s = await studentsRes.json();
                    setStudents(s.data || s || []);
                }

                if (classesRes.ok) {
                    const c = await classesRes.json();
                    const options = [];
                    (c || []).forEach(cls => {
                        (cls.sections || []).forEach(sec => {
                            if (sec?.classTeacher?._id && me?._id && sec.classTeacher._id === me._id) {
                                options.push({
                                    id: `${cls.name}__${sec.name}`,
                                    label: `${cls.name} - ${sec.name}`,
                                    className: cls.name,
                                    section: sec.name
                                });
                            }
                        });
                    });
                    setClasses(options);
                }
            } catch (e) {
                toast.error('Failed to load reports data');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filteredStudents = useMemo(() => {
        if (selectedClass === 'all') return students;
        const target = classes.find(c => c.id === selectedClass);
        if (!target) return students;
        return (students || []).filter(s => s.class === target.className && s.section === target.section);
    }, [students, selectedClass, classes]);

    const exportAllReports = () => {
        try {
            const rows = (filteredStudents || []).map(s => ([
                s?.name || '',
                s?.admissionNumber || '',
                s?.class || '',
                s?.section || '',
                s?.email || s?.user?.email || '',
                s?.parentName || '',
                s?.parentPhone || '',
                s?.attendance?.rate ?? '',
                s?.performance?.average ?? ''
            ]));

            const csvData = [
                ['Teacher Student Report'],
                ['Generated on', new Date().toLocaleDateString()],
                ['Filter', selectedClass === 'all' ? 'All My Students' : (classes.find(c => c.id === selectedClass)?.label || 'Selected Class')],
                ['Date Range', dateRange],
                [''],
                ['Students'],
                ['Name', 'Admission #', 'Class', 'Section', 'Email', 'Parent', 'Parent Phone', 'Attendance %', 'Performance %'],
                ...rows
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
            toast.success('Report exported');
        } catch (error) {
            toast.error('Failed to export report');
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
            <div className="dashboard-card reports-filters-card">
                <div className="card-body">
                    <div className="reports-filter-bar">
                        <Filter size={16} className="reports-filter-icon" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="reports-filter-select"
                        >
                            <option value="all">All My Students</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="reports-filter-select"
                        >
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Term</option>
                            <option>Custom Range</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">Students</h2>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p className="empty-state-message">Loading…</p>
                    ) : filteredStudents.length === 0 ? (
                        <p className="empty-state-message">No students found for this filter.</p>
                    ) : (
                        <div className="reports-table-wrap">
                            <table className="reports-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Class</th>
                                        <th>Section</th>
                                        <th>Attendance</th>
                                        <th>Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((s) => (
                                        <tr key={s._id}>
                                            <td className="reports-cell-primary">{s?.name}</td>
                                            <td>{s?.class}</td>
                                            <td>{s?.section}</td>
                                            <td>{s?.attendance?.rate ?? '—'}</td>
                                            <td>{s?.performance?.average ?? '—'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherReportsView;
