import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { Briefcase, Users, Calendar, CheckCircle, XCircle, FileText, User } from 'lucide-react';
import { toast } from 'sonner';
import './JobPosts.css';

const JobPosts = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view');
    const [currentJob, setCurrentJob] = useState(null);
    const [filters, setFilters] = useState([]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setJobs(data);
            } else {
                toast.error(data.message || 'Failed to fetch jobs');
            }
        } catch (error) {
            console.error('Fetch jobs error:', error);
            toast.error('Network error fetching jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplicants = async (jobId) => {
        try {
            setLoadingApplicants(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}/applicants`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setApplicants(data);
            } else {
                toast.error('Failed to fetch applicants');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoadingApplicants(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

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
            accessor: 'applicantsCount',
            render: (item) => (
                <div className="applicants-cell clickable" onClick={() => handleViewApplicants(item)}>
                    <Users size={14} className="text-blue-500" />
                    <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{item.applicantsCount || 0} Candidates</span>
                </div>
            )
        },
        {
            header: 'Posted Date',
            accessor: 'createdAt',
            render: (item) => (
                <div className="date-cell">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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

    const handleViewApplicants = (job) => {
        setCurrentJob(job);
        setModalMode('applicants');
        setIsModalOpen(true);
        fetchApplicants(job._id);
    };

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

    const handleDelete = async (job) => {
        if (window.confirm(`Delete ${job.title}?`)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${job._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    toast.success('Job deleted successfully');
                    fetchJobs();
                } else {
                    toast.error('Failed to delete job');
                }
            } catch (error) {
                toast.error('Network error deleting job');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            department: e.target.department.value,
            type: e.target.type.value,
            description: e.target.description.value,
            status: modalMode === 'edit' ? e.target.status.value : 'Active'
        };

        try {
            const url = modalMode === 'edit' 
                ? `${import.meta.env.VITE_API_URL}/api/jobs/${currentJob._id}`
                : `${import.meta.env.VITE_API_URL}/api/jobs`;
            
            const res = await fetch(url, {
                method: modalMode === 'edit' ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(modalMode === 'edit' ? 'Job updated' : 'Job posted');
                setIsModalOpen(false);
                fetchJobs();
            } else {
                toast.error(data.message || 'Failed to save job');
            }
        } catch (error) {
            toast.error('Network error saving job');
        }
    };

    return (
        <div className="job-posts-page">
            <PageHeader
                title="Job Posts"
                subtitle="Manage job openings, track applicants, and schedule interviews."
                actionLabel="Post New Job"
                onAction={handleAdd}
            />

            {loading ? (
                <div className="loading-state">Loading jobs...</div>
            ) : (
                <>
                    <div className="job-analytics">
                        <div className="analytics-card">
                            <h4 className="analytics-label">Total Active Jobs</h4>
                            <span className="analytics-value analytics-blue">{jobs?.filter(j => j.status === 'Active').length || 0}</span>
                        </div>
                        <div className="analytics-card">
                            <h4 className="analytics-label">Total Applicants</h4>
                            <span className="analytics-value analytics-green">{jobs?.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0) || 0}</span>
                        </div>
                    </div>

                    <DataTable
                        columns={columns}
                        data={jobs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onView={(job) => {
                            setCurrentJob(job);
                            setModalMode('view');
                            setIsModalOpen(true);
                        }}
                        searchPlaceholder="Search jobs..."
                        filters={filters}
                    />
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={
                    modalMode === 'add' ? 'Post New Job' : 
                    modalMode === 'edit' ? 'Edit Job Post' : 
                    modalMode === 'applicants' ? `Applicants for ${currentJob?.title}` : 
                    'Job Details'
                }
            >
                {modalMode === 'applicants' ? (
                    <div className="applicants-list-view">
                        {loadingApplicants ? (
                            <div className="p-4 text-center">Loading candidates...</div>
                        ) : applicants.length > 0 ? (
                            <div className="applicants-table-wrapper">
                                <table className="applicants-table">
                                    <thead>
                                        <tr>
                                            <th>Candidate</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applicants.map(app => (
                                            <tr key={app._id}>
                                                <td>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                            <User size={14} />
                                                        </div>
                                                        <span>{app.applicantName || (app.applicantRef ? `${app.applicantRef.firstName} ${app.applicantRef.lastName}` : 'Anonymous')}</span>
                                                    </div>
                                                </td>
                                                <td>{app.applicantEmail || app.applicantRef?.email}</td>
                                                <td>{app.applicantRef?.phone || 'N/A'}</td>
                                                <td>
                                                    <span className={`app-status-badge ${app.status}`}>
                                                        {app.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-applicants-msg">
                                <Users size={48} />
                                <p>No applications received yet for this position.</p>
                            </div>
                        )}
                    </div>
                ) : modalMode === 'view' && currentJob ? (
                    <div className="job-details-view">
                         <div className="job-header-info">
                            <h3>{currentJob.title}</h3>
                            <span className={`status-badge ${currentJob.status.toLowerCase()}`}>{currentJob.status}</span>
                         </div>
                         <div className="detail-meta">
                            <span><strong>Department:</strong> {currentJob.department}</span>
                            <span><strong>Type:</strong> {currentJob.type}</span>
                         </div>
                         <div className="description-box">
                            <h4>Description</h4>
                            <p>{currentJob.description || 'No description provided.'}</p>
                         </div>
                         <div className="stats-footer">
                            <Users size={16} /> <span>{currentJob.applicantsCount || 0} candidates have applied</span>
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
                            <label>Description</label>
                            <textarea name="description" rows="4" defaultValue={currentJob?.description} className="form-textarea"></textarea>
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
                            <button type="submit" className="save-btn">{modalMode === 'edit' ? 'Save Changes' : 'Post Job'}</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default JobPosts;
