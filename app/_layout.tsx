import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { 
  useFonts, 
  Inter_400Regular, 
  Inter_500Medium,
  Inter_600SemiBold, 
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black 
} from '@expo-google-fonts/inter';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';

// ── Kilimo AI Global Services ─────────────────────────────────────────────
import { useSyncEngine } from '../hooks/useSyncEngine';
import { useNotifications } from '../hooks/useNotifications';
import { useFarmVitals } from '../hooks/useFarmVitals';

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
  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    async function checkFirstLaunch() {
      try {
        const hasLaunched = await SecureStore.getItemAsync('hasLaunched');
        if (hasLaunched === null) {
          await SecureStore.setItemAsync('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (err) {
        setIsFirstLaunch(false);
      }
    }
    checkFirstLaunch();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && isFirstLaunch !== null) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isFirstLaunch]);

  if (!loaded || isFirstLaunch === null) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Bootstrap all background services once providers are mounted */}
        <AppServices />

        <Stack initialRouteName={isFirstLaunch ? 'onboarding' : '(tabs)'}>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="sankofa" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="scan" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
          <Stack.Screen name="market" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="tasks" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="map" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="notifications" options={{ headerShown: false, presentation: 'card' }} />
          {/* Phase 1 — full PRD features */}
          <Stack.Screen name="agro-id" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="contracts" options={{ headerShown: false }} />
          <Stack.Screen name="livestock" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="inventory" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="insurance" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="input-supply" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="peer-groups" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="consultations" options={{ headerShown: false, presentation: 'card' }} />
          <Stack.Screen name="privacy" options={{ title: 'Privacy Policy', presentation: 'modal' }} />
          <Stack.Screen name="terms" options={{ title: 'Terms of Service', presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
