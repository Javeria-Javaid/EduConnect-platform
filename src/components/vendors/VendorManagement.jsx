import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { Truck, BookOpen, Monitor, Shirt, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import './VendorManagement.css';

// Mock Data
const MOCK_VENDORS = [
  { id: 1, name: 'EduBooks Ltd', category: 'Books', contact: 'john@edubooks.com', rating: 4.8, status: 'Active', contractEnd: '2024-12-31' },
  { id: 2, name: 'Uniforms Pro', category: 'Uniforms', contact: 'sarah@uniformspro.com', rating: 4.2, status: 'Active', contractEnd: '2024-06-30' },
  { id: 3, name: 'TechSolutions', category: 'IT', contact: 'support@techsol.com', rating: 4.9, status: 'Active', contractEnd: '2025-01-15' },
  { id: 4, name: 'SafeRide Transport', category: 'Transport', contact: 'mike@saferide.com', rating: 3.5, status: 'Under Review', contractEnd: '2023-12-01' },
  { id: 5, name: 'GreenCanteen', category: 'Food', contact: 'info@greencanteen.com', rating: 4.5, status: 'Active', contractEnd: '2024-08-20' },
];

const VendorManagement = () => {
  const [vendors, setVendors] = useState(MOCK_VENDORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Books': return <BookOpen size={16} />;
      case 'IT': return <Monitor size={16} />;
      case 'Uniforms': return <Shirt size={16} />;
      case 'Transport': return <Truck size={16} />;
      default: return <Star size={16} />;
    }
  };

  const columns = [
    {
      header: 'Vendor Name',
      accessor: 'name',
      render: (item) => (
        <div className="vendor-name-cell">
          <div className={`vendor-icon-bg ${item.category.toLowerCase()}`}>
            {getCategoryIcon(item.category)}
          </div>
          <div>
            <span className="vendor-name-text">{item.name}</span>
            <span className="vendor-category-text">{item.category}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Contact',
      accessor: 'contact',
      render: (item) => <span className="text-gray-600">{item.contact}</span>
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (item) => (
        <div className="rating-cell">
          <Star size={14} className="text-yellow-400 fill-current" />
          <span>{item.rating}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (item) => (
        <span className={`status-badge ${item.status === 'Active' ? 'active' : 'warning'}`}>
          {item.status === 'Active' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
          {item.status}
        </span>
      )
    }
  ];

  const filters = [
    {
      key: 'category',
      label: 'All Categories',
      options: [
        { value: 'Books', label: 'Books' },
        { value: 'Uniforms', label: 'Uniforms' },
        { value: 'IT', label: 'IT' },
        { value: 'Transport', label: 'Transport' },
        { value: 'Food', label: 'Food' }
      ]
    }
  ];

  const handleAdd = () => {
    setCurrentVendor(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEdit = (vendor) => {
    setCurrentVendor(vendor);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (vendor) => {
    setCurrentVendor(vendor);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (vendor) => {
    if (window.confirm(`Delete ${vendor.name}?`)) {
      setVendors(vendors.filter(v => v.id !== vendor.id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const newVendor = {
        id: vendors.length + 1,
        name: e.target.name.value,
        category: e.target.category.value,
        contact: e.target.contact.value,
        rating: 0,
        status: 'Active',
        contractEnd: e.target.contractEnd.value
      };
      setVendors([...vendors, newVendor]);
    } else if (modalMode === 'edit') {
      setVendors(vendors.map(v => v.id === currentVendor.id ? {
        ...v,
        name: e.target.name.value,
        category: e.target.category.value,
        contact: e.target.contact.value,
        contractEnd: e.target.contractEnd.value
      } : v));
    }
    setIsModalOpen(false);
  };

  return (
    <div className="vendor-management-page">
      <PageHeader
        title="Vendor Management"
        subtitle="Track vendor performance, contracts, and services."
        actionLabel="Add Vendor"
        onAction={handleAdd}
      />

      <DataTable
        columns={columns}
        data={vendors}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search vendors..."
        filters={filters}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add Vendor' : modalMode === 'edit' ? 'Edit Vendor' : 'Vendor Profile'}
      >
        {modalMode === 'view' && currentVendor ? (
          <div className="vendor-details-view">
            <div className="detail-row">
              <span className="label">Name:</span>
              <span className="value">{currentVendor.name}</span>
            </div>
            <div className="detail-row">
              <span className="label">Category:</span>
              <span className="value">{currentVendor.category}</span>
            </div>
            <div className="detail-row">
              <span className="label">Contact:</span>
              <span className="value">{currentVendor.contact}</span>
            </div>
            <div className="detail-row">
              <span className="label">Rating:</span>
              <span className="value flex items-center gap-1">
                {currentVendor.rating} <Star size={12} className="text-yellow-500 fill-current" />
              </span>
            </div>
            <div className="detail-row">
              <span className="label">Contract Ends:</span>
              <span className="value">{currentVendor.contractEnd}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status:</span>
              <span className={`status-badge ${currentVendor.status === 'Active' ? 'active' : 'warning'}`}>
                {currentVendor.status}
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="vendor-form">
            <div className="form-group">
              <label>Vendor Name</label>
              <input type="text" name="name" defaultValue={currentVendor?.name} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" defaultValue={currentVendor?.category || 'Books'}>
                <option value="Books">Books</option>
                <option value="Uniforms">Uniforms</option>
                <option value="IT">IT</option>
                <option value="Transport">Transport</option>
                <option value="Food">Food</option>
              </select>
            </div>
            <div className="form-group">
              <label>Contact Email</label>
              <input type="email" name="contact" defaultValue={currentVendor?.contact} required />
            </div>
            <div className="form-group">
              <label>Contract End Date</label>
              <input type="date" name="contractEnd" defaultValue={currentVendor?.contractEnd} required />
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

export default VendorManagement;
