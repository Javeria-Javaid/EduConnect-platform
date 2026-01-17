import React, { useState } from 'react';
import { Plus, Edit, Trash2, Shield, Check } from 'lucide-react';
import { settingsMockData } from './mockData';
import DataTable from '../shared/DataTable';

const RolesPermissionsSettings = () => {
    const [roles, setRoles] = useState(settingsMockData.roles);

    const columns = [
        {
            key: 'name', label: 'Role Name', sortable: true, render: (row) => (
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-[var(--primary-color)] rounded-md">
                        <Shield size={16} />
                    </div>
                    <span className="font-medium text-[var(--text-primary)]">{row.name}</span>
                </div>
            )
        },
        {
            key: 'users', label: 'Assigned Users', sortable: true, render: (row) => (
                <span className="px-2 py-1 bg-gray-100 text-[var(--text-secondary)] rounded-md text-xs font-medium">
                    {row.users} Users
                </span>
            )
        },
        {
            key: 'permissions', label: 'Access Level', render: (row) => (
                <span className="text-sm text-[var(--text-secondary)]">
                    {row.permissions.includes('all') ? 'Full Access' : `${row.permissions.length} Permissions`}
                </span>
            )
        },
    ];

    const handleQuickAction = (row) => [
        { label: 'Edit Role', icon: <Edit size={14} />, onClick: () => console.log('Edit', row) },
        { label: 'Delete Role', icon: <Trash2 size={14} />, onClick: () => console.log('Delete', row) },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Roles & Permissions</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Manage access levels and user roles.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
                    <Plus size={16} />
                    Create New Role
                </button>
            </div>

            <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                <DataTable
                    columns={columns}
                    data={roles}
                    onQuickAction={handleQuickAction}
                    searchPlaceholder="Search roles..."
                />
            </div>

            {/* Permission Matrix Preview (Static for now) */}
            <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Default Permissions</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[var(--surface-muted)] text-[var(--text-secondary)] uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3">Module</th>
                                <th className="px-4 py-3 text-center">Admin</th>
                                <th className="px-4 py-3 text-center">Teacher</th>
                                <th className="px-4 py-3 text-center">Student</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {['Dashboard', 'Students', 'Finance', 'Settings'].map((module) => (
                                <tr key={module}>
                                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{module}</td>
                                    <td className="px-4 py-3 text-center text-green-600"><Check size={16} className="mx-auto" /></td>
                                    <td className="px-4 py-3 text-center">
                                        {module === 'Finance' || module === 'Settings' ? <span className="text-gray-300">-</span> : <Check size={16} className="mx-auto text-green-600" />}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {module === 'Dashboard' ? <Check size={16} className="mx-auto text-green-600" /> : <span className="text-gray-300">-</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RolesPermissionsSettings;
