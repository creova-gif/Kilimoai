# 🔧 KILIMO AI - Quick Integration Guide

## 🚀 5-Minute Integration

### Step 1: Add UnifiedAuth to App.tsx

```tsx
import { useState, useEffect } from 'react';
import { UnifiedAuth } from './components/UnifiedAuth';
import { crashReporter, ErrorBoundary } from './utils/crash-reporting';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize crash reporting
    crashReporter.init();
    
    // Check for existing session
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    // Check if user has active session
    // Implementation depends on your session management
  };

  if (!user) {
    return (
      <UnifiedAuth
        onSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          crashReporter.setUserId(authenticatedUser.id);
        }}
        language="en" // or "sw" for Swahili
      />
    );
  }

  return (
    <ErrorBoundary componentName="App">
      <YourMainApp user={user} />
    </ErrorBoundary>
  );
}
```

---

### Step 2: Wrap AI Components with Telemetry

**Before**:
```tsx
export function AIComponent() {
  const [data, setData] = useState(null);
  
  const fetchAIData = async () => {
    const response = await fetch('/api/ai');
    setData(await response.json());
  };
  
  return <div>{data}</div>;
}
```

**After**:
```tsx
import { aiTelemetry } from '../utils/ai-telemetry';

export function AIComponent({ userId }) {
  const [data, setData] = useState(null);
  
  const fetchAIData = async () => {
    const requestId = aiTelemetry.startRequest(
      userId,
      "ai_component_data",
      "farmer",
      "openrouter"
    );
    
    try {
      const response = await fetch('/api/ai');
      const result = await response.json();
      
      aiTelemetry.successRequest(
        requestId,
        userId,
        "ai_component_data",
        "farmer",
        "openrouter"
      );
      
      setData(result);
    } catch (error) {
      aiTelemetry.failRequest(
        requestId,
        userId,
        "ai_component_data",
        "farmer",
        "openrouter",
        error.message
      );
      
      // Use fallback
      aiTelemetry.fallbackUsed(userId, "ai_component_data", "farmer", "openrouter");
      setData(getMockData());
    }
  };
  
  return (
    <ErrorBoundary componentName="AIComponent">
      <div>{data}</div>
    </ErrorBoundary>
  );
}
```

---

### Step 3: Add Error Boundaries

Wrap critical components:

```tsx
import { ErrorBoundary } from './utils/crash-reporting';

// Wrap entire features
<ErrorBoundary componentName="Dashboard">
  <DashboardHome user={user} />
</ErrorBoundary>

// Wrap AI features
<ErrorBoundary componentName="AIRecommendations">
  <AIRecommendations userId={user.id} />
</ErrorBoundary>

// Wrap critical sections
<ErrorBoundary componentName="MarketPrices">
  <MarketPricesWidget />
</ErrorBoundary>
```

---

## 📊 View Metrics

### In Your Admin Dashboard:

```tsx
import { aiTelemetry } from './utils/ai-telemetry';

export function AdminDashboard() {
  const [metrics, setMetrics] = useState(null);
  
  useEffect(() => {
    loadMetrics();
  }, []);
  
  const loadMetrics = async () => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-ce1844e7/ai-telemetry/dashboard`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );
    
    const data = await response.json();
    setMetrics(data.metrics);
  };
  
  return (
    <div>
      <h2>AI Performance (Last 7 Days)</h2>
      {metrics?.map(day => (
        <div key={day.date}>
          <p>{day.date}</p>
          <p>Requests: {day.totalRequests}</p>
          <p>Success Rate: {day.successRate}%</p>
          <p>Avg Latency: {day.avgLatency}ms</p>
          <p>Error Rate: {day.errorRate}%</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔍 Debugging Tips

### Check Telemetry in Console

```tsx
// In development, telemetry logs to console
// Look for: [AI Telemetry] AI_REQUEST_SENT { ... }
```

### Check Crash Reports

```tsx
// Crashes are automatically logged
// Check backend at: /crash-reports/metrics
```

### Manual Error Reporting

```tsx
import { useErrorReporting } from './utils/crash-reporting';

function MyComponent() {
  const { reportError, reportNetworkError } = useErrorReporting();
  
  const handleAction = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      reportError(error, 'MyComponent.handleAction');
    }
  };
}
```

---

## ⚙️ Configuration

### Environment Variables

```bash
# Already configured in Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxx

# For SMS OTP (Africa's Talking)
AFRICAS_TALKING_API_KEY=xxxxx
AFRICAS_TALKING_USERNAME=xxxxx
```

### Phone Auth Setup

1. Enable Phone Auth in Supabase Dashboard
2. Configure SMS provider (Africa's Talking)
3. Set OTP template
4. Configure rate limits

---

## 🧪 Testing

### Test Email Auth:
1. Open app
2. Click Email tab
3. Enter: test@example.com / password123
4. Should signup and redirect

### Test Phone Auth:
1. Open app
2. Click Phone tab
3. Enter: +255712345678
4. OTP sent to phone
5. Enter OTP code
6. Should verify and redirect

### Test Telemetry:
1. Use any AI feature
2. Open browser console
3. Look for: `[AI Telemetry]` logs
4. Check Network tab for `/ai-telemetry/log` calls

### Test Crash Reporting:
1. Throw error in component:
   ```tsx
   throw new Error('Test crash');
   ```
2. Should show Error Boundary fallback
3. Check console for crash log
4. Check backend at `/crash-reports/metrics`

---

## 🚨 Common Issues

### Issue: OTP not sending
**Solution**: Check Africa's Talking configuration in Supabase dashboard

### Issue: Telemetry not logging
**Solution**: Check browser console for errors, verify API endpoint

### Issue: Crashes not captured
**Solution**: Make sure crash reporter is initialized in App.tsx

### Issue: Auth not persisting
**Solution**: Implement session management with Supabase Auth

---

## 📞 Quick Reference

### Auth API:
- `POST /auth/signup` - Email signup
- `POST /auth/phone-verify` - Phone verification

### Telemetry API:
- `POST /ai-telemetry/log` - Log event
- `GET /ai-telemetry/metrics/:userId` - User metrics
- `GET /ai-telemetry/dashboard` - Admin metrics

### Crash API:
- `POST /crash-reports/log` - Log crash
- `GET /crash-reports/metrics` - Crash metrics

---

## ✅ Integration Checklist

- [ ] Added `UnifiedAuth` to App.tsx
- [ ] Wrapped AI components with telemetry
- [ ] Added Error Boundaries to critical components
- [ ] Initialized crash reporter in App.tsx
- [ ] Tested email auth flow
- [ ] Tested phone auth flow
- [ ] Verified telemetry logging
- [ ] Verified crash reporting
- [ ] Configured SMS provider
- [ ] Set up monitoring dashboard
- [ ] Tested on mobile device
- [ ] Ready for production

---

**Need Help?** Check `/PRODUCTION_READINESS_COMPLETE.md` for full documentation.
