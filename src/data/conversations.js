// ── Conversation definitions ──────────────────────────────────────────────────
export const CONVERSATIONS = [
  {
    id: 'intro',
    title: 'About Rob',
    icon: '◈',
    introArtifact: true,
    thread: [
      { role: 'user', content: 'Hey — tell me about yourself.' },
      {
        role: 'assistant',
        content:
          "I'm Rob Walsh, a Senior Software Engineer based in Dublin. Five years building production backend systems in financial services — Java, Spring Boot, microservices at scale at Mastercard and J.P. Morgan.\n\nThe direction I'm moving: I want to work on AI itself. Integrating AI services into products, engineering the systems that connect models to the real world, and building the tooling around them. I led the LLM chatbot backend at Mastercard, built a personal AI training engine for my ultramarathon prep, and this portfolio is a live Claude integration I built end-to-end.\n\nI want the engineering work to be the AI — not a feature on the roadmap.",
      },
    ],
    followups: ["What's your tech stack?", 'Tell me about your AI work', 'Are you open to work?'],
  },
  {
    id: 'contact',
    title: 'Get in Touch',
    icon: '◇',
    contactArtifact: true,
    thread: [
      { role: 'user', content: 'How do I get in touch with Rob?' },
      {
        role: 'assistant',
        content:
          "All contact details are below — email is the fastest. There's also a message composer if you'd like to write something directly:",
      },
    ],
    followups: ['Tell me about yourself', 'Are you open to work?'],
  },
  {
    id: 'stack',
    title: 'Tech Stack',
    icon: '⬡',
    stackArtifact: true,
    toolCall: {
      name: 'get_profile',
      input: { section: 'technical_skills', format: 'grouped' },
      result: 'Returned 4 skill groups · 18 technologies',
    },
    thread: [
      { role: 'user', content: "What's your tech stack?" },
      {
        role: 'assistant',
        content:
          'Backend core: Java, Spring Boot, microservices, REST APIs, Spring Security, OAuth2/JWT — that\'s where most of my professional experience lives.\n\nPlatform layer: Kafka for event-driven systems, API Gateway, Docker, Kubernetes, AWS and Azure. Full observability stack in production — metrics, tracing, alerting.\n\nAI/LLM: Claude API with streaming and tool use, RAG retrieval flows, embeddings, vector search. This portfolio uses Claude Haiku — source on GitHub.\n\nFrontend when the project needs it: React, TypeScript. You\'re looking at a live example right now.',
      },
    ],
    followups: ['Tell me about the LLM work', 'How do you approach system design?', 'Tell me about the UTMB training engine'],
  },
  {
    id: 'ai',
    title: 'AI & Agent Work',
    icon: '⟳',
    aiArtifact: true,
    toolCall: {
      name: 'search_knowledge_base',
      input: { query: 'AI LLM agentic experience', top_k: 4, sources: ['professional', 'personal'] },
      result: '4 documents retrieved · 3.1 kb',
    },
    thread: [
      { role: 'user', content: 'Tell me about your AI and agent work.' },
      {
        role: 'assistant',
        content:
          "At Mastercard I led backend design for an internal LLM-powered chatbot — an enterprise data ingestion pipeline feeding a hosted LLM, with streaming responses back to the client. Similar in principle to how frontier models are built: knowledge is processed into the model's context rather than retrieved on demand. The architecture keeps the ingestion layer and the LLM provider independently swappable.\n\nPersonally: I built an LLM-powered training engine for my UTMB ultramarathon prep. It ingests my Strava activity data, retrieves relevant training history through a vector search layer, and generates adaptive weekly plans based on current fitness and race timeline.\n\nThis portfolio is also real: character-by-character streaming, Claude API, per-conversation state management. Source is on GitHub.",
      },
    ],
    followups: ['Tell me about the LLM work', 'What AI frameworks have you used?', 'Tell me about the UTMB training engine'],
  },
  {
    id: 'work',
    title: 'Open to Work?',
    icon: '◎',
    thread: [
      { role: 'user', content: 'Are you actively looking for a new role?' },
      {
        role: 'assistant',
        content:
          "Yes — actively. The title is there (Senior SE, Mastercard, Feb 2026), but the work I want is different: I want to build AI, integrate AI, and ship AI — not support a product that happens to use it.\n\nWhat that looks like:\n• Using AI — integrating LLM APIs, building AI-powered features into real products\n• Integrating services with AI — connecting models to data, systems, and workflows\n• Creating AI tooling — agents, inference pipelines, evaluation, fine-tuning infrastructure\n\nFive years in production backend engineering gives me the foundation. I want to point it at AI as the actual work. Senior backend or platform roles, hybrid or remote from Dublin.\n\nEmail or LinkedIn. I respond quickly.",
      },
    ],
    followups: ['Tell me about yourself', "What's your tech stack?", 'Tell me about your AI work'],
  },
  {
    id: 'career',
    title: 'Career Journey',
    icon: '⬦',
    careerArtifact: true,
    toolCall: {
      name: 'get_timeline',
      input: { entity: 'Rob Walsh', type: 'employment', order: 'chronological' },
      result: 'Returned 3 positions · 5 years of experience',
    },
    thread: [
      { role: 'user', content: 'Walk me through your career so far.' },
      {
        role: 'assistant',
        content:
          "Started in 2021 at J.P. Morgan Dublin as a Software Engineer — building backend services for internal financial systems in Java and Spring Boot. Regulated environment: reliability and auditability weren't optional.\n\nMoved to Mastercard in 2023 as SWE II. The scope grew quickly — microservices architecture, event-driven pipelines with Kafka, API Gateway, cross-team technical work. Promoted to Senior Software Engineer in February 2026.\n\nThe defining project: leading backend design for an internal LLM-powered chatbot — an enterprise knowledge ingestion pipeline paired with a streaming response layer. That work made the direction clear — AI-native systems are where I want to build next.",
      },
    ],
    followups: ['What did you build at Mastercard?', 'Tell me about the UTMB training engine', 'Are you open to work?'],
  },
  {
    id: 'outside',
    title: 'Life Outside Code',
    icon: '◉',
    trainingArtifact: true,
    thread: [
      { role: 'user', content: 'What do you get up to outside of work?' },
      {
        role: 'assistant',
        content:
          "Ultramarathons. Training for UTMB — Ultra-Trail du Mont-Blanc, 171km through the Alps. It demands the same systematic thinking as engineering: load management, progressive overload, adaptation cycles.\n\nI built a tool around it: an LLM-powered training engine that ingests my Strava activity data, retrieves relevant training history through a RAG layer, and generates adaptive weekly plans based on current fitness, fatigue, and timeline to race. It's the most-used personal project I have.\n\nOutside running: I find the overlap between what's technically possible and what's worth building more interesting than either question alone. That's shaped most of my career choices.\n\nCurrent training snapshot:",
      },
    ],
    followups: ['Tell me about the UTMB training engine', 'Are you open to work?', 'Tell me about yourself'],
  },
  {
    id: 'how-built',
    title: 'How This Was Built',
    icon: '⌬',
    howBuiltArtifact: true,
    toolCall: {
      name: 'analyze_codebase',
      input: { repo: 'rob-walsh-portfolio', include: ['streaming', 'state', 'api'] },
      result: 'Analysed 6 modules · 847 lines · 1 AI integration',
    },
    thread: [
      { role: 'user', content: 'How was this portfolio built?' },
      {
        role: 'assistant',
        content:
          "React 18 and Vite, deployed to GitHub Pages. Intentionally a single component — no router, no state management library — because the problem doesn't need more complexity than that.\n\nThe AI layer: Claude Haiku via the Anthropic SDK running directly in the browser. Each conversation pre-loads with character-by-character streaming so there's always something moving on arrival. User messages hit the live API with full conversation history as context.\n\nThe interesting engineering problem: React 18 Strict Mode double-invokes effects in development, which caused two simultaneous streams writing into the same message bubble. Fixed with a ref-based guard that updates synchronously — unlike state, the second invocation sees it immediately and exits.\n\nTool call bubbles, per-conversation state, abort controllers for stream cancellation, an embedded game, a live training widget — all in one file. Source is on GitHub.",
      },
    ],
    followups: ["What's your tech stack?", 'Tell me about your AI work', 'Are you open to work?'],
  },
  {
    id: 'game',
    title: 'Play a Game',
    icon: '▶',
    gameArtifact: true,
    thread: [
      { role: 'user', content: 'Is there a game I can play?' },
      {
        role: 'assistant',
        content:
          "Yes — I built a side-scroller called Dev Run. Jump over bugs, duck under server error beams, dodge the stack traces. The difficulty ramps up the further you go, with combo obstacles at higher speeds.\n\nSpace or ↑ to jump · S or ↓ to duck · Double jump available. Give it a run:",
      },
    ],
  },
]
