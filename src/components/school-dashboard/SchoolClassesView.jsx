import React from 'react';
import { Book, Users, AlertCircle, TrendingUp, BookOpen, UserCheck } from 'lucide-react';
import { classesData, classesStats } from './reports/mockData';
import './parents/ParentsOverview.css';

const SchoolClassesView = () => {
    const { totalClasses, totalSections, avgStudents, teacherAssignment, recentlyAdded, issues } = classesStats;

    const kpiCards = [
        { title: "Total Classes", value: totalClasses, icon: <Book size={28} />, color: "#3b82f6", trend: `${totalSections} sections` },
        { title: "Avg Students", value: avgStudents, icon: <Users size={28} />, color: "#10b981", trend: "per class" },
        { title: "Teacher Assignment", value: `${teacherAssignment}%`, icon: <UserCheck size={28} />, color: "#f59e0b", trend: "completed" },
        { title: "Recently Added", value: recentlyAdded, icon: <TrendingUp size={28} />, color: "#8b5cf6", trend: "this month" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Classes Management</h1>
                    <p className="overview-subtitle">Manage classes, sections, and student assignments</p>
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
                        <h2 className="card-title"><BookOpen size={20} />Classes List</h2>
                    </div>
                    <div className="activity-list">
                        {classesData.map((cls) => (
                            <div key={cls.id} className="activity-item">
                                <div className="activity-avatar" style={{ background: cls.attendance >= 90 ? '#10b981' : '#f59e0b' }}>
                                    {cls.name.split(' ')[1]}
                                </div>
                                <div className="activity-details">
                                    <div className="activity-parent">{cls.name} - Section {cls.section}</div>
                                    <div className="activity-action">Teacher: {cls.teacher} • {cls.students} students • Room {cls.room}</div>
                                </div>
                                <div className="activity-time">{cls.attendance}% attendance</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title"><AlertCircle size={20} />Issues</h2>
                    </div>
                    <div className="alerts-list">
                        {issues.map((issue, index) => (
                            <div key={index} className="alert-item alert-warning">
                                <div className="alert-icon"><AlertCircle size={18} /></div>
                                <div className="alert-content">
                                    <div className="alert-label">{issue.type}</div>
                                    <div className="alert-count">{issue.count} classes</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolClassesView;
