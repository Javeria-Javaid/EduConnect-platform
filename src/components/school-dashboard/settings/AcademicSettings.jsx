import React, { useState } from 'react';
import { Book, Calendar, Award, Plus, Trash2 } from 'lucide-react';

const AcademicSettings = () => {
    const [activeTab, setActiveTab] = useState('classes');

    const classes = [
        { id: 1, name: 'Class 1', sections: ['A', 'B', 'C'], subjects: 5 },
        { id: 2, name: 'Class 2', sections: ['A', 'B'], subjects: 6 },
        { id: 3, name: 'Class 3', sections: ['A', 'B', 'C', 'D'], subjects: 6 },
    ];

    const gradingSystem = [
        { grade: 'A+', range: '90-100', point: '4.0' },
        { grade: 'A', range: '80-89', point: '3.7' },
        { grade: 'B', range: '70-79', point: '3.0' },
        { grade: 'C', range: '60-69', point: '2.0' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Academic Settings</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Configure classes, grading systems, and exam structures.</p>
                </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex gap-4 border-b border-gray-200">
                {['classes', 'grading', 'exams'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab
                                ? 'border-[var(--primary-color)] text-[var(--primary-color)]'
                                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {tab} Configuration
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                {activeTab === 'classes' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Class Management</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-medium hover:opacity-90">
                                <Plus size={14} /> Add Class
                            </button>
                        </div>
                        <div className="space-y-3">
                            {classes.map((cls) => (
                                <div key={cls.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-[var(--border-radius-base)] hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-50 text-[var(--primary-color)] rounded-lg">
                                            <Book size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[var(--text-primary)]">{cls.name}</h4>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Sections: {cls.sections.join(', ')} • {cls.subjects} Subjects
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-md">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'grading' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">Grading System</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-[var(--border-radius-base)] text-sm font-medium hover:bg-gray-50">
                                Configure Rules
                            </button>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)] uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 rounded-tl-lg">Grade</th>
                                    <th className="px-4 py-3">Percentage Range</th>
                                    <th className="px-4 py-3">Grade Point</th>
                                    <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {gradingSystem.map((g, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3 font-bold text-[var(--text-primary)]">{g.grade}</td>
                                        <td className="px-4 py-3 text-[var(--text-secondary)]">{g.range}%</td>
                                        <td className="px-4 py-3 text-[var(--text-secondary)]">{g.point}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'exams' && (
                    <div className="text-center py-12">
                        <Award size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-[var(--text-primary)]">Exam Configuration</h3>
                        <p className="text-[var(--text-secondary)] mb-6">Set up exam terms, weightage, and report card templates.</p>
                        <button className="px-4 py-2 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-medium">
                            Configure Exams
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AcademicSettings;
