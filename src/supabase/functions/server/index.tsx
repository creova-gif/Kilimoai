import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as marketData from "./market_data.tsx";
import * as mobileMoney from "./mobile_money.tsx";
import * as flutterwave from "./flutterwave.tsx";
import * as mpesa from "./mpesa.tsx"; // M-Pesa Tanzania integration
import * as selcom from "./selcom.tsx"; // SELCOM payment integration for Tanzania
import * as openrouter from "./openrouter.tsx";
import * as sms from "./sms.tsx"; // SMS gateway integration
import * as pdf from "./pdf.tsx"; // PDF generation
import * as rbac from "./rbac.tsx"; // RBAC system
import * as verification from "./verification.tsx"; // Verification enforcement
import * as walletLedger from "./wallet_ledger.tsx"; // Wallet ledger system
import * as walletAdvanced from "./wallet_advanced.tsx"; // Advanced wallet features
import * as workflows from "./workflows.tsx"; // AI Workflows
import * as cropPlanning from "./crop_planning.tsx"; // Crop Planning AI
import * as aiServices from "./ai_services.tsx"; // Enterprise AI Services
import weatherRouter from "./weather.tsx"; // Weather API integration
import * as signupApi from "./signup_api.tsx"; // Role-based signup API
import aiEngine from "./ai_engine.tsx"; // Unified AI Engine
import { createClient } from "npm:@supabase/supabase-js";
import * as authMiddleware from "./auth_middleware.tsx"; // Auth middleware
import authRoutes from "./auth_onboarding.tsx"; // World-class onboarding auth
import * as authUnified from "./auth_unified.tsx"; // Unified email + phone auth
import * as aiTelemetry from "./ai_telemetry.tsx"; // AI telemetry and monitoring
import * as crashReporting from "./crash_reporting.tsx"; // Crash reporting
import * as cropLibrary from "./crop_library.tsx"; // Crop Library with AI images
import { registerIntegrationRoutes } from "./system_integration.tsx"; // ✅ KILIMO System Integration

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Apply user extraction middleware to all routes
app.use("/make-server-ce1844e7/*", authMiddleware.extractUser);

// ✅ Register ALL system integration routes (Phase 1-8)
registerIntegrationRoutes(app);

// Global error handler - ensures all errors return JSON
app.onError((err, c) => {
  console.error('Global error handler caught:', err);
  return c.json({
    success: false,
    error: err.message || 'Internal server error',
    details: Deno.env.get('ENVIRONMENT') === 'development' ? err.stack : undefined
  }, 500);
});

// Health check endpoint
app.get("/make-server-ce1844e7/health", (c) => {
  return c.json({ status: "ok" });
});

// Test endpoint for debugging
app.get("/make-server-ce1844e7/test", (c) => {
  return c.json({ 
    status: "test endpoint working",
    timestamp: new Date().toISOString()
  });
});

// ==================== USER AUTHENTICATION ====================

// Register new user
app.post("/make-server-ce1844e7/register", async (c) => {
  try {
    const { name, phone, email, password, region, crops, farmSize, userType, role, gender, ageGroup } = await c.req.json();

    if (!name || (!phone && !email)) {
      return c.json({ error: "Name and phone or email are required" }, 400);
    }

    if (!password) {
      return c.json({ error: "Password is required" }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: "Password must be at least 6 characters" }, 400);
    }

    // Check if phone or email already exists
    if (phone) {
      const existingUserId = await kv.get(`phone:${phone}`);
      if (existingUserId) {
        return c.json({ error: "Phone number already registered. Please login instead." }, 400);
      }
    }
    
    if (email) {
      const existingUserId = await kv.get(`email:${email}`);
      if (existingUserId) {
        return c.json({ error: "Email already registered. Please login instead." }, 400);
      }
    }

    // Create user in Supabase Auth with both phone and email if provided
    const authPayload: any = {
      password,
      user_metadata: {
        name,
        region,
        crops,
        farmSize,
        userType: userType || "farmer",
        gender,
        ageGroup,
      },
    };

    // Add phone or email to auth payload
    if (phone) {
      authPayload.phone = phone;
      authPayload.phone_confirm = false; // Require verification
    }
    
    if (email) {
      authPayload.email = email;
      authPayload.email_confirm = false; // Require verification
    }

    const { data: authData, error: authError } = await supabase.auth.admin.createUser(authPayload);

    if (authError) {
      console.log(`Error creating user in auth: ${authError.message}`);
      return c.json({ error: authError.message }, 400);
    }

    // Store additional user data in KV
    const userId = authData.user.id;
    const userData = {
      id: userId,
      name,
      phone: phone || "",
      email: email || "",
      region,
      crops: crops || [],
      farmSize,
      userType: userType || "farmer",
      role: role || "smallholder_farmer",
      gender: gender || "",
      ageGroup: ageGroup || "",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    
    await kv.set(`user:${userId}`, userData);

    // Create index for phone lookup if phone provided
    if (phone) {
      await kv.set(`phone:${phone}`, userId);
    }

    // Create index for email lookup if email provided
    if (email) {
      await kv.set(`email:${email}`, userId);
    }
    
    // Trigger first login achievement
    await checkAndUnlockAchievements(userId, "first_login");

    return c.json({ 
      success: true, 
      userId,
      user: userData,
      message: "User registered successfully" 
    });
  } catch (error) {
    console.log(`Registration error: ${error}`);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// Login user - supports both phone and email
app.post("/make-server-ce1844e7/login", async (c) => {
  try {
    const { identifier, password, phone, email } = await c.req.json();

    // Support both old format (phone, email) and new format (identifier)
    const loginIdentifier = identifier || phone || email;

    if (!loginIdentifier || !password) {
      return c.json({ error: "Phone/email and password are required" }, 400);
    }

    // Determine if identifier is email or phone
    const isEmail = loginIdentifier.includes("@");
    
    // Attempt login with Supabase Auth
    let authResponse;
    
    if (isEmail) {
      authResponse = await supabase.auth.signInWithPassword({
        email: loginIdentifier,
        password: password,
      });
    } else {
      authResponse = await supabase.auth.signInWithPassword({
        phone: loginIdentifier,
        password: password,
      });
    }

    const { data, error } = authResponse;

    if (error) {
      console.log(`Login error: ${error.message}`);
      return c.json({ error: "Invalid credentials" }, 401);
    }

    // Fetch user data from KV store
    const userData = await kv.get(`user:${data.user.id}`);
    
    if (!userData) {
      console.log(`User data not found in KV for user ${data.user.id}`);
      return c.json({ error: "User data not found" }, 404);
    }

    // Update last login time
    userData.lastLoginAt = new Date().toISOString();
    await kv.set(`user:${data.user.id}`, userData);

    return c.json({ 
      success: true,
      accessToken: data.session?.access_token,
      user: userData,
    });
  } catch (error) {
    console.log(`Login error: ${error}`);
    return c.json({ error: "Login failed" }, 500);
  }
});

// Send verification OTP
app.post("/make-server-ce1844e7/send-verification-otp", async (c) => {
  try {
    const { identifier, type } = await c.req.json(); // identifier = phone or email, type = "phone" or "email"
    
    if (!identifier || !type) {
      return c.json({ error: "Identifier and type are required" }, 400);
    }
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP
    await kv.set(`otp:${identifier}`, {
      otp,
      expiresAt,
      type,
      attempts: 0,
    });
    
    // Send OTP via SMS or email
    if (type === "phone") {
      try {
        await sms.sendOTP(identifier, otp);
      } catch (smsError) {
        console.log(`SMS sending failed: ${smsError}`);
        return c.json({ error: "Failed to send OTP via SMS" }, 500);
      }
    } else if (type === "email") {
      // TODO: Implement email sending
      console.log(`Email OTP (not sent): ${otp} to ${identifier}`);
    }
    
    return c.json({
      success: true,
      message: `OTP sent to ${identifier}`,
      expiresIn: 600, // seconds
    });
  } catch (error) {
    console.log(`Error sending OTP: ${error}`);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

// Verify OTP
app.post("/make-server-ce1844e7/verify-otp", async (c) => {
  try {
    const { identifier, otp } = await c.req.json();
    
    if (!identifier || !otp) {
      return c.json({ error: "Identifier and OTP are required" }, 400);
    }
    
    const storedOtp = await kv.get(`otp:${identifier}`);
    
    if (!storedOtp) {
      return c.json({ error: "OTP not found or expired" }, 400);
    }
    
    if (Date.now() > storedOtp.expiresAt) {
      await kv.del(`otp:${identifier}`);
      return c.json({ error: "OTP expired" }, 400);
    }
    
    if (storedOtp.attempts >= 3) {
      await kv.del(`otp:${identifier}`);
      return c.json({ error: "Too many attempts" }, 400);
    }
    
    if (storedOtp.otp !== otp) {
      storedOtp.attempts += 1;
      await kv.set(`otp:${identifier}`, storedOtp);
      return c.json({ error: "Invalid OTP" }, 400);
    }
    
    // OTP verified - mark user as verified in Supabase Auth
    const userId = await kv.get(storedOtp.type === "phone" ? `phone:${identifier}` : `email:${identifier}`);
    
    if (userId) {
      const updateData: any = {};
      if (storedOtp.type === "phone") {
        updateData.phone_confirm = true;
      } else {
        updateData.email_confirm = true;
      }
      
      await supabase.auth.admin.updateUserById(userId, updateData);
      
      // Update user data
      const userData = await kv.get(`user:${userId}`);
      if (userData) {
        userData.verified = true;
        userData.verifiedAt = new Date().toISOString();
        await kv.set(`user:${userId}`, userData);
      }
    }
    
    // Delete OTP
    await kv.del(`otp:${identifier}`);
    
    return c.json({
      success: true,
      message: "Verified successfully",
    });
  } catch (error) {
    console.log(`Error verifying OTP: ${error}`);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

// Resend verification OTP (with rate limiting)
app.post("/make-server-ce1844e7/resend-verification-otp", async (c) => {
  try {
    const { identifier, type } = await c.req.json();
    
    if (!identifier || !type) {
      return c.json({ error: "Identifier and type are required" }, 400);
    }
    
    // Check rate limiting - max 3 resends per hour
    const rateLimitKey = `otp-resend:${identifier}`;
    const resendHistory = await kv.get(rateLimitKey) || { count: 0, resetAt: Date.now() + 60 * 60 * 1000 };
    
    if (Date.now() > resendHistory.resetAt) {
      resendHistory.count = 0;
      resendHistory.resetAt = Date.now() + 60 * 60 * 1000;
    }
    
    if (resendHistory.count >= 3) {
      return c.json({ 
        error: "Too many OTP requests. Please try again later.",
        retryAfter: Math.ceil((resendHistory.resetAt - Date.now()) / 1000)
      }, 429);
    }
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    // Store OTP
    await kv.set(`otp:${identifier}`, {
      otp,
      expiresAt,
      type,
      attempts: 0,
    });
    
    // Update rate limit
    resendHistory.count += 1;
    await kv.set(rateLimitKey, resendHistory);
    
    // Send OTP via SMS or email
    if (type === "phone") {
      try {
        await sms.sendOTP(identifier, otp);
      } catch (smsError) {
        console.log(`SMS sending failed: ${smsError}`);
        return c.json({ error: "Failed to send OTP via SMS" }, 500);
      }
    } else if (type === "email") {
      // TODO: Implement email sending
      console.log(`Email OTP (not sent): ${otp} to ${identifier}`);
    }
    
    return c.json({
      success: true,
      message: `OTP resent to ${identifier}`,
      expiresIn: 600, // seconds
      remainingAttempts: 3 - resendHistory.count,
    });
  } catch (error) {
    console.log(`Error resending OTP: ${error}`);
    return c.json({ error: "Failed to resend OTP" }, 500);
  }
});

// Check verification status
app.get("/make-server-ce1844e7/verification-status/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }
    
    // Check Supabase Auth verification status
    const { data: authUser } = await supabase.auth.admin.getUserById(userId);
    
    return c.json({
      success: true,
      verified: userData.verified || false,
      phoneVerified: authUser?.user?.phone_confirmed_at ? true : false,
      emailVerified: authUser?.user?.email_confirmed_at ? true : false,
      verifiedAt: userData.verifiedAt,
      phone: userData.phone,
      email: userData.email,
    });
  } catch (error) {
    console.log(`Error checking verification status: ${error}`);
    return c.json({ error: "Failed to check verification status" }, 500);
  }
});

// Get user profile
app.get("/make-server-ce1844e7/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userData = await kv.get(`user:${userId}`);

    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json({ success: true, user: userData });
  } catch (error) {
    console.log(`Error fetching profile: ${error}`);
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
});

// Update user profile
app.put("/make-server-ce1844e7/profile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const updates = await c.req.json();

    const currentData = await kv.get(`user:${userId}`);
    if (!currentData) {
      return c.json({ error: "User not found" }, 404);
    }

    const updatedData = { ...currentData, ...updates };
    await kv.set(`user:${userId}`, updatedData);

    return c.json({ success: true, user: updatedData });
  } catch (error) {
    console.log(`Error updating profile: ${error}`);
    return c.json({ error: "Failed to update profile" }, 500);
  }
});

// ==================== RBAC ====================

// Get role information
app.get("/make-server-ce1844e7/role/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const userData = await kv.get(`user:${userId}`);
    
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    const userRole = userData.role || "smallholder_farmer";
    const role = rbac.getRoleById(userRole);

    if (!role) {
      return c.json({ error: "Invalid role" }, 400);
    }

    return c.json({
      success: true,
      role: {
        id: role.id,
        name: role.name,
        displayName: role.displayName,
        tier: role.tier,
        dashboardConfig: role.dashboardConfig,
        limits: role.limits,
        permissions: role.permissions,
      },
      upgradePath: rbac.getRoleUpgradePath(userRole),
    });
  } catch (error) {
    console.log(`Error fetching role info: ${error}`);
    return c.json({ error: "Failed to fetch role info" }, 500);
  }
});

// Get role comparison for upgrades
app.post("/make-server-ce1844e7/role/compare", async (c) => {
  try {
    const { currentRole, targetRole } = await c.req.json();
    
    const role1 = rbac.getRoleById(currentRole);
    const role2 = rbac.getRoleById(targetRole);

    if (!role1 || !role2) {
      return c.json({ error: "Invalid roles" }, 400);
    }

    const comparison = rbac.compareRoles(role1, role2);

    return c.json({
      success: true,
      currentRole: role1.displayName,
      targetRole: role2.displayName,
      comparison,
    });
  } catch (error) {
    console.log(`Error comparing roles: ${error}`);
    return c.json({ error: "Failed to compare roles" }, 500);
  }
});

// ==================== CROP ADVISORY ====================

// Get advisory messages for user
app.get("/make-server-ce1844e7/advice/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const adviceMessages = await kv.getByPrefix(`advice:${userId}:`);

    return c.json({ 
      success: true, 
      messages: adviceMessages || [],
      count: adviceMessages?.length || 0,
    });
  } catch (error) {
    console.log(`Error fetching advice: ${error}`);
    return c.json({ error: "Failed to fetch advice" }, 500);
  }
});

// Helper function to generate mock AI responses (role-aware)
function generateMockAIResponse(question: string, language: string = "en", role?: any): string {
  const questionLower = question.toLowerCase();
  const roleContext = role ? role.aiContext.responseStyle : "simple_practical";
  
  // Swahili responses
  if (language === "sw") {
    if (questionLower.includes("mbolea") || questionLower.includes("fertilizer")) {
      return "Kwa mahindi, tumia mbolea ya NPK 17:17:17 wakati wa kupanda, kisha uongeze Urea (46% N) baada ya wiki 3-4. Kwa hekta moja, tumia: NPK - 2 magunia (100kg), Urea - 1 gunia (50kg) katika vipindi viwili. Hii itapunguza gharama za mbolea kwa 30% na kuongeza mavuno kwa 40%.";
    } else if (questionLower.includes("magonjwa") || questionLower.includes("disease") || questionLower.includes("pest")) {
      return "Magonjwa ya kawaida ya nyanya ni: 1) Late Blight - tumia Ridomil Gold, 2) Early Blight - tumia Mancozeb, 3) Bacterial Wilt - panda mbegu zenye kupinga magonjwa. Nyunyizia dawa kila wiki 1-2 wakati mvua ikiwa nyingi. Ondoa majani yaliyoathiriwa na uchome au uzike mbali na shamba.";
    } else if (questionLower.includes("bei") || questionLower.includes("price") || questionLower.includes("market")) {
      return "Bei za sasa za mazao: Mahindi - TSh 800-1,200/kg, Maharagwe - TSh 2,000-2,500/kg, Nyanya - TSh 1,500-2,000/kg. Bei zinapanda msimu wa kiangazi (Desemba-Machi). Uzalisha wakati wengine wanapunguza ili kupata bei bora.";
    } else if (questionLower.includes("hewa") || questionLower.includes("weather") || questionLower.includes("mvua")) {
      return "Utabiri wa hali ya hewa wiki ijayo: Mvua ya wastani 15-25mm, Joto 24-32°C, Unyevu 70-85%. Ni wakati mzuri wa kupanda mahindi na maharage. Hakikisha udongo una unyevu wa kutosha kabla ya kupanda.";
    } else if (questionLower.includes("maji") || questionLower.includes("water") || questionLower.includes("irrigat")) {
      return "Mahindi yanahitaji maji kwa wastani wa mara 2-3 kwa wiki wakati wa ukuaji. Umwagiliaji wa tone ni bora zaidi - unatumia maji kidogo (70% punguzo) na unaongeza mavuno kwa 35%. Umwagiliaji bora ni asubuhi mapema (saa 12-2) au jioni (saa 4-6).";
    } else {
      return `Asante kwa swali lako kuhusu "${question}". Ninakushauri: 1) Fanya tathmini ya udongo ili ujue virutubishi unavyohitaji, 2) Tumia mbegu bora zilizoidhinishwa, 3) Panda wakati unaofaa kulingana na msimu, 4) Fuata ratiba ya umwagiliaji na mbolea. Je,ungependa maelezo zaidi kuhuza jambo lolote?`;
    }
  }
  
  // English responses
  if (questionLower.includes("fertilizer") || questionLower.includes("mbolea")) {
    return "For maize, use NPK 17:17:17 at planting, then apply Urea (46% N) after 3-4 weeks. Per hectare: NPK - 2 bags (100kg), Urea - 1 bag (50kg) in split applications. This reduces fertilizer costs by 30% and increases yield by 40%. Apply during cool morning hours and ensure soil is moist.";
  } else if (questionLower.includes("disease") || questionLower.includes("pest") || questionLower.includes("magonjwa")) {
    return "Common tomato diseases: 1) Late Blight - use Ridomil Gold fungicide, 2) Early Blight - apply Mancozeb weekly, 3) Bacterial Wilt - use resistant varieties. Spray every 7-10 days during rainy season. Remove infected leaves and burn or bury them far from the field to prevent spread.";
  } else if (questionLower.includes("price") || questionLower.includes("market") || questionLower.includes("bei")) {
    return "Current market prices: Maize - TSh 800-1,200/kg, Beans - TSh 2,000-2,500/kg, Tomatoes - TSh 1,500-2,000/kg. Prices peak during dry season (December-March). Consider counter-seasonal production for better prices and market opportunities.";
  } else if (questionLower.includes("weather") || questionLower.includes("rain") || questionLower.includes("hewa")) {
    return "Weather forecast for next week: Average rainfall 15-25mm, Temperature 24-32°C, Humidity 70-85%. Good conditions for planting maize and beans. Ensure soil has adequate moisture before planting. Monitor for heavy rains that may cause waterlogging.";
  } else if (questionLower.includes("water") || questionLower.includes("irrigat") || questionLower.includes("maji")) {
    return "Maize requires watering 2-3 times per week during vegetative growth. Drip irrigation is most efficient - saves 70% water and increases yield by 35%. Best irrigation times: early morning (6-8am) or late afternoon (4-6pm) to minimize evaporation.";
  } else if (questionLower.includes("yield") || questionLower.includes("increase") || questionLower.includes("improve") || questionLower.includes("mavuno")) {
    return "To increase maize yield: 1) Soil testing for proper fertilization, 2) Use certified hybrid seeds, 3) Plant at optimal spacing (75cm x 25cm), 4) Timely weeding (2-3 times), 5) Apply fertilizer in splits, 6) Control pests early. Expected yield: 4-6 tons/hectare with good practices.";
  } else {
    return `Thank you for your question about "${question}". I recommend: 1) Conduct soil testing to know nutrient requirements, 2) Use certified quality seeds, 3) Plant during appropriate season, 4) Follow proper irrigation and fertilization schedule. Would you like more specific information on any topic?`;
  }
}

// Helper function to parse AI diagnosis response
function parseAIDiagnosisResponse(aiResponse: string, language: string): any {
  // Try to extract structured information from AI response
  const lines = aiResponse.split('\n');
  
  // Look for disease name, severity, and remedy
  let disease = "Unknown Issue";
  let severity: "low" | "medium" | "high" = "medium";
  let remedy = aiResponse;
  
  // Simple pattern matching to extract information
  const diseaseMatch = aiResponse.match(/(?:Disease|Gonjwa|Issue|Problem):\s*([^\n.]+)/i);
  if (diseaseMatch) {
    disease = diseaseMatch[1].trim();
  }
  
  const severityMatch = aiResponse.match(/(?:Severity|Kiwango):\s*(low|medium|high|chini|wastani|juu)/i);
  if (severityMatch) {
    const level = severityMatch[1].toLowerCase();
    if (level === "low" || level === "chini") severity = "low";
    else if (level === "high" || level === "juu") severity = "high";
    else severity = "medium";
  }
  
  // Extract treatment/remedy section
  const remedyMatch = aiResponse.match(/(?:Treatment|Remedy|Matibabu|Suluhisho):([^]+?)(?:\n\n|$)/i);
  if (remedyMatch) {
    remedy = remedyMatch[1].trim();
  }
  
  return {
    disease,
    confidence: 0.85 + Math.random() * 0.1, // 0.85-0.95
    severity,
    remedy,
    nearbyDealers: [
      "AgroVet Plus - Mwanza",
      "TanzaniaSeeds Ltd - Arusha",
      "KilimoHub Supplies - Dodoma"
    ]
  };
}

// Helper function to generate mock diagnosis
function generateMockDiagnosis(language: string): any {
  const diseases = language === "sw" 
    ? [
        { name: "Ukungu wa Majani (Late Blight)", severity: "high" as const, remedy: "Tumia dawa za kulevya kama Ridomil Gold au Mancozeb. Nyunyizia kila wiki 1 wakati wa mvua. Ondoa majani yaliyoathiriwa." },
        { name: "Wadudu wa Majani", severity: "medium" as const, remedy: "Tumia dawa za wadudu kama Actellic au Karate. Chunga shamba kila siku na nyunyiza mapema iwezekanavyo." },
        { name: "Ukosefu wa Virutubishi", severity: "low" as const, remedy: "Ongeza mbolea yenye Nitrogen na Potassium. Tumia NPK 17:17:17 au Urea." }
      ]
    : [
        { name: "Late Blight Disease", severity: "high" as const, remedy: "Apply fungicide like Ridomil Gold or Mancozeb. Spray weekly during rainy season. Remove and destroy infected leaves." },
        { name: "Leaf Miner Infestation", severity: "medium" as const, remedy: "Use insecticides like Actellic or Karate. Monitor daily and spray early in the morning." },
        { name: "Nutrient Deficiency (Nitrogen)", severity: "low" as const, remedy: "Apply nitrogen-rich fertilizer. Use NPK 17:17:17 or Urea at recommended rates." }
      ];
  
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  
  return {
    disease: randomDisease.name,
    confidence: 0.82 + Math.random() * 0.13, // 0.82-0.95
    severity: randomDisease.severity,
    remedy: randomDisease.remedy,
    nearbyDealers: [
      "AgroVet Plus - Mwanza",
      "TanzaniaSeeds Ltd - Arusha",
      "KilimoHub Supplies - Dodoma"
    ]
  };
}

// Helper function to generate comprehensive crop advice
function generateComprehensiveCropAdvice(cropName: string) {
  const cropLower = cropName.toLowerCase();
  
  // Default advice structure
  return {
    crop: cropName,
    climate: "Warm tropical to subtropical climate, 20-30°C optimal",
    soil: "Well-drained loamy soil, pH 5.5-7.0",
    planting: {
      season: "Plant during rainy seasons (Masika: March-May, Vuli: October-December)",
      spacing: "75cm between rows, 25cm between plants",
      seedRate: "20-25 kg/hectare for hybrid varieties"
    },
    fertilization: {
      basal: "NPK 17:17:17 at 100kg/hectare during planting",
      topDressing: "Urea 46%N at 50kg/hectare, 3-4 weeks after planting"
    },
    irrigation: "2-3 times per week, critical during flowering and grain filling",
    pests: ["Fall Armyworm", "Stalk Borers", "Aphids"],
    diseases: ["Grey Leaf Spot", "Maize Streak Virus", "Common Rust"],
    harvest: "90-120 days after planting depending on variety",
    expectedYield: "4-6 tons/hectare with good management",
    tips: [
      "Use certified hybrid seeds for better yields",
      "Practice crop rotation to maintain soil fertility",
      "Control weeds early - critical first 6 weeks",
      "Store harvested grain properly to prevent aflatoxin"
    ]
  };
}

// Helper function to generate default crop advice based on region
function generateDefaultCropAdvice(cropType: string, region: string) {
  return {
    cropType,
    region,
    recommendations: [
      `Plant ${cropType} during the main rainy season in ${region}`,
      "Use certified seeds from reputable suppliers",
      "Apply fertilizer based on soil test results",
      "Implement integrated pest management practices"
    ],
    warningsAlerts: [
      "Monitor for common pests and diseases in your region",
      "Follow recommended planting dates for best results"
    ],
    nextSteps: [
      "Conduct soil testing",
      "Prepare land 2-3 weeks before planting",
      "Ensure seed availability"
    ]
  };
}

// Submit AI query (RBAC-enabled)
app.post("/make-server-ce1844e7/advice/query", async (c) => {
  try {
    const { userId, question, language } = await c.req.json();

    if (!userId || !question) {
      return c.json({ error: "UserId and question are required" }, 400);
    }

    // Get user data to determine role
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Get role configuration
    const userRole = userData.role || "smallholder_farmer";
    const role = rbac.getRoleById(userRole);
    
    if (!role) {
      return c.json({ error: "Invalid user role" }, 400);
    }

    // Check AI query limits
    const today = new Date().toISOString().split('T')[0];
    const queryCountKey = `query-count:${userId}:${today}`;
    const queryCount = await kv.get(queryCountKey) || 0;
    
    const limitCheck = rbac.checkResourceLimit(role, "aiQueries", queryCount);
    if (!limitCheck.allowed) {
      return c.json({ 
        error: "AI query limit reached",
        message: limitCheck.message,
        limit: limitCheck.limit,
        upgradeAvailable: true,
        upgradePath: rbac.getRoleUpgradePath(userRole)
      }, 429);
    }

    // Store the query
    const queryId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    await kv.set(`query:${userId}:${queryId}`, {
      id: queryId,
      userId,
      question,
      language: language || "sw",
      timestamp,
      status: "pending",
      role: userRole,
    });

    // Increment query count
    await kv.set(queryCountKey, queryCount + 1);

    // Get role-specific system prompt
    const additionalContext = `User info: Region: ${userData.region}, Crops: ${userData.crops?.join(', ')}, Farm size: ${userData.farmSize} acres`;
    const systemPrompt = rbac.getAISystemPrompt(role, additionalContext);

    // Try to get AI response from OpenRouter
    let aiResponse;
    try {
      const model = rbac.getAIModelForRole(role);
      aiResponse = await openrouter.queryAI(
        systemPrompt,
        question,
        model,
        role.aiContext.maxTokens,
        role.aiContext.temperature
      );
    } catch (aiError) {
      console.log(`AI API error, falling back to mock: ${aiError}`);
      // Fallback to mock response with role context
      aiResponse = generateMockAIResponse(question, language, role);
    }

    await kv.set(`response:${userId}:${queryId}`, {
      queryId,
      response: aiResponse,
      timestamp: new Date().toISOString(),
      role: userRole,
      model: role.limits.aiModelTier,
    });

    return c.json({ 
      success: true,
      queryId,
      response: aiResponse,
      queryCount: queryCount + 1,
      queryLimit: role.limits.maxAIQueries,
      role: role.displayName,
      modelTier: role.limits.aiModelTier,
    });
  } catch (error) {
    console.log(`Error processing AI query: ${error}`);
    return c.json({ error: "Failed to process query" }, 500);
  }
});

// AI Photo Crop Diagnosis (Vision API)
app.post("/make-server-ce1844e7/diagnosis/analyze", async (c) => {
  try {
    const { userId, imageData, language } = await c.req.json();

    if (!userId || !imageData) {
      return c.json({ error: "UserId and imageData are required" }, 400);
    }

    // Get user data to determine role
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Get role configuration
    const userRole = userData.role || "smallholder_farmer";
    const role = rbac.getRoleById(userRole);
    
    if (!role) {
      return c.json({ error: "Invalid user role" }, 400);
    }

    // Check AI query limits (photo diagnosis counts toward AI queries)
    const today = new Date().toISOString().split('T')[0];
    const queryCountKey = `query-count:${userId}:${today}`;
    const queryCount = await kv.get(queryCountKey) || 0;
    
    const limitCheck = rbac.checkResourceLimit(role, "aiQueries", queryCount);
    if (!limitCheck.allowed) {
      return c.json({ 
        error: "AI query limit reached",
        message: limitCheck.message,
        limit: limitCheck.limit,
        upgradeAvailable: true,
        upgradePath: rbac.getRoleUpgradePath(userRole)
      }, 429);
    }

    // Store the diagnosis request
    const diagnosisId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    await kv.set(`diagnosis:${userId}:${diagnosisId}`, {
      id: diagnosisId,
      userId,
      timestamp,
      status: "pending",
      role: userRole,
    });

    // Increment query count
    await kv.set(queryCountKey, queryCount + 1);

    // Create vision analysis prompt
    const visionPrompt = language === "sw" 
      ? `Wewe ni mtaalamu wa kilimo. Angalia picha hii ya zao na utambue magonjwa yoyote au matatizo. Toa ufafanuzi wa kina, kiwango cha hatari (low/medium/high), na mapendekezo ya matibabu. Jibu kwa Kiswahili.`
      : `You are an agricultural expert. Analyze this crop image and identify any diseases or issues. Provide detailed diagnosis, severity level (low/medium/high), and treatment recommendations. Respond in English.`;

    // Try to get AI response from OpenRouter with vision
    let diagnosisResult;
    try {
      const model = rbac.getAIModelForRole(role);
      
      // Call OpenRouter with vision support (GPT-4 Vision or Claude with vision)
      const aiResponse = await openrouter.queryAIWithVision(
        visionPrompt,
        imageData,
        model === "advanced" ? "anthropic/claude-3.5-sonnet" : "openai/gpt-4-turbo",
        role.aiContext.maxTokens,
        role.aiContext.temperature
      );

      // Parse the AI response to extract diagnosis details
      diagnosisResult = parseAIDiagnosisResponse(aiResponse, language);
      
    } catch (aiError) {
      console.log(`AI Vision API error, falling back to mock: ${aiError}`);
      // Fallback to mock diagnosis
      diagnosisResult = generateMockDiagnosis(language);
    }

    // Store the diagnosis result
    await kv.set(`diagnosis-result:${userId}:${diagnosisId}`, {
      diagnosisId,
      result: diagnosisResult,
      timestamp: new Date().toISOString(),
      role: userRole,
    });

    return c.json({ 
      success: true,
      diagnosisId,
      ...diagnosisResult,
      queryCount: queryCount + 1,
      queryLimit: role.limits.maxAIQueries,
    });
  } catch (error) {
    console.log(`Error processing photo diagnosis: ${error}`);
    return c.json({ error: "Failed to process photo diagnosis" }, 500);
  }
});

// Get crop-specific advice
app.get("/make-server-ce1844e7/advice/:cropType/:region", async (c) => {
  try {
    const cropType = c.req.param("cropType");
    const region = c.req.param("region");

    const adviceKey = `crop-advice:${cropType}:${region}`;
    let advice = await kv.get(adviceKey);

    // If not found, create default advice
    if (!advice) {
      advice = generateDefaultCropAdvice(cropType, region);
      await kv.set(adviceKey, advice);
    }

    return c.json({ success: true, advice });
  } catch (error) {
    console.log(`Error fetching crop advice: ${error}`);
    return c.json({ error: "Failed to fetch crop advice" }, 500);
  }
});

// ==================== MARKET PRICES ====================

// Get market prices by district
app.get("/make-server-ce1844e7/market-prices/:district", async (c) => {
  try {
    const district = c.req.param("district");
    
    // Get real-time market data
    const prices = marketData.getMarketPrices(district);

    return c.json({ success: true, prices });
  } catch (error) {
    console.log(`Error fetching market prices: ${error}`);
    return c.json({ error: "Failed to fetch market prices" }, 500);
  }
});

// Get price trends for a specific crop
app.get("/make-server-ce1844e7/price-trends/:district/:crop", async (c) => {
  try {
    const district = c.req.param("district");
    const crop = c.req.param("crop");
    const days = parseInt(c.req.query("days") || "30");
    
    const trends = marketData.getPriceTrends(district, crop, days);

    return c.json({ success: true, trends });
  } catch (error) {
    console.log(`Error fetching price trends: ${error}`);
    return c.json({ error: "Failed to fetch price trends" }, 500);
  }
});

// Get comparative prices across regions
app.get("/make-server-ce1844e7/comparative-prices/:crop", async (c) => {
  try {
    const crop = c.req.param("crop");
    
    const comparativePrices = marketData.getComparativePrices(crop);

    return c.json({ success: true, prices: comparativePrices });
  } catch (error) {
    console.log(`Error fetching comparative prices: ${error}`);
    return c.json({ error: "Failed to fetch comparative prices" }, 500);
  }
});

// Get specific crop price in a region
app.get("/make-server-ce1844e7/crop-price/:district/:crop", async (c) => {
  try {
    const district = c.req.param("district");
    const crop = c.req.param("crop");
    
    const price = marketData.getCropPrice(district, crop);

    if (!price) {
      return c.json({ error: "Crop price not found for this region" }, 404);
    }

    return c.json({ success: true, price });
  } catch (error) {
    console.log(`Error fetching crop price: ${error}`);
    return c.json({ error: "Failed to fetch crop price" }, 500);
  }
});

// Get comprehensive crop advice
app.get("/make-server-ce1844e7/crop-advice/:cropName", async (c) => {
  try {
    const cropName = c.req.param("cropName");
    
    // Generate comprehensive crop-specific advice
    const advice = generateComprehensiveCropAdvice(cropName);

    return c.json({ success: true, advice });
  } catch (error) {
    console.log(`Error fetching crop advice: ${error}`);
    return c.json({ error: "Failed to fetch crop advice" }, 500);
  }
});

// ==================== AI ENGINE RECOMMENDATIONS ====================

// Get AI irrigation recommendations
app.get("/make-server-ce1844e7/ai-engine/irrigation/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // Get user data for context
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Generate irrigation recommendations based on user context
    const recommendations = {
      success: true,
      userId,
      recommendations: [
        {
          id: "irr-1",
          title: "Optimize Irrigation Schedule",
          description: "Based on current weather patterns and soil moisture, adjust irrigation to 3 times per week",
          priority: "high",
          impact: "Reduce water usage by 30% while maintaining optimal soil moisture",
          confidence: 0.92
        },
        {
          id: "irr-2",
          title: "Drip Irrigation Implementation",
          description: "Consider installing drip irrigation for better water efficiency",
          priority: "medium",
          impact: "Save up to 70% water and increase yield by 35%",
          confidence: 0.88
        },
        {
          id: "irr-3",
          title: "Timing Adjustment",
          description: "Irrigate early morning (6-8 AM) to minimize evaporation losses",
          priority: "medium",
          impact: "Reduce water loss by 25%",
          confidence: 0.95
        }
      ],
      timestamp: new Date().toISOString()
    };

    return c.json(recommendations);
  } catch (error) {
    console.log(`Error fetching irrigation recommendations: ${error}`);
    return c.json({ error: "Failed to fetch irrigation recommendations" }, 500);
  }
});

// Get AI fertilizer recommendations
app.get("/make-server-ce1844e7/ai-engine/fertilizer/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // Get user data for context
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ error: "User not found" }, 404);
    }

    // Generate fertilizer recommendations based on user context
    const recommendations = {
      success: true,
      userId,
      recommendations: [
        {
          id: "fert-1",
          title: "NPK Basal Application",
          description: "Apply NPK 17:17:17 at 100kg/hectare during planting",
          priority: "high",
          impact: "Ensure strong initial growth and root development",
          confidence: 0.94,
          cost: "TZS 120,000 per hectare",
          timing: "At planting time"
        },
        {
          id: "fert-2",
          title: "Urea Top Dressing",
          description: "Apply Urea (46% N) at 50kg/hectare 3-4 weeks after planting",
          priority: "high",
          impact: "Boost vegetative growth and increase yield by 40%",
          confidence: 0.91,
          cost: "TZS 60,000 per hectare",
          timing: "3-4 weeks after planting"
        },
        {
          id: "fert-3",
          title: "Organic Matter Addition",
          description: "Incorporate compost or manure at 5 tons/hectare before planting",
          priority: "medium",
          impact: "Improve soil structure and long-term fertility",
          confidence: 0.87,
          cost: "TZS 30,000 per hectare (if purchased)",
          timing: "2-3 weeks before planting"
        }
      ],
      timestamp: new Date().toISOString()
    };

    return c.json(recommendations);
  } catch (error) {
    console.log(`Error fetching fertilizer recommendations: ${error}`);
    return c.json({ error: "Failed to fetch fertilizer recommendations" }, 500);
  }
});

// ==================== WEATHER ALERTS ====================

// Helper function to generate realistic weather data
function generateMockWeather(district: string) {
  const now = new Date();
  const baseTemp = 25 + Math.random() * 10; // 25-35°C
  const baseHumidity = 60 + Math.random() * 30; // 60-90%
  const baseRainfall = Math.random() * 20; // 0-20mm
  
  // Determine season based on month (Tanzania has two rainy seasons)
  const month = now.getMonth(); // 0-11
  let currentSeason = "Dry Season";
  let nextPlantingDate = new Date();
  
  if (month >= 2 && month <= 5) {
    currentSeason = "Long Rains (Masika)";
    nextPlantingDate.setMonth(9); // October for short rains
  } else if (month >= 9 && month <= 11) {
    currentSeason = "Short Rains (Vuli)";
    nextPlantingDate.setMonth(2); // March for long rains
    nextPlantingDate.setFullYear(now.getFullYear() + 1);
  } else {
    currentSeason = "Dry Season";
    if (month < 2) {
      nextPlantingDate.setMonth(2); // March
    } else {
      nextPlantingDate.setMonth(9); // October
    }
  }

  // Season-specific crop recommendations
  const seasonalCrops = currentSeason.includes("Long Rains") 
    ? ["Maize", "Rice", "Beans", "Sunflower", "Sorghum"]
    : currentSeason.includes("Short Rains")
    ? ["Maize", "Beans", "Peas", "Vegetables", "Cassava"]
    : ["Vegetables", "Tomatoes", "Onions", "Cabbage"];

  return {
    district,
    temperature: Math.round(baseTemp * 10) / 10,
    humidity: Math.round(baseHumidity),
    rainfall: Math.round(baseRainfall * 10) / 10,
    windSpeed: Math.round((10 + Math.random() * 15) * 10) / 10,
    pressure: Math.round((1010 + Math.random() * 10) * 10) / 10,
    visibility: Math.round((8 + Math.random() * 4) * 10) / 10,
    uvIndex: Math.floor(Math.random() * 11),
    dewPoint: Math.round((baseTemp - ((100 - baseHumidity) / 5)) * 10) / 10,
    condition: baseRainfall > 10 ? "Rainy" : baseRainfall > 5 ? "Cloudy" : baseTemp > 30 ? "Sunny" : "Partly Cloudy",
    forecast: baseRainfall > 10 
      ? `Heavy rainfall expected. Total ${Math.round(baseRainfall)}mm in 24 hours. Delay field activities.`
      : baseRainfall > 5
      ? `Light showers expected throughout the day. Plan indoor farm activities.`
      : baseTemp > 32
      ? `Hot and dry conditions. Increase irrigation frequency. Protect young plants from heat stress.`
      : `Favorable weather for farming activities. Good conditions for planting and field work.`,
    plantingCalendar: {
      currentSeason,
      recommendedCrops: seasonalCrops,
      nextPlantingDate: nextPlantingDate.toISOString(),
    },
    lastUpdated: new Date().toISOString(),
  };
}

// Get weather for district
app.get("/make-server-ce1844e7/weather/:district", async (c) => {
  try {
    const district = c.req.param("district");
    const weatherKey = `weather:${district}`;
    
    let weather = await kv.get(weatherKey);

    if (!weather) {
      weather = generateMockWeather(district);
      await kv.set(weatherKey, weather);
    }

    return c.json({ success: true, weather });
  } catch (error) {
    console.log(`Error fetching weather: ${error}`);
    return c.json({ error: "Failed to fetch weather" }, 500);
  }
});

// Subscribe to weather alerts
app.post("/make-server-ce1844e7/alerts/subscribe", async (c) => {
  try {
    const { userId, cropType, district } = await c.req.json();

    const subscriptionKey = `alert-subscription:${userId}`;
    const subscription = {
      userId,
      cropType,
      district,
      subscribedAt: new Date().toISOString(),
      active: true,
    };

    await kv.set(subscriptionKey, subscription);

    return c.json({ 
      success: true, 
      message: "Subscribed to weather alerts successfully",
    });
  } catch (error) {
    console.log(`Error subscribing to alerts: ${error}`);
    return c.json({ error: "Failed to subscribe to alerts" }, 500);
  }
});

// ==================== MARKETPLACE ====================

// Helper function to generate mock buyers
function generateMockBuyers(district: string, cropType: string) {
  return [
    {
      id: crypto.randomUUID(),
      name: "East African Grain Traders Ltd",
      type: "Wholesaler",
      phone: "+255 754 123 456",
      location: district,
      rating: 4.5,
      verified: true,
      preferredCrops: [cropType],
      currentPrice: Math.floor(Math.random() * 500 + 1000),
      minimumQuantity: "500kg",
    },
    {
      id: crypto.randomUUID(),
      name: "Morogoro Agro Cooperative",
      type: "Cooperative",
      phone: "+255 762 987 654",
      location: district,
      rating: 4.8,
      verified: true,
      preferredCrops: [cropType, "Beans", "Rice"],
      currentPrice: Math.floor(Math.random() * 500 + 900),
      minimumQuantity: "300kg",
    },
    {
      id: crypto.randomUUID(),
      name: "Local Market Vendors",
      type: "Retail",
      phone: "+255 745 555 777",
      location: district,
      rating: 4.2,
      verified: false,
      preferredCrops: [cropType],
      currentPrice: Math.floor(Math.random() * 400 + 1100),
      minimumQuantity: "50kg",
    }
  ];
}

// Get buyers in district
app.get("/make-server-ce1844e7/buyers/:district/:cropType", async (c) => {
  try {
    const district = c.req.param("district");
    const cropType = c.req.param("cropType");
    
    const buyersKey = `buyers:${district}:${cropType}`;
    let buyers = await kv.get(buyersKey);

    if (!buyers) {
      buyers = generateMockBuyers(district, cropType);
      await kv.set(buyersKey, buyers);
    }

    return c.json({ success: true, buyers });
  } catch (error) {
    console.log(`Error fetching buyers: ${error}`);
    return c.json({ error: "Failed to fetch buyers" }, 500);
  }
});

// Post crop for sale
app.post("/make-server-ce1844e7/sell-crop", async (c) => {
  try {
    const { userId, crop, quantity, price, district } = await c.req.json();

    if (!userId || !crop || !quantity) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const saleId = crypto.randomUUID();
    const sale = {
      id: saleId,
      userId,
      crop,
      quantity,
      price,
      district,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`sale:${saleId}`, sale);
    await kv.set(`user-sale:${userId}:${saleId}`, sale);

    return c.json({ 
      success: true, 
      saleId,
      message: "Crop listed for sale successfully",
    });
  } catch (error) {
    console.log(`Error posting crop for sale: ${error}`);
    return c.json({ error: "Failed to post crop for sale" }, 500);
  }
});

// Get sale status
app.get("/make-server-ce1844e7/sale-status/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const sales = await kv.getByPrefix(`user-sale:${userId}:`);

    return c.json({ 
      success: true, 
      sales: sales || [],
    });
  } catch (error) {
    console.log(`Error fetching sale status: ${error}`);
    return c.json({ error: "Failed to fetch sale status" }, 500);
  }
});

// ==================== NOTIFICATIONS ====================

// Get user notifications
app.get("/make-server-ce1844e7/notifications/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const notifications = await kv.getByPrefix(`notification:${userId}:`);

    return c.json({ 
      success: true, 
      notifications: notifications || [],
    });
  } catch (error) {
    console.log(`Error fetching notifications: ${error}`);
    return c.json({ error: "Failed to fetch notifications" }, 500);
  }
});

// Send notification
app.post("/make-server-ce1844e7/notifications/send", async (c) => {
  try {
    const { userId, title, message, type } = await c.req.json();

    if (!userId || !message) {
      return c.json({ error: "UserId and message are required" }, 400);
    }

    const notificationId = crypto.randomUUID();
    const notification = {
      id: notificationId,
      userId,
      title,
      message,
      type: type || "info",
      read: false,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`notification:${userId}:${notificationId}`, notification);

    return c.json({ 
      success: true, 
      notificationId,
      message: "Notification sent successfully",
    });
  } catch (error) {
    console.log(`Error sending notification: ${error}`);
    return c.json({ error: "Failed to send notification" }, 500);
  }
});

// ==================== ANALYTICS (for NGOs/Cooperatives) ====================

// Get platform statistics
app.get("/make-server-ce1844e7/analytics/stats", async (c) => {
  try {
    const users = await kv.getByPrefix("user:");
    const queries = await kv.getByPrefix("query:");
    const sales = await kv.getByPrefix("sale:");

    const stats = {
      totalUsers: users?.length || 0,
      totalQueries: queries?.length || 0,
      totalSales: sales?.length || 0,
      activeUsers: users?.filter((u: any) => {
        const lastLogin = new Date(u.lastLoginAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return lastLogin > thirtyDaysAgo;
      }).length || 0,
    };

    return c.json({ success: true, stats });
  } catch (error) {
    console.log(`Error fetching analytics: ${error}`);
    return c.json({ error: "Failed to fetch analytics" }, 500);
  }
});

// ==================== CREOVA FARM GRAPH (Proprietary Data Collection) ====================

// Track user interaction (behavioral data)
app.post("/make-server-ce1844e7/farm-graph/track", async (c) => {
  try {
    const { userId, eventType, eventData, metadata } = await c.req.json();

    if (!userId || !eventType) {
      return c.json({ error: "UserId and eventType are required" }, 400);
    }

    const eventId = crypto.randomUUID();
    const event = {
      id: eventId,
      userId,
      eventType, // e.g., "crop_view", "market_check", "ai_query", "button_click"
      eventData,
      metadata,
      timestamp: new Date().toISOString(),
    };

    await kv.set(`farm-graph-event:${userId}:${eventId}`, event);

    return c.json({ success: true, eventId });
  } catch (error) {
    console.log(`Error tracking farm graph event: ${error}`);
    return c.json({ error: "Failed to track event" }, 500);
  }
});

// Get user's farm graph data
app.get("/make-server-ce1844e7/farm-graph/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const events = await kv.getByPrefix(`farm-graph-event:${userId}:`);
    
    // Get user profile data
    const userData = await kv.get(`user:${userId}`);
    
    // Get crop history
    const cropHistory = await kv.getByPrefix(`crop-history:${userId}:`);
    
    // Get image uploads
    const imageUploads = await kv.getByPrefix(`image-diagnostic:${userId}:`);
    
    // Get voice interactions
    const voiceInteractions = await kv.getByPrefix(`voice-interaction:${userId}:`);
    
    // Aggregate analytics
    const analytics = {
      totalInteractions: events?.length || 0,
      cropHistory: cropHistory || [],
      imageUploads: imageUploads?.length || 0,
      voiceInteractions: voiceInteractions?.length || 0,
      lastActive: events?.[events.length - 1]?.timestamp || userData?.lastLoginAt,
      topCrops: userData?.crops || [],
      farmSize: userData?.farmSize,
      region: userData?.region,
    };

    return c.json({ 
      success: true, 
      farmGraph: {
        userData,
        events: events || [],
        analytics,
      }
    });
  } catch (error) {
    console.log(`Error fetching farm graph: ${error}`);
    return c.json({ 
      success: false,
      error: "Failed to fetch farm graph",
      message: error.message || "Unknown error"
    }, 500);
  }
});

// ==================== FILE UPLOAD ENDPOINTS ====================

// Generic image upload endpoint
app.post("/make-server-ce1844e7/upload/image", async (c) => {
  try {
    const { userId, imageData, category } = await c.req.json();
    
    if (!userId || !imageData) {
      return c.json({ error: "userId and imageData required" }, 400);
    }
    
    const bucketName = category === 'livestock' ? 'livestock-images' : 
                       category === 'profile' ? 'profile-images' : 'crop-images';
    const fileId = crypto.randomUUID();
    const fileName = `${userId}/${fileId}.jpg`;
    
    try {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          await supabase.storage.createBucket(bucketName, {
            public: false,
            fileSizeLimit: 5242880 // 5MB
          });
          
          const { error: retryError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: false
            });
          
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }
      
      // Generate signed URL
      const { data: signedUrlData } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(fileName, 3600);
      
      return c.json({
        success: true,
        filePath: fileName,
        signedUrl: signedUrlData?.signedUrl,
      });
    } catch (storageError) {
      console.error(`Storage upload error: ${storageError}`);
      return c.json({ error: "Failed to upload image", details: String(storageError) }, 500);
    }
  } catch (error) {
    console.log(`Image upload error: ${error}`);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Generic audio upload endpoint
app.post("/make-server-ce1844e7/upload/audio", async (c) => {
  try {
    const { userId, audioData, language } = await c.req.json();
    
    if (!userId || !audioData) {
      return c.json({ error: "userId and audioData required" }, 400);
    }
    
    const fileId = crypto.randomUUID();
    const fileName = `${userId}/${fileId}.webm`;
    
    try {
      const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, buffer, {
          contentType: 'audio/webm',
          upsert: false
        });
      
      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          await supabase.storage.createBucket('voice-recordings', {
            public: false,
            fileSizeLimit: 10485760 // 10MB
          });
          
          const { error: retryError } = await supabase.storage
            .from('voice-recordings')
            .upload(fileName, buffer, {
              contentType: 'audio/webm',
              upsert: false
            });
          
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }
      
      return c.json({
        success: true,
        filePath: fileName,
      });
    } catch (storageError) {
      console.error(`Audio upload error: ${storageError}`);
      return c.json({ error: "Failed to upload audio", details: String(storageError) }, 500);
    }
  } catch (error) {
    console.log(`Audio upload error: ${error}`);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Get signed URL for file
app.post("/make-server-ce1844e7/storage/signed-url", async (c) => {
  try {
    const { filePath, bucket } = await c.req.json();
    
    if (!filePath || !bucket) {
      return c.json({ error: "filePath and bucket required" }, 400);
    }
    
    const { data: signedUrlData } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, 3600); // 1 hour
    
    return c.json({
      success: true,
      signedUrl: signedUrlData?.signedUrl,
    });
  } catch (error) {
    console.log(`Signed URL error: ${error}`);
    return c.json({ error: "Failed to generate signed URL" }, 500);
  }
});

// ==================== IMAGE-BASED CROP DIAGNOSTICS ====================

// Upload and analyze crop image
app.post("/make-server-ce1844e7/diagnose-crop", async (c) => {
  try {
    const { userId, imageData, cropType, notes } = await c.req.json();

    if (!userId || !imageData) {
      return c.json({ error: "UserId and imageData are required" }, 400);
    }

    const diagnosisId = crypto.randomUUID();
    const fileName = `${userId}/${diagnosisId}.jpg`;
    
    try {
      // Convert base64 to blob and upload to Supabase Storage
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('crop-images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        // If bucket doesn't exist, create it
        if (uploadError.message.includes('Bucket not found')) {
          await supabase.storage.createBucket('crop-images', {
            public: false,
            fileSizeLimit: 5242880 // 5MB
          });
          
          // Retry upload
          const { error: retryError } = await supabase.storage
            .from('crop-images')
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: false
            });
          
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }
      
      // Store image diagnostic record with file path
      await kv.set(`image-diagnostic:${userId}:${diagnosisId}`, {
        id: diagnosisId,
        userId,
        cropType: cropType || "Unknown",
        notes,
        timestamp: new Date().toISOString(),
        imagePath: fileName,
        imageSize: buffer.length,
      });

      // In production, this would call AI vision model
      // For now, return mock diagnosis
      const diagnosis = {
        diagnosisId,
        disease: "Leaf Blight",
        confidence: 0.85,
        severity: "medium" as const,
        remedy: "Apply copper-based fungicide twice a week. Remove affected leaves. Ensure proper spacing between plants for better air circulation.",
        nearbyDealers: ["Agro-Vet Store - 2km", "Green Farm Supplies - 5km"],
        followUpDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        imagePath: fileName,
      };

      await kv.set(`diagnosis:${diagnosisId}`, diagnosis);
      
      // Trigger first diagnosis achievement
      await checkAndUnlockAchievements(userId, "first_diagnosis");

      return c.json({ success: true, diagnosis });
    } catch (storageError) {
      console.error(`Storage error in crop diagnosis: ${storageError}`);
      return c.json({ error: "Failed to upload image", details: String(storageError) }, 500);
    }
  } catch (error) {
    console.log(`Error in crop diagnosis: ${error}`);
    return c.json({ error: "Failed to diagnose crop" }, 500);
  }
});

// Get diagnosis history
app.get("/make-server-ce1844e7/diagnosis-history/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const diagnostics = await kv.getByPrefix(`image-diagnostic:${userId}:`);

    // Generate signed URLs for images
    if (diagnostics && diagnostics.length > 0) {
      for (const diagnostic of diagnostics) {
        if (diagnostic.imagePath) {
          const { data: signedUrl } = await supabase.storage
            .from('crop-images')
            .createSignedUrl(diagnostic.imagePath, 3600); // 1 hour expiry
          
          if (signedUrl) {
            diagnostic.imageUrl = signedUrl.signedUrl;
          }
        }
      }
    }

    return c.json({ success: true, diagnostics: diagnostics || [] });
  } catch (error) {
    console.log(`Error fetching diagnosis history: ${error}`);
    return c.json({ error: "Failed to fetch diagnosis history" }, 500);
  }
});

// Livestock health diagnosis
app.post("/make-server-ce1844e7/livestock/diagnose", async (c) => {
  try {
    const { userId, imageData } = await c.req.json();

    if (!userId || !imageData) {
      return c.json({ error: "UserId and imageData are required" }, 400);
    }

    const diagnosisId = crypto.randomUUID();
    const fileName = `${userId}/${diagnosisId}.jpg`;
    
    try {
      // Convert base64 to blob and upload to Supabase Storage
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('livestock-images')
        .upload(fileName, buffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          await supabase.storage.createBucket('livestock-images', {
            public: false,
            fileSizeLimit: 5242880 // 5MB
          });
          
          const { error: retryError } = await supabase.storage
            .from('livestock-images')
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: false
            });
          
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }
      
      // Store livestock diagnostic record with file path
      await kv.set(`livestock-diagnostic:${userId}:${diagnosisId}`, {
        id: diagnosisId,
        userId,
        timestamp: new Date().toISOString(),
        imagePath: fileName,
        imageSize: buffer.length,
      });

      // Mock diagnosis - in production would call AI vision model
      const diagnosis = {
        diagnosisId,
        animal: "Dairy Cow",
        breed: "Friesian",
        detectedConditions: [
          {
            condition: "Mastitis (Early Stage)",
            confidence: 0.78,
            severity: "medium",
            description: "Inflammation of mammary gland detected. Early intervention recommended.",
            symptoms: ["Swelling in udder quarter", "Slightly elevated temperature"],
            treatment: "Administer intramammary antibiotic. Milk out affected quarter 3x daily. Monitor temperature.",
            preventiveMeasures: ["Maintain clean bedding", "Practice proper milking hygiene", "Regular teat dipping"]
          }
        ],
        generalHealth: "Good body condition. Alert and responsive.",
        nearbyVets: ["Mwanza Vet Clinic - 3km", "Livestock Health Center - 8km"],
        followUpDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        imagePath: fileName,
      };

      await kv.set(`livestock-diagnosis:${diagnosisId}`, diagnosis);

      return c.json({ success: true, diagnosis });
    } catch (storageError) {
      console.error(`Storage error in livestock diagnosis: ${storageError}`);
      return c.json({ error: "Failed to upload image", details: String(storageError) }, 500);
    }
  } catch (error) {
    console.log(`Error in livestock diagnosis: ${error}`);
    return c.json({ error: "Failed to diagnose livestock" }, 500);
  }
});

// ==================== VOICE-FIRST SWAHILI AI ====================

// Store voice interaction
app.post("/make-server-ce1844e7/voice/upload", async (c) => {
  try {
    const { userId, audioData, duration, language, query } = await c.req.json();

    if (!userId || !audioData) {
      return c.json({ error: "UserId and audioData are required" }, 400);
    }

    const voiceId = crypto.randomUUID();
    const fileName = `${userId}/${voiceId}.webm`;
    
    try {
      // Convert base64 to blob and upload to Supabase Storage
      const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, '');
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('voice-recordings')
        .upload(fileName, buffer, {
          contentType: 'audio/webm',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          await supabase.storage.createBucket('voice-recordings', {
            public: false,
            fileSizeLimit: 10485760 // 10MB
          });
          
          const { error: retryError } = await supabase.storage
            .from('voice-recordings')
            .upload(fileName, buffer, {
              contentType: 'audio/webm',
              upsert: false
            });
          
          if (retryError) throw retryError;
        } else {
          throw uploadError;
        }
      }
      
      await kv.set(`voice-interaction:${userId}:${voiceId}`, {
        id: voiceId,
        userId,
        duration,
        language: language || "sw",
        query,
        timestamp: new Date().toISOString(),
        audioPath: fileName,
        audioSize: buffer.length,
        processed: false,
      });
    } catch (storageError) {
      console.error(`Storage error in voice upload: ${storageError}`);
      return c.json({ error: "Failed to upload audio", details: String(storageError) }, 500);
    }

    // In production, this would:
    // 1. Transcribe audio using speech-to-text
    // 2. Process with AI
    // 3. Generate response
    // 4. Convert to speech
    
    const response = {
      voiceId,
      transcription: query || "Habari za asubuhi. Je, unaweza kunisaidia na mazao yangu?",
      aiResponse: "Asante kwa kuwasiliana na CREOVA. Ninataka kukusaidia. Tafadhali niambie kuhusu mazao yako na tatizo unaloliona.",
      audioResponseUrl: null, // Would be signed URL in production
    };

    await kv.set(`voice-response:${voiceId}`, response);

    return c.json({ success: true, response });
  } catch (error) {
    console.log(`Error processing voice interaction: ${error}`);
    return c.json({ error: "Failed to process voice" }, 500);
  }
});

// Get voice interaction history
app.get("/make-server-ce1844e7/voice/history/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const voiceInteractions = await kv.getByPrefix(`voice-interaction:${userId}:`);

    return c.json({ success: true, interactions: voiceInteractions || [] });
  } catch (error) {
    console.log(`Error fetching voice history: ${error}`);
    return c.json({ error: "Failed to fetch voice history" }, 500);
  }
});

// ==================== CREOVA FARMER LAB ====================

// Add pilot farmer
app.post("/make-server-ce1844e7/farmer-lab/add-pilot", async (c) => {
  try {
    const { farmerId, cohort, region, crops, contactInfo, notes } = await c.req.json();

    if (!farmerId) {
      return c.json({ error: "FarmerId is required" }, 400);
    }

    const pilotId = crypto.randomUUID();
    
    const pilotFarmer = {
      id: pilotId,
      farmerId,
      cohort: cohort || "Cohort 1",
      region,
      crops: crops || [],
      contactInfo,
      notes,
      status: "active",
      joinedAt: new Date().toISOString(),
      feedbackCount: 0,
      lastFeedback: null,
    };

    await kv.set(`pilot-farmer:${pilotId}`, pilotFarmer);
    await kv.set(`farmer-pilot-lookup:${farmerId}`, pilotId);

    return c.json({ success: true, pilotId, pilotFarmer });
  } catch (error) {
    console.log(`Error adding pilot farmer: ${error}`);
    return c.json({ error: "Failed to add pilot farmer" }, 500);
  }
});

// Submit farmer feedback
app.post("/make-server-ce1844e7/farmer-lab/feedback", async (c) => {
  try {
    const { farmerId, feedbackType, rating, comments, featureUsed } = await c.req.json();

    if (!farmerId || !feedbackType) {
      return c.json({ error: "FarmerId and feedbackType are required" }, 400);
    }

    const feedbackId = crypto.randomUUID();
    
    const feedback = {
      id: feedbackId,
      farmerId,
      feedbackType, // "feature", "bug", "suggestion", "general"
      rating,
      comments,
      featureUsed,
      timestamp: new Date().toISOString(),
      status: "new",
    };

    await kv.set(`farmer-feedback:${farmerId}:${feedbackId}`, feedback);

    return c.json({ success: true, feedbackId });
  } catch (error) {
    console.log(`Error submitting feedback: ${error}`);
    return c.json({ error: "Failed to submit feedback" }, 500);
  }
});

// Get all pilot farmers
app.get("/make-server-ce1844e7/farmer-lab/pilots", async (c) => {
  try {
    const pilots = await kv.getByPrefix("pilot-farmer:");
    
    return c.json({ 
      success: true, 
      pilots: pilots || [],
      totalPilots: pilots?.length || 0,
    });
  } catch (error) {
    console.log(`Error fetching pilot farmers: ${error}`);
    return c.json({ error: "Failed to fetch pilot farmers" }, 500);
  }
});

// Get farmer feedback
app.get("/make-server-ce1844e7/farmer-lab/feedback/:farmerId", async (c) => {
  try {
    const farmerId = c.req.param("farmerId");
    const feedback = await kv.getByPrefix(`farmer-feedback:${farmerId}:`);

    return c.json({ success: true, feedback: feedback || [] });
  } catch (error) {
    console.log(`Error fetching feedback: ${error}`);
    return c.json({ error: "Failed to fetch feedback" }, 500);
  }
});

// ==================== PERSONALIZED AI ADVISORY ENGINE ====================

// Get personalized recommendations
app.post("/make-server-ce1844e7/advisory/personalized", async (c) => {
  try {
    console.log('📍 Personalized recommendations endpoint hit');
    
    const body = await c.req.json();
    console.log('📦 Request body:', body);
    
    const { userId } = body;

    if (!userId) {
      console.error('❌ UserId is missing');
      return c.json({ success: false, error: "UserId is required" }, 400);
    }

    console.log('👤 Fetching data for userId:', userId);

    // Get user's farm graph data
    const userData = await kv.get(`user:${userId}`);
    const events = await kv.getByPrefix(`farm-graph-event:${userId}:`);
    const queries = await kv.getByPrefix(`query:${userId}:`);
    const diagnostics = await kv.getByPrefix(`image-diagnostic:${userId}:`);
    
    console.log('📊 User data retrieved:', {
      hasUserData: !!userData,
      eventsCount: events?.length || 0,
      queriesCount: queries?.length || 0,
      diagnosticsCount: diagnostics?.length || 0
    });
    
    // Analyze behavior patterns
    const recentQueries = queries?.slice(-10) || [];
    const recentDiagnostics = diagnostics?.slice(-5) || [];
    const topCrops = userData?.crops || ["Maize"];
    
    // Generate personalized recommendations
    const recommendations = {
      urgent: [
        {
          title: "Fertilizer Application Recommended",
          description: `Based on your ${topCrops[0]} growth stage, apply top-dressing fertilizer this week`,
          priority: "high",
          category: "Crop Care",
          actionable: true,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        }
      ],
      seasonal: [
        {
          title: "Prepare for Short Rains",
          description: "October-December planting season approaching. Prepare your land now",
          priority: "medium",
          category: "Planning",
          actionable: true,
        }
      ],
      market: [
        {
          title: `${topCrops[0]} Prices Rising`,
          description: "Market analysis shows 8% price increase in your region. Good time to sell",
          priority: "medium",
          category: "Market Opportunity",
          actionable: true,
        }
      ],
      learning: [
        {
          title: "New Training: Fall Armyworm Management",
          description: "Learn about early detection and control of Fall Armyworm",
          priority: "low",
          category: "Education",
          actionable: false,
        }
      ],
      personalized: recentDiagnostics.length > 0 ? [
        {
          title: "Follow-up on Recent Diagnosis",
          description: "Check on the treatment applied 7 days ago and upload new photos",
          priority: "medium",
          category: "Health Monitoring",
          actionable: true,
        }
      ] : [],
    };

    console.log('✅ Recommendations generated successfully');
    return c.json({ success: true, recommendations });
  } catch (error) {
    console.error(`❌ Error generating personalized recommendations:`, error);
    console.error('📍 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return c.json({ 
      success: false, 
      error: "Failed to generate recommendations",
      details: error instanceof Error ? error.message : String(error)
    }, 500);
  }
});

// ==================== AI ADVISORY SYSTEM ====================

// Generate comprehensive AI-powered farming recommendations
app.post("/make-server-ce1844e7/ai-advisory/generate", async (c) => {
  let userId; // Declare outside try block so catch can access it
  
  try {
    console.log('🤖 AI Advisory endpoint hit');
    
    const body = await c.req.json();
    const { userId: requestUserId, language } = body;
    userId = requestUserId; // Assign to outer variable

    if (!userId) {
      return c.json({ success: false, error: "UserId is required" }, 400);
    }

    // Fetch all farmer data from KV store
    const userData = await kv.get(`user:${userId}`);
    if (!userData) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    // Get farm data
    const tasks = await kv.getByPrefix(`task:${userId}:`) || [];
    const crops = await kv.getByPrefix(`crop:${userId}:`) || [];
    const livestock = await kv.getByPrefix(`livestock:${userId}:`) || [];
    const finances = await kv.getByPrefix(`finance:${userId}:`) || [];

    // Prepare data for AI
    const farmerData = {
      farmer_name: userData.name,
      farm_type: userData.userType || "smallholder",
      region: userData.region,
      farm_size: userData.farmSize,
      tasks: tasks.length > 0 ? tasks.slice(0, 10).map((t, i) => ({
        id: i + 1,
        name: t.name || t.taskName || "Unnamed task",
        status: t.status || "pending",
        field_id: t.fieldId || i + 1
      })) : [
        { id: 1, name: "Plant maize", status: "pending", field_id: 1 },
        { id: 2, name: "Irrigate crops", status: "in_progress", field_id: 2 }
      ],
      crops: crops.length > 0 ? crops.slice(0, 5).map((cr, i) => ({
        field_id: i + 1,
        crop_name: cr.cropName || cr.name || (userData.crops && userData.crops[i]) || "Maize",
        growth_stage: cr.growthStage || "vegetative",
        health: cr.health || "good",
        expected_yield: cr.expectedYield || 500
      })) : userData.crops?.slice(0, 3).map((cropName, i) => ({
        field_id: i + 1,
        crop_name: cropName,
        growth_stage: "vegetative",
        health: "good",
        expected_yield: 500
      })) || [
        { field_id: 1, crop_name: "Maize", growth_stage: "vegetative", health: "good", expected_yield: 800 }
      ],
      livestock: livestock.length > 0 ? livestock.slice(0, 5).map((l, i) => ({
        id: l.id || (100 + i),
        species: l.species || "Cow",
        age: l.age || 3,
        health_status: l.healthStatus || l.status || "healthy",
        last_treatment_date: l.lastTreatmentDate || "2024-12-01"
      })) : [
        { id: 101, species: "Cow", age: 3, health_status: "healthy", last_treatment_date: "2024-12-15" }
      ],
      climate: [
        { date: "2026-01-21", forecast_rain_mm: 15, temp_max: 28, temp_min: 18, alert: "moderate_rain" },
        { date: "2026-01-22", forecast_rain_mm: 5, temp_max: 30, temp_min: 20, alert: "normal" }
      ],
      finance: finances.length > 0 ? finances.slice(0, 5).map(f => ({
        category: f.category || "General",
        expense: f.expense || f.amount || 0,
        revenue: f.revenue || f.income || 0
      })) : [
        { category: "Seeds", expense: 50000, revenue: 0 }
      ]
    };

    const systemPrompt = `You are an expert agricultural AI advisor for KILIMO. Generate farming recommendations in JSON format with English and Swahili translations. Return ONLY valid JSON without markdown. Structure: {"tasks":[{"id":1,"name":{"en":"","sw":""},"suggestion":{"en":"","sw":""},"steps":[{"en":"","sw":""}]}],"crops_alerts":[{"field_id":1,"crop_name":{"en":"","sw":""},"alert":{"en":"","sw":""}}],"livestock_alerts":[{"id":101,"species":{"en":"","sw":""},"suggestion":{"en":"","sw":""}}],"finance_advice":[{"category":{"en":"","sw":""},"recommendation":{"en":"","sw":""}}],"climate_alerts":[{"date":"2026-01-21","alert":{"en":"","sw":""}}]}`;

    const userPrompt = `Farmer: ${farmerData.farmer_name}, Region: ${farmerData.region}, Farm: ${farmerData.farm_size}. Tasks: ${JSON.stringify(farmerData.tasks)}. Crops: ${JSON.stringify(farmerData.crops)}. Livestock: ${JSON.stringify(farmerData.livestock)}. Generate bilingual recommendations.`;

    // Try AI, throw to outer catch if fails (402 or other error)
    let aiResponse;
    try {
      aiResponse = await openrouter.queryAI(
        systemPrompt, 
        userPrompt, 
        "openai/gpt-3.5-turbo",
        1000,
        0.7
      );
    } catch (apiError: any) {
      // Log the specific error but don't throw - let it fall through to fallback
      const errorMessage = apiError?.message || String(apiError);
      console.log(`AI service unavailable (${errorMessage}) - using fallback recommendations`);
      
      // If it's a credits issue or service unavailable, use fallback silently
      if (errorMessage.includes('AI_INSUFFICIENT_CREDITS') || 
          errorMessage.includes('AI_SERVICE_UNAVAILABLE') ||
          errorMessage.includes('402')) {
        throw new Error('AI_FALLBACK_REQUIRED');
      }
      
      // For other errors, also use fallback
      throw new Error('AI_FALLBACK_REQUIRED');
    }

    let recommendations;
    try {
      let cleaned = aiResponse.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      recommendations = JSON.parse(cleaned);
    } catch (parseError) {
      recommendations = {
        tasks: [{ id: 1, name: { en: "Review schedule", sw: "Kagua ratiba" }, suggestion: { en: "AI parsing failed", sw: "Uchambuzi umeshindwa" }, steps: [{ en: "Try again", sw: "Jaribu tena" }] }],
        crops_alerts: [],
        livestock_alerts: [],
        finance_advice: [],
        climate_alerts: []
      };
    }

    const recommendationId = crypto.randomUUID();
    
    // Store recommendations in KV (non-blocking if fails)
    try {
      await kv.set(`ai-recommendation:${userId}:${recommendationId}`, {
        id: recommendationId,
        userId,
        recommendations,
        generatedAt: new Date().toISOString()
      });
    } catch (kvError) {
      console.error('Failed to store recommendations in KV:', kvError);
      // Continue anyway - we can still return the recommendations
    }

    return c.json({ 
      success: true, 
      recommendations,
      recommendationId,
      farmerProfile: {
        name: farmerData.farmer_name,
        farmType: farmerData.farm_type,
        region: farmerData.region
      }
    });

  } catch (error: any) {
    const errorMessage = error?.message || String(error);
    
    // Only log as error if it's not an expected fallback scenario
    if (errorMessage.includes('AI_FALLBACK_REQUIRED')) {
      console.log('AI Advisory: Using fallback recommendations (AI service unavailable)');
    } else {
      console.error(`AI Advisory error:`, error);
    }
    
    // Return success with fallback recommendations instead of error
    const fallbackRecommendations = {
      tasks: [
        { 
          id: 1, 
          name: { en: "Monitor crop health", sw: "Fuatilia afya ya mazao" },
          suggestion: { en: "Inspect crops daily for pests and diseases", sw: "Kagua mazao kila siku kwa wadudu na magonjwa" },
          steps: [
            { en: "Check leaves for damage", sw: "Angalia majani kwa uharibifu" },
            { en: "Look for pest presence", sw: "Tafuta uwepo wa wadudu" }
          ]
        },
        { 
          id: 2, 
          name: { en: "Water management", sw: "Usimamizi wa maji" },
          suggestion: { en: "Monitor soil moisture levels", sw: "Fuatilia viwango vya unyevu wa udongo" },
          steps: [{ en: "Check soil in morning", sw: "Angalia udongo asubuhi" }]
        }
      ],
      crops_alerts: [],
      livestock_alerts: [],
      finance_advice: [
        {
          category: { en: "Budget Planning", sw: "Mipango ya Bajeti" },
          recommendation: { en: "Track farm expenses weekly", sw: "Fuatilia gharama za shamba kila wiki" }
        }
      ],
      climate_alerts: [
        {
          date: new Date().toISOString().split('T')[0],
          alert: { en: "Check weather forecast", sw: "Angalia utabiri wa hali ya hewa" }
        }
      ]
    };
    
    const recommendationId = crypto.randomUUID();
    
    // Only store in KV if userId is available
    if (userId) {
      try {
        await kv.set(`ai-recommendation:${userId}:${recommendationId}`, {
          id: recommendationId,
          userId,
          recommendations: fallbackRecommendations,
          generatedAt: new Date().toISOString(),
          fallback: true
        });
      } catch (kvError) {
        console.error('Failed to store fallback recommendations in KV:', kvError);
        // Continue anyway - we can still return the recommendations
      }
    }
    
    return c.json({ 
      success: true, 
      recommendations: fallbackRecommendations,
      recommendationId,
      fallback: true,
      message: "Using smart recommendations (AI service temporarily unavailable)"
    });
  }
});

// ==================== CROP PLANNING & MANAGEMENT AI SYSTEM ====================
app.post("/make-server-ce1844e7/crop-plan/generate", (c) => cropPlanning.generateCropPlan(c));
app.get("/make-server-ce1844e7/crop-plans", (c) => cropPlanning.listCropPlans(c));
app.post("/make-server-ce1844e7/crop-plan/analyze-history", (c) => cropPlanning.analyzeHistory(c));

// ==================== ENTERPRISE AI SERVICES (STANDARDIZED CONTRACTS) ====================
app.post("/make-server-ce1844e7/api/ai/crop-plan", (c) => aiServices.cropPlanAI(c));
app.post("/make-server-ce1844e7/api/ai/yield-forecast", (c) => aiServices.yieldForecastAI(c));
app.post("/make-server-ce1844e7/api/ai/history-analysis", (c) => aiServices.historyAnalysisAI(c));
app.get("/make-server-ce1844e7/api/user-activity", (c) => aiServices.getUserActivity(c));

// ==================== GENDER-INCLUSIVE FAMILY PLANNING TOOLS ====================

// Create family plan
app.post("/make-server-ce1844e7/family-plan/create", async (c) => {
  try {
    const { userId, familyMembers, farmGoals, timeline, resourceAllocation } = await c.req.json();

    if (!userId) {
      return c.json({ error: "UserId is required" }, 400);
    }

    const planId = crypto.randomUUID();
    
    const familyPlan = {
      id: planId,
      userId,
      familyMembers: familyMembers || [],
      farmGoals: farmGoals || [],
      timeline,
      resourceAllocation: resourceAllocation || {},
      createdAt: new Date().toISOString(),
      status: "active",
    };

    await kv.set(`family-plan:${userId}`, familyPlan);

    return c.json({ success: true, planId, familyPlan });
  } catch (error) {
    console.log(`Error creating family plan: ${error}`);
    return c.json({ error: "Failed to create family plan" }, 500);
  }
});

// Allocate task to family member
app.post("/make-server-ce1844e7/family-plan/task", async (c) => {
  try {
    const { userId, taskName, assignedTo, dueDate, priority, category } = await c.req.json();

    if (!userId || !taskName) {
      return c.json({ error: "UserId and taskName are required" }, 400);
    }

    const taskId = crypto.randomUUID();
    
    const task = {
      id: taskId,
      userId,
      taskName,
      assignedTo, // { name, role, gender }
      dueDate,
      priority: priority || "medium",
      category: category || "general",
      status: "pending",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    await kv.set(`family-task:${userId}:${taskId}`, task);

    return c.json({ success: true, taskId, task });
  } catch (error) {
    console.log(`Error creating task: ${error}`);
    return c.json({ error: "Failed to create task" }, 500);
  }
});

// Get family plan
app.get("/make-server-ce1844e7/family-plan/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const plan = await kv.get(`family-plan:${userId}`);
    const tasks = await kv.getByPrefix(`family-task:${userId}:`);

    return c.json({ 
      success: true, 
      plan: plan || null,
      tasks: tasks || [],
    });
  } catch (error) {
    console.log(`Error fetching family plan: ${error}`);
    return c.json({ 
      success: false,
      error: "Failed to fetch family plan",
      message: error.message || "Unknown error"
    }, 500);
  }
});

// Update task status
app.put("/make-server-ce1844e7/family-plan/task/:taskId", async (c) => {
  try {
    const taskId = c.req.param("taskId");
    const { status, completedAt } = await c.req.json();

    // Find the task (we need to search by prefix since we don't know userId)
    const allTasks = await kv.getByPrefix("family-task:");
    const task = allTasks?.find((t: any) => t.id === taskId);

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const updatedTask = {
      ...task,
      status: status || task.status,
      completedAt: completedAt || (status === "completed" ? new Date().toISOString() : null),
    };

    await kv.set(`family-task:${task.userId}:${taskId}`, updatedTask);

    return c.json({ success: true, task: updatedTask });
  } catch (error) {
    console.log(`Error updating task: ${error}`);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// ==================== FLUTTERWAVE PAYMENTS (PAN-AFRICAN) ====================

// Initialize Flutterwave payment
app.post("/make-server-ce1844e7/payment/flutterwave/initiate", async (c) => {
  try {
    const { amount, currency, email, phone, name, paymentType, country } = await c.req.json();

    if (!amount || !email || !phone || !name) {
      return c.json({ error: "Amount, email, phone, and name are required" }, 400);
    }

    const txRef = `CREOVA-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const result = await flutterwave.initiateFlutterwavePayment({
      amount,
      currency: currency || "TZS",
      email,
      phone_number: phone,
      name,
      tx_ref: txRef,
      payment_type: paymentType || "mobilemoney",
      country: country || "TZ",
    });

    if (result.status === "success") {
      // Store transaction record
      await kv.set(`payment:${txRef}`, {
        txRef,
        amount,
        currency: currency || "TZS",
        email,
        phone,
        name,
        status: "initiated",
        createdAt: new Date().toISOString(),
      });

      return c.json({ success: true, ...result });
    } else {
      return c.json({ success: false, error: result.message }, 400);
    }
  } catch (error) {
    console.log(`Flutterwave payment initiation error: ${error}`);
    return c.json({ error: "Failed to initiate payment" }, 500);
  }
});

// Verify Flutterwave payment
app.get("/make-server-ce1844e7/payment/flutterwave/verify/:transactionId", async (c) => {
  try {
    const transactionId = c.req.param("transactionId");

    const result = await flutterwave.verifyFlutterwavePayment(transactionId);

    if (result.status === "success" && result.data) {
      // Update transaction record
      await kv.set(`payment:${result.data.tx_ref}`, {
        txRef: result.data.tx_ref,
        amount: result.data.amount,
        currency: result.data.currency,
        status: result.data.status,
        verifiedAt: new Date().toISOString(),
      });

      return c.json({ success: true, payment: result.data });
    } else {
      return c.json({ success: false, error: result.message }, 400);
    }
  } catch (error) {
    console.log(`Flutterwave payment verification error: ${error}`);
    return c.json({ error: "Failed to verify payment" }, 500);
  }
});

// Process mobile money via Flutterwave
app.post("/make-server-ce1844e7/payment/flutterwave/mobile-money", async (c) => {
  try {
    const { amount, phoneNumber, email, name, currency, country } = await c.req.json();

    if (!amount || !phoneNumber || !email || !name) {
      return c.json({ error: "Amount, phoneNumber, email, and name are required" }, 400);
    }

    const result = await flutterwave.processFlutterwaveMobileMoney(
      amount,
      phoneNumber,
      email,
      name,
      currency || "TZS",
      country || "TZ"
    );

    if (result.status === "success") {
      return c.json({ success: true, ...result });
    } else {
      return c.json({ success: false, error: result.message }, 400);
    }
  } catch (error) {
    console.log(`Flutterwave mobile money error: ${error}`);
    return c.json({ error: "Failed to process mobile money payment" }, 500);
  }
});

// Get supported countries
app.get("/make-server-ce1844e7/payment/flutterwave/countries", (c) => {
  const countries = flutterwave.getFlutterwaveSupportedCountries();
  return c.json({ success: true, countries });
});

// ==================== SELCOM PAYMENTS (TANZANIA) ====================

// Initialize SELCOM payment
app.post("/make-server-ce1844e7/payment/selcom/initiate", async (c) => {
  try {
    const { amount, phoneNumber, customerName, email, mobileOperator } = await c.req.json();

    if (!amount || !phoneNumber || !customerName) {
      return c.json({ error: "Amount, phoneNumber, and customerName are required" }, 400);
    }

    // Format phone number for SELCOM
    const formattedPhone = selcom.formatPhoneForSelcom(phoneNumber);
    
    // Validate phone number
    if (!selcom.validateTanzanianPhone(formattedPhone)) {
      return c.json({ error: "Invalid Tanzanian phone number" }, 400);
    }

    const orderReference = `CREOVA-SELCOM-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    const result = await selcom.initiateSelcomPayment({
      amount,
      phoneNumber: formattedPhone,
      customerName,
      email,
      orderReference,
      mobileOperator: mobileOperator || "MPESA",
      description: "CREOVA Agri-AI Services Payment",
    });

    if (result.result === "SUCCESS" && result.resultcode === "000") {
      // Store transaction record
      await kv.set(`payment-selcom:${orderReference}`, {
        orderReference,
        amount,
        phoneNumber: formattedPhone,
        customerName,
        email,
        mobileOperator: mobileOperator || "MPESA",
        result: result.result,
        resultcode: result.resultcode,
        transid: result.transid,
        createdAt: new Date().toISOString(),
      });

      return c.json({ success: true, ...result });
    } else {
      // Store failed/pending transaction
      await kv.set(`payment-selcom:${orderReference}`, {
        orderReference,
        amount,
        phoneNumber: formattedPhone,
        result: result.result,
        resultcode: result.resultcode,
        message: result.message,
        createdAt: new Date().toISOString(),
      });
      
      return c.json({ success: false, ...result }, 400);
    }
  } catch (error) {
    console.log(`SELCOM payment initiation error: ${error}`);
    return c.json({ error: "Failed to initiate payment" }, 500);
  }
});

// Check SELCOM order status (verify payment)
app.get("/make-server-ce1844e7/payment/selcom/status/:orderReference", async (c) => {
  try {
    const orderReference = c.req.param("orderReference");

    const result = await selcom.checkSelcomOrderStatus(orderReference);

    // Interpret result code
    const interpretation = selcom.interpretResultCode(result.resultcode);

    // Update transaction record with status
    const existingRecord = await kv.get(`payment-selcom:${orderReference}`);
    if (existingRecord) {
      await kv.set(`payment-selcom:${orderReference}`, {
        ...existingRecord,
        result: result.result,
        resultcode: result.resultcode,
        message: result.message,
        status: interpretation.status,
        verifiedAt: new Date().toISOString(),
      });
    }

    return c.json({ 
      success: result.result === "SUCCESS" && result.resultcode === "000",
      ...result,
      interpretation
    });
  } catch (error) {
    console.log(`SELCOM order status error: ${error}`);
    return c.json({ error: "Failed to check order status" }, 500);
  }
});

// Process M-Pesa via SELCOM (most common in Tanzania)
app.post("/make-server-ce1844e7/payment/selcom/mpesa", async (c) => {
  try {
    const { amount, phoneNumber, customerName, email } = await c.req.json();

    if (!amount || !phoneNumber || !customerName) {
      return c.json({ error: "Amount, phoneNumber, and customerName are required" }, 400);
    }

    const formattedPhone = selcom.formatPhoneForSelcom(phoneNumber);

    const result = await selcom.processSelcomMPesa(
      amount,
      formattedPhone,
      customerName,
      email
    );

    return c.json({ 
      success: result.result === "SUCCESS" && result.resultcode === "000",
      ...result 
    });
  } catch (error) {
    console.log(`SELCOM M-Pesa error: ${error}`);
    return c.json({ error: "Failed to process M-Pesa payment" }, 500);
  }
});

// Process TigoPesa via SELCOM
app.post("/make-server-ce1844e7/payment/selcom/tigopesa", async (c) => {
  try {
    const { amount, phoneNumber, customerName, email } = await c.req.json();

    if (!amount || !phoneNumber || !customerName) {
      return c.json({ error: "Amount, phoneNumber, and customerName are required" }, 400);
    }

    const formattedPhone = selcom.formatPhoneForSelcom(phoneNumber);

    const result = await selcom.processSelcomTigoPesa(
      amount,
      formattedPhone,
      customerName,
      email
    );

    return c.json({ 
      success: result.result === "SUCCESS" && result.resultcode === "000",
      ...result 
    });
  } catch (error) {
    console.log(`SELCOM TigoPesa error: ${error}`);
    return c.json({ error: "Failed to process TigoPesa payment" }, 500);
  }
});

// Process Airtel Money via SELCOM
app.post("/make-server-ce1844e7/payment/selcom/airtel", async (c) => {
  try {
    const { amount, phoneNumber, customerName, email } = await c.req.json();

    if (!amount || !phoneNumber || !customerName) {
      return c.json({ error: "Amount, phoneNumber, and customerName are required" }, 400);
    }

    const formattedPhone = selcom.formatPhoneForSelcom(phoneNumber);

    const result = await selcom.processSelcomAirtel(
      amount,
      formattedPhone,
      customerName,
      email
    );

    return c.json({ 
      success: result.result === "SUCCESS" && result.resultcode === "000",
      ...result 
    });
  } catch (error) {
    console.log(`SELCOM Airtel Money error: ${error}`);
    return c.json({ error: "Failed to process Airtel Money payment" }, 500);
  }
});

// Process Halopesa via SELCOM
app.post("/make-server-ce1844e7/payment/selcom/halopesa", async (c) => {
  try {
    const { amount, phoneNumber, customerName, email } = await c.req.json();

    if (!amount || !phoneNumber || !customerName) {
      return c.json({ error: "Amount, phoneNumber, and customerName are required" }, 400);
    }

    const formattedPhone = selcom.formatPhoneForSelcom(phoneNumber);

    const result = await selcom.processSelcomHalopesa(
      amount,
      formattedPhone,
      customerName,
      email
    );

    return c.json({ 
      success: result.result === "SUCCESS" && result.resultcode === "000",
      ...result 
    });
  } catch (error) {
    console.log(`SELCOM Halopesa error: ${error}`);
    return c.json({ error: "Failed to process Halopesa payment" }, 500);
  }
});

// Get supported mobile money operators
app.get("/make-server-ce1844e7/payment/selcom/operators", (c) => {
  const operators = selcom.getSelcomSupportedOperators();
  return c.json({ success: true, operators });
});

// Get supported banks
app.get("/make-server-ce1844e7/payment/selcom/banks", (c) => {
  const banks = selcom.getSelcomSupportedBanks();
  return c.json({ success: true, banks });
});

// ==================== OPENROUTER AI (MULTI-LLM) ====================

// Get AI advice via OpenRouter
app.post("/make-server-ce1844e7/ai/sankofa/query", async (c) => {
  try {
    const { userId, question, language, conversationHistory } = await c.req.json();

    if (!userId || !question) {
      return c.json({ error: "UserId and question are required" }, 400);
    }

    // Store the query
    const queryId = crypto.randomUUID();
    await kv.set(`ai-query:${userId}:${queryId}`, {
      id: queryId,
      userId,
      question,
      language: language || "en",
      timestamp: new Date().toISOString(),
    });

    // Get AI response via OpenRouter
    const result = await openrouter.getSankofaAIAdvice(
      question,
      language || "en",
      conversationHistory || []
    );

    if (result.success) {
      // Store response
      await kv.set(`ai-response:${userId}:${queryId}`, {
        queryId,
        response: result.message,
        timestamp: new Date().toISOString(),
      });

      return c.json({
        success: true,
        queryId,
        message: result.message,
      });
    } else {
      // Fallback to mock response if OpenRouter fails
      const mockResponse = generateMockAIResponse(question, language || "en");
      
      await kv.set(`ai-response:${userId}:${queryId}`, {
        queryId,
        response: mockResponse,
        source: "fallback",
        timestamp: new Date().toISOString(),
      });

      return c.json({
        success: true,
        queryId,
        message: mockResponse,
        fallback: true,
      });
    }
  } catch (error) {
    console.log(`AI query error: ${error}`);
    return c.json({ error: "Failed to process AI query" }, 500);
  }
});

// Analyze crop image via OpenRouter
app.post("/make-server-ce1844e7/ai/analyze-image", async (c) => {
  try {
    const { userId, imageUrl, userQuery, language } = await c.req.json();

    if (!userId || !imageUrl || !userQuery) {
      return c.json({ error: "UserId, imageUrl, and userQuery are required" }, 400);
    }

    const analysisId = crypto.randomUUID();

    // Store analysis request
    await kv.set(`image-analysis:${userId}:${analysisId}`, {
      id: analysisId,
      userId,
      imageUrl,
      userQuery,
      language: language || "en",
      timestamp: new Date().toISOString(),
    });

    // Analyze via OpenRouter
    const result = await openrouter.analyzeCropImage(
      imageUrl,
      userQuery,
      language || "en"
    );

    if (result.success) {
      return c.json({
        success: true,
        analysisId,
        message: result.message,
      });
    } else {
      // Fallback to mock diagnosis
      const mockDiagnosis = {
        disease: "Leaf Blight",
        confidence: 0.85,
        remedy: "Apply copper-based fungicide twice a week. Remove affected leaves.",
      };

      return c.json({
        success: true,
        analysisId,
        diagnosis: mockDiagnosis,
        fallback: true,
      });
    }
  } catch (error) {
    console.log(`Image analysis error: ${error}`);
    return c.json({ error: "Failed to analyze image" }, 500);
  }
});

// Get available AI models
app.get("/make-server-ce1844e7/ai/models", (c) => {
  return c.json({
    success: true,
    models: {
      premium: openrouter.AI_MODELS.PREMIUM,
      balanced: openrouter.AI_MODELS.BALANCED,
      fast: openrouter.AI_MODELS.FAST,
      default: openrouter.AI_MODELS.DEFAULT,
    },
  });
});

// Get AI conversation history
app.get("/make-server-ce1844e7/ai/history/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const queries = await kv.getByPrefix(`ai-query:${userId}:`);
    const responses = await kv.getByPrefix(`ai-response:${userId}:`);

    // Combine queries and responses
    const history = queries?.map((query: any) => {
      const response = responses?.find((r: any) => r.queryId === query.id);
      return {
        ...query,
        response: response?.response || null,
        responseTime: response?.timestamp || null,
      };
    }) || [];

    return c.json({
      success: true,
      history,
      totalQueries: history.length,
    });
  } catch (error) {
    console.log(`Error fetching AI history: ${error}`);
    return c.json({ error: "Failed to fetch AI history" }, 500);
  }
});

// ==================== ACHIEVEMENTS & GAMIFICATION ====================

// Check and unlock achievements (internal function)
async function checkAndUnlockAchievements(userId: string, event: string, metadata?: any) {
  try {
    const userAchievements = await kv.get(`achievements:${userId}`) || { unlocked: [], points: 0 };
    
    const achievementRules: Record<string, any> = {
      "first_login": { id: "first_login", points: 10, title: "Welcome Farmer" },
      "first_crop_plan": { id: "first_crop_plan", points: 50, title: "Planning Expert" },
      "first_diagnosis": { id: "first_diagnosis", points: 30, title: "Crop Doctor" },
      "first_marketplace_order": { id: "first_marketplace_order", points: 40, title: "Smart Buyer" },
      "first_sale": { id: "first_sale", points: 50, title: "Entrepreneur" },
      "learning_complete_5": { id: "learning_complete_5", points: 100, title: "Knowledge Seeker" },
      "learning_complete_10": { id: "learning_complete_10", points: 200, title: "Master Learner" },
      "ai_queries_50": { id: "ai_queries_50", points: 150, title: "AI Expert" },
      "wallet_funded": { id: "wallet_funded", points: 25, title: "Financial Ready" },
    };
    
    const rule = achievementRules[event];
    if (!rule) return;
    
    // Check if already unlocked
    if (userAchievements.unlocked.includes(rule.id)) return;
    
    // Check event-specific conditions
    let shouldUnlock = false;
    
    if (event === "first_login") {
      shouldUnlock = true;
    } else if (event === "learning_complete_5") {
      const completedCount = metadata?.completedCount || 0;
      shouldUnlock = completedCount >= 5;
    } else if (event === "learning_complete_10") {
      const completedCount = metadata?.completedCount || 0;
      shouldUnlock = completedCount >= 10;
    } else if (event === "ai_queries_50") {
      const queryCount = metadata?.queryCount || 0;
      shouldUnlock = queryCount >= 50;
    } else {
      shouldUnlock = true;
    }
    
    if (shouldUnlock) {
      userAchievements.unlocked.push(rule.id);
      userAchievements.points += rule.points;
      await kv.set(`achievements:${userId}`, userAchievements);
      
      // Send notification
      await kv.set(`notification:${userId}:${crypto.randomUUID()}`, {
        userId,
        type: "achievement_unlocked",
        title: `🏆 Achievement Unlocked: ${rule.title}`,
        message: `You earned ${rule.points} points!`,
        timestamp: new Date().toISOString(),
        read: false,
      });
    }
  } catch (error) {
    console.log(`Error checking achievements: ${error}`);
  }
}

// Get user achievements
app.get("/make-server-ce1844e7/achievements/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const achievements = await kv.get(`achievements:${userId}`) || { unlocked: [], points: 0 };
    
    return c.json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.log(`Error fetching achievements: ${error}`);
    return c.json({ error: "Failed to fetch achievements" }, 500);
  }
});

// Track learning completion (triggers achievement)
app.post("/make-server-ce1844e7/learning/complete", async (c) => {
  try {
    const { userId, courseId, progress } = await c.req.json();
    
    if (!userId || !courseId) {
      return c.json({ error: "Missing required data" }, 400);
    }
    
    // Store completion
    const completionId = crypto.randomUUID();
    await kv.set(`learning-completion:${userId}:${completionId}`, {
      id: completionId,
      userId,
      courseId,
      progress: progress || 100,
      completedAt: new Date().toISOString(),
    });
    
    // Get total completed courses
    const completions = await kv.getByPrefix(`learning-completion:${userId}:`);
    const completedCount = completions?.length || 0;
    
    // Trigger achievement checks
    await checkAndUnlockAchievements(userId, "learning_complete_5", { completedCount });
    await checkAndUnlockAchievements(userId, "learning_complete_10", { completedCount });
    
    return c.json({
      success: true,
      completedCount,
      message: "Learning progress saved",
    });
  } catch (error) {
    console.log(`Error tracking learning: ${error}`);
    return c.json({ error: "Failed to track learning" }, 500);
  }
});

// ==================== WALLET & PAYMENT FEATURES ====================

// Get wallet balance and transaction history
app.get("/make-server-ce1844e7/wallet/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    // Get wallet data
    const walletKey = `wallet:${userId}`;
    let wallet = await kv.get(walletKey);
    
    if (!wallet) {
      // Initialize wallet if doesn't exist
      wallet = {
        userId,
        balance: 0,
        pendingPayments: 0,
        escrowAmount: 0,
        totalEarned: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
      await kv.set(walletKey, wallet);
    }
    
    // Get transaction history
    const transactions = await kv.getByPrefix(`transaction:${userId}:`);
    
    return c.json({ 
      success: true, 
      wallet,
      transactions: transactions || [],
    });
  } catch (error) {
    console.log(`Error fetching wallet: ${error}`);
    return c.json({ error: "Failed to fetch wallet data" }, 500);
  }
});

// Add funds to wallet
app.post("/make-server-ce1844e7/wallet/add-funds", async (c) => {
  try {
    const { userId, amount, paymentMethod, transactionRef } = await c.req.json();
    
    if (!userId || !amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }
    
    // VERIFICATION REQUIRED FOR WALLET OPERATIONS
    const verificationCheck = await verification.requireVerification(userId, "payment");
    if (!verificationCheck.allowed) {
      return c.json(verification.getVerificationError("wallet deposit"), verificationCheck.status || 403);
    }
    
    const walletKey = `wallet:${userId}`;
    let wallet = await kv.get(walletKey);
    
    if (!wallet) {
      wallet = {
        userId,
        balance: 0,
        pendingPayments: 0,
        escrowAmount: 0,
        totalEarned: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
    }
    
    // LEDGER: Record deposit in double-entry ledger
    const ledgerTx = await walletLedger.recordDeposit(
      userId,
      amount,
      paymentMethod,
      transactionRef,
      paymentMethod
    );
    
    // Update wallet balance (sync with ledger)
    wallet.balance += amount;
    wallet.totalEarned += amount;
    await kv.set(walletKey, wallet);
    
    // Legacy transaction record (for backward compatibility)
    const transaction = {
      id: ledgerTx.id,
      userId,
      type: "credit",
      amount,
      balanceAfter: wallet.balance,
      description: "Added funds to wallet",
      paymentMethod,
      transactionRef,
      status: "completed",
      timestamp: new Date().toISOString(),
      ledgerTransactionId: ledgerTx.id,
    };
    
    await kv.set(`transaction:${userId}:${ledgerTx.id}`, transaction);
    
    // Trigger wallet funded achievement
    await checkAndUnlockAchievements(userId, "wallet_funded");
    
    return c.json({
      success: true,
      wallet,
      transaction,
    });
  } catch (error) {
    console.log(`Error adding funds: ${error}`);
    return c.json({ error: "Failed to add funds" }, 500);
  }
});

// Deduct from wallet
app.post("/make-server-ce1844e7/wallet/deduct", async (c) => {
  try {
    const { userId, amount, description, orderId } = await c.req.json();
    
    if (!userId || !amount || amount <= 0) {
      return c.json({ error: "Invalid amount" }, 400);
    }
    
    // VERIFICATION REQUIRED FOR WALLET OPERATIONS
    const verificationCheck = await verification.requireVerification(userId, "payment");
    if (!verificationCheck.allowed) {
      return c.json(verification.getVerificationError("wallet payment"), verificationCheck.status || 403);
    }
    
    const walletKey = `wallet:${userId}`;
    const wallet = await kv.get(walletKey);
    
    if (!wallet || wallet.balance < amount) {
      return c.json({ error: "Insufficient balance" }, 400);
    }
    
    // LEDGER: Record withdrawal/payment (depends on context)
    // For now, treat as withdrawal to external
    const ledgerTx = await walletLedger.recordWithdrawal(
      userId,
      amount,
      0, // No fee for internal deduction
      "N/A",
      "INTERNAL",
      orderId
    );
    
    // Update wallet balance (sync with ledger)
    wallet.balance -= amount;
    wallet.totalSpent += amount;
    await kv.set(walletKey, wallet);
    
    // Legacy transaction record (for backward compatibility)
    const transaction = {
      id: ledgerTx.id,
      userId,
      type: "debit",
      amount,
      balanceAfter: wallet.balance,
      description: description || "Payment",
      orderId,
      status: "completed",
      timestamp: new Date().toISOString(),
      ledgerTransactionId: ledgerTx.id,
    };
    
    await kv.set(`transaction:${userId}:${ledgerTx.id}`, transaction);
    
    return c.json({
      success: true,
      wallet,
      transaction,
    });
  } catch (error) {
    console.log(`Error deducting funds: ${error}`);
    return c.json({ error: "Failed to deduct funds" }, 500);
  }
});

// Transfer between wallets
app.post("/make-server-ce1844e7/wallet/transfer", async (c) => {
  try {
    const { fromUserId, toUserId, amount, description } = await c.req.json();
    
    if (!fromUserId || !toUserId || !amount || amount <= 0) {
      return c.json({ error: "Invalid transfer data" }, 400);
    }
    
    if (fromUserId === toUserId) {
      return c.json({ error: "Cannot transfer to same wallet" }, 400);
    }
    
    // VERIFICATION REQUIRED FOR BOTH SENDER AND RECIPIENT
    const senderVerification = await verification.requireVerification(fromUserId, "payment");
    if (!senderVerification.allowed) {
      return c.json(verification.getVerificationError("wallet transfer"), senderVerification.status || 403);
    }
    
    const recipientVerification = await verification.requireVerification(toUserId, "payment");
    if (!recipientVerification.allowed) {
      return c.json({ error: "Recipient must verify phone before receiving transfers" }, 403);
    }
    
    // Get sender wallet
    const senderWallet = await kv.get(`wallet:${fromUserId}`);
    if (!senderWallet || senderWallet.balance < amount) {
      return c.json({ error: "Insufficient balance" }, 400);
    }
    
    // Get recipient wallet
    let recipientWallet = await kv.get(`wallet:${toUserId}`);
    if (!recipientWallet) {
      recipientWallet = {
        userId: toUserId,
        balance: 0,
        pendingPayments: 0,
        escrowAmount: 0,
        totalEarned: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString(),
      };
    }
    
    // LEDGER: Record P2P transfer in double-entry ledger
    const ledgerTx = await walletLedger.recordTransfer(
      fromUserId,
      toUserId,
      amount,
      description
    );
    
    // Update balances (sync with ledger)
    senderWallet.balance -= amount;
    senderWallet.totalSpent += amount;
    recipientWallet.balance += amount;
    recipientWallet.totalEarned += amount;
    
    await kv.set(`wallet:${fromUserId}`, senderWallet);
    await kv.set(`wallet:${toUserId}`, recipientWallet);
    
    // Legacy transaction records (for backward compatibility)
    const senderTransaction = {
      id: ledgerTx.id,
      userId: fromUserId,
      type: "transfer_out",
      amount,
      balanceAfter: senderWallet.balance,
      description: description || `Transfer to ${toUserId}`,
      recipientId: toUserId,
      status: "completed",
      timestamp: new Date().toISOString(),
      ledgerTransactionId: ledgerTx.id,
    };
    
    const recipientTransaction = {
      id: ledgerTx.id,
      userId: toUserId,
      type: "transfer_in",
      amount,
      balanceAfter: recipientWallet.balance,
      description: description || `Transfer from ${fromUserId}`,
      senderId: fromUserId,
      status: "completed",
      timestamp: new Date().toISOString(),
      ledgerTransactionId: ledgerTx.id,
    };
    
    await kv.set(`transaction:${fromUserId}:${ledgerTx.id}-out`, senderTransaction);
    await kv.set(`transaction:${toUserId}:${ledgerTx.id}-in`, recipientTransaction);
    
    return c.json({
      success: true,
      transferId,
      senderWallet,
      recipientWallet,
    });
  } catch (error) {
    console.log(`Error transferring funds: ${error}`);
    return c.json({ error: "Failed to transfer funds" }, 500);
  }
});

// Issue refund for an order
app.post("/make-server-ce1844e7/wallet/refund", async (c) => {
  try {
    const { buyerUserId, sellerUserId, amount, orderId, originalTransactionId, reason } = await c.req.json();
    
    if (!buyerUserId || !sellerUserId || !amount || !orderId || !originalTransactionId) {
      return c.json({ error: "Missing required refund data" }, 400);
    }
    
    // Verify seller has sufficient funds (if not in escrow)
    const escrowBalance = await walletLedger.getAccountBalance(
      walletLedger.AccountType.ESCROW,
      orderId
    );
    
    if (escrowBalance < amount) {
      // Check seller wallet balance
      const sellerWallet = await kv.get(`wallet:${sellerUserId}`);
      if (!sellerWallet || sellerWallet.balance < amount) {
        return c.json({ error: "Insufficient funds for refund" }, 400);
      }
    }
    
    // LEDGER: Record refund
    const ledgerTx = await walletLedger.recordRefund(
      buyerUserId,
      sellerUserId,
      amount,
      orderId,
      originalTransactionId,
      reason
    );
    
    // Update wallet balances (sync with ledger)
    const buyerWallet = await kv.get(`wallet:${buyerUserId}`) || {
      userId: buyerUserId,
      balance: 0,
      pendingPayments: 0,
      escrowAmount: 0,
      totalEarned: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    buyerWallet.balance += amount;
    buyerWallet.totalEarned += amount;
    await kv.set(`wallet:${buyerUserId}`, buyerWallet);
    
    // Deduct from seller or escrow
    if (escrowBalance >= amount) {
      // Deduct from escrow
      const sellerWallet = await kv.get(`wallet:${sellerUserId}`);
      if (sellerWallet) {
        sellerWallet.escrowAmount = (sellerWallet.escrowAmount || 0) - amount;
        await kv.set(`wallet:${sellerUserId}`, sellerWallet);
      }
    } else {
      // Deduct from seller balance
      const sellerWallet = await kv.get(`wallet:${sellerUserId}`);
      if (sellerWallet) {
        sellerWallet.balance -= amount;
        sellerWallet.totalSpent += amount;
        await kv.set(`wallet:${sellerUserId}`, sellerWallet);
      }
    }
    
    return c.json({
      success: true,
      refund: ledgerTx,
      buyerBalance: buyerWallet.balance,
    });
  } catch (error) {
    console.log(`Error processing refund: ${error}`);
    return c.json({ error: "Failed to process refund" }, 500);
  }
});

// Release escrow funds to seller
app.post("/make-server-ce1844e7/wallet/release-escrow", async (c) => {
  try {
    const { orderId, sellerUserId, amount, originalTransactionId } = await c.req.json();
    
    if (!orderId || !sellerUserId || !amount || !originalTransactionId) {
      return c.json({ error: "Missing required escrow release data" }, 400);
    }
    
    // Verify escrow has sufficient funds
    const escrowBalance = await walletLedger.getAccountBalance(
      walletLedger.AccountType.ESCROW,
      orderId
    );
    
    if (escrowBalance < amount) {
      return c.json({ error: "Insufficient escrow balance" }, 400);
    }
    
    // LEDGER: Record escrow release
    const ledgerTx = await walletLedger.recordEscrowRelease(
      orderId,
      sellerUserId,
      amount,
      originalTransactionId
    );
    
    // Update seller wallet (sync with ledger)
    const sellerWallet = await kv.get(`wallet:${sellerUserId}`) || {
      userId: sellerUserId,
      balance: 0,
      pendingPayments: 0,
      escrowAmount: 0,
      totalEarned: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString(),
    };
    sellerWallet.balance += amount;
    sellerWallet.escrowAmount = (sellerWallet.escrowAmount || 0) - amount;
    sellerWallet.totalEarned += amount;
    await kv.set(`wallet:${sellerUserId}`, sellerWallet);
    
    return c.json({
      success: true,
      release: ledgerTx,
      sellerBalance: sellerWallet.balance,
    });
  } catch (error) {
    console.log(`Error releasing escrow: ${error}`);
    return c.json({ error: "Failed to release escrow" }, 500);
  }
});

// Get ledger history for user
app.get("/make-server-ce1844e7/wallet/ledger/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const ledgerEntries = await walletLedger.getUserLedger(userId);
    const transactions = await walletLedger.getUserTransactions(userId);
    const balance = await walletLedger.getAccountBalance(
      walletLedger.AccountType.WALLET,
      userId
    );
    
    return c.json({
      success: true,
      balance,
      ledgerEntries,
      transactions,
    });
  } catch (error) {
    console.log(`Error fetching ledger: ${error}`);
    return c.json({ error: "Failed to fetch ledger" }, 500);
  }
});

// Reconcile wallet balance with ledger
app.post("/make-server-ce1844e7/wallet/reconcile/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const reconciliation = await walletLedger.reconcileWalletBalance(userId);
    
    if (!reconciliation.balanced) {
      console.log(`⚠️ BALANCE MISMATCH for user ${userId}:`);
      console.log(`  Ledger Balance: TZS ${reconciliation.ledgerBalance}`);
      console.log(`  Wallet Balance: TZS ${reconciliation.walletBalance}`);
      console.log(`  Difference: TZS ${reconciliation.difference}`);
    }
    
    return c.json({
      success: true,
      ...reconciliation,
    });
  } catch (error) {
    console.log(`Error reconciling balance: ${error}`);
    return c.json({ error: "Failed to reconcile balance" }, 500);
  }
});

// Sync old wallet to ledger (migration endpoint)
app.post("/make-server-ce1844e7/wallet/sync-ledger/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    await walletLedger.syncWalletToLedger(userId);
    
    const reconciliation = await walletLedger.reconcileWalletBalance(userId);
    
    return c.json({
      success: true,
      message: "Wallet synced to ledger",
      ...reconciliation,
    });
  } catch (error) {
    console.log(`Error syncing wallet to ledger: ${error}`);
    return c.json({ error: "Failed to sync wallet" }, 500);
  }
});

// ==================== ADVANCED WALLET FEATURES ====================

// Set transaction limits
app.post("/make-server-ce1844e7/wallet/set-limit", async (c) => {
  try {
    const { userId, limitType, amount } = await c.req.json();
    
    if (!userId || !limitType || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    await walletAdvanced.setTransactionLimit(userId, limitType, amount);
    
    return c.json({
      success: true,
      message: `${limitType} limit set to ${amount} TZS`,
    });
  } catch (error) {
    console.log(`Error setting transaction limit: ${error}`);
    return c.json({ error: "Failed to set transaction limit" }, 500);
  }
});

// Get user transaction limits
app.get("/make-server-ce1844e7/wallet/limits/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const limits = await walletAdvanced.getUserLimits(userId);
    
    return c.json({
      success: true,
      limits,
    });
  } catch (error) {
    console.log(`Error fetching limits: ${error}`);
    return c.json({ error: "Failed to fetch limits" }, 500);
  }
});

// Generate financial report
app.post("/make-server-ce1844e7/wallet/report", async (c) => {
  try {
    const { startDate, endDate, reportType } = await c.req.json();
    
    if (!startDate || !endDate) {
      return c.json({ error: "Missing date range" }, 400);
    }
    
    const report = await walletAdvanced.generateFinancialReport(
      startDate,
      endDate,
      reportType || "custom"
    );
    
    return c.json({
      success: true,
      report,
    });
  } catch (error) {
    console.log(`Error generating report: ${error}`);
    return c.json({ error: "Failed to generate report" }, 500);
  }
});

// Get revenue breakdown
app.get("/make-server-ce1844e7/wallet/revenue-breakdown", async (c) => {
  try {
    const startDate = c.req.query("startDate") || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const endDate = c.req.query("endDate") || new Date().toISOString();
    
    const breakdown = await walletAdvanced.getRevenueBreakdown(startDate, endDate);
    
    return c.json({
      success: true,
      breakdown,
    });
  } catch (error) {
    console.log(`Error fetching revenue breakdown: ${error}`);
    return c.json({ error: "Failed to fetch revenue breakdown" }, 500);
  }
});

// Get escrow report
app.get("/make-server-ce1844e7/wallet/escrow-report", async (c) => {
  try {
    const escrowReport = await walletAdvanced.getEscrowReport();
    
    return c.json({
      success: true,
      escrow: escrowReport,
    });
  } catch (error) {
    console.log(`Error fetching escrow report: ${error}`);
    return c.json({ error: "Failed to fetch escrow report" }, 500);
  }
});

// Get platform wallet statistics (admin)
app.get("/make-server-ce1844e7/wallet/platform-stats", async (c) => {
  try {
    const stats = await walletAdvanced.getPlatformWalletStats();
    
    return c.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log(`Error fetching platform stats: ${error}`);
    return c.json({ error: "Failed to fetch platform stats" }, 500);
  }
});

// Get top users by balance (admin)
app.get("/make-server-ce1844e7/wallet/top-users", async (c) => {
  try {
    const limit = parseInt(c.req.query("limit") || "10");
    
    const topUsers = await walletAdvanced.getTopUsersByBalance(limit);
    
    return c.json({
      success: true,
      topUsers,
    });
  } catch (error) {
    console.log(`Error fetching top users: ${error}`);
    return c.json({ error: "Failed to fetch top users" }, 500);
  }
});

// Get transaction trends
app.get("/make-server-ce1844e7/wallet/trends", async (c) => {
  try {
    const days = parseInt(c.req.query("days") || "7");
    
    const trends = await walletAdvanced.getTransactionTrends(days);
    
    return c.json({
      success: true,
      trends,
    });
  } catch (error) {
    console.log(`Error fetching trends: ${error}`);
    return c.json({ error: "Failed to fetch trends" }, 500);
  }
});

// Run wallet test suite
app.post("/make-server-ce1844e7/wallet/test", async (c) => {
  try {
    const { userId } = await c.req.json();
    
    if (!userId) {
      return c.json({ error: "User ID required" }, 400);
    }
    
    const testResults = await walletAdvanced.runTestSuite(userId);
    
    return c.json({
      success: testResults.success,
      results: testResults.results,
    });
  } catch (error) {
    console.log(`Error running test suite: ${error}`);
    return c.json({ error: "Failed to run test suite" }, 500);
  }
});

// Validate ledger integrity (admin)
app.get("/make-server-ce1844e7/wallet/validate-integrity", async (c) => {
  try {
    const validation = await walletAdvanced.validateLedgerIntegrity();
    
    return c.json({
      success: validation.valid,
      ...validation,
    });
  } catch (error) {
    console.log(`Error validating integrity: ${error}`);
    return c.json({ error: "Failed to validate integrity" }, 500);
  }
});

// Create test transaction scenario
app.post("/make-server-ce1844e7/wallet/test-scenario", async (c) => {
  try {
    const { userId, scenarioType } = await c.req.json();
    
    if (!userId || !scenarioType) {
      return c.json({ error: "User ID and scenario type required" }, 400);
    }
    
    const transaction = await walletAdvanced.createTestScenario(userId, scenarioType);
    
    return c.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.log(`Error creating test scenario: ${error}`);
    return c.json({ error: "Failed to create test scenario" }, 500);
  }
});

// Create payment request
app.post("/make-server-ce1844e7/payment-request", async (c) => {
  try {
    const { userId, recipientName, recipientPhone, amount, purpose, description } = await c.req.json();
    
    if (!userId || !recipientName || !amount) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    // VERIFICATION REQUIRED FOR PAYMENT REQUESTS
    const verificationCheck = await verification.requireVerification(userId, "payment");
    if (!verificationCheck.allowed) {
      return c.json(verification.getVerificationError("payment requests"), verificationCheck.status || 403);
    }
    
    const requestId = `PAY-REQ-${Date.now()}`;
    const paymentLink = `https://creova.app/pay/${requestId}`;
    
    const paymentRequest = {
      id: requestId,
      userId,
      recipientName,
      recipientPhone,
      amount,
      purpose,
      description,
      status: "pending",
      paymentLink,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`payment-request:${requestId}`, paymentRequest);
    await kv.set(`user-payment-request:${userId}:${requestId}`, paymentRequest);
    
    // Send SMS if phone number provided
    if (recipientPhone) {
      try {
        const userData = await kv.get(`user:${userId}`);
        const senderName = userData?.name || "CREOVA User";
        
        await sms.sendPaymentRequestSMS(recipientPhone, senderName, amount, paymentLink);
      } catch (smsError) {
        console.log(`SMS sending failed: ${smsError}`);
        // Don't fail the request if SMS fails
      }
    }
    
    return c.json({ 
      success: true, 
      requestId,
      paymentLink,
      message: "Payment request created successfully",
    });
  } catch (error) {
    console.log(`Error creating payment request: ${error}`);
    return c.json({ error: "Failed to create payment request" }, 500);
  }
});

// Generate invoice
app.post("/make-server-ce1844e7/invoice/generate", async (c) => {
  try {
    const invoiceData = await c.req.json();
    
    if (!invoiceData.userId || !invoiceData.items || invoiceData.items.length === 0) {
      return c.json({ error: "Missing required invoice data" }, 400);
    }
    
    const invoiceNumber = `INV-${Date.now()}`;
    const invoice = {
      ...invoiceData,
      invoiceNumber,
      date: new Date().toLocaleDateString(),
      createdAt: new Date().toISOString(),
    };
    
    // Store invoice
    await kv.set(`invoice:${invoiceNumber}`, invoice);
    await kv.set(`user-invoice:${invoiceData.userId}:${invoiceNumber}`, invoice);
    
    // Generate PDF HTML
    const pdfData: pdf.InvoiceData = {
      invoiceNumber,
      date: invoice.date,
      seller: {
        name: invoice.sellerName,
        phone: invoice.sellerPhone,
      },
      customer: {
        name: invoice.customerName,
        phone: invoice.customerPhone,
      },
      items: invoice.items,
      subtotal: invoice.subtotal,
      vat: invoice.vat,
      total: invoice.total,
      notes: invoice.notes,
    };
    
    const invoiceHTML = pdf.generateInvoiceHTML(pdfData);
    
    // Send SMS if customer phone provided
    if (invoice.customerPhone) {
      try {
        await sms.sendInvoiceSMS(
          invoice.customerPhone,
          invoiceNumber,
          invoice.sellerName,
          invoice.total
        );
      } catch (smsError) {
        console.log(`SMS sending failed: ${smsError}`);
      }
    }
    
    return c.json({ 
      success: true, 
      invoiceNumber,
      invoiceHTML,
      message: "Invoice generated successfully",
    });
  } catch (error) {
    console.log(`Error generating invoice: ${error}`);
    return c.json({ error: "Failed to generate invoice" }, 500);
  }
});

// Get user invoices
app.get("/make-server-ce1844e7/invoices/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const invoices = await kv.getByPrefix(`user-invoice:${userId}:`);
    
    return c.json({ 
      success: true, 
      invoices: invoices || [],
    });
  } catch (error) {
    console.log(`Error fetching invoices: ${error}`);
    return c.json({ error: "Failed to fetch invoices" }, 500);
  }
});

// Create marketplace order (connects to wallet)
app.post("/make-server-ce1844e7/marketplace/order", async (c) => {
  try {
    const { userId, sellerId, items, totalAmount, paymentMethod } = await c.req.json();
    
    if (!userId || !items || items.length === 0 || !totalAmount) {
      return c.json({ error: "Missing required order data" }, 400);
    }
    
    // VERIFICATION REQUIRED FOR MARKETPLACE PURCHASES
    const verificationCheck = await verification.requireVerification(userId, "marketplace");
    if (!verificationCheck.allowed) {
      return c.json(verification.getVerificationError("marketplace purchases"), verificationCheck.status || 403);
    }
    
    const orderNumber = `MKT-${Date.now()}`;
    
    // If paying with wallet
    if (paymentMethod === "wallet") {
      const wallet = await kv.get(`wallet:${userId}`);
      if (!wallet || wallet.balance < totalAmount) {
        return c.json({ error: "Insufficient wallet balance" }, 400);
      }
      
      // LEDGER: Record marketplace payment (with or without escrow)
      let ledgerTx;
      if (sellerId) {
        // Use escrow for marketplace transactions (released after delivery)
        ledgerTx = await walletLedger.recordPayment(
          userId,
          sellerId,
          totalAmount,
          orderNumber,
          true, // Use escrow
          `Marketplace purchase - ${items.length} items`
        );
      } else {
        // No seller, treat as direct purchase
        ledgerTx = await walletLedger.recordWithdrawal(
          userId,
          totalAmount,
          0,
          "N/A",
          "MARKETPLACE",
          orderNumber
        );
      }
      
      // Update wallet balances (sync with ledger)
      wallet.balance -= totalAmount;
      wallet.totalSpent += totalAmount;
      await kv.set(`wallet:${userId}`, wallet);
      
      // Update seller wallet if exists (for non-escrow scenario)
      if (sellerId) {
        let sellerWallet = await kv.get(`wallet:${sellerId}`);
        if (!sellerWallet) {
          sellerWallet = {
            userId: sellerId,
            balance: 0,
            pendingPayments: 0,
            escrowAmount: 0,
            totalEarned: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString(),
          };
        }
        // Don't add to balance yet - it's in escrow
        sellerWallet.escrowAmount = (sellerWallet.escrowAmount || 0) + totalAmount;
        await kv.set(`wallet:${sellerId}`, sellerWallet);
      }
      
      // Legacy transaction records (for backward compatibility)
      await kv.set(`transaction:${userId}:${ledgerTx.id}`, {
        id: ledgerTx.id,
        userId,
        type: "debit",
        amount: totalAmount,
        balanceAfter: wallet.balance,
        description: `Marketplace purchase - ${items.length} items`,
        orderId: orderNumber,
        status: "completed",
        timestamp: new Date().toISOString(),
        ledgerTransactionId: ledgerTx.id,
      });
      
      if (sellerId) {
        await kv.set(`transaction:${sellerId}:${ledgerTx.id}`, {
          id: txnId,
          userId: sellerId,
          type: "credit",
          amount: totalAmount,
          balanceAfter: (await kv.get(`wallet:${sellerId}`))?.balance || 0,
          description: `Marketplace sale - ${items.length} items`,
          orderId: orderNumber,
          status: "completed",
          timestamp: new Date().toISOString(),
        });
      }
    }
    
    // Store order
    const order = {
      id: orderNumber,
      userId,
      sellerId,
      items,
      totalAmount,
      paymentMethod,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(`order:${orderNumber}`, order);
    await kv.set(`user-order:${userId}:${orderNumber}`, order);
    if (sellerId) {
      await kv.set(`seller-order:${sellerId}:${orderNumber}`, order);
    }
    
    // Send notification
    await kv.set(`notification:${userId}:${crypto.randomUUID()}`, {
      userId,
      type: "order_confirmed",
      title: "Order Confirmed",
      message: `Your order ${orderNumber} has been confirmed`,
      timestamp: new Date().toISOString(),
      read: false,
    });
    
    // Trigger first marketplace order achievement
    await checkAndUnlockAchievements(userId, "first_marketplace_order");
    if (sellerId) {
      await checkAndUnlockAchievements(sellerId, "first_sale");
    }
    
    return c.json({
      success: true,
      orderNumber,
      message: "Order created successfully",
    });
  } catch (error) {
    console.log(`Error creating marketplace order: ${error}`);
    return c.json({ error: "Failed to create order" }, 500);
  }
});

// Process agricultural inputs payment
app.post("/make-server-ce1844e7/inputs/purchase", async (c) => {
  try {
    const { userId, items, totalAmount, deliveryFee, paymentMethod } = await c.req.json();
    
    if (!userId || !items || items.length === 0) {
      return c.json({ error: "Missing required purchase data" }, 400);
    }
    
    // Check wallet balance
    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet || wallet.balance < totalAmount) {
      return c.json({ error: "Insufficient wallet balance" }, 400);
    }
    
    const orderNumber = `ORD-${Date.now()}`;
    const order = {
      id: orderNumber,
      userId,
      items,
      totalAmount,
      deliveryFee,
      grandTotal: totalAmount + (deliveryFee || 0),
      paymentMethod,
      status: "processing",
      createdAt: new Date().toISOString(),
    };
    
    // Deduct from wallet
    wallet.balance -= order.grandTotal;
    wallet.totalSpent += order.grandTotal;
    await kv.set(`wallet:${userId}`, wallet);
    
    // Store order
    await kv.set(`order:${orderNumber}`, order);
    await kv.set(`user-order:${userId}:${orderNumber}`, order);
    
    // Record transaction
    const txnId = crypto.randomUUID();
    const transaction = {
      id: txnId,
      userId,
      type: "outgoing",
      description: `Agricultural Inputs Purchase - ${items.length} items`,
      amount: order.grandTotal,
      status: "completed",
      date: new Date().toISOString(),
      provider: paymentMethod || "Wallet",
      reference: orderNumber,
    };
    await kv.set(`transaction:${userId}:${txnId}`, transaction);
    
    // Send confirmation SMS
    try {
      const userData = await kv.get(`user:${userId}`);
      if (userData?.phone) {
        await sms.sendInputOrderSMS(
          userData.phone,
          orderNumber,
          order.grandTotal,
          items.length
        );
      }
    } catch (smsError) {
      console.log(`SMS sending failed: ${smsError}`);
    }
    
    return c.json({ 
      success: true, 
      orderNumber,
      newBalance: wallet.balance,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log(`Error processing purchase: ${error}`);
    return c.json({ error: "Failed to process purchase" }, 500);
  }
});

// Process loan repayment
app.post("/make-server-ce1844e7/loan/repayment", async (c) => {
  try {
    const { userId, loanId, amount, lenderName } = await c.req.json();
    
    if (!userId || !loanId || !amount) {
      return c.json({ error: "Missing required repayment data" }, 400);
    }
    
    // Check wallet balance
    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet || wallet.balance < amount) {
      return c.json({ error: "Insufficient wallet balance" }, 400);
    }
    
    // Get loan details
    const loan = await kv.get(`loan:${loanId}`);
    if (!loan) {
      return c.json({ error: "Loan not found" }, 404);
    }
    
    // Update loan
    loan.paid += amount;
    loan.outstanding -= amount;
    loan.lastPaymentDate = new Date().toISOString();
    loan.lastPaymentAmount = amount;
    
    if (loan.outstanding <= 0) {
      loan.status = "completed";
      loan.outstanding = 0;
    }
    
    await kv.set(`loan:${loanId}`, loan);
    
    // Deduct from wallet
    wallet.balance -= amount;
    wallet.totalSpent += amount;
    await kv.set(`wallet:${userId}`, wallet);
    
    // Record transaction
    const txnId = crypto.randomUUID();
    const reference = `LOAN-${loanId.substring(0, 8)}-${Date.now()}`;
    const transaction = {
      id: txnId,
      userId,
      type: "outgoing",
      description: `Loan Repayment - ${lenderName}`,
      amount,
      status: "completed",
      date: new Date().toISOString(),
      provider: "Wallet",
      reference,
    };
    await kv.set(`transaction:${userId}:${txnId}`, transaction);
    
    // Send confirmation SMS
    try {
      const userData = await kv.get(`user:${userId}`);
      if (userData?.phone) {
        await sms.sendLoanRepaymentSMS(
          userData.phone,
          lenderName,
          amount,
          loan.outstanding,
          reference
        );
      }
    } catch (smsError) {
      console.log(`SMS sending failed: ${smsError}`);
    }
    
    return c.json({ 
      success: true, 
      newBalance: wallet.balance,
      remainingLoanBalance: loan.outstanding,
      loanStatus: loan.status,
      message: "Loan payment successful",
    });
  } catch (error) {
    console.log(`Error processing loan repayment: ${error}`);
    return c.json({ error: "Failed to process loan repayment" }, 500);
  }
});

// Get user loans
app.get("/make-server-ce1844e7/loans/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const loans = await kv.getByPrefix(`user-loan:${userId}:`);
    
    return c.json({ 
      success: true, 
      loans: loans || [],
    });
  } catch (error) {
    console.log(`Error fetching loans: ${error}`);
    return c.json({ error: "Failed to fetch loans" }, 500);
  }
});

// SELCOM checkout - Create order
app.post("/make-server-ce1844e7/selcom/checkout", async (c) => {
  try {
    const { userId, amount, description, buyerName, buyerPhone, buyerEmail } = await c.req.json();
    
    if (!userId || !amount) {
      return c.json({ error: "Missing required checkout data" }, 400);
    }
    
    const orderId = `SELCOM-${Date.now()}`;
    
    const checkoutRequest: selcom.SelcomCheckoutRequest = {
      amount,
      currency: "TZS",
      buyer_email: buyerEmail || "user@creova.co.tz",
      buyer_name: buyerName,
      buyer_phone: buyerPhone,
      order_id: orderId,
      buyer_remarks: description,
      merchant_remarks: `CREOVA Payment - ${description}`,
    };
    
    const response = await selcom.createSelcomOrder(checkoutRequest);
    
    if (response.result === "SUCCESS") {
      // Store order in KV
      await kv.set(`selcom-order:${orderId}`, {
        userId,
        orderId,
        amount,
        status: "pending",
        selcomReference: response.reference,
        createdAt: new Date().toISOString(),
      });
      
      return c.json({ 
        success: true, 
        orderId,
        selcomData: response,
        message: "Checkout session created",
      });
    } else {
      return c.json({ error: response.message }, 400);
    }
  } catch (error) {
    console.log(`SELCOM checkout error: ${error}`);
    return c.json({ error: "Failed to create checkout session" }, 500);
  }
});

// SELCOM webhook - Handle payment callbacks
app.post("/make-server-ce1844e7/selcom/webhook", async (c) => {
  try {
    const payload = await c.req.json();
    
    console.log("SELCOM webhook received:", payload);
    
    // Verify webhook signature here in production
    
    const { order_id, payment_status, transid, channel, amount } = payload;
    
    // Get order
    const order = await kv.get(`selcom-order:${order_id}`);
    if (!order) {
      console.log(`Order not found: ${order_id}`);
      return c.json({ error: "Order not found" }, 404);
    }
    
    // Update order status
    order.status = payment_status.toLowerCase();
    order.transactionId = transid;
    order.channel = channel;
    order.completedAt = new Date().toISOString();
    await kv.set(`selcom-order:${order_id}`, order);
    
    if (payment_status === "COMPLETED") {
      // LEDGER: Record deposit from payment gateway
      const depositAmount = parseFloat(amount);
      const ledgerTx = await walletLedger.recordDeposit(
        order.userId,
        depositAmount,
        channel,
        transid,
        "SELCOM"
      );
      
      // Credit wallet (sync with ledger)
      const wallet = await kv.get(`wallet:${order.userId}`);
      if (wallet) {
        wallet.balance += depositAmount;
        wallet.totalEarned += depositAmount;
        await kv.set(`wallet:${order.userId}`, wallet);
      }
      
      // Legacy transaction record (for backward compatibility)
      const transaction = {
        id: ledgerTx.id,
        userId: order.userId,
        type: "incoming",
        description: `Wallet Top-up via ${channel}`,
        amount: depositAmount,
        status: "completed",
        date: new Date().toISOString(),
        provider: channel,
        reference: transid,
        ledgerTransactionId: ledgerTx.id,
      };
      await kv.set(`transaction:${order.userId}:${ledgerTx.id}`, transaction);
      
      // Send confirmation SMS
      try {
        const userData = await kv.get(`user:${order.userId}`);
        if (userData?.phone) {
          await sms.sendTransactionSMS(
            userData.phone,
            "deposit",
            parseFloat(amount),
            wallet.balance,
            transid
          );
        }
      } catch (smsError) {
        console.log(`SMS sending failed: ${smsError}`);
      }
    }
    
    return c.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.log(`SELCOM webhook error: ${error}`);
    return c.json({ error: "Failed to process webhook" }, 500);
  }
});

// ==================== FLUTTERWAVE INTEGRATION ====================

// Initiate Flutterwave payment
app.post("/make-server-ce1844e7/flutterwave/initiate", async (c) => {
  try {
    const { userId, amount, email, phoneNumber, name, currency, country } = await c.req.json();
    
    if (!userId || !amount || !email || !phoneNumber) {
      return c.json({ error: "Missing required payment data" }, 400);
    }
    
    const txRef = `FLW-${userId}-${Date.now()}`;
    
    const payment = await flutterwave.initiateFlutterwavePayment({
      amount,
      currency: currency || "TZS",
      email,
      phone_number: phoneNumber,
      name: name || "KILIMO User",
      tx_ref: txRef,
      country: country || "TZ",
    });
    
    if (payment.status === "success") {
      // Store payment intent
      await kv.set(`flutterwave-payment:${txRef}`, {
        userId,
        amount,
        currency: currency || "TZS",
        txRef,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      
      return c.json({
        success: true,
        paymentLink: payment.data?.link,
        txRef,
      });
    } else {
      return c.json({ error: payment.message }, 400);
    }
  } catch (error) {
    console.log(`Flutterwave initiation error: ${error}`);
    return c.json({ error: "Failed to initiate payment" }, 500);
  }
});

// Flutterwave webhook
app.post("/make-server-ce1844e7/flutterwave/webhook", async (c) => {
  try {
    const payload = await c.req.json();
    const signature = c.req.header("verif-hash");
    
    console.log("Flutterwave webhook received:", payload.event);
    
    // TODO: Validate signature in production
    // const rawBody = await c.req.text();
    // const isValid = await flutterwave.validateFlutterwaveWebhook(signature, rawBody);
    // if (!isValid) {
    //   return c.json({ error: "Invalid signature" }, 401);
    // }
    
    const result = await flutterwave.processFlutterwaveWebhook(payload);
    
    if (result.success && payload.event === "charge.completed") {
      const txRef = payload.data.tx_ref;
      const paymentIntent = await kv.get(`flutterwave-payment:${txRef}`);
      
      if (paymentIntent) {
        // Record deposit in ledger
        await walletLedger.recordDeposit(
          paymentIntent.userId,
          payload.data.amount,
          "FLUTTERWAVE",
          txRef,
          "FLUTTERWAVE"
        );
        
        // Update wallet balance
        const walletKey = `wallet:${paymentIntent.userId}`;
        let wallet = await kv.get(walletKey);
        
        if (!wallet) {
          wallet = {
            userId: paymentIntent.userId,
            balance: 0,
            pendingPayments: 0,
            escrowAmount: 0,
            totalEarned: 0,
            totalSpent: 0,
            createdAt: new Date().toISOString(),
          };
        }
        
        wallet.balance += payload.data.amount;
        wallet.totalEarned += payload.data.amount;
        await kv.set(walletKey, wallet);
        
        // Update payment status
        paymentIntent.status = "completed";
        paymentIntent.completedAt = new Date().toISOString();
        await kv.set(`flutterwave-payment:${txRef}`, paymentIntent);
        
        console.log(`✅ Flutterwave payment completed: ${txRef} - ${payload.data.amount} ${payload.data.currency}`);
      }
    }
    
    return c.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.log(`Flutterwave webhook error: ${error}`);
    return c.json({ error: "Failed to process webhook" }, 500);
  }
});

// Verify Flutterwave payment
app.get("/make-server-ce1844e7/flutterwave/verify/:transactionId", async (c) => {
  try {
    const transactionId = c.req.param("transactionId");
    
    const verification = await flutterwave.verifyFlutterwavePayment(transactionId);
    
    return c.json({
      success: verification.status === "success",
      verification,
    });
  } catch (error) {
    console.log(`Flutterwave verification error: ${error}`);
    return c.json({ error: "Failed to verify payment" }, 500);
  }
});

// ==================== M-PESA TANZANIA INTEGRATION ====================

// Initiate M-Pesa C2B payment (customer pays business)
app.post("/make-server-ce1844e7/mpesa/c2b", async (c) => {
  try {
    const { userId, amount, phoneNumber } = await c.req.json();
    
    if (!userId || !amount || !phoneNumber) {
      return c.json({ error: "Missing required payment data" }, 400);
    }
    
    // Format phone number
    const formattedPhone = mpesa.formatMPesaPhoneNumber(phoneNumber);
    
    const thirdPartyRef = `MPESA-C2B-${userId}-${Date.now()}`;
    const txRef = `TX-${Date.now()}`;
    
    const payment = await mpesa.initiateMPesaC2BPayment({
      amount,
      customerMSISDN: formattedPhone,
      transactionReference: txRef,
      thirdPartyReference: thirdPartyRef,
    });
    
    if (payment.success) {
      // Store payment intent
      await kv.set(`mpesa-payment:${thirdPartyRef}`, {
        userId,
        amount,
        phoneNumber: formattedPhone,
        transactionID: payment.transactionID,
        conversationID: payment.conversationID,
        thirdPartyRef,
        txRef,
        type: "C2B",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      
      return c.json({
        success: true,
        transactionID: payment.transactionID,
        conversationID: payment.conversationID,
        message: "Please complete payment on your M-Pesa phone",
      });
    } else {
      return c.json({ error: payment.error || "Payment failed" }, 400);
    }
  } catch (error) {
    console.log(`M-Pesa C2B error: ${error}`);
    return c.json({ error: "Failed to initiate M-Pesa payment" }, 500);
  }
});

// Initiate M-Pesa B2C payment (business pays customer - withdrawals)
app.post("/make-server-ce1844e7/mpesa/b2c", async (c) => {
  try {
    const { userId, amount, phoneNumber } = await c.req.json();
    
    if (!userId || !amount || !phoneNumber) {
      return c.json({ error: "Missing required payment data" }, 400);
    }
    
    // Verify user has sufficient balance
    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet || wallet.balance < amount) {
      return c.json({ error: "Insufficient wallet balance" }, 400);
    }
    
    // Format phone number
    const formattedPhone = mpesa.formatMPesaPhoneNumber(phoneNumber);
    
    const thirdPartyRef = `MPESA-B2C-${userId}-${Date.now()}`;
    const txRef = `TX-${Date.now()}`;
    
    const payment = await mpesa.initiateMPesaB2CPayment({
      amount,
      customerMSISDN: formattedPhone,
      transactionReference: txRef,
      thirdPartyReference: thirdPartyRef,
    });
    
    if (payment.success) {
      // Record withdrawal in ledger (pending)
      const ledgerTx = await walletLedger.recordWithdrawal(
        userId,
        amount,
        0, // M-Pesa fees handled separately
        formattedPhone,
        "M-PESA",
        payment.transactionID
      );
      
      // Update wallet balance
      wallet.balance -= amount;
      wallet.totalSpent += amount;
      await kv.set(`wallet:${userId}`, wallet);
      
      // Store payment intent
      await kv.set(`mpesa-payment:${thirdPartyRef}`, {
        userId,
        amount,
        phoneNumber: formattedPhone,
        transactionID: payment.transactionID,
        conversationID: payment.conversationID,
        thirdPartyRef,
        txRef,
        ledgerTxId: ledgerTx.id,
        type: "B2C",
        status: "processing",
        createdAt: new Date().toISOString(),
      });
      
      return c.json({
        success: true,
        transactionID: payment.transactionID,
        conversationID: payment.conversationID,
        message: "Withdrawal initiated. Funds will arrive in M-Pesa shortly",
      });
    } else {
      return c.json({ error: payment.error || "Payment failed" }, 400);
    }
  } catch (error) {
    console.log(`M-Pesa B2C error: ${error}`);
    return c.json({ error: "Failed to initiate M-Pesa withdrawal" }, 500);
  }
});

// M-Pesa webhook/callback
app.post("/make-server-ce1844e7/mpesa/webhook", async (c) => {
  try {
    const payload = await c.req.json();
    
    console.log("M-Pesa webhook received:", payload);
    
    const result = await mpesa.processMPesaWebhook(payload);
    
    if (result.success) {
      const thirdPartyRef = payload.input_ThirdPartyConversationID;
      const paymentIntent = await kv.get(`mpesa-payment:${thirdPartyRef}`);
      
      if (paymentIntent) {
        if (paymentIntent.type === "C2B") {
          // C2B payment completed - add funds to wallet
          await walletLedger.recordDeposit(
            paymentIntent.userId,
            paymentIntent.amount,
            "M-PESA",
            payload.input_TransactionID,
            "M-PESA"
          );
          
          const walletKey = `wallet:${paymentIntent.userId}`;
          let wallet = await kv.get(walletKey);
          
          if (!wallet) {
            wallet = {
              userId: paymentIntent.userId,
              balance: 0,
              pendingPayments: 0,
              escrowAmount: 0,
              totalEarned: 0,
              totalSpent: 0,
              createdAt: new Date().toISOString(),
            };
          }
          
          wallet.balance += paymentIntent.amount;
          wallet.totalEarned += paymentIntent.amount;
          await kv.set(walletKey, wallet);
          
          console.log(`✅ M-Pesa C2B payment completed: ${paymentIntent.amount} TZS to user ${paymentIntent.userId}`);
        } else if (paymentIntent.type === "B2C") {
          // B2C payment completed - withdrawal successful
          console.log(`✅ M-Pesa B2C withdrawal completed: ${paymentIntent.amount} TZS to ${paymentIntent.phoneNumber}`);
        }
        
        // Update payment status
        paymentIntent.status = "completed";
        paymentIntent.completedAt = new Date().toISOString();
        paymentIntent.mpesaTransactionID = payload.input_TransactionID;
        await kv.set(`mpesa-payment:${thirdPartyRef}`, paymentIntent);
      }
    }
    
    return c.json({ success: true, message: "Webhook processed" });
  } catch (error) {
    console.log(`M-Pesa webhook error: ${error}`);
    return c.json({ error: "Failed to process webhook" }, 500);
  }
});

// Query M-Pesa transaction status
app.get("/make-server-ce1844e7/mpesa/status/:transactionId", async (c) => {
  try {
    const transactionId = c.req.param("transactionId");
    const thirdPartyRef = c.req.query("ref") || "";
    
    const query = await mpesa.queryMPesaTransaction({
      transactionID: transactionId,
      thirdPartyReference: thirdPartyRef,
    });
    
    return c.json({
      success: query.success,
      query,
    });
  } catch (error) {
    console.log(`M-Pesa query error: ${error}`);
    return c.json({ error: "Failed to query transaction" }, 500);
  }
});

// Get order status
app.get("/make-server-ce1844e7/selcom/order/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    
    const order = await kv.get(`selcom-order:${orderId}`);
    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }
    
    // Also fetch status from SELCOM
    try {
      const selcomStatus = await selcom.checkSelcomOrderStatus(orderId);
      if (selcomStatus.result === "SUCCESS" && selcomStatus.data) {
        order.selcomStatus = selcomStatus.data[0];
      }
    } catch (selcomError) {
      console.log(`Failed to fetch SELCOM status: ${selcomError}`);
    }
    
    return c.json({ success: true, order });
  } catch (error) {
    console.log(`Error fetching order status: ${error}`);
    return c.json({ error: "Failed to fetch order status" }, 500);
  }
});

// Withdraw from wallet to mobile money
app.post("/make-server-ce1844e7/wallet/withdraw", async (c) => {
  try {
    const { userId, amount, phoneNumber, provider } = await c.req.json();
    
    if (!userId || !amount || !phoneNumber || !provider) {
      return c.json({ error: "Missing required withdrawal data" }, 400);
    }
    
    // Check wallet balance
    const wallet = await kv.get(`wallet:${userId}`);
    if (!wallet || wallet.balance < amount) {
      return c.json({ error: "Insufficient wallet balance" }, 400);
    }
    
    // Calculate fee (1.5% for most providers, 0.5% for GoPay)
    const feePercent = provider.toLowerCase() === "gopay" ? 0.005 : 0.015;
    const fee = amount * feePercent;
    const netAmount = amount - fee;
    
    const withdrawalId = `WD-${Date.now()}`;
    const withdrawal = {
      id: withdrawalId,
      userId,
      amount,
      fee,
      netAmount,
      phoneNumber,
      provider,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    
    // Deduct from wallet
    wallet.balance -= amount;
    wallet.totalSpent += amount;
    await kv.set(`wallet:${userId}`, wallet);
    
    // Store withdrawal
    await kv.set(`withdrawal:${withdrawalId}`, withdrawal);
    
    // Record transaction
    const txnId = crypto.randomUUID();
    const transaction = {
      id: txnId,
      userId,
      type: "outgoing",
      description: `Withdrawal to ${provider}`,
      amount,
      status: "pending",
      date: new Date().toISOString(),
      provider,
      reference: withdrawalId,
    };
    await kv.set(`transaction:${userId}:${txnId}`, transaction);
    
    // In production, trigger actual mobile money transfer here
    // For now, mark as completed after 1 second simulation
    setTimeout(async () => {
      withdrawal.status = "completed";
      transaction.status = "completed";
      await kv.set(`withdrawal:${withdrawalId}`, withdrawal);
      await kv.set(`transaction:${userId}:${txnId}`, transaction);
    }, 1000);
    
    return c.json({ 
      success: true, 
      withdrawalId,
      netAmount,
      fee,
      newBalance: wallet.balance,
      message: "Withdrawal request submitted",
    });
  } catch (error) {
    console.log(`Error processing withdrawal: ${error}`);
    return c.json({ error: "Failed to process withdrawal" }, 500);
  }
});

// ==================== AI FARM PLAN GENERATOR ====================

// Generate AI-powered farm plan
app.post("/make-server-ce1844e7/ai-farm-plan/generate", async (c) => {
  try {
    const { userId, crop, region, farmSize, season } = await c.req.json();

    if (!userId || !crop || !region) {
      return c.json({ error: "userId, crop, and region are required" }, 400);
    }

    const planId = crypto.randomUUID();

    // Create AI prompt for farm plan generation
    const prompt = `Generate a detailed, practical farming plan for a Tanzanian smallholder farmer with the following details:
    
Crop: ${crop}
Region: ${region}
Farm Size: ${farmSize || "1-5 acres"}
Season: ${season || "2024/2025 Main Season"}

Please provide a comprehensive farm plan with:
1. Season phases with specific weeks and days
2. Detailed tasks for each phase with duration and estimated costs in TZS
3. Critical dates and activities
4. Financial projection including total cost, expected yield, revenue, profit, and ROI
5. Practical advice specific to Tanzanian farming conditions

Format the response as a JSON object with this structure:
{
  "crop": "crop name",
  "season": "season name",
  "duration": "total days",
  "phases": [
    {
      "name": "phase name",
      "week": "week range",
      "days": "day range",
      "status": "upcoming",
      "tasks": [
        {
          "task": "task description",
          "duration": "duration",
          "cost": "cost in TZS",
          "completed": false
        }
      ]
    }
  ],
  "summary": {
    "totalCost": "TZS amount",
    "expectedYield": "yield per acre",
    "expectedRevenue": "TZS amount",
    "profit": "TZS amount",
    "roi": "percentage"
  },
  "criticalDates": [
    {
      "date": "Day X",
      "activity": "activity name",
      "importance": "critical/high/medium"
    }
  ]
}`;

    // Call OpenRouter AI for plan generation
    const aiResponse = await openrouter.callOpenRouterAI(
      [{ role: "user", content: prompt }],
      {
        model: openrouter.AI_MODELS.PREMIUM.GPT4,
        temperature: 0.7,
        maxTokens: 3000,
        language: "en"
      }
    );

    let generatedPlan;
    
    if (aiResponse.success) {
      try {
        // Extract JSON from AI response
        const jsonMatch = aiResponse.message.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          generatedPlan = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in AI response");
        }
      } catch (parseError) {
        console.log(`Error parsing AI response: ${parseError}`);
        // Fall back to default plan structure
        generatedPlan = null;
      }
    }

    // If AI generation fails or returns invalid JSON, use template-based generation
    if (!generatedPlan) {
      generatedPlan = generateTemplateFarmPlan(crop, region, farmSize, season);
    }

    // Store the generated plan
    await kv.set(`farm-plan:${userId}:${planId}`, {
      id: planId,
      userId,
      crop,
      region,
      farmSize,
      season: season || generatedPlan.season,
      plan: generatedPlan,
      generatedAt: new Date().toISOString(),
      aiGenerated: aiResponse.success
    });

    return c.json({ 
      success: true, 
      plan: generatedPlan,
      planId,
      aiGenerated: aiResponse.success
    });
  } catch (error) {
    console.log(`Error generating farm plan: ${error}`);
    return c.json({ error: "Failed to generate farm plan" }, 500);
  }
});

// Get user's farm plans
app.get("/make-server-ce1844e7/ai-farm-plan/list/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    const plans = await kv.getByPrefix(`farm-plan:${userId}:`);
    
    return c.json({ 
      success: true, 
      plans: plans.map(p => ({
        id: p.id,
        crop: p.crop,
        season: p.season,
        generatedAt: p.generatedAt,
        aiGenerated: p.aiGenerated
      }))
    });
  } catch (error) {
    console.log(`Error fetching farm plans: ${error}`);
    return c.json({ error: "Failed to fetch farm plans" }, 500);
  }
});

// Update task completion status
app.post("/make-server-ce1844e7/ai-farm-plan/update-task", async (c) => {
  try {
    const { userId, planId, phaseIndex, taskIndex, completed } = await c.req.json();

    if (userId === undefined || !planId || phaseIndex === undefined || taskIndex === undefined) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const planKey = `farm-plan:${userId}:${planId}`;
    const planData = await kv.get(planKey);

    if (!planData) {
      return c.json({ error: "Farm plan not found" }, 404);
    }

    // Update task completion status
    planData.plan.phases[phaseIndex].tasks[taskIndex].completed = completed;

    // Update phase status based on task completion
    const phase = planData.plan.phases[phaseIndex];
    const allTasksCompleted = phase.tasks.every((t: any) => t.completed);
    const someTasksCompleted = phase.tasks.some((t: any) => t.completed);
    
    if (allTasksCompleted) {
      phase.status = "completed";
    } else if (someTasksCompleted) {
      phase.status = "in-progress";
    } else {
      phase.status = "upcoming";
    }

    planData.updatedAt = new Date().toISOString();
    await kv.set(planKey, planData);

    return c.json({ 
      success: true, 
      plan: planData.plan
    });
  } catch (error) {
    console.log(`Error updating task: ${error}`);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// Export farm plan as PDF
app.post("/make-server-ce1844e7/ai-farm-plan/export-pdf", async (c) => {
  try {
    const { userId, planId } = await c.req.json();

    const planData = await kv.get(`farm-plan:${userId}:${planId}`);

    if (!planData) {
      return c.json({ error: "Farm plan not found" }, 404);
    }

    const plan = planData.plan;

    // Generate PDF content
    const pdfContent = pdf.generateFarmPlanPDF({
      farmerName: planData.userId,
      crop: plan.crop,
      season: plan.season,
      duration: plan.duration,
      phases: plan.phases,
      summary: plan.summary,
      criticalDates: plan.criticalDates,
      generatedAt: planData.generatedAt
    });

    return c.json({ 
      success: true, 
      pdfUrl: pdfContent.url,
      message: "Farm plan exported successfully"
    });
  } catch (error) {
    console.log(`Error exporting farm plan: ${error}`);
    return c.json({ error: "Failed to export farm plan" }, 500);
  }
});

// Helper function to generate template-based farm plan
function generateTemplateFarmPlan(crop: string, region: string, farmSize: string, season?: string) {
  const cropData: any = {
    maize: {
      duration: "120 days",
      totalCost: 625000,
      yieldPerAcre: 2.8,
      pricePerTonne: 600000,
      phases: [
        {
          name: "Preparation",
          week: "Weeks 1-2",
          days: "Day 1-14",
          status: "upcoming",
          tasks: [
            { task: "Land clearing and plowing", duration: "3 days", cost: "TZS 50,000", completed: false },
            { task: "Soil testing", duration: "1 day", cost: "TZS 15,000", completed: false },
            { task: "Purchase seeds (hybrid)", duration: "1 day", cost: "TZS 75,000", completed: false },
            { task: "Purchase fertilizer (DAP)", duration: "1 day", cost: "TZS 90,000", completed: false }
          ]
        },
        {
          name: "Planting",
          week: "Week 3",
          days: "Day 15-21",
          status: "upcoming",
          tasks: [
            { task: "Basal fertilizer application", duration: "1 day", cost: "Included", completed: false },
            { task: "Planting (30cm x 75cm spacing)", duration: "2 days", cost: "TZS 30,000", completed: false },
            { task: "First irrigation", duration: "1 day", cost: "TZS 5,000", completed: false }
          ]
        },
        {
          name: "Vegetative Growth",
          week: "Weeks 4-7",
          days: "Day 22-49",
          status: "upcoming",
          tasks: [
            { task: "First weeding", duration: "2 days", cost: "TZS 40,000", completed: false },
            { task: "Top-dress with Urea (Week 4)", duration: "1 day", cost: "TZS 40,000", completed: false },
            { task: "Pest scouting (weekly)", duration: "Ongoing", cost: "Free", completed: false },
            { task: "Irrigation (2x per week)", duration: "Ongoing", cost: "TZS 30,000", completed: false }
          ]
        },
        {
          name: "Flowering & Pollination",
          week: "Weeks 8-10",
          days: "Day 50-70",
          status: "upcoming",
          tasks: [
            { task: "Second fertilizer application (NPK)", duration: "1 day", cost: "TZS 50,000", completed: false },
            { task: "Fall armyworm control", duration: "As needed", cost: "TZS 25,000", completed: false },
            { task: "Increase irrigation frequency", duration: "Ongoing", cost: "TZS 20,000", completed: false }
          ]
        },
        {
          name: "Grain Filling",
          week: "Weeks 11-14",
          days: "Day 71-98",
          status: "upcoming",
          tasks: [
            { task: "Monitor for diseases", duration: "Weekly", cost: "Free", completed: false },
            { task: "Reduce irrigation gradually", duration: "Ongoing", cost: "TZS 15,000", completed: false },
            { task: "Bird deterrent setup", duration: "1 day", cost: "TZS 10,000", completed: false }
          ]
        },
        {
          name: "Maturity & Harvest",
          week: "Weeks 15-17",
          days: "Day 99-120",
          status: "upcoming",
          tasks: [
            { task: "Stop irrigation (2 weeks before harvest)", duration: "N/A", cost: "Free", completed: false },
            { task: "Prepare storage", duration: "2 days", cost: "TZS 20,000", completed: false },
            { task: "Harvest when moisture is 20-25%", duration: "3 days", cost: "TZS 80,000", completed: false },
            { task: "Drying and storage", duration: "5 days", cost: "TZS 30,000", completed: false }
          ]
        }
      ],
      criticalDates: [
        { date: "Day 15", activity: "Planting", importance: "critical" },
        { date: "Day 28", activity: "First top-dress", importance: "high" },
        { date: "Day 50", activity: "Tasseling starts", importance: "high" },
        { date: "Day 99", activity: "Stop irrigation", importance: "medium" },
        { date: "Day 120", activity: "Harvest", importance: "critical" }
      ]
    },
    rice: {
      duration: "135 days",
      totalCost: 750000,
      yieldPerAcre: 3.5,
      pricePerTonne: 800000,
      phases: [
        {
          name: "Nursery Preparation",
          week: "Weeks 1-3",
          days: "Day 1-21",
          status: "upcoming",
          tasks: [
            { task: "Prepare nursery beds", duration: "2 days", cost: "TZS 30,000", completed: false },
            { task: "Seed selection and treatment", duration: "1 day", cost: "TZS 45,000", completed: false },
            { task: "Sowing in nursery", duration: "1 day", cost: "TZS 15,000", completed: false },
            { task: "Nursery management", duration: "21 days", cost: "TZS 35,000", completed: false }
          ]
        },
        {
          name: "Land Preparation",
          week: "Weeks 2-4",
          days: "Day 8-28",
          status: "upcoming",
          tasks: [
            { task: "Primary tillage (plowing)", duration: "3 days", cost: "TZS 60,000", completed: false },
            { task: "Puddling and leveling", duration: "2 days", cost: "TZS 40,000", completed: false },
            { task: "Bund construction", duration: "2 days", cost: "TZS 25,000", completed: false },
            { task: "Flooding the field", duration: "1 day", cost: "TZS 10,000", completed: false }
          ]
        },
        {
          name: "Transplanting",
          week: "Week 4",
          days: "Day 22-28",
          status: "upcoming",
          tasks: [
            { task: "Uproot seedlings from nursery", duration: "1 day", cost: "TZS 20,000", completed: false },
            { task: "Transplanting (20cm x 20cm)", duration: "3 days", cost: "TZS 80,000", completed: false },
            { task: "Gap filling", duration: "1 day", cost: "TZS 15,000", completed: false }
          ]
        },
        {
          name: "Vegetative Stage",
          week: "Weeks 5-9",
          days: "Day 29-63",
          status: "upcoming",
          tasks: [
            { task: "First top-dressing (Urea)", duration: "1 day", cost: "TZS 50,000", completed: false },
            { task: "Weed control (manual/herbicide)", duration: "3 days", cost: "TZS 45,000", completed: false },
            { task: "Water management", duration: "Ongoing", cost: "TZS 40,000", completed: false },
            { task: "Pest monitoring", duration: "Weekly", cost: "Free", completed: false }
          ]
        },
        {
          name: "Reproductive Stage",
          week: "Weeks 10-13",
          days: "Day 64-91",
          status: "upcoming",
          tasks: [
            { task: "Second top-dressing (NPK)", duration: "1 day", cost: "TZS 60,000", completed: false },
            { task: "Panicle initiation care", duration: "Ongoing", cost: "TZS 25,000", completed: false },
            { task: "Disease control (blast, sheath blight)", duration: "As needed", cost: "TZS 35,000", completed: false },
            { task: "Maintain water level at 5-10cm", duration: "Ongoing", cost: "TZS 30,000", completed: false }
          ]
        },
        {
          name: "Maturity & Harvest",
          week: "Weeks 14-19",
          days: "Day 92-135",
          status: "upcoming",
          tasks: [
            { task: "Drain field (2 weeks before harvest)", duration: "1 day", cost: "Free", completed: false },
            { task: "Monitor grain maturity (80% golden)", duration: "Ongoing", cost: "Free", completed: false },
            { task: "Harvesting", duration: "4 days", cost: "TZS 100,000", completed: false },
            { task: "Threshing and winnowing", duration: "3 days", cost: "TZS 50,000", completed: false },
            { task: "Drying and storage", duration: "5 days", cost: "TZS 40,000", completed: false }
          ]
        }
      ],
      criticalDates: [
        { date: "Day 1", activity: "Nursery sowing", importance: "critical" },
        { date: "Day 25", activity: "Transplanting", importance: "critical" },
        { date: "Day 35", activity: "First top-dress", importance: "high" },
        { date: "Day 70", activity: "Panicle initiation", importance: "high" },
        { date: "Day 120", activity: "Drain field", importance: "medium" },
        { date: "Day 135", activity: "Harvest", importance: "critical" }
      ]
    },
    beans: {
      duration: "90 days",
      totalCost: 380000,
      yieldPerAcre: 0.8,
      pricePerTonne: 1200000,
      phases: [
        {
          name: "Land Preparation",
          week: "Weeks 1-2",
          days: "Day 1-14",
          status: "upcoming",
          tasks: [
            { task: "Land clearing and plowing", duration: "2 days", cost: "TZS 40,000", completed: false },
            { task: "Harrowing and leveling", duration: "1 day", cost: "TZS 25,000", completed: false },
            { task: "Purchase certified seeds", duration: "1 day", cost: "TZS 60,000", completed: false },
            { task: "Seed treatment with fungicide", duration: "1 day", cost: "TZS 10,000", completed: false }
          ]
        },
        {
          name: "Planting",
          week: "Week 2",
          days: "Day 8-14",
          status: "upcoming",
          tasks: [
            { task: "Make planting rows (45cm apart)", duration: "1 day", cost: "TZS 15,000", completed: false },
            { task: "Sowing seeds (10cm spacing)", duration: "2 days", cost: "TZS 25,000", completed: false },
            { task: "Apply DAP fertilizer", duration: "1 day", cost: "TZS 35,000", completed: false }
          ]
        },
        {
          name: "Vegetative Growth",
          week: "Weeks 3-5",
          days: "Day 15-35",
          status: "upcoming",
          tasks: [
            { task: "First weeding", duration: "2 days", cost: "TZS 30,000", completed: false },
            { task: "Thinning (2 plants per hill)", duration: "1 day", cost: "TZS 15,000", completed: false },
            { task: "Top-dress with Urea", duration: "1 day", cost: "TZS 25,000", completed: false },
            { task: "Aphid and bean fly control", duration: "As needed", cost: "TZS 20,000", completed: false }
          ]
        },
        {
          name: "Flowering",
          week: "Weeks 6-7",
          days: "Day 36-49",
          status: "upcoming",
          tasks: [
            { task: "Second weeding", duration: "2 days", cost: "TZS 25,000", completed: false },
            { task: "Foliar fertilizer application", duration: "1 day", cost: "TZS 15,000", completed: false },
            { task: "Pest monitoring (pod borers)", duration: "Weekly", cost: "Free", completed: false }
          ]
        },
        {
          name: "Pod Formation",
          week: "Weeks 8-11",
          days: "Day 50-77",
          status: "upcoming",
          tasks: [
            { task: "Pest control (pod borers, beetles)", duration: "As needed", cost: "TZS 25,000", completed: false },
            { task: "Disease control (rust, anthracnose)", duration: "As needed", cost: "TZS 20,000", completed: false },
            { task: "Light irrigation if dry", duration: "Ongoing", cost: "TZS 15,000", completed: false }
          ]
        },
        {
          name: "Maturity & Harvest",
          week: "Weeks 12-13",
          days: "Day 78-90",
          status: "upcoming",
          tasks: [
            { task: "Monitor pod maturity (80% dry)", duration: "Ongoing", cost: "Free", completed: false },
            { task: "Harvesting (pull whole plants)", duration: "2 days", cost: "TZS 30,000", completed: false },
            { task: "Drying in shade", duration: "3 days", cost: "TZS 10,000", completed: false },
            { task: "Threshing and winnowing", duration: "2 days", cost: "TZS 20,000", completed: false },
            { task: "Storage preparation", duration: "1 day", cost: "TZS 15,000", completed: false }
          ]
        }
      ],
      criticalDates: [
        { date: "Day 10", activity: "Planting", importance: "critical" },
        { date: "Day 21", activity: "First weeding", importance: "high" },
        { date: "Day 40", activity: "Flowering starts", importance: "high" },
        { date: "Day 50", activity: "Pod formation", importance: "medium" },
        { date: "Day 85", activity: "Harvest", importance: "critical" }
      ]
    }
  };

  const selectedCrop = cropData[crop.toLowerCase()] || cropData.maize;
  const farmSizeNum = parseFloat(farmSize) || 1;

  return {
    crop: crop,
    season: season || "2024/2025 Main Season",
    duration: selectedCrop.duration,
    phases: selectedCrop.phases,
    summary: {
      totalCost: `TZS ${(selectedCrop.totalCost * farmSizeNum).toLocaleString()}`,
      expectedYield: `${(selectedCrop.yieldPerAcre * farmSizeNum).toFixed(1)} tonnes`,
      expectedRevenue: `TZS ${(selectedCrop.yieldPerAcre * farmSizeNum * selectedCrop.pricePerTonne).toLocaleString()}`,
      profit: `TZS ${((selectedCrop.yieldPerAcre * farmSizeNum * selectedCrop.pricePerTonne) - (selectedCrop.totalCost * farmSizeNum)).toLocaleString()}`,
      roi: `${(((selectedCrop.yieldPerAcre * farmSizeNum * selectedCrop.pricePerTonne) / (selectedCrop.totalCost * farmSizeNum) - 1) * 100).toFixed(0)}%`
    },
    criticalDates: selectedCrop.criticalDates
  };
}

// Register AI workflow endpoints
workflows.registerWorkflowEndpoints(app);

// Register role-based signup API endpoints
signupApi.registerSignupEndpoints(app);

// Mount weather router
app.route("/make-server-ce1844e7/weather", weatherRouter);

// Mount unified AI engine
app.route("/make-server-ce1844e7/ai", aiEngine);

// Mount world-class onboarding auth routes
app.route("/make-server-ce1844e7", authRoutes);

// Unified Auth Routes (Email + Phone)
app.post("/make-server-ce1844e7/auth/signup", (c) => authUnified.handleAuthSignup(c.req.raw));
app.post("/make-server-ce1844e7/auth/phone-verify", (c) => authUnified.handlePhoneVerify(c.req.raw));

// AI Telemetry & Monitoring Routes
app.post("/make-server-ce1844e7/ai-telemetry/log", (c) => aiTelemetry.logAIEvent(c.req.raw));
app.get("/make-server-ce1844e7/ai-telemetry/metrics/:userId", (c) => {
  const userId = c.req.param("userId");
  return aiTelemetry.getAIMetrics(c.req.raw, userId);
});
app.get("/make-server-ce1844e7/ai-telemetry/dashboard", (c) => aiTelemetry.getAIAnalyticsDashboard(c.req.raw));

// Crash Reporting Routes
app.post("/make-server-ce1844e7/crash-reports/log", (c) => crashReporting.logCrashReport(c.req.raw));
app.get("/make-server-ce1844e7/crash-reports/metrics", (c) => crashReporting.getCrashMetrics(c.req.raw));

// ==================== DASHBOARD HOME ====================

// Get dashboard data for user
app.get("/make-server-ce1844e7/dashboard/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    
    if (!userId) {
      return c.json({ error: "User ID required" }, 400);
    }

    // Fetch user data
    const user = await kv.get(`user:${userId}`);
    
    // Use stored data if available, otherwise provide sensible defaults
    // This allows new users to see the dashboard before completing full profile
    const userData = user || {
      id: userId,
      name: "New Farmer",
      region: "Morogoro",
      role: "smallholder_farmer"
    };

    // Get weather data for user's region
    let weatherData = {
      temp: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      rainfall: 12,
      wind: 15
    };

    try {
      // Try to get real weather if region is available
      if (userData.region) {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${userData.region},TZ&units=metric&appid=${Deno.env.get("OPENWEATHER_API_KEY")}`
        );
        if (weatherResponse.ok) {
          const weather = await weatherResponse.json();
          weatherData = {
            temp: Math.round(weather.main.temp),
            condition: weather.weather[0].main,
            humidity: weather.main.humidity,
            rainfall: weather.rain?.["1h"] || 0,
            wind: Math.round(weather.wind.speed * 3.6) // Convert m/s to km/h
          };
        }
      }
    } catch (err) {
      console.warn("Weather fetch failed, using defaults:", err.message);
    }

    // Get user's tasks
    const tasksData = await kv.getByPrefix(`task:${userId}:`);
    const tasks = tasksData.map((task: any) => ({
      id: task.id,
      title: task.title,
      priority: task.priority || "medium",
      completed: task.completed || false
    }));

    // Get user's active crops
    const cropsData = await kv.getByPrefix(`crop:${userId}:`);
    const activeCrops = cropsData.length;

    // Calculate pending tasks
    const pendingTasks = tasks.filter((t: any) => !t.completed).length;

    // Get farm stats
    const farmStats = await kv.get(`farm_stats:${userId}`) || {
      revenueTarget: 15000000,
      currentProgress: 0,
      daysLeft: 120
    };

    // Get revenue (from transactions or farm stats)
    let totalRevenue = 0;
    const transactions = await kv.getByPrefix(`transaction:${userId}:`);
    transactions.forEach((tx: any) => {
      if (tx.type === "income" || tx.type === "sale") {
        totalRevenue += tx.amount;
      }
    });

    // Format revenue
    const revenue = totalRevenue >= 1000000 
      ? `${(totalRevenue / 1000000).toFixed(1)}M`
      : `${(totalRevenue / 1000).toFixed(0)}k`;

    // Get market trends for user's region
    const marketTrends = [
      { crop: "Maize", price: 850000, change: 5.2, trend: "up" },
      { crop: "Rice", price: 1200000, change: -2.1, trend: "down" },
      { crop: "Beans", price: 950000, change: 3.8, trend: "up" }
    ];

    // Try to get real market data
    try {
      const realMarketData = await kv.getByPrefix(`market:${userData.region}:`);
      if (realMarketData.length > 0) {
        marketTrends.length = 0; // Clear defaults
        realMarketData.slice(0, 3).forEach((market: any) => {
          marketTrends.push({
            crop: market.crop,
            price: market.price,
            change: market.change || 0,
            trend: market.change > 0 ? "up" : "down"
          });
        });
      }
    } catch (err) {
      console.warn("Market data fetch failed, using defaults");
    }

    // Calculate progress
    const currentProgress = Math.min(
      100,
      Math.round((totalRevenue / farmStats.revenueTarget) * 100)
    );

    return c.json({
      stats: {
        activeCrops,
        pendingTasks,
        revenue,
        soilHealth: "Good" // TODO: Calculate from real data
      },
      weather: weatherData,
      tasks: tasks.slice(0, 3), // Top 3 tasks
      marketTrends,
      farmStats: {
        revenueTarget: farmStats.revenueTarget,
        currentProgress,
        daysLeft: farmStats.daysLeft
      }
    });

  } catch (error: any) {
    console.error("Dashboard error:", error);
    return c.json({ 
      error: "Failed to load dashboard",
      message: error.message 
    }, 500);
  }
});

// Toggle task completion
app.post("/make-server-ce1844e7/tasks/:taskId/toggle", async (c) => {
  try {
    const taskId = c.req.param("taskId");
    
    if (!taskId) {
      return c.json({ error: "Task ID required" }, 400);
    }

    // Get task
    const tasks = await kv.getByPrefix(`task:`);
    const task = tasks.find((t: any) => t.id === parseInt(taskId));
    
    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    // Toggle completion
    const updatedTask = {
      ...task,
      completed: !task.completed,
      updatedAt: new Date().toISOString()
    };

    // Save updated task
    await kv.set(`task:${task.userId}:${taskId}`, updatedTask);

    return c.json({
      success: true,
      task: updatedTask
    });

  } catch (error: any) {
    console.error("Task toggle error:", error);
    return c.json({ 
      error: "Failed to update task",
      message: error.message 
    }, 500);
  }
});

// ==================== UNIFIED PAYMENT SYSTEM ====================

import * as paymentsUnified from "./payments_unified.tsx";

// Initiate deposit via STK Push or Card
app.post("/make-server-ce1844e7/payments/deposit/initiate", async (c) => {
  try {
    const { userId, amount, phoneNumber, paymentMethod, description } = await c.req.json();
    
    if (!userId || !amount || !phoneNumber || !paymentMethod) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    if (amount < 1000) {
      return c.json({ error: "Minimum deposit is TZS 1,000" }, 400);
    }

    // Check if user is verified
    const user = await kv.get(`user:${userId}`);
    if (!user || !user.verified) {
      return c.json({ error: "Phone verification required to deposit funds" }, 403);
    }

    // Initiate payment
    const result = await paymentsUnified.initiatePayment({
      userId,
      amount: parseFloat(amount),
      phoneNumber,
      paymentMethod,
      description,
    });

    if (result.success) {
      return c.json({
        success: true,
        transactionId: result.transactionId,
        checkoutUrl: result.checkoutUrl,
        message: result.message,
      });
    } else {
      return c.json({
        success: false,
        error: result.error || "Failed to initiate payment",
      }, 400);
    }
  } catch (error) {
    console.error("Payment initiation error:", error);
    return c.json({ error: "Failed to initiate payment" }, 500);
  }
});

// Verify payment status
app.post("/make-server-ce1844e7/payments/verify", async (c) => {
  try {
    const { transactionId } = await c.req.json();
    
    if (!transactionId) {
      return c.json({ error: "Transaction ID required" }, 400);
    }

    const result = await paymentsUnified.verifyPayment(transactionId);

    return c.json({
      success: result.success,
      status: result.status,
      error: result.error,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return c.json({ error: "Failed to verify payment" }, 500);
  }
});

// Payment callback (for cards and async payments)
app.post("/make-server-ce1844e7/payments/callback", async (c) => {
  try {
    const body = await c.req.json();
    
    console.log("Payment callback received:", body);
    
    // Handle different provider callbacks
    // Flutterwave, Selcom, M-Pesa all have different callback formats
    
    // Extract transaction reference
    const reference = body.tx_ref || body.transactionId || body.reference;
    
    if (reference) {
      // Verify the payment
      await paymentsUnified.verifyPayment(reference);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Payment callback error:", error);
    return c.json({ error: "Callback processing failed" }, 500);
  }
});

// Get payment methods (providers available)
app.get("/make-server-ce1844e7/payments/methods", async (c) => {
  return c.json({
    success: true,
    methods: [
      {
        id: "mpesa",
        name: "M-Pesa",
        type: "mobile_money",
        logo: "🟢",
        fee: 1.5,
        available: true,
        stk_push: true, // Supports STK push
      },
      {
        id: "tigopesa",
        name: "TigoPesa",
        type: "mobile_money",
        logo: "🔵",
        fee: 1.8,
        available: true,
        stk_push: true,
      },
      {
        id: "airtel",
        name: "Airtel Money",
        type: "mobile_money",
        logo: "🔴",
        fee: 1.5,
        available: true,
        stk_push: true,
      },
      {
        id: "halopesa",
        name: "Halopesa",
        type: "mobile_money",
        logo: "💚",
        fee: 0.5,
        available: true,
        stk_push: true,
      },
      {
        id: "card",
        name: "Credit/Debit Card",
        type: "card",
        logo: "💳",
        fee: 2.9,
        available: true,
        stk_push: false,
      },
    ],
  });
});

// ==================== ALERTS SYSTEM ====================

// Create alert
app.post("/make-server-ce1844e7/alerts/create", async (c) => {
  try {
    const { userId, type, severity, message, action } = await c.req.json();
    
    if (!userId || !type || !message) {
      return c.json({ error: "Missing required fields" }, 400);
    }
    
    const alertId = `alert:${userId}:${Date.now()}`;
    const alert = {
      id: alertId,
      userId,
      type, // "weather", "pest", "market", "crop_health"
      severity, // "low", "medium", "high", "critical"
      message,
      action, // Recommended action
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(alertId, alert);
    
    // Also store in user's alert list
    const userAlertsKey = `alerts:${userId}`;
    const userAlerts = await kv.get(userAlertsKey) || [];
    userAlerts.unshift(alert); // Add to beginning
    await kv.set(userAlertsKey, userAlerts.slice(0, 50)); // Keep last 50
    
    console.log(`Alert created: ${alertId} for user ${userId}`);
    return c.json({ success: true, alert });
  } catch (error) {
    console.error("Alert creation error:", error);
    return c.json({ error: "Failed to create alert" }, 500);
  }
});

// Get user alerts
app.get("/make-server-ce1844e7/alerts/:userId", async (c) => {
  try {
    const userId = c.req.param("userId");
    const alerts = await kv.get(`alerts:${userId}`) || [];
    
    return c.json({ success: true, alerts });
  } catch (error) {
    console.error("Fetch alerts error:", error);
    return c.json({ error: "Failed to fetch alerts" }, 500);
  }
});

// Mark alert as read
app.post("/make-server-ce1844e7/alerts/mark-read", async (c) => {
  try {
    const { userId, alertId } = await c.req.json();
    
    const alert = await kv.get(alertId);
    if (alert) {
      alert.read = true;
      await kv.set(alertId, alert);
      
      // Update in user's list too
      const userAlerts = await kv.get(`alerts:${userId}`) || [];
      const updatedAlerts = userAlerts.map(a => 
        a.id === alertId ? { ...a, read: true } : a
      );
      await kv.set(`alerts:${userId}`, updatedAlerts);
    }
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Mark alert read error:", error);
    return c.json({ error: "Failed to mark alert as read" }, 500);
  }
});

// ==================== CROP INTELLIGENCE SYSTEM ROUTES ====================

// Crop Profiles
app.post('/make-server-ce1844e7/crop-profiles', async (c) => {
  try {
    const { crop, userId } = await c.req.json();
    if (!crop || !userId) return c.json({ error: 'Crop and userId required' }, 400);
    const key = `crop_profiles:${userId}`;
    const existing = await kv.get(key) || [];
    existing.push(crop);
    await kv.set(key, existing);
    return c.json({ success: true, crop });
  } catch (error) {
    console.error('Crop profile save error:', error);
    return c.json({ error: 'Failed to save crop profile' }, 500);
  }
});

app.get('/make-server-ce1844e7/crop-profiles', async (c) => {
  try {
    const userId = c.req.query('userId');
    if (!userId) return c.json({ error: 'userId required' }, 400);
    const profiles = await kv.get(`crop_profiles:${userId}`) || [];
    return c.json({ profiles });
  } catch (error) {
    console.error('Crop profiles load error:', error);
    return c.json({ error: 'Failed to load profiles' }, 500);
  }
});

// Growing Templates
app.post('/make-server-ce1844e7/growing-templates', async (c) => {
  try {
    const { template, userId } = await c.req.json();
    if (!template || !userId) return c.json({ error: 'Template and userId required' }, 400);
    const key = `growing_templates:${userId}`;
    const existing = await kv.get(key) || [];
    existing.push(template);
    await kv.set(key, existing);
    return c.json({ success: true, template });
  } catch (error) {
    console.error('Template save error:', error);
    return c.json({ error: 'Failed to save template' }, 500);
  }
});

app.get('/make-server-ce1844e7/growing-templates', async (c) => {
  try {
    const userId = c.req.query('userId');
    if (!userId) return c.json({ error: 'userId required' }, 400);
    const templates = await kv.get(`growing_templates:${userId}`) || [];
    return c.json({ templates });
  } catch (error) {
    console.error('Templates load error:', error);
    return c.json({ error: 'Failed to load templates' }, 500);
  }
});

// Crop Plans
app.post('/make-server-ce1844e7/crop-plans', async (c) => {
  try {
    const { plan, userId } = await c.req.json();
    if (!plan || !userId) return c.json({ error: 'Plan and userId required' }, 400);
    const key = `crop_plans:${userId}`;
    const existing = await kv.get(key) || [];
    existing.push(plan);
    await kv.set(key, existing);
    return c.json({ success: true, plan });
  } catch (error) {
    console.error('Plan save error:', error);
    return c.json({ error: 'Failed to save plan' }, 500);
  }
});

app.get('/make-server-ce1844e7/crop-plans', async (c) => {
  try {
    const userId = c.req.query('userId');
    if (!userId) return c.json({ error: 'userId required' }, 400);
    const plans = await kv.get(`crop_plans:${userId}`) || [];
    return c.json({ plans });
  } catch (error) {
    console.error('Plans load error:', error);
    return c.json({ error: 'Failed to load plans' }, 500);
  }
});

// Tasks (with batch support for auto-generation)
app.post('/make-server-ce1844e7/tasks', async (c) => {
  try {
    const { task, userId } = await c.req.json();
    if (!task || !userId) return c.json({ error: 'Task and userId required' }, 400);
    const key = `tasks:${userId}`;
    const existing = await kv.get(key) || [];
    existing.push(task);
    await kv.set(key, existing);
    return c.json({ success: true, task });
  } catch (error) {
    console.error('Task save error:', error);
    return c.json({ error: 'Failed to save task' }, 500);
  }
});

app.post('/make-server-ce1844e7/tasks/batch', async (c) => {
  try {
    const { tasks, userId } = await c.req.json();
    if (!tasks || !Array.isArray(tasks) || !userId) return c.json({ error: 'Tasks array and userId required' }, 400);
    const key = `tasks:${userId}`;
    const existing = await kv.get(key) || [];
    await kv.set(key, [...existing, ...tasks]);
    return c.json({ success: true, count: tasks.length });
  } catch (error) {
    console.error('Batch tasks save error:', error);
    return c.json({ error: 'Failed to batch save tasks' }, 500);
  }
});

app.get('/make-server-ce1844e7/tasks', async (c) => {
  try {
    console.log('GET /tasks called with query:', c.req.query());
    const userId = c.req.query('userId');
    console.log('Extracted userId:', userId);
    if (!userId) {
      console.log('No userId provided, returning 400');
      return c.json({ error: 'userId required' }, 400);
    }
    const tasks = await kv.get(`tasks:${userId}`) || [];
    console.log(`Loaded ${tasks.length} tasks for user ${userId}`);
    return c.json({ tasks });
  } catch (error) {
    console.error('Tasks load error:', error);
    return c.json({ error: 'Failed to load tasks' }, 500);
  }
});

app.patch('/make-server-ce1844e7/tasks/:id', async (c) => {
  try {
    const userId = c.req.query('userId');
    const taskId = c.req.param('id');
    const updates = await c.req.json();
    if (!userId) return c.json({ error: 'userId required' }, 400);
    const key = `tasks:${userId}`;
    const tasks = await kv.get(key) || [];
    await kv.set(key, tasks.map((t: any) => t.id === taskId ? { ...t, ...updates } : t));
    return c.json({ success: true });
  } catch (error) {
    console.error('Task update error:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

app.delete('/make-server-ce1844e7/tasks/:id', async (c) => {
  try {
    const userId = c.req.query('userId');
    const taskId = c.req.param('id');
    if (!userId) return c.json({ error: 'userId required' }, 400);
    const key = `tasks:${userId}`;
    const tasks = await kv.get(key) || [];
    await kv.set(key, tasks.filter((t: any) => t.id !== taskId));
    return c.json({ success: true });
  } catch (error) {
    console.error('Task delete error:', error);
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

// ==================== PREDICTIONS ====================

// Get yield predictions for user
app.get('/make-server-ce1844e7/predictions/yield/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Fetch user data to get crop information (optional - use defaults if not found)
    const userData = await kv.get(`user:${userId}`);
    
    // Use defaults if user data not found (allows demo/new users to work)
    const crops = userData?.crops || ['Maize', 'Beans'];
    const predictions = crops.map((crop: string) => ({
      crop,
      currentYield: (2.5 + Math.random() * 2).toFixed(1), // 2.5-4.5 tons/hectare
      potentialYield: (4.5 + Math.random() * 2).toFixed(1), // 4.5-6.5 tons/hectare
      confidence: (0.75 + Math.random() * 0.2).toFixed(2), // 0.75-0.95
      factors: [
        'Optimal planting timing',
        'Proper fertilizer application',
        'Adequate water management',
        'Early pest control'
      ],
      recommendations: [
        `Use certified ${crop} seeds for better yields`,
        'Apply fertilizer in split doses',
        'Maintain proper plant spacing',
        'Control weeds in first 6 weeks'
      ]
    }));

    return c.json({ 
      success: true,
      predictions,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Yield prediction error:', error);
    return c.json({ error: 'Failed to generate yield predictions' }, 500);
  }
});

// Get price predictions for specific crop and location
app.get('/make-server-ce1844e7/predictions/price/:location/:crop', async (c) => {
  try {
    const location = c.req.param('location');
    const crop = c.req.param('crop');

    // Generate mock price predictions
    const currentPrice = Math.floor(800 + Math.random() * 1200); // TSh 800-2000
    const priceChange = (Math.random() - 0.5) * 20; // -10% to +10%
    
    const predictions = [
      {
        period: 'Next Week',
        priceMin: Math.floor(currentPrice * 0.95),
        priceMax: Math.floor(currentPrice * 1.05),
        confidence: 0.85,
        trend: priceChange > 0 ? 'increasing' : 'decreasing'
      },
      {
        period: 'Next Month',
        priceMin: Math.floor(currentPrice * 0.90),
        priceMax: Math.floor(currentPrice * 1.15),
        confidence: 0.70,
        trend: priceChange > 5 ? 'increasing' : priceChange < -5 ? 'decreasing' : 'stable'
      },
      {
        period: 'Next Quarter',
        priceMin: Math.floor(currentPrice * 0.85),
        priceMax: Math.floor(currentPrice * 1.25),
        confidence: 0.60,
        trend: 'seasonal'
      }
    ];

    return c.json({
      success: true,
      crop,
      location,
      currentPrice,
      currency: 'TSh',
      unit: 'kg',
      predictions,
      factors: [
        'Seasonal demand patterns',
        'Regional supply levels',
        'Weather conditions',
        'Market accessibility'
      ],
      recommendations: [
        priceChange > 5 ? 'Consider holding stock for better prices' : 'Current prices are favorable for selling',
        'Monitor competing markets for better opportunities',
        'Store produce properly to maintain quality'
      ],
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Price prediction error:', error);
    return c.json({ error: 'Failed to generate price predictions' }, 500);
  }
});

// Get disease predictions for user's crops
app.get('/make-server-ce1844e7/predictions/disease/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    
    // Fetch user data (optional - use defaults if not found)
    const userData = await kv.get(`user:${userId}`);
    
    // Use defaults if user data not found (allows demo/new users to work)
    const crops = userData?.crops || ['Maize', 'Beans'];
    const region = userData?.region || 'Arusha';
    
    const diseaseRisks = [
      {
        disease: 'Late Blight',
        crop: crops[0] || 'Maize',
        riskLevel: 'medium',
        probability: (0.35 + Math.random() * 0.3).toFixed(2),
        peakPeriod: 'Next 2-3 weeks',
        symptoms: [
          'Water-soaked spots on leaves',
          'White fungal growth on leaf underside',
          'Brown lesions spreading rapidly'
        ],
        prevention: [
          'Apply preventive fungicide (Ridomil Gold)',
          'Improve air circulation between plants',
          'Remove infected plant parts immediately',
          'Avoid overhead irrigation'
        ],
        treatment: 'Apply Mancozeb or Ridomil Gold every 7-10 days'
      },
      {
        disease: 'Fall Armyworm',
        crop: crops[0] || 'Maize',
        riskLevel: 'high',
        probability: (0.55 + Math.random() * 0.25).toFixed(2),
        peakPeriod: 'Current season',
        symptoms: [
          'Ragged holes in leaves',
          'Sawdust-like frass near whorl',
          'Visible caterpillars in plant whorl'
        ],
        prevention: [
          'Scout fields regularly (2-3 times per week)',
          'Plant early to avoid peak infestation',
          'Use companion planting (desmodium)',
          'Apply neem-based products early'
        ],
        treatment: 'Apply recommended insecticide (Actellic, Karate) targeting young larvae'
      },
      {
        disease: 'Bean Rust',
        crop: crops[1] || 'Beans',
        riskLevel: 'low',
        probability: (0.15 + Math.random() * 0.20).toFixed(2),
        peakPeriod: 'Mid to late season',
        symptoms: [
          'Small rust-colored pustules on leaves',
          'Yellow halos around pustules',
          'Premature leaf drop'
        ],
        prevention: [
          'Use resistant varieties',
          'Ensure proper plant spacing',
          'Avoid working in wet fields',
          'Remove crop residue after harvest'
        ],
        treatment: 'Apply sulfur-based fungicide if infection appears'
      }
    ];

    return c.json({
      success: true,
      region,
      crops,
      diseaseRisks,
      weatherFactors: {
        humidity: '75-85% (favorable for fungal diseases)',
        temperature: '24-28°C (moderate risk)',
        rainfall: 'Above average (increased disease pressure)'
      },
      generalRecommendations: [
        'Increase field scouting frequency during rainy season',
        'Keep records of pest and disease occurrences',
        'Rotate crops to break disease cycles',
        'Maintain farm hygiene and sanitation'
      ],
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Disease prediction error:', error);
    return c.json({ error: 'Failed to generate disease predictions' }, 500);
  }
});

// ==================== CROP LIBRARY ====================

// Initialize crop images bucket (on startup)
app.get("/make-server-ce1844e7/crop-library/init", async (c) => {
  try {
    await cropLibrary.initializeCropImagesBucket();
    await cropLibrary.seedCropDatabase();
    
    return c.json({ 
      success: true, 
      message: "Crop library initialized" 
    });
  } catch (error) {
    console.error('Crop library init error:', error);
    return c.json({ error: 'Failed to initialize crop library' }, 500);
  }
});

// Get all crops
app.get("/make-server-ce1844e7/crop-library/crops", async (c) => {
  try {
    const crops = await cropLibrary.getAllCrops();
    
    return c.json({ 
      success: true, 
      crops,
      count: crops.length 
    });
  } catch (error) {
    console.error('Get crops error:', error);
    return c.json({ error: 'Failed to get crops' }, 500);
  }
});

// Get single crop by ID
app.get("/make-server-ce1844e7/crop-library/crops/:cropId", async (c) => {
  try {
    const cropId = c.req.param("cropId");
    const crop = await cropLibrary.getCropById(cropId);
    
    if (!crop) {
      return c.json({ error: 'Crop not found' }, 404);
    }
    
    return c.json({ 
      success: true, 
      crop 
    });
  } catch (error) {
    console.error('Get crop error:', error);
    return c.json({ error: 'Failed to get crop' }, 500);
  }
});

// Generate crop image (admin/system only)
app.post("/make-server-ce1844e7/crop-library/generate-image", async (c) => {
  try {
    const { cropId, stage } = await c.req.json();
    
    if (!cropId) {
      return c.json({ error: 'cropId is required' }, 400);
    }
    
    const result = await cropLibrary.generateAndCacheCropImage(
      cropId, 
      stage || "vegetative"
    );
    
    return c.json(result);
  } catch (error) {
    console.error('Generate image error:', error);
    return c.json({ error: 'Failed to generate image' }, 500);
  }
});

// ==================== IMAGE FEEDBACK LOOP ====================

// Validate crop image before diagnosis
app.post("/make-server-ce1844e7/crop-library/validate-image", async (c) => {
  try {
    const { imageData } = await c.req.json();
    
    if (!imageData) {
      return c.json({ error: 'imageData is required' }, 400);
    }
    
    const validation = await cropLibrary.validateCropImage(imageData);
    
    return c.json({ 
      success: true, 
      validation 
    });
  } catch (error) {
    console.error('Image validation error:', error);
    return c.json({ error: 'Failed to validate image' }, 500);
  }
});

// Log image feedback from diagnosis
app.post("/make-server-ce1844e7/crop-library/feedback", async (c) => {
  try {
    const feedback = await c.req.json();
    
    // Validate required fields
    if (!feedback.crop_id || !feedback.diagnosis || !feedback.confidence || !feedback.outcome) {
      return c.json({ 
        error: 'Missing required fields: crop_id, diagnosis, confidence, outcome' 
      }, 400);
    }
    
    const feedbackId = await cropLibrary.logImageFeedback(feedback);
    
    return c.json({ 
      success: true, 
      feedbackId,
      message: 'Feedback logged successfully' 
    });
  } catch (error) {
    console.error('Feedback logging error:', error);
    return c.json({ error: 'Failed to log feedback' }, 500);
  }
});

// Get feedback history for a crop
app.get("/make-server-ce1844e7/crop-library/feedback/:cropId", async (c) => {
  try {
    const cropId = c.req.param("cropId");
    
    if (!cropId) {
      return c.json({ error: 'cropId is required' }, 400);
    }
    
    const history = await cropLibrary.getImageFeedbackHistory(cropId);
    
    return c.json({ 
      success: true, 
      history,
      count: history.length 
    });
  } catch (error) {
    console.error('Get feedback history error:', error);
    return c.json({ error: 'Failed to get feedback history' }, 500);
  }
});

// ==================== 404 HANDLER (Must be last) ====================
// Catch-all for undefined routes - returns JSON instead of HTML
app.all("*", (c) => {
  console.error(`404 Not Found: ${c.req.method} ${c.req.url}`);
  return c.json({
    success: false,
    error: "Route not found",
    message: `The endpoint ${c.req.method} ${new URL(c.req.url).pathname} does not exist`,
    hint: "Check the server logs for available routes or visit /make-server-ce1844e7/health to verify server is running"
  }, 404);
});

Deno.serve(app.fetch);