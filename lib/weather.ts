/**
 * T206 — OpenWeather integration.
 * Free-tier endpoints: current conditions + 5-day / 3-hour forecast aggregated
 * to daily highs/lows + dominant condition. All copy is Swahili-first.
 */

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY ?? '';
const BASE = 'https://api.openweathermap.org/data/2.5';

export type WeatherCondition = 'sun' | 'cloud' | 'rain' | 'storm' | 'snow';

export interface CurrentWeather {
  location: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windKph: number;
  condition: WeatherCondition;
  conditionLabel: string;
  pop: number;
}

export interface ForecastDay {
  day: string; // 'Jumatatu'
  date: string; // '12 Okt'
  high: number;
  low: number;
  condition: WeatherCondition;
  pop: string; // '85%'
  desc: string; // farmer-friendly Swahili tip
}

const SW_DAYS = ['Jumapili', 'Jumatatu', 'Jumanne', 'Jumatano', 'Alhamisi', 'Ijumaa', 'Jumamosi'];
const SW_MONTHS = [
  'Jan',
  'Feb',
  'Mac',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

export function weatherConfigured(): boolean {
  return API_KEY.length > 0;
}

/** Map OpenWeather `main` field → our 5-slot icon vocabulary. */
function mapCondition(main: string): WeatherCondition {
  const m = main.toLowerCase();
  if (m.includes('thunder')) return 'storm';
  if (m.includes('rain') || m.includes('drizzle')) return 'rain';
  if (m.includes('snow')) return 'snow';
  if (m.includes('cloud')) return 'cloud';
  return 'sun';
}

function swTip(c: WeatherCondition, high: number, pop: number): string {
  if (c === 'storm') return 'Tahadhari ya upepo mkali. Funga ghala vizuri.';
  if (c === 'rain' && pop >= 60) return 'Mvua kubwa inatarajiwa. Epuka kuweka mbolea leo.';
  if (c === 'rain') return 'Mvua kidogo inatarajiwa. Hakuna haja ya umwagiliaji.';
  if (c === 'cloud') return 'Hali nzuri kwa kupanda na kupalilia.';
  if (high >= 28) return 'Joto kali — hakikisha mifugo wana maji ya kutosha.';
  return 'Siku nzuri kwa uvunaji na kazi za shambani.';
}

function swDate(d: Date): string {
  return `${d.getUTCDate()} ${SW_MONTHS[d.getUTCMonth()]}`;
}

export class WeatherError extends Error {
  constructor(
    message: string,
    public kind: 'not_configured' | 'unknown_location' | 'network' | 'unknown'
  ) {
    super(message);
  }
}

async function ow<T>(path: string, query: Record<string, string>): Promise<T> {
  if (!API_KEY) throw new WeatherError('OpenWeather API key not configured', 'not_configured');
  const qs = new URLSearchParams({ ...query, appid: API_KEY, units: 'metric', lang: 'sw' });
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}?${qs}`);
  } catch (e: any) {
    throw new WeatherError(e?.message ?? 'network error', 'network');
  }
  if (res.status === 404) throw new WeatherError('Location not recognized', 'unknown_location');
  if (!res.ok) throw new WeatherError(`OpenWeather ${res.status}`, 'unknown');
  return res.json() as Promise<T>;
}

interface OWCurrent {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: { main: string; description: string }[];
  wind: { speed: number };
}

interface OWForecastEntry {
  dt: number;
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { main: string }[];
  pop: number;
}

interface OWForecast {
  list: OWForecastEntry[];
  city: { name: string; timezone: number }; // timezone is shift from UTC in seconds
}

export async function fetchCurrent(location: string): Promise<CurrentWeather> {
  const data = await ow<OWCurrent>('/weather', { q: location });
  return {
    location: data.name,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    windKph: Math.round(data.wind.speed * 3.6),
    condition: mapCondition(data.weather[0]?.main ?? ''),
    conditionLabel: data.weather[0]?.description ?? '',
    pop: 0,
  };
}

export async function fetchForecast(location: string): Promise<ForecastDay[]> {
  const data = await ow<OWForecast>('/forecast', { q: location });
  const tzOffsetSec = data.city.timezone ?? 0;

  // Bucket 3-hour entries by the *location's* local date (UTC date is wrong for
  // TZ+3 — late-night entries would shift into the next day).
  const localDayKey = (utcSec: number): string =>
    new Date((utcSec + tzOffsetSec) * 1000).toISOString().slice(0, 10);

  const buckets = new Map<string, OWForecastEntry[]>();
  for (const entry of data.list) {
    const key = localDayKey(entry.dt);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(entry);
  }

  const today = localDayKey(Math.floor(Date.now() / 1000));
  const days: ForecastDay[] = [];

  for (const [key, entries] of buckets) {
    if (key === today) continue; // skip today (current weather covers it)
    if (days.length >= 7) break;

    const high = Math.round(Math.max(...entries.map((e) => e.main.temp_max)));
    const low = Math.round(Math.min(...entries.map((e) => e.main.temp_min)));
    const maxPop = Math.max(...entries.map((e) => e.pop ?? 0));

    // Dominant condition = most common across the day's 3h slices.
    const counts: Record<string, number> = {};
    for (const e of entries) {
      const c = mapCondition(e.weather[0]?.main ?? '');
      counts[c] = (counts[c] ?? 0) + 1;
    }
    const condition = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      'sun') as WeatherCondition;

    // Reconstruct a noon-local Date for that bucket to pick the right weekday label.
    const noonUtcSec = new Date(key + 'T12:00:00Z').getTime() / 1000 - tzOffsetSec;
    const d = new Date((noonUtcSec + tzOffsetSec) * 1000);
    days.push({
      day: SW_DAYS[d.getUTCDay()],
      date: swDate(new Date(key + 'T12:00:00Z')),
      high,
      low,
      condition,
      pop: `${Math.round(maxPop * 100)}%`,
      desc: swTip(condition, high, maxPop * 100),
    });
  }

  return days;
}
