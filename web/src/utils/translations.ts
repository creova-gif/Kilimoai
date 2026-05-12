/**
 * KILIMO Agri-AI Suite - Comprehensive Translation Dictionary
 * Bilingual Support: English (en) and Swahili (sw)
 * 
 * This file contains ALL translations for the entire application.
 * Organized by feature/component for easy maintenance.
 */

export type Language = "en" | "sw";

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    sw: string;
  };
}

// ============================================================================
// COMMON UI ELEMENTS
// ============================================================================
export const commonTranslations = {
  // App Branding
  appName: { en: "KILIMO Agri-AI Suite", sw: "KILIMO Agri-AI Suite" },
  appTagline: { en: "Empowering Farmers with AI", sw: "Kuwawezesha Wakulima kwa AI" },
  
  // Navigation
  home: { en: "Home", sw: "Nyumbani" },
  dashboard: { en: "Dashboard", sw: "Dashibodi" },
  profile: { en: "Profile", sw: "Wasifu" },
  settings: { en: "Settings", sw: "Mipangilio" },
  logout: { en: "Logout", sw: "Toka" },
  back: { en: "Back", sw: "Rudi" },
  next: { en: "Next", sw: "Ifuatayo" },
  previous: { en: "Previous", sw: "Iliyotangulia" },
  close: { en: "Close", sw: "Funga" },
  menu: { en: "Menu", sw: "Menyu" },
  
  // Common Actions
  save: { en: "Save", sw: "Hifadhi" },
  cancel: { en: "Cancel", sw: "Ghairi" },
  submit: { en: "Submit", sw: "Wasilisha" },
  confirm: { en: "Confirm", sw: "Thibitisha" },
  delete: { en: "Delete", sw: "Futa" },
  remove: { en: "Remove", sw: "Ondoa" },
  edit: { en: "Edit", sw: "Hariri" },
  update: { en: "Update", sw: "Sasisha" },
  add: { en: "Add", sw: "Ongeza" },
  create: { en: "Create", sw: "Unda" },
  view: { en: "View", sw: "Tazama" },
  viewDetails: { en: "View Details", sw: "Tazama Maelezo" },
  search: { en: "Search", sw: "Tafuta" },
  filter: { en: "Filter", sw: "Chuja" },
  sort: { en: "Sort", sw: "Panga" },
  share: { en: "Share", sw: "Shiriki" },
  download: { en: "Download", sw: "Pakua" },
  upload: { en: "Upload", sw: "Pakia" },
  print: { en: "Print", sw: "Chapa" },
  export: { en: "Export", sw: "Hamisha" },
  import: { en: "Import", sw: "Leta" },
  refresh: { en: "Refresh", sw: "Onyesha Upya" },
  
  // Status
  loading: { en: "Loading...", sw: "Inapakia..." },
  success: { en: "Success", sw: "Mafanikio" },
  error: { en: "Error", sw: "Hitilafu" },
  warning: { en: "Warning", sw: "Onyo" },
  info: { en: "Information", sw: "Taarifa" },
  pending: { en: "Pending", sw: "Inasubiri" },
  completed: { en: "Completed", sw: "Imekamilika" },
  active: { en: "Active", sw: "Inaendelea" },
  inactive: { en: "Inactive", sw: "Haiendelee" },
  
  // Common Messages
  saveSuccess: { en: "Saved successfully", sw: "Imehifadhiwa kikamilifu" },
  updateSuccess: { en: "Updated successfully", sw: "Imesasishwa kikamilifu" },
  deleteSuccess: { en: "Deleted successfully", sw: "Imefutwa kikamilifu" },
  errorOccurred: { en: "An error occurred. Please try again.", sw: "Hitilafu imetokea. Tafadhali jaribu tena." },
  noData: { en: "No data available", sw: "Hakuna data inayopatikana" },
  noResults: { en: "No results found", sw: "Hakuna matokeo yaliyopatikana" },
  confirmDelete: { en: "Are you sure you want to delete this?", sw: "Una uhakika unataka kufuta hii?" },
  
  // Time
  today: { en: "Today", sw: "Leo" },
  yesterday: { en: "Yesterday", sw: "Jana" },
  tomorrow: { en: "Tomorrow", sw: "Kesho" },
  week: { en: "Week", sw: "Wiki" },
  month: { en: "Month", sw: "Mwezi" },
  year: { en: "Year", sw: "Mwaka" },
  day: { en: "Day", sw: "Siku" },
  hour: { en: "Hour", sw: "Saa" },
  minute: { en: "Minute", sw: "Dakika" },
  morning: { en: "Morning", sw: "Asubuhi" },
  afternoon: { en: "Afternoon", sw: "Mchana" },
  evening: { en: "Evening", sw: "Jioni" },
  night: { en: "Night", sw: "Usiku" },
};

// ============================================================================
// WELCOME & ONBOARDING
// ============================================================================
export const welcomeTranslations = {
  welcome: { en: "Welcome to KILIMO", sw: "Karibu KILIMO" },
  welcomeMessage: { en: "Your AI-Powered Agricultural Assistant", sw: "Msaidizi wako wa Kilimo wenye Akili Bandia" },
  chooseLanguage: { en: "Choose Your Language", sw: "Chagua Lugha Yako" },
  selectLanguage: { en: "Select Language", sw: "Chagua Lugha" },
  english: { en: "English", sw: "Kiingereza" },
  swahili: { en: "Swahili", sw: "Kiswahili" },
  continue: { en: "Continue", sw: "Endelea" },
  getStarted: { en: "Get Started", sw: "Anza" },
  skipForNow: { en: "Skip for now", sw: "Ruka kwa sasa" },
  
  // Onboarding Features
  feature1Title: { en: "AI Crop Advisory", sw: "Ushauri wa Mazao wa AI" },
  feature1Desc: { en: "Get personalized farming advice powered by AI", sw: "Pata ushauri wa kilimo uliobinafsishwa kwa AI" },
  feature2Title: { en: "Market Intelligence", sw: "Taarifa za Soko" },
  feature2Desc: { en: "Real-time crop prices and market trends", sw: "Bei za mazao na mwenendo wa soko wakati halisi" },
  feature3Title: { en: "Weather Alerts", sw: "Tahadhari za Hali ya Hewa" },
  feature3Desc: { en: "Stay informed with accurate weather forecasts", sw: "Baki umejua na utabiri sahihi wa hali ya hewa" },
  feature4Title: { en: "Farm Management", sw: "Usimamizi wa Shamba" },
  feature4Desc: { en: "Comprehensive tools to manage your farm", sw: "Zana kamili za kusimamia shamba lako" },
  feature5Title: { en: "Community Network", sw: "Mtandao wa Jamii" },
  feature5Desc: { en: "Connect with farmers and experts", sw: "Unganisha na wakulima na wataalamu" },
  feature6Title: { en: "Mobile Money", sw: "Pesa za Simu" },
  feature6Desc: { en: "Seamless payments and transactions", sw: "Malipo na miamala rahisi" },
};

// ============================================================================
// AUTHENTICATION
// ============================================================================
export const authTranslations = {
  // Login
  login: { en: "Login", sw: "Ingia" },
  loginTitle: { en: "Welcome Back", sw: "Karibu Tena" },
  loginSubtitle: { en: "Sign in to your account", sw: "Ingia kwenye akaunti yako" },
  phoneNumber: { en: "Phone Number", sw: "Nambari ya Simu" },
  phonePlaceholder: { en: "Enter your phone number", sw: "Weka nambari yako ya simu" },
  password: { en: "Password", sw: "Nenosiri" },
  passwordPlaceholder: { en: "Enter your password", sw: "Weka nenosiri lako" },
  rememberMe: { en: "Remember me", sw: "Nikumbuke" },
  forgotPassword: { en: "Forgot password?", sw: "Umesahau nenosiri?" },
  noAccount: { en: "Don't have an account?", sw: "Huna akaunti?" },
  signUp: { en: "Sign Up", sw: "Jisajili" },
  
  // Registration
  register: { en: "Register", sw: "Sajili" },
  registration: { en: "Registration", sw: "Usajili" },
  registerTitle: { en: "Create Account", sw: "Unda Akaunti" },
  registerSubtitle: { en: "Join thousands of farmers", sw: "Jiunge na maelfu ya wakulima" },
  fullName: { en: "Full Name", sw: "Jina Kamili" },
  namePlaceholder: { en: "Enter your full name", sw: "Weka jina lako kamili" },
  email: { en: "Email", sw: "Barua Pepe" },
  emailPlaceholder: { en: "your.email@example.com", sw: "barua.pepe@mfano.com" },
  confirmPassword: { en: "Confirm Password", sw: "Thibitisha Nenosiri" },
  region: { en: "Region", sw: "Mkoa" },
  selectRegion: { en: "Select your region", sw: "Chagua mkoa wako" },
  farmSize: { en: "Farm Size", sw: "Ukubwa wa Shamba" },
  selectFarmSize: { en: "Select farm size", sw: "Chagua ukubwa wa shamba" },
  crops: { en: "Crops", sw: "Mazao" },
  selectCrops: { en: "Select your crops", sw: "Chagua mazao yako" },
  userType: { en: "User Type", sw: "Aina ya Mtumiaji" },
  acceptTerms: { en: "I accept the terms and conditions", sw: "Nakubali masharti na vigezo" },
  alreadyHaveAccount: { en: "Already have an account?", sw: "Una akaunti tayari?" },
  
  // User Types
  farmer: { en: "Farmer", sw: "Mkulima" },
  organization: { en: "Organization", sw: "Shirika" },
  cooperative: { en: "Cooperative", sw: "Ushirika" },
  buyer: { en: "Buyer", sw: "Mnunuzi" },
  extensionOfficer: { en: "Extension Officer", sw: "Afisa Ugani" },
  agribusiness: { en: "Agribusiness", sw: "Biashara ya Kilimo" },
  institution: { en: "Institution", sw: "Taasisi" },
  
  // Guest Mode
  guestMode: { en: "Guest Mode", sw: "Hali ya Mgeni" },
  continueAsGuest: { en: "Continue as Guest", sw: "Endelea kama Mgeni" },
  exploreDemoMode: { en: "Explore Demo Mode", sw: "Chunguza Hali ya Onyesho" },
};

// ============================================================================
// DASHBOARD
// ============================================================================
export const dashboardTranslations = {
  dashboard: { en: "Dashboard", sw: "Dashibodi" },
  overview: { en: "Overview", sw: "Muhtasari" },
  welcomeBack: { en: "Welcome back", sw: "Karibu tena" },
  quickActions: { en: "Quick Actions", sw: "Vitendo vya Haraka" },
  recentActivity: { en: "Recent Activity", sw: "Shughuli za Hivi Karibuni" },
  statistics: { en: "Statistics", sw: "Takwimu" },
  insights: { en: "Insights", sw: "Ufahamu" },
  
  // Stats
  totalCrops: { en: "Total Crops", sw: "Jumla ya Mazao" },
  activeCrops: { en: "Active Crops", sw: "Mazao Yanayoendelea" },
  pendingTasks: { en: "Pending Tasks", sw: "Kazi Zinazosubiri" },
  completedTasks: { en: "Completed Tasks", sw: "Kazi Zilizokamilika" },
  monthlyRevenue: { en: "Monthly Revenue", sw: "Mapato ya Mwezi" },
  totalRevenue: { en: "Total Revenue", sw: "Jumla ya Mapato" },
  farmSize: { en: "Farm Size", sw: "Ukubwa wa Shamba" },
  totalLivestock: { en: "Total Livestock", sw: "Jumla ya Mifugo" },
  notifications: { en: "Notifications", sw: "Arifa" },
  unreadNotifications: { en: "Unread Notifications", sw: "Arifa Ambazo Hazijasomwa" },
};

// ============================================================================
// AI CHATBOT (SANKOFA AI)
// ============================================================================
export const aiChatTranslations = {
  sankofaAI: { en: "Sankofa AI", sw: "Sankofa AI" },
  aiAssistant: { en: "AI Assistant", sw: "Msaidizi wa AI" },
  chatWithAI: { en: "Chat with AI", sw: "Ongea na AI" },
  askQuestion: { en: "Ask a question...", sw: "Uliza swali..." },
  typeMessage: { en: "Type your message...", sw: "Andika ujumbe wako..." },
  send: { en: "Send", sw: "Tuma" },
  voiceInput: { en: "Voice Input", sw: "Ingizo la Sauti" },
  stopListening: { en: "Stop Listening", sw: "Acha Kusikiliza" },
  listening: { en: "Listening...", sw: "Inasikiliza..." },
  thinking: { en: "Thinking...", sw: "Inafikiria..." },
  
  // AI Responses
  greeting: { en: "Hello! I'm Sankofa AI, your agricultural assistant. How can I help you today?", sw: "Habari! Mimi ni Sankofa AI, msaidizi wako wa kilimo. Ninaweza kukusaidiaje leo?" },
  howCanIHelp: { en: "How can I help you?", sw: "Ninaweza kukusaidiaje?" },
  askMeAnything: { en: "Ask me anything about farming", sw: "Niulize chochote kuhusu kilimo" },
  
  // AI Features
  cropAdvice: { en: "Crop Advice", sw: "Ushauri wa Mazao" },
  diseaseIdentification: { en: "Disease Identification", sw: "Utambuzi wa Magonjwa" },
  pestControl: { en: "Pest Control", sw: "Udhibiti wa Wadudu" },
  soilHealth: { en: "Soil Health", sw: "Afya ya Udongo" },
  weatherForecast: { en: "Weather Forecast", sw: "Utabiri wa Hali ya Hewa" },
  marketPrices: { en: "Market Prices", sw: "Bei za Soko" },
  
  // Credits
  aiCredits: { en: "AI Credits", sw: "Mikopo ya AI" },
  creditsRemaining: { en: "Credits Remaining", sw: "Mikopo Iliyobaki" },
  upgradeForMore: { en: "Upgrade for more credits", sw: "Boresha ili kupata mikopo zaidi" },
  lowCredits: { en: "Low credits! Consider upgrading your plan.", sw: "Mikopo michache! Fikiria kuboresha mpango wako." },
};

// ============================================================================
// MARKET & PRICES
// ============================================================================
export const marketTranslations = {
  market: { en: "Market", sw: "Soko" },
  marketplace: { en: "Marketplace", sw: "Soko" },
  marketPrices: { en: "Market Prices", sw: "Bei za Soko" },
  liveMarketPrices: { en: "Live Market Prices", sw: "Bei za Soko Wakati Halisi" },
  marketTrends: { en: "Market Trends", sw: "Mwenendo wa Soko" },
  priceAnalysis: { en: "Price Analysis", sw: "Uchambuzi wa Bei" },
  
  // Price Info
  price: { en: "Price", sw: "Bei" },
  currentPrice: { en: "Current Price", sw: "Bei ya Sasa" },
  averagePrice: { en: "Average Price", sw: "Bei ya Wastani" },
  highestPrice: { en: "Highest Price", sw: "Bei ya Juu" },
  lowestPrice: { en: "Lowest Price", sw: "Bei ya Chini" },
  priceChange: { en: "Price Change", sw: "Mabadiliko ya Bei" },
  pricePerKg: { en: "Price per kg", sw: "Bei kwa kilo" },
  
  // Actions
  buyNow: { en: "Buy Now", sw: "Nunua Sasa" },
  sellNow: { en: "Sell Now", sw: "Uza Sasa" },
  contactSeller: { en: "Contact Seller", sw: "Wasiliana na Muuzaji" },
  contactBuyer: { en: "Contact Buyer", sw: "Wasiliana na Mnunuzi" },
  placeOrder: { en: "Place Order", sw: "Weka Agizo" },
  viewProduct: { en: "View Product", sw: "Tazama Bidhaa" },
  addToCart: { en: "Add to Cart", sw: "Ongeza kwenye Kikapu" },
  
  // Categories
  crops: { en: "Crops", sw: "Mazao" },
  livestock: { en: "Livestock", sw: "Mifugo" },
  farmInputs: { en: "Farm Inputs", sw: "Pembejeo za Shamba" },
  equipment: { en: "Equipment", sw: "Vifaa" },
  seeds: { en: "Seeds", sw: "Mbegu" },
  fertilizers: { en: "Fertilizers", sw: "Mbolea" },
  pesticides: { en: "Pesticides", sw: "Dawa za Wadudu" },
};

// ============================================================================
// WEATHER
// ============================================================================
export const weatherTranslations = {
  weather: { en: "Weather", sw: "Hali ya Hewa" },
  weatherForecast: { en: "Weather Forecast", sw: "Utabiri wa Hali ya Hewa" },
  currentWeather: { en: "Current Weather", sw: "Hali ya Hewa ya Sasa" },
  weatherAlerts: { en: "Weather Alerts", sw: "Tahadhari za Hali ya Hewa" },
  weeklyForecast: { en: "Weekly Forecast", sw: "Utabiri wa Wiki" },
  
  // Weather Conditions
  temperature: { en: "Temperature", sw: "Joto" },
  humidity: { en: "Humidity", sw: "Unyevu" },
  rainfall: { en: "Rainfall", sw: "Mvua" },
  windSpeed: { en: "Wind Speed", sw: "Kasi ya Upepo" },
  pressure: { en: "Pressure", sw: "Shinikizo" },
  visibility: { en: "Visibility", sw: "Mwonekano" },
  
  // Weather Types
  sunny: { en: "Sunny", sw: "Jua" },
  cloudy: { en: "Cloudy", sw: "Mawingu" },
  rainy: { en: "Rainy", sw: "Mvua" },
  stormy: { en: "Stormy", sw: "Dhoruba" },
  windy: { en: "Windy", sw: "Upepo" },
  fog: { en: "Fog", sw: "Ukungu" },
};

// ============================================================================
// FARM MANAGEMENT
// ============================================================================
export const farmTranslations = {
  farm: { en: "Farm", sw: "Shamba" },
  myFarm: { en: "My Farm", sw: "Shamba Langu" },
  farmManagement: { en: "Farm Management", sw: "Usimamizi wa Shamba" },
  farmDetails: { en: "Farm Details", sw: "Maelezo ya Shamba" },
  
  // Crop Planning
  cropPlanning: { en: "Crop Planning", sw: "Mipango ya Mazao" },
  cropManagement: { en: "Crop Management", sw: "Usimamizi wa Mazao" },
  plantingSchedule: { en: "Planting Schedule", sw: "Ratiba ya Kupanda" },
  harvestSchedule: { en: "Harvest Schedule", sw: "Ratiba ya Mavuno" },
  cropRotation: { en: "Crop Rotation", sw: "Mzunguko wa Mazao" },
  cropHealth: { en: "Crop Health", sw: "Afya ya Mazao" },
  
  // Actions
  addCrop: { en: "Add Crop", sw: "Ongeza Zao" },
  plantCrop: { en: "Plant Crop", sw: "Panda Zao" },
  harvestCrop: { en: "Harvest Crop", sw: "Vuna Zao" },
  waterCrops: { en: "Water Crops", sw: "Nyunyizia Mazao" },
  fertilizeCrops: { en: "Fertilize Crops", sw: "Weka Mbolea" },
  
  // Crop Info
  cropName: { en: "Crop Name", sw: "Jina la Zao" },
  cropType: { en: "Crop Type", sw: "Aina ya Zao" },
  plantingDate: { en: "Planting Date", sw: "Tarehe ya Kupanda" },
  harvestDate: { en: "Harvest Date", sw: "Tarehe ya Mavuno" },
  expectedYield: { en: "Expected Yield", sw: "Mavuno Yanayotarajiwa" },
  actualYield: { en: "Actual Yield", sw: "Mavuno Halisi" },
  cropStage: { en: "Crop Stage", sw: "Hatua ya Zao" },
  
  // Crop Stages
  germination: { en: "Germination", sw: "Kuchipua" },
  vegetative: { en: "Vegetative", sw: "Ukuaji wa Majani" },
  flowering: { en: "Flowering", sw: "Kuchanua" },
  fruiting: { en: "Fruiting", sw: "Kuzaa Matunda" },
  maturity: { en: "Maturity", sw: "Kukomaa" },
  harvest: { en: "Harvest", sw: "Mavuno" },
  
  // Livestock
  livestock: { en: "Livestock", sw: "Mifugo" },
  livestockManagement: { en: "Livestock Management", sw: "Usimamizi wa Mifugo" },
  addLivestock: { en: "Add Livestock", sw: "Ongeza Mifugo" },
  livestockHealth: { en: "Livestock Health", sw: "Afya ya Mifugo" },
  vaccination: { en: "Vaccination", sw: "Chanjo" },
  breeding: { en: "Breeding", sw: "Uzalishaji" },
  
  // Tasks
  tasks: { en: "Tasks", sw: "Kazi" },
  taskManagement: { en: "Task Management", sw: "Usimamizi wa Kazi" },
  addTask: { en: "Add Task", sw: "Ongeza Kazi" },
  pendingTasks: { en: "Pending Tasks", sw: "Kazi Zinazosubiri" },
  completedTasks: { en: "Completed Tasks", sw: "Kazi Zilizokamilika" },
  taskDetails: { en: "Task Details", sw: "Maelezo ya Kazi" },
  dueDate: { en: "Due Date", sw: "Tarehe ya Mwisho" },
  priority: { en: "Priority", sw: "Kipaumbele" },
  assignedTo: { en: "Assigned To", sw: "Imepewa" },
  
  // Resources
  resources: { en: "Resources", sw: "Rasilimali" },
  inventory: { en: "Inventory", sw: "Hesabu ya Bidhaa" },
  equipment: { en: "Equipment", sw: "Vifaa" },
  supplies: { en: "Supplies", sw: "Vifaa" },
  tools: { en: "Tools", sw: "Zana" },
};

// ============================================================================
// FINANCIAL
// ============================================================================
export const financialTranslations = {
  finance: { en: "Finance", sw: "Fedha" },
  finances: { en: "Finances", sw: "Fedha" },
  farmFinance: { en: "Farm Finance", sw: "Fedha za Shamba" },
  income: { en: "Income", sw: "Mapato" },
  expenses: { en: "Expenses", sw: "Matumizi" },
  profit: { en: "Profit", sw: "Faida" },
  loss: { en: "Loss", sw: "Hasara" },
  balance: { en: "Balance", sw: "Salio" },
  
  // Mobile Money
  mobileMoney: { en: "Mobile Money", sw: "Pesa za Simu" },
  payment: { en: "Payment", sw: "Malipo" },
  sendMoney: { en: "Send Money", sw: "Tuma Pesa" },
  receiveMoney: { en: "Receive Money", sw: "Pokea Pesa" },
  payBill: { en: "Pay Bill", sw: "Lipa Bili" },
  buyGoods: { en: "Buy Goods", sw: "Nunua Bidhaa" },
  transactionHistory: { en: "Transaction History", sw: "Historia ya Miamala" },
  
  // Insurance
  insurance: { en: "Insurance", sw: "Bima" },
  cropInsurance: { en: "Crop Insurance", sw: "Bima ya Mazao" },
  livestockInsurance: { en: "Livestock Insurance", sw: "Bima ya Mifugo" },
  getQuote: { en: "Get Quote", sw: "Pata Bei" },
  buyCoverage: { en: "Buy Coverage", sw: "Nunua Bima" },
  fileClaim: { en: "File Claim", sw: "Wasilisha Dai" },
};

// ============================================================================
// SERVICES
// ============================================================================
export const servicesTranslations = {
  services: { en: "Services", sw: "Huduma" },
  
  // Expert Consultation
  expertConsultation: { en: "Expert Consultation", sw: "Ushauri wa Mtaalamu" },
  consultExperts: { en: "Consult Experts", sw: "Wasiliana na Wataalamu" },
  bookConsultation: { en: "Book Consultation", sw: "Weka Miadi ya Ushauri" },
  scheduleCall: { en: "Schedule Call", sw: "Panga Simu" },
  experts: { en: "Experts", sw: "Wataalamu" },
  agronomist: { en: "Agronomist", sw: "Mtaalamu wa Kilimo" },
  veterinarian: { en: "Veterinarian", sw: "Daktari wa Wanyama" },
  
  // Soil Testing
  soilTesting: { en: "Soil Testing", sw: "Uchunguzi wa Udongo" },
  requestSoilTest: { en: "Request Soil Test", sw: "Omba Uchunguzi wa Udongo" },
  soilResults: { en: "Soil Results", sw: "Matokeo ya Udongo" },
  soilHealth: { en: "Soil Health", sw: "Afya ya Udongo" },
  soilType: { en: "Soil Type", sw: "Aina ya Udongo" },
  soilPH: { en: "Soil pH", sw: "pH ya Udongo" },
  soilNutrients: { en: "Soil Nutrients", sw: "Virutubishi vya Udongo" },
  
  // Video Tutorials
  videoTutorials: { en: "Video Tutorials", sw: "Mafunzo ya Video" },
  watchTutorials: { en: "Watch Tutorials", sw: "Tazama Mafunzo" },
  learningCenter: { en: "Learning Center", sw: "Kituo cha Kujifunza" },
  courses: { en: "Courses", sw: "Kozi" },
  
  // Knowledge Base
  knowledgeBase: { en: "Knowledge Base", sw: "Hazina ya Maarifa" },
  articles: { en: "Articles", sw: "Makala" },
  guides: { en: "Guides", sw: "Miongozo" },
  faq: { en: "FAQ", sw: "Maswali Yanayoulizwa Mara kwa Mara" },
  
  // Community
  community: { en: "Community", sw: "Jamii" },
  discussions: { en: "Discussions", sw: "Majadiliano" },
  forums: { en: "Forums", sw: "Majukwaa" },
  peerGroups: { en: "Peer Groups", sw: "Vikundi vya Rika" },
  joinDiscussion: { en: "Join Discussion", sw: "Jiunge na Majadiliano" },
};

// ============================================================================
// KILIMO AGRO-ID
// ============================================================================
export const agroIDTranslations = {
  kilimoAgroID: { en: "KILIMO AGRO-ID", sw: "KITAMBULISHO CHA KILIMO - KILIMO" },
  farmerID: { en: "Farmer ID", sw: "Kitambulisho cha Mkulima" },
  verifyIdentity: { en: "Verify Identity", sw: "Thibitisha Utambulisho" },
  kycVerification: { en: "KYC Verification", sw: "Uthibitisho wa KYC" },
  idNumber: { en: "ID Number", sw: "Nambari ya Kitambulisho" },
  uploadDocument: { en: "Upload Document", sw: "Pakia Hati" },
  verificationStatus: { en: "Verification Status", sw: "Hali ya Uthibitisho" },
  verified: { en: "Verified", sw: "Imethibitishwa" },
  pending: { en: "Pending", sw: "Inasubiri" },
  rejected: { en: "Rejected", sw: "Imekataliwa" },
};

// ============================================================================
// ANALYTICS & REPORTS
// ============================================================================
export const analyticsTranslations = {
  analytics: { en: "Analytics", sw: "Uchambuzi" },
  reports: { en: "Reports", sw: "Ripoti" },
  insights: { en: "Insights", sw: "Ufahamu" },
  statistics: { en: "Statistics", sw: "Takwimu" },
  charts: { en: "Charts", sw: "Grafu" },
  graphs: { en: "Graphs", sw: "Grafu" },
  trends: { en: "Trends", sw: "Mwenendo" },
  performance: { en: "Performance", sw: "Utendaji" },
  
  // Report Types
  farmReport: { en: "Farm Report", sw: "Ripoti ya Shamba" },
  cropReport: { en: "Crop Report", sw: "Ripoti ya Mazao" },
  financialReport: { en: "Financial Report", sw: "Ripoti ya Kifedha" },
  yieldReport: { en: "Yield Report", sw: "Ripoti ya Mavuno" },
  
  // Actions
  generateReport: { en: "Generate Report", sw: "Tengeneza Ripoti" },
  downloadReport: { en: "Download Report", sw: "Pakua Ripoti" },
  shareReport: { en: "Share Report", sw: "Shiriki Ripoti" },
  viewReport: { en: "View Report", sw: "Tazama Ripoti" },
};

// ============================================================================
// SETTINGS & PROFILE
// ============================================================================
export const settingsTranslations = {
  settings: { en: "Settings", sw: "Mipangilio" },
  accountSettings: { en: "Account Settings", sw: "Mipangilio ya Akaunti" },
  profileSettings: { en: "Profile Settings", sw: "Mipangilio ya Wasifu" },
  notificationSettings: { en: "Notification Settings", sw: "Mipangilio ya Arifa" },
  privacySettings: { en: "Privacy Settings", sw: "Mipangilio ya Faragha" },
  languageSettings: { en: "Language Settings", sw: "Mipangilio ya Lugha" },
  
  // Profile
  profile: { en: "Profile", sw: "Wasifu" },
  editProfile: { en: "Edit Profile", sw: "Hariri Wasifu" },
  myProfile: { en: "My Profile", sw: "Wasifu Wangu" },
  personalInfo: { en: "Personal Information", sw: "Taarifa Binafsi" },
  contactInfo: { en: "Contact Information", sw: "Taarifa za Mawasiliano" },
  
  // Notifications
  notifications: { en: "Notifications", sw: "Arifa" },
  enableNotifications: { en: "Enable Notifications", sw: "Washa Arifa" },
  pushNotifications: { en: "Push Notifications", sw: "Arifa za Kusukuma" },
  emailNotifications: { en: "Email Notifications", sw: "Arifa za Barua Pepe" },
  smsNotifications: { en: "SMS Notifications", sw: "Arifa za SMS" },
  
  // Privacy
  privacy: { en: "Privacy", sw: "Faragha" },
  dataPrivacy: { en: "Data Privacy", sw: "Faragha ya Data" },
  termsOfService: { en: "Terms of Service", sw: "Masharti ya Huduma" },
  privacyPolicy: { en: "Privacy Policy", sw: "Sera ya Faragha" },
};

// ============================================================================
// HELP & SUPPORT
// ============================================================================
export const supportTranslations = {
  help: { en: "Help", sw: "Msaada" },
  support: { en: "Support", sw: "Usaidizi" },
  helpCenter: { en: "Help Center", sw: "Kituo cha Msaada" },
  contactSupport: { en: "Contact Support", sw: "Wasiliana na Usaidizi" },
  reportIssue: { en: "Report Issue", sw: "Ripoti Tatizo" },
  feedback: { en: "Feedback", sw: "Maoni" },
  sendFeedback: { en: "Send Feedback", sw: "Tuma Maoni" },
  
  // FAQ
  faq: { en: "Frequently Asked Questions", sw: "Maswali Yanayoulizwa Mara kwa Mara" },
  commonQuestions: { en: "Common Questions", sw: "Maswali ya Kawaida" },
  
  // Contact
  contactUs: { en: "Contact Us", sw: "Wasiliana Nasi" },
  email: { en: "Email", sw: "Barua Pepe" },
  phone: { en: "Phone", sw: "Simu" },
  chat: { en: "Chat", sw: "Ongea" },
  liveChat: { en: "Live Chat", sw: "Ongea Moja kwa Moja" },
};

// ============================================================================
// ERRORS & VALIDATION
// ============================================================================
export const errorTranslations = {
  // Form Validation
  required: { en: "This field is required", sw: "Sehemu hii inahitajika" },
  invalidEmail: { en: "Please enter a valid email", sw: "Tafadhali weka barua pepe sahihi" },
  invalidPhone: { en: "Please enter a valid phone number", sw: "Tafadhali weka nambari ya simu sahihi" },
  passwordMismatch: { en: "Passwords do not match", sw: "Nenosiri hazifanani" },
  weakPassword: { en: "Password is too weak", sw: "Nenosiri ni dhaifu sana" },
  minLength: { en: "Minimum length is", sw: "Urefu wa chini ni" },
  maxLength: { en: "Maximum length is", sw: "Urefu wa juu ni" },
  
  // API Errors
  networkError: { en: "Network error. Please check your connection.", sw: "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako." },
  serverError: { en: "Server error. Please try again later.", sw: "Hitilafu ya seva. Tafadhali jaribu baadaye." },
  unauthorized: { en: "Unauthorized access", sw: "Ufikiaji usioruhusiwa" },
  notFound: { en: "Not found", sw: "Haijapatikana" },
  timeout: { en: "Request timeout", sw: "Ombi limekwisha muda" },
};

// ============================================================================
// AGRICULTURAL TERMS
// ============================================================================
export const agriTermsTranslations = {
  // General
  agriculture: { en: "Agriculture", sw: "Kilimo" },
  farming: { en: "Farming", sw: "Kilimo" },
  farmer: { en: "Farmer", sw: "Mkulima" },
  farmers: { en: "Farmers", sw: "Wakulima" },
  
  // Crops
  maize: { en: "Maize", sw: "Mahindi" },
  rice: { en: "Rice", sw: "Mchele" },
  wheat: { en: "Wheat", sw: "Ngano" },
  beans: { en: "Beans", sw: "Maharage" },
  cassava: { en: "Cassava", sw: "Muhogo" },
  potato: { en: "Potato", sw: "Kiazi" },
  sweetPotato: { en: "Sweet Potato", sw: "Kiazi Kitamu" },
  tomato: { en: "Tomato", sw: "Nyanya" },
  onion: { en: "Onion", sw: "Kitunguu" },
  cabbage: { en: "Cabbage", sw: "Kabichi" },
  banana: { en: "Banana", sw: "Ndizi" },
  coffee: { en: "Coffee", sw: "Kahawa" },
  tea: { en: "Tea", sw: "Chai" },
  cotton: { en: "Cotton", sw: "Pamba" },
  sunflower: { en: "Sunflower", sw: "Alizeti" },
  
  // Livestock
  cattle: { en: "Cattle", sw: "Ng'ombe" },
  goat: { en: "Goat", sw: "Mbuzi" },
  sheep: { en: "Sheep", sw: "Kondoo" },
  chicken: { en: "Chicken", sw: "Kuku" },
  pig: { en: "Pig", sw: "Nguruwe" },
  duck: { en: "Duck", sw: "Bata" },
  
  // Farm Inputs
  seed: { en: "Seed", sw: "Mbegu" },
  seeds: { en: "Seeds", sw: "Mbegu" },
  fertilizer: { en: "Fertilizer", sw: "Mbolea" },
  pesticide: { en: "Pesticide", sw: "Dawa ya Wadudu" },
  herbicide: { en: "Herbicide", sw: "Dawa ya Magugu" },
  fungicide: { en: "Fungicide", sw: "Dawa ya Kuvu" },
  
  // Farm Operations
  planting: { en: "Planting", sw: "Kupanda" },
  sowing: { en: "Sowing", sw: "Kupanda Mbegu" },
  watering: { en: "Watering", sw: "Kunyunyizia" },
  irrigation: { en: "Irrigation", sw: "Umwagiliaji" },
  weeding: { en: "Weeding", sw: "Kupalilia" },
  harvesting: { en: "Harvesting", sw: "Kuvuna" },
  pruning: { en: "Pruning", sw: "Kupogolea" },
  tilling: { en: "Tilling", sw: "Kulima" },
  
  // Soil & Land
  soil: { en: "Soil", sw: "Udongo" },
  land: { en: "Land", sw: "Ardhi" },
  field: { en: "Field", sw: "Shamba" },
  plot: { en: "Plot", sw: "Kiwanja" },
  acre: { en: "Acre", sw: "Ekari" },
  hectare: { en: "Hectare", sw: "Hekta" },
  
  // Season & Time
  season: { en: "Season", sw: "Msimu" },
  rainySeason: { en: "Rainy Season", sw: "Msimu wa Mvua" },
  drySeason: { en: "Dry Season", sw: "Msimu wa Kiangazi" },
  growingSeason: { en: "Growing Season", sw: "Msimu wa Ukuaji" },
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get translation for a specific key
 */
export function getTranslation(
  category: string,
  key: string,
  language: Language
): string {
  const translations: Record<string, any> = {
    common: commonTranslations,
    welcome: welcomeTranslations,
    auth: authTranslations,
    dashboard: dashboardTranslations,
    aiChat: aiChatTranslations,
    market: marketTranslations,
    weather: weatherTranslations,
    farm: farmTranslations,
    financial: financialTranslations,
    services: servicesTranslations,
    agroID: agroIDTranslations,
    analytics: analyticsTranslations,
    settings: settingsTranslations,
    support: supportTranslations,
    error: errorTranslations,
    agriTerms: agriTermsTranslations,
  };

  return translations[category]?.[key]?.[language] || key;
}

/**
 * Format currency in TZS
 */
export function formatCurrency(amount: number, language: Language): string {
  const locale = language === "en" ? "en-TZ" : "sw-TZ";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "TZS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date
 */
export function formatDate(date: Date, language: Language): string {
  const locale = language === "en" ? "en-TZ" : "sw-TZ";
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format number
 */
export function formatNumber(num: number, language: Language): string {
  const locale = language === "en" ? "en-TZ" : "sw-TZ";
  return num.toLocaleString(locale);
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date, language: Language): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) {
    return language === "en" ? "Just now" : "Sasa hivi";
  } else if (diffInMinutes < 60) {
    return language === "en"
      ? `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
      : `Dakika ${diffInMinutes} zilizopita`;
  } else if (diffInHours < 24) {
    return language === "en"
      ? `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
      : `Saa ${diffInHours} zilizopita`;
  } else if (diffInDays < 7) {
    return language === "en"
      ? `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
      : `Siku ${diffInDays} zilizopita`;
  } else {
    return formatDate(date, language);
  }
}

export default {
  common: commonTranslations,
  welcome: welcomeTranslations,
  auth: authTranslations,
  dashboard: dashboardTranslations,
  aiChat: aiChatTranslations,
  market: marketTranslations,
  weather: weatherTranslations,
  farm: farmTranslations,
  financial: financialTranslations,
  services: servicesTranslations,
  agroID: agroIDTranslations,
  analytics: analyticsTranslations,
  settings: settingsTranslations,
  support: supportTranslations,
  error: errorTranslations,
  agriTerms: agriTermsTranslations,
};
