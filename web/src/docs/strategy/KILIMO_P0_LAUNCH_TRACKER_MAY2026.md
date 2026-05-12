# KilimoAI P0 Launch Tracker (May 2026)

Use this tracker as the single source of truth for launch blockers.

## Status Key

- `NOT_STARTED`: no implementation work started
- `IN_PROGRESS`: actively being implemented or integrated
- `BLOCKED`: cannot proceed due to dependency/risk
- `READY_FOR_QA`: implementation complete, awaiting QA/legal review
- `DONE`: passed acceptance criteria with evidence

## Blocker Tracker

| ID | Blocker | Owner | Current Status | Evidence Required | Acceptance Criteria | Dependencies | Target Week |
|---|---|---|---|---|---|---|---|
| P0-01 | Apple Sign-In implemented and App Store review passed | Engineering (Auth) | NOT_STARTED | App Store submission screenshots + test account log | Apple Sign-In works on iOS 15+, user can register/login/link account, App Store policy compliance confirmed | Apple Developer config, backend OAuth callback, legal text links | Week 1 |
| P0-02 | Google OAuth works on Android Chrome, Samsung Internet, iOS Safari | Engineering (Auth) | NOT_STARTED | Device/browser QA matrix | Google login succeeds across required browsers and persists session | Google Cloud OAuth config, callback URLs | Week 1 |
| P0-03 | Offline mode with service worker + queued photo upload + sync | Engineering (Frontend/PWA) | NOT_STARTED | Offline test recordings, queue replay logs | Core screens load offline, diagnosis photos queue offline and auto-sync on reconnect without data loss | PWA cache strategy, upload queue, retry policy | Week 2 |
| P0-04 | Swahili enforced as default language | Product + Frontend | NOT_STARTED | Locale initialization test report | New users always land in Swahili first, language toggle remains available | i18n config cleanup | Week 1 |
| P0-05 | All strings/errors/AI responses translated + native review | Product + Content | NOT_STARTED | Signed-off translation QA sheet | 100% user-facing text translated and approved by native Swahili reviewer | String extraction, reviewer availability | Week 2 |
| P0-06 | M-Pesa sandbox scenarios pass (pay/receive/refund/fail) | Engineering (Payments) | NOT_STARTED | Sandbox test logs + webhook traces | End-to-end payment lifecycle succeeds and failure paths handled gracefully | Provider credentials, webhook endpoint stability | Week 2 |
| P0-07 | Airtel Money integration tested in Tanzania environment | Engineering (Payments) | NOT_STARTED | Test evidence with expected/actual outcomes | All supported payment scenarios validated with fallback behavior | Airtel test environment access | Week 3 |
| P0-08 | Disease library includes >=30 East African crop diseases with TARI-aligned protocol | AI + Partnerships | NOT_STARTED | Disease catalog sheet + protocol references | Library contains minimum target breadth, each disease mapped to validated guidance source | TARI data partnership, content review | Week 3 |
| P0-09 | 44pt minimum touch targets verified on iPhone SE + low-end Android | Design + QA | NOT_STARTED | Tap target audit report + annotated screenshots | All primary actions meet minimum target size in audited flows | Design system token enforcement | Week 2 |
| P0-10 | iOS safe area insets for notch/Dynamic Island/home indicator | Engineering (Frontend) | NOT_STARTED | iOS device screenshot set | No clipping on iPhone SE, 13/14/15/16 classes, including PWA mode | Global layout/safe-area CSS fixes | Week 1 |
| P0-11 | Loading skeletons on all data-dependent screens | Engineering (Frontend) | NOT_STARTED | Network throttling QA captures (2G/3G) | No blank states during data fetch; skeletons visible in all critical views | Component-level loading states | Week 2 |
| P0-12 | USSD fallback interface tested on feature-phone SIM | Engineering + Ops | NOT_STARTED | UAT logs from Tanzania test SIM | Critical flows usable via USSD fallback where app connectivity fails | USSD gateway integration | Week 3 |
| P0-13 | SMS delivery tested via Africa's Talking Tanzania endpoints | Engineering + Ops | NOT_STARTED | Delivery reports + retry metrics | OTP and alert SMS delivered reliably with retry/timeout handling | SMS provider config, callback handling | Week 2 |
| P0-14 | Privacy Policy + Terms published in Swahili and English | Legal + Product | NOT_STARTED | Public URL + legal approval note | Both documents live, accessible from onboarding and settings | Legal review cycle | Week 1 |
| P0-15 | Tanzania PDPA compliance verification | Legal | NOT_STARTED | Legal compliance memo | Required controls mapped, risks accepted/mitigated, go-live approval signed | Data map, retention policy, DPA review | Week 3 |
| P0-16 | AI endpoint rate limiting enabled (free tier abuse prevention) | Engineering (Backend) | NOT_STARTED | Load test + 429 behavior logs | Per-user/per-IP quotas enforced, safe fallback messaging in UI | API gateway/middleware changes | Week 2 |
| P0-17 | Supabase RLS verified for multi-tenant isolation | Engineering (Backend) | NOT_STARTED | RLS audit scripts + test cases | Cross-tenant access attempts blocked across all critical tables | Policy audit completion | Week 2 |
| P0-18 | HTTPS valid SSL on all API + web endpoints | DevOps | NOT_STARTED | SSL report + endpoint checklist | TLS valid, no mixed content, HSTS enabled where applicable | DNS, cert automation | Week 1 |

## Weekly Launch Gates

### Gate A — End of Week 1
- Must be `DONE`: P0-01, P0-02, P0-04, P0-10, P0-14, P0-18
- Max allowed `BLOCKED`: 1
- Escalation trigger: any auth item still `NOT_STARTED`

### Gate B — End of Week 2
- Must be `DONE`: P0-03, P0-05, P0-06, P0-09, P0-11, P0-13, P0-16, P0-17
- Escalation trigger: offline queue or payment sandbox failures unresolved after 2 rounds

### Gate C — End of Week 3
- Must be `DONE`: P0-07, P0-08, P0-12, P0-15
- Escalation trigger: legal or TARI validation not signed

### Gate D — Launch Go/No-Go (Week 4)
- Requirement: all P0 rows are `DONE`
- Required sign-off: Product, Engineering, Legal, Ops

## Daily Operating Rhythm

- 09:00 EAT: 20-minute blocker standup (owners only)
- 14:00 EAT: QA evidence sync and status refresh
- 17:00 EAT: launch risk update (`top 3 risks`, `new blockers`, `next 24h plan`)

## Critical Risk Register

| Risk | Likelihood | Impact | Mitigation | Owner |
|---|---|---|---|---|
| OAuth provider configuration delay | Medium | High | Parallel setup and staged test accounts in Week 1 | Auth Lead |
| Mobile money sandbox instability | Medium | High | Record/replay test harness, fallback retry policy | Payments Lead |
| Swahili quality inconsistency in AI responses | High | High | Native linguist review + prompt QA rubric | Product + AI |
| RLS gaps discovered late | Medium | High | Early policy audit script run in Week 1 | Backend Lead |
| Legal approval delays | Medium | High | Submit legal packet in first 48h | Product + Legal |
