import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Clock, GraduationCap, Package, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import './CareerOpportunities.css';

const CareerOpportunities = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('jobs');
    const [jobs, setJobs] = useState([]);
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [jobsRes, vendorsRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/api/jobs`),
                fetch(`${import.meta.env.VITE_API_URL}/api/admin/users?role=vendor`)
            ]);
            
            if (jobsRes.ok) setJobs(await jobsRes.json());
            if (vendorsRes.ok) setVendors(await vendorsRes.json());
        } catch (error) {
            console.error('Error fetching career data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="career-opportunities-page">
            <div className="career-header">
                <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>
                <h1>Career Opportunities & Vendor Services</h1>
                <p>Find your next teaching role or discover trusted school vendors</p>
            </div>

            <div className="section-tabs">
                <button className={`tab-button ${activeSection === 'jobs' ? 'active' : ''}`} onClick={() => setActiveSection('jobs')}>
                    <Briefcase size={20} /> Teaching Jobs
                </button>
                <button className={`tab-button ${activeSection === 'vendors' ? 'active' : ''}`} onClick={() => setActiveSection('vendors')}>
                    <Package size={20} /> Vendor Marketplace
                </button>
            </div>

            <div className="career-container">
                {loading ? (
                    <div className="loading-state">Loading...</div>
                ) : activeSection === 'jobs' ? (
                    <main className="career-main">
                        <div className="jobs-grid">
                            <h2>Available Positions ({jobs.length})</h2>
                            <div className="job-cards">
                                {jobs.map((job, idx) => (
                                    <motion.div key={job._id || idx} className="job-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                        <div className="job-header">
                                            <div>
                                                <h3>{job.title}</h3>
                                                <p className="school-name">{job.department}</p>
                                            </div>
                                            <span className={`job-status ${job.status.toLowerCase()}`}>✓ {job.status}</span>
                                        </div>
                                        <div className="job-details">
                                            <div className="detail-item"><Clock size={16} /> <span>{job.type}</span></div>
                                            <div className="detail-item"><Calendar size={16} /> <span>Posted: {new Date(job.posted).toLocaleDateString()}</span></div>
                                        </div>
                                        <div className="requirements">
                                            <p>{job.description || 'No description provided.'}</p>
                                        </div>
                                        <button className="btn-apply" onClick={() => navigate('/login')}>Apply Now</button>
                                    </motion.div>
                                ))}
                                {jobs.length === 0 && <p>No job postings found.</p>}
                            </div>
                        </div>
                    </main>
                ) : (
                    <div className="vendors-section">
                        <h2>Trusted School Vendors</h2>
                        <div className="vendors-grid">
                            {vendors.map((vendor, idx) => (
                                <motion.div key={vendor._id || idx} className="vendor-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}>
                                    <div className="vendor-header">
                                        <div>
                                            <h3>{vendor.firstName} {vendor.lastName}</h3>
                                            <span className="vendor-category">Official Vendor</span>
                                        </div>
                                        <div className="vendor-rating"><Star size={16} className="star-filled" /> <span>4.5</span></div>
                                    </div>
                                    <button className="btn-view-vendor" onClick={() => navigate('/login')}><ShoppingCart size={16} /> View Profile</button>
                                </motion.div>
                            ))}
                            {vendors.length === 0 && <p>No vendors registered yet.</p>}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default CareerOpportunities;
