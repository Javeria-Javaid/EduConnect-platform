import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import ParentDashboardSidebar from './ParentDashboardSidebar.jsx';
import DashboardHeader from './DashboardHeader.jsx';
import './DashboardLayout.css';

const ParentDashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="dashboard-container">
            <ParentDashboardSidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
            />
            <div className={`dashboard-main ${sidebarOpen && !isMobile ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
                <DashboardHeader toggleSidebar={toggleSidebar} isMobile={isMobile} />
                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
            )}
        </div>
    );
};

export default ParentDashboardLayout;

