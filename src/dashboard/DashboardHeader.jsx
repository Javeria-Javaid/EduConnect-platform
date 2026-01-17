import React from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './DashboardHeader.css'; // Updated with ultra-specific selectors

const DashboardHeader = ({ toggleSidebar, isMobile }) => {
    const { user, role } = useAuth();

    // Derive display name from email or role since we don't have a name field yet
    const displayName = user?.email ? user.email.split('@')[0] : 'User';
    const displayRole = role === 'school_admin' ? 'School Administrator' :
        role === 'admin' ? 'Super Admin' :
            role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest';

    return (
        <header className="dashboard-header">
            <div className="header-left">
                {isMobile && (
                    <button className="menu-toggle-btn" onClick={toggleSidebar}>
                        <Menu size={24} />
                    </button>
                )}
                <div className="header-search-bar">
                    <Search size={18} className="search-icon" />
                    <input type="text" className="search-input" placeholder="Search students, teachers, etc..." />
                </div>
            </div>

            <div className="header-right">
                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>
                <div className="profile-dropdown">
                    <div className="profile-info">
                        <span className="profile-name">{displayName}</span>
                        <span className="profile-role">{displayRole}</span>
                    </div>
                    <div className="profile-avatar">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
