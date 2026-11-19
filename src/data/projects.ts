/* ── Project data layer ───────────────────────────────────── */

/* ── Shared base ──────────────────────────────────────────── */
interface ProjectBase {
  slug: string;
  name: string;
  subtitle: string;
  /** One or two plain sentences for the screen design. */
  summary: string;
  /** The one capture shown beside the project in the Work section. */
  cover: { src: string; alt: string; width: number; height: number };
  description: string;
  techStack: readonly string[];
  liveUrl: string | null;
  githubUrl: string | null;
}

/* ── Featured project (deep data for full theme showcases) ── */
export interface FeaturedProject extends ProjectBase {
  kind: "featured";
  featured: true;
  longDescription: string;
  stats: {
    databaseTables: number;
    databaseIndexes: number;
    tests: string;
    testFiles: number;
    rbacRoles: number;
    securityLayers: number;
    dataSync: string;
  };
  features: readonly {
    name: string;
    description: string;
    category: string;
  }[];
  screenshots: readonly {
    src: string;
    alt: string;
    device: "desktop" | "mobile";
  }[];
  architecture: {
    layers: readonly {
      name: string;
      tech: string;
      details: string;
    }[];
  };
  testing: {
    unit: string;
    e2e: string;
    mutation: string;
    security: string;
  };
  testingBreakdown: readonly {
    category: string;
    files: number;
    color: "security" | "core" | "feature" | "e2e";
  }[];
  securityLayers: readonly { name: string; detail: string }[];
  securityAudit: readonly { check: string; detail: string }[];
  rbacRoles: readonly { role: string; scope: string }[];
  authFlow: readonly string[];
  tableCategories: readonly { name: string; count: number; key: string }[];
  securityNarrative: string;
  /** One line on why the project exists, set large beside it. */
  statement: string;
  caseStudy: CaseStudyContent;
  codeSnippet: {
    language: string;
    filename: string;
    code: string;
  };
}

/* ── Compact "also built" project ─────────────────────────── */
export interface AlsoBuiltProject extends ProjectBase {
  kind: "also-built";
  featured: false;
  highlights: readonly string[];
  screenshot?: string;
  screenshots?: readonly string[];
}

/* ── Case study (the long form of a project, on its own page) ── */
// Written for a business owner. No detail of how a product is protected,
// hosted or put together inside.
interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export interface CaseStudyContent {
  path: string;
  lede: string;
  visitLabel: string;
  facts: readonly { label: string; value: string }[];
  /** Three short statements: where it started, what was built, how. */
  rows: readonly { title: string; body: string }[];
  surfacesTitle: string;
  surfaces: readonly { name: string; detail: string }[];
  figuresTitle: string;
  figures: readonly { value: string; label: string }[];
  /** Where the figures come from, when that needs saying. */
  figuresNote?: string;
  desktop: Shot;
  mobile: Shot;
  /** A second pair of captures, shown further down. */
  more?: { desktop: Shot; mobile: Shot };
}

/* ── Client project (named client work) ── */
export interface ClientProject extends ProjectBase {
  kind: "client";
  featured: false;
  caseStudy: CaseStudyContent;
}

export type Project = FeaturedProject | AlsoBuiltProject | ClientProject;

/* ── Data ─────────────────────────────────────────────────── */

const projects: readonly Project[] = [
  /* ── Si Hene — client work, live ───────────────────────── */
  // Public facts only, in a business owner's words. No staff names, hosts,
  // admin paths, limits, prices, or detail of how the product is protected.
  {
    kind: "client",
    slug: "sihene",
    name: "Si Hene",
    subtitle:
      "A cultural centre's website, members' area and staff area, built from the owner's mockups",
    summary:
      "The owner of Si Hene, a membership cultural centre in Accra, gave me mockups and a list of what people should be able to do. I built the product in five weeks, live payments included.",
    description:
      "The owner had mockups of the screens and a list of what visitors, members and staff should each be able to do. I turned those into the working product: the public website, a members' area, a staff area, and live online payments.",
    // Only what a visitor to the site can already see. Where the product's
    // data lives and what hosts it stay off, at Edward's request.
    techStack: ["Next.js", "React", "TypeScript"],
    cover: {
      src: "/screenshots/sihene/home-desktop.png",
      alt: "Si Hene home page on a desktop screen",
      width: 1425,
      height: 900,
    },
    liveUrl: "https://sihene.com",
    githubUrl: null,
    featured: false,
    caseStudy: {
      path: "/work/sihene",
      lede: "A cultural centre's website, members' area and staff area, built from the owner's mockups.",
      visitLabel: "Visit sihene.com",
      facts: [
        { label: "Role", value: "Sole developer" },
        { label: "Live since", value: "30 October 2026" },
      ],
      rows: [
        {
          title: "What the owner brought",
          body: "The owner had mockups of the screens and a list of what visitors, members and staff should each be able to do.",
        },
        {
          title: "What I built",
          // Dates from the project's git history (Edward, 15 Nov 2026): the
          // first commit of the full product on 25 September, live on 30 October.
          body: "I turned those into the working product: the public website, a members' area, a staff area, and live online payments. I started building on 25 September and it went live on 30 October, five weeks later. I have kept improving it every week since.",
        },
        {
          title: "How I built it",
          body: "I use AI models and build agents to draft the code. I read, test and release every change myself, and I answer for the result.",
        },
      ],
      surfacesTitle: "One product, three audiences",
      surfaces: [
        {
          name: "Public site",
          detail: "The centre, its membership, events and places, open to anyone.",
        },
        {
          name: "Members' area",
          detail:
            "My Si Hene, where members reserve, contribute and use the Digital Toolkit.",
        },
        {
          name: "Staff area",
          detail: "Where the centre's team runs the site day to day.",
        },
      ],
      figuresTitle: "The size of it",
      figures: [
        { value: "132", label: "pages built" },
        { value: "822", label: "automated test files" },
        { value: "3", label: "areas: public, members, staff" },
      ],
      figuresNote: "Counted from the project on 14 November 2026.",
      desktop: {
        src: "/screenshots/sihene/home-desktop.png",
        alt: "Si Hene home page on a desktop screen",
        width: 1425,
        height: 900,
      },
      mobile: {
        src: "/screenshots/sihene/home-mobile.png",
        alt: "Si Hene home page on a phone",
        width: 375,
        height: 844,
      },
      more: {
        desktop: {
          src: "/screenshots/sihene/places-desktop.png",
          alt: "Si Hene Places and Knowledge page on a desktop screen",
          width: 1425,
          height: 900,
        },
        mobile: {
          src: "/screenshots/sihene/places-mobile.png",
          alt: "Si Hene Places and Knowledge page on a phone",
          width: 375,
          height: 844,
        },
      },
    },
  },

  {
    kind: "featured",
    slug: "ewc-care-app",
    name: "EWC Care App",
    subtitle: "Full-Stack Pastoral Care Management PWA",
    summary:
      "A care app for Empowerment Worship Centre. Pastors and group leaders use it to track members, visits, attendance and follow-ups.",
    description:
      "A comprehensive pastoral care management system for Empowerment Worship Centre. Built for Community Pastors and Circle Guides to manage church members, track pastoral care activities, monitor attendance, handle case management, and support spiritual growth initiatives.",
    longDescription:
      "Production PWA serving 5 communities with real-time data synchronization, role-based access control, and AI-powered insights. Manages member data, care interactions, attendance tracking, case management, and spiritual growth initiatives.",
    cover: {
      src: "/screenshots/dashboard-dark.png",
      alt: "EWC Care App dashboard with the weekly care trend and follow-ups",
      width: 1440,
      height: 900,
    },
    liveUrl: "https://ewcareapp.online",
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
          "Gemini-powered pastoral analytics: summaries of care records and actionable care recommendations from interaction patterns.",
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

    testingBreakdown: [
      { category: "Security (Unit)", files: 24, color: "security" },
      { category: "Core Domain (Unit)", files: 4, color: "core" },
      { category: "Features & Utils (Unit)", files: 8, color: "feature" },
      { category: "E2E (Playwright)", files: 17, color: "e2e" },
    ],

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

    statement:
      "It exists because my church community needed better tools for pastoral care.",

    // Plain words only: what it is for and what people do with it.
    caseStudy: {
      path: "/work/ewc-care-app",
      lede: "A care app for a church, built by me alone from the first screen to launch.",
      visitLabel: "Visit ewcareapp.online",
      facts: [
        { label: "Role", value: "Sole developer" },
        { label: "Built for", value: "Empowerment Worship Centre" },
      ],
      rows: [
        {
          title: "Why it exists",
          body: "My church community needed better tools for pastoral care, so I built them.",
        },
        {
          title: "What I built",
          body: "An app pastors and group leaders open on their phones to see their members, record care, take attendance and follow up on cases.",
        },
        {
          title: "How I built it",
          body: "Alone. I planned it, built every screen and launched it, and it is live today.",
        },
      ],
      surfacesTitle: "What people do with it",
      surfaces: [
        {
          name: "Check in",
          detail:
            "Members check in at a service from their own phone, by scanning a code or by being at the venue.",
        },
        {
          name: "Care and follow-up",
          detail:
            "Pastors log visits and calls, open cases and get reminders to follow up.",
        },
        {
          name: "Notifications",
          detail:
            "It sends notifications to the phone for birthdays, care reminders and follow-ups.",
        },
        {
          name: "Summaries and insights",
          detail: "It uses AI to turn the care records into summaries and insights for the team.",
        },
        {
          name: "Works offline",
          detail: "It installs like an app and keeps working when the signal drops.",
        },
      ],
      figuresTitle: "The size of it",
      figures: [
        { value: "280+", label: "automated tests" },
        { value: "5", label: "communities served" },
        { value: "6", label: "kinds of user, each with their own view" },
      ],
      desktop: {
        src: "/screenshots/dashboard-dark.png",
        alt: "EWC Care App dashboard with the weekly care trend and follow-ups",
        width: 1440,
        height: 900,
      },
      mobile: {
        src: "/screenshots/mobile-landing.png",
        alt: "EWC Care App welcome page on a phone",
        width: 375,
        height: 812,
      },
      more: {
        desktop: {
          src: "/screenshots/ewc-journey-placed.png",
          alt: "EWC Care App telling a new member which community and circle they are in, on a desktop screen",
          width: 1440,
          height: 900,
        },
        mobile: {
          src: "/screenshots/mobile-onboarding.png",
          alt: "EWC Care App circle lookup on a phone",
          width: 375,
          height: 812,
        },
      },
    },

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

  /* ── Teams Bootcamp — real-time event management ────────── */
  {
    kind: "also-built",
    slug: "teams-bootcamp",
    name: "EWC Teams Bootcamp",
    subtitle: "Real-time event scoring & volunteer management for 100+ attendees",
    summary:
      "Live scoring and volunteer sign-up for a church bootcamp with over 100 attendees.",
    description:
      "A production event management system built for a live church bootcamp. 4 competing squads, 20 ministry teams, real-time scoring across projectors and phones, and an admin portal for referees — all synced instantly via Firebase. Used at a real event with 100+ attendees.",
    techStack: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Firebase Realtime DB",
      "Tailwind CSS",
      "Playwright E2E",
      "Vercel",
      "xlsx",
    ],
    cover: {
      src: "/screenshots/bootcamp-leaderboard.png",
      alt: "Teams Bootcamp leaderboard showing the four squads' standings",
      width: 2560,
      height: 1323,
    },
    liveUrl: "https://teambootcampapp.vercel.app",
    githubUrl: "https://github.com/nana-yaw",
    featured: false,
    highlights: [
      "4-squad competition system (Wine, Ash, White, Gold) with atomic Firebase transactions preventing race conditions during concurrent signups",
      "Multi-screen architecture: projector leaderboard (/board), referee admin panel, attendee phones — all synced in real-time via Firebase onValue() listeners",
      "FLIP-based leaderboard animations with canvas-confetti effects when squads score — designed for a 16:9 projector display",
      "Leaders dashboard with 20 ministry teams, filter by team/community/role, search, and one-click Excel export (roster + game history)",
      "3-tier PIN-based role system: Team Members select teams, Pastors get elevated views, Senior Pastors access the leaders dashboard with reset controls",
      "QR code projection route (/qr) for attendee self-registration, community integration with the EWC Care App",
    ],
    screenshot: "/screenshots/bootcamp-leaders.png",
    screenshots: [
      "/screenshots/bootcamp-leaderboard.png",
      "/screenshots/bootcamp-admin.png",
      "/screenshots/bootcamp-hub.png",
      "/screenshots/bootcamp-ranks.png",
      "/screenshots/bootcamp-leaders.png",
      "/screenshots/bootcamp-registration-filled.png",
      "/screenshots/bootcamp-registration.png",
    ],
  },
];

/* ── Accessor helpers ─────────────────────────────────────── */

/** Returns the single featured (deep-data) project. */
export function getFeaturedProject(): FeaturedProject {
  const p = projects.find((p): p is FeaturedProject => p.kind === "featured");
  if (!p) throw new Error("No featured project found in data");
  return p;
}

/** Returns all compact "also built" projects. */
export function getAlsoBuiltProjects(): AlsoBuiltProject[] {
  return projects.filter((p): p is AlsoBuiltProject => p.kind === "also-built");
}

/** Returns the client project with this slug. */
export function getClientProject(slug: string): ClientProject {
  const p = projects.find(
    (p): p is ClientProject => p.kind === "client" && p.slug === slug,
  );
  if (!p) throw new Error(`No client project "${slug}" found in data`);
  return p;
}

/** Every project that has a case-study page. */
export function getCaseStudies(): (ClientProject | FeaturedProject)[] {
  return projects.filter(
    (p): p is ClientProject | FeaturedProject => p.kind !== "also-built",
  );
}

/** All projects (every kind). */
export { projects };
