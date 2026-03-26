import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import '../shared/SimpleModal.css';
import { toast } from 'sonner';

const ManageMarksModal = ({ isOpen, onClose, exam }) => {
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [subject, setSubject] = useState('');
    const [maxMarks, setMaxMarks] = useState(100);
    const [students, setStudents] = useState([]);
    const [marks, setMarks] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && exam) {
            fetchClasses();
        }
    }, [isOpen, exam]);

    const fetchClasses = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/classes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setClasses(data.filter(c => exam.classes.includes(c.name)));
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStudents = async () => {
        if (!selectedClass || !selectedSection || !subject) return toast.error('Please select class, section and enter subject name');
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/students?class=${selectedClass}&section=${selectedSection}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
                const initialMarks = {};
                data.forEach(s => { initialMarks[s._id] = ''; });
                setMarks(initialMarks);
            }
        } catch (error) {
            toast.error('Failed to load students');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (students.length === 0) return toast.info('No students to save marks for');
        
        const marksData = students.map(s => ({
            student: s._id,
            class: selectedClass,
            section: selectedSection,
            marks: [{ subject, obtained: Number(marks[s._id] || 0), total: Number(maxMarks) }]
        }));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${exam._id}/marks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ marksData })
            });

            if (res.ok) {
                toast.success('Marks saved successfully');
                onClose();
            } else {
                toast.error('Failed to save marks');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    if (!isOpen || !exam) return null;

    const currentClass = classes.find(c => c.name === selectedClass);

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" style={{ maxWidth: '800px', width: '90%' }} onClick={(e) => e.stopPropagation()}>
                <div className="simple-modal-header">
                    <h2 className="simple-modal-title">Manage Marks: {exam.name}</h2>
                    <button className="simple-modal-close" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="simple-modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <select className="simple-input" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setSelectedSection(''); setStudents([]); }}>
                            <option value="">Select Class</option>
                            {classes.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                        </select>
                        
                        <select className="simple-input" value={selectedSection} onChange={e => { setSelectedSection(e.target.value); setStudents([]); }} disabled={!selectedClass}>
                            <option value="">Select Section</option>
                            {currentClass?.sections.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </select>

                        <input className="simple-input" type="text" placeholder="Subject Name" value={subject} onChange={e => setSubject(e.target.value)} />
                        <input className="simple-input" type="number" placeholder="Max Marks" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} style={{ width: '100px' }} />
                        
                        <button className="simple-btn-primary" onClick={fetchStudents} disabled={loading}>
                            {loading ? 'Loading...' : 'Load Students'}
                        </button>
                    </div>

                    {students.length > 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                                    <th style={{ padding: '12px' }}>Roll No</th>
                                    <th style={{ padding: '12px' }}>Student Name</th>
                                    <th style={{ padding: '12px' }}>Marks Obtained</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map(s => (
                                    <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '12px' }}>{s.rollNumber || '-'}</td>
                                        <td style={{ padding: '12px', fontWeight: '500' }}>{s.firstName} {s.lastName}</td>
                                        <td style={{ padding: '12px' }}>
                                            <input 
                                                type="number" 
                                                max={maxMarks}
                                                min="0"
                                                className="simple-input" 
                                                style={{ width: '100px', padding: '6px' }}
                                                value={marks[s._id]}
                                                onChange={e => setMarks({...marks, [s._id]: e.target.value})}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="simple-modal-footer">
                    <button className="simple-btn-secondary" onClick={onClose}>Close</button>
                    {students.length > 0 && <button className="simple-btn-primary" onClick={handleSave}><Save size={18} /> Save Marks</button>}
                </div>
            </div>
        </div>
    );
};
export default ManageMarksModal;
