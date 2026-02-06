import { useState } from "react";
import { MessageCircle, Phone, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  createdAt: string;
  response?: string;
}

interface SupportHelpdeskProps {
  userType: string;
}

export function SupportHelpdesk({ userType }: SupportHelpdeskProps) {
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: "T001",
      subject: "Payment not received",
      description: "I sold maize 3 days ago but haven't received payment",
      status: "in-progress",
      createdAt: "2024-12-06",
    },
    {
      id: "T002",
      subject: "Weather alert not working",
      description: "Not receiving SMS weather alerts",
      status: "resolved",
      createdAt: "2024-12-01",
      response: "Your phone number has been verified and alerts are now active.",
    },
  ]);
  
  const [newTicket, setNewTicket] = useState({
    subject: "",
    description: "",
  });
  const [showNewTicket, setShowNewTicket] = useState(false);

  const handleSubmitTicket = () => {
    if (!newTicket.subject || !newTicket.description) return;
    
    const ticket: Ticket = {
      id: `T${String(tickets.length + 1).padStart(3, '0')}`,
      subject: newTicket.subject,
      description: newTicket.description,
      status: "open",
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setTickets([ticket, ...tickets]);
    setNewTicket({ subject: "", description: "" });
    setShowNewTicket(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Open</Badge>;
      case "in-progress":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">In Progress</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">WhatsApp Support</h3>
                <p className="text-sm text-gray-500">Chat with us 24/7</p>
                <p className="text-sm text-green-600 mt-1">+255 XXX XXX XXX</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">SMS Helpline</h3>
                <p className="text-sm text-gray-500">Send HELP to</p>
                <p className="text-sm text-green-600 mt-1">15050</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Request Callback</h3>
                <p className="text-sm text-gray-500">We'll call you back</p>
                <p className="text-sm text-green-600 mt-1">Within 2 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Ticket Button */}
      {!showNewTicket && (
        <Button 
          onClick={() => setShowNewTicket(true)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Send className="mr-2 h-4 w-4" />
          Submit New Support Ticket
        </Button>
      )}

      {/* New Ticket Form */}
      {showNewTicket && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>New Support Ticket</CardTitle>
            <CardDescription>Describe your issue and we'll help you resolve it</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <input
                type="text"
                value={newTicket.subject}
                onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                placeholder="Brief description of your issue"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                placeholder="Provide more details about your issue..."
                rows={4}
                className="focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSubmitTicket}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Submit Ticket
              </Button>
              <Button 
                onClick={() => setShowNewTicket(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ticket List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Support Tickets</CardTitle>
          <CardDescription>Track your support requests and responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-500">#{ticket.id}</span>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <h4 className="font-medium">{ticket.subject}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                  <p className="text-xs text-gray-400 mt-2">Created: {ticket.createdAt}</p>
                </div>
                <div className="ml-4">
                  {ticket.status === "resolved" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
              </div>
              
              {ticket.response && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                  <p className="text-sm font-medium text-green-900 mb-1">Response:</p>
                  <p className="text-sm text-green-800">{ticket.response}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FAQ Quick Links */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>How do I receive marketplace payments?</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>How to upload crop photos for diagnosis?</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>How to join a farmer discussion group?</span>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>How to enable weather SMS alerts?</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
