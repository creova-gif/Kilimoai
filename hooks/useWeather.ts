import { useQuery } from '@tanstack/react-query';
import { fetchCurrent, fetchForecast, weatherConfigured, WeatherError } from '../lib/weather';
import { useKilimoStore } from '../store/useKilimoStore';

export type WeatherErrorKind = 'not_configured' | 'unknown_location' | 'network' | 'unknown' | null;

function classifyError(err: unknown): WeatherErrorKind {
  if (!err) return null;
  if (err instanceof WeatherError) return err.kind;
  return 'network';
}

/**
 * T206 — Live weather for the Climate tab.
 * Uses the user's farm region from onboarding; falls back to Arusha so the
 * tab is never empty on fresh installs. Cached 30 min, retried twice on failure.
 */
export function useWeather() {
  const farmProfile = useKilimoStore((s) => s.farmProfile);
  const location = farmProfile?.region?.trim() || 'Arusha,TZ';

  const enabled = weatherConfigured();

  const current = useQuery({
    queryKey: ['weather', 'current', location],
    queryFn: () => fetchCurrent(location),
    enabled,
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });

  const forecast = useQuery({
    queryKey: ['weather', 'forecast', location],
    queryFn: () => fetchForecast(location),
    enabled,
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });

  const rawErr = current.error || forecast.error;

  return {
    configured: enabled,
    location,
    current: current.data,
    forecast: forecast.data,
    loading: current.isLoading || forecast.isLoading,
    fetching: current.isFetching || forecast.isFetching,
    error: rawErr,
    errorKind: classifyError(rawErr),
    refetch: async () => {
      await Promise.all([current.refetch(), forecast.refetch()]);
    },
  };
}
