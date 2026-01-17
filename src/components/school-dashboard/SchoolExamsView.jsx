import React from 'react';
import { Calendar, Clock, FileText, Award, TrendingUp, AlertCircle } from 'lucide-react';
import { examsData, examTimetable } from './reports/mockData';
import './parents/ParentsOverview.css';

const SchoolExamsView = () => {
    const { upcoming, active, completed, stats } = examsData;

    const kpiCards = [
        { title: "Upcoming Exams", value: stats.upcomingCount, icon: <Calendar size={28} />, color: "#3b82f6", trend: "scheduled" },
        { title: "Active Sessions", value: stats.activeCount, icon: <Clock size={28} />, color: "#10b981", trend: "in progress" },
        { title: "Pending Results", value: stats.pendingResults, icon: <FileText size={28} />, color: "#f59e0b", trend: "to enter" },
        { title: "Completed", value: stats.completedCount, icon: <Award size={28} />, color: "#8b5cf6", trend: "this term" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Exams Management</h1>
                    <p className="overview-subtitle">Manage exam schedules, grades, and report cards</p>
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
                        <h2 className="card-title"><Calendar size={20} />Exam Timetable</h2>
                    </div>
                    <div className="activity-list">
                        {examTimetable.map((exam, index) => (
                            <div key={index} className="activity-item">
                                <div className="activity-avatar" style={{ background: '#3b82f6' }}>
                                    {exam.subject.substring(0, 2)}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent">{exam.subject}</div>
                                    <div className="activity-action">{exam.date} • {exam.time} • {exam.room}</div>
                                </div>
                                <div className="activity-time">{exam.invigilator}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title"><TrendingUp size={20} />Performance</h2>
                    </div>
                    <div className="alerts-list">
                        <div className="alert-item alert-info">
                            <div className="alert-icon"><Award size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Top Performing</div>
                                <div className="alert-count">{stats.topClass}</div>
                            </div>
                        </div>
                        <div className="alert-item alert-warning">
                            <div className="alert-icon"><AlertCircle size={18} /></div>
                            <div className="alert-content">
                                <div className="alert-label">Needs Attention</div>
                                <div className="alert-count">{stats.lowClass}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {active.length > 0 && (
                <div className="activity-card">
                    <div className="card-header">
                        <h2 className="card-title"><Clock size={20} />Active Exam Sessions</h2>
                    </div>
                    <div className="activity-list">
                        {active.map((exam) => (
                            <div key={exam.id} className="activity-item">
                                <div className="activity-avatar" style={{ background: '#10b981' }}>
                                    {exam.classes}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent">{exam.name}</div>
                                    <div className="activity-action">{exam.start} to {exam.end} • {exam.subjects} subjects</div>
                                </div>
                                <div className="activity-time">{exam.status}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SchoolExamsView;
