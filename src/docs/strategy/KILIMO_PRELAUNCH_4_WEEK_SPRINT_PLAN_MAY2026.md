# KilimoAI Pre-Launch 4-Week Sprint Plan (May 2026)

This plan operationalizes the audit into week-by-week execution and delivery outputs.

## Objectives

1. Clear all P0 launch blockers.
2. Validate real-world readiness for low-connectivity, Swahili-first farmers.
3. Reach launch confidence through evidence-based go/no-go gates.

## Team Model

- **Product Pod**: Product Manager, UX Lead, Swahili Content Lead
- **Auth + Trust Pod**: Frontend Engineer, Backend Engineer, QA
- **Payments + Compliance Pod**: Payments Engineer, Legal, Ops
- **AI + Agronomy Pod**: AI Engineer, Agronomy Partner Manager, QA
- **Platform Pod**: DevOps, Security Engineer, Backend Engineer

## Week 1 — Foundation & Compliance Critical Path

### Primary outcomes
- Authentication parity in place (Apple + Google)
- Swahili-first defaults and legal publishing complete
- iOS safety and HTTPS baseline complete

### Scope
- Implement Apple Sign-In end-to-end.
- Implement Google OAuth across required browsers.
- Enforce Swahili as default locale and clean fallback behavior.
- Apply iOS safe-area insets globally in app shell and modal surfaces.
- Publish privacy policy + terms in Swahili and English.
- Validate HTTPS and SSL coverage for all public endpoints.

### Deliverables
- OAuth QA matrix (device + browser + result).
- Locale behavior report.
- iOS visual regression screenshots (SE + notch devices).
- Legal document URLs added in onboarding and settings.
- SSL endpoint checklist.

### Exit criteria
- P0-01, P0-02, P0-04, P0-10, P0-14, P0-18 = `DONE`.

## Week 2 — Reliability, Payments, and Security Hardening

### Primary outcomes
- Offline-first flow works in real network constraints.
- Payment and messaging rails validated in sandbox.
- Security and data isolation controls proven.

### Scope
- Implement and verify service worker cache strategy for critical screens.
- Build photo upload queue with durable local persistence and auto-retry.
- Complete Swahili localization QA across UI and error states.
- Execute M-Pesa sandbox lifecycle tests.
- Add loading skeletons for all data-dependent views.
- Complete 44pt touch target pass for critical user journeys.
- Validate SMS delivery with retry behavior via Africa's Talking.
- Enforce AI rate limits with clear user-facing error handling.
- Run Supabase RLS policy audit and negative tests.

### Deliverables
- Offline test protocol and replay logs.
- Payment sandbox trace report.
- Accessibility/tap-target audit report.
- SMS delivery metrics report.
- API abuse/rate-limit test report.
- RLS verification evidence pack.

### Exit criteria
- P0-03, P0-05, P0-06, P0-09, P0-11, P0-13, P0-16, P0-17 = `DONE`.

## Week 3 — Tanzania Field Readiness & Domain Depth

### Primary outcomes
- Tanzania environment integrations proven.
- Disease intelligence reaches minimum credible scope.
- Legal compliance clearance secured.

### Scope
- Validate Airtel Money in Tanzania test/staging environment.
- Confirm disease library of 30+ East African crop diseases with TARI protocol mapping.
- Test USSD fallback via feature phone SIM for core scenarios.
- Complete Tanzania PDPA legal review and remediation closure.

### Deliverables
- Airtel transaction scenario report.
- Disease library catalog with source/protocol links.
- USSD UAT script results with pass/fail per scenario.
- PDPA compliance memo with approval status.

### Exit criteria
- P0-07, P0-08, P0-12, P0-15 = `DONE`.

## Week 4 — Launch Certification & Operational Readiness

### Primary outcomes
- Full P0 closure confirmed by evidence.
- Launch war-room and support operations prepared.
- Go/no-go decision made with executive sign-off.

### Scope
- Execute full launch regression against all P0 and critical P1 journeys.
- Run 48-hour stability watch in production-like environment.
- Configure day-1 support runbook (SMS support line, escalation tree, on-call).
- Conduct cross-functional go/no-go review.

### Deliverables
- Launch certification packet (all evidence links).
- Support and incident runbook.
- Signed go/no-go record (Product, Engineering, Legal, Ops).

### Exit criteria
- All P0 items marked `DONE` in tracker.
- No unresolved High severity defects.

## Dependency Map

- OAuth and locale work must finish before onboarding QA.
- Offline queue must stabilize before field USSD fallback validation.
- Payment rails must pass sandbox before legal finalization.
- RLS/rate limiting must pass before launch certification.

## Metrics for Launch Readiness

- **Auth Conversion**: onboarding completion > 70% from first auth screen.
- **Offline Reliability**: queued uploads replay success > 98%.
- **Payment Reliability**: payment scenario success > 95% in controlled tests.
- **Localization Quality**: Swahili QA defect escape rate < 2%.
- **Security**: 0 cross-tenant access in RLS negative tests.

## Ceremony Cadence

- Monday: sprint planning + risk reset.
- Daily: blocker standup (20 min).
- Wednesday/Friday: QA evidence review.
- Friday: gate review with decision log.

## Immediate Next 48 Hours

1. Assign owner + backup owner to each P0 item.
2. Set up shared evidence folder and naming convention.
3. Open work tickets for all Week 1 scope items.
4. Schedule legal and partnerships checkpoints now (do not wait for Week 3).
