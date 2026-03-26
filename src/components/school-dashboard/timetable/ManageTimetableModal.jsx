import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import '../shared/SimpleModal.css';
import { toast } from 'sonner';

const ManageTimetableModal = ({ isOpen, onClose, onSave, editingTimetable }) => {
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    
    const [formData, setFormData] = useState({
        class: '',
        section: '',
        day: 'Monday',
        periods: []
    });

    useEffect(() => {
        if (isOpen) {
            fetchClasses();
            fetchTeachers();
            if (editingTimetable) {
                setFormData({
                    class: editingTimetable.class,
                    section: editingTimetable.section,
                    day: editingTimetable.day,
                    periods: editingTimetable.periods || []
                });
            } else {
                setFormData({
                    class: '', section: '', day: 'Monday',
                    periods: [{ subject: '', teacher: '', startTime: '08:00', endTime: '09:00', room: '' }]
                });
            }
        }
    }, [isOpen, editingTimetable]);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setClasses(await res.json());
        } catch (error) { console.error(error); }
    };

    const fetchTeachers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?role=teacher`, { headers: { 'Authorization': `Bearer ${token}` } });
            if (res.ok) setTeachers(await res.json());
        } catch (error) { console.error(error); }
    };

    const handleAddPeriod = () => {
        setFormData({
            ...formData, 
            periods: [...formData.periods, { subject: '', teacher: '', startTime: '', endTime: '', room: '' }]
        });
    };

    const handleRemovePeriod = (index) => {
        const newPeriods = [...formData.periods];
        newPeriods.splice(index, 1);
        setFormData({ ...formData, periods: newPeriods });
    };

    const handleChangePeriod = (index, field, value) => {
        const newPeriods = [...formData.periods];
        newPeriods[index][field] = value;
        setFormData({ ...formData, periods: newPeriods });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.class || !formData.section || !formData.day) return toast.error('Class, Section, and Day are required');
        
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/timetables`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                toast.success('Timetable saved successfully');
                onSave();
            } else {
                toast.error('Failed to save timetable');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    if (!isOpen) return null;

    const currentClass = classes.find(c => c.name === formData.class);

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" style={{ maxWidth: '800px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">{editingTimetable ? 'Edit Timetable' : 'Create Timetable'}</h2>
                    <button className="simple-modal-close" onClick={onClose}><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="simple-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                        <select required className="simple-input" value={formData.class} onChange={e => setFormData({ ...formData, class: e.target.value, section: '' })}>
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                        
                        <select required className="simple-input" value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })} disabled={!formData.class}>
                            <option value="">Select Section</option>
                            {currentClass?.sections.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>

                        <select required className="simple-input" value={formData.day} onChange={e => setFormData({ ...formData, day: e.target.value })}>
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px', fontWeight: 'bold' }}>Periods</div>
                    
                    {formData.periods.map((p, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                            <input required className="simple-input" placeholder="Subject" value={p.subject} onChange={e => handleChangePeriod(index, 'subject', e.target.value)} />
                            <select className="simple-input" value={p.teacher} onChange={e => handleChangePeriod(index, 'teacher', e.target.value)}>
                                <option value="">Select Teacher</option>
                                {teachers.map(t => <option key={t._id} value={t._id}>{t.firstName} {t.lastName}</option>)}
                            </select>
                            <input required type="time" className="simple-input" style={{ width: '120px' }} value={p.startTime} onChange={e => handleChangePeriod(index, 'startTime', e.target.value)} />
                            <input required type="time" className="simple-input" style={{ width: '120px' }} value={p.endTime} onChange={e => handleChangePeriod(index, 'endTime', e.target.value)} />
                            <input className="simple-input" placeholder="Room" style={{ width: '100px' }} value={p.room} onChange={e => handleChangePeriod(index, 'room', e.target.value)} />
                            <button type="button" onClick={() => handleRemovePeriod(index)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={20} /></button>
                        </div>
                    ))}
                    
                    <button type="button" onClick={handleAddPeriod} style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }}>
                        <Plus size={18} /> Add Period
                    </button>

                    <div className="simple-modal-footer" style={{ marginTop: '20px' }}>
                        <button type="button" className="simple-btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="simple-btn-primary">Save Timetable</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default ManageTimetableModal;
