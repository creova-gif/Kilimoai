import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { 
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  DMSans_800ExtraBold,
  DMSans_900Black,
} from '@expo-google-fonts/dm-sans';
import { InstrumentSerif_400Regular } from '@expo-google-fonts/instrument-serif';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme, View } from 'react-native';
import { pingActivity } from '../hooks/useIdleTimeout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useKilimoStore } from '../store/useKilimoStore';
import { ErrorBoundary } from '../components/ErrorBoundary';

// ── Kilimo AI Global Services ─────────────────────────────────────────────
import { useSyncEngine } from '../hooks/useSyncEngine';
import { useNotifications } from '../hooks/useNotifications';
import { useFarmVitals } from '../hooks/useFarmVitals';
import { useIdleTimeout } from '../hooks/useIdleTimeout';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
    },
  },
});

/**
 * AppServices — bootstraps all background hooks inside the providers.
 * Keeps RootLayout clean; all side effects live here.
 */
function AppServices() {
  useSyncEngine();       // 🔄 Offline queue drain
  useNotifications();    // 🔔 Push notification registration
  useFarmVitals();       // 🌱 Sensor telemetry polling
  useIdleTimeout();      // 🔒 AUTH-06 session inactivity gate
  return null;
}

/**
 * OnboardingGate — hydration-aware redirect.
 * Zustand-persist rehydrates asynchronously from AsyncStorage, so the initial
 * route can race the persisted `onboardingComplete` value. We wait for
 * hydration and then replace the route imperatively. This also handles users
 * who reset their onboarding state mid-session.
 */
/** Subscribe to Zustand-persist hydration completion. Returns true once safe. */
function usePersistHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useKilimoStore.persist.hasHydrated());
  useEffect(() => {
    if (hydrated) return;
    const unsub = useKilimoStore.persist.onFinishHydration(() => setHydrated(true));
    if (useKilimoStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, [hydrated]);
  return hydrated;
}

function OnboardingGate({ hydrated }: { hydrated: boolean }) {
  const router = useRouter();
  const segments = useSegments();
  const navState = useRootNavigationState();
  const onboardingComplete = useKilimoStore((s) => s.onboardingComplete);
  const isAuthenticated = useKilimoStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!hydrated || !navState?.key) return; // wait for hydration + nav ready
    const inOnboarding = segments[0] === 'onboarding';
    // Force onboarding when either onboarding incomplete OR session cleared
    // (e.g. AUTH-06 idle timeout calls clearAgroId, which flips isAuthenticated).
    const needsOnboarding = !onboardingComplete || !isAuthenticated;
    if (needsOnboarding && !inOnboarding) {
      router.replace('/onboarding');
    } else if (!needsOnboarding && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [hydrated, onboardingComplete, isAuthenticated, segments, router, navState?.key]);

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const hydrated = usePersistHydrated();

  const [loaded, error] = useFonts({
    Inter_400Regular: DMSans_400Regular,
    Inter_500Medium: DMSans_500Medium,
    Inter_600SemiBold: DMSans_600SemiBold,
    Inter_700Bold: DMSans_700Bold,
    Inter_800ExtraBold: DMSans_800ExtraBold,
    Inter_900Black: DMSans_900Black,
    InstrumentSerif_400Regular,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          {hydrated && <AppServices />}
          <OnboardingGate hydrated={hydrated} />
          <View style={{ flex: 1 }} onTouchStart={pingActivity}>
            <Stack>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="scan" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
              <Stack.Screen name="tasks" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="map" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="agro-id" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="contracts" options={{ headerShown: false }} />
              <Stack.Screen name="livestock" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="inventory" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="insurance" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="input-supply" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="peer-groups" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="consultations" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="edit-profile" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="crop-planning" options={{ headerShown: false, presentation: 'card' }} />
              <Stack.Screen name="farm-twin" options={{ headerShown: false }} />
              <Stack.Screen name="analytics" options={{ headerShown: false }} />
              <Stack.Screen name="wallet-admin" options={{ headerShown: false }} />
              <Stack.Screen name="upgrade" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="otp-auth" options={{ headerShown: false, presentation: 'modal' }} />
              <Stack.Screen name="privacy" options={{ title: 'Privacy Policy', presentation: 'modal' }} />
              <Stack.Screen name="terms" options={{ title: 'Terms of Service', presentation: 'modal' }} />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
