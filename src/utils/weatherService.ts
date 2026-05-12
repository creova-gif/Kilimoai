import { projectId, publicAnonKey } from './supabase/info';

const WEATHER_API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/weather`;

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  rainfall: number;
  rainfallProb: number;
  windSpeed: number;
  lastUpdated: string;
  location: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
  forecast?: Array<{
    date: string;
    temp: number;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainfall: number;
    rainfallProb: number;
    humidity: number;
    windSpeed: number;
  }>;
  cached?: boolean;
  cacheTimestamp?: number;
}

export interface WeatherAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  start?: number;
  end?: number;
  severity?: string;
}

export interface GeoLocation {
  lat: number;
  lon: number;
  accuracy?: number;
}

// Get user's current geolocation
export async function getUserLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        console.log("Geolocation error:", error);
        // Fallback to default Dar es Salaam coordinates
        resolve({
          lat: -6.7924,
          lon: 39.2083,
          accuracy: undefined
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Cache weather data in localStorage
function cacheWeatherData(userId: string, data: WeatherData, location: GeoLocation): void {
  try {
    const cacheData = {
      data,
      location,
      timestamp: Date.now()
    };
    localStorage.setItem(`weather_cache_${userId}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error("Failed to cache weather data:", error);
  }
}

// Get cached weather data
function getCachedWeatherData(userId: string): { data: WeatherData; location: GeoLocation } | null {
  try {
    const cached = localStorage.getItem(`weather_cache_${userId}`);
    if (!cached) return null;

    const parsedCache = JSON.parse(cached);
    const cacheAge = Date.now() - parsedCache.timestamp;
    
    // Cache valid for 30 minutes
    if (cacheAge > 30 * 60 * 1000) {
      localStorage.removeItem(`weather_cache_${userId}`);
      return null;
    }

    return parsedCache;
  } catch (error) {
    console.error("Failed to retrieve cached weather data:", error);
    return null;
  }
}

// Fetch weather data from API
export async function fetchWeatherData(
  userId?: string,
  forceRefresh: boolean = false
): Promise<WeatherData> {
  try {
    // Check cache first if not forcing refresh
    if (!forceRefresh && userId) {
      const cached = getCachedWeatherData(userId);
      if (cached) {
        console.log("Using cached weather data");
        return {
          ...cached.data,
          cached: true,
          cacheTimestamp: Date.now()
        };
      }
    }

    // Get user's location
    const location = await getUserLocation();
    
    // Fetch from API
    const url = `${WEATHER_API_BASE}/current?lat=${location.lat}&lon=${location.lon}${userId ? `&userId=${userId}` : ''}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache the data
    if (userId) {
      cacheWeatherData(userId, data, location);
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    
    // Try to return cached data even if expired
    if (userId) {
      const cached = localStorage.getItem(`weather_cache_${userId}`);
      if (cached) {
        const parsedCache = JSON.parse(cached);
        return {
          ...parsedCache.data,
          cached: true,
          cacheTimestamp: parsedCache.timestamp
        };
      }
    }
    
    throw error;
  }
}

// Fetch weather alerts
export async function fetchWeatherAlerts(userId?: string): Promise<WeatherAlert[]> {
  try {
    const location = await getUserLocation();
    
    const url = `${WEATHER_API_BASE}/alerts?lat=${location.lat}&lon=${location.lon}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("Weather alerts API error");
      return [];
    }

    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    console.error("Failed to fetch weather alerts:", error);
    return [];
  }
}

// Subscribe to weather notifications
export async function subscribeToWeatherNotifications(
  userId: string,
  preferences?: {
    heavyRain?: boolean;
    extremeTemp?: boolean;
    severeWeather?: boolean;
    plantingAlerts?: boolean;
  }
): Promise<boolean> {
  try {
    const location = await getUserLocation();
    
    const url = `${WEATHER_API_BASE}/notifications/subscribe`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        lat: location.lat,
        lon: location.lon,
        preferences: preferences || {
          heavyRain: true,
          extremeTemp: true,
          severeWeather: true,
          plantingAlerts: true
        }
      })
    });

    if (!response.ok) {
      throw new Error("Failed to subscribe to notifications");
    }

    // Store subscription in localStorage
    localStorage.setItem(`weather_notifications_${userId}`, JSON.stringify({
      subscribed: true,
      preferences,
      subscribedAt: Date.now()
    }));

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }

    return true;
  } catch (error) {
    console.error("Failed to subscribe to weather notifications:", error);
    return false;
  }
}

// Get notification preferences
export async function getNotificationPreferences(userId: string): Promise<any> {
  try {
    // Check localStorage first
    const local = localStorage.getItem(`weather_notifications_${userId}`);
    if (local) {
      return JSON.parse(local);
    }

    // Fetch from API
    const url = `${WEATHER_API_BASE}/notifications/preferences?userId=${userId}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      return { subscribed: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get notification preferences:", error);
    return { subscribed: false };
  }
}

// Check if weather conditions require urgent notification
export function checkForUrgentAlerts(weatherData: WeatherData): WeatherAlert[] {
  const urgentAlerts: WeatherAlert[] = [];

  // Heavy rain alert
  if (weatherData.rainfallProb > 80 || weatherData.rainfall > 40) {
    urgentAlerts.push({
      id: 'heavy-rain-urgent',
      type: 'danger',
      title: 'Heavy Rainfall Alert',
      message: `Heavy rainfall expected (${weatherData.rainfall.toFixed(1)}mm, ${weatherData.rainfallProb}% probability). Avoid field activities and ensure proper drainage.`,
      severity: 'high'
    });
  }

  // Extreme temperature
  if (weatherData.temp > 35) {
    urgentAlerts.push({
      id: 'extreme-heat',
      type: 'warning',
      title: 'Extreme Heat Alert',
      message: `Temperature at ${weatherData.temp.toFixed(1)}°C. Increase irrigation and protect young plants from heat stress.`,
      severity: 'medium'
    });
  }

  // High UV index
  if (weatherData.uvIndex >= 8) {
    urgentAlerts.push({
      id: 'high-uv',
      type: 'warning',
      title: 'High UV Index',
      message: `UV Index at ${weatherData.uvIndex} (Very High). Provide shade for young crops and limit outdoor work.`,
      severity: 'medium'
    });
  }

  return urgentAlerts;
}

// Send browser notification
export function sendBrowserNotification(alert: WeatherAlert): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`KILIMO Weather Alert: ${alert.title}`, {
      body: alert.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: alert.id,
      requireInteraction: alert.type === 'danger'
    });
  }
}
