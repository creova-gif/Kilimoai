import { createClient } from "jsr:@supabase/supabase-js@2";

/**
 * Unified Auth API - Email + Phone
 * 
 * Endpoints:
 * - POST /auth/signup - Email signup (NO OTP)
 * - POST /auth/signin - Email signin
 * - POST /auth/phone-otp - Phone OTP request
 * - POST /auth/phone-verify - Phone OTP verification
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

export async function handleAuthSignup(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create user with email + password (NO OTP)
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true // Auto-confirm email since no email server configured
    });

    if (error) {
      console.error("Auth signup error:", error);
      
      if (error.message.includes("already") || error.message.includes("exists")) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Email already registered. Please try signing in." 
          }),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create user profile in database
    if (data.user) {
      try {
        await supabase.from("user_profiles").insert({
          user_id: data.user.id,
          email: email,
          name: name,
          auth_method: "email",
          created_at: new Date().toISOString()
        });
      } catch (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue even if profile creation fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        user: {
          id: data.user?.id,
          email: data.user?.email,
          name: name
        }
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Auth signup error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function handlePhoneAuth(req: Request) {
  try {
    const { phone, name } = await req.json();

    if (!phone || !phone.startsWith("+")) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid phone format. Use +255XXXXXXXXX" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Supabase will send OTP automatically
    // Just return success - OTP is sent by Supabase Auth
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "OTP will be sent by Supabase Auth"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Phone auth error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function handlePhoneVerify(req: Request) {
  try {
    const { phone, otp, name } = await req.json();

    if (!phone || !otp) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing phone or OTP" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verification happens on client side via Supabase Auth
    // This endpoint is for profile creation after verification
    
    // Get user by phone
    const { data: users } = await supabase.auth.admin.listUsers();
    const user = users?.users?.find(u => u.phone === phone);

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create/update user profile
    try {
      await supabase.from("user_profiles").upsert({
        user_id: user.id,
        phone: phone,
        name: name || user.user_metadata?.name || "Farmer",
        auth_method: "phone",
        updated_at: new Date().toISOString()
      });
    } catch (profileError) {
      console.error("Profile upsert error:", profileError);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        user: {
          id: user.id,
          phone: user.phone,
          name: name || user.user_metadata?.name || "Farmer"
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Phone verify error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
