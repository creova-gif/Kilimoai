import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Smartphone, MessageSquare, Phone, Send, 
  ArrowRight, Volume2, CheckCircle
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

export function SMSUSSDSimulator() {
  const [ussdCode, setUssdCode] = useState("*384*96#");
  const [smsMessage, setSmsMessage] = useState("");
  const [ussdScreen, setUssdScreen] = useState(0);
  const [smsHistory, setSmsHistory] = useState<Array<{from: string, message: string, time: string}>>([
    { from: "CREOVA", message: "Welcome to CREOVA Agri-AI! Reply HELP for commands", time: "10:23 AM" }
  ]);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "calling" | "playing">("idle");

  const ussdMenus = [
    {
      title: "CREOVA Agri-AI",
      options: [
        "1. Crop Advisory",
        "2. Market Prices",
        "3. Weather Alerts",
        "4. My Wallet",
        "5. Sell Produce",
        "6. Get Credit Score"
      ]
    },
    {
      title: "Crop Advisory",
      options: [
        "Select your crop:",
        "1. Maize",
        "2. Rice",
        "3. Beans",
        "4. Sunflower",
        "0. Back"
      ]
    },
    {
      title: "Maize Advisory - Today",
      options: [
        "🌱 Week 8 of growth",
        "💧 Water: 2x daily",
        "🌿 Fertilizer due in 3 days",
        "⚠️ Rain expected tomorrow",
        "",
        "Reply to SMS for details",
        "0. Back"
      ]
    }
  ];

  const smsCommands = {
    "HELP": "CREOVA Commands:\nPRICE [crop]\nWEATHER\nADVICE [crop]\nSELL [crop] [kg]\nWALLET\nCREDIT",
    "PRICE MAIZE": "Maize prices today:\nArusha: 800 TZS/kg\nDodoma: 750 TZS/kg\nMwanza: 820 TZS/kg\n\nReply SELL to list your maize",
    "WEATHER": "Weather forecast - Arusha:\nToday: 28°C, Light rain\nTomorrow: 26°C, Heavy rain\nSat: 29°C, Sunny\n\nPlant protection advised!",
    "ADVICE MAIZE": "Maize - Week 8:\n✅ Apply top-dressing fertilizer\n💧 Increase watering\n🐛 Check for fall armyworm\n📱 Open app for AI chat",
    "WALLET": "CREOVA Wallet:\nBalance: 245,000 TZS\nPoints: 1,240\n\nReply PAY to make payment\nReply CASH to withdraw",
    "CREDIT": "Your Credit Score: 72/100\nGrade: Good\nMax Loan: 5M TZS\nRate: 12% p.a.\n\nReply APPLY to get loan offers"
  };

  const handleUssdNavigate = (option: number) => {
    if (option === 0) {
      setUssdScreen(Math.max(0, ussdScreen - 1));
    } else if (ussdScreen === 0 && option === 1) {
      setUssdScreen(1);
    } else if (ussdScreen === 1 && option === 1) {
      setUssdScreen(2);
    } else if (ussdScreen === 0) {
      // Simulate other menu items
      alert(`Feature ${option} - Coming in USSD interface!`);
    }
  };

  const handleSendSMS = () => {
    if (!smsMessage.trim()) return;
    
    const newMessage = {
      from: "You",
      message: smsMessage,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    setSmsHistory([...smsHistory, newMessage]);
    
    // Simulate response
    setTimeout(() => {
      const response = smsCommands[smsMessage.toUpperCase() as keyof typeof smsCommands] || 
        "Sorry, I didn't understand. Reply HELP for commands.";
      
      setSmsHistory(prev => [...prev, {
        from: "CREOVA",
        message: response,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
    
    setSmsMessage("");
  };

  const handleVoiceCall = () => {
    setVoiceStatus("calling");
    setTimeout(() => {
      setVoiceStatus("playing");
      setTimeout(() => {
        setVoiceStatus("idle");
      }, 8000);
    }, 2000);
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl mb-2">SMS/USSD/Voice Channels</h1>
        <p className="text-gray-600">Offline-first farmer access - no smartphone needed!</p>
      </div>

      <Alert className="bg-green-50 border-green-200">
        <Smartphone className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-900">
          <strong>Tanzania Reality:</strong> 78% of smallholder farmers use feature phones. 
          CREOVA works on ANY phone - SMS, USSD, and voice calls for zero-literacy farmers.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="ussd" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ussd">USSD (*384*96#)</TabsTrigger>
          <TabsTrigger value="sms">SMS (15096)</TabsTrigger>
          <TabsTrigger value="voice">Voice IVR</TabsTrigger>
        </TabsList>

        {/* USSD Tab */}
        <TabsContent value="ussd">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* USSD Simulator */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Feature Phone Simulator
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Dial {ussdCode} from any phone
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Phone Screen */}
                <div className="bg-gray-100 rounded-2xl p-6 text-black">
                  <div className="bg-white rounded-lg p-4 shadow-inner min-h-[300px]">
                    <div className="text-center mb-4">
                      <Badge className="bg-green-600">Session Active</Badge>
                    </div>
                    
                    <div className="text-sm font-mono">
                      <p className="mb-3">{ussdMenus[ussdScreen].title}</p>
                      {ussdMenus[ussdScreen].options.map((option, index) => (
                        <p key={index} className="mb-1">{option}</p>
                      ))}
                    </div>

                    {/* USSD Input */}
                    <div className="mt-6 flex gap-2">
                      <Input
                        placeholder="Enter option..."
                        className="text-center"
                        maxLength={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.currentTarget.value) {
                            handleUssdNavigate(parseInt(e.currentTarget.value));
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button size="sm" variant="outline">Send</Button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-300">
                  <p>✅ Works on all phones (feature + smart)</p>
                  <p>✅ No internet required</p>
                  <p>✅ Instant response</p>
                  <p>✅ Free or low-cost</p>
                </div>
              </CardContent>
            </Card>

            {/* USSD Info */}
            <Card>
              <CardHeader>
                <CardTitle>USSD Features</CardTitle>
                <CardDescription>What farmers can do via USSD</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: <MessageSquare className="h-5 w-5 text-green-600" />,
                    title: "Crop Advisory",
                    description: "Get weekly crop care tips for your registered crops"
                  },
                  {
                    icon: <DollarSign className="h-5 w-5 text-green-600" />,
                    title: "Market Prices",
                    description: "Real-time prices for crops in nearby markets"
                  },
                  {
                    icon: <Phone className="h-5 w-5 text-orange-600" />,
                    title: "Wallet Balance",
                    description: "Check CREOVA wallet and loyalty points"
                  },
                  {
                    icon: <Smartphone className="h-5 w-5 text-green-600" />,
                    title: "Sell Produce",
                    description: "List crops for sale to connected buyers"
                  },
                  {
                    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                    title: "Credit Score",
                    description: "View AI credit score and loan eligibility"
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex gap-3 p-3 border rounded-lg">
                    {feature.icon}
                    <div>
                      <p className="font-medium">{feature.title}</p>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMS Simulator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  SMS Conversation
                </CardTitle>
                <CardDescription>
                  Send SMS to 15096 (CREOVA shortcode)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* SMS Thread */}
                <div className="bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
                  {smsHistory.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-3 ${msg.from === 'You' ? 'text-right' : 'text-left'}`}
                    >
                      <div className={`inline-block max-w-[80%] ${
                        msg.from === 'You' 
                          ? 'bg-green-600 text-white' 
                          : 'bg-white border'
                      } rounded-lg p-3`}>
                        <p className="text-sm whitespace-pre-line">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.from === 'You' ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SMS Input */}
                <div className="flex gap-2">
                  <Input
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="Type HELP to see commands..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSendSMS()}
                  />
                  <Button onClick={handleSendSMS} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                  <p className="font-medium mb-2">Quick Commands:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <code className="bg-white p-1 rounded">PRICE [crop]</code>
                    <code className="bg-white p-1 rounded">WEATHER</code>
                    <code className="bg-white p-1 rounded">ADVICE [crop]</code>
                    <code className="bg-white p-1 rounded">WALLET</code>
                    <code className="bg-white p-1 rounded">CREDIT</code>
                    <code className="bg-white p-1 rounded">HELP</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SMS Features */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Capabilities</CardTitle>
                <CardDescription>Two-way SMS communication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <MessageSquare className="h-4 w-4" />
                  <AlertDescription>
                    Farmers can receive and send SMS using any mobile network in Tanzania
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">Weather alerts, market updates, farming tips</p>
                  </div>

                  <div className="border-l-4 border-gray-500 pl-4 py-2">
                    <p className="font-medium">Two-Way Commands</p>
                    <p className="text-sm text-gray-600">Farmers can query prices, weather, advice</p>
                  </div>

                  <div className="border-l-4 border-gray-500 pl-4 py-2">
                    <p className="font-medium">Transaction Confirmations</p>
                    <p className="text-sm text-gray-600">GoPay payments, marketplace sales</p>
                  </div>

                  <div className="border-l-4 border-orange-500 pl-4 py-2">
                    <p className="font-medium">Multilingual Support</p>
                    <p className="text-sm text-gray-600">English & Swahili (Kiswahili)</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm mb-2">📊 <strong>SMS Statistics:</strong></p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Messages Sent</p>
                      <p className="text-xl">842K</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Response Rate</p>
                      <p className="text-xl">67%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cost per SMS</p>
                      <p className="text-xl">TZS 50</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Delivery Rate</p>
                      <p className="text-xl">98.5%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice IVR Tab */}
        <TabsContent value="voice">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Simulator */}
            <Card className="bg-gradient-to-br from-green-500 to-green-700 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Voice IVR Simulator
                </CardTitle>
                <CardDescription className="text-gray-100">
                  Call +255 XXX XXX XXX for voice guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-black rounded-lg p-6 text-center">
                  {voiceStatus === "idle" && (
                    <>
                      <Phone className="h-16 w-16 mx-auto mb-4 text-green-600" />
                      <p className="mb-4">Press the button to call CREOVA Voice Assistant</p>
                      <Button 
                        onClick={handleVoiceCall}
                        className="w-full bg-green-600 hover:bg-green-700 h-12"
                      >
                        <Phone className="h-5 w-5 mr-2" />
                        Call Now
                      </Button>
                    </>
                  )}

                  {voiceStatus === "calling" && (
                    <>
                      <div className="h-16 w-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                        <Phone className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-lg mb-2">Calling CREOVA...</p>
                      <p className="text-sm text-gray-600">Please wait</p>
                    </>
                  )}

                  {voiceStatus === "playing" && (
                    <>
                      <Volume2 className="h-16 w-16 mx-auto mb-4 text-green-600 animate-pulse" />
                      <p className="text-lg mb-2">🔊 Voice Message Playing</p>
                      <div className="text-left bg-gray-50 p-4 rounded-lg text-sm mb-4">
                        <p className="mb-2"><strong>English:</strong></p>
                        <p className="mb-3 italic text-gray-700">
                          "Welcome to CREOVA Agri-AI. For crop advisory, press 1. 
                          For market prices, press 2. For weather forecast, press 3..."
                        </p>
                        <p className="mb-2"><strong>Kiswahili:</strong></p>
                        <p className="italic text-gray-700">
                          "Karibu CREOVA Agri-AI. Kwa ushauri wa mazao, bonyeza 1. 
                          Kwa bei za soko, bonyeza 2. Kwa hali ya hewa, bonyeza 3..."
                        </p>
                      </div>
                      <Badge className="bg-green-600">Call Active - Auto-disconnect in 5s</Badge>
                    </>
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p>✅ Perfect for low-literacy farmers</p>
                  <p>✅ Available in English & Kiswahili</p>
                  <p>✅ Works on any phone network</p>
                  <p>✅ Toll-free or low-cost calling</p>
                </div>
              </CardContent>
            </Card>

            {/* Voice Features */}
            <Card>
              <CardHeader>
                <CardTitle>Voice IVR Features</CardTitle>
                <CardDescription>Audio-based farmer assistance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-orange-50 border-orange-200">
                  <Volume2 className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-900">
                    <strong>Zero Literacy Required:</strong> Voice IVR enables farmers who cannot read 
                    to access all CREOVA services through audio menus and voice commands.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {[
                    {
                      step: "1",
                      title: "Language Selection",
                      description: "Choose English or Kiswahili"
                    },
                    {
                      step: "2",
                      title: "Menu Navigation",
                      description: "Press numbers to navigate menus"
                    },
                    {
                      step: "3",
                      title: "Voice Instructions",
                      description: "Listen to farming tips and advice"
                    },
                    {
                      step: "4",
                      title: "SMS Follow-up",
                      description: "Detailed info sent via SMS after call"
                    }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 h-8 w-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                  <p className="font-medium mb-3">📞 Voice Services Available:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Weather forecast (3-day)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Market price announcements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Weekly crop care tips
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Wallet balance inquiry
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Agent/buyer connections
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Technology Integration */}
      <Card>
        <CardHeader>
          <CardTitle>Technology Partners</CardTitle>
          <CardDescription>Powering Tanzania's offline-first agricultural platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg text-center">
              <p className="font-semibold mb-2">Africa's Talking</p>
              <p className="text-sm text-gray-600">SMS & USSD Gateway</p>
              <Badge variant="outline" className="mt-2">Active</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="font-semibold mb-2">Twilio</p>
              <p className="text-sm text-gray-600">Voice IVR Platform</p>
              <Badge variant="outline" className="mt-2">Active</Badge>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <p className="font-semibold mb-2">All TZ Networks</p>
              <p className="text-sm text-gray-600">Vodacom, Tigo, Airtel, Halotel</p>
              <Badge variant="outline" className="mt-2">Integrated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DollarSign(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}