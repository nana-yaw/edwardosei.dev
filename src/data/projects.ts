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
        src: "/screenshots/dashboard.png",
        alt: "Dashboard with shepherd queue and care stats",
        device: "desktop",
      },
      {
        src: "/screenshots/checkin.png",
        alt: "Check-in station with live attendance",
        device: "desktop",
      },
      {
        src: "/screenshots/members.png",
        alt: "Member management with search and filters",
        device: "desktop",
      },
      {
        src: "/screenshots/mobile-dashboard.png",
        alt: "Mobile dashboard view",
        device: "mobile",
      },
      {
        src: "/screenshots/case-detail.png",
        alt: "Case detail with activity timeline",
        device: "desktop",
      },
      {
        src: "/screenshots/attendance-analytics.png",
        alt: "Attendance trends and analytics",
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
      unit: "Vitest — 36 files: 24 security (RBAC, PII, rate limiting, XSS, encryption), 4 core domain, 8 features & utils",
      e2e: "Python Playwright — 17 files: check-in flows, visitor tracking, salvation decisions, circle guide management, geofence+QR",
      mutation:
        "Stryker — security-focused mutation testing for critical logic",
      security:
        "24 dedicated files: RBAC enforcement, PII projection, rate limiting, auth guards, XSS prevention, XLSX sanitization, OWASP fixes",
    },

    // Detailed architecture data from docs/ewc-architecture.md
    securityLayers: [
      { name: "Input Validation", detail: "String limits, email regex, enum validation, pagination max 200" },
      { name: "Rate Limiting", detail: "Sliding window — auth emails: 3/15min" },
      { name: "PII Projection", detail: "8 sensitive fields filtered by role before response" },
      { name: "HTML Sanitization", detail: "DOMPurify for all user-generated content" },
      { name: "Enterprise Audit", detail: "SHA-256 chain, sequence verification, 7-year retention" },
      { name: "Geolocation Validation", detail: "Haversine geofence + spoofing detection (accuracy, timezone, staleness)" },
    ],

    rbacRoles: [
      { role: "super_admin", level: 100, scope: "Full system access, impersonation" },
      { role: "pastor", level: 50, scope: "Community-level: members, circles, cases" },
      { role: "discovery_lead", level: 30, scope: "Visitors, first-timers, discipleship" },
      { role: "circle_guide", level: 25, scope: "Assigned circle members only" },
      { role: "staff", level: 10, scope: "Read-only across most resources" },
      { role: "viewer", level: 5, scope: "Dashboard and reports only" },
    ],

    authFlow: [
      "Email entered at /sign-in",
      "Rate limit: 3 emails per 15 min (sliding window)",
      "Checked against authorizedEmails whitelist",
      "Magic link via Resend (24-hour validity)",
      "Session: 7-day lifetime, 6-hour inactivity, 15-min JWT",
      "Auto-accepts pending invitations on first login",
    ],

    tableCategories: [
      { name: "Core Data", count: 8, key: "members (13 indexes), communities, circles" },
      { name: "Care System", count: 8, key: "careInteractions, cases (8 statuses, 4 priorities)" },
      { name: "Attendance", count: 9, key: "attendanceRecords (7 indexes), venueLocations" },
      { name: "Auth & RBAC", count: 6, key: "userRoles, customPermissions, impersonation" },
      { name: "Activity & Notifications", count: 6, key: "activityLog (21 action types), aiInsights" },
      { name: "Circle Management", count: 4, key: "assignmentHistory, sundayEvents, shareLinks" },
      { name: "Enterprise Audit", count: 3, key: "auditLog (SHA-256), softDeleteRegistry, archivedRecords" },
    ],

    // Real code snippet for the terminal theme
    codeSnippet: {
      language: "typescript",
      filename: "convex/attendance/checkIn.ts",
      code: `// Haversine distance — validates check-in is within venue boundary
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
