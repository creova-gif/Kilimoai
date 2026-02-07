/**
 * KILIMO Analytics Utility
 * Tracks user behavior, errors, and performance
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

class Analytics {
  private enabled: boolean = true;
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  private initializeTracking() {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.track('page_visibility_change', {
        state: document.visibilityState
      });
    });

    // Track window focus
    window.addEventListener('focus', () => this.track('window_focus'));
    window.addEventListener('blur', () => this.track('window_blur'));

    // Track errors
    window.addEventListener('error', (event) => {
      this.error(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.error(new Error(`Unhandled Promise: ${event.reason}`), {
        type: 'unhandled_promise_rejection'
      });
    });
  }

  /**
   * Identify user
   */
  identify(userId: string, traits?: Record<string, any>) {
    try {
      this.userId = userId;
      
      const userData = {
        userId,
        sessionId: this.sessionId,
        traits,
        timestamp: Date.now()
      };

      this.send('identify', userData);
      console.log('[Analytics] User identified:', userId);
    } catch (error) {
      console.warn('[Analytics] Failed to identify user:', error);
    }
  }

  /**
   * Track event
   */
  track(event: string, properties?: Record<string, any>) {
    if (!this.enabled) return;

    try {
      const eventData: AnalyticsEvent = {
        event,
        properties: {
          ...properties,
          sessionId: this.sessionId,
          url: window.location.href,
          pathname: window.location.pathname,
          referrer: document.referrer,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          language: navigator.language,
          userAgent: navigator.userAgent,
        },
        userId: this.userId || undefined,
        timestamp: Date.now()
      };

      this.send('track', eventData);
      console.log('[Analytics]', event, properties);
    } catch (error) {
      // Silently fail - don't break the app if analytics fails
      console.warn('[Analytics] Failed to track event:', error);
    }
  }

  /**
   * Track page view
   */
  page(pageName: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page: pageName,
      title: document.title,
      ...properties
    });
  }

  /**
   * Track button click
   */
  click(buttonName: string, location: string, properties?: Record<string, any>) {
    this.track('button_click', {
      button: buttonName,
      location,
      ...properties
    });
  }

  /**
   * Track form submission
   */
  formSubmit(formName: string, success: boolean, properties?: Record<string, any>) {
    this.track('form_submit', {
      form: formName,
      success,
      ...properties
    });
  }

  /**
   * Track feature usage
   */
  featureUsed(featureName: string, properties?: Record<string, any>) {
    this.track('feature_used', {
      feature: featureName,
      ...properties
    });
  }

  /**
   * Track error
   */
  error(error: Error, context?: Record<string, any>) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      userId: this.userId,
      sessionId: this.sessionId,
      url: window.location.href,
      timestamp: Date.now()
    };

    this.send('error', errorData);
    console.error('[Analytics] Error:', error, context);
  }

  /**
   * Track performance metric
   */
  performance(metricName: string, value: number, properties?: Record<string, any>) {
    this.track('performance', {
      metric: metricName,
      value,
      ...properties
    });
  }

  /**
   * Track user timing (custom metric)
   */
  timing(category: string, variable: string, time: number, label?: string) {
    this.track('timing', {
      category,
      variable,
      time,
      label
    });
  }

  /**
   * Track conversion
   */
  conversion(conversionName: string, value?: number, properties?: Record<string, any>) {
    this.track('conversion', {
      conversion: conversionName,
      value,
      ...properties
    });
  }

  /**
   * Track funnel step
   */
  funnelStep(funnelName: string, step: number, stepName: string, properties?: Record<string, any>) {
    this.track('funnel_step', {
      funnel: funnelName,
      step,
      stepName,
      ...properties
    });
  }

  /**
   * Send data to analytics endpoint
   */
  private async send(type: string, data: any) {
    if (!this.enabled) return;

    try {
      // Store locally first (for offline support)
      const queue = this.getQueue();
      queue.push({ type, data, timestamp: Date.now() });
      localStorage.setItem('analyticsQueue', JSON.stringify(queue));

      // Try to send if online
      if (navigator.onLine) {
        await this.flush();
      }
    } catch (error) {
      console.error('[Analytics] Failed to queue event:', error);
    }
  }

  /**
   * Flush queued events to server
   */
  private async flush() {
    const queue = this.getQueue();
    if (queue.length === 0) return;

    try {
      // In a real implementation, send to your analytics backend
      // For now, we'll just log and clear
      
      // Example: Send to your backend
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(queue)
      // });

      // Clear queue after successful send
      localStorage.removeItem('analyticsQueue');
      console.log(`[Analytics] Flushed ${queue.length} events`);
    } catch (error) {
      console.error('[Analytics] Failed to flush events:', error);
    }
  }

  /**
   * Get queued events
   */
  private getQueue(): any[] {
    try {
      const queue = localStorage.getItem('analyticsQueue');
      return queue ? JSON.parse(queue) : [];
    } catch {
      return [];
    }
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    console.log(`[Analytics] Tracking ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Clear all stored analytics data
   */
  clear() {
    localStorage.removeItem('analyticsQueue');
    this.userId = null;
    console.log('[Analytics] Cleared all data');
  }
}

// Export singleton instance
export const analytics = new Analytics();

// Auto-flush on page unload
window.addEventListener('beforeunload', () => {
  analytics.track('page_unload');
});

// Track initial page load
analytics.track('app_loaded', {
  loadTime: performance.now(),
  entryType: (performance.getEntriesByType('navigation')[0] as any)?.type
});