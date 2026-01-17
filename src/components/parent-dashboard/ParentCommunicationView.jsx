import React from 'react';
import { MessageSquare, Send, User } from 'lucide-react';
import './ParentViews.css';

const ParentCommunicationView = () => {
    const messages = [
        { id: 1, from: 'Mr. Johnson (Math Teacher)', subject: 'Student Progress Update', date: 'Dec 5, 2025', read: false },
        { id: 2, from: 'School Admin', subject: 'Parent-Teacher Meeting Notice', date: 'Dec 4, 2025', read: true },
        { id: 3, from: 'Ms. Smith (Science Teacher)', subject: 'Lab Report Feedback', date: 'Dec 3, 2025', read: true },
    ];

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
                        <div className="messages-list">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`message-item ${!msg.read ? 'unread' : ''}`}>
                                    <div className="message-avatar">
                                        <User size={20} />
                                    </div>
                                    <div className="message-content">
                                        <div className="message-header">
                                            <h4>{msg.from}</h4>
                                            <span className="message-date">{msg.date}</span>
                                        </div>
                                        <p className="message-subject">{msg.subject}</p>
                                    </div>
                                    {!msg.read && <div className="unread-indicator"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentCommunicationView;

