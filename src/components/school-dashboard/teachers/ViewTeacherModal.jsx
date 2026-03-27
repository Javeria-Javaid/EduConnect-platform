import React from 'react';
import { X, Mail, Phone, BookOpen, Clock, Activity, Briefcase, Award } from 'lucide-react';
import '../shared/SimpleModal.css';

const ViewTeacherModal = ({ isOpen, onClose, teacher, onEdit }) => {
    if (!isOpen || !teacher) return null;

    const getStatusColor = (status) => {
        if (status === 'Active') return '#10b981';
        if (status === 'On Leave') return '#f59e0b';
        return '#ef4444'; // Inactive, Suspended
    };

    return (
        <div className="simple-modal-overlay" onClick={onClose}>
            <div className="simple-modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="simple-modal-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <h2 className="simple-modal-title">Teacher Profile</h2>
                    <button className="simple-modal-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="simple-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Header Profile Section */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', background: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
                        <img 
                            src={teacher.photo || 'https://via.placeholder.com/100'} 
                            alt={teacher.name} 
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#1e293b' }}>{teacher.name}</h3>
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
                            </div>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>{teacher.designation} • {teacher.employmentType}</p>
                            <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>{teacher.qualification}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {/* Contact Info */}
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Contact & Info</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                    <Mail size={16} color="#94a3b8" /> {teacher.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                    <Briefcase size={16} color="#94a3b8" /> {teacher.experience} Years Experience
                                </div>
                            </div>
                        </div>

                        {/* Academics */}
                        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Academics</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'start', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                    <BookOpen size={16} color="#94a3b8" style={{ marginTop: '2px' }} /> 
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                        {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 
                                            ? teacher.subjects.map(s => <span key={s} style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem' }}>{s}</span>)
                                            : <span style={{ color: '#94a3b8' }}>No Subjects</span>}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', fontSize: '0.9rem' }}>
                                    <Clock size={16} color="#94a3b8" /> {teacher.weeklyLoad} hrs/week
                                </div>
                            </div>
                        </div>

                        {/* Classes Assigned */}
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

                        {/* Performance Metrics */}
                        <div style={{ gridColumn: '1 / -1', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                            <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Performance Metrics</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Rating</span>
                                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{teacher.performance > 0 ? `${teacher.performance} / 5` : 'N/A'}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {teacher.performance > 0 ? (
                                            [...Array(5)].map((_, i) => (
                                                <Award key={i} size={16} fill={i < teacher.performance ? '#f59e0b' : 'none'} color={i < teacher.performance ? '#f59e0b' : '#cbd5e1'} />
                                            ))
                                        ) : (
                                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No ratings yet</span>
                                        )}
                                    </div>
                                </div>
                                
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
        </div>
    );
};

export default ViewTeacherModal;
