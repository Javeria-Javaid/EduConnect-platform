import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../shared/SimpleModal.css';

const AddClassModal = ({ isOpen, onClose, onSubmit, editingClass }) => {
    const [formData, setFormData] = useState({
        name: '',
        sections: '',
    });

    useEffect(() => {
        if (editingClass) {
            setFormData({
                name: editingClass.name || '',
                sections: editingClass.sections ? editingClass.sections.map(s => s.name).join(', ') : '',
            });
        } else {
            setFormData({
                name: '',
                sections: '',
            });
        }
    }, [editingClass, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const sectionNames = formData.sections.split(',').map(s => s.trim()).filter(s => s);
        const sectionsArray = sectionNames.map(name => ({
            name,
            capacity: 30
        }));
        
        // Let user preserve existing section assignments if editing, but for simplicity we merge or overwrite based on naming
        onSubmit({ name: formData.name, sections: sectionsArray });
    };

    if (!isOpen) return null;

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">{editingClass ? 'Edit Class' : 'Add New Class'}</h2>
                    <button className="simple-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="simple-modal-body">
                    <div className="simple-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                        <div className="simple-form-group">
                            <label>Class Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Grade 10"
                            />
                        </div>

                        <div className="simple-form-group">
                            <label>Sections (comma separated) *</label>
                            <input
                                type="text"
                                required
                                value={formData.sections}
                                onChange={(e) => setFormData({ ...formData, sections: e.target.value })}
                                placeholder="e.g., A, B, C"
                            />
                            <small style={{ color: '#64748b', marginTop: '4px', display: 'block' }}>Each section defaults to 30 capacity.</small>
                        </div>
                    </div>

                    <div className="simple-modal-footer">
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="simple-btn-primary">
                            {editingClass ? 'Update Class' : 'Add Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddClassModal;
