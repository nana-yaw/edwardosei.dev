import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // three ships untranspiled ESM; Next must compile it for the R3F hero.
  transpilePackages: ["three"],
  // Stops `next dev` (16.4+) from writing AGENTS.md into the project root.
  agentRules: false,
  // Says nothing about the stack to anyone probing the site.
  poweredByHeader: false,
  // Safe defaults that need no per-page tuning. No CSP yet: the hero, the
  // JSON-LD and analytics would each need an allowance, and a wrong policy
  // fails silently for visitors.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // The home page used to live at /portfolio. Old links and bookmarks keep
  // working, section links included: the browser keeps the #part.
  async redirects() {
    return [{ source: "/portfolio", destination: "/", permanent: true }];
  },
};

export default nextConfig;
