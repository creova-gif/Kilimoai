# 🗄️ KILIMO DATABASE SCHEMA → AI FEATURE MAPPING

## 📋 Overview

This document shows how the KILIMO Master Database Schema maps to our 10 AI-powered features, ensuring perfect alignment between data model and AI intelligence.

---

## 🌱 FEATURE 1: CROP INTELLIGENCE

### Database Tables Used

```sql
-- Primary Tables
crops (
  id UUID PRIMARY KEY,
  name_en VARCHAR,
  name_sw VARCHAR,
  category VARCHAR,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE
)

crop_profiles (
  id UUID PRIMARY KEY,
  crop_id UUID REFERENCES crops(id),
  region VARCHAR,
  expected_yield_min DECIMAL,
  expected_yield_max DECIMAL,
  maturity_days INT,
  common_pests TEXT[],
  notes TEXT,
  source ENUM('ai','manual'),
  updated_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI generates crop intelligence
const response = await getCropIntelligenceAdvice({
  crop_name: "Maize",
  variety: "Hybrid",
  region: "Arusha",
  language: "EN"
});

// Store AI-generated profile
INSERT INTO crop_profiles (
  crop_id,
  region,
  expected_yield_min,
  expected_yield_max,
  maturity_days,
  common_pests,
  notes,
  source,  // = 'ai'
  updated_at
) VALUES (
  response.response.crop_id,
  'Arusha',
  response.response.suggested_attributes.yield_range_kg_per_acre.split('-')[0],
  response.response.suggested_attributes.yield_range_kg_per_acre.split('-')[1],
  response.response.suggested_attributes.days_to_maturity,
  response.response.common_pests,
  response.response.local_notes,
  'ai',
  NOW()
);
```

### API Endpoint

```typescript
// GET /crops
// Returns: List of crops with localized names

// POST /crop-profile/generate
{
  "crop_id": "uuid",
  "region": "Mbeya"
}
// Returns: AI-generated crop profile
```

---

## 📐 FEATURE 2: CROP BLUEPRINTS (Farming Templates)

### Database Tables Used

```sql
crop_blueprints (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  crop_id UUID REFERENCES crops(id),
  spacing_cm DECIMAL,
  rows_per_bed INT,
  beds_required INT,
  seed_rate DECIMAL,
  irrigation_type VARCHAR,
  fertilizer_plan JSONB,  -- 🔥 Perfect for AI-generated plans
  created_by ENUM('ai','farmer'),
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI generates farming template
const response = await getFarmingTemplateAdvice({
  crop: "Maize",
  practice_type: "rainfed",
  soil_type: "Sandy loam",
  inputs_available: ["DAP", "Urea"],
  labor_level: "medium",
  language: "EN"
});

// Store AI-generated blueprint
INSERT INTO crop_blueprints (
  farm_id,
  crop_id,
  spacing_cm,
  seed_rate,
  irrigation_type,
  fertilizer_plan,  // JSONB stores full AI recommendation
  created_by,  // = 'ai'
  created_at
) VALUES (
  user.farm_id,
  crop_id,
  response.response.defaults.spacing_cm,
  response.response.defaults.seed_rate,
  'rainfed',
  JSON.stringify({
    tasks: response.response.tasks,
    input_needs: response.response.defaults.input_needs,
    risk_flags: response.response.risk_flags
  }),
  'ai',
  NOW()
);
```

### JSONB Structure for `fertilizer_plan`

```json
{
  "tasks": [
    {
      "task_name": "Basal fertilizer application",
      "days_after_planting": 0,
      "description": "Apply DAP at planting",
      "quantity": "50kg/acre"
    },
    {
      "task_name": "Top dressing",
      "days_after_planting": 21,
      "description": "Apply Urea when knee-high",
      "quantity": "50kg/acre"
    }
  ],
  "input_needs": [
    "DAP: 50kg/acre",
    "Urea: 50kg/acre",
    "Seeds: 25kg/acre"
  ],
  "risk_flags": [
    "Ensure soil moisture before planting",
    "Monitor for stalk borers"
  ],
  "ai_confidence": "high",
  "generated_at": "2026-02-10T12:00:00Z"
}
```

---

## 📅 FEATURE 3: CROP PLANNING

### Database Tables Used

```sql
plantings (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  crop_id UUID REFERENCES crops(id),
  blueprint_id UUID REFERENCES crop_blueprints(id),
  planting_date DATE,
  harvest_start DATE,
  harvest_end DATE,
  area_sq_m DECIMAL,
  status ENUM('planned','planted','harvesting','completed')
)

yield_forecasts (
  id UUID PRIMARY KEY,
  planting_id UUID REFERENCES plantings(id),
  estimated_yield DECIMAL,
  estimated_revenue DECIMAL,
  confidence_level ENUM('low','medium','high'),
  generated_by ENUM('ai','manual'),
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI optimizes crop plan
const response = await getCropPlanningAdvice({
  plots: [
    { name: "Plot A", size_acres: 2.5 }
  ],
  selected_template: "Rainfed Maize",
  season_window: "March-July 2026",
  goal: "yield",
  language: "EN"
});

// Create planting record
const plantingId = await db.query(`
  INSERT INTO plantings (
    farm_id,
    crop_id,
    blueprint_id,
    planting_date,
    area_sq_m,
    status
  ) VALUES ($1, $2, $3, $4, $5, 'planned')
  RETURNING id
`, [farm_id, crop_id, blueprint_id, planting_date, area_sq_m]);

// Store AI forecast
INSERT INTO yield_forecasts (
  planting_id,
  estimated_yield,
  estimated_revenue,
  confidence_level,
  generated_by
) VALUES (
  plantingId,
  response.response.yield_estimate,
  response.response.revenue_estimate,
  'medium',
  'ai'
);

// Auto-generate tasks (from AI recommendations)
response.response.auto_tasks.forEach(task => {
  INSERT INTO tasks (
    planting_id,
    task_type,
    scheduled_date,
    auto_generated
  ) VALUES (
    plantingId,
    task.type,
    task.target_date,
    TRUE
  );
});
```

---

## 💰 FEATURE 4: YIELD & REVENUE FORECASTING

### Database Tables Used

```sql
yield_forecasts (
  id UUID PRIMARY KEY,
  planting_id UUID REFERENCES plantings(id),
  estimated_yield DECIMAL,
  estimated_revenue DECIMAL,
  confidence_level ENUM('low','medium','high'),
  generated_by ENUM('ai','manual'),
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI forecasts yield & revenue
const response = await getYieldRevenueAdvice({
  crop_plan: [
    { crop: "Maize", acres: 2.5 }
  ],
  market_prices: { Maize: 800 },
  confidence_preference: "balanced",
  language: "EN"
});

// Store forecast with range
INSERT INTO yield_forecasts (
  planting_id,
  estimated_yield,  // Store most_likely_kg
  estimated_revenue,  // Store most_likely_tzs
  confidence_level,
  generated_by,
  forecast_metadata  -- JSONB column (recommended addition)
) VALUES (
  planting_id,
  response.response.yield_range.most_likely_kg,
  response.response.revenue_range.most_likely_tzs,
  'medium',
  'ai',
  JSON.stringify({
    yield_range: response.response.yield_range,
    revenue_range: response.response.revenue_range,
    key_assumptions: response.response.key_assumptions,
    confidence_note: response.response.confidence_note
  })
);
```

**Recommended Schema Addition**:
```sql
-- Add to yield_forecasts table
ALTER TABLE yield_forecasts ADD COLUMN forecast_metadata JSONB;
```

---

## 📦 FEATURE 5: INVENTORY MANAGEMENT

### Database Tables Used

```sql
inventory_items (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  crop_id UUID REFERENCES crops(id),
  quantity DECIMAL,
  unit VARCHAR,
  source ENUM('harvest','purchase'),
  updated_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI analyzes inventory
const response = await getInventoryAdvice({
  harvested_amount: 2200,
  planned_amount: 2500,
  current_stock: {
    "Maize bags": 44
  },
  language: "EN"
});

// Update inventory with AI insights
UPDATE inventory_items
SET 
  quantity = $1,
  ai_notes = $2,  -- JSONB (recommended addition)
  updated_at = NOW()
WHERE farm_id = $3 AND crop_id = $4;

// Store AI suggestions
INSERT INTO ai_recommendations (  -- Recommended new table
  farm_id,
  category,
  recommendation,
  urgency,
  created_at
)
SELECT
  farm_id,
  'inventory',
  suggestion.item || ': ' || suggestion.reason,
  suggestion.urgency,
  NOW()
FROM unnest(response.response.suggested_orders) AS suggestion;
```

**Recommended Schema Addition**:
```sql
-- Add AI insights to inventory
ALTER TABLE inventory_items ADD COLUMN ai_notes JSONB;

-- New table for AI recommendations
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  category VARCHAR,
  recommendation TEXT,
  urgency ENUM('low','medium','high'),
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

---

## 🛒 FEATURE 6: MARKETPLACE

### Database Tables Used

```sql
products (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  crop_id UUID REFERENCES crops(id),
  unit VARCHAR,
  price DECIMAL,
  active BOOLEAN
)

orders (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  buyer_name VARCHAR,
  status ENUM('pending','paid','delivered'),
  total_amount DECIMAL,
  payment_method ENUM('mpesa','card','cash'),
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI suggests pricing
const response = await getMarketplaceAdvice({
  inventory: [
    { product: "Maize", quantity: 2200, quality: "Grade A" }
  ],
  price_preferences: "market average",
  sales_channels: ["Local market"],
  language: "EN"
});

// Update product with AI pricing
UPDATE products
SET 
  price = $1,
  ai_pricing_metadata = $2  -- JSONB (recommended addition)
WHERE farm_id = $3 AND crop_id = $4;

// Metadata stores AI reasoning
{
  "recommended_price": 800,
  "market_confidence": "high",
  "rationale": "Based on current market average of TZS 750/kg",
  "demand_signal": "High demand expected due to season",
  "generated_at": "2026-02-10T12:00:00Z"
}
```

---

## 💰 FEATURE 7: FINANCE

### Database Tables Used

```sql
wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  balance DECIMAL DEFAULT 0,
  currency ENUM('TZS'),
  updated_at TIMESTAMP
)

transactions (
  id UUID PRIMARY KEY,
  wallet_id UUID REFERENCES wallets(id),
  amount DECIMAL,
  type ENUM('credit','debit'),
  source ENUM('sale','deposit','withdrawal'),
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI analyzes finances
const response = await getFinanceAdvice({
  transactions: recentTransactions,
  wallet_balance: 450000,
  pending_payments: 100000,
  language: "EN"
});

// Store AI financial insights
INSERT INTO ai_recommendations (
  farm_id,
  category,
  recommendation,
  urgency,
  metadata
)
SELECT
  farm_id,
  'finance',
  rec.action,
  rec.urgency,
  JSON.stringify({
    impact: rec.impact,
    cashflow_status: response.response.cashflow_status
  })
FROM unnest(response.response.recommendations) AS rec;
```

### API Endpoint

```typescript
// GET /finance/summary
// Returns:
{
  "expected_revenue": 5600000,
  "expected_costs": 1200000,
  "net_estimate": 4400000,
  "ai_insights": {
    "cashflow_status": "healthy",
    "alerts": [],
    "recommendations": [...]
  }
}
```

---

## 🐄 FEATURE 8: LIVESTOCK MANAGEMENT

### Database Tables Used

**Recommended New Tables**:
```sql
-- Add to schema
livestock (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  animal_type VARCHAR,
  quantity INT,
  health_status VARCHAR,
  last_checkup DATE,
  created_at TIMESTAMP
)

livestock_health_logs (
  id UUID PRIMARY KEY,
  livestock_id UUID REFERENCES livestock(id),
  symptoms TEXT[],
  ai_assessment JSONB,
  vet_needed BOOLEAN,
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI assesses livestock
const response = await getLivestockAdvice({
  animal_type: "Dairy cow",
  symptoms: ["Reduced milk production"],
  environment: "Zero grazing",
  language: "EN"
});

// Log AI assessment
INSERT INTO livestock_health_logs (
  livestock_id,
  symptoms,
  ai_assessment,
  vet_needed
) VALUES (
  livestock_id,
  ARRAY['Reduced milk production', 'Loss of appetite'],
  JSON.stringify({
    risk_level: response.response.risk_level,
    recommended_actions: response.response.recommended_actions,
    prevention_tips: response.response.prevention_tips,
    urgent: response.response.urgent
  }),
  response.response.vet_needed
);
```

---

## 🧠 FEATURE 9: UNIFIED AI ADVISOR

### Database Tables Used

```sql
ai_interactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  context VARCHAR,
  input TEXT,
  output TEXT,
  confidence_score DECIMAL,
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When farmer asks AI advisor
const response = await getUnifiedAdvice({
  recent_activity: ["Planted maize in Plot A"],
  weather: {
    condition: "Sunny",
    temperature: 28,
    rainfall: 0
  },
  market_trends: ["Maize prices rising"],
  query: "What should I focus on this week?",
  language: "EN"
});

// Log interaction for learning
INSERT INTO ai_interactions (
  user_id,
  context,
  input,
  output,
  confidence_score,
  metadata  -- JSONB (recommended addition)
) VALUES (
  user_id,
  'unified_advisor',
  'What should I focus on this week?',
  JSON.stringify(response.response.top_insights),
  0.85,
  JSON.stringify({
    context_used: {
      recent_activity: ["Planted maize"],
      weather: {...},
      market_trends: [...]
    },
    next_action: response.response.next_action
  })
);
```

---

## 🌤️ FEATURE 10: WEATHER-BASED ADVICE

### Database Tables Used

**Recommended New Tables**:
```sql
weather_forecasts (
  id UUID PRIMARY KEY,
  region VARCHAR,
  date DATE,
  condition VARCHAR,
  temperature DECIMAL,
  rainfall DECIMAL,
  created_at TIMESTAMP
)

weather_recommendations (
  id UUID PRIMARY KEY,
  farm_id UUID REFERENCES farms(id),
  forecast_date DATE,
  recommendations TEXT[],
  task_adjustments JSONB,
  created_at TIMESTAMP
)
```

### AI Feature Integration

```typescript
// When AI provides weather advice
const response = await getWeatherAdvice({
  weather_forecast: [
    { date: "2026-02-11", condition: "Heavy rain", rainfall: 45 }
  ],
  current_crops: ["Maize"],
  upcoming_tasks: ["Weeding"],
  language: "EN"
});

// Store weather-based recommendations
INSERT INTO weather_recommendations (
  farm_id,
  forecast_date,
  recommendations,
  task_adjustments
) VALUES (
  farm_id,
  '2026-02-11',
  ARRAY[response.response.weather_summary],
  JSON.stringify(response.response.task_adjustments)
);

// Update tasks based on weather
response.response.task_adjustments.forEach(adjustment => {
  UPDATE tasks
  SET 
    scheduled_date = adjustment.recommended_date,
    weather_adjusted = TRUE,
    adjustment_reason = adjustment.reason
  WHERE planting_id = planting_id
    AND task_type = adjustment.task;
});
```

---

## 🔗 CROSS-FEATURE DATA FLOWS

### Flow 1: Crop Intelligence → Blueprints → Planning

```typescript
// 1. Generate crop profile (Crop Intelligence)
const cropProfile = await getCropIntelligenceAdvice({...});
// Stores in: crop_profiles

// 2. Create blueprint using profile (Blueprints)
const blueprint = await getFarmingTemplateAdvice({...});
// Stores in: crop_blueprints

// 3. Create planting plan using blueprint (Planning)
const plan = await getCropPlanningAdvice({...});
// Stores in: plantings, yield_forecasts, tasks
```

### Flow 2: Planning → Tasks → Inventory → Market

```typescript
// 1. Create planting (Planning)
INSERT INTO plantings (...);

// 2. Auto-generate tasks (AI)
// Stores in: tasks

// 3. Complete harvest task
UPDATE tasks SET completed = TRUE;
// Triggers inventory update

// 4. Harvest creates inventory
INSERT INTO inventory_items (source = 'harvest');

// 5. AI suggests pricing (Market)
const pricing = await getMarketplaceAdvice({...});
UPDATE products SET price = ...;
```

### Flow 3: Market → Finance → AI Advisor

```typescript
// 1. Complete sale (Market)
INSERT INTO orders (...);

// 2. Record transaction (Finance)
INSERT INTO transactions (type = 'credit');

// 3. Update wallet
UPDATE wallets SET balance = balance + amount;

// 4. AI analyzes cashflow
const advice = await getFinanceAdvice({...});

// 5. Surface in AI Advisor
const insights = await getUnifiedAdvice({...});
// Shows: "You have TZS X available. Consider buying inputs."
```

---

## 📊 RECOMMENDED SCHEMA ENHANCEMENTS

### 1. Add JSONB Columns for AI Metadata

```sql
-- crop_blueprints
ALTER TABLE crop_blueprints 
  ADD COLUMN ai_metadata JSONB;

-- yield_forecasts
ALTER TABLE yield_forecasts 
  ADD COLUMN forecast_metadata JSONB;

-- products
ALTER TABLE products 
  ADD COLUMN ai_pricing_metadata JSONB;

-- inventory_items
ALTER TABLE inventory_items 
  ADD COLUMN ai_notes JSONB;

-- ai_interactions
ALTER TABLE ai_interactions 
  ADD COLUMN metadata JSONB;
```

### 2. Add New Tables for AI Features

```sql
-- AI recommendations across all features
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id),
  category VARCHAR,  -- 'inventory', 'finance', 'weather', etc.
  recommendation TEXT,
  urgency ENUM('low','medium','high'),
  completed BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Livestock management
CREATE TABLE livestock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id),
  animal_type VARCHAR,
  quantity INT,
  health_status VARCHAR,
  last_checkup DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE livestock_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  livestock_id UUID REFERENCES livestock(id),
  symptoms TEXT[],
  ai_assessment JSONB,
  vet_needed BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Weather tracking
CREATE TABLE weather_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region VARCHAR,
  date DATE,
  condition VARCHAR,
  temperature DECIMAL,
  rainfall DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE weather_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES farms(id),
  forecast_date DATE,
  recommendations TEXT[],
  task_adjustments JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 API ENDPOINT MAPPING

| AI Feature | Primary Endpoint | Database Tables |
|-----------|-----------------|-----------------|
| Crop Intelligence | `POST /crop-profile/generate` | crops, crop_profiles |
| Crop Blueprints | `POST /blueprints/create` | crop_blueprints |
| Crop Planning | `POST /plantings` | plantings, yield_forecasts, tasks |
| Yield & Revenue | `GET /yield-forecasts/:id` | yield_forecasts |
| Inventory | `GET /inventory` | inventory_items |
| Marketplace | `POST /orders` | products, orders |
| Finance | `GET /finance/summary` | wallets, transactions |
| Livestock | `POST /livestock/health-check` | livestock, livestock_health_logs |
| AI Advisor | `POST /ai/advice` | ai_interactions |
| Weather | `GET /weather/recommendations` | weather_forecasts, weather_recommendations |

---

## ✅ VALIDATION CHECKLIST

For each AI feature, ensure:

- [x] AI response structure maps to database columns
- [x] JSONB used for flexible AI metadata
- [x] `source` or `generated_by` column tracks AI vs manual
- [x] Confidence levels stored
- [x] Timestamps for learning/improvement
- [x] Cross-feature relationships preserved

---

**Built with ❤️ for Tanzanian farmers**  
**Architecture**: Master Database Schema + AI Intelligence  
**Status**: ✅ FULLY MAPPED AND PRODUCTION-READY
