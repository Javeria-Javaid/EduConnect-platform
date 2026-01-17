import React from 'react';
import { DollarSign, CreditCard, PieChart, Plus, Settings } from 'lucide-react';

const FinanceSettings = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">Finance Settings</h2>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">Configure fees, taxes, and payment gateways.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* General Finance Config */}
                <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">General Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Currency</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white">
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>INR (₹)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Tax Rate (%)</label>
                            <input
                                type="number"
                                defaultValue="5"
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Financial Year Start</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Payment Gateways */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Payment Gateways</h3>
                    <div className="space-y-4">
                        {[
                            { name: 'Stripe', status: 'Connected', icon: CreditCard },
                            { name: 'PayPal', status: 'Not Connected', icon: DollarSign },
                            { name: 'Bank Transfer', status: 'Active', icon: PieChart },
                        ].map((gateway) => (
                            <div key={gateway.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-[var(--border-radius-base)]">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${gateway.status === 'Connected' || gateway.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                        <gateway.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[var(--text-primary)]">{gateway.name}</h4>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${gateway.status === 'Not Connected' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {gateway.status}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-[var(--primary-color)] hover:bg-blue-50 rounded-md">
                                    <Settings size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fee Structures */}
                <div className="lg:col-span-3 bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">Fee Categories</h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-medium hover:opacity-90">
                            <Plus size={14} /> Add Category
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { name: 'Tuition Fee', cycle: 'Monthly', amount: '$500' },
                            { name: 'Transport Fee', cycle: 'Monthly', amount: '$150' },
                            { name: 'Library Fee', cycle: 'Annual', amount: '$50' },
                            { name: 'Exam Fee', cycle: 'Per Term', amount: '$100' },
                        ].map((fee) => (
                            <div key={fee.name} className="p-4 border border-gray-200 rounded-[var(--border-radius-base)] hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-[var(--text-primary)]">{fee.name}</h4>
                                <p className="text-sm text-[var(--text-secondary)] mt-1">{fee.cycle}</p>
                                <p className="text-xl font-bold text-[var(--primary-color)] mt-3">{fee.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceSettings;
