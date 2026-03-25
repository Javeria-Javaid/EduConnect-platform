import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, Mail, GraduationCap, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import './TeacherManagement.css';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [modalMode, setModalMode] = useState('view');

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?role=teacher`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) {
                setTeachers(data);
            } else {
                toast.error('Failed to fetch teachers');
            }
        } catch (error) {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const columns = [
        {
            header: 'Teacher',
            accessor: 'firstName',
            render: (item) => (
                <div className="user-name-cell">
                    <div className="user-avatar">
                        <User size={16} />
                    </div>
                    <div>
                        <span className="user-name-text">{item.firstName} {item.lastName}</span>
                        <span className="user-email-text">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (item) => <span className="child-tag">{item.role}</span>
        },
        {
            header: 'Joined',
            accessor: 'createdAt',
            render: (item) => <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        }
    ];

    const handleDelete = async (user) => {
        if (window.confirm(`Delete teacher ${user.email}?`)) {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user._id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (res.ok) {
                    toast.success('Teacher removed');
                    fetchTeachers();
                }
            } catch (error) {
                toast.error('Network error');
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        data.role = 'teacher';

        try {
            const url = modalMode === 'edit'
                ? `${import.meta.env.VITE_API_URL}/api/admin/users/${currentTeacher._id}`
                : `${import.meta.env.VITE_API_URL}/api/admin/users`;
            
            const res = await fetch(url, {
                method: modalMode === 'edit' ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            });

            if (res.ok) {
                toast.success(modalMode === 'edit' ? 'Teacher updated' : 'Teacher added');
                setIsModalOpen(false);
                fetchTeachers();
            } else {
                toast.error('Failed to save teacher');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    return (
        <div className="teacher-management-page">
            <PageHeader
                title="Educators"
                subtitle="Manage and verify teacher accounts."
                actionLabel="Add Teacher"
                onAction={() => {
                    setCurrentTeacher(null);
                    setModalMode('add');
                    setIsModalOpen(true);
                }}
                secondaryActionLabel="Refresh"
                onSecondaryAction={fetchTeachers}
                secondaryIcon={RefreshCcw}
            />

            {loading ? (
                <div>Loading educators...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={teachers}
                    onEdit={(teacher) => {
                        setCurrentTeacher(teacher);
                        setModalMode('edit');
                        setIsModalOpen(true);
                    }}
                    onDelete={handleDelete}
                    onView={(teacher) => {
                        setCurrentTeacher(teacher);
                        setModalMode('view');
                        setIsModalOpen(true);
                    }}
                    searchPlaceholder="Search teachers..."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={modalMode === 'add' ? 'Add Teacher' : modalMode === 'edit' ? 'Edit Teacher' : 'Teacher Profile'}
            >
                {modalMode === 'view' && currentTeacher ? (
                    <div className="user-details-view">
                        <h3>{currentTeacher.firstName} {currentTeacher.lastName}</h3>
                        <p>{currentTeacher.email}</p>
                        <p><strong>Status:</strong> Verified</p>
                    </div>
                ) : (
                    <form onSubmit={handleSave} className="teacher-form">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" name="firstName" defaultValue={currentTeacher?.firstName} required />
                        </div>
                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" name="lastName" defaultValue={currentTeacher?.lastName} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" defaultValue={currentTeacher?.email} required />
                        </div>
                        {modalMode === 'add' && (
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" required />
                            </div>
                        )}
                        <div className="form-actions">
                            <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                            <button type="submit" className="save-btn">{modalMode === 'edit' ? 'Save Changes' : 'Add Teacher'}</button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
};

export default TeacherManagement;
