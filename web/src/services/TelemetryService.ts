/**
 * KILIMO AI - Telemetry & Monitoring
 * 
 * Provides scaffolding for Sentry (Crash Reporting) and Mixpanel (Product Analytics).
 * Essential for post-launch visibility into farmer journeys and system stability.
 */

interface FarmerEvent {
  event_name: string;
  properties: Record<string, any>;
  userId?: string;
  region?: string;
}

class TelemetryService {
  private isInitialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    console.log("[Telemetry] Initializing Sentry & Mixpanel...");
    // In production, we would call Sentry.init() and mixpanel.init()
    this.isInitialized = true;
  }

  /**
   * Track Farmer Journey Events
   */
  public track(event: FarmerEvent) {
    if (!this.isInitialized) return;

    const timestamp = new Date().toISOString();
    console.log(`[Mixpanel] ${timestamp} - Event: ${event.event_name}`, {
      ...event.properties,
      userId: event.userId,
      region: event.region,
      platform: 'web-pwa'
    });

    // Implementation would be: mixpanel.track(event.event_name, event.properties)
  }

  /**
   * Capture Exceptions/Crashes
   */
  public captureError(error: Error, context?: Record<string, any>) {
    if (!this.isInitialized) return;

    console.error(`[Sentry] Captured Exception: ${error.message}`, context);
    // Implementation would be: Sentry.captureException(error, { extra: context })
  }

  /**
   * Specific Farmer Journey Funnels
   */
  public trackOnboardingStep(step: number, role: string) {
    this.track({
      event_name: 'onboarding_step_completed',
      properties: { step, role }
    });
  }

  public trackAIDiagnosis(disease: string, confidence: number, isOffline: boolean) {
    this.track({
      event_name: 'ai_diagnosis_performed',
      properties: { disease, confidence, is_offline: isOffline }
    });
  }

  public trackMarketTransaction(amount: number, crop: string) {
    this.track({
      event_name: 'market_sale_completed',
      properties: { amount, crop }
    });
  }
}

export const telemetry = new TelemetryService();
