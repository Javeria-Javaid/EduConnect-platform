import React, { useState } from 'react';
import {
    Settings,
    Users,
    Bell,
    Link,
    Shield,
    CreditCard,
    Database,
    Menu
} from 'lucide-react';
import GeneralSettings from './settings/GeneralSettings';
import UsersRolesSettings from './settings/UsersRolesSettings';
import NotificationSettings from './settings/NotificationSettings';
import IntegrationSettings from './settings/IntegrationSettings';
import SecuritySettings from './settings/SecuritySettings';
import PaymentBillingSettings from './settings/PaymentBillingSettings';
import BackupRestoreSettings from './settings/BackupRestoreSettings';
import './settings/Settings.css';

const SchoolSettingsView = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'users', label: 'Users & Roles', icon: Users },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'integrations', label: 'Integrations', icon: Link },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'billing', label: 'Payment & Billing', icon: CreditCard },
        { id: 'backup', label: 'Backup & Restore', icon: Database },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return <GeneralSettings />;
            case 'users':
                return <UsersRolesSettings />;
            case 'notifications':
                return <NotificationSettings />;
            case 'integrations':
                return <IntegrationSettings />;
            case 'security':
                return <SecuritySettings />;
            case 'billing':
                return <PaymentBillingSettings />;
            case 'backup':
                return <BackupRestoreSettings />;
            default:
                return <GeneralSettings />;
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-wrapper">
                {/* Mobile Menu Toggle */}
                <div className="settings-mobile-toggle">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="settings-mobile-btn"
                    >
                        <Menu size={20} />
                        {isMobileMenuOpen ? 'Close Menu' : 'Settings Menu'}
                    </button>
                </div>

                <div className="settings-layout">
                    {/* Sidebar Navigation */}
                    <div className={`settings-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                        <div className="settings-sidebar-header">
                            <h2 className="settings-sidebar-title">Settings</h2>
                        </div>
                        <nav className="settings-nav">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`settings-nav-item ${isActive ? 'active' : ''}`}
                                    >
                                        <Icon className="settings-nav-icon" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="settings-content">
                        <div className="settings-content-wrapper">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolSettingsView;
