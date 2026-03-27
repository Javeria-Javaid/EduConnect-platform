import React, { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import MessageModal from '../school-dashboard/teachers/MessageModal';
import './TeacherDashboardOverview.css';

const TeacherCommunicationView = () => {
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            const meRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (meRes.ok) {
                const me = await meRes.json();
                setCurrentUser(me.data || me);
            }
        };
        load();
    }, [user?._id]);

    return (
        <div className="teacher-dashboard-overview">
            <div className="overview-header">
                <div>
                    <h1 className="page-title">Communication</h1>
                    <p className="page-subtitle">Secure internal messaging for your school</p>
                </div>
            </div>

            <div className="dashboard-card">
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                    <div>
                        <h2 className="card-title">Inbox</h2>
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Open your conversations and message parents/staff.</p>
                    </div>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)} disabled={!currentUser}>
                        <MessageSquare size={16} /> Open Inbox
                    </button>
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

export default TeacherCommunicationView;
