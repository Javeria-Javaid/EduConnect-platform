import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddExamModal = ({ isOpen, onClose, onSubmit, editingExam }) => {
    const [formData, setFormData] = useState({
        name: '',
        term: 'Term 1',
        startDate: '',
        endDate: '',
        classes: '',
        status: 'Scheduled'
    });

    useEffect(() => {
        if (editingExam) {
            setFormData({
                name: editingExam.name || '',
                term: editingExam.term || 'Term 1',
                startDate: editingExam.startDate ? editingExam.startDate.split('T')[0] : '',
                endDate: editingExam.endDate ? editingExam.endDate.split('T')[0] : '',
                classes: editingExam.classes ? editingExam.classes.join(', ') : '',
                status: editingExam.status || 'Scheduled'
            });
        } else {
            setFormData({
                name: '',
                term: 'Term 1',
                startDate: '',
                endDate: '',
                classes: '',
                status: 'Scheduled'
            });
        }
    }, [editingExam, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const classesArray = formData.classes.split(',').map(s => s.trim()).filter(s => s);
        onSubmit({ ...formData, classes: classesArray });
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">{editingExam ? 'Edit Exam' : 'Schedule New Exam'}</h2>
                    <button className="simple-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid">
                        <div className="simple-form-group">
                            <label>Exam Name *</label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Mid Term 2024" />
                        </div>
                        <div className="simple-form-group">
                            <label>Term *</label>
                            <select required value={formData.term} onChange={(e) => setFormData({ ...formData, term: e.target.value })}>
                                <option value="Term 1">Term 1</option>
                                <option value="Term 2">Term 2</option>
                                <option value="Final Term">Final Term</option>
                            </select>
                        </div>
                        <div className="simple-form-group">
                            <label>Start Date *</label>
                            <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                        </div>
                        <div className="simple-form-group">
                            <label>End Date *</label>
                            <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                        </div>
                        <div className="simple-form-group" style={{ gridColumn: '1 / -1' }}>
                            <label>Classes taking this exam (comma separated) *</label>
                            <input type="text" required value={formData.classes} onChange={(e) => setFormData({ ...formData, classes: e.target.value })} placeholder="e.g., Grade 9, Grade 10" />
                        </div>
                        <div className="simple-form-group">
                            <label>Status *</label>
                            <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                                <option value="Scheduled">Scheduled</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="simple-btn-primary">{editingExam ? 'Update Exam' : 'Schedule Exam'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default AddExamModal;
