import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Download, Clock, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import { reportsOverviewData } from './mockData';
import './ReportsOverview.css';

const ReportsOverview = ({ onNavigate, reportTypes }) => {
    const { summaryCards, recentReports, enrollmentTrend, attendanceDistribution } = reportsOverviewData;

    return (
        <div className="reports-overview-container">
            {/* Summary Stats */}
            <div className="summary-grid">
                {summaryCards.map((card, index) => (
                    <div key={index} className="summary-card">
                        <div className="summary-card-header">
                            <div className="summary-card-content">
                                <h3>{card.title}</h3>
                                <p className="summary-card-value">{card.value}</p>
                            </div>
                            <div className="summary-card-icon">
                                <div className="summary-card-icon-dot" />
                            </div>
                        </div>
                        <div className="summary-card-footer">
                            <span className={`trend-indicator ${card.trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                                {card.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                {card.change}
                            </span>
                            <span className="trend-label">vs last month</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Report Categories Grid */}
            <div className="categories-section">
                <h2 className="section-title">Report Categories</h2>
                <div className="categories-grid">
                    {reportTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <button
                                key={type.id}
                                onClick={() => onNavigate(type.id)}
                                className="category-card"
                            >
                                <div className="category-icon-wrapper">
                                    <Icon size={24} />
                                </div>
                                <h3 className="category-title">
                                    {type.label}
                                </h3>
                                <p className="category-description">
                                    {type.description}
                                </p>
                                <div className="category-action">
                                    View Reports <ChevronRight size={16} />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
                {/* Enrollment Trend */}
                <div className="chart-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Enrollment Analytics</h3>
                        <select className="chart-select">
                            <option>This Year</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={enrollmentTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="students"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Attendance Distribution */}
                <div className="chart-card">
                    <h3 className="chart-title">Today's Attendance</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={attendanceDistribution}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {attendanceDistribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', paddingBottom: '32px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '1.875rem', fontWeight: '800', color: '#1e293b' }}>94%</span>
                                <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Present</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Reports List */}
            <div className="recent-reports-section">
                <div className="recent-reports-card">
                    <div className="chart-header">
                        <h3 className="chart-title">Recently Generated</h3>
                        <button style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}>
                            View All History
                        </button>
                    </div>
                    <div className="reports-list">
                        {recentReports.map((report) => (
                            <div key={report.id} className="report-item">
                                <div className="report-item-left">
                                    <div className="report-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="report-info">
                                        <h4>{report.name}</h4>
                                        <div className="report-meta">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={12} /> {report.date}
                                            </span>
                                            <span style={{ padding: '2px 8px', background: '#f1f5f9', color: '#64748b', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                                                {report.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button className="download-button" title="Download">
                                    <Download size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsOverview;
