import React from 'react';
import { Upload, Download, Trash2, FileText, Database } from 'lucide-react';

const DataManagement = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Data Management</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Import, export, and manage system data.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Import Data */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Upload size={18} className="text-[var(--primary-color)]" />
                        Import Data
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">Bulk upload students, teachers, or finance records using CSV/Excel.</p>
                    <div className="border-2 border-dashed border-gray-300 rounded-[var(--border-radius-base)] p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                        <FileText size={32} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-sm font-medium text-[var(--text-primary)]">Drag & Drop or Click to Upload</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">Supported formats: .csv, .xlsx</p>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-medium hover:opacity-90">
                            Upload File
                        </button>
                        <button className="px-4 py-2 border border-gray-300 text-[var(--text-secondary)] rounded-[var(--border-radius-base)] text-sm font-medium hover:bg-gray-50">
                            Download Template
                        </button>
                    </div>
                </div>

                {/* Export Data */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Download size={18} className="text-[var(--primary-color)]" />
                        Export Data
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">Download system records for reporting or backup purposes.</p>
                    <div className="space-y-3">
                        {['Student Records', 'Staff Directory', 'Financial Reports', 'Attendance Logs'].map((item) => (
                            <div key={item} className="flex items-center justify-between p-3 border border-gray-100 rounded-[var(--border-radius-base)] hover:bg-gray-50">
                                <span className="text-sm font-medium text-[var(--text-primary)]">{item}</span>
                                <button className="text-[var(--primary-color)] hover:underline text-sm font-medium">Export CSV</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Cleanup */}
                <div className="md:col-span-2 bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Trash2 size={18} className="text-red-500" />
                        Data Cleanup
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-[var(--border-radius-base)]">
                        <div>
                            <h4 className="font-bold text-red-800">Archive Old Records</h4>
                            <p className="text-sm text-red-600 mt-1">Move graduated students and inactive staff to archive.</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-[var(--border-radius-base)] text-sm font-medium hover:bg-red-100">
                            Review & Archive
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataManagement;
