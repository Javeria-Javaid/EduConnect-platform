import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, DollarSign, Clock, GraduationCap, TrendingUp, Package, ShoppingCart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import './CareerOpportunities.css';

const CareerOpportunities = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('jobs'); // 'jobs' or 'vendors'
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [salaryRange, setSalaryRange] = useState([20000, 100000]);

    // Prevent auto-scroll on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
    }, []);

    // Teacher Job Listings
    const jobListings = [
        {
            id: 1,
            school: "Greenfield International School",
            position: "Mathematics Teacher",
            subject: "Mathematics",
            experience: "3-5 years",
            salary: [40000, 60000],
            status: "open",
            type: "Full-time",
            location: "Model Town",
            distance: 3.2,
            requirements: ["B.Ed", "M.Sc Mathematics", "3+ years experience"]
        },
        {
            id: 2,
            school: "City Public School",
            position: "Science Teacher",
            subject: "Science",
            experience: "2-4 years",
            salary: [35000, 50000],
            status: "open",
            type: "Full-time",
            location: "Garden Town",
            distance: 5.1,
            requirements: ["B.Ed", "M.Sc Physics/Chemistry", "Good communication"]
        },
        {
            id: 3,
            school: "Sunrise Academy",
            position: "English Teacher",
            subject: "English",
            experience: "1-3 years",
            salary: [30000, 45000],
            status: "open",
            type: "Part-time",
            location: "Johar Town",
            distance: 2.8,
            requirements: ["B.Ed", "MA English", "Fluent English"]
        },
        {
            id: 4,
            school: "Modern High School",
            position: "Computer Science Teacher",
            subject: "Computer",
            experience: "2-5 years",
            salary: [45000, 70000],
            status: "open",
            type: "Full-time",
            location: "DHA Phase 5",
            distance: 6.5,
            requirements: ["B.Ed", "M.Sc CS", "Programming knowledge"]
        }
    ];

    // Vendor Listings
    const vendors = [
        {
            id: 1,
            name: "UniForm Pro",
            category: "Uniforms",
            rating: 4.8,
            items: [
                { name: "School Shirt", price: 800, stock: "In Stock" },
                { name: "School Pants", price: 1200, stock: "In Stock" },
                { name: "School Tie", price: 300, stock: "Limited" }
            ]
        },
        {
            id: 2,
            name: "BookMart",
            category: "Books",
            rating: 4.6,
            items: [
                { name: "Mathematics Textbook", price: 450, stock: "In Stock" },
                { name: "Science Workbook", price: 380, stock: "In Stock" },
                { name: "English Literature", price: 520, stock: "In Stock" }
            ]
        },
        {
            id: 3,
            name: "Stationary Plus",
            category: "Stationery",
            rating: 4.7,
            items: [
                { name: "Geometry Box", price: 250, stock: "In Stock" },
                { name: "Art Supplies Set", price: 850, stock: "Limited" },
                { name: "Notebook Bundle", price: 400, stock: "In Stock" }
            ]
        }
    ];

    const filteredJobs = selectedSubject === 'all'
        ? jobListings
        : jobListings.filter(job => job.subject === selectedSubject);

    return (
        <div className="career-opportunities-page">
            {/* Header */}
            <div className="career-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
                <h1>Career Opportunities & Vendor Services</h1>
                <p>Find your next teaching role or discover trusted school vendors</p>
            </div>

            {/* Section Tabs */}
            <div className="section-tabs">
                <button
                    className={`tab-button ${activeSection === 'jobs' ? 'active' : ''}`}
                    onClick={() => setActiveSection('jobs')}
                >
                    <Briefcase size={20} />
                    Teaching Jobs
                </button>
                <button
                    className={`tab-button ${activeSection === 'vendors' ? 'active' : ''}`}
                    onClick={() => setActiveSection('vendors')}
                >
                    <Package size={20} />
                    Vendor Marketplace
                </button>
            </div>

            <div className="career-container">
                {activeSection === 'jobs' && (
                    <>
                        {/* Filters */}
                        <aside className="career-sidebar">
                            <div className="filter-section">
                                <h3>Filters</h3>

                                <div className="filter-group">
                                    <label>Subject</label>
                                    <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                                        <option value="all">All Subjects</option>
                                        <option value="Mathematics">Mathematics</option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                        <option value="Computer">Computer Science</option>
                                    </select>
                                </div>

                                <div className="filter-group">
                                    <label>Salary Range: ₹{salaryRange[0].toLocaleString()} - ₹{salaryRange[1].toLocaleString()}</label>
                                    <div className="range-inputs">
                                        <input
                                            type="number"
                                            value={salaryRange[0]}
                                            onChange={(e) => setSalaryRange([parseInt(e.target.value), salaryRange[1]])}
                                            placeholder="Min"
                                        />
                                        <span>to</span>
                                        <input
                                            type="number"
                                            value={salaryRange[1]}
                                            onChange={(e) => setSalaryRange([salaryRange[0], parseInt(e.target.value)])}
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <label>Experience Level</label>
                                    <div className="checkbox-group">
                                        <label><input type="checkbox" /> Entry (0-2 years)</label>
                                        <label><input type="checkbox" /> Mid (2-5 years)</label>
                                        <label><input type="checkbox" /> Senior (5+ years)</label>
                                    </div>
                                </div>

                                <div className="filter-group">
                                    <label>Job Type</label>
                                    <div className="checkbox-group">
                                        <label><input type="checkbox" /> Full-time</label>
                                        <label><input type="checkbox" /> Part-time</label>
                                        <label><input type="checkbox" /> Contract</label>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Job Listings */}
                        <main className="career-main">
                            {/* Interactive Map */}
                            <motion.div
                                className="job-map"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                <div className="map-placeholder">
                                    <h3>Job Opportunities Map</h3>
                                    <p>{filteredJobs.length} vacancies available</p>
                                    {filteredJobs.map((job, idx) => (
                                        <div
                                            key={job.id}
                                            className="job-pin"
                                            style={{
                                                left: `${15 + idx * 20}%`,
                                                top: `${40 + (idx % 2) * 25}%`
                                            }}
                                            title={job.school}
                                        >
                                            <MapPin size={28} className="pin-vacancy" />
                                        </div>
                                    ))}
                                </div>
                                <div className="map-legend">
                                    <div className="legend-item">
                                        <MapPin size={16} className="pin-vacancy" />
                                        <span>Job Vacancy</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Job Cards */}
                            <div className="jobs-grid">
                                <h2>Available Positions ({filteredJobs.length})</h2>
                                <div className="job-cards">
                                    {filteredJobs.map((job, idx) => (
                                        <motion.div
                                            key={job.id}
                                            className="job-card"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                        >
                                            <div className="job-header">
                                                <div>
                                                    <h3>{job.position}</h3>
                                                    <p className="school-name">{job.school}</p>
                                                </div>
                                                <span className={`job-status ${job.status}`}>
                                                    {job.status === 'open' ? '✓ Active' : 'Closed'}
                                                </span>
                                            </div>

                                            <div className="job-details">
                                                <div className="detail-item">
                                                    <DollarSign size={16} />
                                                    <span>₹{job.salary[0].toLocaleString()} - ₹{job.salary[1].toLocaleString()}/month</span>
                                                </div>
                                                <div className="detail-item">
                                                    <Clock size={16} />
                                                    <span>{job.type}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <GraduationCap size={16} />
                                                    <span>{job.experience}</span>
                                                </div>
                                                <div className="detail-item">
                                                    <MapPin size={16} />
                                                    <span>{job.location} ({job.distance} km)</span>
                                                </div>
                                            </div>

                                            <div className="requirements">
                                                <h4>Requirements:</h4>
                                                <ul>
                                                    {job.requirements.map((req, i) => (
                                                        <li key={i}>{req}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <button className="btn-apply">
                                                Apply with Profile
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </main>
                    </>
                )}

                {activeSection === 'vendors' && (
                    <div className="vendors-section">
                        <h2>Trusted School Vendors</h2>
                        <p className="section-desc">Compare prices and find the best deals on school supplies</p>

                        <div className="vendors-grid">
                            {vendors.map((vendor, idx) => (
                                <motion.div
                                    key={vendor.id}
                                    className="vendor-card"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="vendor-header">
                                        <div>
                                            <h3>{vendor.name}</h3>
                                            <span className="vendor-category">{vendor.category}</span>
                                        </div>
                                        <div className="vendor-rating">
                                            <Star size={16} className="star-filled" />
                                            <span>{vendor.rating}</span>
                                        </div>
                                    </div>

                                    <div className="vendor-items">
                                        <h4>Popular Items:</h4>
                                        {vendor.items.map((item, i) => (
                                            <div key={i} className="item-row">
                                                <div className="item-info">
                                                    <p>{item.name}</p>
                                                    <span className={`stock-status ${item.stock.toLowerCase().replace(' ', '-')}`}>
                                                        {item.stock}
                                                    </span>
                                                </div>
                                                <p className="item-price">₹{item.price}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="btn-view-vendor">
                                        <ShoppingCart size={16} />
                                        View All Items
                                    </button>
                                </motion.div>
                            ))}
                        </div>

                        {/* Price Comparison */}
                        <div className="price-comparison">
                            <h3>Price Comparison Tool</h3>
                            <p>Compare prices across vendors for the same items</p>
                            <div className="comparison-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>UniForm Pro</th>
                                            <th>BookMart</th>
                                            <th>Stationary Plus</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>School Shirt</td>
                                            <td className="price-cell">₹800</td>
                                            <td className="price-cell">-</td>
                                            <td className="price-cell">-</td>
                                        </tr>
                                        <tr>
                                            <td>Geometry Box</td>
                                            <td className="price-cell">-</td>
                                            <td className="price-cell">-</td>
                                            <td className="price-cell best-price">₹250</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default CareerOpportunities;
