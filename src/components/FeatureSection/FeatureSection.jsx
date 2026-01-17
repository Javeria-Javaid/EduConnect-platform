import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Layers, Zap } from 'lucide-react';
import './FeatureSection.css';

// Data for the Feature Cards (4 primary features)
const featuresData = [
    {
        icon: Award,
        title: "Simplified Admissions",
        description: "A unified portal streamlines applications, tracking, and communication across all institutions.",
        color: "#f3e8ff" // Light Purple
    },
    {
        icon: Users,
        title: "Community & Collaboration",
        description: "Connect instantly with educators, parents, and vendors in a dedicated, secure network.",
        color: "#dcfce7" // Light Green
    },
    {
        icon: Layers,
        title: "Vendor Ecosystem",
        description: "Access a curated marketplace of trusted service providers for all educational needs.",
        color: "#fef2f2" // Light Pink/Red
    },
    {
        icon: Zap,
        title: "Real-time Notifications",
        description: "Get immediate alerts for admission status, job postings, and critical updates.",
        color: "#eff6ff" // Very Light Blue
    }
];

const FeatureSection = () => {
    return (
        <section id="features" className="features-section">
            <div className="features-container">

                {/* Left Column: Heading & Description */}
                <div className="features-header-content">
                    <p className="section-subheading">Why EduConnect?</p>
                    <h2 className="section-heading">
                        All the tools you need for a <span className="highlight-text">smarter educational journey.</span>
                    </h2>
                    <p className="section-description">
                        EduConnect breaks down the traditional silos in education by offering a single, powerful platform where all stakeholders—from schools and parents to teachers and vendors—can interact, manage, and succeed.
                    </p>
                    <button className="cta-button">
                        Start Exploring
                    </button>
                </div>

                {/* Right Column: Feature Cards Grid */}
                <div className="features-grid">
                    {featuresData.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            style={{ backgroundColor: feature.color }}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ 
                                duration: 0.6, 
                                delay: index * 0.15,
                                ease: [0.4, 0, 0.2, 1]
                            }}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.3 }
                            }}
                        >
                            <div className="icon-wrapper">
                                <feature.icon size={40} className="feature-icon" />
                            </div>
                            <h3 className="card-title">{feature.title}</h3>
                            <p className="card-description">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default FeatureSection;