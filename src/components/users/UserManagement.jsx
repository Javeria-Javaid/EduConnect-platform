import React, { useState, useEffect, useCallback } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, Phone, MapPin, Baby, Search, Filter, Save, X, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = new URL(`${import.meta.env.VITE_API_URL}/api/admin/users`);
      
      if (roleFilter !== 'all') url.searchParams.append('role', roleFilter);
      if (searchQuery) url.searchParams.append('search', searchQuery);

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      toast.error('Network error fetching users');
    } finally {
      setLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchUsers();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const columns = [
    {
      header: 'User Name',
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
      render: (item) => <span className={`role-badge ${item.role}`}>{item.role.replace('_', ' ')}</span>
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
          setUsers(prev => prev.filter(u => u._id !== user._id));
        } else {
          toast.error('Delete failed');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        role: formData.get('role'),
        phone: formData.get('phone'),
        address: formData.get('address'),
    };

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${currentUser._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(updatedData)
        });

        const data = await res.json();
        if (res.ok) {
            toast.success('User updated successfully');
            setUsers(prev => prev.map(u => u._id === currentUser._id ? data : u));
            setIsModalOpen(false);
        } else {
            toast.error(data.message || 'Update failed');
        }
    } catch (error) {
        toast.error('Network error occurred');
    }
  };

  return (
    <div className="user-management-page">
      <PageHeader
        title="User Directory"
        subtitle="Manage accounts across all roles (Parents, Teachers, Admins)."
        actionLabel="Add User"
        onAction={() => {
            setCurrentUser(null);
            setModalMode('add');
            setIsModalOpen(true);
        }}
        secondaryActionLabel="Refresh List"
        onSecondaryAction={fetchUsers}
        secondaryIcon={RefreshCcw}
      />

      {/* Real-time Filters */}
      <div className="users-toolbar">
        <div className="search-bar">
            <Search size={18} />
            <input 
                type="text" 
                placeholder="Search name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
        <div className="filter-group">
            <Filter size={18} />
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="parent">Parents</option>
                <option value="student">Students</option>
                <option value="teacher">Teachers</option>
                <option value="school_admin">School Admins</option>
                <option value="vendor">Vendors</option>
            </select>
        </div>
      </div>

      {loading && users.length === 0 ? (
          <div className="loading-state">Loading users...</div>
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
            searchPlaceholder="Filter current view..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'view' ? 'User Profile' : 'Edit User Profile'}
      >
        {currentUser && (
          modalMode === 'view' ? (
            <div className="user-details-view">
              <div className="profile-header">
                <div className="profile-avatar-large">
                  <User size={32} />
                </div>
                <div>
                  <h3>{currentUser.firstName} {currentUser.lastName}</h3>
                  <p className="email-hint">{currentUser.email}</p>
                </div>
              </div>
              <div className="detail-cards">
                <div className="detail-card">
                  <span className="label">Role</span>
                  <span className="value">{currentUser.role}</span>
                </div>
                <div className="detail-card">
                  <span className="label">Phone</span>
                  <span className="value">{currentUser.phone || 'N/A'}</span>
                </div>
                <div className="detail-card">
                  <span className="label">Joined</span>
                  <span className="value">{new Date(currentUser.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              {currentUser.address && (
                  <div className="address-section">
                      <MapPin size={16} />
                      <p>{currentUser.address}</p>
                  </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-user-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="firstName" defaultValue={currentUser.firstName} required />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="lastName" defaultValue={currentUser.lastName} required />
                </div>
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" defaultValue={currentUser.role}>
                  <option value="parent">Parent</option>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="school_admin">School Admin</option>
                  <option value="vendor">Vendor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input name="phone" defaultValue={currentUser.phone} placeholder="+1234567890" />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea name="address" defaultValue={currentUser.address} rows="2" />
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>
                   <X size={16} /> Cancel
                </button>
                <button type="submit" className="save-btn">
                   <Save size={16} /> Save Changes
                </button>
              </div>
            </form>
          )
        )}
      </Modal>
    </div>
  );
};

export default UserManagement;
