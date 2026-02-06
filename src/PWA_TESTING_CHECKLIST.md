# 📋 CREOVA PWA Testing Checklist

## Pre-Deployment Testing (Local)

Test these on your development machine before deploying:

### ✅ Basic Functionality
- [ ] App loads without errors
- [ ] All pages/tabs accessible
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard displays correctly
- [ ] AI chatbot responds
- [ ] Market prices load
- [ ] Weather data displays
- [ ] No console errors

### ✅ Service Worker (Local)
```bash
# Run production build locally
npm run build
npm run preview  # or serve -s dist

# Open http://localhost:4173 (or shown port)
# Check browser console:
```

- [ ] Service worker registers successfully
- [ ] Console shows: "Service Worker registered successfully"
- [ ] Network tab shows service worker active
- [ ] No service worker errors

### ✅ Manifest
- [ ] `/manifest.json` accessible
- [ ] No JSON syntax errors
- [ ] Icons paths are correct
- [ ] Theme color is #16a34a
- [ ] Start URL is correct

### ✅ Icons (Placeholder OK for Testing)
- [ ] At least `apple-touch-icon.png` exists
- [ ] Icon is 180×180 or larger
- [ ] Icon is PNG format
- [ ] Icon displays when loaded directly

---

## Post-Deployment Testing (Production)

Once deployed with HTTPS, test these:

### ✅ HTTPS & Security
- [ ] Site loads with HTTPS (🔒 in browser)
- [ ] No mixed content warnings
- [ ] SSL certificate is valid
- [ ] Site accessible from mobile data (not just WiFi)

### ✅ PWA Basics
- [ ] Manifest loads: `https://your-url.com/manifest.json`
- [ ] Service worker loads: `https://your-url.com/service-worker.js`
- [ ] Both return 200 status (not 404)
- [ ] Correct MIME types

### ✅ Lighthouse Audit

Run in Chrome DevTools:

1. Open DevTools (F12)
2. Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"

**Target Scores:**
- [ ] PWA: 90+ ✅
- [ ] Performance: 70+ (aim for 90+)
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 90+

**Critical PWA Checks:**
- [ ] ✅ Installable
- [ ] ✅ Configured for a custom splash screen
- [ ] ✅ Sets a theme color
- [ ] ✅ Content sized correctly for viewport
- [ ] ✅ Has a `<meta name="viewport">` tag
- [ ] ✅ Provides a valid `apple-touch-icon`
- [ ] ✅ Configured for offline use

---

## iOS Testing (iPhone/iPad)

### ✅ Installation Process

**Safari on iPhone:**
1. Open Safari browser
2. Navigate to `https://your-url.com`
3. Wait 30 seconds
4. Check for install prompt
5. Tap Share button (box with ↑)
6. Scroll down
7. Look for "Add to Home Screen"

**Checklist:**
- [ ] Share button works
- [ ] "Add to Home Screen" option appears
- [ ] Custom icon preview shows (not generic)
- [ ] App name shows as "CREOVA"
- [ ] Tapping "Add" succeeds

### ✅ Installed App Behavior

**After adding to home screen:**
- [ ] Icon appears on home screen
- [ ] Icon is correct (not generic)
- [ ] Icon has correct name "CREOVA"
- [ ] Tapping icon launches app
- [ ] App opens in full-screen (no Safari UI)
- [ ] Status bar is styled correctly
- [ ] Splash screen appears (if configured)
- [ ] App loads successfully

### ✅ App Functionality (iOS)
- [ ] All features work (same as browser)
- [ ] Navigation works
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Styles render correctly
- [ ] No layout issues
- [ ] Camera access works (if used)
- [ ] Location access works (if used)

### ✅ Offline Mode (iOS)
1. Open installed app
2. Use app briefly (browse pages)
3. Close app
4. Turn on Airplane Mode
5. Reopen app from home screen

**Checklist:**
- [ ] App launches offline
- [ ] Previously viewed content displays
- [ ] Offline page appears for new content
- [ ] No crash or blank screen
- [ ] User-friendly offline message

### ✅ iOS Update Mechanism
1. Deploy new version
2. Open installed app
3. Pull to refresh or navigate

**Checklist:**
- [ ] Update detected
- [ ] Toast notification appears
- [ ] "Refresh" button offered
- [ ] Clicking refresh loads new version
- [ ] New features work

### ✅ iOS-Specific Issues

Test on multiple iOS devices if possible:
- [ ] iPhone SE (small screen)
- [ ] iPhone 11/12/13 (standard)
- [ ] iPhone 14 Pro Max (large, notch)
- [ ] iPad (tablet layout)

**Common iOS issues:**
- [ ] No scroll bounce on fixed elements
- [ ] Touch events work (not just mouse)
- [ ] Viewport fits screen (no horizontal scroll)
- [ ] Safe areas respected (notch, home indicator)
- [ ] Keyboard doesn't cover inputs

---

## Android Testing

### ✅ Installation Process

**Chrome on Android:**
1. Open Chrome browser
2. Navigate to `https://your-url.com`
3. Wait for install banner

**Checklist:**
- [ ] Install banner appears automatically
- [ ] Banner shows correct app name
- [ ] Banner shows correct icon
- [ ] "Install" button works
- [ ] App installs successfully

**Alternative method:**
- [ ] Menu (⋮) → "Add to Home Screen" works
- [ ] Custom icon shows in dialog
- [ ] "Add" button installs app

### ✅ Installed App Behavior (Android)

**After installation:**
- [ ] Icon appears in app drawer
- [ ] Icon appears on home screen
- [ ] Icon is correct (not generic web icon)
- [ ] App name is "CREOVA"
- [ ] Tapping icon launches app
- [ ] App opens in standalone mode
- [ ] Status bar matches theme color (#16a34a)
- [ ] Splash screen appears (Android 12+)

### ✅ App Functionality (Android)
- [ ] All features work
- [ ] Back button behaves correctly
- [ ] Share functionality works
- [ ] File uploads work
- [ ] Notifications work (if implemented)
- [ ] No layout issues
- [ ] Responsive design works

### ✅ Offline Mode (Android)
1. Install and use app
2. Close app
3. Turn off WiFi and mobile data
4. Reopen app

**Checklist:**
- [ ] App launches offline
- [ ] Cached content displays
- [ ] Offline indicator shows
- [ ] Sync happens when back online
- [ ] No data loss

### ✅ Android Versions
Test on different Android versions:
- [ ] Android 9 (old devices)
- [ ] Android 11 (common)
- [ ] Android 13+ (latest)

---

## Desktop Testing

### ✅ Desktop Installation

**Chrome/Edge on Desktop:**
- [ ] Install icon appears in address bar
- [ ] Clicking icon opens install dialog
- [ ] Installation succeeds
- [ ] App opens in separate window
- [ ] App appears in taskbar/dock
- [ ] App appears in Start menu/Applications

### ✅ Desktop Functionality
- [ ] Responsive design adapts to desktop
- [ ] Mouse interactions work
- [ ] Keyboard shortcuts work
- [ ] Window resizing works correctly
- [ ] Copy/paste works
- [ ] Desktop-specific features work

---

## Cross-Browser Testing

### ✅ Safari (iOS/macOS)
- [ ] App loads correctly
- [ ] All features work
- [ ] PWA installation works
- [ ] Offline mode works
- [ ] Updates work

### ✅ Chrome (Android/Desktop)
- [ ] App loads correctly
- [ ] Installation banner appears
- [ ] PWA installs successfully
- [ ] Offline mode works
- [ ] Sync works

### ✅ Firefox (Android/Desktop)
- [ ] App loads correctly
- [ ] Basic PWA features work
- [ ] No critical errors
- [ ] Degraded gracefully

### ✅ Edge (Desktop)
- [ ] App loads correctly
- [ ] Installation works
- [ ] PWA features work

---

## Network Condition Testing

Test app under various network conditions:

### ✅ Fast WiFi (Ideal)
- [ ] App loads in < 3 seconds
- [ ] Images load quickly
- [ ] Smooth interactions
- [ ] No lag

### ✅ 4G Mobile Data (Common in Tanzania)
- [ ] App loads in < 5 seconds
- [ ] Images load (may be slower)
- [ ] Features still usable
- [ ] No timeout errors

### ✅ 3G Mobile Data (Common in Rural Areas)
- [ ] App eventually loads (< 10 sec)
- [ ] Text content prioritized
- [ ] Images load progressively
- [ ] Still functional (if slow)

### ✅ 2G/Edge (Worst Case)
- [ ] App shows loading state
- [ ] Offline cached version works
- [ ] Doesn't crash
- [ ] User feedback provided

### ✅ Intermittent Connection
- [ ] App handles connection drops
- [ ] Retry mechanisms work
- [ ] No data corruption
- [ ] Graceful degradation

### ✅ Offline → Online Transition
- [ ] App detects when back online
- [ ] Toast notification shows
- [ ] Data syncs automatically
- [ ] No manual refresh needed

### ✅ Online → Offline Transition
- [ ] App detects disconnect
- [ ] Offline indicator appears
- [ ] Cached content still accessible
- [ ] Forms save locally (if applicable)

---

## Performance Testing

### ✅ Load Times

**Measure with Chrome DevTools (Network tab):**
- [ ] First paint: < 1.5s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] First Input Delay (FID): < 100ms
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.5s

### ✅ Resource Sizes
- [ ] Total page size: < 2MB
- [ ] JavaScript: < 500KB
- [ ] CSS: < 100KB
- [ ] Images optimized
- [ ] Fonts loaded efficiently

### ✅ Caching
- [ ] Second visit loads faster
- [ ] Cache-first strategy works
- [ ] Updates don't break cache
- [ ] Cache size reasonable (< 50MB)

---

## Security Testing

### ✅ HTTPS
- [ ] All resources loaded over HTTPS
- [ ] No mixed content warnings
- [ ] Valid SSL certificate
- [ ] Certificate not expired

### ✅ Data Protection
- [ ] User data encrypted in transit
- [ ] LocalStorage used appropriately
- [ ] No sensitive data in URLs
- [ ] Session management secure

### ✅ API Security
- [ ] API keys not exposed in frontend
- [ ] Proper authentication headers
- [ ] CORS configured correctly
- [ ] Rate limiting (if applicable)

---

## Accessibility Testing

### ✅ Keyboard Navigation
- [ ] All features accessible via keyboard
- [ ] Tab order logical
- [ ] Focus indicators visible
- [ ] No keyboard traps

### ✅ Screen Readers
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Headings structure logical

### ✅ Visual
- [ ] Color contrast meets WCAG AA
- [ ] Text readable at 200% zoom
- [ ] No information conveyed by color alone
- [ ] Focus states visible

### ✅ Mobile Accessibility
- [ ] Touch targets ≥ 44×44px
- [ ] Text size readable (16px min)
- [ ] No horizontal scrolling
- [ ] Gestures simple (tap, swipe)

---

## User Experience Testing

### ✅ First-Time User
- [ ] Onboarding clear
- [ ] Registration easy
- [ ] Instructions helpful
- [ ] Value proposition clear

### ✅ Returning User
- [ ] Login smooth
- [ ] Data persisted
- [ ] Familiar interface
- [ ] Quick access to features

### ✅ Error Handling
- [ ] Error messages clear
- [ ] Recovery options provided
- [ ] No cryptic errors
- [ ] Helpful suggestions

### ✅ Loading States
- [ ] Skeleton screens or spinners
- [ ] Progress indicators
- [ ] Not too much waiting
- [ ] Can cancel long operations

---

## Edge Cases

### ✅ Unusual Data
- [ ] Empty states handled
- [ ] Very long text handled
- [ ] Special characters work
- [ ] Large numbers handled

### ✅ Extreme Conditions
- [ ] Low battery mode
- [ ] Low storage space
- [ ] Many browser tabs open
- [ ] Old device (slow CPU)

### ✅ User Behavior
- [ ] Rapid clicking handled
- [ ] Back button works correctly
- [ ] Multiple tabs of app
- [ ] Browser refresh works

---

## Tanzania-Specific Testing

### ✅ Local Context
- [ ] Swahili translation accurate
- [ ] Currency formatting correct (TZS)
- [ ] Dates formatted correctly
- [ ] Regional data relevant

### ✅ Device Testing
Test on common devices in Tanzania:
- [ ] Budget Android phones (< $100)
- [ ] Older iPhone models (6s, 7)
- [ ] Tablets
- [ ] Feature phones (if applicable)

### ✅ Network Reality
- [ ] Works on Vodacom network
- [ ] Works on Airtel network
- [ ] Works on Tigo network
- [ ] Works on Halotel network
- [ ] Handles network switching

---

## Final Pre-Launch Checklist

### ✅ Critical Path Testing
- [ ] User can register
- [ ] User can log in
- [ ] User can ask AI question
- [ ] User can view market prices
- [ ] User can check weather
- [ ] User can install PWA
- [ ] User can use app offline
- [ ] User can update app

### ✅ Documentation
- [ ] Installation guide ready
- [ ] User manual prepared
- [ ] FAQ documented
- [ ] Support contact available

### ✅ Monitoring Setup
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured

### ✅ Rollback Plan
- [ ] Previous version saved
- [ ] Rollback procedure tested
- [ ] Database backups current
- [ ] Emergency contacts list

---

## Test Results Template

Use this template to track your testing:

```markdown
# CREOVA PWA Test Results
Date: __________
Tester: __________
Build Version: __________

## iOS (iPhone 11, iOS 16.5)
- Installation: ✅ / ❌
- Functionality: ✅ / ❌
- Offline: ✅ / ❌
- Performance: ✅ / ❌
- Notes: __________

## Android (Samsung Galaxy A12, Android 11)
- Installation: ✅ / ❌
- Functionality: ✅ / ❌
- Offline: ✅ / ❌
- Performance: ✅ / ❌
- Notes: __________

## Lighthouse Score
- PWA: __/100
- Performance: __/100
- Accessibility: __/100
- Best Practices: __/100
- SEO: __/100

## Issues Found
1. __________
2. __________

## Recommendations
1. __________
2. __________

## Ready for Launch? YES / NO
```

---

## Automated Testing (Optional)

### ✅ Lighthouse CI
```bash
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=https://your-url.com

# Target scores
lhci assert --preset=lighthouse:recommended
```

### ✅ PWA Testing
```bash
# Using Playwright
npm install -D @playwright/test

# Test installation flow
# Create tests/pwa.spec.ts
```

### ✅ Visual Regression
```bash
# Using Percy or Chromatic
npm install --save-dev @percy/cli @percy/playwright

# Capture screenshots across devices
```

---

## When to Retest

Rerun this checklist:
- ✅ Before every major release
- ✅ After significant code changes
- ✅ When adding new features
- ✅ After dependency updates
- ✅ When bugs are reported
- ✅ Monthly (for production apps)

---

## 🎯 Minimum Requirements for Launch

You can launch if these CRITICAL items pass:

**Must Have:**
- ✅ HTTPS enabled
- ✅ Service worker registers
- ✅ Manifest valid
- ✅ Installs on iPhone (Safari)
- ✅ Installs on Android (Chrome)
- ✅ Core features work
- ✅ Offline mode functions
- ✅ Lighthouse PWA score > 80

**Nice to Have (can fix post-launch):**
- Performance optimizations
- Perfect icons (can start with emoji)
- All device sizes tested
- Perfect Lighthouse scores
- Advanced PWA features

---

## 📞 Support Checklist

Before launch, ensure:
- [ ] Support email/phone ready
- [ ] FAQ prepared
- [ ] Bug reporting process defined
- [ ] User feedback channel created
- [ ] Emergency contact available 24/7

---

**Remember:** Perfect is the enemy of done. Test the critical path, launch, then iterate based on real user feedback!

Good luck with testing! 🧪✅
