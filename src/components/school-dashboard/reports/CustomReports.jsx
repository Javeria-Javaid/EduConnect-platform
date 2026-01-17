import React, { useState } from 'react';
import { FileText, Download, Plus, Save, Clock, Settings } from 'lucide-react';
import './ReportSubSection.css';

const CustomReports = () => {
    const [reportName, setReportName] = useState('');
    const [selectedModule, setSelectedModule] = useState('students');
    const [selectedFields, setSelectedFields] = useState([]);

    const modules = [
        { id: 'students', label: 'Students' },
        { id: 'teachers', label: 'Teachers' },
        { id: 'attendance', label: 'Attendance' },
        { id: 'finance', label: 'Finance' },
    ];

    const fields = {
        students: ['Name', 'Class', 'Roll No', 'Attendance %', 'Grade', 'Parent Name', 'Contact'],
        teachers: ['Name', 'Subject', 'Department', 'Join Date', 'Salary', 'Contact'],
        attendance: ['Date', 'Class', 'Total Present', 'Total Absent', 'Late Arrivals'],
        finance: ['Transaction ID', 'Student Name', 'Fee Type', 'Amount', 'Date', 'Status'],
    };

    const toggleField = (field) => {
        if (selectedFields.includes(field)) {
            setSelectedFields(selectedFields.filter(f => f !== field));
        } else {
            setSelectedFields([...selectedFields, field]);
        }
    };

    const handleDownloadExcel = () => {
        try {
            if (selectedFields.length === 0) {
                alert('Please select at least one field to export');
                return;
            }

            const csvData = [
                [reportName || 'Custom Report'],
                ['Module', modules.find(m => m.id === selectedModule)?.label],
                ['Generated on', new Date().toLocaleDateString()],
                [''],
                selectedFields, // Header row with selected fields
                // Sample data rows
                ...Array.from({ length: 5 }, (_, index) =>
                    selectedFields.map(field => `Sample ${field} ${index + 1}`)
                )
            ];

            const csvContent = csvData.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `${(reportName || 'Custom_Report').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            console.log('Excel export successful:', reportName);
        } catch (error) {
            console.error('Excel export error:', error);
            alert('Export failed. Please try again.');
        }
    };

    const handleDownloadPDF = () => {
        try {
            if (selectedFields.length === 0) {
                alert('Please select at least one field to export');
                return;
            }

            const sampleRows = Array.from({ length: 5 }, (_, index) =>
                `<tr>${selectedFields.map(field => `<td>Sample ${field} ${index + 1}</td>`).join('')}</tr>`
            ).join('');

            const htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${reportName || 'Custom Report'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; }
                        h1 { color: #3b82f6; margin-bottom: 10px; }
                        .meta { color: #64748b; font-size: 14px; margin-bottom: 30px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
                        th { background-color: #3b82f6; color: white; font-weight: 600; }
                        tr:nth-child(even) { background-color: #f8fafc; }
                    </style>
                </head>
                <body>
                    <h1>${reportName || 'Custom Report'}</h1>
                    <p class="meta">Module: ${modules.find(m => m.id === selectedModule)?.label}</p>
                    <p class="meta">Generated on: ${new Date().toLocaleDateString()}</p>
                    <table>
                        <thead>
                            <tr>${selectedFields.map(field => `<th>${field}</th>`).join('')}</tr>
                        </thead>
                        <tbody>${sampleRows}</tbody>
                    </table>
                </body>
                </html>
            `;

            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = `${(reportName || 'Custom_Report').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
            a.style.display = 'none';

            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);

            console.log('PDF export successful:', reportName);
        } catch (error) {
            console.error('PDF export error:', error);
            alert('Export failed. Please try again.');
        }
    };


    return (
        <div className="report-subsection-container">
            {/* Header */}
            <div className="report-section-header">
                <h2 className="report-section-title">Custom Report Builder</h2>
                <p className="report-section-subtitle">Create and export custom reports</p>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    Scheduled Reports
                </button>
                <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={16} />
                    Saved Templates
                </button>
            </div>

            <div className="report-content-grid">
                {/* Configuration Panel */}
                <div className="report-table-section">
                    <div className="report-table-header">
                        <h3 className="report-table-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Settings size={20} style={{ color: '#3b82f6' }} />
                            Report Configuration
                        </h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '20px' }}>
                        {/* Report Name */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                                Report Name
                            </label>
                            <input
                                type="text"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    transition: 'all 0.2s'
                                }}
                                placeholder="e.g., Monthly Student Attendance Summary"
                                value={reportName}
                                onChange={(e) => setReportName(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                            />
                        </div>

                        {/* Module Selection */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '8px' }}>
                                Select Module
                            </label>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {modules.map(module => (
                                    <button
                                        key={module.id}
                                        onClick={() => {
                                            setSelectedModule(module.id);
                                            setSelectedFields([]);
                                        }}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            border: '1px solid',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: selectedModule === module.id ? '#eff6ff' : '#f8fafc',
                                            color: selectedModule === module.id ? '#2563eb' : '#64748b',
                                            borderColor: selectedModule === module.id ? '#bfdbfe' : '#e2e8f0'
                                        }}
                                    >
                                        {module.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Field Selection */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>
                                Select Fields to Include
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                                {fields[selectedModule].map(field => (
                                    <label
                                        key={field}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            background: selectedFields.includes(field) ? '#eff6ff' : 'white',
                                            borderColor: selectedFields.includes(field) ? '#bfdbfe' : '#e2e8f0'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            style={{
                                                width: '16px',
                                                height: '16px',
                                                accentColor: '#3b82f6',
                                                cursor: 'pointer'
                                            }}
                                            checked={selectedFields.includes(field)}
                                            onChange={() => toggleField(field)}
                                        />
                                        <span style={{ marginLeft: '8px', fontSize: '0.875rem', color: '#475569' }}>{field}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                        <button
                            style={{
                                padding: '10px 16px',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#64748b',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                setReportName('');
                                setSelectedFields([]);
                            }}
                        >
                            Reset
                        </button>
                        <button className="report-export-btn">
                            <FileText size={16} />
                            Generate Preview
                        </button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="report-chart-card">
                    <h3 className="report-chart-title">Preview</h3>

                    {selectedFields.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <h4 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                                    {reportName || 'Untitled Report'}
                                </h4>
                                <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    Module: {modules.find(m => m.id === selectedModule)?.label}
                                </p>
                                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {selectedFields.map(field => (
                                        <span
                                            key={field}
                                            style={{
                                                padding: '4px 10px',
                                                background: 'white',
                                                border: '1px solid #e2e8f0',
                                                borderRadius: '6px',
                                                fontSize: '0.75rem',
                                                color: '#64748b'
                                            }}
                                        >
                                            {field}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', paddingTop: '24px' }}>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '16px' }}>
                                    Ready to generate report?
                                </p>
                                <button
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        padding: '10px 16px',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        marginBottom: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    onClick={handleDownloadExcel}
                                >
                                    <Download size={16} />
                                    Download Excel
                                </button>
                                <button
                                    className="btn-secondary"
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                    onClick={handleDownloadPDF}
                                >
                                    <FileText size={16} />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            height: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px dashed #e2e8f0',
                            borderRadius: '12px',
                            color: '#cbd5e1'
                        }}>
                            <FileText size={48} style={{ opacity: 0.2, marginBottom: '8px' }} />
                            <p style={{ fontSize: '0.875rem' }}>Select fields to see preview</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomReports;
