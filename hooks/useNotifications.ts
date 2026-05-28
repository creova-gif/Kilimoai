/**
 * Kilimo AI — Notifications Hook
 *
 * Handles:
 * - Expo push token registration
 * - Foreground notification display via expo-notifications
 * - Auto-routing on notification tap
 * - Wiring to the global notification store
 */

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useKilimoStore } from '../store/useKilimoStore';

// Display notifications in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const router = useRouter();
  const { addNotification, markAllRead, unreadCount } = useKilimoStore();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  async function registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) return null;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('[Notifications] Permission denied');
      return null;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('kilimo-alerts', {
        name: 'Kilimo AI Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1A3B14',
        sound: 'default',
      });
    }

    try {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('[Notifications] Push token:', token);
      
      // [NOTIFICATION ARCHITECTURE]
      // Push token should be saved to the newly created 'user_notification_preferences' table
      /*
      const { data: session } = await supabase.auth.getSession();
      if (session?.session?.user) {
        await supabase
          .from('user_notification_preferences')
          .upsert({ 
            user_id: session.session.user.id, 
            push_token: token 
          }, { onConflict: 'user_id' });
      }
      */
      return token;
    } catch (err) {
      console.warn('[Notifications] Failed to get push token:', err);
      return null;
    }
  }

  useEffect(() => {
    registerForPushNotifications();

    // Handle foreground notifications — add to global store
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { title, body } = notification.request.content;
        if (title && body) {
          addNotification({
            title,
            body,
            type: 'info',
          });
        }
      }
    );

    // Handle tap on notification → route to relevant screen
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as Record<string, string>;
        if (data?.route) {
          router.push(data.route as any);
        }
      }
    );

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  /**
   * Schedule a local notification (e.g., irrigation reminder)
   */
  async function scheduleReminder(
    title: string,
    body: string,
    secondsFromNow: number,
    route?: string
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        data: route ? { route } : {},
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: secondsFromNow,
        repeats: false,
      },
    });
  }

  return {
    unreadCount,
    markAllRead,
    scheduleReminder,
  };
}
