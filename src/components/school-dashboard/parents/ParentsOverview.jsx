import React from 'react';
import { Users, UserPlus, Link, Activity, MessageSquare, Bell, AlertTriangle, Info } from 'lucide-react';
import { parentsStats } from './mockData';
import './ParentsOverview.css';

const ParentsOverview = () => {
    const { totalParents, newParents, linkedParents, unlinkedParents, activeToday,
        communication, alerts, recentActivity } = parentsStats;

    const kpiCards = [
        {
            title: "Total Parents",
            value: totalParents,
            icon: <Users size={28} />,
            color: "#3b82f6",
            trend: `+${newParents.month} this month`
        },
        {
            title: "New This Week",
            value: newParents.week,
            icon: <UserPlus size={28} />,
            color: "#10b981",
            trend: `${newParents.month} this month`
        },
        {
            title: "Linked Parents",
            value: linkedParents,
            icon: <Link size={28} />,
            color: "#f59e0b",
            trend: `${unlinkedParents} unlinked`
        },
        {
            title: "Active Today",
            value: activeToday,
            icon: <Activity size={28} />,
            color: "#8b5cf6",
            trend: `${((activeToday / totalParents) * 100).toFixed(0)}% of total`
        }
    ];

    return (
        <div className="parents-overview">
            {/* Page Header */}
            <div className="overview-header">
                <div>
                    <h1 className="overview-title">Parents Management</h1>
                    <p className="overview-subtitle">Manage parent accounts and engagement</p>
                </div>
            </div>

            {/* KPI Cards */}
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

            {/* Communication Stats & Alerts Row */}
            <div className="stats-alerts-row">
                {/* Communication Activity */}
                <div className="communication-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <MessageSquare size={20} />
                            Communication Activity
                        </h2>
                    </div>
                    <div className="comm-stats">
                        <div className="comm-stat-item">
                            <div className="stat-label">Messages Sent</div>
                            <div className="stat-value">{communication.messagesSent}</div>
                        </div>
                        <div className="comm-stat-item">
                            <div className="stat-label">Unread Messages</div>
                            <div className="stat-value warning">{communication.unreadMessages}</div>
                        </div>
                        <div className="comm-stat-item">
                            <div className="stat-label">Announcements Viewed</div>
                            <div className="stat-value">
                                {communication.announcementsViewed}
                                <span className="stat-secondary">
                                    /{communication.announcementsTotal}
                                </span>
                            </div>
                            <div className="stat-progress">
                                <div
                                    className="stat-progress-fill"
                                    style={{ width: `${(communication.announcementsViewed / communication.announcementsTotal) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Alerts */}
                <div className="alerts-card">
                    <div className="card-header">
                        <h2 className="card-title">
                            <Bell size={20} />
                            Quick Alerts
                        </h2>
                    </div>
                    <div className="alerts-list">
                        {alerts.map((alert, index) => (
                            <div key={index} className={`alert-item alert-${alert.severity}`}>
                                <div className="alert-icon">
                                    {alert.severity === 'warning' ? <AlertTriangle size={18} /> : <Info size={18} />}
                                </div>
                                <div className="alert-content">
                                    <div className="alert-label">{alert.label}</div>
                                    <div className="alert-count">{alert.count} parents</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="activity-card">
                <div className="card-header">
                    <h2 className="card-title">
                        <Activity size={20} />
                        Recent Parent Activity
                    </h2>
                </div>
                <div className="activity-list">
                    {recentActivity.map((activity) => (
                        <div key={activity.id} className="activity-item">
                            <div className="activity-avatar">
                                {activity.parent.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="activity-details">
                                <div className="activity-parent">{activity.parent}</div>
                                <div className="activity-action">{activity.action}</div>
                            </div>
                            <div className="activity-time">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ParentsOverview;
