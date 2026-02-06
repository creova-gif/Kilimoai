/**
 * KILIMO Agri-AI Suite Audit Configuration
 * Author: CREOVA
 * Date: 27-Jan-2026
 */

export const config = {
  // Environment configuration
  environment: process.env.NODE_ENV || 'development',
  
  // Base URLs (update these for your deployment)
  baseUrl: process.env.API_BASE_URL || 'https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ce1844e7',
  frontendUrl: process.env.FRONTEND_URL || 'https://your-kilimo-app.vercel.app',
  
  // Authentication
  authToken: process.env.SUPABASE_ANON_KEY || '',
  
  // Test users for each role
  testUsers: {
    smallholder_farmer: {
      phone: '+255712000001',
      userId: 'test-smallholder-001',
      name: 'Test Smallholder'
    },
    farmer: {
      phone: '+255712000002',
      userId: 'test-farmer-002',
      name: 'Test Farmer'
    },
    farm_manager: {
      phone: '+255712000003',
      userId: 'test-manager-003',
      name: 'Test Manager'
    },
    commercial_farm_admin: {
      phone: '+255712000004',
      userId: 'test-commercial-004',
      name: 'Test Commercial'
    },
    agribusiness_operations: {
      phone: '+255712000005',
      userId: 'test-agribusiness-005',
      name: 'Test Agribusiness'
    },
    extension_officer_ngo: {
      phone: '+255712000006',
      userId: 'test-extension-006',
      name: 'Test Extension Officer'
    },
    cooperative_leader: {
      phone: '+255712000007',
      userId: 'test-coop-007',
      name: 'Test Cooperative Leader'
    }
  },

  // All API endpoints to test
  apiEndpoints: [
    // Authentication (6)
    { path: '/auth/send-otp', method: 'POST', requiresAuth: false, critical: true },
    { path: '/auth/verify-otp', method: 'POST', requiresAuth: false, critical: true },
    { path: '/register', method: 'POST', requiresAuth: false, critical: true },
    { path: '/login', method: 'POST', requiresAuth: false, critical: true },
    { path: '/logout', method: 'POST', requiresAuth: true, critical: false },
    { path: '/auth/session', method: 'GET', requiresAuth: true, critical: true },

    // Wallet (5)
    { path: '/wallet/:userId', method: 'GET', requiresAuth: true, critical: true },
    { path: '/wallet/add-funds', method: 'POST', requiresAuth: true, critical: true },
    { path: '/wallet/withdraw', method: 'POST', requiresAuth: true, critical: true },
    { path: '/wallet/transactions/:userId', method: 'GET', requiresAuth: true, critical: false },
    { path: '/wallet/transfer', method: 'POST', requiresAuth: true, critical: false },

    // Payments (4)
    { path: '/payments/deposit/initiate', method: 'POST', requiresAuth: true, critical: true },
    { path: '/payments/verify', method: 'POST', requiresAuth: true, critical: true },
    { path: '/payments/callback', method: 'POST', requiresAuth: false, critical: true },
    { path: '/payments/methods', method: 'GET', requiresAuth: false, critical: false },

    // Tasks (4)
    { path: '/tasks/:userId', method: 'GET', requiresAuth: true, critical: true },
    { path: '/tasks/create', method: 'POST', requiresAuth: true, critical: true },
    { path: '/tasks/update', method: 'POST', requiresAuth: true, critical: true },
    { path: '/tasks/:taskId', method: 'DELETE', requiresAuth: true, critical: false },

    // AI Services (5)
    { path: '/ai-chat/send', method: 'POST', requiresAuth: true, critical: true },
    { path: '/ai-chat/recommendations', method: 'POST', requiresAuth: true, critical: false },
    { path: '/diagnosis/analyze', method: 'POST', requiresAuth: true, critical: true },
    { path: '/ai-farm-plan/generate', method: 'POST', requiresAuth: true, critical: false },
    { path: '/ai-insights/get', method: 'POST', requiresAuth: true, critical: false },

    // Alerts & Notifications (5)
    { path: '/alerts/create', method: 'POST', requiresAuth: true, critical: true },
    { path: '/alerts/:userId', method: 'GET', requiresAuth: true, critical: false },
    { path: '/alerts/mark-read', method: 'POST', requiresAuth: true, critical: false },
    { path: '/notifications/send-sms', method: 'POST', requiresAuth: true, critical: true },
    { path: '/notifications/:userId', method: 'GET', requiresAuth: true, critical: false },

    // Marketplace (6)
    { path: '/marketplace/products', method: 'GET', requiresAuth: false, critical: false },
    { path: '/marketplace/product/create', method: 'POST', requiresAuth: true, critical: false },
    { path: '/marketplace/order/create', method: 'POST', requiresAuth: true, critical: true },
    { path: '/marketplace/orders/:userId', method: 'GET', requiresAuth: true, critical: false },
    { path: '/marketplace/order/update-status', method: 'POST', requiresAuth: true, critical: false },
    { path: '/marketplace/payment/process', method: 'POST', requiresAuth: true, critical: true },

    // Crop Planning (4)
    { path: '/crop-plan/add-crop', method: 'POST', requiresAuth: true, critical: false },
    { path: '/crop-plan/:userId', method: 'GET', requiresAuth: true, critical: false },
    { path: '/crop-plan/update', method: 'POST', requiresAuth: true, critical: false },
    { path: '/crop-plan/:planId', method: 'DELETE', requiresAuth: true, critical: false },

    // Livestock (4)
    { path: '/livestock/add', method: 'POST', requiresAuth: true, critical: false },
    { path: '/livestock/:userId', method: 'GET', requiresAuth: true, critical: false },
    { path: '/livestock/update', method: 'POST', requiresAuth: true, critical: false },
    { path: '/livestock/health-check', method: 'POST', requiresAuth: true, critical: false },

    // Weather & Market (4)
    { path: '/weather/:region', method: 'GET', requiresAuth: false, critical: false },
    { path: '/market-prices/:region', method: 'GET', requiresAuth: false, critical: false },
    { path: '/market-prices/trends', method: 'GET', requiresAuth: false, critical: false },
    { path: '/market-prices/alert', method: 'POST', requiresAuth: true, critical: false },

    // Learning (3)
    { path: '/learning/videos', method: 'GET', requiresAuth: false, critical: false },
    { path: '/learning/articles', method: 'GET', requiresAuth: false, critical: false },
    { path: '/learning/progress', method: 'POST', requiresAuth: true, critical: false },

    // Experts (4)
    { path: '/experts/list', method: 'GET', requiresAuth: false, critical: false },
    { path: '/consultations/book', method: 'POST', requiresAuth: true, critical: false },
    { path: '/consultations/:userId', method: 'GET', requiresAuth: true, critical: false },
    { path: '/consultations/feedback', method: 'POST', requiresAuth: true, critical: false },

    // Farm Management (2)
    { path: '/farm/update', method: 'POST', requiresAuth: true, critical: false },
    { path: '/farm/:userId', method: 'GET', requiresAuth: true, critical: false },
  ],

  // Critical workflows to test
  workflows: [
    {
      name: 'ai_chat_to_task',
      description: 'AI chat recommendation creates task',
      steps: [
        { action: 'send_ai_message', data: { message: 'When should I plant maize?' } },
        { action: 'verify_response', check: 'response.includes("plant")' },
        { action: 'click_add_to_tasks', selector: '[data-testid="add-to-tasks"]' },
        { action: 'verify_task_created', check: 'tasks.length > 0' }
      ],
      critical: true
    },
    {
      name: 'crop_diagnosis_to_task',
      description: 'Crop diagnosis creates treatment task',
      steps: [
        { action: 'upload_image', data: { imageType: 'crop_disease' } },
        { action: 'verify_diagnosis', check: 'diagnosis.disease' },
        { action: 'confirm_task_creation', selector: '[data-testid="create-task-confirm"]' },
        { action: 'verify_task_created', check: 'task.category === "crop_health"' }
      ],
      critical: true
    },
    {
      name: 'weather_alert_to_task',
      description: 'Weather alert creates protective task',
      steps: [
        { action: 'trigger_weather_check', data: { condition: 'heavy_rain' } },
        { action: 'verify_alert_created', check: 'alert.type === "heavy_rain"' },
        { action: 'verify_task_created', check: 'task.source === "weather_alert"' }
      ],
      critical: true
    },
    {
      name: 'deposit_to_wallet',
      description: 'Deposit updates wallet balance',
      steps: [
        { action: 'get_initial_balance', store: 'initialBalance' },
        { action: 'initiate_deposit', data: { amount: 10000, provider: 'M-Pesa' } },
        { action: 'verify_transaction_created', check: 'transaction.id' },
        { action: 'simulate_payment_success', data: { transactionId: 'stored.transactionId' } },
        { action: 'verify_balance_updated', check: 'balance > initialBalance' }
      ],
      critical: true
    },
    {
      name: 'withdraw_from_wallet',
      description: 'Withdrawal deducts from wallet',
      steps: [
        { action: 'get_initial_balance', store: 'initialBalance' },
        { action: 'initiate_withdrawal', data: { amount: 5000, provider: 'M-Pesa' } },
        { action: 'verify_balance_decreased', check: 'balance < initialBalance' }
      ],
      critical: true
    }
  ],

  // AI prompts to validate
  aiPrompts: [
    {
      name: 'crop_planting_advice',
      prompt: 'When should I plant maize in Morogoro?',
      expectedKeywords: ['plant', 'maize', 'season', 'Masika', 'Vuli'],
      language: 'en'
    },
    {
      name: 'swahili_crop_advice',
      prompt: 'Ni wakati gani bora wa kupanda mahindi Morogoro?',
      expectedKeywords: ['mahindi', 'msimu', 'Masika', 'Vuli'],
      language: 'sw'
    },
    {
      name: 'pest_identification',
      prompt: 'My maize leaves have brown spots. What is wrong?',
      expectedKeywords: ['disease', 'blight', 'fungus', 'treatment', 'fungicide'],
      language: 'en'
    },
    {
      name: 'fertilizer_recommendation',
      prompt: 'What fertilizer should I use for maize?',
      expectedKeywords: ['DAP', 'Urea', 'NPK', 'kg', 'acre'],
      language: 'en'
    },
    {
      name: 'market_price_query',
      prompt: 'What is the current price of maize?',
      expectedKeywords: ['TZS', 'price', 'kg', 'bag'],
      language: 'en'
    }
  ],

  // Localization strings to check
  localizationChecks: [
    { key: 'home', en: 'Home', sw: 'Nyumbani' },
    { key: 'dashboard', en: 'Dashboard', sw: 'Dashibodi' },
    { key: 'wallet', en: 'Wallet', sw: 'Mkoba' },
    { key: 'deposit', en: 'Deposit', sw: 'Weka Fedha' },
    { key: 'withdraw', en: 'Withdraw', sw: 'Toa Fedha' },
    { key: 'tasks', en: 'Tasks', sw: 'Kazi' },
    { key: 'crop_planning', en: 'Crop Planning', sw: 'Mpango wa Mazao' },
    { key: 'livestock', en: 'Livestock', sw: 'Mifugo' },
    { key: 'marketplace', en: 'Marketplace', sw: 'Soko' },
    { key: 'weather', en: 'Weather', sw: 'Hali ya Hewa' },
  ],

  // Thresholds for pass/fail
  thresholds: {
    apiSuccessRate: 0.90, // 90% of APIs must pass
    criticalApiSuccessRate: 1.0, // 100% of critical APIs must pass
    workflowSuccessRate: 0.85, // 85% of workflows must pass
    criticalWorkflowSuccessRate: 1.0, // 100% of critical workflows must pass
    aiPromptSuccessRate: 0.80, // 80% of AI prompts must pass
    localizationCoverage: 0.70, // 70% of strings must be translated
  },

  // Timeout settings (ms)
  timeouts: {
    apiRequest: 10000, // 10 seconds
    pageLoad: 30000, // 30 seconds
    workflow: 60000, // 60 seconds
    aiResponse: 30000, // 30 seconds
  },

  // Report settings
  report: {
    outputDir: './audit-reports',
    filename: `audit-report-${new Date().toISOString().split('T')[0]}.json`,
    htmlReport: true,
    sendEmail: false,
    emailRecipients: ['admin@kilimo.app']
  }
};

export default config;
