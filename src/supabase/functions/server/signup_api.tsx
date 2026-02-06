/**
 * Role-Based Adaptive Signup API for KILIMO
 * Implements comprehensive signup flow with role-specific validation and AI assistance
 */

import { Hono } from "npm:hono";
import type { Context } from "npm:hono";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";
import { sendOTP } from "./sms.tsx";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

/**
 * Register all signup-related endpoints
 */
export function registerSignupEndpoints(app: Hono) {
  
  // 1️⃣ Role-Based Signup with Progressive Saving
  app.post("/make-server-ce1844e7/signup", async (c: Context) => {
    try {
      const body = await c.req.json();
      const {
        role,
        email,
        phone_number,
        language,
        location,
        progressive_data,
        role_specific_fields,
        password,
        name
      } = body;

      // Validate required fields
      const missingFields: string[] = [];
      const aiSuggestions: Record<string, string> = {};

      if (!role) {
        missingFields.push("role");
        aiSuggestions.role = language === "sw" 
          ? "Chagua aina ya mtumiaji kulingana na shughuli zako za kilimo"
          : "Select a user type based on your farming operations";
      }

      if (!phone_number) {
        missingFields.push("phone_number");
        aiSuggestions.phone_number = language === "sw"
          ? "Toa namba ya simu sahihi na msimbo wa nchi (+255 kwa Tanzania)"
          : "Provide a valid mobile number with country code (+255 for Tanzania)";
      }

      if (!name) {
        missingFields.push("name");
        aiSuggestions.name = language === "sw"
          ? "Jina kamili linahitajika"
          : "Full name is required";
      }

      // Validate phone number format (Tanzanian)
      if (phone_number && !phone_number.match(/^\+255[67]\d{8}$/)) {
        missingFields.push("phone_number");
        aiSuggestions.phone_number = language === "sw"
          ? "Namba ya simu lazima iwe na muundo wa +255 XXX XXX XXX"
          : "Phone number must be in format +255 XXX XXX XXX";
      }

      // Role-specific validation
      const roleValidation = validateRoleSpecificFields(role, role_specific_fields, language);
      if (roleValidation.missing.length > 0) {
        missingFields.push(...roleValidation.missing);
        Object.assign(aiSuggestions, roleValidation.suggestions);
      }

      // If validation fails, return errors
      if (missingFields.length > 0) {
        return c.json({
          status: "error",
          missing_fields: missingFields,
          ai_suggestions: aiSuggestions
        }, 400);
      }

      // Check if user already exists
      if (phone_number) {
        const existingPhone = await kv.get(`phone:${phone_number}`);
        if (existingPhone) {
          return c.json({
            status: "error",
            message: language === "sw" 
              ? "Namba hii ya simu tayari imesajiliwa. Tafadhali ingia badala yake."
              : "This phone number is already registered. Please login instead."
          }, 409);
        }
      }

      if (email) {
        const existingEmail = await kv.get(`email:${email}`);
        if (existingEmail) {
          return c.json({
            status: "error",
            message: language === "sw"
              ? "Barua pepe hii tayari imesajiliwa. Tafadhali ingia badala yake."
              : "This email is already registered. Please login instead."
          }, 409);
        }
      }

      // Create user in Supabase Auth - WITHOUT AUTO-CONFIRM
      const authPayload: any = {
        phone: phone_number,
        password: password || crypto.randomUUID().substring(0, 8),
        user_metadata: {
          name,
          role,
          language: language || "en",
          region: location?.region,
          district: location?.district,
        }
        // ⚠️ NO email_confirm or phone_confirm flags - require proper OTP verification
      };

      if (email) {
        authPayload.email = email;
      }

      const { data: authData, error: authError } = await supabase.auth.admin.createUser(authPayload);

      if (authError) {
        console.error("Supabase auth error:", authError);
        
        // If phone already registered in Supabase Auth, check if it's in KV
        if (authError.code === 'phone_exists') {
          // Try to find existing user by phone
          const existingUserId = await kv.get(`phone:${phone_number}`);
          if (existingUserId) {
            return c.json({
              status: "error",
              message: language === "sw" 
                ? "Namba hii ya simu tayari imesajiliwa. Tafadhali ingia badala yake."
                : "This phone number is already registered. Please login instead.",
              existing_user: true
            }, 409);
          }
          
          // Phone exists in Supabase but not in KV - this is a data inconsistency
          // We should not create duplicate - return error
          return c.json({
            status: "error",
            message: language === "sw" 
              ? "Namba hii ya simu tayari imesajiliwa. Tafadhali ingia badala yake."
              : "This phone number is already registered. Please login instead.",
            existing_user: true
          }, 409);
        }
        
        return c.json({
          status: "error",
          message: language === "sw" 
            ? "Imeshindwa kuunda akaunti. Jaribu tena."
            : "Failed to create account. Please try again."
        }, 500);
      }

      const userId = authData.user.id;

      // Store user data in KV
      const userData = {
        id: userId,
        name,
        phone: phone_number,
        email: email || null,
        role,
        language: language || "en",
        location,
        role_specific_fields: role_specific_fields || {},
        onboarding_complete: false,
        current_step: 1,
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString()
      };

      await kv.set(`user:${userId}`, userData);
      await kv.set(`phone:${phone_number}`, userId);
      if (email) {
        await kv.set(`email:${email}`, userId);
      }

      // Store progressive data if provided
      if (progressive_data) {
        await kv.set(`onboarding:${userId}`, {
          user_id: userId,
          step: progressive_data.step || 1,
          data: progressive_data.data || {},
          last_updated: new Date().toISOString()
        });
      }

      // Generate OTP for phone verification
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await kv.set(`otp:${userId}`, {
        code: otp,
        method: "phone",
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes
      });

      // Send OTP via SMS (with graceful fallback)
      try {
        await sendOTP(phone_number, otp);
        console.log(`✓ OTP sent successfully to ${phone_number}`);
      } catch (smsError) {
        console.error(`⚠️ SMS send failed for ${phone_number}:`, smsError);
        console.log(`\n📱 ============================================`);
        console.log(`📱 OTP CODE FOR TESTING: ${otp}`);
        console.log(`📱 User ID: ${userId}`);
        console.log(`📱 Phone: ${phone_number}`);
        console.log(`📱 Expires in: 10 minutes`);
        console.log(`📱 ============================================\n`);
        console.log(`💡 To fix SMS sending, set valid Africa's Talking credentials in Supabase Dashboard`);
        // Don't fail the whole signup - user can still get OTP from logs or retry
      }

      // Get AI tooltips for next step
      const aiTooltips = getAITooltips(role, 1, language, role_specific_fields);

      return c.json({
        status: "success",
        user_id: userId,
        next_step: 1,
        ai_tooltips: aiTooltips,
        message: language === "sw"
          ? "Akaunti imeundwa. Tafadhali thibitisha namba yako ya simu."
          : "Account created. Please verify your phone number."
      });

    } catch (error) {
      console.error("Signup error:", error);
      return c.json({
        status: "error",
        message: "Internal server error"
      }, 500);
    }
  });

  // 2️⃣ Verify Phone/Email via OTP
  app.post("/make-server-ce1844e7/verify", async (c: Context) => {
    try {
      const { user_id, otp_code, method } = await c.req.json();

      if (!user_id || !otp_code) {
        return c.json({
          status: "error",
          message: "User ID and OTP code are required"
        }, 400);
      }

      // Get stored OTP
      const storedOTP = await kv.get(`otp:${user_id}`);
      
      if (!storedOTP) {
        return c.json({
          status: "error",
          message: "OTP not found or expired"
        }, 401);
      }

      // Check if OTP matches
      if (storedOTP.code !== otp_code) {
        return c.json({
          status: "error",
          message: "Invalid OTP"
        }, 401);
      }

      // Check if OTP is expired
      if (new Date() > new Date(storedOTP.expires_at)) {
        await kv.del(`otp:${user_id}`);
        return c.json({
          status: "error",
          message: "OTP has expired"
        }, 401);
      }

      // Mark user as verified in KV store
      const userData = await kv.get(`user:${user_id}`);
      if (userData) {
        userData.phone_verified = method === "phone";
        userData.email_verified = method === "email";
        userData.verified_at = new Date().toISOString();
        await kv.set(`user:${user_id}`, userData);
      }

      // ✅ CRITICAL: Update Supabase Auth to mark phone as confirmed
      if (method === "phone") {
        await supabase.auth.admin.updateUserById(user_id, {
          phone_confirm: true
        });
        console.log(`✅ Phone confirmed for user ${user_id} in Supabase Auth`);
        
        // 🔐 AUTO-CREATE WALLET after phone verification
        // Check if wallet already exists
        const existingWallet = await kv.get(`wallet:${user_id}`);
        if (!existingWallet) {
          const walletId = crypto.randomUUID();
          const walletData = {
            id: walletId,
            user_id: user_id,
            balance: 0,
            currency: "TZS",
            status: "active",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          await kv.set(`wallet:${user_id}`, walletData);
          await kv.set(`wallet:id:${walletId}`, walletData);
          
          console.log(`✅ Wallet created for verified user ${user_id}`);
        }
      }

      // Delete OTP
      await kv.del(`otp:${user_id}`);

      return c.json({
        status: "success",
        message: "Verification complete",
        next_step: 2
      });

    } catch (error) {
      console.error("Verification error:", error);
      return c.json({
        status: "error",
        message: "Verification failed"
      }, 500);
    }
  });

  // 3️⃣ Save Onboarding Step
  app.post("/make-server-ce1844e7/onboarding/step", async (c: Context) => {
    try {
      const { user_id, step, role, fields } = await c.req.json();

      if (!user_id || !step) {
        return c.json({
          status: "error",
          message: "User ID and step are required"
        }, 400);
      }

      // Get user data
      const userData = await kv.get(`user:${user_id}`);
      if (!userData) {
        return c.json({
          status: "error",
          message: "User not found"
        }, 404);
      }

      // Get existing onboarding data
      const onboardingData = await kv.get(`onboarding:${user_id}`) || {
        user_id,
        steps: {},
        completed_steps: [],
        current_step: 1
      };

      // Save step data
      onboardingData.steps[step] = {
        ...fields,
        completed_at: new Date().toISOString()
      };

      // Mark step as completed
      if (!onboardingData.completed_steps.includes(step)) {
        onboardingData.completed_steps.push(step);
      }

      // Update current step
      onboardingData.current_step = step + 1;
      onboardingData.last_updated = new Date().toISOString();

      // Save to KV
      await kv.set(`onboarding:${user_id}`, onboardingData);

      // Update user data with fields
      if (fields) {
        Object.assign(userData.role_specific_fields || {}, fields);
        userData.last_updated = new Date().toISOString();
        await kv.set(`user:${user_id}`, userData);
      }

      // Get AI tooltips for next step
      const language = userData.language || "en";
      const aiTooltips = getAITooltips(role || userData.role, step + 1, language, fields);

      return c.json({
        status: "success",
        next_step: step + 1,
        ai_tooltips: aiTooltips
      });

    } catch (error) {
      console.error("Onboarding step error:", error);
      return c.json({
        status: "error",
        message: "Failed to save onboarding step"
      }, 500);
    }
  });

  // 4️⃣ Get AI Tooltips
  app.get("/make-server-ce1844e7/ai/tooltips", async (c: Context) => {
    try {
      const user_id = c.req.query("user_id");
      const step = parseInt(c.req.query("step") || "1");

      if (!user_id) {
        return c.json({
          status: "error",
          message: "User ID is required"
        }, 400);
      }

      // Get user data
      const userData = await kv.get(`user:${user_id}`);
      if (!userData) {
        return c.json({
          status: "error",
          message: "User not found"
        }, 404);
      }

      const language = userData.language || "en";
      const role = userData.role;
      const tooltips = getAITooltips(role, step, language, userData.role_specific_fields);

      return c.json({
        tooltips
      });

    } catch (error) {
      console.error("AI tooltips error:", error);
      return c.json({
        status: "error",
        message: "Failed to fetch AI tooltips"
      }, 500);
    }
  });

  // 5️⃣ Get Onboarding Progress
  app.get("/make-server-ce1844e7/onboarding/progress", async (c: Context) => {
    try {
      const user_id = c.req.query("user_id");

      if (!user_id) {
        return c.json({
          status: "error",
          message: "User ID is required"
        }, 400);
      }

      // Get onboarding data
      const onboardingData = await kv.get(`onboarding:${user_id}`);
      
      if (!onboardingData) {
        return c.json({
          user_id,
          current_step: 1,
          completed_steps: [],
          incomplete_steps: [1, 2, 3, 4, 5]
        });
      }

      // Calculate incomplete steps (assume 5 total steps)
      const totalSteps = 5;
      const completedSteps = onboardingData.completed_steps || [];
      const incompleteSteps = [];
      
      for (let i = 1; i <= totalSteps; i++) {
        if (!completedSteps.includes(i)) {
          incompleteSteps.push(i);
        }
      }

      return c.json({
        user_id,
        current_step: onboardingData.current_step || 1,
        completed_steps: completedSteps,
        incomplete_steps: incompleteSteps
      });

    } catch (error) {
      console.error("Onboarding progress error:", error);
      return c.json({
        status: "error",
        message: "Failed to fetch onboarding progress"
      }, 500);
    }
  });

  // 6️⃣ Resend OTP
  app.post("/make-server-ce1844e7/resend-otp", async (c: Context) => {
    try {
      const { user_id, method } = await c.req.json();

      if (!user_id) {
        return c.json({
          status: "error",
          message: "User ID is required"
        }, 400);
      }

      // Get user data
      const userData = await kv.get(`user:${user_id}`);
      if (!userData) {
        return c.json({
          status: "error",
          message: "User not found"
        }, 404);
      }

      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      await kv.set(`otp:${user_id}`, {
        code: otp,
        method: method || "phone",
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      });

      // Send OTP via SMS/Email
      if (method === "phone") {
        await sendOTP(userData.phone, otp);
      }

      return c.json({
        status: "success",
        message: "OTP sent successfully"
      });

    } catch (error) {
      console.error("Resend OTP error:", error);
      return c.json({
        status: "error",
        message: "Failed to resend OTP"
      }, 500);
    }
  });

  // 7️⃣ Save Registration Draft (Progressive Save)
  app.post("/make-server-ce1844e7/registration-progress", async (c: Context) => {
    try {
      const { phone, step, data } = await c.req.json();

      if (!phone) {
        return c.json({
          status: "error",
          message: "Phone number is required"
        }, 400);
      }

      // Save draft
      await kv.set(`registration-draft:${phone}`, {
        phone,
        step,
        data,
        last_updated: new Date().toISOString()
      });

      return c.json({
        status: "success",
        message: "Progress saved"
      });

    } catch (error) {
      console.error("Save progress error:", error);
      return c.json({
        status: "error",
        message: "Failed to save progress"
      }, 500);
    }
  });

  // 8️⃣ Get Registration Draft
  app.get("/make-server-ce1844e7/registration-progress/:phone", async (c: Context) => {
    try {
      const phone = c.req.param("phone");

      const draft = await kv.get(`registration-draft:${phone}`);
      
      if (!draft) {
        return c.json({
          status: "not_found",
          message: "No saved progress found"
        }, 404);
      }

      return c.json({
        status: "success",
        draft
      });

    } catch (error) {
      console.error("Get progress error:", error);
      return c.json({
        status: "error",
        message: "Failed to fetch progress"
      }, 500);
    }
  });
}

// Helper function: Validate role-specific fields
function validateRoleSpecificFields(role: string, fields: any, language: string): { missing: string[], suggestions: Record<string, string> } {
  const missing: string[] = [];
  const suggestions: Record<string, string> = {};

  if (!fields) {
    return { missing: ["role_specific_fields"], suggestions: {} };
  }

  switch (role) {
    case "smallholder_farmer":
      if (!fields.farm_size) {
        missing.push("farm_size");
        suggestions.farm_size = language === "sw"
          ? "💡 Weka ukubwa wa shamba. AI itapendekeza kifurushi cha ushauri kulingana na ukubwa."
          : "💡 Enter farm size. AI suggests advisory package based on size.";
      }
      if (!fields.main_crop && (!fields.crops || fields.crops.length === 0)) {
        missing.push("crops");
        suggestions.crops = language === "sw"
          ? "💡 Chagua mazao yako. AI inatabiri hatari za kawaida kulingana na zao."
          : "💡 Select your crops. AI predicts common risks based on crop.";
      }
      break;

    case "farmer":
      if (!fields.farm_size) missing.push("farm_size");
      if (!fields.crops || fields.crops.length === 0) missing.push("crops");
      break;

    case "farm_manager":
      if (!fields.farm_name) {
        missing.push("farm_name");
        suggestions.farm_name = language === "sw"
          ? "Jina la shamba linahitajika"
          : "Farm name is required";
      }
      if (!fields.team_size) {
        missing.push("team_size");
        suggestions.team_size = language === "sw"
          ? "💡 Ukubwa wa timu unasaidia kupanga moduli za usimamizi wa wafanyakazi"
          : "💡 Team size helps recommend workforce management modules";
      }
      break;

    case "commercial_farm_admin":
      if (!fields.commercial_farm_name) missing.push("commercial_farm_name");
      if (!fields.registration_license) missing.push("registration_license");
      break;

    case "agribusiness_ops":
      if (!fields.business_name) missing.push("business_name");
      if (!fields.business_category) {
        missing.push("business_category");
        suggestions.business_category = language === "sw"
          ? "Chagua aina ya biashara: Mnunuzi, Msambazaji, au Wote wawili"
          : "Select business category: Buyer, Supplier, or Both";
      }
      break;

    case "extension_officer":
      if (!fields.org_name) missing.push("org_name");
      if (!fields.farmers_supported) {
        missing.push("farmers_supported");
        suggestions.farmers_supported = language === "sw"
          ? "💡 Kwa wakulima zaidi ya 50, tunashauri zana za uchunguzi nje ya mtandao"
          : "💡 For 50+ farmers, we recommend offline survey tools";
      }
      break;

    case "cooperative_leader":
      if (!fields.coop_name) missing.push("coop_name");
      if (!fields.member_count) {
        missing.push("member_count");
        suggestions.member_count = language === "sw"
          ? "💡 Idadi ya wanachama inasaidia kuunda mtiririko wa kazi: Usajili → Ukusanyaji → Mauzo"
          : "💡 Member count helps setup workflow: Registration → Aggregation → Sales";
      }
      break;
  }

  return { missing, suggestions };
}

// Helper function: Get AI tooltips based on role and step
function getAITooltips(role: string, step: number, language: string, fields: any): Record<string, string> {
  const tooltips: Record<string, string> = {};

  if (step === 1) {
    // Basic account setup tooltips
    tooltips.phone_number = language === "sw"
      ? "Namba yako ya simu itatumika kwa uthibitishaji na mawasiliano ya SMS"
      : "Your phone number will be used for verification and SMS notifications";
    
    tooltips.language = language === "sw"
      ? "Chagua lugha unayopendelea. Unaweza kubadilisha baadaye"
      : "Select your preferred language. You can change this later";
  }

  if (step === 2 && fields) {
    // Role-specific tooltips based on entered data
    if (fields.farm_size) {
      const size = parseFloat(fields.farm_size);
      if (size <= 2) {
        tooltips.farm_size = language === "sw"
          ? "💡 Kwa mashamba chini ya ekari 2, tunashauri Kifurushi cha Ushauri wa Msingi na arifa za hali ya hewa"
          : "💡 For farms under 2 acres, we recommend Basic Advisory Package with weather alerts";
      } else if (size <= 5) {
        tooltips.farm_size = language === "sw"
          ? "💡 Mashamba ya ekari 2-5 yanafaidika na huduma za Upangaji wa Mazao na Bei za Soko"
          : "💡 Farms 2-5 acres benefit from Crop Planning and Market Price features";
      }
    }

    if (fields.crops && fields.crops.length > 0) {
      if (fields.crops.includes("Maize") || fields.crops.includes("maize")) {
        tooltips.crops = language === "sw"
          ? "🌾 Mahindi yana hatari ya juu ya wadudu wa Fall Armyworm. Tutakutumia vidokezo vya ufuatiliaji kila wiki"
          : "🌾 Maize has high Fall Armyworm risk. We'll send weekly monitoring tips";
      }
      if (fields.crops.length >= 3) {
        tooltips.crops = language === "sw"
          ? "✅ Kilimo cha mazao mengi kimegunduliwa! Tutakupa ushauri wa mzunguko wa mazao"
          : "✅ Multi-crop farming detected! We'll provide crop rotation advice";
      }
    }

    if (fields.irrigation_method === "Rain-fed") {
      tooltips.irrigation_method = language === "sw"
        ? "🌧️ Kilimo cha mvua? Tutakutumia utabiri wa mvua na tahadhari za ukame"
        : "🌧️ Rain-fed farming? We'll send rainfall predictions and drought alerts";
    } else if (fields.irrigation_method === "Drip Irrigation") {
      tooltips.irrigation_method = language === "sw"
        ? "💧 Chaguo bora! Umwagiliaji wa tone unaweza kupunguza matumizi ya maji kwa 40-60%"
        : "💧 Excellent choice! Drip irrigation can reduce water usage by 40-60%";
    }

    if (fields.team_size && parseInt(fields.team_size) > 5) {
      tooltips.team_size = language === "sw"
        ? "👥 Kwa timu yako, tunashauri kuwezesha moduli za Usimamizi wa Kazi na Uchambuzi wa Wafanyakazi"
        : "👥 With your team size, we recommend enabling Task Management and Workforce Analytics modules";
    }

    if (fields.annual_volume && parseFloat(fields.annual_volume) > 0) {
      tooltips.annual_volume = language === "sw"
        ? "📈 Tutakupa mwenendo wa bei za soko na vidokezo vya ukusanyaji kulingana na kiasi chako"
        : "📈 We'll provide market price trends and aggregation tips based on your volume";
    }

    if (fields.farmers_supported && parseInt(fields.farmers_supported) > 50) {
      tooltips.farmers_supported = language === "sw"
        ? "🎯 Kwa mitandao mikubwa ya wakulima, tunashauri zana za uchunguzi nje ya mtandao na ugawanyaji wa vikundi"
        : "🎯 For large farmer networks, we recommend offline survey tools and cohort grouping features";
    }

    if (fields.member_count && parseInt(fields.member_count) > 0) {
      tooltips.member_count = language === "sw"
        ? `✅ Mtiririko unatarajiwa: Usajili wa wanachama → Ukusanyaji wa mavuno → Mauzo ya kikundi kwa wanachama ${fields.member_count}`
        : `✅ Expected workflow: Member registration → Harvest aggregation → Group sales for ${fields.member_count} members`;
    }
  }

  return tooltips;
}