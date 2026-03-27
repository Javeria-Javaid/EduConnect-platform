import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({
    placeholder = "Search...",
    onSearch,
    searchFields = [],
    className = ""
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [activeField, setActiveField] = useState(searchFields.length > 0 ? searchFields[0] : '');

    // If searchFields change, reset active field
    useEffect(() => {
        if (searchFields.length > 0 && !searchFields.includes(activeField)) {
            setActiveField(searchFields[0]);
        }
    }, [searchFields]);

    const handleSearch = (value, field = activeField) => {
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value, field);
        }
    };

    const handleFieldChange = (field) => {
        setActiveField(field);
        if (searchTerm && onSearch) {
            onSearch(searchTerm, field);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('', activeField);
        }
    };

    return (
        <div className={`search-bar-container ${isFocused ? 'focused' : ''} ${className}`}>
            <div className="search-bar-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {searchTerm && (
                    <button
                        className="clear-search-btn"
                        onClick={clearSearch}
                        type="button"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            {searchFields.length > 0 && (
                <div className="search-fields-hint">
                    <span className="hint-label">Search by:</span>
                    {searchFields.map((field, index) => (
                        <span 
                            key={index} 
                            className={`hint-field ${activeField === field ? 'active' : ''}`}
                            onClick={() => handleFieldChange(field)}
                            style={{ 
                                cursor: 'pointer', 
                                fontWeight: activeField === field ? '700' : '400',
                                backgroundColor: activeField === field ? '#e2e8f0' : 'transparent',
                                color: activeField === field ? '#0f172a' : '#64748b'
                            }}
                        >
                            {field}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
