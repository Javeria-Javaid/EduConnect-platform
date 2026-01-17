import React from 'react';
import { HelpCircle, MessageCircle, FileText, ExternalLink } from 'lucide-react';

const SupportHelp = () => {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">Support & Help</h2>
                <p className="text-sm text-[var(--text-secondary)] mt-1">Get assistance and view system documentation.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Contact Support */}
                <div className="lg:col-span-2 bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                    <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                        <MessageCircle size={18} className="text-[var(--primary-color)]" />
                        Submit a Ticket
                    </h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Subject</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white">
                                    <option>Technical Issue</option>
                                    <option>Billing Question</option>
                                    <option>Feature Request</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Priority</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm bg-white">
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Description</label>
                            <textarea
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-[var(--border-radius-base)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] resize-none"
                                placeholder="Describe your issue in detail..."
                            />
                        </div>
                        <div className="flex justify-end">
                            <button className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-[var(--border-radius-base)] text-sm font-semibold hover:opacity-90 shadow-sm">
                                Submit Ticket
                            </button>
                        </div>
                    </form>
                </div>

                {/* Quick Links */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[var(--border-radius-base)] shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-[var(--primary-color)]" />
                            Documentation
                        </h3>
                        <div className="space-y-3">
                            {['User Guide', 'API Documentation', 'Video Tutorials', 'Release Notes'].map((item) => (
                                <a key={item} href="#" className="flex items-center justify-between p-2 text-sm text-[var(--text-secondary)] hover:text-[var(--primary-color)] hover:bg-blue-50 rounded transition-colors">
                                    {item}
                                    <ExternalLink size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[var(--primary-color)] p-6 rounded-[var(--border-radius-base)] shadow-sm text-white">
                        <h3 className="text-lg font-bold mb-2">Need Urgent Help?</h3>
                        <p className="text-sm opacity-90 mb-4">Our support team is available 24/7 for critical issues.</p>
                        <button className="w-full py-2 bg-white text-[var(--primary-color)] rounded-[var(--border-radius-base)] text-sm font-bold hover:bg-gray-100 transition-colors">
                            Chat with Support
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportHelp;
