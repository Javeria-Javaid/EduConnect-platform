import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddTeacherModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        teacherId: '',
        phone: '',
        email: '',
        subjects: '',
        designation: '',
        employmentType: 'Full-time',
        joiningDate: '',
        address: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
        setFormData({});
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">Add New Teacher</h2>
                    <button className="simple-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid">
                        <div className="simple-form-group">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter teacher name"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Date of Birth *</label>
                            <input
                                type="date"
                                required
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Gender *</label>
                            <select
                                required
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div className="simple-form-group">
                            <label>Teacher ID *</label>
                            <input
                                type="text"
                                required
                                value={formData.teacherId}
                                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                placeholder="e.g., TCH001"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Phone Number *</label>
                            <input
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+92 300 1234567"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="teacher@school.com"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Subjects *</label>
                            <input
                                type="text"
                                required
                                value={formData.subjects}
                                onChange={(e) => setFormData({ ...formData, subjects: e.target.value })}
                                placeholder="e.g., Mathematics, Physics"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Designation *</label>
                            <select
                                required
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                            >
                                <option value="">Select Designation</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Senior Teacher">Senior Teacher</option>
                                <option value="HOD">Head of Department</option>
                                <option value="Coordinator">Coordinator</option>
                            </select>
                        </div>

                        <div className="simple-form-group">
                            <label>Employment Type *</label>
                            <select
                                required
                                value={formData.employmentType}
                                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Visiting">Visiting</option>
                            </select>
                        </div>

                        <div className="simple-form-group">
                            <label>Joining Date *</label>
                            <input
                                type="date"
                                required
                                value={formData.joiningDate}
                                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                            />
                        </div>

                        <div className="simple-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Address</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Current address"
                            />
                        </div>
                    </div>

                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="simple-btn-primary">
                            Add Teacher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;
