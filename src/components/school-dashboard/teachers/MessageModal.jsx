import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Search, ArrowLeft, Plus, MessageSquare } from 'lucide-react';
import io from 'socket.io-client';
import { toast } from 'sonner';
import '../shared/SimpleModal.css';
import './MessageModal.css';

const ENDPOINT = import.meta.env.VITE_API_URL || '';
var socket;

const MessageModal = ({ isOpen, onClose, initialRecipient, currentUser }) => {
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socketConnected, setSocketConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');
    
    // New Message Search State
    const [isSearching, setIsSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);
    
    const [showSidebar, setShowSidebar] = useState(true);

    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const pollingIntervalRef = useRef(null);
    const activeConversationRef = useRef(null);

    // Timestamp Formatter
    const formatTimestamp = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        
        const timeOptions = { hour: '2-digit', minute: '2-digit' };
        if (isToday) {
            return `Today ${date.toLocaleTimeString([], timeOptions)}`;
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    // Initialize Socket
    useEffect(() => {
        if (!isOpen || !currentUser) return;
        
        socket = io(ENDPOINT, { withCredentials: true });
        socket.emit('setup', currentUser);
        socket.on('connected', () => setSocketConnected(true));

        socket.on('message received', (newMessageReceived) => {
            const currentActive = activeConversationRef.current;
            if (currentActive && currentActive._id === newMessageReceived.conversation) {
                setMessages(prev => [...prev, newMessageReceived]);
                markAsRead(currentActive._id);
            } else {
                fetchConversations();
            }
        });

        socket.on('typing', (data) => {
            if (activeConversation && data.roomId === activeConversation._id) setIsTyping(true);
        });
        
        socket.on('stop typing', (data) => {
            if (activeConversation && data.roomId === activeConversation._id) setIsTyping(false);
        });

        return () => {
            socket.disconnect();
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, [isOpen, currentUser]);

    // Polling Fallback
    useEffect(() => {
        if (isOpen && !socketConnected && activeConversation && !activeConversation.isNew) {
            pollingIntervalRef.current = setInterval(() => {
                fetchMessagesSilent(activeConversation._id);
            }, 5000);
        } else {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
    }, [isOpen, socketConnected, activeConversation]);

    // Fetch initial conversations on mount
    useEffect(() => {
        if (isOpen) {
            fetchConversations();
        } else {
            setActiveConversation(null);
            setMessages([]);
            setShowSidebar(true);
            setError('');
        }
    }, [isOpen]);

    // Initial recipient logic when clicked from TeacherDirectory
    useEffect(() => {
        if (initialRecipient && isOpen && conversations.length > 0) {
            const existingConv = conversations.find(c => 
                c.participants.some(p => p._id === initialRecipient.userId)
            );
            
            if (existingConv) {
                selectConversation(existingConv);
            } else {
                setActiveConversation({
                    isNew: true,
                    participants: [initialRecipient],
                    recipientId: initialRecipient.userId
                });
                setMessages([]);
                setShowSidebar(false);
            }
        }
    }, [initialRecipient, isOpen, conversations.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, loadingMessages]);

    const fetchConversations = async () => {
        setLoadingConversations(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${ENDPOINT}/api/messages/conversations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations');
        } finally {
            setLoadingConversations(false);
        }
    };

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setSearchingUsers(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${ENDPOINT}/api/admin/users?search=${query}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                // Filter out current user from results
                setSearchResults(data.filter(u => u._id !== currentUser._id));
            }
        } catch (error) {
            console.error('User search failed');
        } finally {
            setSearchingUsers(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (isSearching && searchTerm) {
                searchUsers(searchTerm);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, isSearching]);

    const fetchMessages = async (convId) => {
        setLoadingMessages(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${ENDPOINT}/api/messages/conversations/${convId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setMessages(data);
            }
        } catch (error) {
            toast.error('Failed to load messages');
        } finally {
            setLoadingMessages(false);
        }
    };

    const fetchMessagesSilent = async (convId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${ENDPOINT}/api/messages/conversations/${convId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.length !== messages.length) {
                setMessages(data);
            }
        } catch (e) {}
    };

    const markAsRead = async (convId) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`${ENDPOINT}/api/messages/conversations/${convId}/read`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (e) {}
    };

    const selectConversation = (conv) => {
        setActiveConversation(conv);
        activeConversationRef.current = conv;
        if (socketConnected && !conv.isNew) socket.emit('join chat', conv._id);
        if (!conv.isNew) fetchMessages(conv._id);
        else setMessages([]);
        setShowSidebar(false);
        setIsSearching(false);
    };

    const startNewChat = (user) => {
        const existingConv = conversations.find(c => 
            c.participants.some(p => p._id === user._id)
        );
        
        if (existingConv) {
            selectConversation(existingConv);
        } else {
            setActiveConversation({
                isNew: true,
                participants: [user],
                recipientId: user._id
            });
            setMessages([]);
            setShowSidebar(false);
            setIsSearching(false);
        }
    };

    const getRecipientDetails = (conv) => {
        if (!conv) return null;
        if (conv.isNew) return conv.participants[0];
        const participants = Array.isArray(conv.participants) ? conv.participants : [];
        const otherParticipant = participants.filter(p => (p._id || p) !== currentUser._id)[0];
        return otherParticipant || participants[0];
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        const content = newMessage;
        setNewMessage('');
        setError('');
        setIsSending(true);
        
        if (socketConnected) socket.emit('stop typing', { roomId: activeConversation?._id });

        try {
            const token = localStorage.getItem('token');
            let res;
            if (activeConversation.isNew) {
                res = await fetch(`${ENDPOINT}/api/messages/conversations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ recipientId: activeConversation.recipientId, content })
                });
                const data = await res.json();
                if (res.ok) {
                    if (socketConnected) socket.emit('new message', data.message);
                    setMessages([data.message]);
                    setActiveConversation(data.conversation);
                    if (socketConnected) socket.emit('join chat', data.conversation._id);
                    fetchConversations();
                } else {
                    setError(data.message || 'Failed to send');
                    setNewMessage(content); // restore
                }
            } else {
                res = await fetch(`${ENDPOINT}/api/messages/conversations/${activeConversation._id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                    body: JSON.stringify({ content })
                });
                const data = await res.json();
                if (res.ok) {
                    if (socketConnected) socket.emit('new message', data);
                    setMessages(prev => [...prev, data]);
                } else {
                    setError(data.message || 'Failed to send');
                    setNewMessage(content);
                }
            }
        } catch (error) {
            setError('Network error. Check connection.');
            setNewMessage(content);
        } finally {
            setIsSending(false);
        }
    };

    const handleTyping = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected || !activeConversation || activeConversation.isNew) return;
        if (!isTyping) {
            setIsTyping(true);
            socket.emit('typing', { roomId: activeConversation._id });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop typing', { roomId: activeConversation._id });
            setIsTyping(false);
        }, 3000);
    };

    if (!isOpen) return null;
    const recipient = getRecipientDetails(activeConversation);

    return (
        <div className="simple-modal-overlay">
            <div className="message-modal-container">
                <div className="message-modal-header">
                    <div className="header-left-group">
                        {!showSidebar && (
                            <button className="back-btn" onClick={() => setShowSidebar(true)}>
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <h2>Messages</h2>
                    </div>
                    <button className="simple-modal-close" onClick={onClose}><X size={24} /></button>
                </div>

                <div className="message-modal-body">
                    <div className={`message-sidebar ${!showSidebar ? 'hide-mobile' : ''}`}>
                        <div className="sidebar-search">
                            <Search size={16} />
                            <input 
                                type="text" 
                                placeholder={isSearching ? "Search people..." : "Search conversations..."} 
                                value={isSearching ? searchTerm : ''}
                                onChange={(e) => {
                                    if (!isSearching) setIsSearching(true);
                                    setSearchTerm(e.target.value);
                                }}
                            />
                            {isSearching && (
                                <button className="clear-search-btn" onClick={() => { setIsSearching(false); setSearchTerm(''); }}>×</button>
                            )}
                        </div>

                        {!isSearching && (
                            <button className="new-chat-floating-btn" onClick={() => setIsSearching(true)}>
                                <Plus size={20} /> New Message
                            </button>
                        )}
                        
                        <div className="conversations-list">
                            {isSearching ? (
                                <div className="search-results-area">
                                    <p className="search-label">{searchTerm ? 'People' : 'Type to search staff/parents'}</p>
                                    {searchingUsers ? (
                                        <div className="search-loading">Searching...</div>
                                    ) : searchResults.length === 0 && searchTerm ? (
                                        <div className="no-results">No users found.</div>
                                    ) : (
                                        searchResults.map(user => (
                                            <div key={user._id} className="search-result-item" onClick={() => startNewChat(user)}>
                                                <img src={user.photo || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`} alt="avatar" />
                                                <div className="search-user-info">
                                                    <span className="user-name">{user.firstName} {user.lastName}</span>
                                                    <span className="user-role">{user.role}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : loadingConversations ? (
                                Array(5).fill(0).map((_, i) => <div key={i} className="skeleton-item" />)
                            ) : conversations.length === 0 ? (
                                <div className="no-conv-state">
                                    <MessageSquare size={40} />
                                    <p>No conversations yet</p>
                                    <button className="btn-start-chat" onClick={() => setIsSearching(true)}>Start Chatting</button>
                                </div>
                            ) : (
                                conversations.map(conv => {
                                    const otherUser = getRecipientDetails(conv);
                                    if (!otherUser) return null;
                                    const unreadCount = conv.unreadCount ? conv.unreadCount[currentUser._id] || 0 : 0;
                                    return (
                                        <div 
                                            key={conv._id} 
                                            className={`conversation-item ${activeConversation?._id === conv._id ? 'active' : ''}`}
                                            onClick={() => selectConversation(conv)}
                                        >
                                            <img src={otherUser.photo || `https://ui-avatars.com/api/?name=${otherUser.firstName}+${otherUser.lastName}&background=random`} alt="avatar" className="conv-avatar" />
                                            <div className="conv-details">
                                                <div className="conv-header-row">
                                                    <span className="conv-name">{otherUser.firstName} {otherUser.lastName}</span>
                                                    <span className="conv-time">{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
                                                </div>
                                                <div className="conv-preview-row">
                                                    <span className="conv-last-msg">{conv.lastMessage}</span>
                                                    {unreadCount > 0 && <span className="conv-unread-badge">{unreadCount}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className={`message-chat-area ${showSidebar ? 'hide-mobile' : ''}`}>
                        {activeConversation && recipient ? (
                            <>
                                <div className="chat-header">
                                    <img src={recipient.photo || `https://ui-avatars.com/api/?name=${recipient.firstName}+${recipient.lastName}&background=random`} alt="avatar" className="chat-avatar" />
                                    <div className="chat-recipient-info">
                                        <h3>{(recipient.firstName && recipient.lastName) ? `${recipient.firstName} ${recipient.lastName}` : (recipient.firstName || recipient.name || 'User')}</h3>
                                        <p>{recipient.role || 'Staff'}</p>
                                    </div>
                                </div>
                                
                                <div className="chat-messages">
                                    {loadingMessages ? (
                                        <div className="loading-overlay-chat"><span className="spinner"></span></div>
                                    ) : messages.length === 0 ? (
                                        <div className="chat-empty-centered">
                                            <div className="empty-icon-circle"><Send size={32} /></div>
                                            <h3>No messages yet</h3>
                                            <p>Start the conversation with {recipient.firstName || recipient.name}.</p>
                                        </div>
                                    ) : (
                                        messages.map(msg => {
                                            const isMe = (msg.sender?._id || msg.sender) === currentUser?._id;
                                            return (
                                                <div key={msg._id} className={`chat-bubble-wrapper ${isMe ? 'sent' : 'received'}`}>
                                                    <span className="msg-sender-name">{isMe ? 'You' : `${msg.sender?.firstName || 'User'}`}</span>
                                                    <div className="chat-bubble">{msg.content}</div>
                                                    <span className="chat-time">{formatTimestamp(msg.sentAt)}</span>
                                                </div>
                                            );
                                        })
                                    )}
                                    {isTyping && <div className="typing-bubble">...</div>}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form className="chat-input-area" onSubmit={handleSendMessage}>
                                    {error && <div className="chat-error-inline">{error}</div>}
                                    <input 
                                        type="text" 
                                        placeholder="Type a message..." 
                                        value={newMessage}
                                        onChange={handleTyping}
                                        disabled={isSending}
                                    />
                                    <button type="submit" className="send-btn" disabled={!newMessage.trim() || isSending}>
                                        {isSending ? <span className="spinner-sm"></span> : <Send size={18} />}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="chat-empty-state">
                                <Search size={48} />
                                <h3>Your Messages</h3>
                                <p>Select a conversation to start chatting.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
