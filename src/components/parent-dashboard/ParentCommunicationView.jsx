import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import MessageModal from '../school-dashboard/teachers/MessageModal';
import './ParentViews.css';

const ParentCommunicationView = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const me = await res.json();
                    setCurrentUser(me.data || me);
                }
            } catch {
                // no-op; user can retry by reopening
            }
        };
        load();
    }, []);

    return (
        <div className="parent-view-container">
            <div className="view-header">
                <h1 className="view-title">Communication</h1>
                <p className="view-subtitle">Chat with teachers and school administration</p>
            </div>

            <div className="view-content">
                <div className="content-card">
                    <div className="card-header">
                        <h2 className="card-title">Messages</h2>
                        <MessageSquare size={20} className="text-gray-400" />
                    </div>
                    <div className="card-body">
                        <p style={{ color: '#64748b', marginBottom: '12px' }}>
                            Open your inbox to view teacher and school conversations.
                        </p>
                        <button className="btn-primary" onClick={() => setIsModalOpen(true)} disabled={!currentUser}>
                            <MessageSquare size={16} style={{ marginRight: '8px' }} />
                            Open Messaging
                        </button>
                    </div>
                </div>
            </div>
            <MessageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialRecipient={null}
                currentUser={currentUser}
            />
        </div>
    );
};

export default ParentCommunicationView;

