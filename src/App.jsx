import { useEffect, useMemo, useRef, useState } from "react";

const scenarios = [
  {
    id: "platform",
    label: "Platform Ownership",
    title: "Internal onboarding + profile management services",
    latency: "210ms",
    errorRate: "0.35%",
    throughput: "1.4k req/min",
    stack: "Java, Spring Boot, Microservices, API Gateway",
    notes: [
      "Owned architecture and onboarding standards as first engineer",
      "Defined validation flows, navigation logic, and service boundaries",
      "Aligned implementation choices to delivery speed and maintainability"
    ]
  },
  {
    id: "event",
    label: "Event-Driven Systems",
    title: "Async, streaming, and notification backend delivery",
    latency: "240ms",
    errorRate: "0.50%",
    throughput: "2.1k req/min",
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
    latency: "185ms",
    errorRate: "0.28%",
    throughput: "1.1k req/min",
    stack: "Sonar, Black Duck, SOAR/TAD Governance, PR Reviews",
    notes: [
      "Drove adoption and enforcement of code quality/security gates",
      "Contributed to architecture and compliance review forums",
      "Mentored interns and new engineers through weekly knowledge transfer"
    ]
  }
];

const projectCards = [
  {
    title: "Mastercard: CFO Chatbot Foundation",
    summary:
      "First engineer and technical owner, defining service architecture, code structure, and onboarding standards.",
    impact: "Established reusable team foundations",
    tech: "Java, Spring Boot, Internal Platform APIs"
  },
  {
    title: "Mastercard: Profile Management Platform",
    summary:
      "Owned end-to-end onboarding and profile-management architecture across validation, navigation, and service integration.",
    impact: "Adopted patterns across multiple teams",
    tech: "Microservices, API Gateway, Platform Tooling"
  },
  {
    title: "J.P. Morgan: Regulated API Services",
    summary:
      "Built secure Java microservices and REST APIs for financial data handling and frontend integration.",
    impact: "Supported release quality and strict standards",
    tech: "Java, REST, Async Patterns, TypeScript"
  }
];

const caseStudies = [
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
      "Add deeper load-test coverage and contract-test suites for partner integrations."
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
      "Introduce retrieval quality scoring and stronger offline evaluation loops."
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
      "Add richer personalization signals and performance analytics for plan quality."
  }
];

const toolkit = [
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

const architecturePrinciples = [
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

const timelineGraph = [
  ...careerTimeline.map((item) => ({
    ...item,
    company:
      item.title.includes("J.P. Morgan") || jpMorganPeriods.has(item.period)
        ? "jpm"
        : item.title.includes("Mastercard")
          ? "mc"
          : "career",
    role:
      item.period === "March 2021"
        ? "Intern"
        : item.period === "June 2021"
          ? "Software I"
          : item.period === "2022"
            ? "Software II"
            : item.period === "May 2023"
              ? "Software II"
              : "Senior",
    workedOn:
      item.period === "March 2021"
        ? ["Frontend delivery as intern", "Production team onboarding"]
        : item.period === "June 2021"
          ? ["Promoted quickly into full-time engineering", "Delivered UI + backend features"]
          : item.period === "2022"
            ? ["Moved into broader backend ownership", "Built secure API integrations"]
            : item.period === "May 2023"
              ? ["Joined Mastercard as SWE II", "Platform-heavy Java service delivery"]
              : ["Promoted to Senior in Feb 2026", "Architecture, mentoring, cross-team standards"]
  })),
  {
    period: "Next",
    title: "Want To See Your Company Next?",
    detail: "Open to remote timezone-aligned roles.",
    company: "next",
    role: "Your Team?",
    workedOn: ["Backend architecture", "Platform ownership", "Reliable delivery under pressure"]
  }
];

const externalTracks = [
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

const reliabilitySnapshot = [
  {
    title: "Incident Response",
    detail: "Log analysis, dependency tracing, and cross-team coordination for integration failures."
  },
  {
    title: "Observability",
    detail: "Metrics + logs + tracing mindset for faster debugging and safer releases."
  },
  {
    title: "Quality Gates",
    detail: "Sonar and Black Duck adoption, rigorous PR reviews, and delivery standards."
  }
];

const recruiterSignals = [
  "Promoted to Senior: Feb 2026",
  "Open to Remote Timezone-Aligned Roles",
  "Backend + Platform Ownership in Fintech"
];

const recruiterValueTags = [
  "Java + Spring Boot",
  "Event-Driven + Async Systems",
  "API Design + Platform Ownership",
  "Production Reliability + Observability",
  "Mentoring + Architecture Leadership"
];

const impactHighlights = [
  "Led backend architecture for internal platform and profile/identity product initiatives",
  "Built and scaled Java microservices for high-throughput, regulated fintech workloads",
  "Owned chatbot foundation and retrieval-driven backend orchestration for internal assistant use cases",
  "Can deliver frontend as well (React/JavaScript/TypeScript), with this portfolio as a live example"
];

const diagramSources = import.meta.glob("../diagrams/*.puml", { eager: true, as: "raw" });

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

const architectureWorkItems = Object.entries(diagramSources)
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
  .sort((a, b) => a.title.localeCompare(b.title));

const experience = [
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

function App() {
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [gameUnlocked, setGameUnlocked] = useState(false);

  const [detonated, setDetonated] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const collapseTimerRef = useRef(null);
  const [revealedPets, setRevealedPets] = useState({ cat: false, dog: false });

  const activeScenario = useMemo(
    () => scenarios.find((scenario) => scenario.id === scenarioId) ?? scenarios[0],
    [scenarioId]
  );

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        return;
      }
      const pct = Math.round((window.scrollY / max) * 100);
      if (pct >= 80) setGameUnlocked(true);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (collapseTimerRef.current) window.clearTimeout(collapseTimerRef.current);
    };
  }, []);

  const playGlitchBeep = () => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.value = 160;
      gain.gain.value = 0.028;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.18);
    } catch {
      // no-op for restricted audio environments
    }
  };

  const triggerCollapse = () => {
    if (detonated) return;
    setDetonated(true);
    setShowFailure(true);
    playGlitchBeep();
    collapseTimerRef.current = window.setTimeout(() => {
      setShowFailure(false);
    }, 3400);
  };

  const togglePetEgg = (pet) => {
    setRevealedPets((prev) => ({ ...prev, [pet]: !prev[pet] }));
  };

  return (
    <div className={`page-shell ${detonated ? "detonated" : ""} ${showFailure ? "show-failure" : ""}`}>
      <div className="grain" aria-hidden="true" />
      <main className="content">
        <section className="hero">
          <p className="eyebrow">Software Engineer | Backend + Platform</p>
          <h1>
            Rob Walsh
            <span>Java microservices, platform ownership, production reliability.</span>
          </h1>
          <p className="intro">
            Backend-focused engineer with financial-services experience building secure APIs,
            async systems, and internal developer platforms, with hands-on frontend delivery when needed.
            Open to remote timezone-aligned roles.
          </p>
          <div className="hero-signals">
            {recruiterSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
          <ul className="impact-highlights">
            {impactHighlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="hero-actions">
            <a
              className="button hero-btn cv"
              href={`${import.meta.env.BASE_URL}Rob-Walsh-CV.pdf`}
              target="_blank"
              rel="noreferrer"
            >
              View CV
            </a>
            <a className="button hero-btn github" href="https://github.com/Rob-Jay" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a
              className="button hero-btn linkedin"
              href="https://www.linkedin.com/in/robert-walsh-937703218/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a className="button hero-btn contact" href="mailto:robertjaywalsh@gmail.com">
              Contact
            </a>
          </div>
        </section>

        <section className="panel" id="playground">
          <div className="section-heading">
            <h2>Backend Scenario Switcher</h2>
            <p>Interactive view of how I approach architecture and delivery.</p>
          </div>
          <div className="switcher">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                className={scenario.id === activeScenario.id ? "chip active" : "chip"}
                onClick={() => setScenarioId(scenario.id)}
                type="button"
              >
                {scenario.label}
              </button>
            ))}
          </div>

          <article className="scenario-card">
            <h3>{activeScenario.title}</h3>
            <p className="stack">{activeScenario.stack}</p>
            <div className="kpi-grid">
              <div>
                <span>Latency p95</span>
                <strong>{activeScenario.latency}</strong>
              </div>
              <div>
                <span>Error Rate</span>
                <strong>{activeScenario.errorRate}</strong>
              </div>
              <div>
                <span>Throughput</span>
                <strong>{activeScenario.throughput}</strong>
              </div>
            </div>
            <ul>
              {activeScenario.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </article>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>System Reliability Snapshot</h2>
            <p>How I keep backend systems stable, observable, and production-ready.</p>
          </div>
          <div className="reliability-grid">
            {reliabilitySnapshot.map((item) => (
              <article className="project-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel timeline-panel">
          <div className="section-heading">
            <h2>Career Timeline</h2>
            <p>Hover each logo for role highlights.</p>
          </div>
          <div className="timeline-mini">
            {timelineGraph.map((step, index) => (
              <div key={`${step.period}-${step.title}`} className="timeline-mini-item" tabIndex={0}>
                <div className="timeline-mini-line" aria-hidden="true" />
                <button
                  type="button"
                  className={`timeline-logo ${step.company} ${index === timelineGraph.length - 1 ? "is-future" : ""}`}
                  aria-label={`${step.period} ${step.title}`}
                >
                  <span>{step.company === "jpm" ? "JPM" : step.company === "mc" ? "MC" : "NEXT"}</span>
                  <small>{step.role}</small>
                </button>
                <p className="timeline-mini-date">{step.period}</p>
                <div className="timeline-mini-pop">
                  <h3>{step.title}</h3>
                  {step.detail ? <p>{step.detail}</p> : null}
                  <ul>
                    {step.workedOn.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {index === timelineGraph.length - 1 ? (
                    <div className="hero-actions">
                      <a className="button primary small" href="mailto:robertjaywalsh@gmail.com">
                        Contact
                      </a>
                      <a className="button ghost" href="https://github.com/Rob-Jay" target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                      <a
                        className="button ghost"
                        href="https://www.linkedin.com/in/robert-walsh-937703218/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Experience Snapshot</h2>
          </div>
          <div className="project-grid">
            {experience.map((item) => (
              <article className="project-card" key={`${item.company}-${item.period}`}>
                <h3>
                  {item.role} | {item.company}
                </h3>
                <p>{item.period}</p>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" id="projects">
          <div className="section-heading">
            <h2>Backend Project Highlights</h2>
          </div>
          <div className="project-grid">
            {projectCards.map((project) => (
              <article className="project-card" key={project.title}>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <span>{project.tech}</span>
                <strong>{project.impact}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Personal Project Lab</h2>
            <p>Add your repo links/details here later. Placeholder is ready now.</p>
          </div>
          <article className="scenario-card">
            <h3>LLM + RAG Developer Tooling (Personal Project)</h3>
            <p className="stack">Status: In Progress | Repo link coming soon</p>
            <ul>
              <li>Focus: ingestion, retrieval strategies, and practical backend integration</li>
              <li>Planned: architecture diagram, latency metrics, and lessons learned</li>
              <li>Planned: GitHub + live demo links once polished</li>
            </ul>
          </article>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Architecture Workbench</h2>
            <p>Live PlantUML drafts from my current project workspace.</p>
          </div>
          <div className="diagram-grid">
            {architectureWorkItems.map((diagram) => (
              <article className="diagram-card" key={diagram.id}>
                <h3>{diagram.title}</h3>
                <p>{diagram.summary}</p>
                <div className="diagram-stats">
                  <span>{diagram.lines} lines</span>
                  <span>{diagram.components} components</span>
                  <span>{diagram.flows} flows</span>
                  <span>{diagram.complexity}</span>
                </div>
                <ul className="diagram-value-list">
                  {diagram.valueProps.map((value) => (
                    <li key={`${diagram.id}-${value}`}>{value}</li>
                  ))}
                </ul>
                <div className="diagram-actions">
                  <a href={diagram.renderedSrc} target="_blank" rel="noreferrer" className="button ghost">
                    View Diagram
                  </a>
                  <details>
                    <summary>View Source</summary>
                    <pre>{diagram.source}</pre>
                  </details>
                </div>
                <div className="toolkit">
                  {diagram.tags.map((tag) => (
                    <span key={`${diagram.id}-${tag}`}>{tag}</span>
                  ))}
                </div>
                <p className="diagram-meta">PlantUML source included for technical review.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Architecture Playbook</h2>
            <p>Common patterns I use in production backend delivery.</p>
          </div>
          <div className="toolkit">
            {architecturePrinciples.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Hackathons & Competitions Radar</h2>
            <p>Current tracks I am exploring for future submissions.</p>
          </div>
          <div className="project-grid events-grid">
            {externalTracks.map((track) => (
              <article className={`project-card event-card ${track.easterPet ? "has-pet-egg" : ""}`} key={track.name}>
                <h3>{track.name}</h3>
                <p>{track.note}</p>
                {track.easterPet ? (
                  <button
                    type="button"
                    className="pet-egg-trigger"
                    onClick={() => togglePetEgg(track.easterPet)}
                    aria-label={`Reveal ${track.easterPet} easter egg`}
                    title="Easter egg"
                  >
                    {"\u{1F43E}"}
                  </button>
                ) : null}
                {track.easterPet ? (
                  <div className={`card-pet ${track.easterPet} ${revealedPets[track.easterPet] ? "open" : ""}`} aria-hidden="true">
                    <span className="pet-spark">zZ</span>
                  </div>
                ) : null}
                <a className="button ghost event-link" href={track.url} target="_blank" rel="noreferrer">
                  View Events
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Case Studies</h2>
            <p>How I think: challenge, decisions, ownership.</p>
          </div>
          <div className="project-grid">
            {caseStudies.map((study) => (
              <article className="project-card" key={study.title}>
                <h3>{study.title}</h3>
                <p>{study.challenge}</p>
                <ul>
                  {study.decisions.map((decision) => (
                    <li key={decision}>{decision}</li>
                  ))}
                </ul>
                <strong>What I Owned: {study.owned}</strong>
                <p>
                  <strong>Key Tradeoff:</strong> {study.tradeoff}
                </p>
                <p>
                  <strong>If I Had 2 More Weeks:</strong> {study.next}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="section-heading">
            <h2>Core Toolkit</h2>
          </div>
          <div className="toolkit">
            {toolkit.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </section>

        <section className="panel game-panel">
          <div className="section-heading">
            <h2>WIP</h2>
            <p>High-value signals recruiters usually scan for first.</p>
            <div className="wip-value-tags">
              {recruiterValueTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>

          {!gameUnlocked ? (
            <div className="locked-game">Keep scrolling. Reward unlocks at 80%.</div>
          ) : (
            <div className="mini-game chaos-zone">
              <div className="wip-stage">
                <div className="wip-ribbon">UNDER CONSTRUCTION</div>
                <div className="wip-progress">Production-Minded | Architecture-Led | Hiring Ready</div>
                <div className="wip-blueprint">
                  <div className="wip-block large" />
                  <div className="wip-block mid" />
                  <div className="wip-block small" />
                  <div className="wip-block row" />
                </div>
                <button
                  type="button"
                  className="chaos-button launch-button"
                  onClick={triggerCollapse}
                  disabled={detonated}
                >
                  DO NOT PRESS
                </button>
                <div className="site-scaffold left" aria-hidden="true">
                  <div className="build-ground" />
                  <div className="construction-label">WIP BUILD</div>
                  <div className="building-frame">
                    <div className="tower-rail left" />
                    <div className="tower-rail right" />
                    <div className="tower-floor f1" />
                    <div className="tower-floor f2" />
                    <div className="tower-floor f3" />
                    <div className="tower-panel p1" />
                    <div className="tower-panel p2" />
                    <div className="tower-panel p3" />
                    <div className="crane-line" />
                    <div className="crane-hook" />

                    <div className="worker hammering wa">
                      <span className="hammer" />
                    </div>
                    <div className="worker hammering wb">
                      <span className="hammer" />
                    </div>
                  </div>
                </div>
                <div className="site-scaffold right" aria-hidden="true">
                  <div className="build-ground" />
                  <div className="construction-label">WIP BUILD</div>
                  <div className="building-frame">
                    <div className="tower-rail left" />
                    <div className="tower-rail right" />
                    <div className="tower-floor f1" />
                    <div className="tower-floor f2" />
                    <div className="tower-floor f3" />
                    <div className="tower-panel p1" />
                    <div className="tower-panel p2" />
                    <div className="tower-panel p3" />
                    <div className="crane-line" />
                    <div className="crane-hook" />

                    <div className="worker hammering wa">
                      <span className="hammer" />
                    </div>
                    <div className="worker hammering wb">
                      <span className="hammer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;


