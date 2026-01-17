import React, { useState, useMemo } from 'react';
import { Eye, Edit, MessageCircle, Calendar, Plus, Download } from 'lucide-react';
import SearchBar from '../shared/SearchBar';
import DataTable from '../shared/DataTable';
import FilterPanel from '../shared/FilterPanel';
import AddTeacherModal from './AddTeacherModal';
import { mockTeachers, teacherFilters } from './mockData';
import './TeacherDirectory.css';

const TeacherDirectory = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [selectedTeachers, setSelectedTeachers] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddTeacher = (teacherData) => {
        console.log('New teacher:', teacherData);
        // In real implementation, this would add to database
    };

    // Filter and search logic
    const filteredTeachers = useMemo(() => {
        return mockTeachers.filter(teacher => {
            // Search filter
            const matchesSearch = !searchTerm ||
                teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                teacher.phone.includes(searchTerm) ||
                teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()));

            // Subject filter
            const matchesSubjects = !activeFilters.subjects ||
                activeFilters.subjects.some(subject => teacher.subjects.includes(subject));

            // Employment type filter
            const matchesEmploymentType = !activeFilters.employmentType ||
                activeFilters.employmentType.includes(teacher.employmentType);

            // Status filter
            const matchesStatus = !activeFilters.status ||
                teacher.status === activeFilters.status;

            // Attendance filter
            const matchesAttendance = !activeFilters.attendance ||
                teacher.attendance >= activeFilters.attendance;

            return matchesSearch && matchesSubjects && matchesEmploymentType &&
                matchesStatus && matchesAttendance;
        });
    }, [searchTerm, activeFilters]);

    // Table columns configuration
    const columns = [
        {
            key: 'photo',
            label: 'Photo',
            render: (teacher) => (
                <img src={teacher.photo} alt={teacher.name} className="teacher-photo" />
            )
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (teacher) => (
                <div className="teacher-info-cell">
                    <div className="teacher-name">{teacher.name}</div>
                    <div className="teacher-designation">{teacher.designation}</div>
                </div>
            )
        },
        {
            key: 'subjects',
            label: 'Subjects',
            render: (teacher) => (
                <div className="subject-tags">
                    {teacher.subjects.map((subject, idx) => (
                        <span key={idx} className="subject-tag">
                            {subject}
                        </span>
                    ))}
                </div>
            )
        },
        {
            key: 'classes',
            label: 'Classes',
            render: (teacher) => (
                <div className="class-count">
                    <span className="class-count-number">{teacher.classCount}</span>
                    <span className="class-count-label">classes</span>
                </div>
            )
        },
        {
            key: 'weeklyLoad',
            label: 'Weekly Load',
            sortable: true,
            render: (teacher) => (
                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#475569' }}>{teacher.weeklyLoad} hrs</span>
            )
        },
        {
            key: 'attendance',
            label: 'Attendance',
            sortable: true,
            render: (teacher) => (
                <div style={{ width: '100px' }}>
                    <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '3px', marginBottom: '4px', overflow: 'hidden' }}>
                        <div
                            style={{
                                height: '100%',
                                width: `${teacher.attendance}%`,
                                background: teacher.attendance >= 90 ? '#10b981' :
                                    teacher.attendance >= 75 ? '#f59e0b' : '#ef4444',
                                borderRadius: '3px'
                            }}
                        />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{teacher.attendance}%</span>
                </div>
            )
        },
        {
            key: 'employmentType',
            label: 'Type',
            sortable: true,
            render: (teacher) => (
                <span className="employment-badge">
                    {teacher.employmentType}
                </span>
            )
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (teacher) => {
                const statusClass = {
                    Active: 'badge-success',
                    'On Leave': 'badge-warning',
                    Inactive: 'badge-neutral'
                }[teacher.status] || 'badge-neutral';

                return (
                    <span className={`badge ${statusClass}`}>
                        {teacher.status}
                    </span>
                );
            }
        }
    ];

    // Quick actions for each teacher
    const getQuickActions = (teacher) => [
        {
            label: 'View Profile',
            icon: <Eye size={14} />,
            onClick: (teacher) => console.log('View', teacher)
        },
        {
            label: 'Edit Details',
            icon: <Edit size={14} />,
            onClick: (teacher) => console.log('Edit', teacher)
        },
        {
            label: 'View Timetable',
            icon: <Calendar size={14} />,
            onClick: (teacher) => console.log('Timetable', teacher)
        },
        {
            label: 'Send Message',
            icon: <MessageCircle size={14} />,
            onClick: (teacher) => console.log('Message', teacher)
        }
    ];

    return (
        <div className="teacher-directory-container">
            {/* Header */}
            <div className="directory-header">
                <div className="header-content">
                    <h1>Teacher Directory</h1>
                    <p>
                        {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found
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
                        Add Teacher
                    </button>
                </div>
            </div>

            {/* Controls & Content */}
            <div className="directory-card">
                <div className="controls-section" style={{ border: 'none', boxShadow: 'none', paddingBottom: '0' }}>
                    <div className="search-filter-row">
                        <div className="search-wrapper">
                            <SearchBar
                                placeholder="Search by name, subject, email, or phone..."
                                onSearch={setSearchTerm}
                                searchFields={['Name', 'Subject', 'Email', 'Phone']}
                            />
                        </div>
                        <FilterPanel
                            filters={teacherFilters}
                            onFilterChange={setActiveFilters}
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
                            </div>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div style={{ padding: '20px' }}>
                    <DataTable
                        columns={columns}
                        data={filteredTeachers}
                        selectable={true}
                        onSelectionChange={setSelectedTeachers}
                        onQuickAction={getQuickActions}
                        pageSize={10}
                    />
                </div>
            </div>

            {/* Add Teacher Modal */}
            <AddTeacherModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleAddTeacher}
            />
        </div>
    );
};

export default TeacherDirectory;
