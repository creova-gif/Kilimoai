/**
 * KILIMO Mock Data Generator
 * Generates realistic Tanzania farm data for Demo Mode
 * 
 * Features:
 * - Location-aware (East African regions)
 * - Climate-aware (rainfall, seasons)
 * - Crop-specific (Tanzania varieties)
 * - Non-identifiable (synthetic data)
 * - Resettable
 */

// Tanzanian regions and their characteristics
const TANZANIA_REGIONS = [
  { name: "Arusha", zone: "Northern Highlands", climate: "Temperate", rainfall: "High" },
  { name: "Mwanza", zone: "Lake Zone", climate: "Tropical", rainfall: "Moderate" },
  { name: "Dar es Salaam", zone: "Coastal", climate: "Humid Tropical", rainfall: "High" },
  { name: "Dodoma", zone: "Central", climate: "Semi-Arid", rainfall: "Low" },
  { name: "Mbeya", zone: "Southern Highlands", climate: "Temperate", rainfall: "High" },
  { name: "Morogoro", zone: "Eastern", climate: "Tropical", rainfall: "Moderate" },
  { name: "Kilimanjaro", zone: "Northern", climate: "Highland", rainfall: "High" },
  { name: "Tanga", zone: "Coastal", climate: "Humid Tropical", rainfall: "High" },
  { name: "Iringa", zone: "Southern Highlands", climate: "Temperate", rainfall: "Moderate" },
  { name: "Mara", zone: "Lake Zone", climate: "Tropical", rainfall: "Moderate" },
];

// Common Tanzanian crops by region
const TANZANIA_CROPS = {
  "Northern Highlands": ["Coffee", "Maize", "Beans", "Wheat", "Bananas", "Irish Potatoes"],
  "Lake Zone": ["Cotton", "Cassava", "Maize", "Sorghum", "Rice", "Sweet Potatoes"],
  "Coastal": ["Coconut", "Cashew", "Rice", "Cassava", "Maize", "Seaweed"],
  "Central": ["Sorghum", "Millet", "Sunflower", "Groundnuts", "Maize"],
  "Southern Highlands": ["Tea", "Coffee", "Maize", "Wheat", "Irish Potatoes", "Pyrethrum"],
  "Eastern": ["Sugarcane", "Maize", "Rice", "Vegetables", "Fruits"],
};

// Tanzanian names (first + last)
const FIRST_NAMES = [
  "Juma", "Fatuma", "Hassan", "Amina", "John", "Grace", "Peter", "Mary",
  "Mohamed", "Zainab", "Joseph", "Anna", "Daniel", "Elizabeth", "David", "Sarah",
  "Michael", "Ruth", "William", "Agnes", "Charles", "Martha", "Richard", "Lucy",
  "Ally", "Neema", "Rajabu", "Hawa", "Salim", "Halima"
];

const LAST_NAMES = [
  "Mwangi", "Kamau", "Ochieng", "Ndege", "Makoye", "Mlaki", "Ngowi", "Chacha",
  "Massawe", "Mdachi", "Kimaro", "Lyimo", "Moshi", "Mollel", "Makundi", "Sanga",
  "Mtei", "Mbise", "Shirima", "Urasa", "Komba", "Swai", "Tarimo", "Msuya"
];

// Livestock types
const LIVESTOCK_TYPES = ["Cattle", "Goats", "Sheep", "Chickens", "Ducks", "Pigs"];

// Farm sizes (in hectares)
const FARM_SIZES = {
  smallholder_farmer: { min: 0.5, max: 2 },
  farmer_manager: { min: 2, max: 10 },
  commercial_farm_admin: { min: 10, max: 100 },
  agribusiness: { min: 50, max: 500 },
  cooperative: { min: 20, max: 200 },
};

/**
 * Generate random integer between min and max
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random item from array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random Tanzanian farmer name
 */
export function generateFarmerName(): string {
  return `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
}

/**
 * Generate farm location data
 */
export function generateFarmLocation() {
  const region = randomItem(TANZANIA_REGIONS);
  const latitude = -1 - Math.random() * 10; // Tanzania latitude range
  const longitude = 29 + Math.random() * 10; // Tanzania longitude range
  
  return {
    region: region.name,
    zone: region.zone,
    climate: region.climate,
    rainfall: region.rainfall,
    coordinates: {
      latitude: parseFloat(latitude.toFixed(6)),
      longitude: parseFloat(longitude.toFixed(6)),
    },
    district: `${region.name} ${randomItem(["Rural", "Urban", "District"])}`,
    village: `${randomItem(["Kijiji", "Mtaa", "Kata"])} ${randomInt(1, 50)}`,
  };
}

/**
 * Generate crops based on region
 */
export function generateCrops(zone: string, count: number = 3) {
  const availableCrops = TANZANIA_CROPS[zone as keyof typeof TANZANIA_CROPS] || TANZANIA_CROPS["Central"];
  const crops: any[] = [];
  
  // Select random crops
  const selectedCrops = [...availableCrops].sort(() => 0.5 - Math.random()).slice(0, count);
  
  selectedCrops.forEach((cropName, index) => {
    const plantingDate = new Date();
    plantingDate.setMonth(plantingDate.getMonth() - randomInt(1, 6));
    
    const harvestDate = new Date(plantingDate);
    harvestDate.setMonth(harvestDate.getMonth() + randomInt(3, 6));
    
    crops.push({
      id: `crop-${Date.now()}-${index}`,
      name: cropName,
      variety: `Local ${cropName} Variety`,
      area: parseFloat((Math.random() * 2 + 0.5).toFixed(2)), // hectares
      plantingDate: plantingDate.toISOString().split("T")[0],
      expectedHarvest: harvestDate.toISOString().split("T")[0],
      status: randomItem(["planted", "growing", "flowering", "ready_to_harvest"]),
      health: randomItem(["excellent", "good", "fair", "poor"]),
      estimatedYield: randomInt(500, 2000), // kg
    });
  });
  
  return crops;
}

/**
 * Generate livestock data
 */
export function generateLivestock(count: number = 2) {
  const livestock: any[] = [];
  
  for (let i = 0; i < count; i++) {
    const type = randomItem(LIVESTOCK_TYPES);
    const quantity = type === "Cattle" ? randomInt(2, 20) : randomInt(5, 50);
    
    livestock.push({
      id: `livestock-${Date.now()}-${i}`,
      type,
      breed: `Local ${type}`,
      quantity,
      health: randomItem(["excellent", "good", "fair"]),
      lastVaccination: new Date(Date.now() - randomInt(30, 180) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      averageWeight: type === "Cattle" ? randomInt(200, 400) : randomInt(20, 80),
      unit: "kg",
    });
  }
  
  return livestock;
}

/**
 * Generate financial transactions
 */
export function generateFinancialData() {
  const transactions: any[] = [];
  
  // Generate 10 recent transactions
  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() - randomInt(1, 90));
    
    const isExpense = Math.random() > 0.4;
    const amount = randomInt(10000, 500000); // TZS
    
    transactions.push({
      id: `txn-${Date.now()}-${i}`,
      date: date.toISOString().split("T")[0],
      type: isExpense ? "expense" : "income",
      category: isExpense
        ? randomItem(["Seeds", "Fertilizer", "Labor", "Equipment", "Transport"])
        : randomItem(["Crop Sale", "Livestock Sale", "Services"]),
      amount,
      currency: "TZS",
      description: isExpense
        ? `Purchase of ${randomItem(["inputs", "supplies", "services"])}`
        : `Sale of ${randomItem(["maize", "beans", "livestock"])}`,
      status: "completed",
    });
  }
  
  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return {
    transactions,
    balance: randomInt(100000, 1000000), // TZS
    income: transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0),
    expenses: transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0),
  };
}

/**
 * Generate weather data
 */
export function generateWeatherData(region: string) {
  const temp = randomInt(20, 35); // Celsius
  const humidity = randomInt(40, 90); // Percentage
  const rainfall = randomInt(0, 50); // mm
  
  return {
    region,
    current: {
      temperature: temp,
      humidity,
      conditions: randomItem(["Sunny", "Partly Cloudy", "Cloudy", "Rainy"]),
      windSpeed: randomInt(5, 25), // km/h
    },
    forecast: Array.from({ length: 7 }, (_, i) => ({
      day: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      tempHigh: temp + randomInt(-3, 5),
      tempLow: temp - randomInt(5, 10),
      rainfall: randomInt(0, 30),
      conditions: randomItem(["Sunny", "Cloudy", "Rainy"]),
    })),
    alerts: Math.random() > 0.7
      ? [
          {
            type: randomItem(["Heavy Rain", "Drought Warning", "Pest Alert"]),
            severity: randomItem(["low", "medium", "high"]),
            message: "Weather conditions may affect farming activities",
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]
      : [],
  };
}

/**
 * Generate market prices (TZS per kg)
 */
export function generateMarketPrices(crops: string[]) {
  return crops.map((crop) => ({
    crop,
    pricePerKg: randomInt(500, 5000), // TZS
    currency: "TZS",
    market: randomItem(["Kariakoo", "Arusha Central", "Mwanza Market", "Local Market"]),
    lastUpdated: new Date().toISOString(),
    trend: randomItem(["up", "down", "stable"]),
    changePercent: parseFloat((Math.random() * 20 - 10).toFixed(2)), // -10% to +10%
  }));
}

/**
 * Generate AI query history
 */
export function generateAIQueryHistory() {
  const queries = [
    "What is the best time to plant maize?",
    "How do I control pests on my beans?",
    "When should I harvest my coffee?",
    "What fertilizer should I use for tomatoes?",
    "How can I improve my soil quality?",
  ];
  
  return queries.slice(0, randomInt(2, 5)).map((question, i) => ({
    id: `query-${Date.now()}-${i}`,
    question,
    timestamp: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000).toISOString(),
    language: Math.random() > 0.5 ? "en" : "sw",
    responded: true,
  }));
}

/**
 * Generate complete mock farm data
 */
export function generateCompleteMockData(role: string = "smallholder_farmer") {
  const location = generateFarmLocation();
  const farmerName = generateFarmerName();
  const farmSize = FARM_SIZES[role as keyof typeof FARM_SIZES] || FARM_SIZES.smallholder_farmer;
  const totalArea = parseFloat((Math.random() * (farmSize.max - farmSize.min) + farmSize.min).toFixed(2));
  
  const crops = generateCrops(location.zone, randomInt(2, 5));
  const livestock = generateLivestock(randomInt(1, 3));
  const financial = generateFinancialData();
  const weather = generateWeatherData(location.region);
  const marketPrices = generateMarketPrices(crops.map((c) => c.name));
  const aiHistory = generateAIQueryHistory();
  
  return {
    user: {
      id: `demo-user-${Date.now()}`,
      name: farmerName,
      role,
      phone: `+255 ${randomInt(700, 799)} ${randomInt(100000, 999999)}`,
      email: `${farmerName.toLowerCase().replace(" ", ".")}@kilimo-demo.tz`,
      gender: randomItem(["male", "female"]),
      ageGroup: randomItem(["18-25", "26-35", "36-45", "46-55", "56+"]),
      tier: role === "smallholder_farmer" ? "free" : role === "farmer_manager" ? "basic" : "premium",
    },
    farm: {
      name: `${farmerName}'s Farm`,
      location,
      totalArea,
      unit: "hectares",
      established: new Date(Date.now() - randomInt(365, 3650) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      type: randomItem(["Mixed Farming", "Crop Only", "Livestock Only", "Commercial"]),
    },
    crops,
    livestock,
    financial,
    weather,
    marketPrices,
    aiHistory,
    generated: {
      timestamp: new Date().toISOString(),
      version: "1.0",
      region: location.region,
    },
  };
}

/**
 * Generate cooperative data (for cooperative leader role)
 */
export function generateCooperativeData() {
  const members = Array.from({ length: randomInt(20, 100) }, (_, i) => ({
    id: `member-${i}`,
    name: generateFarmerName(),
    farmSize: parseFloat((Math.random() * 5 + 0.5).toFixed(2)),
    joinedDate: new Date(Date.now() - randomInt(30, 1095) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    status: randomItem(["active", "active", "active", "inactive"]),
  }));
  
  return {
    cooperative: {
      name: `${randomItem(TANZANIA_REGIONS).name} Farmers Cooperative`,
      registrationNumber: `COOP-TZ-${randomInt(1000, 9999)}`,
      established: new Date(Date.now() - randomInt(730, 3650) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      memberCount: members.length,
      totalFarmland: members.reduce((sum, m) => sum + m.farmSize, 0),
    },
    members,
    aggregateData: {
      totalProduction: randomInt(10000, 100000), // kg
      averageYield: randomInt(1000, 3000), // kg/hectare
      marketAccess: randomInt(60, 95), // percentage
    },
  };
}

/**
 * Generate agribusiness data
 */
export function generateAgribusinessData() {
  return {
    business: {
      name: `${randomItem(["Green", "Harvest", "Farm", "Agro", "Bio"])} ${randomItem(["Solutions", "Ventures", "Enterprises", "Co"])}`,
      type: randomItem(["Input Supplier", "Off-taker", "Processing", "Distribution"]),
      registrationNumber: `TIN-${randomInt(100000000, 999999999)}`,
      established: new Date(Date.now() - randomInt(730, 5475) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    inventory: [
      { product: "Seeds", quantity: randomInt(100, 1000), unit: "kg" },
      { product: "Fertilizer", quantity: randomInt(500, 5000), unit: "kg" },
      { product: "Pesticides", quantity: randomInt(50, 500), unit: "liters" },
    ],
    contracts: Array.from({ length: randomInt(5, 20) }, (_, i) => ({
      id: `contract-${i}`,
      farmer: generateFarmerName(),
      crop: randomItem(["Maize", "Rice", "Beans", "Wheat"]),
      quantity: randomInt(1000, 10000),
      pricePerKg: randomInt(800, 3000),
      status: randomItem(["active", "pending", "completed"]),
    })),
  };
}
