import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, BookOpen, Clock, Activity, Briefcase, Award, MapPin, Users, Calendar, Hash } from 'lucide-react';
import '../shared/SimpleModal.css';

const ViewTeacherModal = ({ isOpen, onClose, teacher, onEdit }) => {
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        if (isOpen && teacher?._id) {
            fetchStudents();
        } else {
            setStudents([]);
        }
    }, [isOpen, teacher?._id]);

    const fetchStudents = async () => {
        setLoadingStudents(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/teachers/${teacher._id}/students`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoadingStudents(false);
        }
    };

    if (!isOpen || !teacher) return null;

    const getStatusColor = (status) => {
        if (status === 'Active') return '#10b981';
        if (status === 'On Leave') return '#f59e0b';
        return '#ef4444'; // Inactive, Suspended
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderAvatar = () => {
        if (teacher.photo) {
            return (
                <img 
                    src={teacher.photo} 
                    alt={teacher.name} 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                />
            );
        }
        const initial = teacher.name?.charAt(0) || '?';
        return (
            <div style={{ 
                width: '80px', height: '80px', borderRadius: '50%', background: '#66a1be', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold',
                border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' 
            }}>
                {initial}
            </div>
        );
    };

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', width: '95%' }}>
                <div className="simple-modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <h2 className="simple-modal-title">Teacher Profile</h2>
                    <button className="simple-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="simple-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Header Profile Section */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        {renderAvatar()}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b' }}>{teacher.name}</h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '20px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: '600',
                                        background: `${getStatusColor(teacher.status)}20`,
                                        color: getStatusColor(teacher.status)
                                    }}>
                                        {teacher.status}
                                    </span>
                                    {teacher.employeeId && (
                                        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', background: '#e2e8f0', color: '#475569' }}>
                                            ID: {teacher.employeeId}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>{teacher.designation} • {teacher.employmentType}</p>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{teacher.qualification}</p>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '4px' }}>
                        
                        {/* Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '16px' }}>
                            {/* Contact Info */}
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact & Personal</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <Mail size={16} color="#94a3b8" /> <span>{teacher.email}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <Phone size={16} color="#94a3b8" /> <span>{teacher.phone || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <MapPin size={16} color="#94a3b8" style={{ marginTop: '2px' }} /> <span>{teacher.address || 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <Calendar size={16} color="#94a3b8" /> <span>Joined: {formatDate(teacher.joiningDate)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Info */}
                            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Professional</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <Briefcase size={16} color="#94a3b8" /> <span>{teacher.experience} Years Exp.</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'start', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <BookOpen size={16} color="#94a3b8" style={{ marginTop: '2px' }} /> 
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                            {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 
                                                ? teacher.subjects.map(s => <span key={s} style={{ background: '#f1f5f9', padding: '1px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{s}</span>)
                                                : <span style={{ color: '#94a3b8' }}>No Subjects</span>}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <Clock size={16} color="#94a3b8" /> <span>{teacher.weeklyLoad} hrs/week</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#334155', fontSize: '0.9rem' }}>
                                        <Hash size={16} color="#94a3b8" /> <span>{teacher.salary ? `$ ${teacher.salary.toLocaleString()}` : 'Not Set'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Performance Metrics */}
                            <div style={{ gridColumn: '1 / -1', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance & Attendance</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '24px' }}>
                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Attendance</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{teacher.attendance}%</span>
                                        </div>
                                        {teacher.attendance !== 'N/A' ? (
                                            <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ 
                                                    height: '100%', 
                                                    width: `${teacher.attendance}%`, 
                                                    background: teacher.attendance >= 75 ? '#10b981' : teacher.attendance >= 50 ? '#f59e0b' : '#ef4444' 
                                                }} />
                                            </div>
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No Data</span>
                                        )}
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Performance</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{teacher.performance > 0 ? `${teacher.performance} / 5` : 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {teacher.performance > 0 ? (
                                                [...Array(5)].map((_, i) => (
                                                    <Award key={i} size={18} fill={i < teacher.performance ? '#f59e0b' : 'none'} color={i < teacher.performance ? '#f59e0b' : '#cbd5e1'} />
                                                ))
                                            ) : (
                                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No ratings yet</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Class Assignments */}
                            <div style={{ gridColumn: '1 / -1', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class Assignments</h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {Array.isArray(teacher.classesAssigned) && teacher.classesAssigned.length > 0 ? (
                                        teacher.classesAssigned.map(cls => (
                                            <div key={cls} style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '500' }}>
                                                {cls}
                                            </div>
                                        ))
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Not assigned to any classes</span>
                                    )}
                                </div>
                            </div>

                            {/* Real Students in My Class */}
                            <div style={{ gridColumn: '1 / -1', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        <Users size={16} style={{ marginBottom: '-3px', marginRight: '6px' }} /> Students in Assigned Classes
                                    </h4>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{students.length} Students Total</span>
                                </div>
                                
                                {loadingStudents ? (
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                        <div className="spinner-small" style={{ width: '20px', height: '20px', border: '2px solid #e2e8f0', borderTop: '2px solid #66a1be', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                    </div>
                                ) : students.length > 0 ? (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px' }}>
                                        {students.map(student => (
                                            <div key={student._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', border: '1px solid #f1f5f9', borderRadius: '8px', background: '#f8fafc' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#66a1be20', color: '#66a1be', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {student.photo ? <img src={student.photo} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : student.name.charAt(0)}
                                                </div>
                                                <div style={{ minWidth: 0 }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{student.name}</div>
                                                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>{student.className} • {student.sectionName}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', border: '1px dashed #e2e8f0', borderRadius: '8px' }}>
                                        No students found in assigned classes
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="simple-modal-footer">
                    <button type="button" className="simple-btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button type="button" className="simple-btn-primary" onClick={() => { onClose(); onEdit(teacher); }}>
                        Edit Details
                    </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            ` }} />
        </div>
    );
};

export default ViewTeacherModal;
