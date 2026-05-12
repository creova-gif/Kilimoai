# 🎯 KILIMO SYSTEM INTEGRATION - QUICK REFERENCE

## 📞 INTEGRATION API REFERENCE

### **Authentication**
```typescript
import { authenticateUser, clearUserSession } from './utils/systemIntegration';

// Login
const { success, user, accessToken } = await authenticateUser({
  identifier: 'farmer@example.com', // or '+255712345678'
  password: 'SecurePass123',
  type: 'email' // or 'phone'
});

// Logout
await clearUserSession();
```

### **Crop Library & AI Images**
```typescript
import { generateCropImage, diagnoseCropFromImage } from './utils/systemIntegration';

// Generate AI image for crop
const { success, imageUrl } = await generateCropImage('Maize', userId);

// Diagnose crop from photo
const { success, diagnosis } = await diagnoseCropFromImage(
  base64ImageData,
  userId,
  'sw' // language
);
```

### **Crop Planning**
```typescript
import { createCropPlanFromTemplate } from './utils/systemIntegration';

const { success, plan } = await createCropPlanFromTemplate(
  'maize-template-001',
  userId,
  {
    farmSize: '5 acres',
    region: 'Arusha',
    startDate: '2026-03-01'
  }
);

// Plan includes:
// - plan.id
// - plan.cropName
// - plan.expectedYield
// - plan.expectedRevenue
// - plan.tasks[] (6 auto-generated tasks)
```

### **Tasks & Notifications**
```typescript
import { updateTask } from './utils/systemIntegration';

// Update task (e.g., mark complete)
const { success } = await updateTask(taskId, {
  status: 'completed',
  completedAt: new Date().toISOString()
});

// If harvest task → triggers inventory update automatically
```

### **Marketplace Sales**
```typescript
import { processMarketplaceSale } from './utils/systemIntegration';

const { success, error } = await processMarketplaceSale({
  cropName: 'Maize',
  quantity: 200, // kg
  pricePerUnit: 1000, // TSh per kg
  buyerId: 'buyer-uuid'
});

// Automatically:
// - Reduces inventory
// - Credits wallet
// - Records finance transaction
```

### **AI Feedback Loop**
```typescript
import { submitDiagnosisFeedback } from './utils/systemIntegration';

// Submit feedback on AI diagnosis
const { success } = await submitDiagnosisFeedback(
  diagnosisId,
  'accurate', // or 'inaccurate'
  'Treatment worked within 5 days' // optional outcome description
);

// AI confidence automatically adjusted
```

### **Offline Sync**
```typescript
import { syncOfflineData, queueOfflineAction } from './utils/systemIntegration';

// Queue action for later sync
await queueOfflineAction(
  '/tasks/task-123',
  'PUT',
  { status: 'completed' }
);

// Sync all queued actions
const { success, synced } = await syncOfflineData();
```

### **Integration Health**
```typescript
import { runIntegrationHealthCheck } from './utils/systemIntegration';

const health = await runIntegrationHealthCheck();

// Returns: { auth, cropLibrary, cropPlanning, tasks, inventory, marketplace, finance, ai, telemetry, offline }
```

---

## 🔗 AUTOMATIC TRIGGERS

These happen **automatically** when certain actions occur:

| Action | Auto-Triggers |
|--------|---------------|
| User registers | → RBAC role assigned → Dashboard configured |
| Crop plan created | → 6 tasks auto-generated → Notifications scheduled |
| Task created | → Calendar entry → Notification scheduled |
| Harvest task completed | → Inventory updated → Marketplace listing created |
| Marketplace sale | → Inventory reduced → Wallet credited → Finance recorded |
| AI diagnosis | → Telemetry logged → Confidence tracked |
| Feedback submitted | → AI confidence adjusted → Learning signal stored |
| Device goes online | → Queued actions synced → Local cache updated |

---

## 📊 DATA FLOW DIAGRAMS

### **Auth Flow**
```
Login → Verify → Token → RBAC → Permissions → Dashboard
```

### **Crop Planning Flow**
```
Template → Plan → Tasks → Notifications → Calendar
                   ↓
              Yield/Revenue
```

### **Harvest-to-Sale Flow**
```
Task (Harvest) → Inventory (+quantity)
                     ↓
                 Marketplace (listing)
                     ↓
                Sale (buyer)
                     ↓
       ┌─────────────┴─────────────┐
       ↓                           ↓
   Wallet (+revenue)         Inventory (-sold)
       ↓
   Finance (transaction)
```

### **AI Learning Flow**
```
Diagnosis → Telemetry → Feedback → Confidence Update → Next Diagnosis
```

---

## 🗄️ DATABASE SCHEMA

### **Key-Value Store Structure**

```typescript
// Users
`user:${userId}` → User object

// Crop Plans
`cropPlan:${planId}` → Plan object
`cropPlans:${userId}` → Array of plan IDs

// Tasks
`task:${taskId}` → Task object
`tasks:${userId}` → Array of task IDs

// Inventory
`inventory:${userId}` → { [cropName]: { totalQuantity, harvests[] } }

// Marketplace
`marketplaceListings:${userId}` → Array of listings
`sale:${saleId}` → Sale record

// Wallet
`wallet:${userId}` → { balance, transactions[] }

// Finance
`financeTransaction:${transactionId}` → Transaction object
`financeTransactions:${userId}` → Array of transaction IDs
`financeSummary:${userId}` → { totalIncome, totalExpense, netProfit }

// AI Telemetry
`aiTelemetry:${diagnosisId}` → Telemetry record
`userTelemetry:${userId}` → Array of telemetry IDs
`aiConfidence:${disease}` → Confidence score (0-1)

// Notifications
`notification:${notificationId}` → Notification object
`userNotifications:${userId}` → Array of notification IDs

// Offline
`offlineActions` → Array of pending actions
`currentUser` → Current user object
`authToken` → Access token
```

---

## 🌐 API ENDPOINTS

All endpoints prefixed with: `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7`

### **Auth**
- `POST /register` - Create new user
- `POST /login` - Authenticate user
- `POST /send-verification-otp` - Send OTP
- `POST /verify-otp` - Verify OTP
- `GET /profile/:userId` - Get user profile

### **Crop Planning**
- `POST /crop-planning/create-from-template` - Generate plan from template
- `POST /crop-planning/calculate-yield` - Calculate yield/revenue
- `POST /tasks/generate-from-plan` - Auto-generate tasks

### **Tasks & Notifications**
- `PUT /tasks/:taskId` - Update task
- `POST /notifications/schedule` - Schedule notification
- `GET /notifications/:userId` - Get user notifications

### **Inventory**
- `POST /inventory/add-harvest` - Add harvest to inventory
- `POST /inventory/reduce` - Reduce inventory (after sale)
- `GET /inventory/:userId` - Get user inventory

### **Marketplace**
- `POST /marketplace/update-inventory` - Update listing
- `POST /marketplace/process-sale` - Process sale transaction

### **Wallet & Finance**
- `POST /wallet/update-balance` - Update wallet balance
- `GET /wallet/:userId` - Get wallet info
- `POST /finance/record-transaction` - Record transaction
- `GET /finance/summary/:userId` - Get financial summary

### **AI & Telemetry**
- `POST /ai/diagnose` - Diagnose crop from image
- `POST /ai/telemetry/diagnosis` - Store diagnosis telemetry
- `POST /ai/telemetry/feedback` - Submit feedback
- `POST /ai/optimize` - Trigger AI optimization

### **Offline Sync**
- `POST /sync/offline-actions` - Sync queued actions

---

## 🎨 UI INTEGRATION POINTS

### **Components Connected to Backend**

| Component | Backend Integration | Data Flow |
|-----------|-------------------|-----------|
| `UnifiedDualAuth` | Auth API | Login → Token → User |
| `CropLibrary` | Crop Library API | Load → Display → Cache |
| `UnifiedCropPlanning` | Crop Planning API | Template → Plan → Tasks |
| `UnifiedTasksSchedule` | Tasks API | Load → Update → Sync |
| `UnifiedInventory` | Inventory API | Harvest → Display → Update |
| `UnifiedMarket` | Marketplace API | List → Sale → Finance |
| `UnifiedFinance` | Finance API | Transactions → Summary → Charts |
| `UnifiedAIAdvisor` | AI API | Question → Response → Telemetry |
| `PhotoCropDiagnosis` | AI Diagnosis API | Image → Diagnosis → Feedback |

---

## ⚡ PERFORMANCE OPTIMIZATION

### **Caching Strategy**
```typescript
// Always cache these:
- User profile
- Crop library images
- Crop plans (active)
- Tasks (upcoming)
- Inventory snapshot

// Refresh on change:
- Wallet balance
- Marketplace listings
- Notifications

// Sync periodically:
- AI confidence scores
- Financial summaries
- Telemetry data
```

### **Offline-First Priority**
```typescript
// High Priority (must work offline):
1. View crop library
2. Browse crop plans
3. View tasks
4. View inventory

// Medium Priority (queue offline):
1. Create tasks
2. Update task status
3. Add notes

// Low Priority (require online):
1. Marketplace sales
2. AI diagnosis
3. Wallet transactions
```

---

## 🔐 SECURITY CHECKLIST

- [x] Auth tokens in headers, not URLs
- [x] RBAC enforced server-side
- [x] Service role key never exposed to frontend
- [x] OTP rate limiting (3 attempts/hour)
- [x] Session timeout (15 minutes)
- [x] Sensitive data encrypted at rest
- [x] API endpoints CORS-protected
- [x] User actions logged for audit

---

## 🌍 LOCALIZATION

All text must support EN/SW:

```typescript
const text = {
  en: "Create Crop Plan",
  sw: "Unda Mpango wa Mazao"
};

// Use:
const label = language === 'en' ? text.en : text.sw;
```

**Bilingual Coverage:**
- [x] UI labels
- [x] Button text
- [x] Error messages
- [x] Success messages
- [x] AI responses
- [x] Notifications
- [x] Crop names
- [x] Task titles

---

## 🚀 DEPLOYMENT COMMANDS

```bash
# Build
npm run build

# Test integrations
npm run test:integration

# Deploy backend
./deploy-kilimo.sh

# Verify health
curl https://your-project.supabase.co/functions/v1/make-server-ce1844e7/health
```

---

## 📞 SUPPORT

**Integration Issues?**

1. Check integration health: `runIntegrationHealthCheck()`
2. Review console for errors
3. Verify API endpoints are accessible
4. Check offline queue: `localStorage.getItem('offlineActions')`
5. Clear cache if stale data

**Common Fixes:**
- 401 error → Token expired, re-login
- 404 error → Wrong endpoint or resource not found
- 500 error → Check server logs in Supabase
- Sync fails → Clear offline queue and retry

---

## ✅ FINAL CHECKLIST

- [ ] All 8 phases implemented
- [ ] Health check returns all `true`
- [ ] 10 integration tests passed
- [ ] No mock data visible
- [ ] Offline mode works
- [ ] Bilingual support verified
- [ ] Performance meets benchmarks
- [ ] Security checklist complete

**When complete → DEPLOY! 🚀**
