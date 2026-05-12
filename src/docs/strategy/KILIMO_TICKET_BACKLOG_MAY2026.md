# KilimoAI Ticket-Ready Backlog (May 2026)

This backlog is derived from:
- `KILIMO_P0_LAUNCH_TRACKER_MAY2026.md`
- `KILIMO_PRELAUNCH_4_WEEK_SPRINT_PLAN_MAY2026.md`

Use this directly in Jira/Linear with minimal transformation.

## Label Conventions

- Priority: `P0` (launch blocker), `P1` (week 1 post-launch critical)
- Type: `feature`, `bug`, `infra`, `qa`, `legal`, `content`, `security`
- Area: `auth`, `pwa`, `payments`, `ai`, `ux`, `localization`, `security`, `compliance`, `ops`

## P0 Backlog (Launch Blockers)

| Ticket ID | Title | Type | Priority | Area | Suggested Owner | Estimate | Sprint Week | Dependencies | Definition of Done |
|---|---|---|---|---|---|---|---|---|---|
| KIL-P0-001 | Implement Apple Sign-In end-to-end for iOS + PWA | feature | P0 | auth | Auth Engineer | 3d | Week 1 | Apple Developer config, backend callback | User can sign up/login/link account using Apple ID; QA pass on iOS Safari + installed PWA |
| KIL-P0-002 | Implement Google OAuth across Android/iOS browsers | feature | P0 | auth | Auth Engineer | 2d | Week 1 | Google Cloud OAuth client setup | Login works on Android Chrome, Samsung Internet, iOS Safari with persistent session |
| KIL-P0-003 | Add offline service worker for critical screen caching | feature | P0 | pwa | Frontend Engineer | 3d | Week 2 | Cache strategy and asset manifest | Dashboard, scan, tasks, and profile load offline with expected fallback state |
| KIL-P0-004 | Build offline photo upload queue with reconnect sync | feature | P0 | pwa | Frontend Engineer | 3d | Week 2 | KIL-P0-003 | Captured photos queue offline, sync automatically, and no data loss on reconnect |
| KIL-P0-005 | Enforce Swahili as default locale on first launch | feature | P0 | localization | Frontend Engineer | 1d | Week 1 | i18n config inventory | New users default to Swahili; language toggle remains functional |
| KIL-P0-006 | Complete Swahili translation audit for all UI/error states | content | P0 | localization | Content Lead | 3d | Week 2 | String extraction tooling | 100% user-facing strings translated and reviewed by native speaker |
| KIL-P0-007 | Validate M-Pesa lifecycle scenarios in sandbox | qa | P0 | payments | Payments Engineer | 2d | Week 2 | Provider credentials + webhooks | Pay/receive/refund/fail scenarios pass with verified webhook reconciliation |
| KIL-P0-008 | Validate Airtel Money transaction flows in Tanzania environment | qa | P0 | payments | Payments Engineer | 2d | Week 3 | Airtel test environment access | Required transaction scenarios pass and failures handled gracefully |
| KIL-P0-009 | Expand disease library to 30+ East African disease entries | feature | P0 | ai | AI Engineer | 4d | Week 3 | TARI protocol references | Library meets target count and includes treatment guidance coverage |
| KIL-P0-010 | Validate TARI protocol alignment for disease recommendations | qa | P0 | ai | Agronomy Partner Manager | 2d | Week 3 | KIL-P0-009 | Every high-severity recommendation mapped to approved TARI protocol source |
| KIL-P0-011 | Enforce 44pt tap targets across critical journeys | bug | P0 | ux | UX Engineer | 2d | Week 2 | Component inventory | All primary actions pass touch-target audit on iPhone SE and low-end Android |
| KIL-P0-012 | Implement iOS safe-area handling globally | bug | P0 | ux | Frontend Engineer | 1d | Week 1 | Layout shell update | No clipped content in notch, dynamic island, and home indicator regions |
| KIL-P0-013 | Add skeleton loading states to all data-dependent pages | feature | P0 | ux | Frontend Engineer | 2d | Week 2 | Screen-by-screen loading map | No blank screens under 2G throttling; skeletons shown consistently |
| KIL-P0-014 | Validate USSD fallback flow on feature phone SIM | qa | P0 | ops | Ops Engineer | 2d | Week 3 | USSD gateway and scripts | Core fallback flows pass in Tanzania SIM UAT |
| KIL-P0-015 | Validate SMS delivery via Africa's Talking Tanzania endpoints | qa | P0 | ops | Backend Engineer | 2d | Week 2 | SMS callback endpoint + templates | OTP and alert SMS pass delivery/retry/timeout tests |
| KIL-P0-016 | Publish Privacy Policy and Terms in Swahili + English | legal | P0 | compliance | Legal Counsel | 1d | Week 1 | Final legal text | Public URLs live and linked in onboarding + settings |
| KIL-P0-017 | Complete Tanzania PDPA compliance review and closure | legal | P0 | compliance | Legal Counsel | 3d | Week 3 | Data map and retention matrix | Legal sign-off memo issued with required controls completed |
| KIL-P0-018 | Add AI endpoint rate limiting and abuse controls | security | P0 | security | Backend Engineer | 2d | Week 2 | API middleware/gateway access | 429 behavior enforced per plan; abuse tests pass |
| KIL-P0-019 | Audit and harden Supabase RLS for multi-tenant isolation | security | P0 | security | Backend Engineer | 2d | Week 2 | Table policy inventory | Negative tests confirm cross-tenant reads/writes blocked |
| KIL-P0-020 | Verify TLS/SSL and HTTPS hardening on all endpoints | infra | P0 | security | DevOps Engineer | 1d | Week 1 | DNS/certificate setup | Valid certs, no mixed content, HTTPS enforced |

## P1 Backlog (Week 1 Post-Launch Critical)

| Ticket ID | Title | Type | Priority | Area | Suggested Owner | Estimate | Dependencies | Definition of Done |
|---|---|---|---|---|---|---|---|---|
| KIL-P1-001 | Configure product analytics funnels (onboarding to first diagnosis) | feature | P1 | ops | Product Analyst | 2d | Event taxonomy | Funnel dashboard live with daily active conversion metrics |
| KIL-P1-002 | Integrate crash reporting and alert routing | infra | P1 | ops | DevOps Engineer | 1d | Environment keys | Critical errors alert on-call channel within 5 minutes |
| KIL-P1-003 | Add Safari PWA install guidance flow | feature | P1 | pwa | Frontend Engineer | 1d | PWA manifest | iOS users see contextual install guidance at right trigger points |
| KIL-P1-004 | Implement dark mode with semantic token system | feature | P1 | ux | UX Engineer | 2d | Token inventory | Dark mode complete across critical flows with contrast compliance |
| KIL-P1-005 | Ship progressive 3-step onboarding with deferred farm setup | feature | P1 | ux | Product + Frontend | 3d | Auth flows stable | Time-to-first-value < 60 seconds in moderated test |
| KIL-P1-006 | Personalize dashboard widgets by crop and region | feature | P1 | ai | Frontend + Backend | 3d | User profile normalization | Home dashboard shows user-specific priorities, not generic content |
| KIL-P1-007 | Add persistent Scan Crop FAB across app shells | bug | P1 | ux | Frontend Engineer | 1d | Navigation shell update | Scan action visible and reachable from all major app sections |
| KIL-P1-008 | Activate Swahili customer support SMS line and triage SOP | ops | P1 | ops | Ops Lead | 1d | KIL-P0-015 | Support number live with SLA and escalation runbook |

## Suggested Epics

| Epic ID | Epic Name | Tickets |
|---|---|---|
| KIL-EPIC-01 | Launch Authentication & Trust | KIL-P0-001, KIL-P0-002, KIL-P0-005, KIL-P0-016 |
| KIL-EPIC-02 | Offline Resilience & Field Reliability | KIL-P0-003, KIL-P0-004, KIL-P0-013, KIL-P0-014, KIL-P0-015 |
| KIL-EPIC-03 | Payments & Compliance Readiness | KIL-P0-007, KIL-P0-008, KIL-P0-017, KIL-P0-020 |
| KIL-EPIC-04 | AI Safety, Quality & Agronomy Coverage | KIL-P0-009, KIL-P0-010, KIL-P0-018, KIL-P0-019 |
| KIL-EPIC-05 | Mobile UX & Accessibility Baseline | KIL-P0-011, KIL-P0-012, KIL-P1-004, KIL-P1-007 |

## Recommended Sprint Allocation

- **Week 1**: KIL-P0-001, 002, 005, 012, 016, 020
- **Week 2**: KIL-P0-003, 004, 006, 007, 011, 013, 015, 018, 019
- **Week 3**: KIL-P0-008, 009, 010, 014, 017
- **Week 4**: full regression, evidence packaging, go/no-go review

## QA Evidence Checklist per Ticket

Each ticket should attach:
- Test plan link
- Device/browser matrix (if UI/auth related)
- Screenshots or recordings
- Logs/trace IDs for API/payment/SMS workflows
- Final sign-off comment from ticket owner + QA

## Immediate Ticket Creation Order (Top 10)

1. KIL-P0-001
2. KIL-P0-002
3. KIL-P0-016
4. KIL-P0-020
5. KIL-P0-012
6. KIL-P0-005
7. KIL-P0-003
8. KIL-P0-004
9. KIL-P0-007
10. KIL-P0-019
