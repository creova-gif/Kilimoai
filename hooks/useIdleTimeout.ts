import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { useKilimoStore } from '../store/useKilimoStore';

/**
 * AUTH-06 — Session inactivity gate.
 * After IDLE_WARNING ms of no interaction we push an in-app warning
 * notification; if the user does not interact again within IDLE_LOGOUT we
 * clear the Agro ID session (forcing biometric re-auth on next launch).
 *
 * Web: listens to document interaction events.
 * Native: relies on AppState transitions; host screens may call
 * `pingActivity()` from touch handlers to extend the session.
 */
const IDLE_WARNING_MS = 14 * 60 * 1000; // 14 min
const IDLE_LOGOUT_MS = 15 * 60 * 1000;  // 15 min

let lastActivity = Date.now();
let warned = false;
/** Reset both the inactivity timer and the once-per-cycle warning flag. */
export function pingActivity() {
  lastActivity = Date.now();
  warned = false;
}

export function useIdleTimeout() {
  const language = useKilimoStore((s) => s.language);
  const isAuthenticated = useKilimoStore((s) => s.isAuthenticated);
  const clearAgroId = useKilimoStore((s) => s.clearAgroId);
  const addNotification = useKilimoStore((s) => s.addNotification);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Reset baseline on (re)authentication — prevents an old `lastActivity`
    // from the pre-auth session immediately triggering a logout.
    pingActivity();

    // Web: any user interaction resets the idle timer + warning flag.
    let removeWebListeners: (() => void) | undefined;
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const events = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;
      events.forEach((e) => document.addEventListener(e, pingActivity, { passive: true }));
      removeWebListeners = () =>
        events.forEach((e) => document.removeEventListener(e, pingActivity));
    }

    // Foregrounding the app counts as activity.
    const appSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') pingActivity();
    });

    const tick = setInterval(() => {
      const idle = Date.now() - lastActivity;

      if (idle >= IDLE_LOGOUT_MS) {
        clearAgroId();
        addNotification({
          type: 'alert',
          title: language === 'sw' ? 'Umetolewa' : 'Signed out',
          body:
            language === 'sw'
              ? 'Kipindi chako kimemalizika kwa sababu ya kutotumika.'
              : 'Your session ended due to inactivity.',
        });
        pingActivity(); // reset for next session
      } else if (idle >= IDLE_WARNING_MS && !warned) {
        warned = true;
        addNotification({
          type: 'warning',
          title: language === 'sw' ? 'Onyo la kipindi' : 'Session warning',
          body:
            language === 'sw'
              ? 'Kipindi kitamalizika dakika 1. Bonyeza popote kuendelea.'
              : 'Session ends in 1 minute. Tap anywhere to stay signed in.',
        });
      }
    }, 30 * 1000); // check every 30s

    return () => {
      clearInterval(tick);
      appSub.remove();
      removeWebListeners?.();
    };
  }, [isAuthenticated, language, clearAgroId, addNotification]);
}
