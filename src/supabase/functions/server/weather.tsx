import { Hono } from "npm:hono@4";
import * as kv from "./kv_store.tsx";

const weatherRouter = new Hono();

// OpenWeatherMap API integration
const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY") || "";
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherResponse {
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
  forecast: Array<{
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
}

// Get current weather by coordinates
weatherRouter.get("/current", async (c) => {
  try {
    const lat = c.req.query("lat");
    const lon = c.req.query("lon");
    const userId = c.req.query("userId");

    if (!lat || !lon) {
      return c.json({ error: "Latitude and longitude are required" }, 400);
    }

    // Check if API key is configured
    if (!OPENWEATHER_API_KEY) {
      console.log("OpenWeather API key not configured, returning mock data");
      return c.json(getMockWeatherData(lat, lon));
    }

    // Fetch current weather from OpenWeatherMap
    const currentWeatherUrl = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const currentResponse = await fetch(currentWeatherUrl);
    
    if (!currentResponse.ok) {
      throw new Error(`OpenWeather API error: ${currentResponse.statusText}`);
    }

    const currentData = await currentResponse.json();

    // Fetch 5-day forecast
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`OpenWeather Forecast API error: ${forecastResponse.statusText}`);
    }

    const forecastData = await forecastResponse.json();

    // Fetch UV Index (requires One Call API 3.0)
    let uvIndex = 5; // Default value
    try {
      const uvUrl = `${OPENWEATHER_BASE_URL}/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;
      const uvResponse = await fetch(uvUrl);
      if (uvResponse.ok) {
        const uvData = await uvResponse.json();
        uvIndex = Math.round(uvData.value);
      }
    } catch (error) {
      console.log("UV index fetch failed, using default");
    }

    // Process current weather data
    const weatherResponse: WeatherResponse = {
      temp: currentData.main.temp,
      condition: currentData.weather[0].main,
      humidity: currentData.main.humidity,
      rainfall: currentData.rain?.["1h"] || 0,
      rainfallProb: Math.round((currentData.clouds?.all || 0) / 100 * 
        (currentData.weather[0].main === "Rain" ? 80 : 30)),
      windSpeed: currentData.wind.speed * 3.6, // Convert m/s to km/h
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      location: currentData.name || "Unknown Location",
      pressure: currentData.main.pressure,
      visibility: (currentData.visibility || 10000) / 1000, // Convert to km
      uvIndex: uvIndex,
      sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      forecast: processForecastData(forecastData.list)
    };

    // Cache weather data for offline use
    if (userId) {
      await kv.set(`weather_cache_${userId}`, {
        data: weatherResponse,
        timestamp: Date.now(),
        lat,
        lon
      });
    }

    return c.json(weatherResponse);
  } catch (error) {
    console.error("Weather API error:", error);
    
    // Try to return cached data if available
    const userId = c.req.query("userId");
    if (userId) {
      const cached = await kv.get(`weather_cache_${userId}`);
      if (cached) {
        return c.json({
          ...cached.data,
          cached: true,
          cacheTimestamp: cached.timestamp
        });
      }
    }
    
    // Fallback to mock data
    const lat = c.req.query("lat") || "-6.7924";
    const lon = c.req.query("lon") || "39.2083";
    return c.json(getMockWeatherData(lat, lon));
  }
});

// Get weather alerts
weatherRouter.get("/alerts", async (c) => {
  try {
    const lat = c.req.query("lat");
    const lon = c.req.query("lon");

    if (!lat || !lon || !OPENWEATHER_API_KEY) {
      return c.json({ alerts: [] });
    }

    // Fetch weather alerts from OpenWeatherMap One Call API
    const alertsUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(alertsUrl);
    
    if (!response.ok) {
      return c.json({ alerts: [] });
    }

    const data = await response.json();
    const alerts = data.alerts || [];

    // Process and categorize alerts
    const processedAlerts = alerts.map((alert: any) => ({
      id: alert.event,
      type: getSeverityType(alert.severity),
      title: alert.event,
      message: alert.description,
      start: alert.start,
      end: alert.end,
      severity: alert.severity
    }));

    return c.json({ alerts: processedAlerts });
  } catch (error) {
    console.error("Alerts API error:", error);
    return c.json({ alerts: [] });
  }
});

// Store user notification preferences
weatherRouter.post("/notifications/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, lat, lon, preferences } = body;

    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    await kv.set(`weather_notifications_${userId}`, {
      lat,
      lon,
      preferences: preferences || {
        heavyRain: true,
        extremeTemp: true,
        severeWeather: true,
        plantingAlerts: true
      },
      subscribedAt: Date.now()
    });

    return c.json({ success: true, message: "Notification preferences saved" });
  } catch (error) {
    console.error("Notification subscribe error:", error);
    return c.json({ error: "Failed to save preferences" }, 500);
  }
});

// Get user notification preferences
weatherRouter.get("/notifications/preferences", async (c) => {
  try {
    const userId = c.req.query("userId");

    if (!userId) {
      return c.json({ error: "User ID is required" }, 400);
    }

    const preferences = await kv.get(`weather_notifications_${userId}`);
    
    if (!preferences) {
      return c.json({
        preferences: {
          heavyRain: true,
          extremeTemp: true,
          severeWeather: true,
          plantingAlerts: true
        },
        subscribed: false
      });
    }

    return c.json({
      ...preferences,
      subscribed: true
    });
  } catch (error) {
    console.error("Get preferences error:", error);
    return c.json({ error: "Failed to retrieve preferences" }, 500);
  }
});

// Helper function to process forecast data
function processForecastData(forecastList: any[]): WeatherResponse['forecast'] {
  const dailyForecasts = new Map();
  
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    
    if (!dailyForecasts.has(date)) {
      dailyForecasts.set(date, {
        date,
        temps: [],
        conditions: [],
        rainfall: [],
        humidity: [],
        windSpeed: [],
        rainfallProb: []
      });
    }
    
    const dayData = dailyForecasts.get(date);
    dayData.temps.push(item.main.temp);
    dayData.conditions.push(item.weather[0].main);
    dayData.rainfall.push(item.rain?.["3h"] || 0);
    dayData.humidity.push(item.main.humidity);
    dayData.windSpeed.push(item.wind.speed * 3.6);
    dayData.rainfallProb.push(item.pop * 100);
  });

  return Array.from(dailyForecasts.values()).slice(0, 7).map((day) => ({
    date: day.date,
    temp: day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length,
    tempMax: Math.max(...day.temps),
    tempMin: Math.min(...day.temps),
    condition: getMostCommonCondition(day.conditions),
    rainfall: day.rainfall.reduce((a: number, b: number) => a + b, 0),
    rainfallProb: Math.round(
      day.rainfallProb.reduce((a: number, b: number) => a + b, 0) / day.rainfallProb.length
    ),
    humidity: Math.round(
      day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length
    ),
    windSpeed: day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length
  }));
}

// Helper function to get most common condition
function getMostCommonCondition(conditions: string[]): string {
  const counts = conditions.reduce((acc: any, condition) => {
    acc[condition] = (acc[condition] || 0) + 1;
    return acc;
  }, {});
  
  return Object.keys(counts).reduce((a, b) => 
    counts[a] > counts[b] ? a : b
  );
}

// Helper function to get severity type
function getSeverityType(severity: string): string {
  if (severity === "Extreme" || severity === "Severe") return "danger";
  if (severity === "Moderate") return "warning";
  return "info";
}

// Mock weather data fallback
function getMockWeatherData(lat: string, lon: string): WeatherResponse {
  return {
    temp: 25 + Math.random() * 8,
    condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
    humidity: 60 + Math.random() * 30,
    rainfall: Math.random() * 20,
    rainfallProb: Math.floor(Math.random() * 100),
    windSpeed: 10 + Math.random() * 15,
    lastUpdated: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    location: "Dar es Salaam",
    pressure: 1013 + Math.random() * 10 - 5,
    visibility: 8 + Math.random() * 2,
    uvIndex: Math.floor(Math.random() * 11),
    sunrise: "6:12 AM",
    sunset: "6:45 PM",
    forecast: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() + i * 86400000).toLocaleDateString(),
      temp: 25 + Math.random() * 8,
      tempMax: 28 + Math.random() * 5,
      tempMin: 20 + Math.random() * 5,
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Rainy"][Math.floor(Math.random() * 4)],
      rainfall: Math.random() * 15,
      rainfallProb: Math.floor(Math.random() * 100),
      humidity: 60 + Math.random() * 30,
      windSpeed: 10 + Math.random() * 15
    }))
  };
}

export default weatherRouter;
