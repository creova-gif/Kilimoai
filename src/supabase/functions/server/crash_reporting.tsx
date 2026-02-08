import * as kv from "./kv_store.tsx";

/**
 * Crash Reporting Backend
 * 
 * Stores crash reports for monitoring and debugging
 */

export async function logCrashReport(req: Request) {
  try {
    const crash = await req.json();

    const {
      errorType,
      message,
      stack,
      componentName,
      userId,
      userAgent,
      url,
      timestamp,
      appVersion,
      metadata
    } = crash;

    if (!errorType || !message) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store crash report
    const key = `crash-report:${Date.now()}`;
    await kv.set(key, crash);

    // Log critical errors immediately
    if (errorType === "js_error" || errorType === "component_error") {
      console.error(`[CRASH] ${errorType}: ${message}`, {
        userId,
        url,
        componentName,
        appVersion
      });
    }

    // Update crash metrics
    const today = new Date().toISOString().split('T')[0];
    const metricsKey = `crash-metrics:${today}`;
    
    const existingMetrics = await kv.get(metricsKey) || {
      totalCrashes: 0,
      jsErrors: 0,
      promiseRejections: 0,
      componentErrors: 0,
      networkErrors: 0,
      affectedUsers: new Set()
    };

    existingMetrics.totalCrashes++;
    existingMetrics[`${errorType}s`]++;
    if (userId) {
      existingMetrics.affectedUsers.add(userId);
    }

    await kv.set(metricsKey, {
      ...existingMetrics,
      affectedUsers: Array.from(existingMetrics.affectedUsers)
    });

    // Check for alerts
    if (existingMetrics.totalCrashes > 100) {
      console.warn(`[ALERT] High crash count today: ${existingMetrics.totalCrashes}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Crash reporting error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getCrashMetrics(req: Request) {
  try {
    const metrics = [];
    const today = new Date();

    // Get last 7 days of crash data
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const metricsKey = `crash-metrics:${dateStr}`;
      
      const dayMetrics = await kv.get(metricsKey) || {
        totalCrashes: 0,
        jsErrors: 0,
        promiseRejections: 0,
        componentErrors: 0,
        networkErrors: 0,
        affectedUsers: []
      };

      metrics.push({
        date: dateStr,
        ...dayMetrics
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        metrics: metrics.reverse() // Oldest to newest
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Crash metrics error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
