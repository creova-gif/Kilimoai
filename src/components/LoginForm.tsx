import image_e26027fb3aabd00c928ba655f087af31ac20983e from 'figma:asset/e26027fb3aabd00c928ba655f087af31ac20983e.png';
import React, { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Wheat, Mail, Lock, Phone, ArrowRight, Leaf, TrendingUp, Brain, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import logo from "figma:asset/9ef1fbe0081cc013ac53d20ae90d325e9b280b39.png";

interface LoginFormProps {
  onLogin: (identifier: string, password: string) => Promise<void>;
  loading: boolean;
}

export function LoginForm({ onLogin, loading }: LoginFormProps) {
  const [loginMethod, setLoginMethod] = useState<"phone" | "email">("phone");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginMethod === "phone" ? formData.phone : formData.email;
    await onLogin(identifier, formData.password);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full shadow-2xl border-0 overflow-hidden backdrop-blur-lg">
        {/* Animated Header with Gradient */}
        <div className="relative bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 p-8 md:p-10 text-white overflow-hidden">
          {/* Animated background blobs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.1, 0.2]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl"
          />
          
          <div className="relative z-10 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                <img 
                  src={image_e26027fb3aabd00c928ba655f087af31ac20983e}
                  alt="KILIMO Logo" 
                  className="h-16 w-16 md:h-20 md:w-20 object-contain"
                />
              </div>
            </motion.div>
            <motion.h1 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl md:text-4xl font-black mb-2"
            >
              Karibu Tena!
            </motion.h1>
            <motion.p 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-white/90 text-sm md:text-base font-medium"
            >
              Log in to KILIMO Agri-AI Suite
            </motion.p>
          </div>
        </div>

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as "phone" | "email")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12 mb-6 bg-gray-100 rounded-xl p-1">
                <TabsTrigger 
                  value="phone" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  <Phone className="h-4 w-4" />
                  <span className="hidden sm:inline">Phone Number</span>
                  <span className="sm:hidden">Phone</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="email" 
                  className="flex items-center gap-2 rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </TabsTrigger>
              </TabsList>

              <TabsContent value="phone" className="space-y-4 mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+255 XXX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all"
                      required={loginMethod === "phone"}
                    />
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <AlertCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 font-medium leading-relaxed">
                      Use the same phone number you registered with
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4 mt-0">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="farmer@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all"
                      required={loginMethod === "email"}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Enter your registered email address
                  </p>
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-12 pr-12 h-12 text-base border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-green-600 hover:text-green-700 font-semibold"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-13 rounded-xl shadow-lg text-base font-bold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Log In
                    <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Quick Features Preview */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-5 font-medium">
              What you'll get with KILIMO
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Brain, label: "AI Assistant", color: "green" },
                { icon: TrendingUp, label: "Live Prices", color: "blue" },
                { icon: Leaf, label: "50+ Tools", color: "emerald" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1) }}
                  className="text-center"
                >
                  <div className={`p-3 bg-${feature.color}-50 rounded-xl w-fit mx-auto mb-2 shadow-sm`}>
                    <feature.icon className={`h-5 w-5 text-${feature.color}-600`} />
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{feature.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}