import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { User, Phone, Mail, MapPin, Baby, FileText, MessageSquare } from 'lucide-react';
import './UserManagement.css';

// Mock Data
const MOCK_PARENTS = [
  { id: 1, name: 'John Doe', children: ['Alice Doe (Grade 5)', 'Bob Doe (Grade 2)'], contact: 'john.doe@example.com', phone: '+1 555-0101', status: 'Active', location: 'New York, NY' },
  { id: 2, name: 'Jane Smith', children: ['Charlie Smith (Grade 8)'], contact: 'jane.smith@example.com', phone: '+1 555-0102', status: 'Active', location: 'Brooklyn, NY' },
  { id: 3, name: 'Robert Brown', children: ['David Brown (Grade 10)', 'Eva Brown (Grade 12)'], contact: 'robert.b@example.com', phone: '+1 555-0103', status: 'Inactive', location: 'Queens, NY' },
  { id: 4, name: 'Emily Davis', children: ['Frank Davis (Kindergarten)'], contact: 'emily.d@example.com', phone: '+1 555-0104', status: 'Active', location: 'Manhattan, NY' },
  { id: 5, name: 'Michael Wilson', children: ['Grace Wilson (Grade 3)'], contact: 'michael.w@example.com', phone: '+1 555-0105', status: 'Pending', location: 'Bronx, NY' },
];

const UserManagement = () => {
  const [parents, setParents] = useState(MOCK_PARENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentParent, setCurrentParent] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const columns = [
    {
      header: 'Parent Name',
      accessor: 'name',
      render: (item) => (
        <div className="user-name-cell">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <div>
            <span className="user-name-text">{item.name}</span>
            <span className="user-email-text">{item.contact}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Children',
      accessor: 'children',
      render: (item) => (
        <div className="children-list">
          {item.children.map((child, idx) => (
            <span key={idx} className="child-tag">
              <Baby size={12} /> {child}
            </span>
          ))}
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: 'phone',
      render: (item) => (
        <div className="contact-cell">
          <Phone size={14} className="text-gray-400" />
          <span>{item.phone}</span>
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
        { value: 'Pending', label: 'Pending' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    }
  ];

  const handleAdd = () => {
    setCurrentParent(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (parent) => {
    setCurrentParent(parent);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (parent) => {
    setCurrentParent(parent);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (parent) => {
    if (window.confirm(`Delete ${parent.name}?`)) {
      setParents(parents.filter(p => p.id !== parent.id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newParent = {
        id: parents.length + 1,
        name: e.target.name.value,
        contact: e.target.email.value,
        phone: e.target.phone.value,
        location: e.target.location.value,
        children: e.target.children.value.split(',').map(s => s.trim()),
        status: 'Active'
      };
      setParents([...parents, newParent]);
    } else if (modalMode === 'edit') {
      setParents(parents.map(p => p.id === currentParent.id ? {
        ...p,
        name: e.target.name.value,
        contact: e.target.email.value,
        phone: e.target.phone.value,
        location: e.target.location.value,
        children: e.target.children.value.split(',').map(s => s.trim())
      } : p));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="user-management-page">
      <PageHeader
        title="Parents & Students"
        subtitle="Manage parent accounts, student associations, and communications."
        actionLabel="Add Parent"
        onAction={handleAdd}
      />

      <DataTable
        columns={columns}
        data={parents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search parents..."
        filters={filters}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add Parent' : modalMode === 'edit' ? 'Edit Parent' : 'Parent Profile'}
      >
        {modalMode === 'view' && currentParent ? (
          <div className="user-details-view">
            <div className="profile-header">
              <div className="profile-avatar-large">
                <User size={32} />
              </div>
              <div>
                <h3>{currentParent.name}</h3>
                <p>{currentParent.contact}</p>
              </div>
            </div>

            <div className="detail-section">
              <h4>Contact Information</h4>
              <div className="detail-row">
                <span className="label"><Phone size={14} /> Phone:</span>
                <span className="value">{currentParent.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label"><MapPin size={14} /> Location:</span>
                <span className="value">{currentParent.location}</span>
              </div>
            </div>

            <div className="detail-section">
              <h4>Children</h4>
              <div className="children-list-view">
                {currentParent.children.map((child, idx) => (
                  <div key={idx} className="child-card">
                    <Baby size={16} />
                    <span>{child}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h4>Recent Activity</h4>
              <div className="activity-timeline">
                <div className="activity-item">
                  <FileText size={14} />
                  <span>Paid tuition fees for Alice Doe</span>
                  <span className="time">2 days ago</span>
                </div>
                <div className="activity-item">
                  <MessageSquare size={14} />
                  <span>Opened support ticket #1234</span>
                  <span className="time">1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="user-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" defaultValue={currentParent?.name} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" defaultValue={currentParent?.contact} required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" name="phone" defaultValue={currentParent?.phone} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" defaultValue={currentParent?.location} required />
            </div>
            <div className="form-group">
              <label>Children (comma separated)</label>
              <input type="text" name="children" defaultValue={currentParent?.children.join(', ')} placeholder="e.g. Alice (Grade 5), Bob (Grade 2)" required />
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

export default UserManagement;
