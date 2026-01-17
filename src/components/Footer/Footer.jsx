import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Copyright } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="site-footer">
            <div className="footer-container">

                {/* Column 1: Brand Info & Contact */}
                <div className="footer-column brand-info">
                    <div className="footer-logo">
                        {/* Replace this with your actual logo component or image */}
                        <span className="logo-text">EduConnect</span>
                    </div>
                    <p className="brand-slogan">
                        Connecting the entire educational ecosystem on one unified platform.
                    </p>

                    <div className="contact-info">
                        <div className="contact-item">
                            <Mail size={16} />
                            <a href="mailto:info@educonnect.com">info@educonnect.com</a>
                        </div>
                        <div className="contact-item">
                            <Phone size={16} />
                            <a href="tel:+15551234567">+1 (555) 123-4567</a>
                        </div>
                        <div className="contact-item">
                            <MapPin size={16} />
                            <span>Knowledge City, Global</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Quick Links (Navigation) */}
                <div className="footer-column quick-links">
                    <h4 className="footer-heading">Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#roles">Our Roles</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>

                {/* Column 3: Resources & Roles */}
                <div className="footer-column resources">
                    <h4 className="footer-heading">For Users</h4>
                    <ul>
                        <li><a href="#admissions">Students & Parents</a></li>
                        <li><a href="#institutions">Institutions</a></li>
                        <li><a href="#jobs">Educators & Vendors</a></li>
                        <li><a href="#support">Support Center</a></li>
                        <li><a href="#careers">Careers</a></li>
                    </ul>
                </div>

                {/* Column 4: Legal & Social */}
                <div className="footer-column legal-social">
                    <h4 className="footer-heading">Legal & Connect</h4>
                    <ul>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                        <li><a href="#sitemap">Sitemap</a></li>
                    </ul>

                    <div className="footer-social-links">
                        <a href="#!" aria-label="LinkedIn"><Linkedin size={24} /></a>
                        <a href="#!" aria-label="Twitter"><Twitter size={24} /></a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom-bar">
                <p className="copyright-text">
                    <Copyright size={14} />
                    {new Date().getFullYear()} EduConnect. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;