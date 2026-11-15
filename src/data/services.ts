/* ── Copy for the services list ───────────────────────────── */
// Each row is something a live product or a real job already proves, in an
// owner's words, with a link to read more on this site. The link says "case
// study" so nobody takes it for a way into an app they cannot sign in to. No
// screenshots: some of these features are not public, so pictures of them do
// not go on the site (Edward, 14 Nov 2026). Nothing here says how any product
// is protected or put together inside, and no host or tool is tied to a
// client's product.

import { getClientProject, getFeaturedProject } from "./projects";
import { sections } from "./site";

export interface ProofLink {
  label: string;
  href: string;
}

export interface Proof {
  /** The words before the links: "Read the" or "See". */
  lead: string;
  /** One or two links, never an essay. */
  links: readonly ProofLink[];
}

export interface Service {
  name: string;
  proof: Proof;
}

const sihene = getClientProject("sihene");
const ewc = getFeaturedProject();

// Each link goes to the top of its case study. Those pages have no section
// ids to aim at, and none are to be added just for these links.
const siheneStudy: ProofLink = { label: `${sihene.name} case study`, href: sihene.caseStudy.path };
const ewcStudy: ProofLink = { label: `${ewc.name} case study`, href: ewc.caseStudy.path };

const readThe = (...links: ProofLink[]): Proof => ({ lead: "Read the", links });
// In-page anchors: the jobs and the live products are sections of this page.
const experienceProof: Proof = { lead: "See", links: [{ label: "my experience", href: "#experience" }] };
const liveProof: Proof = { lead: "See", links: [{ label: "the live products", href: "#project" }] };

export const servicesSection = {
  title: sections.skills.title,
  toolsTitle: sections.skills.toolsTitle,
  proofJoin: "or the",
} as const;

export const services: readonly Service[] = [
  {
    name: "Websites and web apps",
    proof: readThe(siheneStudy),
  },
  {
    name: "Taking payments online",
    // No payment provider is named anywhere on the site or the resume (Edward, 14 Nov 2026).
    proof: readThe(siheneStudy),
  },
  {
    name: "Member, staff and admin areas",
    proof: readThe(siheneStudy, ewcStudy),
  },
  {
    name: "Apps that work on phones",
    proof: readThe(ewcStudy),
  },
  {
    name: "Check-in and attendance",
    proof: readThe(ewcStudy),
  },
  {
    name: "AI features inside your app",
    // Edward confirmed on 14 Nov 2026 that the EWC Care App writes summaries as
    // well as insights. The project data only mentions the insights so far.
    proof: readThe(ewcStudy),
  },
  {
    name: "Backend systems and APIs",
    proof: experienceProof,
  },
  {
    name: "Launch and upkeep",
    proof: liveProof,
  },
];
