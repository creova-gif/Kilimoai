import * as kv from "./kv_store.tsx";

/**
 * AI Telemetry Backend
 * 
 * Stores AI usage data for monitoring and analytics
 */

export async function logAIEvent(req: Request) {
  try {
    const data = await req.json();

    const {
      event,
      model,
      promptType,
      userRole,
      userId,
      success,
      latencyMs,
      errorMessage,
      fallbackUsed,
      timestamp,
      metadata
    } = data;

    if (!event || !userId || !promptType) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Store in KV with timestamp-based key for time-series data
    const key = `ai-telemetry:${userId}:${Date.now()}`;
    await kv.set(key, {
      event,
      model,
      promptType,
      userRole,
      userId,
      success,
      latencyMs,
      errorMessage,
      fallbackUsed,
      timestamp,
      metadata
    });

    // Update daily aggregates
    const today = new Date().toISOString().split('T')[0];
    const aggregateKey = `ai-metrics:${userId}:${today}`;
    
    const existingMetrics = await kv.get(aggregateKey) || {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      totalLatency: 0,
      fallbackCount: 0,
      errors: []
    };

    existingMetrics.totalRequests++;
    if (success) {
      existingMetrics.successfulRequests++;
    } else {
      existingMetrics.failedRequests++;
    }
    if (latencyMs) {
      existingMetrics.totalLatency += latencyMs;
    }
    if (fallbackUsed) {
      existingMetrics.fallbackCount++;
    }
    if (errorMessage) {
      existingMetrics.errors.push({
        message: errorMessage,
        timestamp,
        promptType
      });
    }

    await kv.set(aggregateKey, existingMetrics);

    // Check for alerts
    const errorRate = existingMetrics.failedRequests / existingMetrics.totalRequests;
    if (errorRate > 0.05) {
      console.warn(`[AI ALERT] High error rate for user ${userId}: ${(errorRate * 100).toFixed(1)}%`);
    }

    const avgLatency = existingMetrics.totalLatency / existingMetrics.totalRequests;
    if (avgLatency > 5000) {
      console.warn(`[AI ALERT] High latency for user ${userId}: ${avgLatency.toFixed(0)}ms`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI telemetry logging error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getAIMetrics(req: Request, userId: string) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const aggregateKey = `ai-metrics:${userId}:${today}`;
    
    const metrics = await kv.get(aggregateKey);

    if (!metrics) {
      return new Response(
        JSON.stringify({
          totalRequests: 0,
          successRate: 100,
          avgLatency: 0,
          errorRate: 0,
          fallbackRate: 0
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const successRate = (metrics.successfulRequests / metrics.totalRequests) * 100;
    const errorRate = (metrics.failedRequests / metrics.totalRequests) * 100;
    const fallbackRate = (metrics.fallbackCount / metrics.totalRequests) * 100;
    const avgLatency = metrics.totalLatency / metrics.totalRequests;

    return new Response(
      JSON.stringify({
        totalRequests: metrics.totalRequests,
        successRate: successRate.toFixed(1),
        avgLatency: avgLatency.toFixed(0),
        errorRate: errorRate.toFixed(1),
        fallbackRate: fallbackRate.toFixed(1),
        recentErrors: metrics.errors.slice(-5) // Last 5 errors
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI metrics retrieval error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function getAIAnalyticsDashboard(req: Request) {
  try {
    // Get metrics for last 7 days
    const metrics = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // Get all user metrics for this date
      const keys = await kv.getByPrefix(`ai-metrics:`);
      const dayMetrics = keys.filter((k: any) => k.key.includes(dateStr));

      let totalRequests = 0;
      let totalSuccess = 0;
      let totalFailed = 0;
      let totalLatency = 0;

      for (const metric of dayMetrics) {
        totalRequests += metric.value.totalRequests;
        totalSuccess += metric.value.successfulRequests;
        totalFailed += metric.value.failedRequests;
        totalLatency += metric.value.totalLatency;
      }

      metrics.push({
        date: dateStr,
        totalRequests,
        successRate: totalRequests > 0 ? (totalSuccess / totalRequests * 100).toFixed(1) : 100,
        avgLatency: totalRequests > 0 ? (totalLatency / totalRequests).toFixed(0) : 0,
        errorRate: totalRequests > 0 ? (totalFailed / totalRequests * 100).toFixed(1) : 0
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
    console.error("AI analytics dashboard error:", error);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
