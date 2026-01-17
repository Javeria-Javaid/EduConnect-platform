import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { CheckCircle, XCircle, Clock, MapPin, Users, School } from 'lucide-react';
import './SchoolManagement.css';

// Mock Data
const MOCK_SCHOOLS = [
  { id: 1, name: 'Greenwood High', type: 'High School', students: 1200, staff: 85, status: 'Active', location: 'New York, NY', joined: '2023-01-15' },
  { id: 2, name: 'Sunnydale Elementary', type: 'Elementary', students: 450, staff: 30, status: 'Pending', location: 'Sunnydale, CA', joined: '2023-03-10' },
  { id: 3, name: 'Oakridge Academy', type: 'Private', students: 800, staff: 60, status: 'Active', location: 'Austin, TX', joined: '2022-11-05' },
  { id: 4, name: 'River Valley School', type: 'Middle School', students: 600, staff: 45, status: 'Inactive', location: 'Denver, CO', joined: '2023-02-20' },
  { id: 5, name: 'Tech Future Institute', type: 'Vocational', students: 300, staff: 25, status: 'Pending', location: 'San Francisco, CA', joined: '2023-04-01' },
];

const SchoolManagement = () => {
  const [schools, setSchools] = useState(MOCK_SCHOOLS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'

  // Columns Definition
  const columns = [
    {
      header: 'School Name',
      accessor: 'name',
      render: (item) => (
        <div className="school-name-cell">
          <div className="school-icon-bg">
            <School size={16} />
          </div>
          <div>
            <span className="school-name-text">{item.name}</span>
            <span className="school-type-text">{item.type}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Location',
      accessor: 'location',
      render: (item) => (
        <div className="location-cell">
          <MapPin size={14} className="text-gray-400" />
          <span>{item.location}</span>
        </div>
      )
    },
    {
      header: 'Stats',
      accessor: 'stats',
      render: (item) => (
        <div className="stats-cell">
          <span title="Students"><Users size={14} /> {item.students}</span>
          <span title="Staff" className="ml-2">Staff: {item.staff}</span>
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
          case 'Active':
            statusClass += 'active';
            Icon = CheckCircle;
            break;
          case 'Pending':
            statusClass += 'pending';
            Icon = Clock;
            break;
          case 'Inactive':
            statusClass += 'inactive';
            Icon = XCircle;
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

  // Filters
  const filters = [
    {
      key: 'status',
      label: 'All Statuses',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Pending', label: 'Pending' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'type',
      label: 'All Types',
      options: [
        { value: 'High School', label: 'High School' },
        { value: 'Elementary', label: 'Elementary' },
        { value: 'Private', label: 'Private' },
        { value: 'Vocational', label: 'Vocational' }
      ]
    }
  ];

  // Handlers
  const handleAdd = () => {
    setCurrentSchool(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (school) => {
    setCurrentSchool(school);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (school) => {
    setCurrentSchool(school);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (school) => {
    if (window.confirm(`Are you sure you want to delete ${school.name}?`)) {
      setSchools(schools.filter(s => s.id !== school.id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Mock save logic
    if (modalMode === 'add') {
      const newSchool = {
        id: schools.length + 1,
        name: e.target.name.value,
        type: e.target.type.value,
        location: e.target.location.value,
        status: 'Pending',
        students: 0,
        staff: 0,
        joined: new Date().toISOString().split('T')[0]
      };
      setSchools([...schools, newSchool]);
    } else if (modalMode === 'edit') {
      setSchools(schools.map(s => s.id === currentSchool.id ? {
        ...s,
        name: e.target.name.value,
        type: e.target.type.value,
        location: e.target.location.value,
        status: e.target.status.value
      } : s));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="school-management-page">
      <PageHeader
        title="School Management"
        subtitle="Manage registered schools, approvals, and performance."
        actionLabel="Add New School"
        onAction={handleAdd}
      />

      <DataTable
        columns={columns}
        data={schools}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search schools..."
        filters={filters}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add New School' : modalMode === 'edit' ? 'Edit School' : 'School Details'}
      >
        {modalMode === 'view' && currentSchool ? (
          <div className="school-details-view">
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{currentSchool.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Type:</span>
              <span className="value">{currentSchool.type}</span>
            </div>
            <div className="detail-row">
              <span className="label">Location:</span>
              <span className="value">{currentSchool.location}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className={`status-badge ${currentSchool.status.toLowerCase()}`}>{currentSchool.status}</span>
            </div>
            <div className="detail-row">
              <span className="label">Students:</span>
              <span className="value">{currentSchool.students}</span>
            </div>
            <div className="detail-row">
              <span className="label">Staff:</span>
              <span className="value">{currentSchool.staff}</span>
            </div>
            <div className="detail-row">
              <span className="label">Joined:</span>
              <span className="value">{currentSchool.joined}</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="school-form">
            <div className="form-group">
              <label>School Name</label>
              <input type="text" name="name" defaultValue={currentSchool?.name} required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" defaultValue={currentSchool?.type || 'High School'}>
                <option value="High School">High School</option>
                <option value="Elementary">Elementary</option>
                <option value="Middle School">Middle School</option>
                <option value="Private">Private</option>
                <option value="Vocational">Vocational</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input type="text" name="location" defaultValue={currentSchool?.location} required />
            </div>
            {modalMode === 'edit' && (
              <div className="form-group">
                <label>Status</label>
                <select name="status" defaultValue={currentSchool?.status}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}
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

export default SchoolManagement;
