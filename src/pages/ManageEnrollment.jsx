import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { School, Users, DollarSign, MessageSquare, TrendingUp, Settings, Upload, CheckCircle, Bell, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Footer from '../components/Footer/Footer';
import './ManageEnrollment.css';

const ManageEnrollment = () => {
    const navigate = useNavigate();
    const [admissionsOpen, setAdmissionsOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    // Prevent auto-scroll on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        // Prevent scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Mock data for analytics
    const enrollmentData = [
        { month: 'Jan', admissions: 45, inquiries: 120 },
        { month: 'Feb', admissions: 52, inquiries: 135 },
        { month: 'Mar', admissions: 68, inquiries: 180 },
        { month: 'Apr', admissions: 85, inquiries: 210 },
        { month: 'May', admissions: 95, inquiries: 250 },
        { month: 'Jun', admissions: 110, inquiries: 290 }
    ];

    const messages = [
        { id: 1, from: "Ayesha Khan", subject: "Admission Requirements", time: "10 mins ago", unread: true },
        { id: 2, from: "Ahmed Ali", subject: "Fee Structure Query", time: "1 hour ago", unread: true },
        { id: 3, from: "Fatima Siddiqui", subject: "Transport Facility", time: "2 hours ago", unread: false },
        { id: 4, from: "Hassan Tariq", subject: "Extra Curricular Activities", time: "5 hours ago", unread: false }
    ];

    return (
        <div className="manage-enrollment-page">
            {/* Header */}
            <div className="enrollment-header">
                <div className="header-content">
                    <button className="back-button" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                    <div className="title-section" style={{ position: 'relative', zIndex: 10 }}>
                        <h1 style={{ color: '#ffffff', opacity: 1, textShadow: 'none', background: 'none', WebkitTextFillColor: '#ffffff' }}>School Enrollment Management</h1>
                        <p className="subtitle">Streamline admissions • Manage communication • Track performance</p>
                    </div>
                    <div className="admission-toggle">
                        <label className="toggle-label">
                            <span>Admissions Status</span>
                            <div className={`toggle-switch ${admissionsOpen ? 'active' : ''}`} onClick={() => setAdmissionsOpen(!admissionsOpen)}>
                                <div className="toggle-slider"></div>
                            </div>
                            <span className={`status-text ${admissionsOpen ? 'open' : 'closed'}`}>
                                {admissionsOpen ? 'OPEN' : 'CLOSED'}
                            </span>
                        </label>
                    </div>
                </div>
            </div>

            <div className="enrollment-container">
                {/* Sidebar Navigation */}
                <aside className="enrollment-sidebar">
                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <TrendingUp size={20} />
                            <span>Dashboard</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'prospectus' ? 'active' : ''}`}
                            onClick={() => setActiveTab('prospectus')}
                        >
                            <Upload size={20} />
                            <span>Prospectus</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'fees' ? 'active' : ''}`}
                            onClick={() => setActiveTab('fees')}
                        >
                            <DollarSign size={20} />
                            <span>Fee Structure</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'communication' ? 'active' : ''}`}
                            onClick={() => setActiveTab('communication')}
                        >
                            <MessageSquare size={20} />
                            <span>Messages</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'vendors' ? 'active' : ''}`}
                            onClick={() => setActiveTab('vendors')}
                        >
                            <School size={20} />
                            <span>Vendors</span>
                        </button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="enrollment-main">
                    {activeTab === 'dashboard' && (
                        <motion.div
                            className="dashboard-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card blue">
                                    <div className="stat-icon">
                                        <Users size={32} />
                                    </div>
                                    <div className="stat-info">
                                        <p className="stat-label">Total Applications</p>
                                        <h3 className="stat-value">455</h3>
                                        <span className="stat-change positive">+12% this month</span>
                                    </div>
                                </div>
                                <div className="stat-card green">
                                    <div className="stat-icon">
                                        <CheckCircle size={32} />
                                    </div>
                                    <div className="stat-info">
                                        <p className="stat-label">Approved</p>
                                        <h3 className="stat-value">342</h3>
                                        <span className="stat-change positive">+8% this month</span>
                                    </div>
                                </div>
                                <div className="stat-card purple">
                                    <div className="stat-icon">
                                        <MessageSquare size={32} />
                                    </div>
                                    <div className="stat-info">
                                        <p className="stat-label">Inquiries</p>
                                        <h3 className="stat-value">1,285</h3>
                                        <span className="stat-change positive">+15% this month</span>
                                    </div>
                                </div>
                                <div className="stat-card orange">
                                    <div className="stat-icon">
                                        <Calendar size={32} />
                                    </div>
                                    <div className="stat-info">
                                        <p className="stat-label">Profile Visits</p>
                                        <h3 className="stat-value">8,432</h3>
                                        <span className="stat-change positive">+22% this month</span>
                                    </div>
                                </div>
                            </div>

                            {/* Charts */}
                            <div className="charts-section">
                                <div className="chart-card">
                                    <h3>Enrollment Trends</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart data={enrollmentData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="admissions" stroke="#66a1be" strokeWidth={3} />
                                            <Line type="monotone" dataKey="inquiries" stroke="#a78bfa" strokeWidth={3} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'prospectus' && (
                        <motion.div
                            className="prospectus-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="form-header-simple">
                                <h2>School Prospectus</h2>
                                <p className="form-subtitle">Manage your school's information and documentation</p>
                            </div>

                            <div className="form-section">
                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>School Name</label>
                                        <input type="text" placeholder="Enter school name" defaultValue="Greenfield International School" className="form-input" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>About School</label>
                                        <textarea rows="5" placeholder="Enter school description" defaultValue="Leading educational institution..." className="form-input"></textarea>
                                    </div>
                                </div>

                                <div className="form-row two-columns">
                                    <div className="form-group">
                                        <label>Board Type</label>
                                        <select className="form-input">
                                            <option>Cambridge</option>
                                            <option>CBSE</option>
                                            <option>ICSE</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Total Students</label>
                                        <input type="number" defaultValue="850" className="form-input" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Admission Status</label>
                                        <select className="form-input">
                                            <option value="open">Open</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label>Upload Prospectus File</label>
                                        <div className="file-upload">
                                            <Upload size={32} />
                                            <p>Click to upload or drag and drop</p>
                                            <span>PDF, DOCX (MAX. 5MB)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button className="btn btn-secondary">Cancel</button>
                                    <button className="btn btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'fees' && (
                        <motion.div
                            className="fees-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2>Fee Structure Management</h2>
                            <div className="fees-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Class</th>
                                            <th>Tuition Fee</th>
                                            <th>Admission Fee</th>
                                            <th>Annual Fee</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Class 1-5</td>
                                            <td><input type="number" defaultValue="20000" /></td>
                                            <td><input type="number" defaultValue="5000" /></td>
                                            <td><input type="number" defaultValue="25000" /></td>
                                            <td><button className="btn-save">Save</button></td>
                                        </tr>
                                        <tr>
                                            <td>Class 6-8</td>
                                            <td><input type="number" defaultValue="25000" /></td>
                                            <td><input type="number" defaultValue="5000" /></td>
                                            <td><input type="number" defaultValue="30000" /></td>
                                            <td><button className="btn-save">Save</button></td>
                                        </tr>
                                        <tr>
                                            <td>Class 9-10</td>
                                            <td><input type="number" defaultValue="30000" /></td>
                                            <td><input type="number" defaultValue="5000" /></td>
                                            <td><input type="number" defaultValue="35000" /></td>
                                            <td><button className="btn-save">Save</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'communication' && (
                        <motion.div
                            className="communication-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2>Parent Messages</h2>
                            <div className="messages-list">
                                {messages.map(message => (
                                    <div key={message.id} className={`message-item ${message.unread ? 'unread' : ''}`}>
                                        <div className="message-avatar">
                                            {message.from.charAt(0)}
                                        </div>
                                        <div className="message-content">
                                            <div className="message-header">
                                                <h4>{message.from}</h4>
                                                <span className="message-time">{message.time}</span>
                                            </div>
                                            <p className="message-subject">{message.subject}</p>
                                        </div>
                                        {message.unread && <div className="unread-indicator"></div>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'vendors' && (
                        <motion.div
                            className="vendors-content"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h2>Vendor Partnership</h2>
                            <p className="section-desc">Connect with verified vendors for uniforms, books, and stationery</p>
                            <div className="vendor-grid">
                                {[
                                    { name: "UniForm Pro", category: "Uniforms", status: "Active" },
                                    { name: "BookMart", category: "Books", status: "Active" },
                                    { name: "Stationary Plus", category: "Stationery", status: "Pending" }
                                ].map((vendor, idx) => (
                                    <div key={idx} className="vendor-card">
                                        <h4>{vendor.name}</h4>
                                        <p>{vendor.category}</p>
                                        <span className={`vendor-status ${vendor.status.toLowerCase()}`}>{vendor.status}</span>
                                        <button className="btn-secondary">View Details</button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default ManageEnrollment;
