import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCircle,
  BookOpen,
  FileSpreadsheet,
  Calendar,
  ClipboardCheck,
  FileText,
  DollarSign,
  Bus,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardSidebar.css'; // Reusing the same CSS

const SchoolDashboardSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/school/dashboard', end: true },
    { icon: Users, label: 'Students', path: '/school/dashboard/students' },
    { icon: GraduationCap, label: 'Teachers', path: '/school/dashboard/teachers' },
    { icon: UserCircle, label: 'Parents', path: '/school/dashboard/parents' },
    { icon: BookOpen, label: 'Classes', path: '/school/dashboard/classes' },
    { icon: FileSpreadsheet, label: 'Exams', path: '/school/dashboard/exams' },
    { icon: Calendar, label: 'Timetable', path: '/school/dashboard/timetable' },
    { icon: ClipboardCheck, label: 'Attendance', path: '/school/dashboard/attendance' },
    { icon: FileText, label: 'Admissions', path: '/school/dashboard/admissions' },
    { icon: DollarSign, label: 'Finance', path: '/school/dashboard/finance' },
    { icon: Bus, label: 'Transport', path: '/school/dashboard/transport' },
    { icon: BarChart3, label: 'Reports', path: '/school/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/school/dashboard/settings' },
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

export default SchoolDashboardSidebar;
