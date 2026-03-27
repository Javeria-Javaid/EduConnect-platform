import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Plus, Search } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar.jsx';
import io from 'socket.io-client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog.jsx';
import { Label } from './ui/label.jsx';
import { toast } from 'sonner';

const ENDPOINT = import.meta.env.VITE_API_URL || 'http://localhost:5000';
var socket;

export function Communication() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // New Conversation State
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  // Announcement State
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementTarget, setAnnouncementTarget] = useState('All Users');
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  const messagesEndRef = useRef(null);
  const selectedConversationRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const meRes = await fetch(`${ENDPOINT}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (meRes.ok) {
        const me = await meRes.json();
        const user = me.data || me;
        setCurrentUser(user);
        
        // Setup Socket
        socket = io(ENDPOINT);
        socket.emit('setup', user);
        
        socket.on('message received', (newMessage) => {
          const currentSelected = selectedConversationRef.current;
          if (currentSelected && currentSelected._id === newMessage.conversation) {
            setMessages(prev => [...prev, newMessage]);
          } else {
             fetchConversations();
          }
        });
      }
    };
    init();
    fetchConversations();
    
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ENDPOINT}/api/messages/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setConversations(await res.json());
    } catch (e) {
      toast.error('Failed to load inbox');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (convId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ENDPOINT}/api/messages/conversations/${convId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setMessages(await res.json());
    } catch (e) {
      toast.error('Failed to load chat history');
    }
  };

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    selectedConversationRef.current = conv;
    fetchMessages(conv._id);
    if (socket) socket.emit('join chat', conv._id);
  };

  const handleSearchUsers = async (query) => {
    setSearchTerm(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${ENDPOINT}/api/admin/users?search=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setSearchResults(await res.json());
    } catch (e) {}
    finally { setSearching(false); }
  };

  const startNewConversation = async (user) => {
      // Check if conversation already exists
      const existing = conversations.find(c => c.participants.some(p => p._id === user._id));
      if (existing) {
          handleSelectConversation(existing);
      } else {
          // Temporarily set a "dummy" conversation for the view until the first message is sent
          // Or just use the recipient ID in the state
          setSelectedConversation({
              isNew: true,
              participants: [currentUser, user],
              _id: 'new'
          });
          setMessages([]);
      }
      setIsSearchDialogOpen(false);
      setSearchTerm('');
      setSearchResults([]);
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim() || !selectedConversation) return;

    setIsSending(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      
      if (selectedConversation.isNew) {
          const recipient = selectedConversation.participants.find(p => p._id !== currentUser?._id);
          res = await fetch(`${ENDPOINT}/api/messages/conversations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ recipientId: recipient._id, content: replyMessage })
          });
          if (res.ok) {
              const data = await res.json();
              setSelectedConversation(data.conversation);
              setMessages([data.message]);
              setReplyMessage('');
              fetchConversations();
              if (socket) {
                  socket.emit('join chat', data.conversation._id);
                  socket.emit('new message', data.message);
              }
          }
      } else {
          res = await fetch(`${ENDPOINT}/api/messages/conversations/${selectedConversation._id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify({ content: replyMessage })
          });
          if (res.ok) {
              const data = await res.json();
              setMessages(prev => [...prev, data]);
              setReplyMessage('');
              if (socket) socket.emit('new message', data);
          }
      }
    } catch (e) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendAnnouncement = async () => {
    if (!announcementTitle || !announcementMessage) {
      toast.error('Please fill in both title and message');
      return;
    }

    setSendingAnnouncement(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/announcement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: announcementTitle,
          message: announcementMessage,
          targetAudience: announcementTarget
        })
      });

      if (res.ok) {
        toast.success('Announcement sent to all recipients!');
        setAnnouncementTitle('');
        setAnnouncementMessage('');
        // We could also close the dialog here if we had access to its state, 
        // but Radix UI Dialog usually handles it via open/onOpenChange.
      } else {
        toast.error('Failed to send announcement');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setSendingAnnouncement(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  const renderConversationList = (role) => {
    const filtered = conversations.filter(c => {
      const other = c.participants.find(p => p._id !== currentUser?._id);
      return other?.role === role;
    });

    if (filtered.length === 0) return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <MessageSquare className="w-8 h-8 mb-2 opacity-20" />
        <p className="text-sm">No conversations with {role}s</p>
      </div>
    );

    return (
      <div className="space-y-3">
        {filtered.map((conv) => {
          const other = conv.participants.find(p => p._id !== currentUser?._id);
          return (
            <div
                key={conv._id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedConversation?._id === conv._id ? 'border-[#2563EB] bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                onClick={() => handleSelectConversation(conv)}
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {other?.firstName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{other?.firstName} {other?.lastName}</div>
                    <div className="text-xs text-gray-500 line-clamp-1 mt-1">{conv.lastMessage}</div>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400">
                  {new Date(conv.lastMessageAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#111827]">Communication Center</h1>
            <p className="text-gray-600 mt-1">Manage support tickets and platform communications.</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
                <DialogTrigger asChild>
                <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    New Message
                </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Conversation</DialogTitle>
                    <DialogDescription>Search for a user to start a conversation</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
                        <Input 
                            className="pl-8" 
                            placeholder="Search by name or email..." 
                            value={searchTerm}
                            onChange={(e) => handleSearchUsers(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {searching ? (
                            <p className="text-center text-sm text-gray-400 py-4">Searching...</p>
                        ) : searchResults.length > 0 ? (
                            searchResults.map(user => (
                                <div 
                                    key={user._id} 
                                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition-all"
                                    onClick={() => startNewConversation(user)}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="text-[10px]">{user.firstName?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                                            <p className="text-[10px] text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <Plus className="h-4 w-4 text-gray-300" />
                                </div>
                            ))
                        ) : searchTerm && (
                            <p className="text-center text-sm text-gray-400 py-4">No users found</p>
                        )}
                    </div>
                </div>
                </DialogContent>
            </Dialog>

            <Dialog>
                <DialogTrigger asChild>
                <Button className="bg-[#2563EB] hover:bg-[#1e40af]">
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                </Button>
                </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
                <DialogDescription>Send a platform-wide announcement to users</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                 <div>
                  <Label>Title</Label>
                  <Input 
                    placeholder="Announcement title" 
                    className="mt-2" 
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea 
                    placeholder="Announcement message" 
                    className="mt-2" 
                    rows={4} 
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                  />
                </div>
                 <div>
                  <Label>Target Audience</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
                    value={announcementTarget}
                    onChange={(e) => setAnnouncementTarget(e.target.value)}
                  >
                    <option value="All Users">All Users</option>
                    <option value="Schools">Schools Only</option>
                    <option value="Teachers">Teachers Only</option>
                    <option value="Parents">Parents Only</option>
                    <option value="Vendors">Vendors Only</option>
                  </select>
                </div>
                <Button 
                  className="w-full bg-[#16A34A] hover:bg-green-700"
                  onClick={handleSendAnnouncement}
                  disabled={sendingAnnouncement}
                >
                  {sendingAnnouncement ? 'Sending...' : 'Send Announcement'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Lists */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Conversations</CardTitle>
                <Badge variant="outline">{conversations.length} Active</Badge>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <Tabs defaultValue="teacher" className="h-full flex flex-col">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="school_admin">Schools</TabsTrigger>
                    <TabsTrigger value="teacher">Teachers</TabsTrigger>
                    <TabsTrigger value="parent">Parents</TabsTrigger>
                    <TabsTrigger value="vendor">Vendors</TabsTrigger>
                  </TabsList>
                  <div className="mt-4 flex-1 overflow-y-auto pr-2">
                    <TabsContent value="school_admin">
                      {renderConversationList('school_admin')}
                    </TabsContent>
                    <TabsContent value="teacher">
                      {renderConversationList('teacher')}
                    </TabsContent>
                    <TabsContent value="parent">
                      {renderConversationList('parent')}
                    </TabsContent>
                    <TabsContent value="vendor">
                      {renderConversationList('vendor')}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Detail & Reply */}
          <div>
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b">
                <CardTitle>Chat View</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {selectedConversation ? (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 ? (
                          <div className="text-center text-gray-400 mt-20">No messages yet.</div>
                        ) : (
                          messages.map((msg, i) => {
                            const isMe = msg.sender?._id === currentUser?._id || msg.sender === currentUser?._id;
                            return (
                              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${isMe ? 'bg-[#2563EB] text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                                  {msg.content}
                                  <div className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                        <div ref={messagesEndRef} />
                      </div>

                      <div className="p-4 border-t bg-gray-50">
                        <div className="flex gap-2">
                          <Textarea
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              placeholder="Type your reply..."
                              className="resize-none min-h-[40px] flex-1 bg-white"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendReply();
                                }
                              }}
                          />
                          <Button
                              onClick={handleSendReply}
                              className="bg-[#2563EB] hover:bg-[#1e40af] h-auto aspect-square p-0 w-12"
                              disabled={isSending || !replyMessage.trim()}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm">Select a conversation to start chatting</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}