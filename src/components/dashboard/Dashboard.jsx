import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  School,
  Users,
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  Loader2
} from 'lucide-react';
import './DashboardOverview.css';

const DashboardOverview = () => {
  const [stats, setStats] = useState([]);
  const [admissionsData, setAdmissionsData] = useState([]);
  const [jobsData, setJobsData] = useState([]);
  const [pendingAdmissions, setPendingAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, { headers })
      ]);

      if (!statsRes.ok || !analyticsRes.ok) throw new Error('Failed to fetch dashboard data');

      const statsData = await statsRes.json();
      const analyticsData = await analyticsRes.json();

      setStats([
        { label: 'Total Schools', value: statsData.totalSchools.toLocaleString(), icon: School, color: '#2A6EF2' },
        { label: 'Active Students', value: statsData.activeStudents.toLocaleString(), icon: Users, color: '#3AC47D' },
        { label: 'Job Posts', value: statsData.totalJobPosts.toLocaleString(), icon: Briefcase, color: '#F59E0B' },
        { label: 'Pending Approvals', value: statsData.pendingApprovals.toString(), icon: Clock, color: '#EF4444' },
      ]);

      setAdmissionsData(analyticsData.admissionsTrend);
      setJobsData(analyticsData.jobApplicationsTrend);
      setPendingAdmissions(statsData.recentPendingAdmissions || []);

    } catch (err) {
      console.error(err);
      setError('Network error: Could not load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <Loader2 className="animate-spin" size={48} color="#2A6EF2" />
        <p style={{ marginTop: '16px', color: '#64748b' }}>Initializing platform analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error" style={{ textAlign: 'center', padding: '40px' }}>
        <AlertCircle size={48} color="#EF4444" style={{ margin: '0 auto' }} />
        <p style={{ marginTop: '16px', color: '#ef4444' }}>{error}</p>
        <button onClick={fetchData} className="retry-btn" style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#2A6EF2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Retry Connection</button>
      </div>
    );
  }

  return (
    <div className="dashboard-overview">
      <div className="overview-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
              <span className="stat-active-badge" style={{ fontSize: '12px', color: '#3AC47D', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={12} /> Live Data
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Admissions Trend</h3>
            <button className="chart-action">View Report</button>
          </div>
          <div className="chart-container">
            {admissionsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={admissionsData}>
                  <defs>
                    <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2A6EF2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2A6EF2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2A6EF2" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-msg" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No admission data for selected period.</div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Job Applications</h3>
            <button className="chart-action">View Details</button>
          </div>
          <div className="chart-container">
            {jobsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="applications" fill="#3AC47D" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-data-msg" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>No job application data found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity / Pending Actions */}
      <div className="recent-section">
        <div className="recent-card">
          <div className="card-header">
            <h3>Pending Approvals</h3>
            <span className="badge warning">Action Required</span>
          </div>
          <div className="list-content">
            {pendingAdmissions.length > 0 ? pendingAdmissions.map((item) => (
              <div key={item._id} className="list-item">
                <div className="item-icon warning">
                  <AlertCircle size={18} />
                </div>
                <div className="item-details">
                  <h4>New Admission: {item.applicantName}</h4>
                  <p>Grade: {item.grade} • Applied by {item.parentName}</p>
                </div>
                <div className="item-actions">
                  <button className="btn-sm primary">Review</button>
                </div>
              </div>
            )) : (
              <div className="no-data-msg-p" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No pending approvals.</div>
            )}
          </div>
        </div>

        <div className="recent-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
          </div>
          <div className="list-content">
              <div className="list-item">
                <div className="item-icon success">
                  <CheckCircle size={18} />
                </div>
                <div className="item-details">
                  <h4>Platform Insight</h4>
                  <p>All system components are reporting healthy status.</p>
                </div>
                <span className="time-ago">Live</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
