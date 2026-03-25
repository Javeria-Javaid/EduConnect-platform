import React from 'react';
import { Plus } from 'lucide-react';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, actionLabel, onAction, icon: Icon = Plus, secondaryActionLabel, onSecondaryAction, secondaryIcon: SecondaryIcon, children }) => {
    return (
        <div className="page-header">
            <div className="header-content">
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            <div className="header-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {secondaryActionLabel && onSecondaryAction && (
                    <button className="secondary-action-btn btn secondary" onClick={onSecondaryAction} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {SecondaryIcon && <SecondaryIcon size={18} />}
                        {secondaryActionLabel}
                    </button>
                )}
                {actionLabel && onAction && (
                    <button className="primary-action-btn btn primary" onClick={onAction} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon size={18} />
                        {actionLabel}
                    </button>
                )}
                {children}
            </div>
        </div>
    );
};

export default PageHeader;
