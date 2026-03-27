import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Edit, MessageCircle, Printer, Plus, Download, Trash2 } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import AddStudentModal from './AddStudentModal';
import { studentFilters } from './mockData';
import { toast } from 'sonner';
import './StudentDirectory.css';

const StudentDirectory = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('Name');
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedStudents, setSelectedStudents] = useState([]);
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const pageSize = 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [dynamicFilters, setDynamicFilters] = useState(studentFilters);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                const classOptions = data.map(c => ({ label: c.name, value: c.name }));
                
                // Update studentFilters array directly in state to inject dynamic classes
                const updatedFilters = studentFilters.map(filter => {
                    if (filter.key === 'class') {
                        return { ...filter, options: classOptions };
                    }
                    return filter;
                });
                setDynamicFilters(updatedFilters);
            }
        } catch (error) {
            console.error('Failed to load classes for filters', error);
        }
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Build query params
            const params = new URLSearchParams({
                page: currentPage,
                limit: pageSize,
                search: searchTerm,
                searchBy: searchBy
            });

            if (activeFilters.class && activeFilters.class.length > 0) {
                params.append('class', activeFilters.class.join(','));
            }
            if (activeFilters.section && activeFilters.section.length > 0) {
                params.append('section', activeFilters.section.join(','));
            }
            if (activeFilters.gender) {
                params.append('gender', activeFilters.gender);
            }
            if (activeFilters.feeStatus && activeFilters.feeStatus.length > 0) {
                params.append('feeStatus', activeFilters.feeStatus.join(','));
            }
            if (activeFilters.attendanceRange) {
                params.append('attendanceRange', activeFilters.attendanceRange);
            }
            if (activeFilters.performanceRange) {
                params.append('performanceRange', activeFilters.performanceRange);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/students?${params.toString()}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                const result = await res.json();
                // Expecting { data, total, page, totalPages } format now
                if (result.data) {
                    setStudents(result.data);
                    setTotalCount(result.total);
                } else {
                    setStudents(result);
                    setTotalCount(result.length);
                }
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to fetch students');
            }
        } catch (error) {
            toast.error('Network error fetching students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [currentPage, activeFilters]);

    // Handle search debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentPage !== 1) {
                setCurrentPage(1); // Will trigger fetchStudents via the other effect
            } else {
                fetchStudents();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, searchBy]);

    const handleAddStudent = async (studentData) => {
        try {
            const token = localStorage.getItem('token');
            const url = editingStudent 
                ? `${import.meta.env.VITE_API_URL}/api/schools/students/${editingStudent._id}`
                : `${import.meta.env.VITE_API_URL}/api/schools/students`;
            const method = editingStudent ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(studentData)
            });

            if (res.ok) {
                toast.success(editingStudent ? 'Student updated' : 'Student added');
                setIsAddModalOpen(false);
                setEditingStudent(null);
                fetchStudents();
            } else {
                const err = await res.json();
                toast.error(err.message || 'Action failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/students/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                toast.success('Student deleted');
                fetchStudents();
            } else {
                toast.error('Failed to delete student');
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
        setCurrentPage(1); // Reset to first page when filtering
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Table columns configuration
    const columns = [
        {
            key: 'photo',
            label: 'Photo',
            render: (student) => (
                <img src={student.photo || 'https://via.placeholder.com/50'} alt={student.name} className="student-photo" />
            )
        },
        {
            key: 'name',
            label: 'NAME',
            sortable: true,
            render: (student) => (
                <div className="student-info-cell">
                    <div className="student-name">{student.name}</div>
                    <div className="student-id">{student.admissionNumber}</div>
                </div>
            )
        },
        {
            key: 'class',
            label: 'CLASS',
            sortable: true,
            render: (student) => (
                <span className="class-badge">
                    {student.class}{student.section ? `-${student.section}` : ''}
                </span>
            )
        },
        {
            key: 'rollNumber',
            label: 'ROLL NO.',
            sortable: true,
            render: (student) => <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: '500' }}>{student.rollNumber}</span>
        },
        {
            key: 'attendance',
            label: 'ATTENDANCE',
            sortable: true,
            render: (student) => {
                const att = student.attendance;
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
                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#475569' }}>{percent}%</span>
                    </div>
                );
            }
        },
        {
            key: 'feeStatus',
            label: 'FEE STATUS',
            sortable: true,
            render: (student) => {
                const statusClass = {
                    'Paid': 'badge-success',
                    'Pending': 'badge-warning',
                    'Overdue': 'badge-danger',
                    'Not Set': 'badge-neutral'
                }[student.feeStatus] || 'badge-neutral';

                return (
                    <span className={`badge ${statusClass}`}>
                        {student.feeStatus}
                    </span>
                );
            }
        },
        {
            key: 'performance',
            label: 'PERFORMANCE',
            sortable: true,
            render: (student) => {
                if (!student.performance || student.performance === 0) {
                    return <span style={{ color: '#94a3b8', fontSize: '0.85rem' }} title="No exam data available">No exams yet</span>;
                }
                return (
                    <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ fontSize: '1rem', color: i < student.performance ? '#f59e0b' : '#e2e8f0' }}>
                                ★
                            </span>
                        ))}
                    </div>
                );
            }
        }
    ];

    // Quick actions for each student
    const getQuickActions = (student) => [
        {
            label: 'View Profile',
            icon: <Eye size={16} strokeWidth={2} />,
            onClick: (s) => console.log('View', s)
        },
        {
            label: 'Edit Details',
            icon: <Edit size={16} strokeWidth={2} />,
            onClick: (s) => {
                setEditingStudent(s);
                setIsAddModalOpen(true);
            }
        },
        {
            label: 'Send Message',
            icon: <MessageCircle size={16} strokeWidth={2} />,
            onClick: (s) => console.log('Message', s)
        },
        {
            label: 'Delete',
            icon: <Trash2 size={16} strokeWidth={2} />,
            onClick: (s) => handleDeleteStudent(s._id)
        }
        // Removed Print ID Card as it was inconsistent and unimplemented, leaving View, Edit, Message, Delete
    ];

    return (
        <div className="student-directory-container">
            {/* Header */}
            <div className="directory-header">
                <div className="header-content">
                    <h1>Student Directory</h1>
                    <p>
                        Total {totalCount} student{totalCount !== 1 ? 's' : ''} enrolled
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={() => fetchStudents()}>
                        <Search size={18} />
                        Refresh
                    </button>
                    <button
                        onClick={() => {
                            setEditingStudent(null);
                            setIsAddModalOpen(true);
                        }}
                        className="btn-primary"
                    >
                        <Plus size={18} />
                        Add Student
                    </button>
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
                                searchFields={['Name', 'Parent Name', 'Admission Number']}
                            />
                        </div>
                        <FilterPanel
                            filters={dynamicFilters}
                            onFilterChange={handleFilterChange}
                        />
                    </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedStudents.length > 0 && (
                    <div style={{ padding: '0 20px' }}>
                        <div className="bulk-actions-bar">
                            <span className="selected-count">{selectedStudents.length} selected</span>
                            <div className="action-buttons">
                                <button className="btn-action-sm">Send Message</button>
                                <button className="btn-action-sm">Update Class</button>
                                <button className="btn-action-sm">Print IDs</button>
                                <button className="btn-danger-sm" onClick={() => {
                                    if(window.confirm(`Delete ${selectedStudents.length} students?`)) {
                                        toast.info('Bulk delete pending implementation');
                                    }
                                }}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div style={{ padding: '20px', overflowX: 'auto' }}>
                    {loading ? (
                        <div className="loading-state">Loading students...</div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={students}
                            selectable={true}
                            onSelectionChange={setSelectedStudents}
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

            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingStudent(null);
                }}
                onSubmit={handleAddStudent}
                editingStudent={editingStudent}
            />
        </div>
    );
};

export default StudentDirectory;
