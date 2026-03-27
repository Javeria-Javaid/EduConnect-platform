import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, User, Menu, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import './DashboardHeader.css';

const DashboardHeader = ({ toggleSidebar, isMobile }) => {
    const { user, role } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/unread-count`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUnreadCount(data.unreadCount);
            }
        } catch (error) {
            console.error('Failed to fetch unread count', error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
        // Refresh count every 30 seconds as a fallback
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const displayName = user ? `${user.firstName} ${user.lastName}` : 'User';
    const displayRole = role === 'school_admin' ? 'School Administrator' :
        role === 'admin' ? 'Super Admin' :
            role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Guest';

    const navigate = useNavigate();
    
    const handleProfileClick = () => {
        if (role === 'admin') navigate('/dashboard/settings');
        else if (role === 'school_admin') navigate('/school/dashboard/settings');
        else if (role === 'teacher') navigate('/teacher/dashboard/settings');
        else if (role === 'parent') navigate('/parent/dashboard/settings');
        else if (role === 'vendor') navigate('/vendor/dashboard/profile');
    };

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
                <button className="icon-btn message-btn">
                    <MessageSquare size={20} />
                    {unreadCount > 0 && (
                        <span className="notification-badge message-badge">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
                <button className="icon-btn notification-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>
                <div className="profile-dropdown" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                    <div className="profile-info">
                        <span className="profile-name">{displayName}</span>
                        <span className="profile-role">{displayRole}</span>
                    </div>
                    <div className="profile-avatar">
                        {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt="Profile" className="header-avatar-img" />
                        ) : (
                            <User size={20} />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;
