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
            <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Filter size={16} color="#6b7280" />
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', minWidth: '200px' }}
                        >
                            <option value="all">All My Students</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
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

            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">Students</h2>
                </div>
                <div className="card-body">
                    {loading ? (
                        <p style={{ color: '#6b7280' }}>Loading…</p>
                    ) : filteredStudents.length === 0 ? (
                        <p style={{ color: '#6b7280' }}>No students found for this filter.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Name</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Class</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Section</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Attendance</th>
                                        <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Performance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredStudents.map((s) => (
                                        <tr key={s._id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px', fontWeight: '500' }}>{s?.name}</td>
                                            <td style={{ padding: '12px' }}>{s?.class}</td>
                                            <td style={{ padding: '12px' }}>{s?.section}</td>
                                            <td style={{ padding: '12px' }}>{s?.attendance?.rate ?? '—'}</td>
                                            <td style={{ padding: '12px' }}>{s?.performance?.average ?? '—'}</td>
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
