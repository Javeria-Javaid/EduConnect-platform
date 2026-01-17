import React, { useState } from 'react';
import { Save, Upload } from 'lucide-react';
import { settingsMockData } from './mockData';

const SchoolProfileSettings = () => {
    const [formData, setFormData] = useState(settingsMockData.schoolProfile);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saved:', formData);
        // Add toast notification logic here
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-[var(--text-primary)]">School Profile</h2>
                        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your school's basic information and branding.</p>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>

                <form className="space-y-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                        <div className="w-24 h-24 bg-gray-100 rounded-[var(--border-radius-base)] flex items-center justify-center border-2 border-dashed border-gray-300">
                            <span className="text-xs text-gray-400 font-medium">Logo</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[var(--text-primary)]">School Logo</h3>
                            <p className="text-xs text-[var(--text-secondary)] mb-3">Recommended size: 200x200px (PNG or JPG)</p>
                            <button type="button" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-[var(--border-radius-base)] text-sm text-[var(--text-secondary)] hover:bg-gray-50 transition-colors">
                                <Upload size={14} />
                                Upload New
                            </button>
                        </div>
                    </div>

                    {/* Basic Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">School Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Principal Name</label>
                            <input
                                type="text"
                                name="principalName"
                                value={formData.principalName}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Address</label>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    {/* Academic Details */}
                    <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-sm font-bold text-[var(--text-primary)] mb-4 uppercase tracking-wide">Academic Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Current Academic Year</label>
                                <select
                                    name="academicYear"
                                    value={formData.academicYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent bg-white"
                                >
                                    <option>2024-2025</option>
                                    <option>2025-2026</option>
                                    <option>2026-2027</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">Established Year</label>
                                <input
                                    type="text"
                                    name="establishedYear"
                                    value={formData.establishedYear}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchoolProfileSettings;
