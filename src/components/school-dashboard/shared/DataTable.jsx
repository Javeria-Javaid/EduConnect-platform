import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DataTable.css';

const DataTable = ({
    columns,
    data,
    selectable = false,
    onSelectionChange,
    onQuickAction,
    pageSize = 10
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Sort data
    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = paginatedData.map(row => row.id);
            setSelectedRows(allIds);
            onSelectionChange && onSelectionChange(allIds);
        } else {
            setSelectedRows([]);
            onSelectionChange && onSelectionChange([]);
        }
    };

    const handleSelectRow = (id) => {
        const newSelection = selectedRows.includes(id)
            ? selectedRows.filter(rowId => rowId !== id)
            : [...selectedRows, id];
        setSelectedRows(newSelection);
        onSelectionChange && onSelectionChange(newSelection);
    };

    return (
        <div className="data-table-wrapper">
            {/* Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead className="table-header">
                        <tr>
                            {selectable && (
                                <th className="checkbox-cell">
                                    <input
                                        type="checkbox"
                                        className="table-checkbox"
                                        onChange={handleSelectAll}
                                        checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                                    />
                                </th>
                            )}
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className={col.sortable ? 'sortable' : ''}
                                    onClick={() => col.sortable && handleSort(col.key)}
                                >
                                    <div className="header-content">
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <span className="sort-indicator">
                                                {sortConfig.direction === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {onQuickAction && <th style={{ textAlign: 'right' }}>Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, index) => (
                                <tr
                                    key={row.id || index}
                                    className="table-row"
                                >
                                    {selectable && (
                                        <td className="table-cell checkbox-cell">
                                            <input
                                                type="checkbox"
                                                className="table-checkbox"
                                                checked={selectedRows.includes(row.id)}
                                                onChange={() => handleSelectRow(row.id)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((col) => (
                                        <td key={col.key} className="table-cell">
                                            {col.render ? col.render(row) : row[col.key]}
                                        </td>
                                    ))}
                                    {onQuickAction && (
                                        <td className="table-cell actions-cell">
                                            <div className="action-buttons-group">
                                                {onQuickAction(row).map((action, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={action.onClick}
                                                        className="action-btn"
                                                        title={action.label}
                                                    >
                                                        {action.icon}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + (onQuickAction ? 1 : 0)} className="empty-state">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container">
                <span className="pagination-info">
                    Showing <span className="highlight">{startIndex + 1}</span> to <span className="highlight">{Math.min(startIndex + pageSize, sortedData.length)}</span> of <span className="highlight">{sortedData.length}</span> entries
                </span>
                <div className="pagination-controls">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-page-btn ${currentPage === page ? 'active' : ''}`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
