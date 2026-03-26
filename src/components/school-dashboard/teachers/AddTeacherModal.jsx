import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddTeacherModal = ({ isOpen, onClose, onSubmit, editingTeacher }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        qualification: '',
        experience: 0,
        subjects: '',
        designation: 'Teacher',
        employmentType: 'Full-time',
    });

    useEffect(() => {
        if (editingTeacher) {
            const names = editingTeacher.name.split(' ');
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: editingTeacher.email || '',
                qualification: editingTeacher.qualification || '',
                experience: editingTeacher.experience || 0,
                subjects: Array.isArray(editingTeacher.subjects) ? editingTeacher.subjects.join(', ') : '',
                designation: editingTeacher.designation || 'Teacher',
                employmentType: editingTeacher.employmentType || 'Full-time',
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                qualification: '',
                experience: 0,
                subjects: '',
                designation: 'Teacher',
                employmentType: 'Full-time',
            });
        }
    }, [editingTeacher, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const subjectsArray = formData.subjects.split(',').map(s => s.trim()).filter(s => s);
        onSubmit({ ...formData, subjects: subjectsArray });
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h2>
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
                                placeholder="teacher@school.com"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Qualification *</label>
                            <input
                                type="text"
                                required
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                placeholder="e.g., M.Sc Mathematics"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Experience (Years) *</label>
                            <input
                                type="number"
                                required
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Subjects * (comma separated)</label>
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
                            </select>
                        </div>
                    </div>

                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="simple-btn-primary">
                            {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTeacherModal;
