import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Filter, Download, Upload, CheckCircle, School, DollarSign, Users, Star, Bus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DiscoverSchools.css';

const DiscoverSchools = () => {
    const navigate = useNavigate();
    const [distance, setDistance] = useState(6);
    const [selectedBoard, setSelectedBoard] = useState('all');
    const [feeRange, setFeeRange] = useState([0, 50000]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    // Mock school data
    const schools = [
        {
            id: 1,
            name: "Greenfield International School",
            status: "open",
            board: "Cambridge",
            fees: 25000,
            distance: 3.2,
            rating: 4.8,
            students: 850,
            facilities: ["Lab", "Library", "Sports Complex", "Smart Classes"],
            transport: true,
            image: "/api/placeholder/400/250"
        },
        {
            id: 2,
            name: "City Public School",
            status: "closed",
            board: "CBSE",
            fees: 15000,
            distance: 4.5,
            rating: 4.5,
            students: 1200,
            facilities: ["Computer Lab", "Library", "Playground"],
            transport: true,
            image: "/api/placeholder/400/250"
        },
        {
            id: 3,
            name: "Sunrise Academy",
            status: "open",
            board: "ICSE",
            fees: 30000,
            distance: 2.8,
            rating: 4.9,
            students: 650,
            facilities: ["Science Lab", "Music Room", "Art Studio", "Swimming Pool"],
            transport: true,
            image: "/api/placeholder/400/250"
        },
        {
            id: 4,
            name: "Modern High School",
            status: "open",
            board: "CBSE",
            fees: 18000,
            distance: 5.1,
            rating: 4.6,
            students: 980,
            facilities: ["Computer Lab", "Library", "Sports Ground"],
            transport: false,
            image: "/api/placeholder/400/250"
        }
    ];

    const filteredSchools = schools.filter(school => {
        if (selectedBoard !== 'all' && school.board !== selectedBoard) return false;
        if (school.distance > distance) return false;
        if (school.fees < feeRange[0] || school.fees > feeRange[1]) return false;
        return true;
    });

    const handleApplyNow = (school) => {
        setSelectedSchool(school);
        setShowApplicationForm(true);
        setCurrentStep(1);
    };

    return (
        <div className="discover-schools-page">
            {/* Header */}
            <div className="discover-header">
                <button className="back-button" onClick={() => navigate('/')}>
                    ← Back to Home
                </button>
                <h1>Discover Schools Near You</h1>
                <p>Find the perfect school for your child with our smart search</p>
            </div>

            <div className="discover-container">
                {/* Filters Sidebar */}
                <motion.aside
                    className="filters-sidebar"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="filter-section">
                        <div className="filter-header">
                            <Filter size={20} />
                            <h3>Filters</h3>
                        </div>

                        {/* Distance Filter */}
                        <div className="filter-group">
                            <label>Distance: {distance} km</label>
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={distance}
                                onChange={(e) => setDistance(parseInt(e.target.value))}
                                className="distance-slider"
                            />
                            <div className="slider-labels">
                                <span>1 km</span>
                                <span>20 km</span>
                            </div>
                        </div>

                        {/* Board Type */}
                        <div className="filter-group">
                            <label>Board Type</label>
                            <select value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)}>
                                <option value="all">All Boards</option>
                                <option value="CBSE">CBSE</option>
                                <option value="ICSE">ICSE</option>
                                <option value="Cambridge">Cambridge</option>
                                <option value="State Board">State Board</option>
                            </select>
                        </div>

                        {/* Fee Range */}
                        <div className="filter-group">
                            <label>Fee Range: ₹{feeRange[0].toLocaleString()} - ₹{feeRange[1].toLocaleString()}</label>
                            <div className="fee-range-inputs">
                                <input
                                    type="number"
                                    value={feeRange[0]}
                                    onChange={(e) => setFeeRange([parseInt(e.target.value), feeRange[1]])}
                                    placeholder="Min"
                                />
                                <span>to</span>
                                <input
                                    type="number"
                                    value={feeRange[1]}
                                    onChange={(e) => setFeeRange([feeRange[0], parseInt(e.target.value)])}
                                    placeholder="Max"
                                />
                            </div>
                        </div>

                        {/* Facilities */}
                        <div className="filter-group">
                            <label>Facilities</label>
                            <div className="facility-checks">
                                <label><input type="checkbox" /> Science Lab</label>
                                <label><input type="checkbox" /> Computer Lab</label>
                                <label><input type="checkbox" /> Library</label>
                                <label><input type="checkbox" /> Sports Complex</label>
                                <label><input type="checkbox" /> Transport</label>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <div className="discover-main">
                    {/* Map Section */}
                    <motion.div
                        className="map-section"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="map-placeholder">
                            <div className="map-overlay">
                                <h3>Interactive School Map</h3>
                                <p>{filteredSchools.length} schools found within {distance}km</p>
                            </div>
                            {/* School Pins */}
                            {filteredSchools.map((school, idx) => (
                                <div
                                    key={school.id}
                                    className={`map-pin ${school.status}`}
                                    style={{
                                        left: `${20 + idx * 18}%`,
                                        top: `${30 + (idx % 3) * 20}%`
                                    }}
                                    title={school.name}
                                >
                                    <MapPin
                                        size={32}
                                        className={school.status === 'open' ? 'pin-open' : 'pin-closed'}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="map-legend">
                            <div className="legend-item">
                                <MapPin size={16} className="pin-open" />
                                <span>Admissions Open</span>
                            </div>
                            <div className="legend-item">
                                <MapPin size={16} className="pin-closed" />
                                <span>Admissions Closed</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* School Results */}
                    <div className="schools-results">
                        <h2>Search Results ({filteredSchools.length})</h2>
                        <div className="schools-grid">
                            {filteredSchools.map((school, idx) => (
                                <motion.div
                                    key={school.id}
                                    className="school-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <div className="school-image">
                                        <img src={school.image} alt={school.name} />
                                        <span className={`admission-badge ${school.status}`}>
                                            {school.status === 'open' ? '✓ Admissions Open' : '✗ Admissions Closed'}
                                        </span>
                                    </div>
                                    <div className="school-info">
                                        <h3>{school.name}</h3>
                                        <div className="school-meta">
                                            <span className="board-tag">{school.board}</span>
                                            <span className="distance-tag">📍 {school.distance} km</span>
                                        </div>
                                        <div className="school-stats">
                                            <div className="stat">
                                                <Star size={16} className="star-filled" />
                                                <span>{school.rating}</span>
                                            </div>
                                            <div className="stat">
                                                <Users size={16} />
                                                <span>{school.students} students</span>
                                            </div>
                                            <div className="stat">
                                                <DollarSign size={16} />
                                                <span>₹{school.fees.toLocaleString()}/year</span>
                                            </div>
                                        </div>
                                        <div className="facilities-tags">
                                            {school.facilities.slice(0, 3).map(fac => (
                                                <span key={fac} className="facility-tag">{fac}</span>
                                            ))}
                                            {school.facilities.length > 3 && <span className="facility-tag">+{school.facilities.length - 3}</span>}
                                        </div>
                                        <div className="card-actions">
                                            <button className="btn-secondary" onClick={() => setSelectedSchool(school)}>
                                                <Download size={16} /> Download Prospectus
                                            </button>
                                            {school.status === 'open' && (
                                                <button className="btn-primary" onClick={() => handleApplyNow(school)}>
                                                    Apply Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Form Modal */}
            {showApplicationForm && selectedSchool && (
                <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}>
                    <motion.div
                        className="application-modal"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Apply to {selectedSchool.name}</h2>
                            <button className="close-btn" onClick={() => setShowApplicationForm(false)}>×</button>
                        </div>

                        {/* Stepper */}
                        <div className="stepper">
                            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                                <div className="step-number">1</div>
                                <span>Personal Info</span>
                            </div>
                            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                                <div className="step-number">2</div>
                                <span>Documents</span>
                            </div>
                            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
                                <div className="step-number">3</div>
                                <span>Review</span>
                            </div>
                        </div>

                        <div className="modal-content">
                            {currentStep === 1 && (
                                <div className="form-step">
                                    <h3>Student Information</h3>
                                    <div className="form-grid">
                                        <input type="text" placeholder="Student Full Name" />
                                        <input type="date" placeholder="Date of Birth" />
                                        <input type="text" placeholder="Parent/Guardian Name" />
                                        <input type="email" placeholder="Email Address" />
                                        <input type="tel" placeholder="Phone Number" />
                                        <select>
                                            <option>Select Grade</option>
                                            <option>Class 1</option>
                                            <option>Class 2</option>
                                            <option>Class 3</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="form-step">
                                    <h3>Upload Documents</h3>
                                    <div className="upload-section">
                                        <div className="upload-box">
                                            <Upload size={32} />
                                            <p>Birth Certificate</p>
                                            <button className="upload-btn">Choose File</button>
                                        </div>
                                        <div className="upload-box">
                                            <Upload size={32} />
                                            <p>Previous Result Card</p>
                                            <button className="upload-btn">Choose File</button>
                                        </div>
                                        <div className="upload-box">
                                            <Upload size={32} />
                                            <p>Address Proof</p>
                                            <button className="upload-btn">Choose File</button>
                                        </div>
                                        <div className="upload-box">
                                            <Upload size={32} />
                                            <p>Passport Photo</p>
                                            <button className="upload-btn">Choose File</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="form-step">
                                    <h3>Review & Submit</h3>
                                    <div className="review-section">
                                        <div className="review-item">
                                            <CheckCircle className="check-icon" />
                                            <span>Personal information completed</span>
                                        </div>
                                        <div className="review-item">
                                            <CheckCircle className="check-icon" />
                                            <span>All documents uploaded</span>
                                        </div>
                                        <div className="info-box">
                                            <p>You will receive an email and SMS notification with your application tracking ID.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            {currentStep > 1 && (
                                <button className="btn-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
                                    Previous
                                </button>
                            )}
                            {currentStep < 3 ? (
                                <button className="btn-primary" onClick={() => setCurrentStep(currentStep + 1)}>
                                    Next Step
                                </button>
                            ) : (
                                <button className="btn-primary" onClick={() => {
                                    alert('Application submitted successfully!');
                                    setShowApplicationForm(false);
                                }}>
                                    Submit Application
                                </button>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default DiscoverSchools;
