import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import './DataTable.css';

const DataTable = ({
    columns,
    data,
    onEdit,
    onDelete,
    onView,
    searchPlaceholder = "Search...",
    filters = []
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [activeFilters, setActiveFilters] = useState({});

    // Filter and Search Logic
    const filteredData = data.filter(item => {
        // Search
        const matchesSearch = Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Filters
        const matchesFilters = Object.keys(activeFilters).every(key => {
            if (!activeFilters[key]) return true;
            return item[key] === activeFilters[key];
        });

        return matchesSearch && matchesFilters;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    return (
        <div className="data-table-container">
            {/* Toolbar */}
            <div className="table-toolbar">
                <div className="search-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filters-wrapper">
                    {filters.map(filter => (
                        <div key={filter.key} className="filter-item">
                            <select
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                className="filter-select"
                            >
                                <option value="">{filter.label}</option>
                                {filter.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} style={{ width: col.width }}>{col.header}</th>
                            ))}
                            <th style={{ width: '100px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? (
                            currentItems.map((item, idx) => (
                                <tr key={item.id || idx}>
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx}>
                                            {col.render ? col.render(item) : item[col.accessor]}
                                        </td>
                                    ))}
                                    <td>
                                        <div className="actions-cell">
                                            {onView && (
                                                <button onClick={() => onView(item)} className="action-btn view" title="View">
                                                    <Eye size={16} />
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button onClick={() => onEdit(item)} className="action-btn edit" title="Edit">
                                                    <Edit size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button onClick={() => onDelete(item)} className="action-btn delete" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + 1} className="no-data">
                                    No records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
                <span className="pagination-info">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                </span>
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="page-btn"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="page-btn"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
