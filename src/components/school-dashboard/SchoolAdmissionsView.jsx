import React, { useState, useEffect } from 'react';
import { FileText, Users, CheckCircle, XCircle, Clock, TrendingUp, Plus, Trash2, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import './parents/ParentsOverview.css';

const STATUS_COLORS = {
  Approved:   { bg: '#d1fae5', color: '#065f46' },
  Pending:    { bg: '#fef3c7', color: '#92400e' },
  Rejected:   { bg: '#fee2e2', color: '#991b1b' },
  Waitlisted: { bg: '#ede9fe', color: '#5b21b6' },
};

const SchoolAdmissionsView = () => {
  const [stats, setStats] = useState({
    activeCycles: 0,
    applicationsToday: 0,
    inReview: 0,
    approved: 0,
    rejected: 0,
    waitlisted: 0,
    conversionRate: 0,
    missingDocs: 0,
  });
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ studentName: '', parentName: '', class: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [statsRes, listRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admissions/stats`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admissions`, { headers }),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (listRes.ok) setAdmissions(await listRes.json());
    } catch {
      toast.error('Failed to load admissions data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) { toast.success(`Status updated to ${status}`); fetchData(); }
      else { const err = await res.json(); toast.error(err.message || 'Update failed'); }
    } catch { toast.error('Network error'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { toast.success('Application deleted'); fetchData(); }
      else toast.error('Failed to delete');
    } catch { toast.error('Network error'); }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      // Get school from current user's profile
      const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const me = await meRes.json();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, school: me.school, status: 'Pending', date: new Date() }),
      });
      if (res.ok) {
        toast.success('Application submitted');
        setShowForm(false);
        setForm({ studentName: '', parentName: '', class: '', notes: '' });
        fetchData();
      } else { const err = await res.json(); toast.error(err.message || 'Failed'); }
    } catch { toast.error('Network error'); }
    finally { setSubmitting(false); }
  };

  const kpiCards = [
    { title: 'Active Cycles',        value: stats.activeCycles,       icon: <Clock size={28} />,       color: '#3b82f6', trend: 'admission cycles' },
    { title: "Today's Applications", value: stats.applicationsToday,  icon: <FileText size={28} />,    color: '#10b981', trend: 'new today' },
    { title: 'In Review',            value: stats.inReview,           icon: <Users size={28} />,       color: '#f59e0b', trend: 'pending' },
    { title: 'Approved',             value: stats.approved,           icon: <CheckCircle size={28} />, color: '#10b981', trend: `${stats.conversionRate}% conversion` },
  ];

  return (
    <div className="parents-overview">
      <div className="overview-header">
        <div>
          <h1 className="overview-title">Admissions Management</h1>
          <p className="overview-subtitle">Manage admission applications in real-time</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> New Application
          </button>
        </div>
      </div>

      {/* KPI Cards */}
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

      {/* New Application Form */}
      {showForm && (
        <div className="communication-card" style={{ marginBottom: '24px' }}>
          <div className="card-header"><h2 className="card-title">New Admission Application</h2></div>
          <form onSubmit={handleSubmitForm} style={{ padding: '20px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Student Name *</label>
                <input required style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} placeholder="Full Name" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Parent Name *</label>
                <input required style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} placeholder="Parent / Guardian" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Class Applying For *</label>
                <input required style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} placeholder="e.g. Grade 5" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Notes</label>
                <input style={{ width: '100%', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Application'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="stats-alerts-row">
        {/* Application List */}
        <div className="communication-card">
          <div className="card-header"><h2 className="card-title"><FileText size={20} />Applications</h2></div>
          <div className="activity-list">
            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading applications...</div>
            ) : admissions.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                <FileText size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                <p>No applications yet. Add the first one!</p>
              </div>
            ) : admissions.map((app) => {
              const statusStyle = STATUS_COLORS[app.status] || { bg: '#f1f5f9', color: '#475569' };
              return (
                <div key={app._id} className="activity-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <div>
                      <div className="activity-parent">{app.studentName}</div>
                      <div className="activity-action">Parent: {app.parentName} • Class: {app.class} • {new Date(app.createdAt || app.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                        {app.status}
                      </span>
                      <button onClick={() => handleDelete(app._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  {app.status === 'Pending' && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleStatusChange(app._id, 'Approved')}   style={{ padding: '4px 10px', background: '#d1fae5', color: '#065f46', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✓ Approve</button>
                      <button onClick={() => handleStatusChange(app._id, 'Rejected')}   style={{ padding: '4px 10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>✗ Reject</button>
                      <button onClick={() => handleStatusChange(app._id, 'Waitlisted')} style={{ padding: '4px 10px', background: '#ede9fe', color: '#5b21b6', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>⏸ Waitlist</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Panel */}
        <div className="alerts-card">
          <div className="card-header"><h2 className="card-title"><BarChart size={20} />Pipeline Stats</h2></div>
          <div className="alerts-list">
            <div className="alert-item alert-warning">
              <div className="alert-icon"><Clock size={18} /></div>
              <div className="alert-content">
                <div className="alert-label">Pending Review</div>
                <div className="alert-count">{stats.inReview} applications</div>
              </div>
            </div>
            <div className="alert-item alert-info">
              <div className="alert-icon"><XCircle size={18} /></div>
              <div className="alert-content">
                <div className="alert-label">Rejected</div>
                <div className="alert-count">{stats.rejected} applications</div>
              </div>
            </div>
            <div className="alert-item alert-info">
              <div className="alert-icon"><TrendingUp size={18} /></div>
              <div className="alert-content">
                <div className="alert-label">Waitlisted</div>
                <div className="alert-count">{stats.waitlisted} applications</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolAdmissionsView;
