# 🔄 KILIMO AI SYSTEM ARCHITECTURE DIAGRAM

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                         🌱 KILIMO AGRI-AI SUITE                         │
│                  "AI must feel helpful, not loud"                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘

                                    USER
                              (Farmer on Mobile)
                                     │
                                     │ Interacts with
                                     ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                          FRONTEND (React)                               │
│                                                                          │
│  ┌─────────────────────┐      ┌─────────────────────┐                 │
│  │                     │      │                     │                 │
│  │  Page Components    │      │  AI UI Components   │                 │
│  │  ─────────────────  │      │  ─────────────────  │                 │
│  │  • Crop Planning    │◄─────┤  • AISuggestionChip │                 │
│  │  • Marketplace      │      │  • AIInsightCard    │                 │
│  │  • Finance          │      │  • AIWhyChip        │                 │
│  │  • Dashboard        │      │  • AIStatusBadge    │                 │
│  │                     │      │                     │                 │
│  └─────────────────────┘      └─────────────────────┘                 │
│             │                           │                               │
│             │                           │                               │
│             └───────────┬───────────────┘                               │
│                         │                                               │
│                         │ Uses                                          │
│                         ↓                                               │
│  ┌────────────────────────────────────────────────────────┐           │
│  │                                                          │           │
│  │  AI Integration Utilities                               │           │
│  │  /utils/aiFeatureIntegration.ts                         │           │
│  │  ─────────────────────────────────────────────────────  │           │
│  │  • getCropIntelligenceAdvice()                          │           │
│  │  • getFarmingTemplateAdvice()                           │           │
│  │  • getCropPlanningAdvice()                              │           │
│  │  • getYieldRevenueAdvice()                              │           │
│  │  • getInventoryAdvice()                                 │           │
│  │  • getMarketplaceAdvice()                               │           │
│  │  • getFinanceAdvice()                                   │           │
│  │  • getLivestockAdvice()                                 │           │
│  │  • getUnifiedAdvice()                                   │           │
│  │  • getWeatherAdvice()                                   │           │
│  │                                                          │           │
│  └────────────────────────────────────────────────────────┘           │
│                         │                                               │
└─────────────────────────┼───────────────────────────────────────────────┘
                          │
                          │ HTTP POST
                          │ (with context + query)
                          ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    BACKEND (Supabase Edge Functions)                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────┐           │
│  │                                                          │           │
│  │  AI Engine Endpoint                                     │           │
│  │  /supabase/functions/server/ai_engine.tsx               │           │
│  │  ─────────────────────────────────────────────────────  │           │
│  │  POST /make-server-ce1844e7/ai/engine                   │           │
│  │                                                          │           │
│  │  Receives:                                               │           │
│  │  {                                                       │           │
│  │    "role": "smallholder_farmer",                        │           │
│  │    "feature": "crop_planning",                          │           │
│  │    "language": "EN",                                    │           │
│  │    "context": { plots: [...] },                         │           │
│  │    "query": ""                                          │           │
│  │  }                                                       │           │
│  │                                                          │           │
│  └────────────────────────────────────────────────────────┘           │
│                         │                                               │
│                         │ Calls                                         │
│                         ↓                                               │
│  ┌────────────────────────────────────────────────────────┐           │
│  │                                                          │           │
│  │  Feature-Specific Prompt Generator                      │           │
│  │  /supabase/functions/server/ai_feature_prompts.tsx      │           │
│  │  ─────────────────────────────────────────────────────  │           │
│  │                                                          │           │
│  │  generateMasterPrompt({                                 │           │
│  │    feature: "crop_planning",                            │           │
│  │    context: {...},                                      │           │
│  │    language: "EN"                                       │           │
│  │  })                                                      │           │
│  │                                                          │           │
│  │  Returns: Structured prompt with:                       │           │
│  │  • System identity                                      │           │
│  │  • Feature-specific instructions                        │           │
│  │  • Context information                                  │           │
│  │  • Safety guardrails                                    │           │
│  │  • Expected output schema                               │           │
│  │                                                          │           │
│  └────────────────────────────────────────────────────────┘           │
│                         │                                               │
└─────────────────────────┼───────────────────────────────────────────────┘
                          │
                          │ Sends prompt to
                          ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                   AI PROVIDER (OpenRouter API)                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────┐           │
│  │                                                          │           │
│  │  Claude 3.5 Sonnet (Anthropic)                          │           │
│  │  ─────────────────────────────────────────────────────  │           │
│  │                                                          │           │
│  │  Receives: System prompt + User query                   │           │
│  │                                                          │           │
│  │  Processes:                                              │           │
│  │  • Understands Tanzanian context                        │           │
│  │  • Respects local farming practices                     │           │
│  │  • Generates conservative estimates                     │           │
│  │  • Provides actionable recommendations                  │           │
│  │                                                          │           │
│  │  Returns: Structured JSON response                      │           │
│  │  {                                                       │           │
│  │    "recommendations": [...],                            │           │
│  │    "alerts": [...],                                     │           │
│  │    "actions": [...],                                    │           │
│  │    "confidence_level": "high"                           │           │
│  │  }                                                       │           │
│  │                                                          │           │
│  └────────────────────────────────────────────────────────┘           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                          │
                          │ Returns response
                          ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                    RESPONSE FLOW (Back to Frontend)                     │
│                                                                          │
│  Backend parses response → Structures data → Returns to Frontend        │
│                                                                          │
│  Frontend receives:                                                     │
│  {                                                                      │
│    "success": true,                                                     │
│    "role": "smallholder_farmer",                                        │
│    "feature": "crop_planning",                                          │
│    "language": "EN",                                                    │
│    "response": {                                                        │
│      "space_utilization": 85,                                           │
│      "warnings": [],                                                    │
│      "suggested_adjustments": [...],                                    │
│      "auto_tasks": [...]                                                │
│    },                                                                   │
│    "timestamp": "2026-02-10T12:00:00Z"                                  │
│  }                                                                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                          │
                          │ Displays to user via
                          ↓
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│                        UI PRESENTATION OPTIONS                          │
│                                                                          │
│  Option 1: Inline Chip                                                 │
│  ┌────────────────────────────────────────┐                           │
│  │  ✨ Get AI Suggestion                   │                           │
│  └────────────────────────────────────────┘                           │
│            ↓ (User clicks)                                              │
│  ┌────────────────────────────────────────┐                           │
│  │  ✨ AI Suggestion                       │                           │
│  │  ─────────────────────────────────────  │                           │
│  │  Consider reducing planting density    │                           │
│  │  by 10% in Plot B to avoid...          │                           │
│  │                                         │                           │
│  │  [Apply] [Ignore]                      │                           │
│  └────────────────────────────────────────┘                           │
│                                                                          │
│  Option 2: Full Insights Card                                          │
│  ┌────────────────────────────────────────────────────────┐           │
│  │  ✨ AI Insights                                         │           │
│  │  ─────────────────────────────────────────────────────  │           │
│  │  Based on your data and local farming practices        │           │
│  │                                                          │           │
│  │  Recommendations:                                        │           │
│  │  ✓ Reduce density in Plot B by 10%                     │           │
│  │  ✓ Plant in March for optimal yield                    │           │
│  │  ✓ Apply fertilizer at weeks 2, 4, 6                   │           │
│  │                                                          │           │
│  │  Alerts:                                                 │           │
│  │  ⚠ Plot B is 90% utilized - risky                      │           │
│  │                                                          │           │
│  │  Confidence: [High Confidence]                          │           │
│  │                                                          │           │
│  │  [Refresh] [Apply Suggestions]                          │           │
│  └────────────────────────────────────────────────────────┘           │
│                                                                          │
│  Option 3: Why Chip                                                    │
│  ┌────────────────────┐                                                │
│  │  ✨ Why?            │                                                │
│  └────────────────────┘                                                │
│            ↓ (User clicks)                                              │
│  ┌────────────────────────────────────────┐                           │
│  │  Based on rainfall patterns in your    │                           │
│  │  region and soil type, this spacing    │                           │
│  │  will maximize yield while reducing    │                           │
│  │  competition between plants.           │                           │
│  └────────────────────────────────────────┘                           │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


════════════════════════════════════════════════════════════════════════════
                            KEY DESIGN PRINCIPLES
════════════════════════════════════════════════════════════════════════════

✅ Progressive Disclosure
   • AI starts hidden or as small chip
   • User opts in to see details
   • "Why?" explanations available but collapsed

✅ No Auto-Commit
   • AI NEVER applies changes without confirmation
   • Always shows [Apply] button
   • User can [Ignore] suggestions

✅ Offline-Friendly
   • Graceful fallback to manual mode
   • Cached responses when possible
   • Clear error messages

✅ Brand Compliance
   • Only #2E7D32 (Raspberry Leaf Green) for primary actions
   • Gray scale for neutral elements
   • Red/Yellow only for semantic alerts WITH labels

✅ Bilingual
   • Every prompt in English + Swahili
   • Every UI component in English + Swahili
   • Automatic language switching

════════════════════════════════════════════════════════════════════════════
                              DATA FLOW SUMMARY
════════════════════════════════════════════════════════════════════════════

1. User interacts with page component
2. Component calls aiFeatureIntegration utility
3. Utility sends HTTP POST to backend AI engine
4. AI engine calls feature-specific prompt generator
5. Prompt generator creates structured prompt
6. Backend sends prompt to OpenRouter (Claude)
7. Claude processes and returns structured JSON
8. Backend parses and structures response
9. Response flows back to frontend
10. UI component displays result to user
11. User can [Apply] or [Ignore]

════════════════════════════════════════════════════════════════════════════

Built with ❤️ for Tanzanian farmers
Philosophy: "AI must feel helpful, not loud"
Brand: Only #2E7D32 (Raspberry Leaf Green)
```
