import React, { useState } from 'react';
import { FileSpreadsheet, Plus, TrendingUp, Download, Award, Users } from 'lucide-react';
import { exams, teacherClasses } from './mockData';
import './TeacherDashboardOverview.css';

const TeacherExamsView = () => {
    const [showCreateForm, setShowCreateForm] = useState(false);

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Exams & Results</h1>
                    <p className="page-subtitle">Manage exams, upload marks, and publish results</p>
                </div>
                <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus size={16} /> Create Exam
                </button>
            </div>

            {/* Stats */}
            <div className="kpi-grid" style={{ marginBottom: '24px' }}>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#3b82f620', color: '#3b82f6' }}>
                        <FileSpreadsheet size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Total Exams</h3>
                        <div className="kpi-value">{exams.length}</div>
                        <div className="kpi-change">This term</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#10b98120', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Avg Score</h3>
                        <div className="kpi-value">76.5%</div>
                        <div className="kpi-change">Across all exams</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#f59e0b20', color: '#f59e0b' }}>
                        <Award size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Highest Score</h3>
                        <div className="kpi-value">98</div>
                        <div className="kpi-change">This term</div>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon-wrapper" style={{ backgroundColor: '#8b5cf620', color: '#8b5cf6' }}>
                        <Users size={24} />
                    </div>
                    <div className="kpi-content">
                        <h3 className="kpi-title">Students</h3>
                        <div className="kpi-value">116</div>
                        <div className="kpi-change">Evaluated</div>
                    </div>
                </div>
            </div>

            {showCreateForm && (
                <div className="dashboard-card" style={{ marginBottom: '24px' }}>
                    <div className="card-header">
                        <h2 className="card-title">Create New Exam</h2>
                        <button className="btn-secondary" onClick={() => setShowCreateForm(false)}>Cancel</button>
                    </div>
                    <div className="card-body">
                        <form style={{ display: 'grid', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Title</label>
                                <input type="text" placeholder="e.g., Mid-Term Mathematics" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Class</label>
                                    <select style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                                        <option>Select Class</option>
                                        {teacherClasses.map(c => (
                                            <option key={c.id} value={c.id}>{c.subject} - {c.grade}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Total Marks</label>
                                    <input type="number" placeholder="100" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Exam Date</label>
                                    <input type="date" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Duration</label>
                                    <input type="text" placeholder="2 hours" style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                                </div>
                            </div>
                            <button type="button" className="btn-primary" onClick={() => { alert('Exam created!'); setShowCreateForm(false); }}>
                                Create Exam
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Exams List */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h2 className="card-title">All Exams</h2>
                </div>
                <div className="card-body">
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {exams.map((exam) => (
                            <div key={exam.id} style={{
                                padding: '20px',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                                    <div>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>{exam.title}</h3>
                                        <p style={{ fontSize: '14px', color: '#6b7280' }}>{exam.class} • {exam.subject}</p>
                                    </div>
                                    {exam.published ? (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#d1fae5',
                                            color: '#065f46'
                                        }}>
                                            ✓ Published
                                        </span>
                                    ) : exam.upcoming ? (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#dbeafe',
                                            color: '#1e40af'
                                        }}>
                                            Upcoming
                                        </span>
                                    ) : (
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#fef3c7',
                                            color: '#92400e'
                                        }}>
                                            Pending
                                        </span>
                                    )}
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                    <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Date</p>
                                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{new Date(exam.date).toLocaleDateString()}</p>
                                    </div>
                                    <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Total Marks</p>
                                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{exam.totalMarks}</p>
                                    </div>
                                    {!exam.upcoming && (
                                        <>
                                            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Average</p>
                                                <p style={{ fontWeight: '600', fontSize: '14px', color: '#10b981' }}>{exam.averageScore}%</p>
                                            </div>
                                            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                                                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Highest</p>
                                                <p style={{ fontWeight: '600', fontSize: '14px', color: '#3b82f6' }}>{exam.highestScore}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {!exam.published && !exam.upcoming && (
                                        <button className="btn-primary" style={{ fontSize: '14px' }}>Upload Marks</button>
                                    )}
                                    {!exam.published && !exam.upcoming && (
                                        <button className="btn-primary" style={{ fontSize: '14px' }}>Publish Results</button>
                                    )}
                                    {exam.published && (
                                        <>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>
                                                <Download size={14} /> Export PDF
                                            </button>
                                            <button className="btn-secondary" style={{ fontSize: '14px' }}>View Rank List</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherExamsView;
