# EWC Care App — Portfolio Architecture Reference

> Sanitized for public portfolio use. Security-sensitive thresholds, session parameters, and internal function signatures removed.

## System Overview

A production PWA managing pastoral care operations for Empowerment Worship Centre. Serves 5+ communities with real-time data sync, role-based access, and AI-powered insights.

## Database: 42 Tables, 92 Indexes

### Table Distribution

| Category | Tables | Highlights |
|----------|--------|-----------|
| Core Data | 8 | Members (13 indexes), communities, circles, global stats, events, departments |
| Care System | 8 | Care interactions, cases (8 statuses, 4 priorities), prayer requests, follow-ups, case activities, case notes |
| Attendance & Services | 9 | Service templates, service instances (6 statuses), attendance records (7 indexes), venue geofences, QR tokens, visitor tracking (5 statuses) |
| Auth & Access Control | 6 | Role assignments, custom permissions, impersonation sessions, email whitelist, role audit log, permission templates |
| Activity & Notifications | 6 | Activity log (7 indexes, 21 action types), AI insights, notifications, push subscriptions |
| Circle Management | 4 | Assignment history, circle events, previews, shareable links |
| User Management | 3 | Invitations, bulk imports, salvation decisions |
| Enterprise Audit | 3 | Immutable audit log (8 indexes, SHA-256 integrity chain), soft-delete registry, archived records (7-year retention) |
| Analytics | 1 | Onboarding events |

## Access Control: 6 Roles, 12 Resources, Hybrid RBAC+ABAC

### Role Hierarchy

| Role | Scope |
|------|-------|
| Super Admin | Full system access, role impersonation |
| Pastor | Community-level: members, circles, cases |
| Discovery Lead | Visitors, first-timers, discipleship |
| Circle Guide | Assigned circle members only |
| Staff | Read-only across most resources |
| Viewer | Dashboard and reports only |

### Permission Model

- **RBAC**: 12 resources with granular action matrix (create, read, update, delete, restore, export, import, assign, escalate, resolve)
- **ABAC**: Custom permissions with scope restrictions, time-based conditions, day-of-week rules, and explicit grant/deny overrides
- **PII Projection**: Sensitive member fields (phone, email, birthday, address) automatically filtered by role before API response

## Authentication

- Magic link email authentication (passwordless)
- Email whitelist — only pre-authorized users can sign in
- Session management with configurable idle timeout
- Client-side idle detection: warning modal, lock screen, auto-logout
- Auto-accepts pending invitations and assigns roles on first login

## Security Architecture

### Defense in Depth (6 Layers)

1. **Input Validation** — String length limits, email format validation, enum constraints, bounded pagination
2. **Rate Limiting** — Sliding window algorithm on authentication and public-facing endpoints
3. **PII Projection** — Role-based field filtering strips sensitive data before it reaches the client
4. **HTML Sanitization** — DOMPurify on all user-generated content (care notes, case descriptions, member notes)
5. **Enterprise Audit Log** — Immutable, append-only log with SHA-256 checksums and chain linking. Each entry references the previous entry's checksum, forming a tamper-evident chain. Supports compliance flags and severity levels. Hard-deleted data archived for regulatory retention.
6. **Geolocation Verification** — Haversine distance calculation for geofence validation. Multi-signal spoofing detection flags anomalous readings.

### Security Testing

- 24 security-focused unit test files covering: RBAC enforcement, PII projection, rate limiting, auth guards, XSS prevention, file upload sanitization, encryption, OWASP fixes
- Mutation testing (Stryker) validates security logic cannot be trivially bypassed

## Check-In System

1. Admin starts a service instance, generating a unique token encoded as a QR code
2. Members scan QR or enter code at a public check-in page (no auth required)
3. System captures geolocation, device fingerprint, and check-in method
4. Geofence validation runs against registered venue locations
5. Spoofing detection flags recorded on attendance record
6. Verification level computed based on authentication state, location confidence, and check-in method
7. Live attendance summary updates in real time

## Real-Time Data Flow

1. Client subscribes to a Convex query
2. Convex watches underlying tables for mutations
3. On any write: query re-executes server-side automatically
4. New result streamed to client — component re-renders with fresh data
5. No polling, no WebSocket management, no cache invalidation

### Live-Updating Dashboard

- Shepherd priority queue: birthdays, care gaps, needs attention, new members
- Case status distribution across 8 statuses
- Growth stage breakdown (Born/Grow/Serve/Lead/Multiply)
- Attendance trends across recent services
- Aggregate stats: total members, active, unassigned, care needs

### Performance Patterns

- All queries backed by indexes (zero table scans)
- Bounded queries with `.take(N)`
- Global stats singleton: O(1) aggregate counts
- Denormalized community/circle counts: O(1) lookups
- Lazy loading via skip pattern for off-screen components

## Test Suite: 280+ Tests Across 53 Files

### Unit & Component Tests (36 files, Vitest)

| Category | Files | Coverage |
|----------|-------|----------|
| Security | 24 | RBAC enforcement, PII projection, rate limiting, auth guards, XSS prevention, file sanitization, encryption, OWASP compliance |
| Core domain | 4 | Auth, member CRUD, public onboarding, schema validation |
| Features & utils | 8 | Phone normalization (30+ cases), dashboard, notifications, PWA, theme, build config |

### E2E Tests (17 files, Python Playwright)

| Category | Files | Coverage |
|----------|-------|----------|
| Check-in flows | 5 | Full lifecycle: start service, check in, verify, end service |
| Visitor tracking | 5 | Registration, recurring detection, duplicate blocking, follow-up, member conversion |
| Special features | 7 | Salvation decisions, circle management, phone search, geofence + QR, sign-out |

### Mutation Testing (Stryker)

Security-focused mutation testing validates that security logic cannot be trivially bypassed — mutations to auth guards, permission checks, and input validation are detected and killed.

## Key Technical Patterns

### Denormalization Strategy

- Community and circle member counts maintained via atomic delta adjustments
- Global stats singleton provides O(1) aggregate counts without table scans
- Per-community growth stage breakdowns for instant analytics
- Drift correction function recalculates all denormalized counts when needed

### Activity Logging

21 action types across 9 categories and 20+ resource types. Captures user context, action details, changed fields, session ID, and device type. Non-blocking — logging failures never break main flows. Powers AI insights and compliance reporting.

### Soft Delete & Data Lifecycle

All sensitive tables support soft delete with full audit trail. Registry tracks deletions across tables. Hard delete scheduled after retention period. Restore operation preserves complete history.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 |
| UI | React 19, TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | Convex (real-time) |
| Auth | Convex Auth (magic link) |
| AI | Google Generative AI (Gemini) |
| UI Primitives | Radix UI |
| Charts | Recharts |
| Email | Resend |
| QR | QRCode generation |
| Sanitization | DOMPurify |
| Testing | Vitest, Playwright (Python), Stryker |
