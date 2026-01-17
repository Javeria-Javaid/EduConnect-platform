import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { FileText, CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import './Admissions.css';

// Mock Data
const MOCK_APPLICATIONS = [
    { id: 1, applicant: 'Alice Doe', grade: 'Grade 5', parent: 'John Doe', date: '2024-03-15', status: 'Pending', documents: ['Birth Certificate', 'Previous Report Card'] },
    { id: 2, applicant: 'Charlie Smith', grade: 'Grade 8', parent: 'Jane Smith', date: '2024-03-10', status: 'Accepted', documents: ['All documents verified'] },
    { id: 3, applicant: 'David Brown', grade: 'Grade 10', parent: 'Robert Brown', date: '2024-03-12', status: 'Rejected', documents: ['Missing residence proof'] },
    { id: 4, applicant: 'Grace Wilson', grade: 'Grade 3', parent: 'Michael Wilson', date: '2024-03-18', status: 'Pending', documents: ['Application submitted'] },
    { id: 5, applicant: 'Frank Davis', grade: 'Kindergarten', parent: 'Emily Davis', date: '2024-03-20', status: 'On Hold', documents: ['Interview scheduled'] },
];

const Admissions = () => {
    const [applications, setApplications] = useState(MOCK_APPLICATIONS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentApp, setCurrentApp] = useState(null);
    const [modalMode, setModalMode] = useState('view'); // 'view' or 'add'

    const columns = [
        {
            header: 'Applicant',
            accessor: 'applicant',
            render: (item) => (
                <div className="applicant-cell">
                    <div className="applicant-avatar">
                        <User size={16} />
                    </div>
                    <div>
                        <span className="applicant-name">{item.applicant}</span>
                        <span className="applicant-grade">{item.grade}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Parent',
            accessor: 'parent',
            render: (item) => <span className="text-gray-600">{item.parent}</span>
        },
        {
            header: 'Date',
            accessor: 'date',
            render: (item) => (
                <div className="date-cell">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{item.date}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => {
                let statusClass = 'status-badge ';
                let Icon = Clock;

                switch (item.status) {
                    case 'Accepted':
                        statusClass += 'active';
                        Icon = CheckCircle;
                        break;
                    case 'Pending':
                        statusClass += 'pending';
                        Icon = Clock;
                        break;
                    case 'Rejected':
                        statusClass += 'inactive';
                        Icon = XCircle;
                        break;
                    case 'On Hold':
                        statusClass += 'warning';
                        Icon = Clock;
                        break;
                    default: statusClass += 'default';
                }

                return (
                    <span className={statusClass}>
                        <Icon size={12} />
                        {item.status}
                    </span>
                );
            }
        }
    ];

    const filters = [
        {
            key: 'status',
            label: 'All Statuses',
            options: [
                { value: 'Accepted', label: 'Accepted' },
                { value: 'Pending', label: 'Pending' },
                { value: 'Rejected', label: 'Rejected' },
                { value: 'On Hold', label: 'On Hold' }
            ]
        },
        {
            key: 'grade',
            label: 'All Grades',
            options: [
                { value: 'Kindergarten', label: 'Kindergarten' },
                { value: 'Grade 3', label: 'Grade 3' },
                { value: 'Grade 5', label: 'Grade 5' },
                { value: 'Grade 8', label: 'Grade 8' },
                { value: 'Grade 10', label: 'Grade 10' }
            ]
        }
    ];

    const handleView = (app) => {
        setCurrentApp(app);
        setModalMode('view');
        setIsModalOpen(true);
    };

    const handleStatusChange = (newStatus) => {
        setApplications(applications.map(app =>
            app.id === currentApp.id ? { ...app, status: newStatus } : app
        ));
        setCurrentApp({ ...currentApp, status: newStatus });
    };

    const handleAdd = () => {
        setCurrentApp(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleSaveApplication = (e) => {
        e.preventDefault();
        const newApp = {
            id: applications.length + 1,
            applicant: e.target.applicant.value,
            grade: e.target.grade.value,
            parent: e.target.parent.value,
            date: new Date().toISOString().split('T')[0],
            status: 'Pending',
            documents: ['Application Submitted']
        };
        setApplications([...applications, newApp]);
        setIsModalOpen(false);
    };

    return (
        <div className="admissions-page">
            <PageHeader
                title="Admissions"
                subtitle="Track and manage student applications and enrollment."
                actionLabel="New Application"
                onAction={handleAdd}
            />

            <div className="admissions-stats">
                <div className="stat-card">
                    <span className="stat-label">Total Applications</span>
                    <span className="stat-value">{applications.length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Pending</span>
                    <span className="stat-value">{applications.filter(a => a.status === 'Pending').length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">Accepted</span>
                    <span className="stat-value">{applications.filter(a => a.status === 'Accepted').length}</span>
                </div>
            </div>

            <div className="admissions-actions">
                <div className="bulk-actions">
                    <button
                        className="bulk-btn bulk-accept"
                        onClick={() => alert('Bulk Accept feature coming soon')}
                    >
                        <CheckCircle size={18} />
                        Bulk Accept
                    </button>
                    <button
                        className="bulk-btn bulk-reject"
                        onClick={() => alert('Bulk Reject feature coming soon')}
                    >
                        <XCircle size={18} />
                        Bulk Reject
                    </button>
                </div>
                <div className="checklist-toggle">
                    <label className="checklist-label" htmlFor="auto-checklist">Automated Checklist</label>
                    <div className="toggle-switch">
                        <input type="checkbox" name="auto-checklist" id="auto-checklist" className="toggle-checkbox" defaultChecked />
                        <label htmlFor="auto-checklist" className="toggle-label"></label>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={applications}
                onView={handleView}
                searchPlaceholder="Search applicants..."
                filters={filters}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'New Student Application' : 'Application Details'}
            >
                {modalMode === 'view' && currentApp ? (
                    <div className="application-details">
                        <div className="detail-header">
                            <div className="applicant-avatar-large">
                                <User size={32} />
                            </div>
                            <div>
                                <h3>{currentApp.applicant}</h3>
                                <p>{currentApp.grade}</p>
                            </div>
                            <div className={`status-badge large ${currentApp.status.toLowerCase().replace(' ', '-')}`}>
                                {currentApp.status}
                            </div>
                        </div>

                        <div className="detail-section">
                            <h4>Applicant Information</h4>
                            <div className="detail-row">
                                <span className="label">Parent Name:</span>
                                <span className="value">{currentApp.parent}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">Application Date:</span>
                                <span className="value">{currentApp.date}</span>
                            </div>
                        </div>

                        <div className="detail-section">
                            <h4>Documents & Checklist</h4>
                            <ul className="checklist">
                                {currentApp.documents.map((doc, idx) => (
                                    <li key={idx} className="checklist-item">
                                        <CheckCircle size={16} className="text-green-500" />
                                        {doc}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="action-buttons">
                            <button
                                className="action-btn accept"
                                onClick={() => handleStatusChange('Accepted')}
                                disabled={currentApp.status === 'Accepted'}
                            >
                                Accept Application
                            </button>
                            <button
                                className="action-btn reject"
                                onClick={() => handleStatusChange('Rejected')}
                                disabled={currentApp.status === 'Rejected'}
                            >
                                Reject
                            </button>
                            <button
                                className="action-btn hold"
                                onClick={() => handleStatusChange('On Hold')}
                                disabled={currentApp.status === 'On Hold'}
                            >
                                Put On Hold
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSaveApplication} className="admissions-form">
                        <div className="form-group">
                            <label>Student Name</label>
                            <input type="text" name="applicant" required placeholder="Enter student name" />
                        </div>
                        <div className="form-group">
                            <label>Grade Applying For</label>
                            <select name="grade" required>
                                <option value="">Select Grade</option>
                                <option value="Kindergarten">Kindergarten</option>
                                <option value="Grade 1">Grade 1</option>
                                <option value="Grade 2">Grade 2</option>
                                <option value="Grade 3">Grade 3</option>
                                <option value="Grade 4">Grade 4</option>
                                <option value="Grade 5">Grade 5</option>
                                <option value="Grade 6">Grade 6</option>
                                <option value="Grade 7">Grade 7</option>
                                <option value="Grade 8">Grade 8</option>
                                <option value="Grade 9">Grade 9</option>
                                <option value="Grade 10">Grade 10</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Parent/Guardian Name</label>
                            <input type="text" name="parent" required placeholder="Enter parent name" />
                        </div>
                        <div className="form-group">
                            <label>Contact Email</label>
                            <input type="email" name="email" required placeholder="Enter contact email" />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input type="date" name="dob" required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Submit Application</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Admissions;
