import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  ClipboardCheck,
  Book,
  FileSpreadsheet,
  DollarSign,
  Bus,
  MessageSquare,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardSidebar.css';

const ParentDashboardSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/parent/dashboard', end: true },
    { icon: User, label: 'Academic Profile', path: '/parent/dashboard/academic' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/parent/dashboard/attendance' },
    { icon: Book, label: 'Homework', path: '/parent/dashboard/homework' },
    { icon: FileSpreadsheet, label: 'Exams & Results', path: '/parent/dashboard/exams' },
    { icon: DollarSign, label: 'Fees & Payments', path: '/parent/dashboard/fees' },
    { icon: Bus, label: 'Transport', path: '/parent/dashboard/transport' },
    { icon: MessageSquare, label: 'Communication', path: '/parent/dashboard/communication' },
    { icon: Settings, label: 'Settings', path: '/parent/dashboard/settings' },
  ];

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : 'collapsed'} ${isMobile ? 'mobile' : ''}`}>
      <div className="sidebar-header">
        <div className="logo-area">
          {isOpen ? <span className="logo-text">EduConnect</span> : <span className="logo-text-collapsed">EC</span>}
        </div>
        {!isMobile && (
          <button className="collapse-btn" onClick={toggleSidebar}>
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        )}
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            title={!isOpen ? item.label : ''}
          >
            <item.icon size={20} className="nav-icon" />
            {isOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout} title={!isOpen ? 'Logout' : ''}>
          <LogOut size={20} className="nav-icon" />
          {isOpen && <span className="nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default ParentDashboardSidebar;

