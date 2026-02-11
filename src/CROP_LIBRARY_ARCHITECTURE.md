# 🌾 KILIMO Crop Library - Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         KILIMO CROP LIBRARY                              │
│                    AI-Powered Crop Knowledge System                      │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW                                   │
└─────────────────────────────────────────────────────────────────────────┘

    User Opens App
         │
         ▼
    Navigate to "Planning" → "Crop Library"
         │
         ▼
    ┌─────────────────────────────────────────┐
    │       CROP LIBRARY PAGE LOADS           │
    │  • 50+ crops in grid (2/3/4 cols)       │
    │  • Search bar                           │
    │  • Type/Lifecycle/Season filters        │
    │  • Real-time filtering                  │
    └─────────────────────────────────────────┘
         │
         ├──► User searches "maize"
         │         │
         │         ▼
         │    Grid filters to show only maize
         │
         ├──► User clicks crop card
         │         │
         │         ▼
         │    ┌───────────────────────────────────────┐
         │    │     CROP DETAIL MODAL OPENS           │
         │    │  • Large crop image                   │
         │    │  • Growth stage selector              │
         │    │  • Yield, planting window, risks      │
         │    │  • "Use in Crop Plan" button          │
         │    │  • "Ask AI" button                    │
         │    └───────────────────────────────────────┘
         │              │
         │              ├──► No image? → Click "Generate AI Image"
         │              │                        │
         │              │                        ▼
         │              │                 AI generates image
         │              │                  (30-60 seconds)
         │              │                        │
         │              │                        ▼
         │              │                Image cached & displayed
         │              │
         │              ├──► Click "Use in Crop Plan"
         │              │           │
         │              │           ▼
         │              │   Navigate to Crop Planning page
         │              │
         │              └──► Click "Ask AI"
         │                          │
         │                          ▼
         │                  Navigate to AI Advisor


┌─────────────────────────────────────────────────────────────────────────┐
│                         SYSTEM ARCHITECTURE                              │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────┐         ┌────────────────┐         ┌────────────────┐
│                │         │                │         │                │
│   FRONTEND     │◄───────►│    BACKEND     │◄───────►│   STORAGE      │
│   (React)      │  HTTPS  │    (Hono)      │  API    │   (Supabase)   │
│                │         │                │         │                │
└────────────────┘         └────────────────┘         └────────────────┘
       │                          │                          │
       │                          │                          │
       ▼                          ▼                          ▼
  Components:             Routes:                   Buckets:
  • CropLibrary.tsx       • /init                   • crop-images/
  • Card Grid             • /crops                     ├── maize/
  • Filters               • /crops/:id                 ├── rice/
  • Detail Modal          • /generate-image            └── ...
  • Search                                          
                                 │                    KV Store:
                                 ▼                    • crop:maize
                          External APIs:              • crop:rice
                          • OpenRouter                • crop:...
                            └─► DALL-E 3


┌─────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW: IMAGE GENERATION                     │
└─────────────────────────────────────────────────────────────────────────┘

    User clicks "Generate AI Image"
              │
              ▼
    Frontend sends POST request
    {
      "cropId": "maize",
      "stage": "vegetative"
    }
              │
              ▼
    Backend checks cache (KV store)
              │
              ├──► Image exists?
              │       │
              │       └──► YES: Return cached URL ✅
              │
              └──► NO: Generate new image
                      │
                      ▼
              Build DALL-E prompt:
              "Maize (Mahindi) crop healthy 
               growing plants with lush green 
               leaves in a Tanzanian farm field..."
                      │
                      ▼
              Call OpenRouter API
              (DALL-E 3, 1024x1024)
                      │
                      ▼
              Receive AI-generated image URL
                      │
                      ▼
              Download image from DALL-E
                      │
                      ▼
              Upload to Supabase Storage
              (crop-images/maize/vegetative/...)
                      │
                      ▼
              Get public URL
                      │
                      ▼
              Calculate confidence score
              (0.85-0.95 for DALL-E)
                      │
                      ▼
              Save to KV store:
              {
                ...crop,
                images: {
                  vegetative: "https://..."
                },
                image_confidence: 0.92
              }
                      │
                      ▼
              Return URL to frontend
                      │
                      ▼
              Frontend displays image ✅


┌─────────────────────────────────────────────────────────────────────────┐
│                          STORAGE STRUCTURE                               │
└─────────────────────────────────────────────────────────────────────────┘

Supabase Storage (crop-images bucket)
├── maize/
│   ├── seedling/
│   │   └── 1707584400000.png (1024x1024, ~200KB)
│   ├── vegetative/
│   │   └── 1707584401000.png (1024x1024, ~200KB)
│   ├── flowering/
│   │   └── 1707584402000.png (1024x1024, ~200KB)
│   └── harvest/
│       └── 1707584403000.png (1024x1024, ~200KB)
│
├── rice/
│   ├── seedling/
│   │   └── 1707584404000.png
│   └── ...
│
├── cassava/
│   ├── planting/
│   │   └── 1707584405000.png
│   └── ...
│
└── ... (50+ crops)

KV Store
├── crop:maize → {
│       id: "maize",
│       name_en: "Maize",
│       name_sw: "Mahindi",
│       images: {
│         seedling: "https://.../.../maize/seedling/1707584400000.png",
│         vegetative: "https://.../.../maize/vegetative/1707584401000.png",
│         ...
│       },
│       image_confidence: 0.92,
│       ...
│   }
│
├── crop:rice → { ... }
└── crop:cassava → { ... }


┌─────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND COMPONENT TREE                           │
└─────────────────────────────────────────────────────────────────────────┘

App.tsx
  └─► CropLibrary.tsx
        │
        ├─► Header
        │     ├─► Icon (Leaf)
        │     ├─► Title
        │     ├─► Search Input
        │     └─► Filters (Type, Lifecycle, Season)
        │
        ├─► Crop Grid
        │     └─► Card[] (for each crop)
        │           ├─► Image (or placeholder)
        │           ├─► Name (EN or SW)
        │           ├─► Lifecycle Badge
        │           └─► Type Badge
        │
        └─► Crop Detail Dialog (when crop selected)
              ├─► Header
              │     ├─► Crop Name
              │     └─► Alternate Name
              │
              ├─► Image Section
              │     ├─► Large Image
              │     ├─► Growth Stage Selector
              │     └─► Generate Button (if no image)
              │
              ├─► Details Section
              │     ├─► Yield Range
              │     ├─► Planting Window
              │     └─► Common Risks
              │
              └─► Action Buttons
                    ├─► "Use in Crop Plan"
                    └─► "Ask AI about this crop"


┌─────────────────────────────────────────────────────────────────────────┐
│                            INTEGRATION MAP                               │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌────────────────────┐
                    │   CROP LIBRARY     │
                    └────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
        ┌──────────────────┐   ┌──────────────────┐
        │  CROP PLANNING   │   │   AI ADVISOR     │
        │  (Existing)      │   │   (Existing)     │
        └──────────────────┘   └──────────────────┘
                │                       │
                └───────────┬───────────┘
                            ▼
                  ┌──────────────────┐
                  │     DASHBOARD    │
                  │     (Home)       │
                  └──────────────────┘
                            │
                ┌───────────┴───────────┐
                ▼                       ▼
      ┌──────────────────┐    ┌──────────────────┐
      │   TASK MGMT      │    │    INVENTORY     │
      │   (Future)       │    │    (Future)      │
      └──────────────────┘    └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                         SECURITY MODEL                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  Supabase Storage (crop-images bucket)                                 │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Policy 1: Public Read Access                                │    │
│  │  • Any user can view images                                  │    │
│  │  • No authentication required                                │    │
│  │  • Enables fast CDN delivery                                 │    │
│  └──────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────┐    │
│  │  Policy 2: Service Role Write Only                           │    │
│  │  • Only backend (service_role) can upload                    │    │
│  │  • Prevents user abuse                                       │    │
│  │  • Ensures image quality                                     │    │
│  └──────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│  API Endpoints                                                          │
│                                                                         │
│  GET  /crops          → Public (no auth required)                     │
│  GET  /crops/:id      → Public (no auth required)                     │
│  POST /generate-image → Public (protected by rate limiting - future)  │
│  GET  /init           → Admin only (manual trigger)                   │
└────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────┐
│                          COST BREAKDOWN                                  │
└─────────────────────────────────────────────────────────────────────────┘

ONE-TIME COSTS (Initial Setup):
┌───────────────────────────────────────────────────────┐
│  DALL-E 3 Image Generation (1024x1024)               │
│  • 50 crops × 4 stages = 200 images                  │
│  • $0.04 per image                                   │
│  • Total: $8.00                                      │
└───────────────────────────────────────────────────────┘

ONGOING COSTS (Monthly):
┌───────────────────────────────────────────────────────┐
│  Supabase Storage                                     │
│  • 200 images × 200KB = 40MB                         │
│  • Free tier: 1GB included                           │
│  • Cost: $0                                          │
│                                                       │
│  Supabase API Calls                                   │
│  • Free tier: 500,000 reads/month                    │
│  • Estimated: 10,000 reads/month                     │
│  • Cost: $0                                          │
│                                                       │
│  Image Serving (CDN)                                  │
│  • Included in Supabase                              │
│  • Cost: $0                                          │
└───────────────────────────────────────────────────────┘

TOTAL MONTHLY COST: $0 ✅
(After initial $8 investment)


┌─────────────────────────────────────────────────────────────────────────┐
│                        PERFORMANCE METRICS                               │
└─────────────────────────────────────────────────────────────────────────┘

Page Load Time:
├─► Initial Load: < 2 seconds ✅
├─► API Call (/crops): < 500ms ✅
├─► Image Load (per image): < 1 second ✅
└─► Filter Update: < 100ms ✅

Image Generation:
├─► DALL-E API: 30-60 seconds ⏳
├─► Upload to Storage: 2-5 seconds
├─► Cache Update: < 100ms
└─► Total: ~35-65 seconds per image

User Actions:
├─► Search: < 100ms ✅
├─► Filter Change: < 100ms ✅
├─► Open Modal: < 50ms ✅
├─► Navigate: < 200ms ✅
└─► Close Modal: < 50ms ✅


┌─────────────────────────────────────────────────────────────────────────┐
│                          SCALABILITY                                     │
└─────────────────────────────────────────────────────────────────────────┘

Current: 50+ crops
Maximum: 1000+ crops ✅

To add new crops:
1. Add to TANZANIAN_CROPS array
2. Restart server
3. Re-run initialization script
4. Done! ✅

To support new countries:
1. Change DALL-E prompt: "Tanzanian farm field" → "Kenyan farm field"
2. Add new crops to array
3. Done! ✅

To add new languages:
1. Add translations to text object
2. Update language prop
3. Done! ✅


┌─────────────────────────────────────────────────────────────────────────┐
│                        SUCCESS METRICS                                   │
└─────────────────────────────────────────────────────────────────────────┘

Engagement Metrics:
├─► Crops Viewed per Session: Target > 5
├─► Modal Open Rate: Target > 30%
├─► Time on Page: Target > 2 minutes
├─► Search Usage: Target > 40%
└─► Filter Usage: Target > 50%

Conversion Metrics:
├─► "Use in Crop Plan" Clicks: Target > 20%
├─► "Ask AI" Clicks: Target > 15%
└─► Return Visits: Target > 60%

Technical Metrics:
├─► Page Load < 2s: Target > 95%
├─► API Errors: Target < 1%
├─► Image Load Success: Target > 99%
└─► Mobile Usage: Target > 70%

Image Quality:
├─► AI Confidence Score: Target > 0.85
├─► User Reports: Target < 1%
└─► Generation Success: Target > 95%
```

---

**Built with ❤️ for Tanzanian farmers** 🇹🇿🌾
