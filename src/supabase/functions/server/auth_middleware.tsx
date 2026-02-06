/**
 * Extract user from Authorization header or request body
 * Sets user in context for downstream middleware/handlers
 */
export async function extractUser(c: Context, next: Next) {
  try {
    // Try to get userId from various sources
    let userId: string | null = null;
    
    // 1. From path params (e.g., /profile/:userId)
    userId = c.req.param("userId");
    
    // 2. From query params (e.g., ?userId=123)
    if (!userId) {
      userId = c.req.query("userId") || null;
    }
    
    // Note: We do NOT read the request body here to avoid consuming it
    // Route handlers will read the body themselves and can extract userId if needed
    
    // If we have a userId, fetch user profile
    if (userId) {
      const userProfile = await kv.get(`user:${userId}:profile`);
      
      if (userProfile) {
        // Set user in context
        c.set("user", {
          id: userId,
          ...userProfile,
          role: userProfile.role || "smallholder_farmer",
        });
      } else {
        // User ID provided but not found - try fallback to main user object
        const userData = await kv.get(`user:${userId}`);
        if (userData) {
          c.set("user", {
            id: userId,
            ...userData,
            role: userData.role || "smallholder_farmer",
          });
        } else {
          // User ID provided but not found
          c.set("user", {
            id: userId,
            role: "smallholder_farmer", // Default role
          });
        }
      }
    }
    
    await next();
  } catch (error) {
    console.error("[Auth Middleware] Error extracting user:", error);
    // Continue without user info - return JSON error
    return c.json({
      success: false,
      error: "Middleware error",
      message: error.message || "Failed to process request"
    }, 500);
  }
}

/**
 * Require authenticated user
 * Must be used after extractUser middleware
 */
export async function requireAuth(c: Context, next: Next) {
  const user = c.get("user");
  
  if (!user || !user.id) {
    return c.json({
      success: false,
      error: "Authentication required",
      code: "AUTH_REQUIRED",
      message: "Please login to access this resource"
    }, 401);
  }
  
  await next();
}

export default {
  extractUser,
  requireAuth,
};