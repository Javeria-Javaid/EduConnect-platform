import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Download, Upload, CheckCircle, School, DollarSign, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer/Footer';
import { toast } from 'sonner';
import './DiscoverSchools.css';

const DiscoverSchools = () => {
    const navigate = useNavigate();
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [distance, setDistance] = useState(10);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const fetchSchools = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/schools`);
            const data = await res.json();
            if (res.ok) setSchools(data);
        } catch (error) {
            toast.error('Error fetching schools');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
        window.scrollTo(0, 0);
    }, []);

    const handleApplySubmit = async (e) => {
        e.preventDefault();
        const form = e.target.closest('form') || document.querySelector('.discover-application-modal form');
        const formData = {
            applicantName: document.getElementById('studentName')?.value,
            grade: document.getElementById('studentGrade')?.value,
            parentName: document.getElementById('parentName')?.value,
            parentEmail: document.getElementById('parentEmail')?.value,
            documents: ['Online Application']
        };

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                toast.success('Application submitted successfully!');
                setShowApplicationForm(false);
            } else {
                toast.error('Submission failed');
            }
        } catch (error) {
            toast.error('Network error');
        }
    };

    return (
        <div className="discover-schools-layout">
            <div className="discover-header">
                <button className="back-button" onClick={() => navigate('/')}>← Back to Home</button>
                <h1>Discover Schools Near You</h1>
                <p>Find the perfect school for your child with our smart search</p>
            </div>

            <div className="discover-container">
                <aside className="filters-sidebar">
                    <div className="filter-section">
                        <div className="filter-header"><Filter size={20} /> <h3>Filters</h3></div>
                        <div className="filter-group">
                            <label>Distance: {distance} km</label>
                            <input type="range" min="1" max="20" value={distance} onChange={(e) => setDistance(parseInt(e.target.value))} />
                        </div>
                    </div>
                </aside>

                <div className="discover-main">
                    {loading ? (
                        <div className="loading-state">Loading schools...</div>
                    ) : (
                        <div className="schools-results">
                            <h2>Search Results ({schools.length})</h2>
                            <div className="discover-schools-grid">
                                {schools.map((school, idx) => (
                                    <motion.div key={school._id || idx} className="school-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
                                        <div className="school-image">
                                            <img 
                                                src={school.banner || school.logo || `https://images.unsplash.com/photo-152305085306e-8c3339709b66?auto=format&fit=crop&q=80&w=400&h=250`} 
                                                alt={school.name}
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=400&h=250'; }}
                                            />
                                            <span className="admission-badge open">✓ Admissions Open</span>
                                        </div>
                                        <div className="school-info">
                                            <h3>{school.name}</h3>
                                            <div className="school-meta">
                                                <span className="board-tag">{school.type}</span>
                                                <span className="distance-tag">📍 {school.location}</span>
                                            </div>
                                            <div className="school-stats">
                                                <div className="stat"><Star size={16} className="star-filled" /> <span>4.5</span></div>
                                                <div className="stat"><Users size={16} /> <span>{school.contactEmail}</span></div>
                                            </div>
                                            <div className="card-actions">
                                                <button className="discover-btn-primary" onClick={() => { setSelectedSchool(school); setShowApplicationForm(true); setCurrentStep(1); }}>
                                                    Apply Now
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                                {schools.length === 0 && <p>No schools found in the registry.</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {showApplicationForm && selectedSchool && (
                <div className="discover-modal-overlay" onClick={() => setShowApplicationForm(false)}>
                    <motion.div className="discover-application-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={(e) => e.stopPropagation()}>
                        <div className="discover-modal-header">
                            <h2>Apply to {selectedSchool.name}</h2>
                            <button className="close-btn" onClick={() => setShowApplicationForm(false)}>×</button>
                        </div>
                        <div className="discover-modal-content">
                            {currentStep === 1 ? (
                                <div className="form-step">
                                    <h3>Information</h3>
                                    <div className="discover-form-grid">
                                        <input type="text" id="studentName" placeholder="Student Full Name" required />
                                        <input type="text" id="studentGrade" placeholder="Class/Grade" required />
                                        <input type="text" id="parentName" placeholder="Parent Name" required />
                                        <input type="email" id="parentEmail" placeholder="Parent Email" required />
                                    </div>
                                </div>
                            ) : (
                                <div className="form-step">
                                    <h3>Ready to Submit</h3>
                                    <p>Please confirm all details are correct for {selectedSchool.name}.</p>
                                </div>
                            )}
                        </div>
                        <div className="discover-modal-actions">
                            {currentStep === 1 ? (
                                <button className="discover-btn-primary" onClick={() => setCurrentStep(2)}>Next</button>
                            ) : (
                                <button className="discover-btn-primary" onClick={handleApplySubmit}>Submit Application</button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default DiscoverSchools;
