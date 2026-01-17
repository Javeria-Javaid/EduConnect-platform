import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import TeacherDashboardSidebar from './TeacherDashboardSidebar.jsx';
import DashboardHeader from './DashboardHeader.jsx'; // Reusing existing header
import './DashboardLayout.css'; // Reusing existing CSS

const TeacherDashboardLayout = () => {
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
            <TeacherDashboardSidebar
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

export default TeacherDashboardLayout;
