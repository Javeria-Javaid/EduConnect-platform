import React from 'react';
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
  AlertCircle
} from 'lucide-react';
import './DashboardOverview.css';

const DashboardOverview = () => {
  // Mock Data
  const stats = [
    { label: 'Total Schools', value: '1,248', change: '+12%', icon: School, color: '#2A6EF2' },
    { label: 'Active Students', value: '45.2k', change: '+8.5%', icon: Users, color: '#3AC47D' },
    { label: 'Job Posts', value: '892', change: '+24%', icon: Briefcase, color: '#F59E0B' },
    { label: 'Pending Approvals', value: '34', change: '-5%', icon: Clock, color: '#EF4444' },
  ];

  const admissionsData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
    { name: 'Jul', value: 1200 },
  ];

  const jobsData = [
    { name: 'Mon', applications: 24 },
    { name: 'Tue', applications: 45 },
    { name: 'Wed', applications: 32 },
    { name: 'Thu', applications: 68 },
    { name: 'Fri', applications: 54 },
    { name: 'Sat', applications: 12 },
    { name: 'Sun', applications: 8 },
  ];

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
              <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                {stat.change} from last month
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
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Job Applications</h3>
            <button className="chart-action">View Details</button>
          </div>
          <div className="chart-container">
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
            {[1, 2, 3].map((item) => (
              <div key={item} className="list-item">
                <div className="item-icon warning">
                  <AlertCircle size={18} />
                </div>
                <div className="item-details">
                  <h4>New School Registration</h4>
                  <p>Greenwood High School requested verification</p>
                </div>
                <div className="item-actions">
                  <button className="btn-sm primary">Review</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
          </div>
          <div className="list-content">
            {[1, 2, 3].map((item) => (
              <div key={item} className="list-item">
                <div className="item-icon success">
                  <CheckCircle size={18} />
                </div>
                <div className="item-details">
                  <h4>Vendor Approved</h4>
                  <p>Stationery Supplies Co. was approved by Admin</p>
                </div>
                <span className="time-ago">2h ago</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
