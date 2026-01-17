import React, { useState } from 'react';
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

    const handleSearch = (value) => {
        setSearchTerm(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
        if (onSearch) {
            onSearch('');
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
                        <span key={index} className="hint-field">{field}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
