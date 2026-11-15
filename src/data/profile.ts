export const profile = {
  name: "Edward Osei-Nyarko",
  firstName: "Edward",
  lastName: "Osei-Nyarko",
  brandExpansion: "Edward Osei-Nyarko",
  title: "Software Developer",
  tagline: "I studied physics, then I learned to code. Now I build systems that solve real problems.",
  taglines: {
    cinematic: "Physics taught me systems. Code lets me build them.",
    minimal: "I studied physics, then I learned to code. Now I build systems that solve real problems.",
    bold: "Software developer. Problem-first thinker.",
    terminal: "I write code that serves communities.",
  },
  email: "edward.osei.nyarko@gmail.com",
  github: "https://github.com/nana-yaw",
  githubHandle: "nana-yaw",
  linkedin: "https://linkedin.com/in/edward-osei-nyarko-5789b3118",
  location: "Ghana",

  origin: {
    short:
      "I went from a physics degree to writing production software. Everything I build starts with the same question: who does this help?",
    long: [
      "I studied physics at the University of Cape Coast in Ghana. For my final project, I programmed an Arduino UNO with C++ to regulate temperature in LDPE plastic moulds. The goal was to turn plastic waste into household products and cut waste across campus.",
      "That project changed everything. I got hooked on the idea that writing code could solve real problems for real people. I chose software development because of what it can do for people's daily lives. The EWC Care App exists because my church community needed better tools for pastoral care. Every project I take on starts with the same question: who does this help?",
    ],
  },

  experience: [
    {
      company: "RentPost, Inc.",
      role: "Backend Engineer",
      location: "Remote, US",
      period: "Jul 2023 - Present",
      current: true,
      // Short forms of the achievements below, for the screen design.
      highlights: [
        "Backend engineer on a subscription software product, building the services behind it.",
        "Cut the time its browser tests take by half.",
      ],
      achievements: [
        // Matched to the pull requests (Edward, 15 Nov 2026): the browser
        // suite went from about 45 to 23 minutes on two workers. Template
        // cloning was the team's pattern for unit tests; Edward brought it to
        // the browser tests.
        "Halved the browser test suite's run time, from about 45 to 23 minutes, by bringing the team's template-cloned PostgreSQL test databases to parallel browser tests",
        "Moved the browser test suite from Cypress to Playwright",
        "Added token sign-in for browser tests, so they skip the sign-in screens",
        "Balanced the parallel test workers using each test's recorded run time, running the slowest tests first",
        "Developed and optimized SaaS APIs using PHP/Symfony with PSR-12 compliance",
        "Implemented interactive onboarding tour with driver.js, improving user adoption",
      ],
    },
    {
      company: "Turntabl Ghana Ltd.",
      role: "Software Engineer",
      location: "Accra, Ghana",
      period: "Jan 2021 - May 2023",
      current: false,
      highlights: [
        "Built a news service that grew from 100 to over 1,000 users.",
        "Mentored junior engineers and wrote the onboarding guides.",
      ],
      achievements: [
        "Built News Aggregator REST API using Spring Boot and Kotlin, scaling from 100 to 1,000+ users after company website integration",
        "Optimized API performance for internal systems; wrote technical documentation for engineer onboarding",
        "Mentored junior engineers on best practices, fostering team growth and improving code quality",
      ],
    },
  ],

  education: {
    degree: "B.Sc. Physics",
    institution: "University of Cape Coast, Ghana",
    year: 2015,
  },

  skills: {
    backend: [
      "PHP",
      "Node.js",
      "TypeScript",
      "JavaScript",
      "SQL",
      "Bash",
    ],
    frameworks: ["Symfony", "Laravel", "Next.js", "React"],
    databases: ["PostgreSQL", "MySQL", "Supabase", "Convex"],
    cloud: ["Docker", "AWS", "Linux", "Nginx", "CI/CD"],
    testing: [
      "Cypress",
      "Playwright",
      "Vitest",
      "PHPUnit",
      "Stryker",
    ],
  },

  stats: {
    yearsExperience: "4+",
    countriesWorked: 2,
  },
} as const;
