import { CONTACT_EMAIL } from "../constants/appConstants";

export const scenarios = [
  {
    id: "platform",
    label: "Platform Ownership",
    title: "Internal onboarding + profile management services",
    deliveryFocus: "Product-focused backend delivery",
    qualitySignal: "High code review standards",
    proofPoint: "Strong commit output + unit test coverage on team work",
    stack: "Java, Spring Boot, Microservices, API Gateway",
    notes: [
      "Owned architecture and onboarding standards as first engineer",
      "Defined validation flows, navigation logic, and service boundaries",
      "Kept implementation choices aligned to product delivery and maintainability"
    ]
  },
  {
    id: "event",
    label: "Event-Driven Systems",
    title: "Async, streaming, and notification backend delivery",
    deliveryFocus: "Keep services responsive and predictable",
    qualitySignal: "Debuggable async flows",
    proofPoint: "Strong code review and production issue follow-through",
    stack: "Java, CompletableFuture, Event-Driven Patterns",
    notes: [
      "Built async workflows to improve responsiveness under load",
      "Designed progressive data delivery and notification services",
      "Handled incident response with logs, traces, and cross-team coordination"
    ]
  },
  {
    id: "quality",
    label: "Quality + Security",
    title: "Engineering standards at scale",
    deliveryFocus: "Keep teams shipping with high standards",
    qualitySignal: "Code quality + security gates",
    proofPoint: "PR reviews, unit test coverage, and governance consistency",
    stack: "Sonar, Black Duck, SOAR/TAD Governance, PR Reviews",
    notes: [
      "Drove adoption and enforcement of code quality/security gates",
      "Contributed to architecture and compliance review forums",
      "Mentored interns and new engineers through weekly knowledge transfer"
    ]
  }
];

export const projectCards = [
  {
    title: "Mastercard: Agentic Chatbot Platform",
    summary:
      "First engineer on an internal LLM-powered chatbot — defined service architecture, retrieval orchestration, and team onboarding standards for an agentic backend.",
    impact: "Architecture baseline adopted by the team",
    tech: "Java, Spring Boot, LLM Integration, RAG Orchestration"
  },
  {
    title: "Mastercard: Identity Management Platform",
    summary:
      "Owned end-to-end identity and profile management architecture — validation flows, navigation logic, and API integrations used across multiple product teams.",
    impact: "Patterns adopted across multiple teams",
    tech: "Microservices, API Gateway, Spring Security, OAuth2"
  },
  {
    title: "J.P. Morgan: Investor Platform APIs",
    summary:
      "Built secure Java microservices and REST APIs for investor-facing financial data services in a strictly regulated environment.",
    impact: "Supported release quality and strict compliance standards",
    tech: "Java, REST, Async Patterns, TypeScript"
  }
];

export const caseStudies = [
  {
    title: "Transaction Data Platform",
    challenge:
      "Handle transaction data reliably in a regulated environment where correctness and traceability matter.",
    decisions: [
      "Applied API-first contracts with strict validation at boundaries",
      "Implemented retries/idempotency to prevent duplicate transaction actions",
      "Used event-driven processing for resilient downstream updates"
    ],
    owned:
      "Owned service design decisions, integration patterns, and quality expectations through reviews and implementation.",
    tradeoff:
      "Balanced throughput needs against stricter validation and auditability.",
    next:
      "Add deeper load-test coverage and contract-test suites for partner integrations.",
    result:
      "Patterns adopted as team reference; retry and idempotency design eliminated the primary class of duplicate-action incidents in downstream services."
  },
  {
    title: "Internal Chatbot + Knowledge Retrieval",
    challenge:
      "Deliver useful internal chatbot responses while keeping answers relevant, grounded, and safe.",
    decisions: [
      "Built RAG flow with retrieval + prompt layering for response quality",
      "Structured backend orchestration to separate retrieval, prompting, and response formatting",
      "Used strategy-style components so retrieval/LLM providers can evolve independently"
    ],
    owned:
      "Led backend architecture baseline, service structure, and developer onboarding standards.",
    tradeoff:
      "Optimized response quality while controlling latency and operational complexity.",
    next:
      "Introduce retrieval quality scoring and stronger offline evaluation loops.",
    result:
      "Backend architecture baseline delivered and adopted by team; retrieval-augmented flow significantly improved answer relevance and groundedness over baseline prompting."
  },
  {
    title: "Sport Training Data Engine",
    challenge:
      "Turn user goals and workout logs into adaptive, practical training plans with clear progress feedback.",
    decisions: [
      "Designed clear data model boundaries for profiles, logs, and mesocycle planning",
      "Used session state flows + progression logic to keep recommendations consistent",
      "Connected plan generation with user feedback loops for iterative improvement"
    ],
    owned:
      "Owned architecture direction and backend-first implementation across planning and data flows.",
    tradeoff:
      "Balanced flexibility of plan generation with predictable, easy-to-explain outputs.",
    next:
      "Add richer personalization signals and performance analytics for plan quality.",
    result:
      "Personal project — full architecture validated across mesocycle planning, session logging, and adaptive progression flows. Strongest evidence of end-to-end system thinking outside of professional work."
  }
];

export const toolkit = [
  "Java + Spring Boot",
  "Microservice Architecture",
  "REST API Design",
  "React + Vite",
  "JavaScript + TypeScript",
  "HTML + CSS",
  "Responsive UI Delivery",
  "Frontend State + Component Design",
  "Async Processing",
  "Event-Driven Systems",
  "AWS + Azure",
  "Docker + Kubernetes",
  "PostgreSQL/MySQL/Oracle/MongoDB",
  "Unit + Integration Testing",
  "Contract Testing",
  "E2E/API Testing",
  "Testcontainers",
  "CI Quality Gates",
  "Observability (Metrics/Logs/Tracing)"
];

export const toolkitGroups = [
  {
    label: "Backend",
    items: ["Java + Spring Boot", "Spring Security", "Microservice Architecture", "REST API Design", "Async Processing", "Kafka / Event-Driven Systems", "OAuth2 + JWT"]
  },
  {
    label: "Frontend",
    items: ["React + Vite", "JavaScript + TypeScript", "HTML + CSS", "Responsive UI Delivery", "Frontend State + Component Design"]
  },
  {
    label: "Cloud & Infrastructure",
    items: ["AWS + Azure", "Docker + Kubernetes", "PostgreSQL · MySQL · MongoDB · Oracle", "GitHub Actions + CI/CD", "Prometheus + Grafana", "Observability (Logs / Traces / Metrics)"]
  },
  {
    label: "Testing & Quality",
    items: ["Unit + Integration Testing", "Contract Testing", "E2E / API Testing", "Testcontainers", "Sonar + Black Duck", "CI Quality Gates"]
  },
  {
    label: "AI & LLM",
    items: ["AI System Design", "LLM Integration", "Prompt Engineering", "Vector Search & Embeddings", "Anthropic / OpenAI APIs", "Search & Retrieval Systems"]
  }
];

export const architecturePrinciples = [
  "Async Processing",
  "Event-Driven Design",
  "API Gateway",
  "BFF for UI",
  "Retry + Idempotency",
  "Caching Strategy",
  "Long Polling",
  "Strategy Pattern",
  "Microservice Boundaries"
];

const careerTimeline = [
  { period: "March 2021", title: "Joined J.P. Morgan as Intern" },
  { period: "June 2021", title: "Promoted to Software Engineer I" },
  { period: "2022", title: "Promoted to Software Engineer II at J.P. Morgan" },
  { period: "May 2023", title: "Joined Mastercard as Software Engineer II" },
  { period: "February 2026", title: "Promoted to Senior Software Engineer at Mastercard" }
];

const jpMorganPeriods = new Set(["March 2021", "June 2021", "2022"]);

const timelineRolesByPeriod = {
  "March 2021": "Intern",
  "June 2021": "Software I",
  "2022": "Software II",
  "May 2023": "Software II",
  "February 2026": "Senior"
};

const timelineHighlightsByPeriod = {
  "March 2021": ["Frontend delivery as intern", "Production team onboarding"],
  "June 2021": ["Promoted quickly into full-time engineering", "Delivered UI + backend features"],
  "2022": ["Moved into broader backend ownership", "Built secure API integrations"],
  "May 2023": ["Joined Mastercard as SWE II", "Platform-heavy Java service delivery"],
  "February 2026": ["Promoted to Senior in Feb 2026", "Architecture, mentoring, cross-team standards"]
};

const nextTimelineStep = {
  period: "...",
  title: "Want to see your company next?",
  detail: "Open an email draft and let's talk.",
  company: "next",
  role: "Contact me",
  workedOn: [CONTACT_EMAIL]
};

function getTimelineCompany(item) {
  if (item.title.includes("J.P. Morgan") || jpMorganPeriods.has(item.period)) return "jpm";
  if (item.title.includes("Mastercard")) return "mc";
  return "career";
}

function buildTimelineStep(item) {
  return {
    ...item,
    company: getTimelineCompany(item),
    role: timelineRolesByPeriod[item.period] ?? "Career",
    workedOn: timelineHighlightsByPeriod[item.period] ?? ["Backend delivery", "Architecture ownership"]
  };
}

export function getTimelineBadgeText(company) {
  if (company === "jpm") return "JPM";
  if (company === "mc") return "MC";
  return "NEXT";
}

export const timelineGraph = [...careerTimeline.map(buildTimelineStep), nextTimelineStep];

export const externalTracks = [
  {
    name: "Kaggle Competitions",
    url: "https://www.kaggle.com/competitions",
    note: "Exploring active data challenges.",
    easterPet: "cat"
  },
  {
    name: "Devpost Hackathons",
    url: "https://devpost.com/hackathons",
    note: "Tracking hackathons to join with backend-heavy ideas.",
    easterPet: "dog"
  },
  { name: "MLH Events", url: "https://mlh.io/seasons/2026/events", note: "Evaluating upcoming events for project showcases." }
];

export const reliabilitySnapshot = [
  {
    title: "Incident Response",
    detail: "Log analysis, dependency tracing, and cross-team coordination for integration failures."
  },
  {
    title: "Production Debugging",
    detail: "Used logs and tracing to investigate issues; I did not directly own latency/SLO reporting in prior roles."
  },
  {
    title: "Quality Gates",
    detail: "Sonar and Black Duck adoption, rigorous PR reviews, and delivery standards."
  }
];

export const profileSignals = [
  "Promoted to Senior: Feb 2026",
  "Production Backend Ownership",
  "Backend + Platform Ownership in Fintech",
  "Building AI-Powered Systems"
];

export const valueTags = [
  "Java + Spring Boot",
  "Event-Driven + Async Systems",
  "API Design + Platform Ownership",
  "Code Review + Delivery Quality",
  "Mentoring + Architecture Leadership"
];

export const impactHighlights = [
  "Led backend architecture for profile and identity platform serving multiple product teams at Mastercard",
  "Built and owned Java microservices across 5 years in regulated fintech at J.P. Morgan and Mastercard",
  "Architected retrieval-driven LLM backend for internal chatbot — from service structure to team onboarding standards",
  "Delivers frontend when the project calls for it — React, TypeScript, this portfolio is a live example"
];

const hiddenDiagramIds = new Set(["backend_components", "session_state", "user_flow"]);

const diagramSources = import.meta.glob("../../diagrams/*.puml", { eager: true, as: "raw" });

const diagramSummaryByFile = {
  architecture: "End-to-end mobile + backend + RAG + database architecture view.",
  backend_components: "Service/component map showing backend orchestration layers.",
  data_model: "Core relational data model for users, workouts, and mesocycles.",
  rag_flow: "Prompt, vector retrieval, and LLM output sequence for plan generation.",
  session_state: "Workout/session lifecycle state transitions.",
  user_flow: "Primary user journey from onboarding to feedback loop."
};

const diagramValueByFile = {
  architecture: ["Shows system boundaries and ownership zones", "Useful for architecture interviews"],
  backend_components: ["Highlights service decomposition choices", "Shows dependency and integration shape"],
  data_model: ["Demonstrates schema thinking and relationships", "Shows data consistency planning"],
  rag_flow: ["Shows practical LLM integration architecture", "Shows retrieval + prompt control design"],
  session_state: ["Demonstrates lifecycle/state modeling", "Shows transition safety and edge handling"],
  user_flow: ["Connects user goals to backend capabilities", "Shows end-to-end product thinking"]
};

export const architectureWorkItems = Object.entries(diagramSources)
  .map(([path, source]) => {
    const fileMatch = path.match(/([^/\\]+)\.puml$/);
    const file = fileMatch ? fileMatch[1] : "diagram";
    const title = file
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const tags = [
      source.includes("actor ") ? "Actor Flow" : null,
      source.includes("entity ") ? "Data Model" : null,
      source.includes("state") || source.includes("[*]") ? "State Machine" : null,
      source.toLowerCase().includes("rag") ? "RAG" : null,
      source.includes("database ") ? "Database" : null
    ].filter(Boolean);
    const lines = source.split(/\r?\n/).length;
    const components =
      (source.match(/\b(component|database|entity|actor|participant|collections?)\b/gi) || []).length || 1;
    const flows = (source.match(/-->|<--|->|<-|:\s/g) || []).length || 1;
    const complexity = lines > 90 ? "High" : lines > 45 ? "Medium" : "Focused";

    return {
      id: file,
      title,
      summary: diagramSummaryByFile[file] ?? "PlantUML architecture draft.",
      valueProps: diagramValueByFile[file] ?? ["Shows architecture communication clarity", "Supports design discussions"],
      renderedSrc: `${import.meta.env.BASE_URL}diagrams-rendered/${file}.svg`,
      source,
      lines,
      components,
      flows,
      complexity,
      tags: tags.length > 0 ? tags : ["Architecture"]
    };
  })
  .filter((item) => !hiddenDiagramIds.has(item.id))
  .sort((a, b) => a.title.localeCompare(b.title));

export const aboutMe = {
  blurb:
    "Dublin-based Senior Engineer with 5 years in regulated fintech at J.P. Morgan and Mastercard. I build backend systems that scale, stay observable in production, and don't become a liability at handoff. I lead architecture decisions, mentor engineers, and still ship code. Outside work I'm training for UTMB — using my own AI-powered system to build and adapt the plan.",
  facts: [
    { label: "Location", value: "Dublin, Ireland" },
    { label: "Current Role", value: "Senior SE · Mastercard" },
    { label: "Core Stack", value: "Java · Spring Boot · React" },
    { label: "In the Lab", value: "AI-powered backend systems" },
    { label: "Outside Work", value: "UTMB training · Ultrarunning" },
    { label: "Looking For", value: "Senior Backend · Platform Engineering" },
  ],
};

export const experience = [
  {
    role: "Senior Software Engineer",
    company: "Mastercard",
    period: "February 2026 - Present",
    bullets: [
      "Led architecture decisions across Profile and Identity-driven service flows",
      "Owned cross-team implementation standards and technical onboarding direction",
      "Drove PR quality, mentoring, and technical demo/storytelling to stakeholders"
    ]
  },
  {
    role: "Software Engineer II",
    company: "Mastercard",
    period: "May 2023 - January 2026",
    bullets: [
      "Owned Profile Management and onboarding backend services used across teams",
      "Designed identity/profile validation flow, navigation logic, and API integrations",
      "Worked deeply in API Gateway policies, platform tooling, and service governance"
    ]
  },
  {
    role: "Software Engineer II",
    company: "J.P. Morgan, Dublin",
    period: "2022 - April 2023",
    bullets: [
      "Software Engineer II owning backend service delivery in regulated finance",
      "Built secure REST APIs and async Java microservices at production scale",
      "Contributed to testing quality and release confidence in strict governance"
    ]
  },
  {
    role: "Software Engineer I",
    company: "J.P. Morgan, Dublin",
    period: "June 2021 - 2022",
    bullets: [
      "Started frontend-focused and transitioned into backend/full-stack ownership",
      "Designed Java microservices using CompletableFuture async patterns",
      "Built secure REST APIs in a regulated financial environment"
    ]
  },
  {
    role: "Intern",
    company: "J.P. Morgan, Dublin",
    period: "March 2021 - June 2021",
    bullets: [
      "Delivered UI features while ramping into enterprise engineering workflows",
      "Learned release standards, code review process, and production collaboration",
      "Promoted to Software Engineer I after three months"
    ]
  }
];
