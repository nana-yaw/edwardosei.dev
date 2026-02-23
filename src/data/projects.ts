export const projects = [
  {
    slug: "ewc-care-app",
    name: "EWC Care App",
    subtitle: "Full-Stack Pastoral Care Management PWA",
    description:
      "A comprehensive pastoral care management system for Empowerment Worship Centre. Built for Community Pastors and Circle Guides to manage church members, track pastoral care activities, monitor attendance, handle case management, and support spiritual growth initiatives.",
    longDescription:
      "Production PWA serving 5+ communities with real-time data synchronization, role-based access control, and AI-powered insights. Manages member data, care interactions, attendance tracking, case management, and spiritual growth initiatives.",
    liveUrl: null,
    githubUrl: "https://github.com/nana-yaw",
    featured: true,

    stats: {
      databaseTables: 42,
      databaseIndexes: 92,
      tests: "280+",
      testFiles: 53,
      rbacRoles: 6,
      securityLayers: 6,
      dataSync: "Real-time",
    },

    techStack: [
      "Next.js 16",
      "React 19",
      "TypeScript 5",
      "Convex",
      "Tailwind CSS 4",
      "Radix UI",
      "Google Gemini AI",
      "Web Push",
      "Vitest",
      "Playwright",
    ],

    features: [
      {
        name: "GPS Geofenced Check-In",
        description:
          "Haversine distance calculation with spoofing detection. Members check in within verified venue boundaries. QR code self-check-in and manual search.",
        category: "attendance",
      },
      {
        name: "AI-Powered Insights",
        description:
          "Gemini-powered pastoral analytics generating actionable care recommendations from interaction patterns.",
        category: "ai",
      },
      {
        name: "Enterprise Audit Logging",
        description:
          "Immutable audit log with SHA-256 integrity chain. 7-year retention. Compliance-ready.",
        category: "security",
      },
      {
        name: "QR Code Attendance",
        description:
          "Dynamic QR token generation with expiration. Self-service check-in for members via any device.",
        category: "attendance",
      },
      {
        name: "Push Notifications",
        description:
          "VAPID web push with in-app notification center. Birthday alerts, care reminders, follow-up scheduling.",
        category: "engagement",
      },
      {
        name: "Offline PWA",
        description:
          "Service worker caching, install prompt, offline-first architecture. Responsive with dark/light theme support.",
        category: "pwa",
      },
      {
        name: "6-Role RBAC + ABAC",
        description:
          "Hybrid RBAC+ABAC permission system. Super admin, pastor, discovery lead, circle guide, staff, viewer. 12 resources, PII field filtering by role, custom permission scoping.",
        category: "security",
      },
      {
        name: "Case Management",
        description:
          "Pastoral care cases with priority, status workflow, assignee tracking, activity timelines, and internal notes.",
        category: "care",
      },
    ],

    screenshots: [
      {
        src: "/screenshots/landing-hero.png",
        alt: "Landing page hero with pastoral care messaging",
        device: "desktop",
      },
      {
        src: "/screenshots/landing-dashboard-preview.png",
        alt: "Stats bar and care pledge section",
        device: "desktop",
      },
      {
        src: "/screenshots/landing-journey.png",
        alt: "Discipleship growth track: Born, Grow, Serve, Lead, Multiply",
        device: "desktop",
      },
      {
        src: "/screenshots/onboarding.png",
        alt: "Circle lookup and onboarding flow",
        device: "desktop",
      },
      {
        src: "/screenshots/sign-in.png",
        alt: "Magic link email authentication",
        device: "desktop",
      },
      {
        src: "/screenshots/mobile-landing.png",
        alt: "Mobile responsive landing page",
        device: "mobile",
      },
      {
        src: "/screenshots/dashboard.png",
        alt: "Pastoral care dashboard with stats, care trend, and follow-ups",
        device: "desktop",
      },
      {
        src: "/screenshots/dashboard-dark.png",
        alt: "Dashboard in dark mode with weekly care trend chart",
        device: "desktop",
      },
      {
        src: "/screenshots/members-dark.png",
        alt: "Members management table with filters and stats",
        device: "desktop",
      },
      {
        src: "/screenshots/care-dark.png",
        alt: "Care activity feed with interaction logs and follow-ups",
        device: "desktop",
      },
      {
        src: "/screenshots/attendance-dark.png",
        alt: "Attendance analytics with demographics and check-in methods",
        device: "desktop",
      },
    ],

    architecture: {
      layers: [
        {
          name: "Client",
          tech: "Next.js 16 + React 19",
          details: "App Router, RSC, PWA with service worker",
        },
        {
          name: "Real-time",
          tech: "Convex",
          details:
            "Subscriptions, optimistic updates, serverless functions",
        },
        {
          name: "Auth & Security",
          tech: "Convex Auth + RBAC",
          details:
            "Magic link, 6 roles, ABAC scoping, PII projection, rate limiting",
        },
        {
          name: "Data",
          tech: "Convex DB",
          details:
            "42 tables, 92 indexes, denormalized counters, soft delete, SHA-256 audit chain",
        },
      ],
    },

    testing: {
      unit: "Vitest, 36 files: 24 security (RBAC, PII, rate limiting, XSS, encryption), 4 core domain, 8 features & utils",
      e2e: "Python Playwright, 17 files: check-in flows, visitor tracking, salvation decisions, circle guide management, geofence+QR",
      mutation:
        "Stryker, security-focused mutation testing for critical logic",
      security:
        "24 dedicated files: RBAC enforcement, PII projection, rate limiting, auth guards, XSS prevention, XLSX sanitization, OWASP fixes",
    },

    // Sanitized from docs/ewc-architecture-portfolio.md — no internal thresholds
    securityLayers: [
      { name: "Input Validation", detail: "String length limits, email format validation, enum constraints, bounded pagination" },
      { name: "Rate Limiting", detail: "Sliding window algorithm on authentication and public endpoints" },
      { name: "PII Projection", detail: "Role-based field filtering strips sensitive data before client response" },
      { name: "HTML Sanitization", detail: "DOMPurify on all user-generated content" },
      { name: "Enterprise Audit", detail: "Immutable SHA-256 chain with tamper-evident linking and regulatory retention" },
      { name: "Geolocation Verification", detail: "Haversine geofence validation with multi-signal spoofing detection" },
    ],

    // Security audit pass list (for terminal theme)
    securityAudit: [
      { check: "RBAC enforcement", detail: "6 roles, 12 resources, scope isolation" },
      { check: "PII projection", detail: "Sensitive fields filtered by role" },
      { check: "Input validation", detail: "Bounded strings, enums, pagination limits" },
      { check: "Rate limiting", detail: "Sliding window on auth and public endpoints" },
      { check: "HTML sanitization", detail: "DOMPurify on all user content" },
      { check: "Audit integrity", detail: "SHA-256 chain with tamper detection" },
      { check: "Geofence verification", detail: "Haversine + multi-signal spoofing detection" },
      { check: "Mutation testing", detail: "Security logic survives code mutations" },
    ],

    rbacRoles: [
      { role: "Super Admin", scope: "Full system access, role impersonation" },
      { role: "Pastor", scope: "Community-level: members, circles, cases" },
      { role: "Discovery Lead", scope: "Visitors, first-timers, discipleship" },
      { role: "Circle Guide", scope: "Assigned circle members only" },
      { role: "Staff", scope: "Read-only across most resources" },
      { role: "Viewer", scope: "Dashboard and reports only" },
    ],

    authFlow: [
      "Magic link email authentication (passwordless)",
      "Email whitelist so only pre-authorized users can sign in",
      "Session management with configurable idle timeout",
      "Client-side idle detection: warning, lock screen, auto-logout",
      "Auto-accepts pending invitations on first login",
    ],

    tableCategories: [
      { name: "Core Data", count: 8, key: "Members, communities, circles, global stats" },
      { name: "Care System", count: 8, key: "Care interactions, cases (8 statuses, 4 priorities)" },
      { name: "Attendance", count: 9, key: "Attendance records, venue geofences, QR tokens, visitors" },
      { name: "Auth & Access Control", count: 6, key: "Roles, custom permissions, impersonation, email whitelist" },
      { name: "Activity & Notifications", count: 6, key: "Activity log (21 action types), AI insights, push" },
      { name: "Circle Management", count: 4, key: "Assignment history, circle events, shareable links" },
      { name: "Enterprise Audit", count: 3, key: "Immutable audit log (SHA-256), soft-delete registry, archives" },
    ],

    // Security narrative for minimal/editorial theme case study
    securityNarrative:
      "I built a tamper-evident audit log for a church app. Nobody asked me to. The data deserved it. Every mutation goes through a 6-layer defense stack. 24 of the 36 unit test files focus on security. I run mutation testing on auth guards to prove that removing an if statement actually breaks something.",

    // Real code snippet for the terminal theme
    codeSnippet: {
      language: "typescript",
      filename: "convex/attendance/checkIn.ts",
      code: `// Haversine distance: validates check-in is within venue boundary
function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}`,
    },
  },
] as const;
