import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Link, Activity, MessageSquare, Bell, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import './ParentsOverview.css';

const ParentsOverview = () => {
  const [data, setData] = useState({
    totalParents: 0,
    newParents: { week: 0, month: 0 },
    linkedParents: 0,
    unlinkedParents: 0,
    activeToday: 0,
    communication: { messagesSent: 0, unreadMessages: 0, announcementsViewed: 0, announcementsTotal: 0 },
    alerts: [],
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/parent-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setData(await res.json());
      else toast.error('Failed to load parent stats');
    } catch {
      toast.error('Network error loading parent stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const kpiCards = [
    { title: 'Total Parents',   value: data.totalParents,        icon: <Users size={28} />,    color: '#3b82f6', trend: `+${data.newParents.month} this month` },
    { title: 'New This Week',   value: data.newParents.week,     icon: <UserPlus size={28} />, color: '#10b981', trend: `${data.newParents.month} this month` },
    { title: 'Linked Parents',  value: data.linkedParents,       icon: <Link size={28} />,     color: '#f59e0b', trend: `${data.unlinkedParents} unlinked` },
    { title: 'Active Today',    value: data.activeToday,         icon: <Activity size={28} />, color: '#8b5cf6',
      trend: data.totalParents > 0 ? `${((data.activeToday / data.totalParents) * 100).toFixed(0)}% of total` : '0%' },
  ];

  if (loading) {
    return (
      <div className="parents-overview">
        <div className="overview-header"><h1 className="overview-title">Parents Management</h1></div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading parent data...</div>
      </div>
    );
  }

  return (
    <div className="parents-overview">
      <div className="overview-header">
        <div>
          <h1 className="overview-title">Parents Management</h1>
          <p className="overview-subtitle">Manage parent accounts and engagement</p>
        </div>
      </div>

      {/* KPI Cards — live from DB */}
      <div className="kpi-grid">
        {kpiCards.map((card, index) => (
          <div key={index} className="kpi-card">
            <div className="kpi-icon" style={{ background: `${card.color}15`, color: card.color }}>{card.icon}</div>
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
        <div className="communication-card">
          <div className="card-header">
            <h2 className="card-title"><MessageSquare size={20} />Communication Activity</h2>
          </div>
          <div className="comm-stats">
            <div className="comm-stat-item">
              <div className="stat-label">Messages Sent</div>
              <div className="stat-value">{data.communication.messagesSent}</div>
            </div>
            <div className="comm-stat-item">
              <div className="stat-label">Unread Messages</div>
              <div className="stat-value warning">{data.communication.unreadMessages}</div>
            </div>
            <div className="comm-stat-item">
              <div className="stat-label">Announcements Viewed</div>
              <div className="stat-value">
                {data.communication.announcementsViewed}
                <span className="stat-secondary"> / {data.communication.announcementsTotal}</span>
              </div>
              {data.communication.announcementsTotal > 0 && (
                <div className="stat-progress">
                  <div className="stat-progress-fill"
                    style={{ width: `${(data.communication.announcementsViewed / data.communication.announcementsTotal) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="alerts-card">
          <div className="card-header">
            <h2 className="card-title"><Bell size={20} />Quick Alerts</h2>
          </div>
          <div className="alerts-list">
            {data.alerts.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
                No alerts at this time
              </div>
            ) : data.alerts.map((alert, index) => (
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
          <h2 className="card-title"><Activity size={20} />Recent Parent Activity</h2>
        </div>
        <div className="activity-list">
          {data.recentActivity.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
              <Activity size={32} style={{ opacity: 0.3, marginBottom: '8px', display: 'block', margin: '0 auto 8px' }} />
              No recent activity to display
            </div>
          ) : data.recentActivity.map((activity) => (
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
