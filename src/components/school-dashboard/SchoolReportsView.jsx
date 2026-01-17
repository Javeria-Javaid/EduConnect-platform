import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    FileBarChart,
    DollarSign,
    Bus,
    Settings,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import ReportsOverview from './reports/ReportsOverview';
import StudentReports from './reports/StudentReports';
import TeacherReports from './reports/TeacherReports';
import AttendanceReports from './reports/AttendanceReports';
import AcademicReports from './reports/AcademicReports';
import FinanceReports from './reports/FinanceReports';
import TransportReports from './reports/TransportReports';
import CustomReports from './reports/CustomReports';
import './SchoolReportsView.css';

const SchoolReportsView = () => {
    const [activeView, setActiveView] = useState('overview');

    const reportTypes = [
        { id: 'students', label: 'Student Reports', icon: Users, description: 'Performance, behavior, and enrollment data' },
        { id: 'teachers', label: 'Teacher Reports', icon: GraduationCap, description: 'Workload, evaluations, and attendance' },
        { id: 'attendance', label: 'Attendance Logs', icon: Calendar, description: 'Daily logs and monthly summaries' },
        { id: 'academic', label: 'Academic Results', icon: FileBarChart, description: 'Exam scores and grade distributions' },
        { id: 'finance', label: 'Financial Reports', icon: DollarSign, description: 'Fee collection and expense tracking' },
        { id: 'transport', label: 'Transport Data', icon: Bus, description: 'Route status and vehicle logs' },
        { id: 'custom', label: 'Custom Builder', icon: Settings, description: 'Create and export custom reports' },
    ];

    const renderContent = () => {
        switch (activeView) {
            case 'overview':
                return (
                    <ReportsOverview
                        onNavigate={setActiveView}
                        reportTypes={reportTypes}
                    />
                );
            case 'students':
                return <StudentReports />;
            case 'teachers':
                return <TeacherReports />;
            case 'attendance':
                return <AttendanceReports />;
            case 'academic':
                return <AcademicReports />;
            case 'finance':
                return <FinanceReports />;
            case 'transport':
                return <TransportReports />;
            case 'custom':
                return <CustomReports />;
            default:
                return <ReportsOverview onNavigate={setActiveView} reportTypes={reportTypes} />;
        }
    };

    return (
        <div className="reports-container">
            {/* Header */}
            <div className="reports-header">
                <div className="header-left">
                    {activeView !== 'overview' && (
                        <button
                            onClick={() => setActiveView('overview')}
                            className="back-button"
                            title="Back to Overview"
                        >
                            <ArrowLeft style={{ width: '20px', height: '20px', color: '#64748b' }} />
                        </button>
                    )}
                    <div className="header-content">
                        <h1>
                            {activeView === 'overview' ? 'Reports Dashboard' : reportTypes.find(t => t.id === activeView)?.label}
                        </h1>
                        <p>
                            {activeView === 'overview'
                                ? 'Centralized analytics and reporting hub for your school'
                                : `Detailed ${activeView} analytics and export options`}
                        </p>
                    </div>
                </div>

                <div className="header-actions">
                    <button className="btn-secondary">
                        Export View
                    </button>
                    <button className="btn-primary">
                        Generate New Report
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="reports-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default SchoolReportsView;
