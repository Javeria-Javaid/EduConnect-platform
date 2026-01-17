import React from 'react';
import { BookOpen, Users, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './RoleSection.css';

// Data for the Three Main Roles
const rolesData = [
    {
        icon: BookOpen,
        title: "For Students & Parents",
        description: "Discover the ideal school, manage applications, track progress, and communicate securely with teachers.",
        bgColor: "#eff6ff", // Light Blue
        buttonText: "Find Admissions",
        path: "/discover-schools"
    },
    {
        icon: Users,
        title: "For Institutions (Schools)",
        description: "Streamline enrollment, manage staff and curriculum, and connect with a vetted network of educators and vendors.",
        bgColor: "#f3e8ff", // Light Purple
        buttonText: "Manage Enrollment",
        path: "/manage-enrollment"
    },
    {
        icon: Briefcase,
        title: "For Educators & Vendors",
        description: "Find your next teaching job, showcase services, and collaborate directly with schools and parents.",
        bgColor: "#dcfce7", // Light Green
        buttonText: "View Opportunities",
        path: "/career-opportunities"
    }
];

const RoleSection = () => {
    const navigate = useNavigate();

    return (
        <section id="roles" className="roles-section">
            <div className="roles-container">
                <div className="roles-header">
                    <p className="section-subheading">Who is EduConnect for?</p>
                    <h2 className="section-heading">
                        Tailored experiences for every <span className="highlight-text">educational stakeholder.</span>
                    </h2>
                </div>

                <div className="role-grid">
                    {rolesData.map((role, index) => (
                        <div
                            key={index}
                            className="role-card"
                            style={{ backgroundColor: role.bgColor }}
                        >
                            <div className="icon-wrapper">
                                <role.icon size={48} className="role-icon" />
                            </div>
                            <h3 className="role-title">{role.title}</h3>
                            <p className="role-description">{role.description}</p>
                            <button
                                className="role-cta-button"
                                onClick={() => navigate(role.path)}
                            >
                                {role.buttonText}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RoleSection;