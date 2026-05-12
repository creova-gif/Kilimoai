# AI Architecture Master Guide - KILIMO Agri-AI Suite

**Date:** January 20, 2026  
**Status:** 🎯 PRODUCTION ARCHITECTURE  
**Purpose:** Transform AI from chatbot to controlled system  

---

## 🎯 CORE PRINCIPLE

**AI IS NOT A CHATBOT — IT IS A CONTROLLED SYSTEM**

### **What This Means:**

❌ **NOT This (Chatbot):**
```
User: "Help me plan my crops"
AI: "Sure! I'd be happy to help you plan your crops. What would you like to grow?"
User: "Maize"
AI: "Great choice! Maize is a wonderful crop..."
```

✅ **THIS (Controlled System):**
```
Button Click: CREATE_CROP_PLAN
AI Returns: {"seed_variety": "UH6303", "planting_window": "Mar 15-30", ...}
UI Renders: Structured cards with exact data
```

---

## 1️⃣ GLOBAL SYSTEM PROMPT (USE ON EVERY AI CALL)

### **The Master Prompt:**

```
You are an AI system embedded inside an agricultural management application.

STRICT RULES:
1. You must respond ONLY in valid JSON.
2. You must NEVER mix languages.
3. You must follow the global_language variable exactly.
4. You must NEVER invent UI actions or buttons.
5. You must only respond to the action_type provided.
6. All responses must be deterministic and renderable in UI.
7. Mobile and web behavior must be identical.
8. If required data is missing, return an error object instead of guessing.

GLOBAL STATE:
- global_language: {{LANGUAGE}}  // "en" or "sw"
- device_type: {{DEVICE}}        // "web" or "mobile"
- screen_id: {{SCREEN_ID}}
- user_role: {{ROLE}}

If global_language = "en", output 100% English.
If global_language = "sw", output 100% Swahili.
```

### **Implementation:**

**File:** `/supabase/functions/server/ai_services.tsx`

```typescript
const GLOBAL_SYSTEM_PROMPT = `
You are an AI system embedded inside an agricultural management application.

STRICT RULES:
1. You must respond ONLY in valid JSON.
2. You must NEVER mix languages.
3. You must follow the global_language variable exactly.
4. You must NEVER invent UI actions or buttons.
5. You must only respond to the action_type provided.
6. All responses must be deterministic and renderable in UI.
7. Mobile and web behavior must be identical.
8. If required data is missing, return an error object instead of guessing.

GLOBAL STATE:
- global_language: {LANGUAGE}
- device_type: {DEVICE}
- screen_id: {SCREEN_ID}
- user_role: {ROLE}

If global_language = "en", output 100% English.
If global_language = "sw", output 100% Swahili.
`;

export async function executeAIAction(c: Context) {
  const { action_type, input_data, global_language, device_type, screen_id, user_role } = await c.req.json();
  
  const systemPrompt = GLOBAL_SYSTEM_PROMPT
    .replace('{LANGUAGE}', global_language)
    .replace('{DEVICE}', device_type)
    .replace('{SCREEN_ID}', screen_id)
    .replace('{ROLE}', user_role);
  
  // Continue with AI call...
}
```

---

## 2️⃣ BUTTON-LEVEL PROMPT ENGINEERING

### **Every Button = One Action Type**

**Principle:** Every button must send a clear, unambiguous `action_type`

### **Example: Create New Crop Plan Button**

**Frontend Code:**
```typescript
const handleCreateCropPlan = async () => {
  const response = await fetch(`${API_BASE}/api/ai/action`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action_type: "CREATE_CROP_PLAN",
      screen_id: "crop_planning",
      input_data: {
        crop: "Maize",
        field: "Block B",
        season: "Masika 2025",
        soil: {
          ph: 5.8,
          nitrogen: "low",
          phosphorus: "medium",
          potassium: "low"
        }
      },
      global_language: language, // "en" or "sw"
      device_type: isMobile ? "mobile" : "web",
      user_role: currentUser.role
    })
  });
  
  const result = await response.json();
  // Render UI from result.ui_updates
};
```

### **AI Prompt Template:**

```
ACTION: {{action_type}}

TASK:
Return a UI-safe JSON response for this action.

REQUIRED OUTPUT FORMAT:
{
  "status": "success" | "error",
  "ui_updates": {
    "cards": [],
    "tables": [],
    "calendar_events": []
  },
  "data_to_store": {},
  "next_allowed_actions": []
}
```

### **AI Response Example:**

```json
{
  "status": "success",
  "ui_updates": {
    "cards": [
      {
        "title": "Recommended Seed",
        "value": "UH6303",
        "confidence": "High"
      },
      {
        "title": "Planting Window",
        "value": "15 Mar – 30 Mar"
      },
      {
        "title": "Expected Yield",
        "value": "4500-5500 kg/ha"
      }
    ],
    "calendar_events": [
      {
        "event": "Planting",
        "start": "2025-03-15",
        "end": "2025-03-30",
        "type": "planting"
      },
      {
        "event": "Fertilizer Application",
        "start": "2025-04-15",
        "type": "fertilization"
      }
    ]
  },
  "data_to_store": {
    "crop_plan_id": "uuid-generated",
    "seed_variety": "UH6303",
    "yield_forecast_min": 4200,
    "yield_forecast_max": 5500,
    "planting_window": "2025-03-15 to 2025-03-30"
  },
  "next_allowed_actions": [
    "OPTIMIZE_CROP_PLAN",
    "VIEW_YIELD_FORECAST",
    "SAVE_CROP_PLAN",
    "VIEW_COST_BREAKDOWN"
  ]
}
```

### **Frontend Rendering:**

```typescript
// Render cards
result.ui_updates.cards.map(card => (
  <Card>
    <CardTitle>{card.title}</CardTitle>
    <CardContent>{card.value}</CardContent>
  </Card>
));

// Render calendar events
result.ui_updates.calendar_events.map(event => (
  <CalendarEvent
    title={event.event}
    start={event.start}
    end={event.end}
    type={event.type}
  />
));

// Show only allowed next actions
<div>
  {result.next_allowed_actions.map(action => (
    <Button onClick={() => handleAction(action)}>
      {getActionLabel(action)}
    </Button>
  ))}
</div>
```

**Result:**
- ✅ No hallucinated UI
- ✅ Buttons only show allowed actions
- ✅ Works identically on web & mobile

---

## 3️⃣ ACTION TYPE MAPPING (ALL BUTTONS)

### **Complete Action Type Registry:**

| Button Text | Action Type | Screen | Response Schema |
|-------------|-------------|--------|-----------------|
| Create New Crop Plan | `CREATE_CROP_PLAN` | crop_planning | CropPlanResponse |
| Optimize Plan | `OPTIMIZE_CROP_PLAN` | crop_planning | OptimizationResponse |
| View History | `VIEW_CROP_HISTORY` | crop_planning | HistoryResponse |
| Generate Forecast | `GENERATE_YIELD_FORECAST` | crop_planning | ForecastResponse |
| Analyze Soil | `ANALYZE_SOIL_DATA` | soil_testing | SoilAnalysisResponse |
| Get Market Price | `GET_MARKET_PRICE` | marketplace | MarketPriceResponse |
| Weather Alert | `WEATHER_ALERT_TRIGGER` | weather | WeatherAlertResponse |
| AI Chat Message | `CHAT_MESSAGE` | ai_support | ChatResponse |
| Diagnose Crop | `DIAGNOSE_CROP_IMAGE` | photo_diagnosis | DiagnosisResponse |

### **Response Schema Definitions:**

**CropPlanResponse:**
```typescript
interface CropPlanResponse {
  status: "success" | "error";
  ui_updates: {
    cards: Array<{
      title: string;
      value: string;
      confidence?: "Low" | "Medium" | "High";
    }>;
    calendar_events: Array<{
      event: string;
      start: string;
      end?: string;
      type: "planting" | "fertilization" | "irrigation" | "harvest";
    }>;
    risks?: Array<{
      risk: string;
      severity: "Low" | "Medium" | "High";
    }>;
  };
  data_to_store: {
    crop_plan_id: string;
    seed_variety: string;
    yield_forecast_min: number;
    yield_forecast_max: number;
    planting_window: string;
    estimated_costs: {
      seeds: number;
      fertilizer: number;
      labor: number;
      total: number;
    };
  };
  next_allowed_actions: Array<
    "OPTIMIZE_CROP_PLAN" | 
    "VIEW_YIELD_FORECAST" | 
    "SAVE_CROP_PLAN" |
    "VIEW_COST_BREAKDOWN"
  >;
}
```

---

## 4️⃣ FIXING LANGUAGE MIXING (CRITICAL)

### **Problem:**
```
AI sees: "Crop Planning & Mipango ya Mazao"
AI outputs: Mixed English/Swahili
UI displays: Confusing hybrid text
```

### **Solution: Global Language State**

**Database Schema:**

```sql
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  global_language VARCHAR(2) CHECK (global_language IN ('en', 'sw')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_language ON user_preferences(user_id, global_language);
```

**Implementation:**

**1. App.tsx - Load language on startup:**

```typescript
const [globalLanguage, setGlobalLanguage] = useState<"en" | "sw">("en");

useEffect(() => {
  loadUserLanguagePreference();
}, [currentUser]);

const loadUserLanguagePreference = async () => {
  if (!currentUser) return;
  
  try {
    const response = await fetch(`${API_BASE}/user/language`, {
      headers: { "Authorization": `Bearer ${publicAnonKey}` }
    });
    const data = await response.json();
    setGlobalLanguage(data.language || "en");
  } catch (error) {
    console.error("Failed to load language:", error);
  }
};

const saveLanguagePreference = async (newLanguage: "en" | "sw") => {
  setGlobalLanguage(newLanguage);
  
  await fetch(`${API_BASE}/user/language`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ language: newLanguage })
  });
};
```

**2. Pass to ALL AI calls:**

```typescript
const callAI = async (actionType: string, inputData: any) => {
  return fetch(`${API_BASE}/api/ai/action`, {
    method: "POST",
    body: JSON.stringify({
      action_type: actionType,
      input_data: inputData,
      global_language: globalLanguage,  // ✅ Always passed
      device_type: isMobile ? "mobile" : "web",
      user_role: currentUser.role
    })
  });
};
```

**3. Language Enforcement Prompt:**

```
LANGUAGE RULE:
If global_language = "en":
- Output English ONLY
- Do not include Swahili anywhere
- All field names, values, and labels must be in English

If global_language = "sw":
- Output Swahili ONLY
- Do not include English anywhere
- All field names, values, and labels must be in Swahili

Violation = critical error.
```

**4. AI Error Response if Violated:**

```json
{
  "status": "error",
  "error_code": "LANGUAGE_CONFLICT",
  "message": "Language mismatch detected. Please retry.",
  "details": {
    "expected_language": "en",
    "detected_mixed_output": true
  }
}
```

### **Language Toggle UI:**

```typescript
<div className="flex items-center gap-2">
  <Button
    variant={globalLanguage === "en" ? "default" : "outline"}
    onClick={() => saveLanguagePreference("en")}
  >
    English
  </Button>
  <Button
    variant={globalLanguage === "sw" ? "default" : "outline"}
    onClick={() => saveLanguagePreference("sw")}
  >
    Swahili
  </Button>
</div>
```

**Result:**
- ✅ ONE source of truth for language
- ✅ No mixed output ever
- ✅ Persists across sessions
- ✅ Works on all screens

---

## 5️⃣ WEB ↔ MOBILE SEAMLESS BEHAVIOR

### **Principle:**

**AI does NOT care about layout — only content structure**

### **Implementation:**

**AI Prompt Rule:**

```
UI RULES:
- Do NOT include layout, width, or positioning
- Return only content objects (cards, tables, lists)
- Mobile and web must render the same data
- Frontend handles responsive layout

EXAMPLE OUTPUT:
{
  "cards": [
    {"title": "Seed Variety", "value": "UH6303"}  // ✅ No layout info
  ]
}

NOT THIS:
{
  "cards": [
    {"title": "Seed Variety", "value": "UH6303", "width": "300px"}  // ❌ Layout included
  ]
}
```

**Frontend Rendering:**

```typescript
// Same JSON schema
const renderCard = (card: Card) => {
  if (isMobile) {
    return (
      <div className="w-full p-4">  {/* Mobile: Full width */}
        <h3>{card.title}</h3>
        <p>{card.value}</p>
      </div>
    );
  } else {
    return (
      <div className="w-1/3 p-6">  {/* Desktop: 3-column grid */}
        <h3>{card.title}</h3>
        <p>{card.value}</p>
      </div>
    );
  }
};
```

**Result:**
- ✅ AI returns same JSON for mobile and web
- ✅ Frontend handles layout responsively
- ✅ No duplicate AI logic needed

---

## 6️⃣ AI-SAFE SCREEN STATES

### **Principle:**

Each screen declares its allowed actions to prevent broken flows.

### **Screen State Definition:**

```typescript
interface ScreenState {
  screen_id: string;
  allowed_actions: string[];
  current_context?: any;
}

const SCREEN_STATES: Record<string, ScreenState> = {
  crop_plan_detail: {
    screen_id: "crop_plan_detail",
    allowed_actions: [
      "OPTIMIZE_CROP_PLAN",
      "VIEW_HISTORY",
      "UPDATE_SOIL_DATA",
      "GENERATE_YIELD_FORECAST"
    ]
  },
  crop_plan_history: {
    screen_id: "crop_plan_history",
    allowed_actions: [
      "COMPARE_SEASONS",
      "VIEW_PERFORMANCE_TRENDS",
      "EXPORT_REPORT"
    ]
  },
  marketplace: {
    screen_id: "marketplace",
    allowed_actions: [
      "GET_MARKET_PRICE",
      "VIEW_PRICE_TRENDS",
      "SET_PRICE_ALERT"
    ]
  }
};
```

### **Backend Validation:**

```typescript
export async function executeAIAction(c: Context) {
  const { action_type, screen_id } = await c.req.json();
  
  const screenState = SCREEN_STATES[screen_id];
  
  if (!screenState) {
    return c.json({
      status: "error",
      error_code: "INVALID_SCREEN",
      message: "Screen not recognized"
    }, 400);
  }
  
  if (!screenState.allowed_actions.includes(action_type)) {
    return c.json({
      status: "error",
      error_code: "ACTION_NOT_ALLOWED",
      message: `Action ${action_type} not allowed on screen ${screen_id}`,
      allowed_actions: screenState.allowed_actions
    }, 400);
  }
  
  // Proceed with AI call...
}
```

**Result:**
- ✅ Users can't trigger invalid actions
- ✅ AI stays within defined boundaries
- ✅ Deterministic, predictable behavior

---

## 7️⃣ FIGMA AI SETUP

### **Master Figma AI Prompt:**

```
Design a crop planning and management screen.

Rules:
- Web and mobile layouts must share identical component structure
- Use auto layout only
- All buttons must map to a single action_type
- Do not mix English and Swahili
- Language is controlled by a global toggle
- AI output is rendered from JSON only

Components to include:
- Header with language toggle
- Action buttons (Create, Optimize, View History)
- Cards for displaying AI recommendations
- Calendar view for planting schedule
- Empty states with clear CTAs

Design System:
- Primary: Green (#16a34a)
- Spacing: 16px base unit
- Border radius: 12px
- Shadows: subtle, layered
```

### **Component Variants:**

**Web Variant:**
- 3-column grid for cards
- Sidebar navigation
- Full calendar month view

**Mobile Variant:**
- Single column stack
- Bottom navigation
- Calendar agenda view

**Both Use Same Data:**
```json
{
  "cards": [...],
  "calendar_events": [...]
}
```

---

## 8️⃣ IMPLEMENTATION ROADMAP

### **Phase 1: Foundation (Week 1)**

**Tasks:**
1. ✅ Create global system prompt
2. ✅ Set up user_preferences table for language
3. ✅ Implement language toggle in App.tsx
4. ✅ Create action type registry
5. ✅ Define response schemas

**Deliverables:**
- Global language state working
- All buttons mapped to action types
- Response schemas documented

---

### **Phase 2: Core Actions (Week 2)**

**Tasks:**
1. ✅ Implement CREATE_CROP_PLAN action
2. ✅ Implement OPTIMIZE_CROP_PLAN action
3. ✅ Implement VIEW_CROP_HISTORY action
4. ✅ Implement GENERATE_YIELD_FORECAST action
5. ✅ Test all actions on web & mobile

**Deliverables:**
- All crop planning actions working
- Identical behavior on web/mobile
- No language mixing

---

### **Phase 3: Advanced Features (Week 3)**

**Tasks:**
1. ✅ Implement screen state validation
2. ✅ Add error handling for invalid actions
3. ✅ Implement next_allowed_actions logic
4. ✅ Add AI response logging
5. ✅ Performance optimization

**Deliverables:**
- Deterministic AI flows
- Error handling complete
- Production-ready system

---

### **Phase 4: Testing & Polish (Week 4)**

**Tasks:**
1. ✅ End-to-end testing all actions
2. ✅ Language consistency testing
3. ✅ Mobile/web parity testing
4. ✅ Load testing AI endpoints
5. ✅ Documentation completion

**Deliverables:**
- All tests passing
- Documentation complete
- Ready for VC demo

---

## 9️⃣ FINAL CHECKLIST

### **Pre-Launch Verification:**

**Architecture:**
- [ ] Global system prompt implemented
- [ ] All buttons send action_type
- [ ] Response schemas defined
- [ ] Screen states configured

**Language:**
- [ ] Global language state in database
- [ ] Language toggle in UI
- [ ] All AI calls pass global_language
- [ ] No mixed language output

**Responsive:**
- [ ] Same JSON schema for web/mobile
- [ ] Frontend handles layout
- [ ] No layout in AI responses
- [ ] Tested on both platforms

**Deterministic:**
- [ ] Action validation implemented
- [ ] next_allowed_actions working
- [ ] Error handling complete
- [ ] All flows predictable

**Performance:**
- [ ] AI response times < 5s
- [ ] Caching implemented
- [ ] Error recovery working
- [ ] Logging in place

---

## 🚀 WHY THIS IS VC-READY

### **This Architecture Is:**

**1. NOT an LLM Wrapper**
- ✅ Structured action system
- ✅ Deterministic responses
- ✅ State-aware UI controller

**2. Defensible**
- ✅ Proprietary action mapping
- ✅ Agriculture-specific prompts
- ✅ Bilingual optimization
- ✅ Mobile-first design

**3. AI-Native UX**
- ✅ AI drives UI updates
- ✅ Context-aware recommendations
- ✅ Adaptive workflows

**4. Scalable**
- ✅ Works for 1 farmer or 10,000
- ✅ Same architecture for smallholders & agribusiness
- ✅ Language-agnostic (add Kikuyu, French, etc.)

**5. Production-Grade**
- ✅ Error handling
- ✅ Logging & monitoring
- ✅ Performance optimized
- ✅ Security built-in

---

## 🎯 NEXT STEPS

### **Immediate (Do Now):**

1. **Implement Global System Prompt**
   - File: `/supabase/functions/server/ai_services.tsx`
   - Use template from Section 1

2. **Create Action Type Registry**
   - File: `/types/ai_actions.ts`
   - Map all buttons to actions

3. **Set Up Language Preference**
   - Database: Add user_preferences table
   - Frontend: Add language toggle

### **This Week:**

4. **Convert 5 Key Buttons**
   - Create Crop Plan
   - Optimize Plan
   - View History
   - Generate Forecast
   - Get Market Price

5. **Test Web + Mobile**
   - Verify identical behavior
   - Check language consistency

### **Next Week:**

6. **Implement All Actions**
   - Complete action registry
   - Add screen state validation
   - Add error handling

7. **Polish & Test**
   - End-to-end testing
   - Performance optimization
   - Documentation

---

## 📖 REFERENCE

**Key Files:**
- `/AI_ARCHITECTURE_MASTER_GUIDE.md` - This document
- `/types/ai_actions.ts` - Action type definitions
- `/supabase/functions/server/ai_services.tsx` - AI controller
- `/utils/ai_client.tsx` - Frontend AI client

**Related Docs:**
- `/ARCHITECTURE_MAPPING.md` - Backend architecture
- `/API_CONTRACTS_DOCUMENTATION.md` - API reference
- `/FIGMA_DESIGN_SPECIFICATIONS.md` - UI specs

---

**Status:** 🎯 **ARCHITECTURE DEFINED - READY TO IMPLEMENT**  
**Impact:** Transforms AI from chatbot → controlled system  
**Timeline:** 4 weeks to production-ready  
**Result:** VC-ready, defensible, scalable AI platform  

🚀🧠✅ **This is how you build real AI products, not wrappers!**
