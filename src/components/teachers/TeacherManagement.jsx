import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, Mail, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import './TeacherManagement.css';

const TeacherManagement = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);

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

    return (
        <div className="teacher-management-page">
            <PageHeader
                title="Educators"
                subtitle="Manage and verify teacher accounts."
                actionLabel="Refresh"
                onAction={fetchTeachers}
            />

            {loading ? (
                <div>Loading educators...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={teachers}
                    onDelete={handleDelete}
                    onView={(teacher) => {
                        setCurrentTeacher(teacher);
                        setIsModalOpen(true);
                    }}
                    searchPlaceholder="Search teachers..."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Teacher Profile"
            >
                {currentTeacher && (
                    <div className="user-details-view">
                        <h3>{currentTeacher.firstName} {currentTeacher.lastName}</h3>
                        <p>{currentTeacher.email}</p>
                        <p><strong>Status:</strong> Verified</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TeacherManagement;
