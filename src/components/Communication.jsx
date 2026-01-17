import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';
import { Input } from './ui/input.jsx';
import { Button } from './ui/button.jsx';
import { Badge } from './ui/badge.jsx';
import { Textarea } from './ui/textarea.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs.jsx';
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar.jsx';
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

const tickets = {
  schools: [
    { id: 'SCH-001', from: 'Springfield Academy', subject: 'Admission portal access issue', status: 'Open', priority: 'High', time: '2 hours ago', category: 'Technical' },
    { id: 'SCH-002', from: 'Green Valley School', subject: 'Update school information', status: 'Pending', priority: 'Medium', time: '5 hours ago', category: 'Update' },
    { id: 'SCH-003', from: 'Riverside High', subject: 'Verification status inquiry', status: 'Resolved', priority: 'Low', time: '1 day ago', category: 'Query' },
  ],
  teachers: [
    { id: 'TCH-001', from: 'Priya Singh', subject: 'Job posting not visible', status: 'Open', priority: 'High', time: '1 hour ago', category: 'Technical' },
    { id: 'TCH-002', from: 'Vikram Sharma', subject: 'Profile verification needed', status: 'Pending', priority: 'Medium', time: '3 hours ago', category: 'Verification' },
  ],
  parents: [
    { id: 'PAR-001', from: 'Rajesh Kumar', subject: 'School comparison feature', status: 'Open', priority: 'Low', time: '4 hours ago', category: 'Feature' },
    { id: 'PAR-002', from: 'Sneha Gupta', subject: 'Unable to view vendor pricing', status: 'Pending', priority: 'Medium', time: '6 hours ago', category: 'Technical' },
  ],
  vendors: [
    { id: 'VEN-001', from: 'ABC Uniforms', subject: 'Product upload limit', status: 'Open', priority: 'High', time: '30 min ago', category: 'Technical' },
    { id: 'VEN-002', from: 'Book World', subject: 'Payment settlement delay', status: 'Pending', priority: 'High', time: '2 hours ago', category: 'Payment' },
  ],
};

const quickReplies = [
  'Thank you for reaching out. We are looking into this.',
  'Your request has been forwarded to the technical team.',
  'This has been resolved. Please check and confirm.',
  'We need more information to proceed. Please provide details.',
];

export function Communication() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      toast.success('Reply sent successfully');
      setReplyMessage('');
    }
  };

  const handleQuickReply = (reply) => {
    setReplyMessage(reply);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4 text-orange-600" />;
      case 'Pending': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      default: return null;
    }
  };

  const renderTicketList = (ticketList) => (
      <div className="space-y-3">
        {ticketList.map((ticket) => (
            <div
                key={ticket.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-[#2563EB] hover:bg-blue-50 cursor-pointer transition-all"
                onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{ticket.subject}</span>
                    <Badge variant="secondary" className="text-xs">
                      {ticket.id}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    <span>From: {ticket.from}</span>
                    <span>•</span>
                    <span>{ticket.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                      variant="secondary"
                      className={
                        ticket.priority === 'High'
                            ? 'bg-red-50 text-red-700'
                            : ticket.priority === 'Medium'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-gray-50 text-gray-700'
                      }
                  >
                    {ticket.priority}
                  </Badge>
                  {getStatusIcon(ticket.status)}
                </div>
              </div>
            </div>
        ))}
      </div>
  );

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#111827]">Communication Center</h1>
            <p className="text-gray-600 mt-1">Manage support tickets and platform communications.</p>
          </div>
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
                  <Input placeholder="Announcement title" className="mt-2" />
                </div>
                <div>
                  <Label>Message</Label>
                  <Textarea placeholder="Announcement message" className="mt-2" rows={4} />
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <Input placeholder="All users / Schools / Vendors / Teachers / Parents" className="mt-2" />
                </div>
                <Button className="w-full bg-[#16A34A] hover:bg-green-700">
                  Send Announcement
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket Lists */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="schools">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="schools">Schools</TabsTrigger>
                    <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    <TabsTrigger value="parents">Parents</TabsTrigger>
                    <TabsTrigger value="vendors">Vendors</TabsTrigger>
                  </TabsList>
                  <TabsContent value="schools" className="mt-4">
                    {renderTicketList(tickets.schools)}
                  </TabsContent>
                  <TabsContent value="teachers" className="mt-4">
                    {renderTicketList(tickets.teachers)}
                  </TabsContent>
                  <TabsContent value="parents" className="mt-4">
                    {renderTicketList(tickets.parents)}
                  </TabsContent>
                  <TabsContent value="vendors" className="mt-4">
                    {renderTicketList(tickets.vendors)}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Ticket Detail & Reply */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Ticket Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedTicket ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {selectedTicket.from.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm text-gray-900">{selectedTicket.from}</div>
                            <div className="text-xs text-gray-500">{selectedTicket.time}</div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="secondary">{selectedTicket.id}</Badge>
                          <div className="text-gray-900 mt-2">{selectedTicket.subject}</div>
                          <p className="text-sm text-gray-600 mt-2">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                          </p>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label>Quick Replies</Label>
                        <div className="grid grid-cols-1 gap-2 mt-2">
                          {quickReplies.map((reply, index) => (
                              <button
                                  key={index}
                                  onClick={() => handleQuickReply(reply)}
                                  className="text-left text-xs p-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 transition-colors"
                              >
                                {reply}
                              </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Your Reply</Label>
                        <Textarea
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            placeholder="Type your reply..."
                            className="mt-2"
                            rows={4}
                        />
                        <Button
                            onClick={handleSendReply}
                            className="w-full mt-2 bg-[#2563EB] hover:bg-[#1e40af]"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1" size="sm">
                          Mark Pending
                        </Button>
                        <Button className="flex-1 bg-[#16A34A] hover:bg-green-700" size="sm">
                          Resolve
                        </Button>
                      </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                      <MessageSquare className="w-12 h-12 mb-3" />
                      <p className="text-sm">Select a ticket to view details</p>
                    </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}