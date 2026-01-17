import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Package,
  ShoppingCart,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './DashboardSidebar.css';

const VendorDashboardSidebar = ({ isOpen, toggleSidebar, isMobile }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/vendor/dashboard', end: true },
    { icon: Store, label: 'Profile', path: '/vendor/dashboard/profile' },
    { icon: ShoppingCart, label: 'Orders & Services', path: '/vendor/dashboard/orders' },
    { icon: Package, label: 'Inventory', path: '/vendor/dashboard/inventory' },
    { icon: DollarSign, label: 'Billing & Payments', path: '/vendor/dashboard/billing' },
    { icon: MessageSquare, label: 'Communication', path: '/vendor/dashboard/communication' },
    { icon: BarChart3, label: 'Reports', path: '/vendor/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/vendor/dashboard/settings' },
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

export default VendorDashboardSidebar;

