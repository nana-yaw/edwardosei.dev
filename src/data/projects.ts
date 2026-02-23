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
      databaseTables: "30+",
      tests: "280+",
      rbacTiers: 5,
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
        name: "5-Tier RBAC",
        description:
          "Hybrid RBAC+ABAC permission system. Super admin, pastor, circle guide, staff, viewer. PII field filtering by role.",
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
            "Magic link, 5-tier roles, PII projection, rate limiting",
        },
        {
          name: "Data",
          tech: "Convex DB",
          details:
            "30+ tables, denormalized counters, soft delete, integrity chain",
        },
      ],
    },

    testing: {
      unit: "Vitest — 280+ tests covering components, security, phone utils, geolocation",
      e2e: "Python Playwright — check-in flows, scheduling, QR display, visitor tracking",
      mutation:
        "Stryker — security-focused mutation testing for critical logic",
      security:
        "Dedicated suite: RBAC enforcement, PII projection, rate limiting, auth guards, XSS prevention",
    },

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
