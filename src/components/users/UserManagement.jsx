import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, Phone, MapPin, Baby } from 'lucide-react';
import { toast } from 'sonner';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?role=parent`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error('Failed to fetch parents');
      }
    } catch (error) {
      toast.error('Network error fetching parents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      header: 'Parent Name',
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
        header: 'Registered',
        accessor: 'createdAt',
        render: (item) => <span>{new Date(item.createdAt).toLocaleDateString()}</span>
    }
  ];

  const handleDelete = async (user) => {
    if (window.confirm(`Delete user ${user.email}?`)) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${user._id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          toast.success('User deleted');
          fetchUsers();
        } else {
          toast.error('Delete failed');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  return (
    <div className="user-management-page">
      <PageHeader
        title="Parents & Students"
        subtitle="Manage parent accounts and registrations."
        actionLabel="Refresh List"
        onAction={fetchUsers}
      />

      {loading ? (
          <div>Loading parents...</div>
      ) : (
        <DataTable
            columns={columns}
            data={users}
            onEdit={(user) => {
                setCurrentUser(user);
                setModalMode('edit');
                setIsModalOpen(true);
            }}
            onDelete={handleDelete}
            onView={(user) => {
                setCurrentUser(user);
                setModalMode('view');
                setIsModalOpen(true);
            }}
            searchPlaceholder="Search parents..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? 'User Profile' : 'Edit User'}
      >
        {currentUser && (
          <div className="user-details-view">
            <div className="profile-header">
              <div className="profile-avatar-large">
                <User size={32} />
              </div>
              <div>
                <h3>{currentUser.firstName} {currentUser.lastName}</h3>
                <p>{currentUser.email}</p>
              </div>
            </div>
            <div className="detail-section">
                <p><strong>Role:</strong> {currentUser.role}</p>
                <p><strong>Joined:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
