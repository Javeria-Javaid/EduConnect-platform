import React from 'react';
import { Plus } from 'lucide-react';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, actionLabel, onAction }) => {
    return (
        <div className="page-header">
            <div className="header-content">
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
            </div>
            {actionLabel && onAction && (
                <button className="primary-action-btn" onClick={onAction}>
                    <Plus size={18} />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default PageHeader;
