import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';
import { FileText, Download, Clock, ArrowUpRight, ArrowDownRight, ChevronRight } from 'lucide-react';
import './ReportsOverview.css';

const ReportsOverview = ({ onNavigate, reportTypes }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools/reports/overview`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`Failed to load reports overview (${res.status})`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                setError(e?.message || 'Failed to load reports overview');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const summaryCards = data?.summaryCards ?? [];
    const recentReports = data?.recentReports ?? [];
    const enrollmentTrend = data?.enrollmentTrend ?? [];
    const attendanceDistribution = data?.attendanceDistribution ?? [];
    const attendancePresentPercent = useMemo(() => {
        if (typeof data?.attendancePresentPercent === 'number') return data.attendancePresentPercent;
        const present = attendanceDistribution.find((d) => d.name === 'Present')?.value ?? 0;
        const total = attendanceDistribution.reduce((sum, d) => sum + (d.value ?? 0), 0);
        return total > 0 ? Math.round((present / total) * 100) : null;
    }, [data?.attendancePresentPercent, attendanceDistribution]);

    return (
        <div className="reports-overview-container">
            {loading && (
                <div className="reports-state-message reports-state-loading">
                    Loading reports…
                </div>
            )}
            {error && !loading && (
                <div className="reports-state-message reports-state-error">
                    {error}
                </div>
            )}
            {!loading && !error && (
                <>
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
                        <div className="attendance-center-overlay">
                            <div className="attendance-center-content">
                                <span className="attendance-center-value">
                                    {attendancePresentPercent === null ? 'N/A' : `${attendancePresentPercent}%`}
                                </span>
                                <p className="attendance-center-label">Present</p>
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
                        <button className="reports-history-btn">
                            View All History
                        </button>
                    </div>
                    <div className="reports-list">
                        {recentReports.length === 0 && (
                            <div className="reports-empty-state">
                                No saved reports yet.
                            </div>
                        )}
                        {recentReports.map((report) => (
                            <div key={report.id} className="report-item">
                                <div className="report-item-left">
                                    <div className="report-icon">
                                        <FileText size={20} />
                                    </div>
                                    <div className="report-info">
                                        <h4>{report.name}</h4>
                                        <div className="report-meta">
                                            <span className="report-meta-date">
                                                <Clock size={12} /> {report.date}
                                            </span>
                                            <span className="report-type-pill">
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
                </>
            )}
        </div>
    );
};

export default ReportsOverview;
