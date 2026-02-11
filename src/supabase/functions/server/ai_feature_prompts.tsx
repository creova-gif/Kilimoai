/**
 * ============================================================================
 * KILIMO AGRI-AI SUITE - Feature-Specific AI Prompt Logic
 * ============================================================================
 * Production-grade AI behavior design per feature
 * Philosophy: "AI must feel helpful, not loud"
 * Principle: "Farmers are task-driven, not feature-driven"
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. CROP INTELLIGENCE (Crop Library)
 * ============================================================================
 */

export interface CropIntelligenceContext {
  crop_name?: string;
  variety?: string;
  region?: string;
  season?: string;
  previous_yields?: number[];
  language: "EN" | "SW";
  user_role?: string;
}

export function generateCropIntelligencePrompt(
  context: CropIntelligenceContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Wewe ni KILIMO Crop Intelligence AI.
Unasaidia wakulima wa Tanzania na Afrika Mashariki.
Kazi yako ni kusaidia wakulima kupanga, kuelewa, na kutumia tena maarifa ya mazao bila ugumu.
Zingatia daima mbinu za kilimo za ndani, misimu ya mvua, na upatikanaji wa pembejeo.
Usifute kamwe data ya mkulima bila uthibitisho.`
    : `You are KILIMO Crop Intelligence AI.
You support Tanzanian and East African farmers.
Your job is to help farmers organize, understand, and reuse crop knowledge without complexity.
Always respect local farming practices, rainfall seasons, and input availability.
Never overwrite farmer data without confirmation.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.crop_name) contextInfo += `- Crop: ${context.crop_name}\n`;
  if (context.variety) contextInfo += `- Variety: ${context.variety}\n`;
  if (context.region) contextInfo += `- Region: ${context.region}\n`;
  if (context.season) contextInfo += `- Season: ${context.season}\n`;
  if (context.previous_yields && context.previous_yields.length > 0) {
    contextInfo += `- Previous Yields: ${context.previous_yields.join(", ")} kg\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Pendekeza sifa za msingi za zao
- Sawazisha majina yasiyo sawa
- Tambua mazao ya kujirudia
- Toa data iliyoboreshwa na AI (DTM, nafasi, kiwango cha mavuno)
- Pendekeza vikundi au violezo`
    : `\n\nRESPONSIBILITIES:
- Suggest default crop attributes
- Normalize inconsistent names
- Detect duplicate crops
- Offer AI-enriched data (DTM, spacing, yield range)
- Recommend grouping or templates`;

  const guardrails = context.language === "SW"
    ? `\n\nVIZUIZI:
- Usihifadhi moja kwa moja
- Usitumie lugha ngumu za kisayansi
- Ikiwa huna uhakika → uliza
- Fanya iwe rahisi kwa wakulima`
    : `\n\nGUARDRAILS:
- Never auto-save
- No scientific jargon
- If uncertain → ask
- Keep it simple for farmers`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "suggested_attributes": {
    "days_to_maturity": number,
    "spacing_cm": number,
    "yield_range_kg_per_acre": string,
    "water_needs": "low|medium|high",
    "season_suitability": string
  },
  "confidence_level": "high|medium|low",
  "local_notes": string,
  "recommended_templates": string[]
}`;

  return systemPrompt + contextInfo + responsibilities + guardrails + outputFormat;
}

/**
 * ============================================================================
 * 2. FARMING TEMPLATES (Growing Templates)
 * ============================================================================
 */

export interface FarmingTemplatesContext {
  crop?: string;
  practice_type?: "rainfed" | "irrigated";
  soil_type?: string;
  inputs_available?: string[];
  labor_level?: "low" | "medium" | "high";
  language: "EN" | "SW";
}

export function generateFarmingTemplatesPrompt(
  context: FarmingTemplatesContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Unasaidia wakulima kuokoa muda kwa kutumia tena mbinu za kilimo.
Violezo lazima vionyeshe jinsi wakulima wanavyofanya kazi halisi — sio vitabu.
Daima ruhusu mabadiliko ya mkono.`
    : `You help farmers save time by reusing farming methods.
Templates must reflect how farmers actually work — not textbooks.
Always allow manual overrides.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.crop) contextInfo += `- Crop: ${context.crop}\n`;
  if (context.practice_type) {
    contextInfo += `- Practice: ${context.practice_type}\n`;
  }
  if (context.soil_type) contextInfo += `- Soil Type: ${context.soil_type}\n`;
  if (context.inputs_available && context.inputs_available.length > 0) {
    contextInfo += `- Available Inputs: ${context.inputs_available.join(", ")}\n`;
  }
  if (context.labor_level) {
    contextInfo += `- Labor Level: ${context.labor_level}\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Unda dondoo ya kiolezo
- Pendekeza nafasi, muda, kazi
- Kadiria viwango vya mavuno
- Onesha hatari kubwa`
    : `\n\nRESPONSIBILITIES:
- Create draft template
- Suggest spacing, timing, tasks
- Estimate yield ranges
- Flag high-risk assumptions`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "template_name": string,
  "defaults": {
    "spacing_cm": number,
    "planting_window": string,
    "expected_yield_kg": string,
    "input_needs": string[]
  },
  "tasks": [
    {
      "task_name": string,
      "days_after_planting": number,
      "description": string
    }
  ],
  "risk_flags": string[]
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 3. CROP PLANNING (Visual Planner)
 * ============================================================================
 */

export interface CropPlanningContext {
  plots?: Array<{ name: string; size_acres: number }>;
  selected_template?: string;
  season_window?: string;
  goal?: "yield" | "revenue" | "subsistence";
  language: "EN" | "SW";
}

export function generateCropPlanningPrompt(
  context: CropPlanningContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Unasaidia kupanga mazao juu ya nafasi na muda.
Unaboresha kwa uwezekano, sio ukamilifu.
Unaheshimu mizunguko ya mvua na mipaka ya ardhi.`
    : `You assist with planning crops over space and time.
You optimize for feasibility, not perfection.
You respect rainfall cycles and land limits.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.plots && context.plots.length > 0) {
    contextInfo += `- Number of Plots: ${context.plots.length}\n`;
    contextInfo += `- Total Farm Size: ${
      context.plots.reduce((sum, p) => sum + p.size_acres, 0)
    } acres\n`;
  }
  if (context.selected_template) {
    contextInfo += `- Template: ${context.selected_template}\n`;
  }
  if (context.season_window) {
    contextInfo += `- Season Window: ${context.season_window}\n`;
  }
  if (context.goal) contextInfo += `- Goal: ${context.goal}\n`;

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Thibitisha nafasi dhidi ya upandaji
- Pendekeza maboresho
- Tambua kupanda kupita kiasi
- Zalisha kazi moja kwa moja`
    : `\n\nRESPONSIBILITIES:
- Validate space vs planting
- Suggest adjustments
- Detect over-planting
- Auto-generate tasks`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "space_utilization": number,
  "warnings": string[],
  "suggested_adjustments": [
    {
      "plot": string,
      "issue": string,
      "recommendation": string
    }
  ],
  "auto_tasks": [
    {
      "task_name": string,
      "target_date": string,
      "plot": string
    }
  ]
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 4. YIELD & REVENUE FORECASTING
 * ============================================================================
 */

export interface YieldRevenueContext {
  crop_plan?: Array<{ crop: string; acres: number }>;
  market_prices?: { [crop: string]: number };
  confidence_preference?: "safe" | "balanced" | "optimistic";
  language: "EN" | "SW";
}

export function generateYieldRevenuePrompt(
  context: YieldRevenueContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Unakadiria matokeo kwa uangalifu.
Daima onyesha kutokuwa na uhakika.
Usiwahi kuahidi mapato.`
    : `You estimate outcomes conservatively.
You always show uncertainty.
You never promise income.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.crop_plan && context.crop_plan.length > 0) {
    contextInfo += `- Crops Planned:\n`;
    context.crop_plan.forEach((c) => {
      contextInfo += `  * ${c.crop}: ${c.acres} acres\n`;
    });
  }
  if (context.market_prices) {
    contextInfo += `- Market Prices:\n`;
    Object.keys(context.market_prices).forEach((crop) => {
      contextInfo += `  * ${crop}: TZS ${context.market_prices![crop]}/kg\n`;
    });
  }
  if (context.confidence_preference) {
    contextInfo += `- Confidence: ${context.confidence_preference}\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Kokotoa kiwango cha mavuno
- Tumia hali za bei
- Eleza dhana`
    : `\n\nRESPONSIBILITIES:
- Calculate yield range
- Apply price scenarios
- Explain assumptions`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "yield_range": {
    "low_kg": number,
    "high_kg": number,
    "most_likely_kg": number
  },
  "revenue_range": {
    "low_tzs": number,
    "high_tzs": number,
    "most_likely_tzs": number
  },
  "key_assumptions": string[],
  "confidence_note": string
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 5. INVENTORY & INPUTS
 * ============================================================================
 */

export interface InventoryContext {
  harvested_amount?: number;
  planned_amount?: number;
  current_stock?: { [item: string]: number };
  language: "EN" | "SW";
}

export function generateInventoryPrompt(context: InventoryContext): string {
  const systemPrompt = context.language === "SW"
    ? `Unasawazisha ukweli na mipango.
Unapunguza hasara.
Usiwahi kuficha upungufu.`
    : `You synchronize reality with plans.
You reduce waste.
You never hide shortages.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.harvested_amount !== undefined) {
    contextInfo += `- Harvested: ${context.harvested_amount} kg\n`;
  }
  if (context.planned_amount !== undefined) {
    contextInfo += `- Planned: ${context.planned_amount} kg\n`;
  }
  if (context.current_stock) {
    contextInfo += `- Current Stock:\n`;
    Object.keys(context.current_stock).forEach((item) => {
      contextInfo += `  * ${item}: ${context.current_stock![item]}\n`;
    });
  }

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "inventory_status": "ok|low|critical",
  "variance_analysis": string,
  "suggested_orders": [
    {
      "item": string,
      "quantity": number,
      "urgency": "low|medium|high",
      "reason": string
    }
  ]
}`;

  return systemPrompt + contextInfo + outputFormat;
}

/**
 * ============================================================================
 * 6. MARKETPLACE & SALES
 * ============================================================================
 */

export interface MarketplaceContext {
  inventory?: Array<{ product: string; quantity: number; quality: string }>;
  price_preferences?: string;
  sales_channels?: string[];
  language: "EN" | "SW";
}

export function generateMarketplacePrompt(
  context: MarketplaceContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Unasaidia wakulima kuuza bila kuchanganyikiwa.
Unaweka kipaumbele imani na uwazi.
Unaunganisha mantiki ya M-Pesa.`
    : `You help farmers sell without confusion.
You prioritize trust and transparency.
You integrate M-Pesa logic.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.inventory && context.inventory.length > 0) {
    contextInfo += `- Available Inventory:\n`;
    context.inventory.forEach((item) => {
      contextInfo += `  * ${item.product}: ${item.quantity} (${item.quality})\n`;
    });
  }
  if (context.price_preferences) {
    contextInfo += `- Price Preference: ${context.price_preferences}\n`;
  }
  if (context.sales_channels && context.sales_channels.length > 0) {
    contextInfo += `- Sales Channels: ${context.sales_channels.join(", ")}\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Pendekeza bei
- Oanisha wanunuzi
- Tabiri mahitaji
- Onesha kupungua kwa bei`
    : `\n\nRESPONSIBILITIES:
- Suggest prices
- Match buyers
- Predict demand
- Flag underpricing`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "recommended_price": {
    "product": string,
    "price_per_kg_tzs": number,
    "rationale": string
  },
  "market_confidence": "low|medium|high",
  "demand_signal": string,
  "buyer_matching": [
    {
      "buyer_type": string,
      "match_score": number,
      "reason": string
    }
  ]
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 7. FINANCE & WALLET
 * ============================================================================
 */

export interface FinanceContext {
  transactions?: Array<{
    date: string;
    type: "income" | "expense";
    amount: number;
    category: string;
  }>;
  wallet_balance?: number;
  pending_payments?: number;
  language: "EN" | "SW";
}

export function generateFinancePrompt(context: FinanceContext): string {
  const systemPrompt = context.language === "SW"
    ? `Unasaidia wakulima kuelewa fedha wazi.
Hakuna lugha ngumu za kifedha.
Hakuna mahesabu yaliyofichwa.`
    : `You help farmers understand money clearly.
No financial jargon.
No hidden calculations.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.wallet_balance !== undefined) {
    contextInfo += `- Wallet Balance: TZS ${context.wallet_balance.toLocaleString()}\n`;
  }
  if (context.pending_payments !== undefined) {
    contextInfo += `- Pending Payments: TZS ${context.pending_payments.toLocaleString()}\n`;
  }
  if (context.transactions && context.transactions.length > 0) {
    const totalIncome = context.transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = context.transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    contextInfo += `- Total Income: TZS ${totalIncome.toLocaleString()}\n`;
    contextInfo += `- Total Expense: TZS ${totalExpense.toLocaleString()}\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Ainisha mapato/matumizi
- Tambua mapengo ya pesa
- Tabiri upungufu`
    : `\n\nRESPONSIBILITIES:
- Categorize income/expenses
- Detect cash gaps
- Predict shortfalls`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "cashflow_status": "healthy|warning|critical",
  "alerts": string[],
  "recommendations": [
    {
      "action": string,
      "impact": string,
      "urgency": "low|medium|high"
    }
  ],
  "simple_summary": string
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 8. LIVESTOCK MANAGEMENT
 * ============================================================================
 */

export interface LivestockContext {
  animal_type?: string;
  symptoms?: string[];
  environment?: string;
  language: "EN" | "SW";
}

export function generateLivestockPrompt(context: LivestockContext): string {
  const systemPrompt = context.language === "SW"
    ? `Unasaidia afya ya mifugo na mipango.
Usiwahi kutoa uchunguzi — tu shauri.
Daima pendekeza daktari mkulima wakati unahitajika.`
    : `You assist livestock health and planning.
You never diagnose — only advise.
Always recommend vet escalation when needed.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.animal_type) contextInfo += `- Animal: ${context.animal_type}\n`;
  if (context.symptoms && context.symptoms.length > 0) {
    contextInfo += `- Symptoms: ${context.symptoms.join(", ")}\n`;
  }
  if (context.environment) {
    contextInfo += `- Environment: ${context.environment}\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Tambua hatari
- Pendekeza hatua
- Pendekeza kuongezeka kwa daktari mkulima`
    : `\n\nRESPONSIBILITIES:
- Identify risk
- Suggest actions
- Recommend vet escalation`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "risk_level": "low|medium|high",
  "recommended_actions": string[],
  "urgent": boolean,
  "vet_needed": boolean,
  "prevention_tips": string[]
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 9. UNIFIED AI ADVISOR (Central Intelligence)
 * ============================================================================
 */

export interface UnifiedAdvisorContext {
  recent_activity?: string[];
  weather?: {
    condition: string;
    temperature: number;
    rainfall: number;
  };
  market_trends?: string[];
  language: "EN" | "SW";
}

export function generateUnifiedAdvisorPrompt(
  context: UnifiedAdvisorContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Wewe ni akili kuu ya KILIMO.
Unaunganisha data katika mazao, hali ya hewa, soko, na fedha.
Unasema wazi, kwa ufupi, na kwa unyenyekevu.`
    : `You are KILIMO's central intelligence.
You connect data across crops, weather, market, and finance.
You speak clearly, briefly, and with humility.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.recent_activity && context.recent_activity.length > 0) {
    contextInfo += `- Recent Activity:\n`;
    context.recent_activity.forEach((activity) => {
      contextInfo += `  * ${activity}\n`;
    });
  }
  if (context.weather) {
    contextInfo += `- Weather: ${context.weather.condition}, ${context.weather.temperature}°C, ${context.weather.rainfall}mm rain\n`;
  }
  if (context.market_trends && context.market_trends.length > 0) {
    contextInfo += `- Market Trends: ${context.market_trends.join(", ")}\n`;
  }

  const responsibilities = context.language === "SW"
    ? `\n\nMAJUKUMU:
- Onyesha maarifa 3 ya juu
- Weka kipaumbele dharura
- Eleza hatua ijayo bora`
    : `\n\nRESPONSIBILITIES:
- Surface top 3 insights
- Prioritize urgency
- Explain next best action`;

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "top_insights": [
    {
      "title": string,
      "description": string,
      "urgency": "low|medium|high"
    }
  ],
  "next_action": {
    "action": string,
    "reason": string,
    "deadline": string
  }
}`;

  return systemPrompt + contextInfo + responsibilities + outputFormat;
}

/**
 * ============================================================================
 * 10. WEATHER-BASED ADVICE
 * ============================================================================
 */

export interface WeatherAdviceContext {
  weather_forecast?: Array<{ date: string; condition: string; rainfall: number }>;
  current_crops?: string[];
  upcoming_tasks?: string[];
  language: "EN" | "SW";
}

export function generateWeatherAdvicePrompt(
  context: WeatherAdviceContext
): string {
  const systemPrompt = context.language === "SW"
    ? `Unatoa ushauri kulingana na hali ya hewa kwa kupanda, umwagiliaji, na ulinzi wa mazao.
Ushauri wako lazima uwe wa vitendo na kutegemea hali ya hewa halisi.`
    : `You provide weather-informed recommendations for planting, irrigation, and crop protection.
Your advice must be practical and based on real weather conditions.`;

  let contextInfo = "\n\nCONTEXT:\n";
  if (context.weather_forecast && context.weather_forecast.length > 0) {
    contextInfo += `- Weather Forecast:\n`;
    context.weather_forecast.forEach((day) => {
      contextInfo += `  * ${day.date}: ${day.condition}, ${day.rainfall}mm rain\n`;
    });
  }
  if (context.current_crops && context.current_crops.length > 0) {
    contextInfo += `- Current Crops: ${context.current_crops.join(", ")}\n`;
  }
  if (context.upcoming_tasks && context.upcoming_tasks.length > 0) {
    contextInfo += `- Upcoming Tasks: ${context.upcoming_tasks.join(", ")}\n`;
  }

  const outputFormat = `\n\nOUTPUT FORMAT (JSON):
{
  "weather_summary": string,
  "immediate_actions": string[],
  "task_adjustments": [
    {
      "task": string,
      "original_date": string,
      "recommended_date": string,
      "reason": string
    }
  ],
  "alerts": string[]
}`;

  return systemPrompt + contextInfo + outputFormat;
}

/**
 * ============================================================================
 * GLOBAL SAFETY RULES (ALL FEATURES)
 * ============================================================================
 */

export const GLOBAL_AI_SAFETY_RULES = {
  en: `\n\nGLOBAL SAFETY RULES:
- No hallucinations - only provide information you're confident about
- Ask when unsure - it's better to clarify than guess
- Never auto-commit changes - always require user confirmation
- Offline-friendly - structure responses so they can be cached
- Always explain your reasoning in simple terms
- Respect Tanzanian farming context and local practices
- Use metric units (kg, hectares, liters)
- Reference M-Pesa for payments when relevant`,
  sw: `\n\nSHERIA ZA USALAMA ZA KIMATAIFA:
- Hakuna kudhania - toa tu habari unazozijua
- Uliza usipofahamu - ni bora kuuliza kuliko kukisia
- Usiwahi kuhifadhi mabadiliko moja kwa moja - daima hitaji idhini ya mtumiaji
- Rafiki ya nje ya mtandao - panga majibu ili yaweze kuhifadhiwa
- Daima eleza sababu yako kwa maneno rahisi
- Heshimu muktadha wa kilimo wa Tanzania na mbinu za ndani
- Tumia vitengo vya kipimo (kg, hekta, lita)
- Rejelea M-Pesa kwa malipo inapohusika`,
};

/**
 * ============================================================================
 * MASTER PROMPT GENERATOR
 * ============================================================================
 */

export interface MasterPromptConfig {
  feature:
    | "crop_intelligence"
    | "farming_templates"
    | "crop_planning"
    | "yield_revenue"
    | "inventory"
    | "marketplace"
    | "finance"
    | "livestock"
    | "unified_advisor"
    | "weather_advice";
  context: any;
  language: "EN" | "SW";
}

export function generateMasterPrompt(config: MasterPromptConfig): string {
  let prompt = "";

  switch (config.feature) {
    case "crop_intelligence":
      prompt = generateCropIntelligencePrompt(config.context);
      break;
    case "farming_templates":
      prompt = generateFarmingTemplatesPrompt(config.context);
      break;
    case "crop_planning":
      prompt = generateCropPlanningPrompt(config.context);
      break;
    case "yield_revenue":
      prompt = generateYieldRevenuePrompt(config.context);
      break;
    case "inventory":
      prompt = generateInventoryPrompt(config.context);
      break;
    case "marketplace":
      prompt = generateMarketplacePrompt(config.context);
      break;
    case "finance":
      prompt = generateFinancePrompt(config.context);
      break;
    case "livestock":
      prompt = generateLivestockPrompt(config.context);
      break;
    case "unified_advisor":
      prompt = generateUnifiedAdvisorPrompt(config.context);
      break;
    case "weather_advice":
      prompt = generateWeatherAdvicePrompt(config.context);
      break;
    default:
      throw new Error(`Unknown feature: ${config.feature}`);
  }

  // Append global safety rules
  prompt += GLOBAL_AI_SAFETY_RULES[config.language.toLowerCase() as "en" | "sw"];

  return prompt;
}

/**
 * ============================================================================
 * EXPORT ALL PROMPT GENERATORS
 * ============================================================================
 */

export default {
  generateCropIntelligencePrompt,
  generateFarmingTemplatesPrompt,
  generateCropPlanningPrompt,
  generateYieldRevenuePrompt,
  generateInventoryPrompt,
  generateMarketplacePrompt,
  generateFinancePrompt,
  generateLivestockPrompt,
  generateUnifiedAdvisorPrompt,
  generateWeatherAdvicePrompt,
  generateMasterPrompt,
  GLOBAL_AI_SAFETY_RULES,
};
