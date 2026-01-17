import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import './FilterPanel.css';

const FilterPanel = ({
    filters = [],
    onFilterChange,
    onClearAll,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [expandedSections, setExpandedSections] = useState(new Set());

    const handleFilterChange = (filterKey, value) => {
        const newFilters = { ...activeFilters };

        if (Array.isArray(newFilters[filterKey])) {
            const index = newFilters[filterKey].indexOf(value);
            if (index > -1) {
                newFilters[filterKey].splice(index, 1);
                if (newFilters[filterKey].length === 0) {
                    delete newFilters[filterKey];
                }
            } else {
                newFilters[filterKey].push(value);
            }
        } else {
            if (newFilters[filterKey] === value) {
                delete newFilters[filterKey];
            } else {
                newFilters[filterKey] = value;
            }
        }

        setActiveFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const handleClearAll = () => {
        setActiveFilters({});
        if (onClearAll) {
            onClearAll();
        }
        if (onFilterChange) {
            onFilterChange({});
        }
    };

    const toggleSection = (key) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedSections(newExpanded);
    };

    const getActiveFilterCount = () => {
        return Object.keys(activeFilters).reduce((count, key) => {
            const value = activeFilters[key];
            return count + (Array.isArray(value) ? value.length : 1);
        }, 0);
    };

    const activeCount = getActiveFilterCount();

    return (
        <div className={`filter-panel-container ${className}`}>
            <button
                className={`filter-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <Filter size={18} />
                <span>Filters</span>
                {activeCount > 0 && (
                    <span className="filter-badge">{activeCount}</span>
                )}
                <ChevronDown className={`chevron ${isOpen ? 'rotated' : ''}`} size={16} />
            </button>

            {isOpen && (
                <div className="filter-dropdown">
                    <div className="filter-header">
                        <span className="filter-title">Filter Options</span>
                        {activeCount > 0 && (
                            <button className="clear-all-btn" onClick={handleClearAll}>
                                Clear All
                            </button>
                        )}
                    </div>

                    <div className="filter-sections">
                        {filters.map((filter) => (
                            <div key={filter.key} className="filter-section">
                                <button
                                    className="filter-section-header"
                                    onClick={() => toggleSection(filter.key)}
                                >
                                    <span className="filter-section-title">{filter.label}</span>
                                    <ChevronDown
                                        className={`chevron ${expandedSections.has(filter.key) ? 'rotated' : ''}`}
                                        size={16}
                                    />
                                </button>

                                {expandedSections.has(filter.key) && (
                                    <div className="filter-options">
                                        {filter.type === 'multiselect' && filter.options.map((option) => (
                                            <label key={option.value} className="filter-option">
                                                <input
                                                    type="checkbox"
                                                    checked={(activeFilters[filter.key] || []).includes(option.value)}
                                                    onChange={() => {
                                                        const current = activeFilters[filter.key] || [];
                                                        setActiveFilters(prev => ({
                                                            ...prev,
                                                            [filter.key]: current.includes(option.value)
                                                                ? current.filter(v => v !== option.value)
                                                                : [...current, option.value]
                                                        }));
                                                        handleFilterChange(filter.key, option.value);
                                                    }}
                                                    className="filter-checkbox"
                                                />
                                                <span className="option-label">{option.label}</span>
                                                {option.count !== undefined && (
                                                    <span className="option-count">({option.count})</span>
                                                )}
                                            </label>
                                        ))}

                                        {filter.type === 'select' && filter.options.map((option) => (
                                            <label key={option.value} className="filter-option">
                                                <input
                                                    type="radio"
                                                    name={filter.key}
                                                    checked={activeFilters[filter.key] === option.value}
                                                    onChange={() => handleFilterChange(filter.key, option.value)}
                                                    className="filter-radio"
                                                />
                                                <span className="option-label">{option.label}</span>
                                            </label>
                                        ))}

                                        {filter.type === 'range' && (
                                            <div className="range-filter">
                                                <input
                                                    type="range"
                                                    min={filter.min}
                                                    max={filter.max}
                                                    value={activeFilters[filter.key] || filter.min}
                                                    onChange={(e) => handleFilterChange(filter.key, Number(e.target.value))}
                                                    className="filter-range"
                                                />
                                                <div className="range-value">
                                                    {activeFilters[filter.key] || filter.min} {filter.unit || ''}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;
