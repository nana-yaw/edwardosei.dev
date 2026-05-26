import type { Metadata } from "next";
import Image from "next/image";
import { profile } from "@/data/profile";
import { getFeaturedProject, getAlsoBuiltProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "Portfolio (Print)",
  description: "Print-optimized portfolio for Edward Osei-Nyarko",
  robots: "noindex",
};

export default function PrintPortfolio() {
  const featured = getFeaturedProject();
  const alsoBuilt = getAlsoBuiltProjects();
  const bootcamp = alsoBuilt.find((p) => p.slug === "teams-bootcamp");
  const naat = alsoBuilt.find((p) => p.slug === "naat-foundation");

  return (
    <div className="print-portfolio">
      <style>{printStyles}</style>

      {/* ── Hero ───────────────────────────────────── */}
      <header className="hero">
        <div className="hero-top">
          <Image
            src="/photos/edward.jpg"
            alt={profile.name}
            width={72}
            height={72}
            className="avatar"
          />
          <div>
            <h1>{profile.name}</h1>
            <p className="subtitle">{profile.title}</p>
            <p className="tagline">{profile.taglines.minimal}</p>
          </div>
        </div>
        <div className="meta-row">
          <span>{profile.location}</span>
          <span>edwardoseidev.vercel.app</span>
        </div>
      </header>

      {/* ── Case Study 1: EWC Care App ─────────────── */}
      <section className="case-study">
        <div className="case-label">Case Study 01</div>
        <div className="project-header">
          <h2>{featured.name}</h2>
          <span className="badge production">In Production</span>
        </div>
        <p className="project-subtitle">{featured.subtitle}</p>

        <p className="narrative">{featured.securityNarrative}</p>

        <div className="stats-grid">
          <div className="stat">
            <span className="stat-number">{featured.stats.databaseTables}</span>
            <span className="stat-label">Tables</span>
          </div>
          <div className="stat">
            <span className="stat-number">{featured.stats.databaseIndexes}</span>
            <span className="stat-label">Indexes</span>
          </div>
          <div className="stat">
            <span className="stat-number">{featured.stats.tests}</span>
            <span className="stat-label">Tests</span>
          </div>
          <div className="stat">
            <span className="stat-number">{featured.stats.securityLayers}</span>
            <span className="stat-label">Security Layers</span>
          </div>
          <div className="stat">
            <span className="stat-number">{featured.stats.rbacRoles}</span>
            <span className="stat-label">RBAC Roles</span>
          </div>
        </div>

        {/* Screenshots with captions */}
        <div className="screenshots-captioned">
          <figure>
            <Image
              src="/screenshots/dashboard.png"
              alt="Pastoral care dashboard"
              width={340}
              height={200}
              className="screenshot"
            />
            <figcaption>Dashboard: care trends, follow-ups due, and attendance at a glance</figcaption>
          </figure>
          <figure>
            <Image
              src="/screenshots/care-dark.png"
              alt="Care activity feed"
              width={340}
              height={200}
              className="screenshot"
            />
            <figcaption>Care feed: interaction logs with call/message tracking per member</figcaption>
          </figure>
          <figure>
            <Image
              src="/screenshots/members-dark.png"
              alt="Members management"
              width={340}
              height={200}
              className="screenshot"
            />
            <figcaption>Members table: filterable by community, circle, and role</figcaption>
          </figure>
          <figure>
            <Image
              src="/screenshots/attendance-dark.png"
              alt="Attendance analytics"
              width={340}
              height={200}
              className="screenshot"
            />
            <figcaption>Attendance analytics: demographics, check-in methods, trends</figcaption>
          </figure>
        </div>

        {/* Architecture */}
        <h3>Architecture</h3>
        <div className="arch-layers">
          {featured.architecture.layers.map((layer) => (
            <div key={layer.name} className="arch-layer">
              <strong>{layer.name}</strong>
              <span className="arch-tech">{layer.tech}</span>
              <span className="arch-detail">{layer.details}</span>
            </div>
          ))}
        </div>

        {/* Security */}
        <h3>Security: 6-Layer Defense in Depth</h3>
        <div className="security-list">
          {featured.securityLayers.map((layer, i) => (
            <div key={layer.name} className="security-item">
              <span className="security-num">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <strong>{layer.name}</strong>
                <span className="security-detail">{layer.detail}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h3>Capabilities</h3>
        <div className="features-grid">
          {featured.features.map((f) => (
            <div key={f.name} className="feature">
              <strong>{f.name}</strong>
              <p>{f.description}</p>
            </div>
          ))}
        </div>

        <p className="tech-tags">{featured.techStack.join(" · ")}</p>
      </section>

      {/* ── Case Study 2: Teams Bootcamp ───────────── */}
      {bootcamp && (
        <section className="case-study">
          <div className="case-label">Case Study 02</div>
          <div className="project-header">
            <h2>{bootcamp.name}</h2>
            <span className="badge production">In Production</span>
          </div>
          <p className="project-subtitle">{bootcamp.subtitle}</p>
          <p className="narrative">{bootcamp.description}</p>

          <div className="screenshots-captioned two-up">
            {bootcamp.screenshots && bootcamp.screenshots[0] && (
              <figure>
                <Image
                  src={bootcamp.screenshots[0]}
                  alt="Live leaderboard"
                  width={340}
                  height={200}
                  className="screenshot"
                />
                <figcaption>Projector leaderboard: live squad standings during the event</figcaption>
              </figure>
            )}
            {bootcamp.screenshots && bootcamp.screenshots[4] && (
              <figure>
                <Image
                  src={bootcamp.screenshots[4]}
                  alt="Leaders dashboard"
                  width={340}
                  height={200}
                  className="screenshot"
                />
                <figcaption>Leaders dashboard: 20 ministry teams with filtering and Excel export</figcaption>
              </figure>
            )}
          </div>

          <h3>What I Built</h3>
          <ul>
            {bootcamp.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          <p className="tech-tags">{bootcamp.techStack.join(" · ")}</p>
          {bootcamp.liveUrl && (
            <p className="project-link">Live: {bootcamp.liveUrl}</p>
          )}
        </section>
      )}

      {/* ── Case Study 3: NAAT Foundation ──────────── */}
      {naat && (
        <section className="case-study">
          <div className="case-label">Case Study 03</div>
          <div className="project-header">
            <h2>{naat.name}</h2>
          </div>
          <p className="project-subtitle">{naat.subtitle}</p>
          <p className="narrative">{naat.description}</p>

          <div className="screenshots-captioned two-up">
            {naat.screenshots && naat.screenshots[0] && (
              <figure>
                <Image
                  src={naat.screenshots[0]}
                  alt="NAAT homepage"
                  width={340}
                  height={200}
                  className="screenshot"
                />
                <figcaption>Homepage: hero slider with seasonal theme (Kwanzaa)</figcaption>
              </figure>
            )}
            {naat.screenshots && naat.screenshots[2] && (
              <figure>
                <Image
                  src={naat.screenshots[2]}
                  alt="NAAT about page"
                  width={340}
                  height={200}
                  className="screenshot"
                />
                <figcaption>About page: founder quote and mission statement</figcaption>
              </figure>
            )}
          </div>

          <h3>What I Built</h3>
          <ul>
            {naat.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>

          <p className="tech-tags">{naat.techStack.join(" · ")}</p>
        </section>
      )}

      {/* ── Origin Story ──────────────────────────── */}
      <section className="origin">
        <div className="case-label">About</div>
        <h2>From Physics to Code</h2>
        {profile.origin.long.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <p className="education">
          {profile.education.degree} &mdash; {profile.education.institution} ({profile.education.year})
        </p>
      </section>

      {/* ── Contact ────────────────────────────────── */}
      <footer className="contact-footer">
        <div className="contact-inner">
          <p className="contact-cta">See the live portfolio with interactive themes, animations, and full project showcases.</p>
          <div className="contact-links">
            <span><strong>Web:</strong> edwardoseidev.vercel.app</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Styles ──────────────────────────────────────────── */
const printStyles = `
  .print-portfolio {
    max-width: 760px;
    margin: 0 auto;
    padding: 32px 24px;
    font-family: "Inter", system-ui, -apple-system, sans-serif;
    font-size: 10.5pt;
    line-height: 1.55;
    color: #1a1a2e;
    background: #ffffff;
  }

  /* ── Typography ───────────────────────────── */
  h1 {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 26pt;
    margin: 0;
    color: #1a1a2e;
    letter-spacing: -0.5px;
  }

  h2 {
    font-family: "Playfair Display", Georgia, serif;
    font-size: 18pt;
    color: #1a1a2e;
    margin: 0;
  }

  h3 {
    font-size: 11pt;
    color: #1a1a2e;
    margin: 18px 0 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e5e5e0;
    padding-bottom: 4px;
  }

  p {
    margin: 6px 0;
    color: #333;
  }

  /* ── Hero ──────────────────────────────────── */
  .hero {
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 2px solid #1a1a2e;
  }

  .hero-top {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 8px;
  }

  .avatar {
    border-radius: 50%;
    width: 72px;
    height: 72px;
    object-fit: cover;
  }

  .subtitle {
    font-size: 10pt;
    color: #555;
    margin: 2px 0 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .tagline {
    font-size: 10.5pt;
    color: #444;
    font-style: italic;
    margin: 4px 0 0;
  }

  .meta-row {
    display: flex;
    gap: 20px;
    font-size: 8.5pt;
    color: #777;
  }

  /* ── Case Study ────────────────────────────── */
  .case-study {
    margin: 12px 0;
    padding-top: 8px;
  }

  .case-study:first-of-type {
    margin-top: 4px;
  }

  .case-label {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #999;
    margin-bottom: 4px;
  }

  .project-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 2px;
  }

  .project-subtitle {
    font-size: 10pt;
    color: #555;
    margin: 0 0 6px;
  }

  .narrative {
    font-size: 10.5pt;
    color: #333;
    margin: 8px 0 12px;
    line-height: 1.6;
  }

  .badge {
    font-size: 7.5pt;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 600;
    white-space: nowrap;
  }

  .badge.production {
    background: #e8f5e9;
    color: #2e7d32;
  }

  /* ── Stats ─────────────────────────────────── */
  .stats-grid {
    display: flex;
    gap: 8px;
    margin: 12px 0;
  }

  .stat {
    flex: 1;
    text-align: center;
    padding: 8px 4px;
    border: 1px solid #e5e5e0;
    border-radius: 4px;
    background: #fafaf9;
  }

  .stat-number {
    display: block;
    font-size: 18pt;
    font-weight: 700;
    color: #1a1a2e;
  }

  .stat-label {
    font-size: 7pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #777;
  }

  /* ── Screenshots with Captions ─────────────── */
  .screenshots-captioned {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 12px 0;
  }

  .screenshots-captioned.two-up {
    grid-template-columns: 1fr 1fr;
  }

  figure {
    margin: 0;
  }

  .screenshot {
    width: 100%;
    height: auto;
    border-radius: 4px;
    border: 1px solid #e5e5e0;
    object-fit: cover;
  }

  figcaption {
    font-size: 7.5pt;
    color: #888;
    margin-top: 4px;
    font-style: italic;
    line-height: 1.3;
  }

  /* ── Architecture ──────────────────────────── */
  .arch-layers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin: 6px 0;
  }

  .arch-layer {
    padding: 8px;
    border: 1px solid #e5e5e0;
    border-radius: 4px;
    background: #fafaf9;
  }

  .arch-layer strong {
    display: block;
    font-size: 9.5pt;
    color: #1a1a2e;
  }

  .arch-tech {
    display: block;
    font-size: 8.5pt;
    color: #555;
  }

  .arch-detail {
    font-size: 8pt;
    color: #777;
  }

  /* ── Security ──────────────────────────────── */
  .security-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 6px;
    margin: 6px 0;
  }

  .security-item {
    display: flex;
    gap: 6px;
    font-size: 8.5pt;
    padding: 6px;
    border-left: 2px solid #1a1a2e;
    background: #fafaf9;
  }

  .security-num {
    font-size: 7pt;
    color: #999;
    font-weight: 700;
    flex-shrink: 0;
  }

  .security-item strong {
    display: block;
    font-size: 8.5pt;
  }

  .security-detail {
    display: block;
    color: #666;
    font-size: 7.5pt;
    line-height: 1.3;
  }

  /* ── Features ──────────────────────────────── */
  .features-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin: 6px 0;
  }

  .feature {
    padding: 6px 8px;
    border: 1px solid #e5e5e0;
    border-radius: 4px;
  }

  .feature strong {
    font-size: 9pt;
    display: block;
    margin-bottom: 1px;
  }

  .feature p {
    font-size: 8pt;
    color: #666;
    margin: 0;
    line-height: 1.35;
  }

  /* ── Tech Tags ─────────────────────────────── */
  .tech-tags {
    font-size: 8.5pt;
    color: #555;
    margin: 10px 0 4px;
    padding-top: 6px;
    border-top: 1px solid #e5e5e0;
  }

  .project-link {
    font-size: 8.5pt;
    color: #555;
  }

  /* ── Lists ─────────────────────────────────── */
  ul {
    padding-left: 16px;
    margin: 6px 0;
  }

  li {
    margin-bottom: 3px;
    font-size: 9.5pt;
    color: #333;
    line-height: 1.45;
  }

  /* ── Origin ────────────────────────────────── */
  .origin {
    margin: 12px 0;
    padding-top: 8px;
  }

  .origin p {
    font-size: 10pt;
    line-height: 1.6;
  }

  .education {
    font-style: italic;
    color: #555;
    margin-top: 10px;
    font-size: 9.5pt;
  }

  /* ── Contact Footer ────────────────────────── */
  .contact-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 2px solid #1a1a2e;
  }

  .contact-cta {
    font-size: 10pt;
    color: #444;
    font-style: italic;
    margin-bottom: 8px;
  }

  .contact-links {
    display: flex;
    gap: 24px;
    font-size: 9pt;
    color: #555;
  }

  .contact-links strong {
    color: #1a1a2e;
  }

  /* ── Print Overrides ───────────────────────── */
  @media print {
    .print-portfolio {
      padding: 0;
      max-width: none;
    }

    /* Allow case studies to break across pages */
    .case-study {
      break-inside: auto;
    }

    /* Prevent breaks inside smaller components */
    .stats-grid,
    .arch-layers,
    .security-list,
    figure,
    .feature,
    .arch-layer,
    .security-item,
    .origin {
      break-inside: avoid;
    }

    @page {
      margin: 0.45in 0.55in;
    }
  }
`;
