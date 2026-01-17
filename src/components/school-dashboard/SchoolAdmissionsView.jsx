import React from 'react';
import { FileText, Users, CheckCircle, XCircle, Clock, TrendingUp, BarChart } from 'lucide-react';
import { admissionsStats, admissionCycles, applications } from './reports/mockData';
import './parents/ParentsOverview.css';

const SchoolAdmissionsView = () => {
    const { activeCycles, applicationsToday, inReview, approved, rejected, waitlisted, conversionRate, missingDocs } = admissionsStats;

    const kpiCards = [
        { title: "Active Cycles", value: activeCycles, icon: <Clock size={28} />, color: "#3b82f6", trend: "admission cycles" },
        { title: "Today's Applications", value: applicationsToday, icon: <FileText size={28} />, color: "#10b981", trend: "new today" },
        { title: "In Review", value: inReview, icon: <Users size={28} />, color: "#f59e0b", trend: "pending" },
        { title: "Approved", value: approved, icon: <CheckCircle size={28} />, color: "#10b981", trend: `${conversionRate}% conversion` }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Admissions Management</h1>
                    <p className="overview-subtitle">Manage admission cycles and applications</p>
                </div>
            </div>

            <div className="kpi-grid">
                {kpiCards.map((card, index) => (
                    <div key={index} className="kpi-card">
                        <div className="kpi-icon" style={{ background: `${card.color}15`, color: card.color }}>
                            {card.icon}
                        </div>
                        <div className="kpi-content">
                            <h3 className="kpi-title">{card.title}</h3>
                            <div className="kpi-value">{card.value}</div>
                            <div className="kpi-trend">{card.trend}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="stats-alerts-row">
                <div className="communication-card">
                    <div className="card-header">
                        <h2 className="card-title"><FileText size={20} />Admission Cycles</h2>
                    </div>
                    <div className="activity-list">
                        {admissionCycles.map((cycle) => (
                            <div key={cycle.id} className="activity-item">
                                <div className="activity-avatar" style={{ background: cycle.status === 'Active' ? '#10b981' : '#3b82f6' }}>
                                    {cycle.seatsAvailable}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent">{cycle.name}</div>
                                    <div className="activity-action">
                                        {cycle.startDate} to {cycle.endDate} • Classes: {cycle.classes.join(', ')} • {cycle.applicationsReceived} applications
                                    </div>
                                </div>
                                <div className="activity-time">{cycle.status}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title"><BarChart size={20} />Stats</h2>
                    </div>
                    <div className="alerts-list">
                        <div className="alert-item alert-warning">
                            <div className="alert-icon"><FileText size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Missing Documents</div>
                                <div className="alert-count">{missingDocs} applications</div>
                            </div>
                        </div>
                        <div className="alert-item alert-info">
                            <div className="alert-icon"><XCircle size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Rejected</div>
                                <div className="alert-count">{rejected} applications</div>
                            </div>
                        </div>
                        <div className="alert-item alert-info">
                            <div className="alert-icon"><Clock size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Waitlisted</div>
                                <div className="alert-count">{waitlisted} applications</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="activity-card">
                <div className="card-header">
                    <h2 className="card-title"><TrendingUp size={20} />Application Pipeline</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e40af', fontWeight: 700 }}>New Applications ({applications.new.length})</h4>
                    </div>
                    <div style={{ background: '#fef3c7', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#92400e', fontWeight: 700 }}>Under Review ({applications.underReview.length})</h4>
                    </div>
                    <div style={{ background: '#d1fae5', padding: '16px', borderRadius: '8px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#065f46', fontWeight: 700 }}>Approved ({applications.approved.length})</h4>
                    </div>
                </div>
                <div className="activity-list">
                    {[...applications.new, ...applications.underReview].map((app) => (
                        <div key={app.id} className="activity-item">
                            <div className="activity-avatar" style={{ background: '#3b82f6' }}>
                                {app.class}
                            </div>
                            <div className="activity-details">
                                <div className="activity-parent">{app.studentName}</div>
                                <div className="activity-action">Parent: {app.parentName} • Applied: {app.date} • Docs: {app.documents}/{app.required}</div>
                            </div>
                            <div className="activity-time">
                                {app.documents === app.required ? <CheckCircle size={16} style={{ color: '#10b981' }} /> : <Clock size={16} style={{ color: '#f59e0b' }} />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolAdmissionsView;
