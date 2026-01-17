import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  School,
  Store,
  Users,
  GraduationCap,
  FileText,
  Briefcase,
  BarChart3,
  HeadphonesIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardSidebar.css';

const DashboardSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', end: true },
    { icon: School, label: 'Schools', path: '/dashboard/schools' },
    { icon: Store, label: 'Vendors', path: '/dashboard/vendors' },
    { icon: Users, label: 'Parents & Students', path: '/dashboard/users' },
    { icon: GraduationCap, label: 'Teachers', path: '/dashboard/teachers' },
    { icon: FileText, label: 'Admissions', path: '/dashboard/admissions' },
    { icon: Briefcase, label: 'Job Posts', path: '/dashboard/jobs' },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/dashboard/reports' },
    { icon: HeadphonesIcon, label: 'Support & Tickets', path: '/dashboard/support' },
    { icon: Settings, label: 'System Settings', path: '/dashboard/settings' },
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

export default DashboardSidebar;
