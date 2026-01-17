import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './AboutSection.css';

// IMPORT ONLY ONE IMAGE - keeping the main dashboard visual
import admissionPortal2Img from '../../assets/admission_portal_2.png';

const AboutSection = ({
    subheading = "OUR STORY",
    heading = "ABOUT EDUCONNECT"
}) => {
    const [count, setCount] = useState(0);
    const statRef = useRef(null);
    const isStatInView = useInView(statRef, { once: true, margin: "-100px" });

    // Count-up animation for stat
    useEffect(() => {
        if (isStatInView) {
            let startValue = 0;
            const endValue = 30000;
            const duration = 2000; // 2 seconds
            const increment = endValue / (duration / 16); // 60fps

            const timer = setInterval(() => {
                startValue += increment;
                if (startValue >= endValue) {
                    setCount(endValue);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(startValue));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isStatInView]);

    return (
        <section id="about" className="about-section">
            <div className="about-container">
                {/* Left Column: Single Visual with Fade-in */}
                <motion.div
                    className="about-visuals"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                >
                    <div className="visual-card visual-card-main">
                        <img
                            src={admissionPortal2Img}
                            alt="Platform Dashboard showing unified education ecosystem"
                            className="about-image"
                        />
                    </div>
                </motion.div>

                {/* Right Column: Stat Headline & Story Content */}
                <div className="about-content">
                    {/* MASSIVE STAT HEADLINE */}
                    <div className="about-stat-headline" ref={statRef}>
                        <div className="stat-value-large">
                            {count.toLocaleString()}+
                        </div>
                        <div className="stat-micro-label">
                            Schools, parents, teachers, and vendors using EduConnect
                        </div>
                    </div>

                    <h3 className="about-subheading">{subheading}</h3>
                    <h2 className="about-heading">{heading}</h2>

                    {/* VISUAL STORY FORMAT */}
                    <div className="about-description-story">
                        <p className="story-opening">
                            EduConnect was built around a simple idea:
                        </p>
                        <p className="story-explanation">
                            Schools, parents, teachers, and vendors should find each other without the maze of visits and calls.
                        </p>
                        <p className="story-explanation">
                            Everything in one space — admissions, jobs, services, communication.
                        </p>
                        <p className="story-closing">
                            No replacement. Just smoother edges for everyone.
                        </p>
                    </div>

                    <button className="about-cta-button">
                        View Role-Based Dashboards
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;