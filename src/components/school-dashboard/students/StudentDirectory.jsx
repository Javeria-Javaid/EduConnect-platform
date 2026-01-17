import React, { useState, useMemo } from 'react';
import { Eye, Edit, MessageCircle, Printer, Plus, Download, Search } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import AddStudentModal from './AddStudentModal';
import { mockStudents, studentFilters } from './mockData';
import './StudentDirectory.css';

const StudentDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddStudent = (studentData) => {
        console.log('New student:', studentData);
        // In real implementation, this would add to database
    };

    // Filter and search logic
    const filteredStudents = useMemo(() => {
        return mockStudents.filter(student => {
            // Search filter
            const matchesSearch = !searchTerm ||
                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.parentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase());

            // Class filter
            const matchesClass = !activeFilters.class ||
                activeFilters.class.includes(student.class);

            // Section filter
            const matchesSection = !activeFilters.section ||
                activeFilters.section.includes(student.section);

            // Gender filter
            const matchesGender = !activeFilters.gender ||
                student.gender === activeFilters.gender;

            // Fee status filter
            const matchesFeeStatus = !activeFilters.feeStatus ||
                activeFilters.feeStatus.includes(student.feeStatus);

            // Attendance filter
            const matchesAttendance = !activeFilters.attendance ||
                student.attendance >= activeFilters.attendance;

            return matchesSearch && matchesClass && matchesSection &&
                matchesGender && matchesFeeStatus && matchesAttendance;
        });
    }, [searchTerm, activeFilters]);

    // Table columns configuration
    const columns = [
        {
            key: 'photo',
            label: 'Photo',
            render: (student) => (
                <img src={student.photo} alt={student.name} className="student-photo" />
            )
        },
        {
            key: 'name',
            label: 'Name',
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
            label: 'Class',
            sortable: true,
            render: (student) => (
                <span className="class-badge">
                    {student.class}-{student.section}
                </span>
            )
        },
        {
            key: 'rollNumber',
            label: 'Roll No.',
            sortable: true,
            render: (student) => <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{student.rollNumber}</span>
        },
        {
            key: 'attendance',
            label: 'Attendance',
            sortable: true,
            render: (student) => (
                <div style={{ width: '100px' }}>
                    <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '3px', marginBottom: '4px', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${student.attendance}%`,
                                background: student.attendance >= 90 ? '#10b981' :
                                    student.attendance >= 75 ? '#f59e0b' : '#ef4444',
                                borderRadius: '3px'
                            }}
                        />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{student.attendance}%</span>
                </div>
            )
        },
        {
            key: 'feeStatus',
            label: 'Fee Status',
            sortable: true,
            render: (student) => {
                const statusClass = {
                    Paid: 'badge-success',
                    Pending: 'badge-warning',
                    Overdue: 'badge-danger'
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
            label: 'Performance',
            sortable: true,
            render: (student) => (
                <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                        <span key={i} style={{ fontSize: '0.9rem', color: i < student.performance ? '#facc15' : '#e2e8f0' }}>
                            ★
                        </span>
                    ))}
                </div>
            )
        }
    ];

    // Quick actions for each student
    const getQuickActions = (student) => [
        {
            label: 'View Profile',
            icon: <Eye size={14} />,
            onClick: (student) => console.log('View', student)
        },
        {
            label: 'Edit Details',
            icon: <Edit size={14} />,
            onClick: (student) => console.log('Edit', student)
        },
        {
            label: 'Send Message',
            icon: <MessageCircle size={14} />,
            onClick: (student) => console.log('Message', student)
        },
        {
            label: 'Print ID Card',
            icon: <Printer size={14} />,
            onClick: (student) => console.log('Print', student)
        }
    ];

    return (
        <div className="student-directory-container">
            {/* Header */}
            <div className="directory-header">
                <div className="header-content">
                    <h1>Student Directory</h1>
                    <p>
                        {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary">
                        <Download size={18} />
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
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
                                placeholder="Search by name, parent, or admission number..."
                                onSearch={setSearchTerm}
                                searchFields={['Name', 'Parent Name', 'Admission Number']}
                            />
                        </div>
                        <FilterPanel
                            filters={studentFilters}
                            onFilterChange={setActiveFilters}
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
                                <button className="btn-danger-sm">Delete</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div style={{ padding: '20px' }}>
                    <DataTable
                        columns={columns}
                        data={filteredStudents}
                        selectable={true}
                        onSelectionChange={setSelectedStudents}
                        onQuickAction={getQuickActions}
                        pageSize={10}
                    />
                </div>
            </div>

            {/* Add Student Modal */}
            <AddStudentModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddStudent}
            />
        </div>
    );
};

export default StudentDirectory;
