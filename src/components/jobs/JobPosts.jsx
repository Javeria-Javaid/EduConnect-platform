import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { Briefcase, Users, Calendar, Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import './JobPosts.css';

// Mock Data
const MOCK_JOBS = [
    { id: 1, title: 'Mathematics Teacher', department: 'Academics', type: 'Full-time', applicants: 12, status: 'Active', posted: '2024-03-01' },
    { id: 2, title: 'School Nurse', department: 'Health', type: 'Part-time', applicants: 5, status: 'Active', posted: '2024-03-05' },
    { id: 3, title: 'IT Support Specialist', department: 'IT', type: 'Full-time', applicants: 8, status: 'Closed', posted: '2024-02-15' },
    { id: 4, title: 'Art Teacher', department: 'Academics', type: 'Full-time', applicants: 20, status: 'Active', posted: '2024-03-10' },
    { id: 5, title: 'Bus Driver', department: 'Transport', type: 'Contract', applicants: 3, status: 'Draft', posted: '2024-03-20' },
];

const MOCK_APPLICANTS = [
    { id: 1, name: 'John Smith', email: 'john@example.com', status: 'Interview Scheduled', date: '2024-03-22' },
    { id: 2, name: 'Emma Wilson', email: 'emma@example.com', status: 'New', date: '2024-03-21' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', status: 'Rejected', date: '2024-03-18' },
];

const JobPosts = () => {
    const [jobs, setJobs] = useState(MOCK_JOBS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentJob, setCurrentJob] = useState(null);
    const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view', 'applicants'

    const columns = [
        {
            header: 'Job Title',
            accessor: 'title',
            render: (item) => (
                <div className="job-title-cell">
                    <div className="job-icon-bg">
                        <Briefcase size={16} />
                    </div>
                    <div>
                        <span className="job-title-text">{item.title}</span>
                        <span className="job-dept-text">{item.department} • {item.type}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Applicants',
            accessor: 'applicants',
            render: (item) => (
                <div className="applicants-cell">
                    <Users size={14} className="text-gray-400" />
                    <span>{item.applicants} Candidates</span>
                </div>
            )
        },
        {
            header: 'Posted Date',
            accessor: 'posted',
            render: (item) => (
                <div className="date-cell">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{item.posted}</span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`status-badge ${item.status.toLowerCase()}`}>
                    {item.status}
                </span>
            )
        }
    ];

    const filters = [
        {
            key: 'status',
            label: 'All Statuses',
            options: [
                { value: 'Active', label: 'Active' },
                { value: 'Closed', label: 'Closed' },
                { value: 'Draft', label: 'Draft' }
            ]
        },
        {
            key: 'department',
            label: 'All Departments',
            options: [
                { value: 'Academics', label: 'Academics' },
                { value: 'IT', label: 'IT' },
                { value: 'Health', label: 'Health' },
                { value: 'Transport', label: 'Transport' }
            ]
        }
    ];

    const handleAdd = () => {
        setCurrentJob(null);
        setModalMode('add');
        setIsModalOpen(true);
    };

    const handleEdit = (job) => {
        setCurrentJob(job);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleView = (job) => {
        setCurrentJob(job);
        setModalMode('applicants'); // Direct to applicants view for now
        setIsModalOpen(true);
    };

    const handleDelete = (job) => {
        if (window.confirm(`Delete ${job.title}?`)) {
            setJobs(jobs.filter(j => j.id !== job.id));
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (modalMode === 'add') {
            const newJob = {
                id: jobs.length + 1,
                title: e.target.title.value,
                department: e.target.department.value,
                type: e.target.type.value,
                applicants: 0,
                status: 'Active',
                posted: new Date().toISOString().split('T')[0]
            };
            setJobs([...jobs, newJob]);
        } else if (modalMode === 'edit') {
            setJobs(jobs.map(j => j.id === currentJob.id ? {
                ...j,
                title: e.target.title.value,
                department: e.target.department.value,
                type: e.target.type.value,
                status: e.target.status.value
            } : j));
        }
        setIsModalOpen(false);
    };

    return (
        <div className="job-posts-page">
            <PageHeader
                title="Job Posts"
                subtitle="Manage job openings, track applicants, and schedule interviews."
                actionLabel="Post New Job"
                onAction={handleAdd}
            />

            <div className="job-analytics">
                <div className="analytics-card">
                    <h4 className="analytics-label">Total Active Jobs</h4>
                    <span className="analytics-value analytics-blue">{jobs.filter(j => j.status === 'Active').length}</span>
                </div>
                <div className="analytics-card">
                    <h4 className="analytics-label">Total Applicants</h4>
                    <span className="analytics-value analytics-green">{jobs.reduce((acc, curr) => acc + curr.applicants, 0)}</span>
                </div>
                <div className="analytics-card">
                    <h4 className="analytics-label">Interviews Scheduled</h4>
                    <span className="analytics-value analytics-brand">{8}</span>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={jobs}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                searchPlaceholder="Search jobs..."
                filters={filters}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Post New Job' : modalMode === 'edit' ? 'Edit Job Post' : `Applicants for ${currentJob?.title}`}
                size={modalMode === 'applicants' ? 'large' : 'medium'}
            >
                {modalMode === 'applicants' && currentJob ? (
                    <div className="applicants-view">
                        <div className="job-summary">
                            <div className="summary-item">
                                <span className="label">Department</span>
                                <span className="value">{currentJob.department}</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">Type</span>
                                <span className="value">{currentJob.type}</span>
                            </div>
                            <div className="summary-item">
                                <span className="label">Posted</span>
                                <span className="value">{currentJob.posted}</span>
                            </div>
                        </div>

                        <h4>Candidates ({MOCK_APPLICANTS.length})</h4>
                        <div className="applicants-list">
                            {MOCK_APPLICANTS.map(applicant => (
                                <div key={applicant.id} className="applicant-card">
                                    <div className="applicant-info">
                                        <div className="applicant-avatar">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <span className="name">{applicant.name}</span>
                                            <span className="email">{applicant.email}</span>
                                        </div>
                                    </div>
                                    <div className="applicant-status">
                                        <span className={`status-pill ${applicant.status.toLowerCase().replace(' ', '-')}`}>
                                            {applicant.status}
                                        </span>
                                        <span className="date">{applicant.date}</span>
                                    </div>
                                    <div className="applicant-actions">
                                        <button className="icon-btn" title="View Resume"><FileText size={16} /></button>
                                        <button
                                            className="icon-btn"
                                            title="Schedule Interview"
                                            onClick={() => {
                                                const date = prompt("Enter interview date (YYYY-MM-DD):");
                                                if (date) {
                                                    applicant.status = 'Interview Scheduled';
                                                    applicant.date = date; // Update date to interview date
                                                    // Force re-render (in a real app, update state properly)
                                                    setJobs([...jobs]);
                                                }
                                            }}
                                        >
                                            <Calendar size={16} />
                                        </button>
                                        <button
                                            className="icon-btn success"
                                            title="Hire"
                                            onClick={() => {
                                                if (confirm(`Hire ${applicant.name}?`)) {
                                                    applicant.status = 'Hired';
                                                    setJobs([...jobs]);
                                                }
                                            }}
                                        >
                                            <CheckCircle size={16} />
                                        </button>
                                        <button
                                            className="icon-btn danger"
                                            title="Reject"
                                            onClick={() => {
                                                if (confirm(`Reject ${applicant.name}?`)) {
                                                    applicant.status = 'Rejected';
                                                    setJobs([...jobs]);
                                                }
                                            }}
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="job-form">
                        <div className="form-group">
                            <label>Job Title</label>
                            <input type="text" name="title" defaultValue={currentJob?.title} required />
                        </div>
                        <div className="form-group">
                            <label>Department</label>
                            <select name="department" defaultValue={currentJob?.department || 'Academics'}>
                                <option value="Academics">Academics</option>
                                <option value="IT">IT</option>
                                <option value="Health">Health</option>
                                <option value="Transport">Transport</option>
                                <option value="Administration">Administration</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Employment Type</label>
                            <select name="type" defaultValue={currentJob?.type || 'Full-time'}>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Temporary">Temporary</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Description (Rich Text)</label>
                            <div className="rich-text-toolbar">
                                <button type="button" className="toolbar-btn toolbar-bold">B</button>
                                <button type="button" className="toolbar-btn toolbar-italic">I</button>
                                <button type="button" className="toolbar-btn toolbar-underline">U</button>
                            </div>
                            <textarea name="description" rows="4" placeholder="Job description..." className="form-textarea"></textarea>
                        </div>
                        {modalMode === 'edit' && (
                            <div className="form-group">
                                <label>Status</label>
                                <select name="status" defaultValue={currentJob?.status}>
                                    <option value="Active">Active</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Draft">Draft</option>
                                </select>
                            </div>
                        )}
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Post Job</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default JobPosts;
