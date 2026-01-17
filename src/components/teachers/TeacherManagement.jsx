import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { GraduationCap, Book, FileText, Star, Calendar, Mail } from 'lucide-react';
import './TeacherManagement.css';

// Mock Data
const MOCK_TEACHERS = [
    { id: 1, name: 'Sarah Johnson', subject: 'Mathematics', classes: ['Grade 9A', 'Grade 10B'], qualification: 'M.Sc. Mathematics', status: 'Active', rating: 4.8, joined: '2020-08-15' },
    { id: 2, name: 'David Lee', subject: 'Science', classes: ['Grade 8C', 'Grade 9A'], qualification: 'Ph.D. Physics', status: 'Active', rating: 4.9, joined: '2019-05-20' },
    { id: 3, name: 'Maria Garcia', subject: 'English', classes: ['Grade 7A', 'Grade 7B'], qualification: 'B.A. English Lit', status: 'On Leave', rating: 4.5, joined: '2021-01-10' },
    { id: 4, name: 'James Wilson', subject: 'History', classes: ['Grade 10A'], qualification: 'M.A. History', status: 'Active', rating: 4.2, joined: '2022-03-01' },
    { id: 5, name: 'Linda Chen', subject: 'Art', classes: ['Grade 5', 'Grade 6'], qualification: 'B.F.A.', status: 'Active', rating: 4.7, joined: '2023-09-01' },
];

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState(MOCK_TEACHERS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [modalMode, setModalMode] = useState('add');

    const columns = [
        {
            header: 'Teacher Name',
            accessor: 'name',
            render: (item) => (
                <div className="teacher-name-cell">
                    <div className="teacher-avatar">
                        <GraduationCap size={16} />
                    </div>
                    <div>
                        <span className="teacher-name-text">{item.name}</span>
                        <span className="teacher-qual-text">{item.qualification}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Subject',
            accessor: 'subject',
            render: (item) => (
                <div className="subject-cell">
                    <Book size={14} className="text-blue-500" />
                    <span>{item.subject}</span>
                </div>
            )
        },
        {
            header: 'Classes',
            accessor: 'classes',
            render: (item) => (
                <div className="classes-list">
                    {item.classes.join(', ')}
                </div>
            )
        },
        {
            header: 'Rating',
            accessor: 'rating',
            render: (item) => (
                <div className="rating-cell">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span>{item.rating}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`status-badge ${item.status === 'Active' ? 'active' : 'warning'}`}>
                    {item.status}
                </span>
            )
        }
    ];

    const filters = [
        {
            key: 'subject',
            label: 'All Subjects',
            options: [
                { value: 'Mathematics', label: 'Mathematics' },
                { value: 'Science', label: 'Science' },
                { value: 'English', label: 'English' },
                { value: 'History', label: 'History' },
                { value: 'Art', label: 'Art' }
            ]
        }
    ];

    const handleAdd = () => {
        setCurrentTeacher(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEdit = (teacher) => {
        setCurrentTeacher(teacher);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleView = (teacher) => {
        setCurrentTeacher(teacher);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleDelete = (teacher) => {
        if (window.confirm(`Delete ${teacher.name}?`)) {
            setTeachers(teachers.filter(t => t.id !== teacher.id));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newTeacher = {
                id: teachers.length + 1,
                name: e.target.name.value,
                subject: e.target.subject.value,
                qualification: e.target.qualification.value,
                classes: e.target.classes.value.split(',').map(s => s.trim()),
                status: 'Active',
                rating: 0,
                joined: new Date().toISOString().split('T')[0]
            };
            setTeachers([...teachers, newTeacher]);
        } else if (modalMode === 'edit') {
            setTeachers(teachers.map(t => t.id === currentTeacher.id ? {
                ...t,
                name: e.target.name.value,
                subject: e.target.subject.value,
                qualification: e.target.qualification.value,
                classes: e.target.classes.value.split(',').map(s => s.trim())
            } : t));
        }
        setIsModalOpen(false);
    };

    const handleAssignClass = (teacher) => {
        const newClass = prompt(`Assign a new class to ${teacher.name}:`);
        if (newClass) {
            setTeachers(teachers.map(t => t.id === teacher.id ? { ...t, classes: [...t.classes, newClass] } : t));
            if (currentTeacher && currentTeacher.id === teacher.id) {
                setCurrentTeacher({ ...currentTeacher, classes: [...currentTeacher.classes, newClass] });
            }
        }
    };

    const handleViewFeedback = (teacher) => {
        alert(`Viewing feedback reports for ${teacher.name} (Feature coming soon)`);
    };

    return (
        <div className="teacher-management-page">
            <PageHeader
                title="Teacher Management"
                subtitle="Manage teaching staff, assignments, and performance reviews."
                actionLabel="Add Teacher"
                onAction={handleAdd}
            />

            <DataTable
                columns={columns}
                data={teachers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                searchPlaceholder="Search teachers..."
                filters={filters}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add Teacher' : modalMode === 'edit' ? 'Edit Teacher' : 'Teacher Profile'}
            >
                {modalMode === 'view' && currentTeacher ? (
                    <div className="teacher-details-view">
                        <div className="profile-header">
                            <div className="profile-avatar-large">
                                <GraduationCap size={32} />
                            </div>
                            <div>
                                <h3>{currentTeacher.name}</h3>
                                <p className="text-gray-500">{currentTeacher.qualification}</p>
                            </div>
                        </div>

                        <div className="detail-grid">
                            <div className="detail-card">
                                <span className="label">Subject</span>
                                <div className="value flex items-center gap-2">
                                    <Book size={16} className="text-blue-500" /> {currentTeacher.subject}
                                </div>
                            </div>
                            <div className="detail-card">
                                <span className="label">Joined</span>
                                <div className="value flex items-center gap-2">
                                    <Calendar size={16} className="text-green-500" /> {currentTeacher.joined}
                                </div>
                            </div>
                            <div className="detail-card">
                                <span className="label">Rating</span>
                                <div className="value flex items-center gap-2">
                                    <Star size={16} className="text-yellow-500 fill-current" /> {currentTeacher.rating}
                                </div>
                            </div>
                        </div>

                        <div className="detail-section">
                            <div className="flex justify-between items-center mb-2">
                                <h4>Assigned Classes</h4>
                                <button className="text-sm text-blue-600 hover:underline" onClick={() => handleAssignClass(currentTeacher)}>+ Assign Class</button>
                            </div>
                            <div className="classes-tags">
                                {currentTeacher.classes.map((cls, idx) => (
                                    <span key={idx} className="class-tag">{cls}</span>
                                ))}
                            </div>
                        </div>

                        <div className="detail-section">
                            <div className="flex justify-between items-center mb-2">
                                <h4>Performance & Feedback</h4>
                                <button className="text-sm text-blue-600 hover:underline" onClick={() => handleViewFeedback(currentTeacher)}>View Reports</button>
                            </div>
                            <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                                No recent feedback reports available.
                            </div>
                        </div>

                        <div className="detail-section">
                            <h4>Documents</h4>
                            <div className="documents-list">
                                <div className="doc-item">
                                    <FileText size={16} />
                                    <span>Resume.pdf</span>
                                </div>
                                <div className="doc-item">
                                    <FileText size={16} />
                                    <span>Contract_2024.pdf</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="teacher-form">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" defaultValue={currentTeacher?.name} required />
                        </div>
                        <div className="form-group">
                            <label>Qualification</label>
                            <input type="text" name="qualification" defaultValue={currentTeacher?.qualification} required />
                        </div>
                        <div className="form-group">
                            <label>Subject</label>
                            <select name="subject" defaultValue={currentTeacher?.subject || 'Mathematics'}>
                                <option value="Mathematics">Mathematics</option>
                                <option value="Science">Science</option>
                                <option value="English">English</option>
                                <option value="History">History</option>
                                <option value="Art">Art</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Classes (comma separated)</label>
                            <input type="text" name="classes" defaultValue={currentTeacher?.classes.join(', ')} placeholder="e.g. Grade 9A, Grade 10B" required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Save Changes</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TeacherManagement;
