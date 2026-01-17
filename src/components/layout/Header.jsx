import { useState } from 'react';
import { Search, Bell, Settings, Menu } from 'lucide-react';
import { Badge } from '../ui/badge.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import './Header.css';

export default function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const { user } = useAuth();

  const notifications = [
    { id: 1, type: 'school', message: 'New school registration pending approval', time: '5m ago', unread: true },
    { id: 2, type: 'vendor', message: 'Vendor "TechBooks Inc" submitted documents', time: '1h ago', unread: true },
    { id: 3, type: 'user', message: '3 new user registrations', time: '2h ago', unread: false },
    { id: 4, type: 'ticket', message: 'Support ticket #1234 requires attention', time: '3h ago', unread: true },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Mobile Menu Button */}
        <button 
          className="header-mobile-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="header-search">
          <div className="header-search-wrapper">
            <Search className="header-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search schools, vendors, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="header-search-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="header-actions">
          {/* Notifications */}
          <div className="header-notification-wrapper">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="header-action-btn"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="header-notification-badge">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="header-notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <Badge variant="secondary">{unreadCount} new</Badge>
                </div>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${notification.unread ? 'unread' : ''}`}
                    >
                      <p className="notification-message">{notification.message}</p>
                      <p className="notification-time">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="notification-footer">
                  <button className="notification-view-all">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="header-action-btn" aria-label="Settings">
            <Settings size={20} />
          </button>

          {/* User Avatar */}
          {user && (
            <div className="header-user-avatar">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
