import React, { useState } from 'react';
import { Plus, FileText, CheckCircle, Clock, AlertCircle, Calendar, Upload } from 'lucide-react';
import { homeworkAssignments, teacherClasses } from './mockData';
import './TeacherDashboardOverview.css';

const TeacherHomeworkView = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedHomework, setSelectedHomework] = useState(null);

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Homework & Assignments</h1>
                    <p className="page-subtitle">Create, track, and grade homework assignments</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus size={16} /> Create Homework
                </button>
            </div>

            {/* Stats Overview */}
            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                        <FileText size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Total Assignments</h3>
                        <div className="kpi-value">{homeworkAssignments.length}</div>
                        <div className="kpi-change">Active</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <CheckCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Submitted</h3>
                        <div className="kpi-value">65</div>
                        <div className="kpi-change">Out of 90 total</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                        <Clock size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Pending Grading</h3>
                        <div className="kpi-value">35</div>
                        <div className="kpi-change">To be graded</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#ef444420', color: '#ef4444' }}>
                        <AlertCircle size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Overdue</h3>
                        <div className="kpi-value">8</div>
                        <div className="kpi-change">Not submitted</div>
                    </div>
                </div>
            </div>

            {showCreateForm && (
                <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <h2 className="card-title">Create New Homework</h2>
                        <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                    </div>
                    <div className="card-body">
                        <form style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Title</label>
                                <input type="text" placeholder="Assignment title" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Class</label>
                                <select style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                    <option>Select Class</option>
                                    {teacherClasses.map(c => (
                                        <option key={c.id} value={c.id}>{c.subject} - {c.grade}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Due Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Max Marks</label>
                                    <input type="number" placeholder="100" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Description</label>
                                <textarea rows="4" placeholder="Assignment details and instructions" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Attach Files</label>
                                <div style={{ border: '2px dashed #e5e7eb', borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}>
                                    <Upload size={32} color="#9ca3af" style={{ margin: '0 auto 8px' }} />
                                    <p style={{ color: '#6b7280' }}>Click to upload or drag and drop</p>
                                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>PDF, DOC, or images (max 10MB)</p>
                                </div>
                            </div>
                            <button type="button" className="btn-primary" onClick={() => { alert('Homework created!'); setShowCreateForm(false); }}>
                                Create Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Homework List */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">All Assignments</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {homeworkAssignments.map((hw) => (
                            <div key={hw.id} style={{
                                padding: '20px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onClick={() => setSelectedHomework(selectedHomework?.id === hw.id ? null : hw)}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{hw.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{hw.class} • {hw.subject}</p>
                                    </div>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        backgroundColor: new Date(hw.dueDate) > new Date() ? '#dbeafe' : '#fee2e2',
                                        color: new Date(hw.dueDate) > new Date() ? '#1e40af' : '#991b1b'
                                    }}>
                                        {new Date(hw.dueDate) > new Date() ? 'Active' : 'Overdue'}
                                    </span>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', fontSize: '14px' }}>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Due:</span>
                                        <p style={{ fontWeight: '500' }}>{new Date(hw.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Submitted:</span>
                                        <p style={{ fontWeight: '500', color: '#10b981' }}>{hw.submitted}/{hw.totalStudents}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Graded:</span>
                                        <p style={{ fontWeight: '500', color: '#3b82f6' }}>{hw.graded}/{hw.submitted}</p>
                                    </div>
                                    <div>
                                        <span style={{ color: '#6b7280' }}>Pending:</span>
                                        <p style={{ fontWeight: '500', color: '#f59e0b' }}>{hw.pending}</p>
                                    </div>
                                </div>

                                {selectedHomework?.id === hw.id && (
                                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                                        <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '12px' }}>{hw.description}</p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button className="btn-primary" style={{ fontSize: '14px' }}>Grade Submissions</button>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>View Details</button>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>Send Reminder</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherHomeworkView;
