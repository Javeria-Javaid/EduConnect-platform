import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  Book,
  FileSpreadsheet,
  Users,
  MessageSquare,
  Library,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardSidebar.css'; // Reusing the same CSS

const TeacherDashboardSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard', end: true },
    { icon: BookOpen, label: 'Classes', path: '/teacher/dashboard/classes' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/teacher/dashboard/attendance' },
    { icon: Book, label: 'Homework', path: '/teacher/dashboard/homework' },
    { icon: FileSpreadsheet, label: 'Exams', path: '/teacher/dashboard/exams' },
    { icon: Users, label: 'Students', path: '/teacher/dashboard/students' },
    { icon: MessageSquare, label: 'Communication', path: '/teacher/dashboard/communication' },
    { icon: Library, label: 'Resources', path: '/teacher/dashboard/resources' },
    { icon: BarChart3, label: 'Reports', path: '/teacher/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/teacher/dashboard/settings' },
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

export default TeacherDashboardSidebar;
