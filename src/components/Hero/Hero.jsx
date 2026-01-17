import React from 'react';
import DecryptedText from '../DecryptedText/DecryptedText';
import './Hero.css';
import educonnectLogo from '../../assets/educonnectLogo/educonnect_logo.png';
import { motion } from 'framer-motion';
import { School, Briefcase, Globe, Link2, Users } from 'lucide-react';

const Hero = ({
    title,
    subtitle,
    background = "gradient",
    backgroundProps = {
        gradient: "linear-gradient(135deg, #1e293b 0%, #1e293b 100%)",
        color: "#1e293b"
    },
    primaryButton = {
        text: "Start Learning Free",
        onClick: () => console.log("Primary button clicked")
    },
    secondaryButton = {
        text: "Explore Courses",
        onClick: () => console.log("Secondary Courses clicked")
    },
    className = ""
}) => {

    const getBackgroundStyle = () => {
        switch (background) {
            case 'gradient':
                return { background: backgroundProps.gradient };
            case 'solid':
                return { backgroundColor: backgroundProps.color };
            case 'image':
                return {
                    backgroundImage: `url(${backgroundProps.imageUrl || ''})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                };
            default:
                return { background: backgroundProps.gradient };
        }
    };

    const features = [
        { name: "Schools & Admissions", icon: <School size={32} />, color: "#f0f9ff" },
        { name: "Jobs & Careers", icon: <Briefcase size={32} />, color: "#fef7cd" },
        { name: "Educational Services", icon: <Globe size={32} />, color: "#f3e8ff" },
        { name: "Unified Platform", icon: <Link2 size={32} />, color: "#dcfce7" },
        { name: "Parent & Teacher Connect", icon: <Users size={32} />, color: "#ffe4e6" }
    ];

    return (
        <section
            id="home"
            className={`hero-section ${className}`}
            style={getBackgroundStyle()}
        >
            <div className="hero-container">
                <motion.div
                    className="hero-content-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >

                    {/* Left Column */}
                    <div className="hero-text-content">
                        <h1 className="hero-title">
                            <DecryptedText
                                text={title}
                                animateOn="view"
                                sequential={true}
                                revealDirection="center"
                                speed={15}
                                className="hero-revealed-title"
                                encryptedClassName="hero-encrypted-char"
                            />
                        </h1>

                        <p className="hero-subtitle">
                            <DecryptedText
                                text={subtitle}
                                animateOn="view"
                                sequential={true}
                                revealDirection="start"
                                speed={8}
                                className="hero-revealed-subtitle"
                                encryptedClassName="hero-encrypted-char"
                            />
                        </p>

                        <div className="hero-buttons">
                            {primaryButton && (
                                <button className="btn primary" onClick={primaryButton.onClick}>
                                    {primaryButton.text}
                                </button>
                            )}
                            {secondaryButton && (
                                <button className="btn secondary" onClick={secondaryButton.onClick}>
                                    {secondaryButton.text}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Logo + Orbiting Features */}
                    <div className="hero-visual-content">
                        <div className="logo-feature-wrapper">
                            <img src={educonnectLogo} alt="EduConnect Portal Logo" className="hero-logo" />

                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="feature-circle"
                                    style={{ '--i': index, backgroundColor: feature.color }}
                                    title={feature.name}
                                >
                                    <div className="feature-icon-rotate">{feature.icon}</div>
                                </div>
                            ))}

                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
