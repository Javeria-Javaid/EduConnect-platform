import React, { useState } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddStudentModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        dob: '',
        gender: '',
        admissionNumber: '',
        parentName: '',
        parentPhone: '',
        parentEmail: '',
        class: '',
        section: '',
        rollNumber: '',
        feePackage: ''
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
                    <h2 className="simple-modal-title">Add New Student</h2>
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
                                placeholder="Enter student name"
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
                            <label>Admission Number *</label>
                            <input
                                type="text"
                                required
                                value={formData.admissionNumber}
                                onChange={(e) => setFormData({ ...formData, admissionNumber: e.target.value })}
                                placeholder="e.g., 2024-001"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Parent/Guardian Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.parentName}
                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                placeholder="Parent name"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Parent Phone *</label>
                            <input
                                type="tel"
                                required
                                value={formData.parentPhone}
                                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                placeholder="+92 300 1234567"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Parent Email</label>
                            <input
                                type="email"
                                value={formData.parentEmail}
                                onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                placeholder="parent@example.com"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Class *</label>
                            <select
                                required
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            >
                                <option value="">Select Class</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i} value={i + 1}>Class {i + 1}</option>
                                ))}
                            </select>
                        </div>

                        <div className="simple-form-group">
                            <label>Section *</label>
                            <select
                                required
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                            >
                                <option value="">Select Section</option>
                                {['A', 'B', 'C', 'D'].map(section => (
                                    <option key={section} value={section}>Section {section}</option>
                                ))}
                            </select>
                        </div>

                        <div className="simple-form-group">
                            <label>Roll Number</label>
                            <input
                                type="text"
                                value={formData.rollNumber}
                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                placeholder="Roll number"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Fee Package *</label>
                            <select
                                required
                                value={formData.feePackage}
                                onChange={(e) => setFormData({ ...formData, feePackage: e.target.value })}
                            >
                                <option value="">Select Package</option>
                                <option value="Standard">Standard - Rs. 15,000/month</option>
                                <option value="Premium">Premium - Rs. 25,000/month</option>
                            </select>
                        </div>
                    </div>

                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="simple-btn-primary">
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
