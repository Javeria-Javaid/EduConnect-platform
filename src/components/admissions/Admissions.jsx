import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { CheckCircle, XCircle, Clock, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import './Admissions.css';

const Admissions = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentApp, setCurrentApp] = useState(null);
    const [modalMode, setModalMode] = useState('view');

    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setApplications(data);
            }
        } catch (error) {
            toast.error('Error fetching admissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    const columns = [
        {
            header: 'Applicant',
            accessor: 'applicantName',
            render: (item) => (
                <div className="applicant-cell">
                    <div className="applicant-avatar">
                        <User size={16} />
                    </div>
                    <div>
                        <span className="applicant-name">{item.applicantName}</span>
                        <span className="applicant-grade">{item.grade}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Parent',
            accessor: 'parentName',
            render: (item) => <span className="text-gray-600">{item.parentName}</span>
        },
        {
            header: 'Date',
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
            render: (item) => {
                let statusClass = 'status-badge ';
                let Icon = Clock;
                switch (item.status) {
                    case 'Accepted': statusClass += 'active'; Icon = CheckCircle; break;
                    case 'Pending': statusClass += 'pending'; Icon = Clock; break;
                    case 'Rejected': statusClass += 'inactive'; Icon = XCircle; break;
                    case 'On Hold': statusClass += 'warning'; Icon = Clock; break;
                    default: statusClass += 'default';
                }
                return (
                    <span className={statusClass}>
                        <Icon size={12} /> {item.status}
                    </span>
                );
            }
        }
    ];

    const handleStatusChange = async (newStatus) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions/${currentApp._id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                toast.success(`Status updated to ${newStatus}`);
                fetchAdmissions();
                setIsModalOpen(false);
            }
        } catch (error) {
            toast.error('Update failed');
        }
    };

    const handleSaveApplication = async (e) => {
        e.preventDefault();
        const formData = {
            applicantName: e.target.applicant.value,
            grade: e.target.grade.value,
            parentName: e.target.parent.value,
            parentEmail: e.target.email.value,
            documents: ['Initial Submission']
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Application submitted');
                setIsModalOpen(false);
                fetchAdmissions();
            }
        } catch (error) {
            toast.error('Submission failed');
        }
    };

    return (
        <div className="admissions-page">
            <PageHeader
                title="Admissions"
                subtitle="Track student applications and enrollment."
                actionLabel="New Application"
                onAction={() => { setCurrentApp(null); setModalMode('add'); setIsModalOpen(true); }}
            />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={applications}
                    onView={(app) => { setCurrentApp(app); setModalMode('view'); setIsModalOpen(true); }}
                    searchPlaceholder="Search applicants..."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'New Student Application' : 'Application Details'}
            >
                {modalMode === 'view' && currentApp ? (
                    <div className="application-details">
                        <h3>{currentApp.applicantName}</h3>
                        <p><strong>Grade:</strong> {currentApp.grade}</p>
                        <p><strong>Parent:</strong> {currentApp.parentName} ({currentApp.parentEmail})</p>
                        <p><strong>Status:</strong> {currentApp.status}</p>
                        <div className="action-buttons">
                            <button className="action-btn accept" onClick={() => handleStatusChange('Accepted')}>Accept</button>
                            <button className="action-btn reject" onClick={() => handleStatusChange('Rejected')}>Reject</button>
                            <button className="action-btn hold" onClick={() => handleStatusChange('On Hold')}>Hold</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSaveApplication} className="admissions-form">
                        <div className="form-group"><label>Student Name</label><input type="text" name="applicant" required /></div>
                        <div className="form-group">
                            <label>Grade</label>
                            <select name="grade" required>
                                <option value="Kindergarten">Kindergarten</option>
                                <option value="Grade 1">Grade 1</option>
                                <option value="Grade 5">Grade 5</option>
                                <option value="Grade 10">Grade 10</option>
                            </select>
                        </div>
                        <div className="form-group"><label>Parent Name</label><input type="text" name="parent" required /></div>
                        <div className="form-group"><label>Parent Email</label><input type="email" name="email" required /></div>
                        <div className="form-actions">
                            <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">Submit</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default Admissions;
