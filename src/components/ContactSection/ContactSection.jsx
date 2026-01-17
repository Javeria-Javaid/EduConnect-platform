import React, { useState } from 'react';
// 💡 Corrected imports to include Lucide social icons
import { Mail, Phone, MapPin, Send, Linkedin, Twitter } from 'lucide-react';
import './ContactSection.css';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');
        try {
            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setStatus('success');
                alert("Thank you for your message! We will get back to you shortly.");
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
                alert(data.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
            alert("Network error. Please try again.");
        } finally {
            setStatus('');
        }
    };

    // The component structure is enclosed in a single return statement
    return (
        <section id="contact" className="contact-section">
            <div className="contact-container">

                <div className="contact-header">
                    <p className="section-subheading">Get in Touch</p>
                    <h2 className="section-heading">
                        We're here to <span className="highlight-text">answer your questions.</span>
                    </h2>
                </div>

                <div className="contact-content-grid">

                    {/* Left Column: Contact Details */}
                    <div className="contact-details">
                        <p className="details-intro">
                            Whether you have questions about admissions, job postings, or platform integration, our team is ready to assist you.
                        </p>

                        <div className="detail-item">
                            <Mail size={20} className="detail-icon" />
                            <a href="mailto:support@educonnect.com">support@educonnect.com</a>
                        </div>

                        <div className="detail-item">
                            <Phone size={20} className="detail-icon" />
                            <a href="tel:+15551234567">+1 (555) 123-4567</a>
                        </div>

                        <div className="detail-item">
                            <MapPin size={20} className="detail-icon" />
                            <p>123 EduConnect Plaza, Suite 400, Knowledge City, Global</p>
                        </div>

                        {/* ✅ Corrected Social Media Links using Lucide components */}
                        <div className="social-links">
                            <a href="#!" aria-label="LinkedIn" className="social-icon-link">
                                <Linkedin size={24} />
                            </a>
                            <a href="#!" aria-label="Twitter" className="social-icon-link">
                                <Twitter size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="contact-form-wrapper">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleChange}
                                rows="5"
                                required
                            ></textarea>
                            <button type="submit" className="submit-button">
                                Send Message <Send size={18} style={{ marginLeft: '10px' }} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ContactSection;