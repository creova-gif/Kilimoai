/**
 * AI Telemetry & Observability System
 * 
 * Tracks:
 * - AI request start/end times
 * - Model used (GPT, Claude, etc.)
 * - Prompt type  
 * - User role
 * - Success/failure
 * - Latency
 * - Fallback usage
 * 
 * Storage: Supabase telemetry table + KV for real-time metrics
 */

import { projectId, publicAnonKey } from "./supabase/info";

export type AIEvent =
  | "AI_REQUEST_SENT"
  | "AI_RESPONSE_RECEIVED"
  | "AI_FALLBACK_USED"
  | "AI_ERROR"
  | "AI_TIMEOUT";

export type AIModel = "openrouter" | "gpt-4" | "claude" | "gemini" | "fallback";

export interface AITelemetryData {
  event: AIEvent;
  model: AIModel;
  promptType: string;
  userRole: string;
  userId: string;
  success: boolean;
  latencyMs?: number;
  errorMessage?: string;
  fallbackUsed?: boolean;
  timestamp: string;
  metadata?: Record<string, any>;
}

class AITelemetry {
  private apiBase: string;
  private requests: Map<string, number> = new Map();

  constructor() {
    this.apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`;
  }

  /**
   * Start tracking an AI request
   * Returns request ID to track completion
   */
  startRequest(userId: string, promptType: string, userRole: string, model: AIModel): string {
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.requests.set(requestId, Date.now());

    this.logEvent({
      event: "AI_REQUEST_SENT",
      model,
      promptType,
      userRole,
      userId,
      success: true,
      timestamp: new Date().toISOString(),
      metadata: { requestId }
    });

    return requestId;
  }

  /**
   * Mark request as successful
   */
  successRequest(requestId: string, userId: string, promptType: string, userRole: string, model: AIModel) {
    const startTime = this.requests.get(requestId);
    const latencyMs = startTime ? Date.now() - startTime : undefined;
    this.requests.delete(requestId);

    this.logEvent({
      event: "AI_RESPONSE_RECEIVED",
      model,
      promptType,
      userRole,
      userId,
      success: true,
      latencyMs,
      timestamp: new Date().toISOString(),
      metadata: { requestId }
    });
  }

  /**
   * Mark request as failed
   */
  failRequest(
    requestId: string,
    userId: string,
    promptType: string,
    userRole: string,
    model: AIModel,
    errorMessage: string
  ) {
    const startTime = this.requests.get(requestId);
    const latencyMs = startTime ? Date.now() - startTime : undefined;
    this.requests.delete(requestId);

    this.logEvent({
      event: "AI_ERROR",
      model,
      promptType,
      userRole,
      userId,
      success: false,
      latencyMs,
      errorMessage,
      timestamp: new Date().toISOString(),
      metadata: { requestId }
    });
  }

  /**
   * Mark that fallback data was used
   */
  fallbackUsed(userId: string, promptType: string, userRole: string, originalModel: AIModel) {
    this.logEvent({
      event: "AI_FALLBACK_USED",
      model: "fallback",
      promptType,
      userRole,
      userId,
      success: true,
      fallbackUsed: true,
      timestamp: new Date().toISOString(),
      metadata: { originalModel }
    });
  }

  /**
   * Mark request as timed out
   */
  timeoutRequest(requestId: string, userId: string, promptType: string, userRole: string, model: AIModel) {
    const startTime = this.requests.get(requestId);
    const latencyMs = startTime ? Date.now() - startTime : undefined;
    this.requests.delete(requestId);

    this.logEvent({
      event: "AI_TIMEOUT",
      model,
      promptType,
      userRole,
      userId,
      success: false,
      latencyMs,
      errorMessage: "Request timed out",
      timestamp: new Date().toISOString(),
      metadata: { requestId }
    });
  }

  /**
   * Log event to backend
   */
  private async logEvent(data: AITelemetryData) {
    try {
      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("[AI Telemetry]", data.event, {
          promptType: data.promptType,
          model: data.model,
          success: data.success,
          latencyMs: data.latencyMs,
          fallback: data.fallbackUsed
        });
      }

      // Send to backend (non-blocking)
      fetch(`${this.apiBase}/ai-telemetry/log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(data)
      }).catch(err => {
        console.error("Failed to log AI telemetry:", err);
        // Silently fail - don't block user experience
      });
    } catch (error) {
      console.error("Telemetry logging error:", error);
      // Silently fail
    }
  }

  /**
   * Get real-time metrics (optional)
   */
  async getMetrics(userId: string): Promise<{
    totalRequests: number;
    successRate: number;
    avgLatency: number;
    errorRate: number;
    fallbackRate: number;
  } | null> {
    try {
      const response = await fetch(`${this.apiBase}/ai-telemetry/metrics/${userId}`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      return null;
    }
  }
}

// Singleton instance
export const aiTelemetry = new AITelemetry();

/**
 * React Error Boundary helper for AI components
 */
export function logAIError(error: Error, componentName: string, userId: string) {
  aiTelemetry.logEvent({
    event: "AI_ERROR",
    model: "fallback",
    promptType: componentName,
    userRole: "unknown",
    userId,
    success: false,
    errorMessage: error.message,
    timestamp: new Date().toISOString(),
    metadata: {
      stack: error.stack,
      componentName
    }
  });
}
