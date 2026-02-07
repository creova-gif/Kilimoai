/**
 * Session Timeout Hook
 * Auto-logout users after period of inactivity for security
 */

import { useEffect, useRef } from 'react';

interface UseSessionTimeoutOptions {
  /** Timeout in milliseconds (default: 15 minutes) */
  timeout?: number;
  /** Warning before timeout in milliseconds (default: 1 minute) */
  warningTime?: number;
  /** Callback when session times out */
  onTimeout: () => void;
  /** Optional callback for warning */
  onWarning?: () => void;
  /** Whether timeout is enabled */
  enabled?: boolean;
}

export const useSessionTimeout = ({
  timeout = 15 * 60 * 1000, // 15 minutes default
  warningTime = 60 * 1000, // 1 minute warning
  onTimeout,
  onWarning,
  enabled = true
}: UseSessionTimeoutOptions) => {
  const lastActivity = useRef(Date.now());
  const timeoutRef = useRef<number>();
  const warningRef = useRef<number>();
  const hasWarned = useRef(false);

  const resetTimer = () => {
    if (!enabled) return;

    lastActivity.current = Date.now();
    hasWarned.current = false;
    
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }
    
    // Set warning timer
    if (onWarning && warningTime > 0) {
      warningRef.current = window.setTimeout(() => {
        if (!hasWarned.current) {
          hasWarned.current = true;
          onWarning();
        }
      }, timeout - warningTime);
    }
    
    // Set timeout timer
    timeoutRef.current = window.setTimeout(() => {
      onTimeout();
    }, timeout);
  };

  useEffect(() => {
    if (!enabled) return;

    // List of events that count as "activity"
    const events = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'mousemove',
      'keypress',
      'load'
    ];
    
    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Start timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
    };
  }, [enabled, timeout, warningTime]);

  return {
    resetTimer,
    getLastActivity: () => lastActivity.current,
    getRemainingTime: () => {
      const elapsed = Date.now() - lastActivity.current;
      return Math.max(0, timeout - elapsed);
    }
  };
};
