import React from 'react';
import { Clock, Calendar, AlertTriangle, Check, Users, BookOpen } from 'lucide-react';
import { timetableStats, sampleTimetable } from './reports/mockData';
import './parents/ParentsOverview.css';

const SchoolTimetableView = () => {
    const { totalTimetables, recentlyUpdated, conflicts, teacherFree } = timetableStats;

    const kpiCards = [
        { title: "Total Timetables", value: totalTimetables, icon: <Calendar size={28} />, color: "#3b82f6", trend: "all classes" },
        { title: "Recently Updated", value: recentlyUpdated, icon: <Clock size={28} />, color: "#10b981", trend: "this week" },
        { title: "Conflicts Detected", value: conflicts, icon: <AlertTriangle size={28} />, color: "#ef4444", trend: "need resolution" },
        { title: "Teacher Free Periods", value: teacherFree, icon: <Users size={28} />, color: "#8b5cf6", trend: "available" }
    ];

    return (
        <div className="parents-overview">
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Timetable Management</h1>
                    <p className="overview-subtitle">Manage class schedules and teacher assignments</p>
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

            <div className="activity-card">
                <div className="card-header">
                    <h2 className="card-title"><BookOpen size={20} />Sample Timetable - {sampleTimetable.class}</h2>
                </div>
                <div className="activity-list">
                    {sampleTimetable.periods.map((day, dayIndex) => (
                        <div key={dayIndex} style={{ marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                                {day.day}
                            </h3>
                            {day.slots.map((slot, slotIndex) => (
                                <div key={slotIndex} className="activity-item">
                                    <div className="activity-avatar" style={{ background: '#3b82f6' }}>
                                        {slot.period}
                                    </div>
                                    <div className="activity-details">
                                        <div className="activity-parent">{slot.subject}</div>
                                        <div className="activity-action">{slot.time} • {slot.teacher} • {slot.room}</div>
                                    </div>
                                    <div className="activity-time">
                                        <Check size={16} style={{ color: '#10b981' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SchoolTimetableView;
