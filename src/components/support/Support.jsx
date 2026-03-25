import React, { useState, useEffect } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { Send, User, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import './Support.css';

const Support = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [chatMessage, setChatMessage] = useState('');

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/support`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (res.ok) setTickets(data);
        } catch (error) {
            toast.error('Error fetching tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const columns = [
        {
            header: 'Subject',
            accessor: 'subject',
            render: (item) => (
                <div className="subject-cell">
                    <span className="subject-text">{item.subject}</span>
                    <span className="user-text">{item.user}</span>
                </div>
            )
        },
        {
            header: 'Priority',
            accessor: 'priority',
            render: (item) => <span className={`priority-badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => <span className={`status-badge ${item.status === 'Resolved' ? 'active' : 'warning'}`}>{item.status}</span>
        }
    ];

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/support/${currentTicket._id}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ sender: 'admin', text: chatMessage })
            });

            if (res.ok) {
                const updatedTicket = await res.json();
                setCurrentTicket(updatedTicket);
                setChatMessage('');
                fetchTickets();
            }
        } catch (error) {
            toast.error('Failed to send message');
        }
    };

    return (
        <div className="support-page">
            <PageHeader title="Support & Tickets" subtitle="Manage help requests." />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <DataTable
                    columns={columns}
                    data={tickets}
                    onView={(ticket) => { setCurrentTicket(ticket); setIsModalOpen(true); }}
                    searchPlaceholder="Search tickets..."
                />
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Ticket: ${currentTicket?.subject}`}
                size="large"
            >
                {currentTicket && (
                    <div className="ticket-details-view">
                        <div className="chat-interface">
                            <div className="chat-history">
                                {currentTicket.messages.map((msg, idx) => (
                                    <div key={idx} className={`chat-message ${msg.sender}`}>
                                        <div className="message-bubble">
                                            <p>{msg.text}</p>
                                            <span className="message-time">{new Date(msg.time).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                <input
                                    type="text"
                                    placeholder="Type your reply..."
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                />
                                <button type="submit" className="send-btn"><Send size={18} /></button>
                            </form>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Support;
