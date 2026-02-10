import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Headphones,
  Users,
  Globe,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner@2.0.3";

export function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Support request submitted successfully! We'll respond within 24 hours.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        subject: "",
        message: "",
        priority: "normal"
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactChannels = [
    {
      icon: Phone,
      title: "Call Us",
      description: "0800 CREOVA (273682)",
      details: "Toll-free from any network",
      color: "green",
      action: "Call Now"
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "+255 754 123 456",
      details: "Quick responses, 24/7",
      color: "emerald",
      action: "Chat on WhatsApp"
    },
    {
      icon: Mail,
      title: "Email",
      description: "support@creova.co.tz",
      details: "For detailed inquiries",
      color: "blue",
      action: "Send Email"
    },
    {
      icon: Globe,
      title: "SMS",
      description: "Send 'HELP' to 15566",
      details: "Works on basic phones",
      color: "purple",
      action: "Send SMS"
    }
  ];

  const supportTeam = [
    {
      name: "John Mwambene",
      role: "Senior Agricultural Advisor",
      specialty: "Crop Management",
      languages: ["English", "Swahili"],
      availability: "Mon-Fri, 8AM-6PM"
    },
    {
      name: "Grace Kilonzo",
      role: "Market Specialist",
      specialty: "Pricing & Sales",
      languages: ["English", "Swahili"],
      availability: "Mon-Sat, 9AM-5PM"
    },
    {
      name: "Ibrahim Salehe",
      role: "Technical Support",
      specialty: "App & Payments",
      languages: ["English", "Swahili", "Sukuma"],
      availability: "Daily, 7AM-10PM"
    }
  ];

  const officeLocations = [
    {
      city: "Dar es Salaam",
      address: "Plot 123, Pugu Road, Ilala",
      phone: "+255 22 123 4567",
      hours: "Mon-Fri: 8AM-5PM"
    },
    {
      city: "Morogoro",
      address: "Kilakala Road, Near SUA",
      phone: "+255 23 456 7890",
      hours: "Mon-Sat: 8AM-4PM"
    },
    {
      city: "Arusha",
      address: "Ngaramtoni, Agricultural Hub",
      phone: "+255 27 789 0123",
      hours: "Mon-Fri: 9AM-5PM"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <Card className="bg-[#2E7D32] text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <Headphones className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Contact Support</h1>
          </div>
          <p className="text-green-100">
            We're here to help! Reach out through any channel that works best for you
          </p>
          <div className="flex items-center gap-2 mt-4 p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Clock className="h-5 w-5" />
            <span>Average Response Time: Less than 2 hours</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact Channels */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactChannels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className={`p-3 bg-${channel.color}-100 rounded-lg w-fit mb-3`}>
                  <Icon className={`h-6 w-6 text-${channel.color}-600`} />
                </div>
                <h3 className="font-bold mb-1">{channel.title}</h3>
                <p className="text-sm font-medium text-gray-900 mb-1">{channel.description}</p>
                <p className="text-xs text-gray-600 mb-3">{channel.details}</p>
                <Button size="sm" variant="outline" className="w-full">
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Support Request Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Submit a Support Request
          </CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you within 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+255 XXX XXX XXX"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <div className="flex gap-2 mt-2">
                {["low", "normal", "high", "urgent"].map((priority) => (
                  <button
                    key={priority}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority })}
                    className={`px-4 py-2 rounded-lg border transition-all capitalize ${
                      formData.priority === priority
                        ? priority === "urgent"
                          ? "bg-red-600 text-white border-red-600"
                          : priority === "high"
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-green-600 text-white border-green-600"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue or question in detail..."
                rows={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Please provide as much detail as possible to help us assist you better
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full gap-2" 
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Support Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Support Team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Our Support Team
          </CardTitle>
          <CardDescription>
            Meet the experts ready to help you succeed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportTeam.map((member, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-[#2E7D32] rounded-full flex items-center justify-center text-white font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-bold">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{member.specialty}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {member.languages.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{member.availability}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Office Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Office Locations
          </CardTitle>
          <CardDescription>
            Visit us in person for hands-on support and training
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {officeLocations.map((location, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{location.city}</h3>
                    <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{location.phone}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{location.hours}</span>
                      </p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      Get Directions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Support */}
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-2">Emergency Support</h3>
              <p className="text-red-800 mb-3">
                For urgent issues affecting your crops, livestock, or pending transactions, contact our 24/7 emergency hotline.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="destructive" className="gap-2">
                  <Phone className="h-4 w-4" />
                  Call Emergency: 0800 999 999
                </Button>
                <Button variant="outline" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp Emergency
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="bg-[#2E7D32] text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-6 w-6" />
            <h3 className="text-xl font-bold">We're Here for You</h3>
          </div>
          <p className="text-green-100 mb-4">
            Over 50,000 farmers trust CREOVA support. Our team has helped resolve 98% of issues within 24 hours with an average satisfaction rating of 4.8/5.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-green-100">Farmers Supported</p>
            </div>
            <div>
              <p className="text-3xl font-bold">98%</p>
              <p className="text-sm text-green-100">Resolution Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold">4.8/5</p>
              <p className="text-sm text-green-100">Satisfaction Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}