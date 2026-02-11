# 🌾 Crop Library - Quick Reference

## 🚀 Quick Start (3 Steps)

### 1. Initialize Database

```bash
bash scripts/init-crop-library.sh
```

### 2. Access in App

Navigate to: **Planning → Crop Library**

### 3. Generate Images

Click any crop → Select growth stage → Click "Generate AI Image"

---

## 📂 File Locations

| Component              | File Path                                     |
| ---------------------- | --------------------------------------------- |
| Backend Service        | `/supabase/functions/server/crop_library.tsx` |
| API Routes             | `/supabase/functions/server/index.tsx`        |
| Frontend Component     | `/components/CropLibrary.tsx`                 |
| Navigation Integration | `/App.tsx`                                    |
| Init Script            | `/scripts/init-crop-library.sh`               |
| Documentation          | `/CROP_LIBRARY_COMPLETE.md`                   |

---

## 🔌 API Endpoints

```bash
# Initialize (run once)
GET /crop-library/init

# Get all crops
GET /crop-library/crops

# Get single crop
GET /crop-library/crops/:cropId

# Generate AI image
POST /crop-library/generate-image
Body: { "cropId": "maize", "stage": "vegetative" }
```

---

## 🎨 Brand Colors (STRICT)

| Element     | Color     | Usage                |
| ----------- | --------- | -------------------- |
| Primary     | `#2E7D32` | Buttons, icons, CTA  |
| Text        | `#111827` | Headings             |
| Body Text   | `#6B7280` | Descriptions         |
| Background  | `#FFFFFF` | Cards                |
| Page BG     | `#F9FAFB` | Main background      |
| Border      | `#E5E7EB` | Card borders         |
| Type Badges | Semantic  | Cereal=Amber, etc.   |

---

## 📊 Crop Data Model

```typescript
{
  id: "maize",
  name_en: "Maize",
  name_sw: "Mahindi",
  lifecycle: "annual",
  type: "cereal",
  season: "both",
  growth_stages: ["seedling", "vegetative", "flowering", "harvest"],
  yield_range: "2-6 tonnes/ha",
  planting_window: "Oct-Dec (short rains), Mar-May (long rains)",
  common_risks: ["Fall armyworm", "Drought"],
  image_url: "https://...",
  images: {
    seedling: "https://...",
    vegetative: "https://...",
    flowering: "https://...",
    harvest: "https://..."
  }
}
```

---

## 🔧 Adding New Crops

1. Open `/supabase/functions/server/crop_library.tsx`
2. Add to `TANZANIAN_CROPS` array:

```typescript
{
  id: "new_crop",
  name_en: "New Crop",
  name_sw: "Zao Jipya",
  lifecycle: "annual",
  type: "cereal",
  season: "both",
  growth_stages: ["seedling", "vegetative", "flowering", "harvest"],
  yield_range: "X-Y tonnes/ha",
  planting_window: "Month-Month",
  common_risks: ["Risk 1", "Risk 2"],
}
```

3. Restart server
4. Re-run `bash scripts/init-crop-library.sh`

---

## 🐛 Common Issues

### **Images not generating?**

- Check `OPENROUTER_API_KEY` is set
- Check OpenRouter account has credits
- Check server logs for DALL-E errors

### **Crops not loading?**

- Run initialization: `bash scripts/init-crop-library.sh`
- Check KV store has data
- Check server logs

### **UI not showing?**

- Check import in App.tsx: `import { CropLibrary } from "./components/CropLibrary"`
- Check route handler: `{activeTab === "crop-library" && ...}`
- Check navigation item: `{ id: "crop-library", label: "Crop Library", ... }`

---

## 💡 Tips & Best Practices

1. **Generate popular crops first**: Maize, Rice, Beans, Cassava
2. **Generate 1 stage initially**: Start with "vegetative" stage
3. **Monitor costs**: Each image costs ~$0.04
4. **Cache everything**: Images are cached forever after first generation
5. **Test on mobile**: Most users are on mobile devices

---

## 📈 Success Metrics

Track these in your analytics:

- **Crop views**: Which crops are most popular?
- **Image generation requests**: How many new images?
- **Navigation clicks**: "Use in Crop Plan" vs "Ask AI"
- **Search queries**: What are farmers searching for?
- **Filter usage**: Which filters are most used?

---

## 🔮 Roadmap

### **Next Sprint**

- [ ] Add offline mode
- [ ] Add crop favorites
- [ ] Add crop comparison
- [ ] Add seasonal alerts

### **Future**

- [ ] User-uploaded photos
- [ ] Community ratings
- [ ] Expert Q&A integration
- [ ] AI yield prediction

---

## ✅ Deployment Checklist

Before deploying to production:

- [x] Initialize crop database
- [x] Generate images for top 10 crops
- [x] Test on mobile devices
- [x] Test search and filters
- [x] Test navigation to other features
- [x] Verify brand colors (only #2E7D32)
- [x] Test bilingual support (EN/SW)
- [x] Monitor API response times
- [x] Check error boundaries
- [x] Review security policies

---

**Questions?** Check `/CROP_LIBRARY_COMPLETE.md` for detailed docs.
