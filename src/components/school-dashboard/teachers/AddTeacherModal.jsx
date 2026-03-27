import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddTeacherModal = ({ isOpen, onClose, onSubmit, editingTeacher }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        employeeId: '',
        phone: '',
        address: '',
        joiningDate: new Date().toISOString().split('T')[0],
        qualification: '',
        experience: 0,
        subjects: [],
        designation: 'Teacher',
        employmentType: 'Full-time',
        status: 'Active',
        salary: 0
    });

    const [availableSubjects, setAvailableSubjects] = useState([
        'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'
    ]);

    useEffect(() => {
        if (editingTeacher) {
            const names = (editingTeacher.name || '').split(' ');
            setFormData({
                firstName: names[0] || '',
                lastName: names.slice(1).join(' ') || '',
                email: editingTeacher.email || '',
                employeeId: editingTeacher.employeeId || '',
                phone: editingTeacher.phone || '',
                address: editingTeacher.address || '',
                joiningDate: editingTeacher.joiningDate ? new Date(editingTeacher.joiningDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                qualification: editingTeacher.qualification || '',
                experience: editingTeacher.experience || 0,
                subjects: editingTeacher.subjects || [],
                designation: editingTeacher.designation || 'Teacher',
                employmentType: editingTeacher.employmentType || 'Full-time',
                status: editingTeacher.status || 'Active',
                salary: editingTeacher.salary || 0
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                employeeId: '',
                phone: '',
                address: '',
                joiningDate: new Date().toISOString().split('T')[0],
                qualification: '',
                experience: 0,
                subjects: [],
                designation: 'Teacher',
                employmentType: 'Full-time',
                status: 'Active',
                salary: 0
            });
        }
    }, [editingTeacher, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleSubjectChange = (e) => {
        const options = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, subjects: options });
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
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
                            <label>Employee ID</label>
                            <input
                                type="text"
                                value={formData.employeeId}
                                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                placeholder="e.g., EMP101"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g., +1 234 567 890"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Joining Date</label>
                            <input
                                type="date"
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
                                placeholder="Physical address"
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
                                min="0"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Salary (Monthly) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.salary}
                                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                placeholder="e.g. 50000"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Status *</label>
                            <select
                                required
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Suspended">Suspended</option>
                            </select>
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

                        <div className="simple-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Subjects * (Hold Ctrl/Cmd to select multiple)</label>
                            <select
                                multiple
                                required
                                value={formData.subjects}
                                onChange={handleSubjectChange}
                                style={{ height: '100px' }}
                            >
                                {availableSubjects.map((sub) => (
                                    <option key={sub} value={sub}>{sub}</option>
                                ))}
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
