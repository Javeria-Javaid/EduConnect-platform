import React, { useState } from 'react';
import PageHeader from '../ui/PageHeader';
import DataTable from '../ui/DataTable';
import Modal from '../ui/Modal';
import { MessageSquare, User, Clock, CheckCircle, AlertCircle, Send } from 'lucide-react';
import './Support.css';

// Mock Data
const MOCK_TICKETS = [
    { id: 'T-1001', subject: 'Login Issues', user: 'John Doe (Parent)', priority: 'High', status: 'Open', date: '2024-03-20', lastReply: '2 mins ago' },
    { id: 'T-1002', subject: 'Fee Payment Error', user: 'Jane Smith (Parent)', priority: 'Critical', status: 'In Progress', date: '2024-03-19', lastReply: '1 hour ago' },
    { id: 'T-1003', subject: 'Report Card Missing', user: 'Sarah Johnson (Teacher)', priority: 'Medium', status: 'Resolved', date: '2024-03-18', lastReply: '1 day ago' },
    { id: 'T-1004', subject: 'Bus Route Change', user: 'Mike Wilson (Parent)', priority: 'Low', status: 'Open', date: '2024-03-21', lastReply: 'Just now' },
    { id: 'T-1005', subject: 'IT Equipment Request', user: 'David Lee (Teacher)', priority: 'Medium', status: 'Open', date: '2024-03-21', lastReply: '10 mins ago' },
];

const MOCK_CHAT = [
    { sender: 'user', text: 'Hi, I am unable to login to the parent portal.', time: '10:00 AM' },
    { sender: 'admin', text: 'Hello! I can help with that. Are you getting any error message?', time: '10:05 AM' },
    { sender: 'user', text: 'Yes, it says "Invalid Credentials" but I am sure my password is correct.', time: '10:06 AM' },
];

const Support = () => {
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTicket, setCurrentTicket] = useState(null);
    const [chatMessage, setChatMessage] = useState('');
    const [chatHistory, setChatHistory] = useState(MOCK_CHAT);

    const columns = [
        {
            header: 'Ticket ID',
            accessor: 'id',
            render: (item) => <span className="ticket-id">{item.id}</span>
        },
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
            render: (item) => (
                <span className={`priority-badge ${item.priority.toLowerCase()}`}>
                    {item.priority}
                </span>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (item) => (
                <span className={`status-badge ${item.status === 'Resolved' ? 'active' : item.status === 'Open' ? 'warning' : 'pending'}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Last Reply',
            accessor: 'lastReply',
            render: (item) => <span className="last-reply-text">{item.lastReply}</span>
        }
    ];

    const filters = [
        {
            key: 'status',
            label: 'All Statuses',
            options: [
                { value: 'Open', label: 'Open' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Resolved', label: 'Resolved' }
            ]
        },
        {
            key: 'priority',
            label: 'All Priorities',
            options: [
                { value: 'Critical', label: 'Critical' },
                { value: 'High', label: 'High' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Low', label: 'Low' }
            ]
        }
    ];

    const handleView = (ticket) => {
        setCurrentTicket(ticket);
        setIsModalOpen(true);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!chatMessage.trim()) return;

        const newMessage = { sender: 'admin', text: chatMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setChatHistory([...chatHistory, newMessage]);
        setChatMessage('');
    };

    const handleStatusChange = (newStatus) => {
        setTickets(tickets.map(t => t.id === currentTicket.id ? { ...t, status: newStatus } : t));
        setCurrentTicket({ ...currentTicket, status: newStatus });
    };

    const handleAssignAgent = (agent) => {
        alert(`Ticket assigned to ${agent}`);
    };

    return (
        <div className="support-page">
            <PageHeader
                title="Support & Tickets"
                subtitle="Manage help requests, resolve issues, and track support performance."
            />

            <div className="support-stats">
                <div className="stat-card">
                    <span className="stat-label">Open Tickets</span>
                    <span className="stat-value stat-danger">{tickets.filter(t => t.status === 'Open').length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">In Progress</span>
                    <span className="stat-value stat-info">{tickets.filter(t => t.status === 'In Progress').length}</span>
                </div>
                <div className="stat-card">
                    <span className="stat-label">SLA Breaches</span>
                    <span className="stat-value stat-warning">2</span>
                </div>
            </div>

            <div className="support-toolbar">
                <div className="auto-response-toggle">
                    <div className="support-toggle">
                        <input type="checkbox" id="auto-response" defaultChecked />
                        <label htmlFor="auto-response"></label>
                    </div>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={tickets}
                onView={handleView}
                searchPlaceholder="Search tickets..."
                filters={filters}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={`Ticket Details: ${currentTicket?.id}`}
                size="large"
            >
                {currentTicket && (
                    <div className="ticket-details-view">
                        <div className="ticket-header-info">
                            <div>
                                <h3>{currentTicket.subject}</h3>
                                <p className="user-info"><User size={14} /> {currentTicket.user}</p>
                            </div>
                            <div className="ticket-meta">
                                <div className="badge-group">
                                    <span className={`priority-badge ${currentTicket.priority.toLowerCase()}`}>{currentTicket.priority}</span>
                                    <span className={`status-badge ${currentTicket.status === 'Resolved' ? 'active' : 'warning'}`}>{currentTicket.status}</span>
                                </div>
                                <span className="sla-text">SLA: <span className="sla-status-ok">On Track</span></span>
                            </div>
                        </div>

                        <div className="ticket-assignment">
                            <span className="assignment-label">Assigned Agent:</span>
                            <select className="agent-select" onChange={(e) => handleAssignAgent(e.target.value)}>
                                <option value="">Select Agent</option>
                                <option value="Agent A">Agent A</option>
                                <option value="Agent B">Agent B</option>
                                <option value="Agent C">Agent C</option>
                            </select>
                        </div>

                        <div className="chat-interface">
                            <div className="chat-history">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`chat-message ${msg.sender}`}>
                                        <div className="message-bubble">
                                            <p>{msg.text}</p>
                                            <span className="message-time">{msg.time}</span>
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
                                <button type="submit" className="send-btn">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>

                        <div className="ticket-actions">
                            <button
                                className="action-btn resolve"
                                onClick={() => handleStatusChange('Resolved')}
                                disabled={currentTicket.status === 'Resolved'}
                            >
                                <CheckCircle size={16} /> Mark as Resolved
                            </button>
                            <button
                                className="action-btn progress"
                                onClick={() => handleStatusChange('In Progress')}
                                disabled={currentTicket.status === 'In Progress'}
                            >
                                <Clock size={16} /> In Progress
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Support;
