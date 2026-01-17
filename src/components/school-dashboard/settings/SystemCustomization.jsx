import React, { useState } from 'react';
import { Monitor, Moon, Sun, Layout, Type } from 'lucide-react';

const SystemCustomization = () => {
    const [theme, setTheme] = useState('light');
    const [sidebar, setSidebar] = useState('expanded');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">System Customization</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Personalize the look and feel of your dashboard.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Theme Selection */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Monitor size={18} className="text-[var(--primary-color)]" />
                        Theme Preference
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTheme('light')}
                            className={`p-4 border rounded-[var(--border-radius-base)] text-center transition-all ${theme === 'light' ? 'border-[var(--primary-color)] bg-blue-50 ring-1 ring-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Sun size={24} className={`mx-auto mb-2 ${theme === 'light' ? 'text-[var(--primary-color)]' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${theme === 'light' ? 'text-[var(--primary-color)]' : 'text-[var(--text-secondary)]'}`}>Light Mode</span>
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`p-4 border rounded-[var(--border-radius-base)] text-center transition-all ${theme === 'dark' ? 'border-[var(--primary-color)] bg-gray-800 ring-1 ring-[var(--primary-color)]' : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <Moon size={24} className={`mx-auto mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-400'}`} />
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-[var(--text-secondary)]'}`}>Dark Mode</span>
                        </button>
                    </div>
                </div>

                {/* Sidebar Layout */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Layout size={18} className="text-[var(--primary-color)]" />
                        Sidebar Layout
                    </h3>
                    <div className="space-y-3">
                        {['expanded', 'compact'].map((mode) => (
                            <div key={mode}
                                onClick={() => setSidebar(mode)}
                                className={`flex items-center justify-between p-3 border rounded-[var(--border-radius-base)] cursor-pointer transition-all ${sidebar === mode ? 'border-[var(--primary-color)] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="text-sm font-medium capitalize text-[var(--text-primary)]">{mode} View</span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${sidebar === mode ? 'border-[var(--primary-color)]' : 'border-gray-300'
                                    }`}>
                                    {sidebar === mode && <div className="w-2 h-2 rounded-full bg-[var(--primary-color)]" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Language */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <Type size={18} className="text-[var(--primary-color)]" />
                        Language
                    </h3>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]">
                        <option>English (US)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default SystemCustomization;
