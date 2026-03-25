import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddStudentModal = ({ isOpen, onClose, onSubmit, editingStudent }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        admissionNumber: '',
        parentName: '',
        parentPhone: '',
        class: '',
        section: '',
        rollNumber: '',
    });

    useEffect(() => {
        if (editingStudent) {
            const names = editingStudent.name.split(' ');
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: editingStudent.email || '',
                gender: editingStudent.gender || '',
                admissionNumber: editingStudent.admissionNumber || '',
                parentName: editingStudent.parentName || '',
                parentPhone: editingStudent.parentPhone || '',
                class: editingStudent.class || '',
                section: editingStudent.section || '',
                rollNumber: editingStudent.rollNumber || '',
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                gender: '',
                admissionNumber: '',
                parentName: '',
                parentPhone: '',
                class: '',
                section: '',
                rollNumber: '',
            });
        }
    }, [editingStudent, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                    <button className="simple-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid">
                        <div className="simple-form-group">
                            <label>First Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                placeholder="First name"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Last Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                placeholder="Last name"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Email *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="student@example.com"
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
                                <option value="Other">Other</option>
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
                            <label>Class *</label>
                            <select
                                required
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            >
                                <option value="">Select Class</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i} value={i + 1}>{i + 1}</option>
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
                                    <option key={section} value={section}>{section}</option>
                                ))}
                            </select>
                        </div>

                        <div className="simple-form-group">
                            <label>Roll Number *</label>
                            <input
                                type="text"
                                required
                                value={formData.rollNumber}
                                onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                                placeholder="Roll number"
                            />
                        </div>
                    </div>

                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="simple-btn-primary">
                            {editingStudent ? 'Update Student' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
