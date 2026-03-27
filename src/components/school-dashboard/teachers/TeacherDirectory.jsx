import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Edit, MessageCircle, Plus, Download, Trash2 } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import AddTeacherModal from './AddTeacherModal';
import ViewTeacherModal from './ViewTeacherModal';
import MessageModal from './MessageModal';
import { toast } from 'sonner';
import './TeacherDirectory.css';

const TeacherDirectory = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('Name');
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [viewingTeacher, setViewingTeacher] = useState(null);
    const [messageRecipient, setMessageRecipient] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    
    const [stats, setStats] = useState({ totalTeachers: 0, activeTeachers: 0, onLeaveTeachers: 0 });

    const teacherFilters = useMemo(() => ([
        {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'On Leave', value: 'On Leave' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' }
            ]
        },
        {
            key: 'employmentType',
            label: 'Employment Type',
            type: 'select',
            options: [
                { label: 'Full-time', value: 'Full-time' },
                { label: 'Part-time', value: 'Part-time' },
                { label: 'Contract', value: 'Contract' }
            ]
        },
        {
            key: 'attendanceRange',
            label: 'Attendance',
            type: 'select',
            options: [
                { label: 'Below 50%', value: 'Below 50%' },
                { label: '50-75%', value: '50-75%' },
                { label: 'Above 75%', value: 'Above 75%' }
            ]
        },
        {
            key: 'performanceRange',
            label: 'Performance',
            type: 'select',
            options: [
                { label: '5 Stars', value: '5' },
                { label: '4 Stars', value: '4' },
                { label: '3 Stars', value: '3' },
                { label: '2 Stars', value: '2' },
                { label: '1 Star', value: '1' }
            ]
        }
    ]), []);

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            // Fetch current user if not fetched yet
            if (!currentUser) {
                try {
                    const uRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (uRes.ok) {
                        const uData = await uRes.json();
                        setCurrentUser(uData.data || uData);
                    }
                } catch(e) { console.error('Failed to fetch user', e) }
            }
            
            // Build query params
            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                search: searchTerm,
                searchBy: searchBy
            });

            if (activeFilters.status) {
                params.append('status', activeFilters.status);
            }
            if (activeFilters.employmentType) {
                params.append('employmentType', activeFilters.employmentType);
            }
            if (activeFilters.attendanceRange) {
                params.append('attendanceRange', activeFilters.attendanceRange);
            }
            if (activeFilters.performanceRange) {
                params.append('performanceRange', activeFilters.performanceRange);
            }

            const [res, statsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/schools/teachers?${params.toString()}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                }),
                fetch(`${import.meta.env.VITE_API_URL}/api/schools/teachers/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
            ]);
            
            if (res.ok && statsRes.ok) {
                const result = await res.json();
                const statsData = await statsRes.json();
                setStats(statsData);

                if (result.data) {
                    setTeachers(result.data);
                    setTotalCount(result.total);
                } else {
                    setTeachers(result);
                    setTotalCount(result.length);
                }
            } else {
                toast.error('Failed to fetch teachers data');
            }
        } catch (error) {
            toast.error('Network error fetching teachers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, [currentPage, activeFilters]);

    // Handle search debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchTeachers();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchBy]);

    const handleAddTeacher = async (teacherData) => {
        try {
            const token = localStorage.getItem('token');
            const url = editingTeacher 
                ? `${import.meta.env.VITE_API_URL}/api/schools/teachers/${editingTeacher._id}`
                : `${import.meta.env.VITE_API_URL}/api/schools/teachers`;
            const method = editingTeacher ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(teacherData)
            });

            if (res.ok) {
                toast.success(editingTeacher ? 'Teacher updated' : 'Teacher added');
                setIsAddModalOpen(false);
                setEditingTeacher(null);
                fetchTeachers();
            } else {
                const err = await res.json();
                toast.error(err.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDeleteTeacher = async (id) => {
        if (!window.confirm('Are you sure you want to delete this teacher?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/teachers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Teacher deleted');
                fetchTeachers();
            } else {
                toast.error('Failed to delete teacher');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleSearch = (val, field) => {
        setSearchTerm(val);
        setSearchBy(field);
    };

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Table columns configuration
    const columns = [
        {
            key: 'photo',
            label: 'Photo',
            render: (teacher) => {
                if (teacher.photo) {
                    return <img src={teacher.photo} alt={teacher.name} className="teacher-photo" />;
                }
                const initial = teacher.name?.charAt(0) || '?';
                return (
                    <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', background: '#66a1be', color: 'white', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold'
                    }}>
                        {initial}
                    </div>
                );
            }
        },
        {
            key: 'name',
            label: 'NAME',
            sortable: true,
            render: (teacher) => (
                <div className="teacher-info-cell">
                    <div className="teacher-name">{teacher.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{teacher.employeeId && teacher.employeeId !== 'N/A' ? `ID: ${teacher.employeeId}` : teacher.email}</div>
                </div>
            )
        },
        {
            key: 'subjects',
            label: 'SUBJECTS',
            render: (teacher) => (
                <div className="subject-tags" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? (
                        teacher.subjects.map((subject, idx) => (
                            <span key={idx} style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid #e2e8f0' }}>
                                {subject}
                            </span>
                        ))
                    ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>Not Assigned</span>
                    )}
                </div>
            )
        },
        {
            key: 'classes',
            label: 'CLASSES',
            render: (teacher) => (
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {Array.isArray(teacher.classesAssigned) && teacher.classesAssigned.length > 0 ? (
                        teacher.classesAssigned.map((cls, idx) => (
                            <span key={idx} style={{ background: '#eff6ff', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', border: '1px solid #bfdbfe' }}>
                                {cls}
                            </span>
                        ))
                    ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic', fontSize: '0.8rem' }}>No Classes</span>
                    )}
                </div>
            )
        },
        {
            key: 'attendance',
            label: 'ATTENDANCE',
            sortable: true,
            render: (teacher) => {
                const att = teacher.attendance;
                if (att === 'N/A') return <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No data</span>;
                
                const percent = Number(att);
                const color = percent >= 75 ? '#10b981' : percent >= 50 ? '#f59e0b' : '#ef4444';
                
                return (
                    <div style={{ width: '100px' }}>
                        <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '3px', marginBottom: '4px', overflow: 'hidden' }}>
                            <div
                                style={{
                                    height: '100%',
                                    width: `${percent}%`,
                                    background: color,
                                    borderRadius: '3px'
                                }}
                            />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{percent}% Present</span>
                    </div>
                );
            }
        },
        {
            key: 'performance',
            label: 'PERFORMANCE',
            sortable: true,
            render: (teacher) => {
                if (!teacher.performance || teacher.performance === 0) {
                    return <span style={{ color: '#94a3b8', fontSize: '0.85rem' }} title="No performance data">No data</span>;
                }
                return (
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ fontSize: '1rem', color: i < teacher.performance ? '#f59e0b' : '#e2e8f0' }}>
                                ★
                            </span>
                        ))}
                    </div>
                );
            }
        },
        {
            key: 'status',
            label: 'STATUS',
            sortable: true,
            render: (teacher) => {
                const statusClass = {
                    'Active': 'badge-success',
                    'On Leave': 'badge-warning',
                    'Suspended': 'badge-danger',
                    'Inactive': 'badge-danger'
                }[teacher.status] || 'badge-neutral';

                return (
                    <span className={`badge ${statusClass}`}>
                        {teacher.status}
                    </span>
                );
            }
        },
        {
            key: 'salary',
            label: 'SALARY',
            sortable: true,
            render: (teacher) => {
                if (!teacher.salary || teacher.salary === 0) {
                    return <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Not Set</span>;
                }
                return <span style={{ fontWeight: '500', color: '#0f172a' }}>Rs. {teacher.salary.toLocaleString()}</span>;
            }
        }
    ];

    const getQuickActions = (teacher) => [
        {
            label: 'View Profile',
            icon: <Eye size={16} strokeWidth={2} />,
            onClick: (s) => {
                setViewingTeacher(s);
                setIsViewModalOpen(true);
            }
        },
        {
            label: 'Edit Details',
            icon: <Edit size={16} strokeWidth={2} />,
            onClick: (s) => {
                setEditingTeacher(s);
                setIsAddModalOpen(true);
            }
        },
        {
            label: 'Send Message',
            icon: <MessageCircle size={16} strokeWidth={2} />,
            onClick: (s) => {
                setMessageRecipient(s);
                setIsMessageModalOpen(true);
            }
        },
        {
            label: 'Delete',
            icon: <Trash2 size={16} strokeWidth={2} />,
            onClick: (s) => handleDeleteTeacher(s._id)
        }
    ];

    return (
        <div className="teacher-directory-container">
            {/* Header */}
            <div className="directory-header">
                <div className="header-content">
                    <h1>Teacher Directory</h1>
                    <p>
                        Manage your school's faculty and academic staff
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => fetchTeachers()}>
                        <Download size={18} />
                        Export
                    </button>
                    {/* Add unread global messages button if desired, skip for now */}
                    <button
                        onClick={() => {
                            setEditingTeacher(null);
                            setIsAddModalOpen(true);
                        }}
                        className="btn-primary"
                    >
                        <Plus size={18} />
                        Add Teacher
                    </button>
                </div>
            </div>

            {/* KPI Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '8px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Total Faculty</p>
                    <h3 style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '700' }}>{stats.totalTeachers}</h3>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #10b981', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>Active Teachers</p>
                    <h3 style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '700' }}>{stats.activeTeachers}</h3>
                </div>
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', borderLeft: '4px solid #f59e0b', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>On Leave</p>
                    <h3 style={{ margin: '8px 0 0 0', color: '#0f172a', fontSize: '1.8rem', fontWeight: '700' }}>{stats.onLeaveTeachers}</h3>
                </div>
            </div>

            {/* Controls & Content */}
            <div className="directory-card">
                <div className="controls-section" style={{ border: 'none', boxShadow: 'none', paddingBottom: '0' }}>
                    <div className="search-filter-row">
                        <div className="search-wrapper">
                            <SearchBar
                                placeholder={`Search by ${searchBy.toLowerCase()}...`}
                                onSearch={handleSearch}
                                searchFields={['Name', 'Subject', 'Email']}
                            />
                        </div>
                        <FilterPanel
                            filters={teacherFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedTeachers.length > 0 && (
                    <div style={{ padding: '0 20px' }}>
                        <div className="bulk-actions-bar">
                            <span className="selected-count">{selectedTeachers.length} selected</span>
                            <div className="action-buttons">
                                <button className="btn-action-sm">Send Message</button>
                                <button className="btn-action-sm">Update Schedule</button>
                                <button className="btn-action-sm">Export Data</button>
                                <button className="btn-danger-sm" onClick={() => {
                                    if(window.confirm(`Delete ${selectedTeachers.length} teachers?`)) {
                                        toast.info('Bulk action pending');
                                    }
                                }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div style={{ padding: '20px', overflowX: 'auto' }}>
                    {loading ? (
                        <div className="loading-state">Loading teachers...</div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={teachers}
                            selectable={true}
                            onSelectionChange={setSelectedTeachers}
                            onQuickAction={getQuickActions}
                            pageSize={pageSize}
                            serverSide={true}
                            totalCount={totalCount}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>

            {/* Add/Edit Teacher Modal */}
            <AddTeacherModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingTeacher(null);
                }}
                onSubmit={handleAddTeacher}
                editingTeacher={editingTeacher}
            />

            {/* View Teacher Profile Modal */}
            <ViewTeacherModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setViewingTeacher(null);
                }}
                teacher={viewingTeacher}
                onEdit={(t) => {
                    setEditingTeacher(t);
                    setIsAddModalOpen(true);
                }}
            />

            {/* Live Chat Message Modal */}
            <MessageModal
                isOpen={isMessageModalOpen}
                onClose={() => {
                    setIsMessageModalOpen(false);
                    setMessageRecipient(null);
                }}
                initialRecipient={messageRecipient}
                currentUser={currentUser}
            />
        </div>
    );
};

export default TeacherDirectory;
