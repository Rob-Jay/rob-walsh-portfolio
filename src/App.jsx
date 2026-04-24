import Anthropic from '@anthropic-ai/sdk'
import { useCallback, useEffect, useRef, useState } from 'react'
import BullRunnerGame from './components/BullRunnerGame.jsx'
import CareerTimeline from './components/CareerTimeline.jsx'
import ChatbotFlow from './components/ChatbotFlow.jsx'
import DublinSkyline from './components/DublinSkyline.jsx'
import TerminalStream from './components/TerminalStream.jsx'
import TechStackViz from './components/TechStackViz.jsx'
import TrainingWidget from './components/TrainingWidget.jsx'

// ── Conversation definitions ──────────────────────────────────────────────────

const CONVERSATIONS = [
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

// ── System prompt for live API ────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are rob-gpt, Rob Walsh's portfolio assistant. Rob is a Senior Backend Software Engineer based in Dublin, Ireland. Answer questions about Rob concisely and honestly.

Key facts:
- Senior SE at Mastercard (promoted Feb 2026); previously SWE II at Mastercard and J.P. Morgan Dublin (2021–2023)
- 5 years of financial services engineering in regulated environments
- Core stack: Java, Spring Boot, Microservices, REST APIs, Spring Security, OAuth2 + JWT
- Frontend when needed: React, TypeScript — this portfolio is a live example
- Platform: API Gateway, Kafka, Docker, Kubernetes, AWS + Azure
- AI/LLM: architected LLM-powered chatbot backend at Mastercard (data ingestion pipeline + streaming, not vector retrieval); built personal LLM + RAG training engine for UTMB ultramarathon prep
- Hobbies: training for UTMB (Ultra-Trail du Mont-Blanc) using his own LLM-powered training engine
- Looking for: roles where the engineering work IS AI — using AI services, integrating models into systems, or creating AI tooling/agents/pipelines. Senior backend or platform, hybrid or remote, Dublin-based. NOT just "works at an AI company"

Keep responses 2–4 sentences. Only answer questions about Rob. For anything unrelated, politely redirect.`

// ── Streaming helpers ─────────────────────────────────────────────────────────

// Stream word-by-word so complete words appear at once (no mid-word splits).
// 22ms per word ≈ fast reading pace; punctuation pauses add natural rhythm.
async function streamText(text, onChunk, signal) {
  const WORD_MS = 22
  // Split into alternating word/whitespace tokens preserving all spacing
  const tokens = text.match(/[^\s]+|\s+/g) ?? []
  for (let ti = 0; ti < tokens.length; ti++) {
    if (signal?.aborted) break
    const token = tokens[ti]
    const isWord = /\S/.test(token)
    if (isWord) {
      await new Promise((r) => setTimeout(r, WORD_MS))
      if (signal?.aborted) break
    }
    onChunk(token)
    // Rhythm pauses after punctuation — check last char of the word token
    if (isWord) {
      const last = token[token.length - 1]
      const nextTok = tokens[ti + 1] ?? ''
      if ('.!?'.includes(last) && (!nextTok || /^\s/.test(nextTok))) {
        await new Promise((r) => setTimeout(r, 80))
      } else if (',;:'.includes(last)) {
        await new Promise((r) => setTimeout(r, 15))
      }
    } else if (/\n/.test(token)) {
      await new Promise((r) => setTimeout(r, 35))
    }
    if (signal?.aborted) break
  }
}

// ── Canned answers for follow-up chips ───────────────────────────────────────
// Keyed by the exact question string used in CONVERSATIONS[n].followups.
// Any question not found here falls through to the live Claude API.

// Each entry is { toolCall?: { name, input, result }, content: string }
const CANNED_ANSWERS = {
  "What's your tech stack?": {
    toolCall: {
      name: 'get_profile',
      input: { section: 'technical_skills', format: 'grouped' },
      result: 'Returned 4 skill groups · 18 technologies',
    },
    content: "Backend core: Java, Spring Boot, microservices, REST APIs, Spring Security, OAuth2/JWT — that's where most of my professional experience lives.\n\nPlatform layer: Kafka for event-driven systems, API Gateway, Docker, Kubernetes, AWS and Azure. Full observability stack in production — metrics, tracing, alerting.\n\nAI/LLM: Claude API with streaming and tool use, RAG retrieval flows, embeddings, vector search. This portfolio uses Claude Haiku — source on GitHub.\n\nFrontend when the project needs it: React, TypeScript. You're looking at a live example right now.",
  },

  "Tell me about your AI work": {
    toolCall: {
      name: 'search_knowledge_base',
      input: { query: 'AI LLM integration experience', top_k: 4, sources: ['professional', 'personal'] },
      result: '4 documents retrieved · 3.1 kb',
    },
    content: "At Mastercard I led backend design for an internal LLM-powered chatbot — enterprise data ingestion pipeline, streaming response layer, independently swappable LLM provider. The engineering challenge was connecting internal knowledge to a hosted model reliably and at scale.\n\nPersonally: I built an LLM-powered training engine for my UTMB ultramarathon prep — ingests Strava data, retrieves relevant training history via vector search, generates adaptive weekly plans. End-to-end AI integration, built and maintained by me.\n\nThis portfolio is a third data point: live Claude API integration, streaming, per-conversation state. Source on GitHub.",
  },

  "Are you open to work?": {
    content: "Yes — actively. The title is there (Senior SE, Mastercard, Feb 2026), but I want to work on AI itself — not support a product that uses it as a feature.\n\nWhat that looks like:\n• Using AI — integrating LLM APIs and AI services into real products\n• Integrating services with AI — connecting models to data, systems, and workflows\n• Creating AI tooling — agents, inference pipelines, evaluation, fine-tuning infrastructure\n\nSenior backend or platform roles. Hybrid or remote from Dublin. Email or LinkedIn — I respond quickly.",
  },

  "Tell me about yourself": {
    content: "I'm Rob Walsh, a Senior Software Engineer based in Dublin. Five years building production backend systems in financial services — Java, Spring Boot, microservices at scale at Mastercard and J.P. Morgan.\n\nThe direction I'm moving: I want to work on AI itself. Integrating AI services, engineering the systems that connect models to the real world, building AI products end-to-end. I've done it professionally at Mastercard and in personal projects — this portfolio is a live example.\n\nI want the engineering work to be the AI — not a feature on the roadmap.",
  },

  "Tell me about the LLM work": {
    toolCall: {
      name: 'search_knowledge_base',
      input: { query: 'LLM chatbot architecture Mastercard', top_k: 3 },
      result: '3 documents retrieved · 2.4 kb',
    },
    content: "The Mastercard chatbot was the main professional project. Enterprise data is processed through an ingestion pipeline and made available to the LLM as context — similar in principle to how frontier models are trained on broad knowledge, but scoped to internal data. User query comes in, the model generates from that grounded context, response streams back to the client.\n\nThe key design decision was keeping the ingestion layer and the LLM provider independently deployable. You can update the knowledge base or swap the model without touching the other — which matters when the model landscape changes as fast as it does.\n\nPersonally, I've been building directly against the Claude API — streaming, tool use, structured output. This portfolio is that, live.",
  },

  "How do you approach system design?": {
    content: "Start from requirements and failure modes, not the happy path. What does the system need to handle when things go wrong? Then work backwards — what consistency guarantees are needed, what does the data flow look like, where are the failure domains.\n\nIn practice at Mastercard: sequence diagram first, identify the bounded contexts, get the team to agree on contracts before anyone writes code. Most system design problems are actually coordination problems in disguise.\n\nFor AI systems specifically: get the data ingestion and context layer right before optimising the model. The LLM can't compensate for bad input.",
  },

  "What AI frameworks have you used?": {
    toolCall: {
      name: 'list_tools',
      input: { category: 'ai_ml', include_versions: true },
      result: 'Returned 6 frameworks · last updated 2026-04',
    },
    content: "Anthropic SDK (TypeScript and Python) is my primary — the streaming and tool use APIs are clean enough that I haven't needed a wrapper framework on top.\n\nFor my personal UTMB training engine I've worked with embedding models and vector search directly rather than through an abstraction layer. I know LangChain exists but in my experience it adds overhead without much value — you end up fighting the abstraction more than it helps.\n\nFor embeddings: text-embedding-3-small for personal projects, internal models in the Mastercard context.",
  },

  "What did you build at Mastercard?": {
    toolCall: {
      name: 'get_timeline',
      input: { employer: 'Mastercard', type: 'projects', include_tech: true },
      result: 'Returned 4 projects · 2023–2026',
    },
    content: "The main project was the internal LLM-powered chatbot. I led the backend architecture: a data ingestion pipeline that processes enterprise knowledge into model context, a streaming response layer, clear service boundaries, and the engineering patterns the team standardised on. Ingestion and generation are independently deployable — important when the model landscape changes this fast.\n\nBeyond that: microservices design across internal systems, Kafka event pipelines, API Gateway configuration, and platform work touching security (Spring Security, OAuth2/JWT) and observability. Mentored two junior engineers as the team scaled.\n\nPromoted to Senior SE in February 2026 off the back of that work.",
  },

  "Walk me through your career": {
    toolCall: {
      name: 'get_timeline',
      input: { entity: 'Rob Walsh', type: 'employment', order: 'chronological' },
      result: 'Returned 3 positions · 5 years of experience',
    },
    content: "Started in 2021 at J.P. Morgan Dublin as a Software Engineer — building backend services for internal financial systems in Java and Spring Boot. Regulated environment: reliability and auditability weren't optional.\n\nMoved to Mastercard in 2023 as SWE II. The scope grew quickly — microservices architecture, event-driven pipelines with Kafka, API Gateway, cross-team technical work. Promoted to Senior Software Engineer in February 2026.\n\nThe defining project: leading backend design for an internal LLM-powered chatbot — enterprise data ingestion pipeline, streaming response layer, engineering patterns the wider team adopted. That work made the direction clear — AI-native systems are where I want to build next.",
  },

  "Tell me about the UTMB training engine": {
    toolCall: {
      name: 'search_knowledge_base',
      input: { query: 'UTMB training engine LLM Strava personal project', top_k: 3 },
      result: '3 documents retrieved · 2.1 kb',
    },
    content: "UTMB is 171km through the Alps — the preparation involves years of structured training. I built a tool to make that smarter.\n\nThe engine ingests my Strava activity data, chunks and embeds it, then retrieves relevant training history through a vector search layer. The LLM takes that context — recent load, fatigue indicators, race timeline — and generates adaptive weekly training plans with reasoning.\n\nIt's end-to-end: data ingestion from the Strava API, a retrieval layer I can swap independently, and a feedback loop where I flag what worked or didn't.",
  },
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconMenu() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" />
    </svg>
  )
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function IconDoc() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

// ── Tool call bubble ─────────────────────────────────────────────────────────

function ToolCallBubble({ name, input, result }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="tool-call-wrapper">
      <div className="tool-call">
        <button
          className="tool-call-header"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <svg className="tool-call-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span className="tool-call-name">{name}</span>
          <span className="tool-call-result">{result}</span>
          <svg
            className={`tool-call-chevron ${expanded ? 'open' : ''}`}
            viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {expanded && (
          <div className="tool-call-body">
            <p className="tool-call-label">Input</p>
            <pre className="tool-call-pre">{JSON.stringify(input, null, 2)}</pre>
            <p className="tool-call-label" style={{ marginTop: '8px' }}>Result</p>
            <p className="tool-call-result-text">{result}</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!message.trim()) return
    const subject = encodeURIComponent("Reaching out from your portfolio")
    const body = encodeURIComponent(message.trim())
    window.location.href = `mailto:robertjaywalsh@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  if (sent) {
    return (
      <p className="contact-sent">
        Your email client should have opened — if not, write directly to{' '}
        <a href="mailto:robertjaywalsh@gmail.com">robertjaywalsh@gmail.com</a>
      </p>
    )
  }

  return (
    <div className="contact-form">
      <textarea
        className="contact-textarea"
        placeholder="Write your message to Rob…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
      />
      <button
        className="contact-send-btn"
        onClick={handleSend}
        disabled={!message.trim()}
      >
        Open email client →
      </button>
    </div>
  )
}

// ── Recruiter card ────────────────────────────────────────────────────────────

function RecruiterCard() {
  return (
    <div className="recruiter-card">
      <div className="rc-top">
        <div className="rc-avatar">R</div>
        <div className="rc-identity">
          <p className="rc-name">Rob Walsh</p>
          <p className="rc-title">Senior Software Engineer · Mastercard</p>
          <p className="rc-location">Dublin, Ireland</p>
        </div>
        <div className="open-badge rc-badge">
          <span className="open-dot" aria-hidden="true" />
          <span>Open to work</span>
        </div>
      </div>

      <div className="rc-links">
        <a href="mailto:robertjaywalsh@gmail.com" className="rc-link">
          <span className="rc-link-icon rc-icon--email"><IconMail /></span>
          <span className="rc-link-text">robertjaywalsh@gmail.com</span>
          <span className="rc-link-arrow">↗</span>
        </a>
        <a href="https://www.linkedin.com/in/robert-walsh-937703218/" target="_blank" rel="noreferrer" className="rc-link">
          <span className="rc-link-icon rc-icon--linkedin"><IconLinkedIn /></span>
          <span className="rc-link-text">linkedin.com/in/robert-walsh</span>
          <span className="rc-link-arrow">↗</span>
        </a>
        <a href="https://github.com/Rob-Jay" target="_blank" rel="noreferrer" className="rc-link">
          <span className="rc-link-icon rc-icon--github"><IconGithub /></span>
          <span className="rc-link-text">github.com/Rob-Jay</span>
          <span className="rc-link-arrow">↗</span>
        </a>
      </div>

      <div className="rc-cv-row">
        <a href="Rob-Walsh-CV.pdf" target="_blank" rel="noreferrer" className="rc-cv-btn">
          <IconDoc /> Download CV
        </a>
      </div>
    </div>
  )
}

function ContactSection() {
  return (
    <div className="contact-section">
      <RecruiterCard />
      <ContactForm />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function App() {
  const [activeId, setActiveId] = useState('intro')
  const [threads, setThreads] = useState(() => {
    const init = {}
    CONVERSATIONS.forEach((c) => { init[c.id] = [] })
    return init
  })
  // userStreaming: true only while waiting for a reply to a user-typed message.
  // Auto-play streaming is detected via currentThread.some(m => m.streaming) instead,
  // so switching tabs doesn't kill the background stream.
  const [userStreaming, setUserStreaming] = useState(false)
  const [input, setInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Track which conversations have finished their initial stream (show followups)
  const [streamedConvs, setStreamedConvs] = useState({})

  const clientRef = useRef(null)
  const abortRef = useRef(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const threadRef = useRef(null)
  // Ref-based guard: prevents Strict Mode's double effect invocation from
  // firing two simultaneous streams into the same message.
  const playedRef = useRef(new Set())

  // Initialise Anthropic client
  useEffect(() => {
    const key = import.meta.env.VITE_ANTHROPIC_API_KEY
    if (key) {
      clientRef.current = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true })
    }
  }, [])

  // Scroll to bottom whenever thread content or active conversation changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [threads, activeId])

  // Append one character to the last message in a given conversation
  const appendChar = useCallback((convId, char) => {
    setThreads((prev) => {
      const t = [...prev[convId]]
      const last = { ...t[t.length - 1] }
      last.content += char
      t[t.length - 1] = last
      return { ...prev, [convId]: t }
    })
  }, [])

  // Mark the last message in a conversation as done streaming
  const finishStream = useCallback((convId) => {
    setThreads((prev) => {
      const t = [...prev[convId]]
      t[t.length - 1] = { ...t[t.length - 1], streaming: false }
      return { ...prev, [convId]: t }
    })
  }, [])

  // Play the pre-loaded conversation for convId (only once per session).
  // Uses a ref guard so Strict Mode's double-invocation doesn't fire two
  // simultaneous streams — the ref updates synchronously, state does not.
  const playConversation = useCallback(async (convId) => {
    if (playedRef.current.has(convId)) return
    playedRef.current.add(convId)

    const conv = CONVERSATIONS.find((c) => c.id === convId)
    if (!conv) return

    const ctrl = new AbortController()
    abortRef.current = ctrl

    // Show the user message immediately
    const [userMsg, assistantMsg] = conv.thread
    setThreads((prev) => ({ ...prev, [convId]: [{ ...userMsg }] }))

    // Brief pause — feels like the model is "thinking"
    await new Promise((r) => setTimeout(r, 420))
    if (ctrl.signal.aborted) return

    // If this conversation has a tool call, surface it before the answer
    if (conv.toolCall) {
      setThreads((prev) => ({
        ...prev,
        [convId]: [...prev[convId], { role: 'tool', ...conv.toolCall }],
      }))
      await new Promise((r) => setTimeout(r, 650))
      if (ctrl.signal.aborted) return
    }

    // Add an empty assistant bubble and stream the answer
    setThreads((prev) => ({
      ...prev,
      [convId]: [...prev[convId], { role: 'assistant', content: '', streaming: true }],
    }))

    await streamText(assistantMsg.content, (char) => appendChar(convId, char), ctrl.signal)

    if (!ctrl.signal.aborted) {
      finishStream(convId)
      const artifactRole = conv.gameArtifact ? 'game'
        : conv.trainingArtifact ? 'training'
        : conv.contactArtifact ? 'contact'
        : conv.careerArtifact ? 'career'
        : conv.stackArtifact ? 'stack'
        : conv.introArtifact ? 'intro-city'
        : conv.aiArtifact ? 'ai-flow'
        : conv.howBuiltArtifact ? 'terminal'
        : null
      if (artifactRole) {
        setThreads((prev) => ({
          ...prev,
          [convId]: [...prev[convId], { role: artifactRole }],
        }))
      }
      setStreamedConvs((prev) => ({ ...prev, [convId]: true }))
    }
  }, [appendChar, finishStream])

  // Trigger playback when active conversation changes
  useEffect(() => {
    playConversation(activeId)
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Switch conversation — intentionally does NOT abort background streams.
  // Pre-loaded streams continue running so switching back shows progress.
  const switchConv = (id) => {
    if (id === activeId) { setSidebarOpen(false); return }
    setActiveId(id)
    setSidebarOpen(false)
  }

  // Send a message (from input or a followup chip)
  const sendMessage = async (overrideText) => {
    const text = (overrideText ?? input).trim()
    if (!text || userStreaming) return

    // Abort any pre-loaded stream that might be running in this conversation.
    // Capture convId now — the async closure must not read activeId later as it could change.
    const convId = activeId
    abortRef.current?.abort()

    setInput('')
    setStreamedConvs((prev) => ({ ...prev, [convId]: false }))

    const userMsg = { role: 'user', content: text }

    // Snapshot clean history before mutating state (user/assistant only — exclude all artifact roles)
    const history = threads[convId]
      .filter((m) => !m.streaming && (m.role === 'user' || m.role === 'assistant'))
      .concat(userMsg)
      .map((m) => ({ role: m.role, content: m.content }))

    // Finalise any in-progress auto-play cursor, then add user msg + new assistant bubble
    setThreads((prev) => {
      const cleaned = prev[convId].map((m) => (m.streaming ? { ...m, streaming: false } : m))
      return { ...prev, [convId]: [...cleaned, userMsg, { role: 'assistant', content: '', streaming: true }] }
    })
    setUserStreaming(true)

    const ctrl = new AbortController()
    abortRef.current = ctrl

    if (CANNED_ANSWERS[text]) {
      const canned = CANNED_ANSWERS[text]

      // Show tool call bubble first if this answer has one
      if (canned.toolCall) {
        // Remove the assistant bubble we just added, insert tool call, then re-add bubble
        setThreads((prev) => {
          const withoutBubble = prev[convId].slice(0, -1) // drop the empty assistant bubble
          return { ...prev, [convId]: [...withoutBubble, { role: 'tool', ...canned.toolCall }] }
        })
        await new Promise((r) => setTimeout(r, 650))
        if (ctrl.signal.aborted) { setUserStreaming(false); return }
        // Re-add the assistant bubble after the tool call
        setThreads((prev) => ({
          ...prev,
          [convId]: [...prev[convId], { role: 'assistant', content: '', streaming: true }],
        }))
      }

      await streamText(canned.content, (char) => appendChar(convId, char), ctrl.signal)
    } else if (!clientRef.current) {
      // No API key — friendly fallback
      const fallback =
        "Great question — Rob reads every message personally. Hit the email link in the sidebar and he'll get back to you quickly."
      await streamText(fallback, (char) => appendChar(convId, char), ctrl.signal)
    } else {
      try {
        const stream = clientRef.current.messages.stream({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: history,
        })

        for await (const event of stream) {
          if (ctrl.signal.aborted) break
          if (event.type === 'content_block_delta' && event.delta?.type === 'text_delta') {
            appendChar(convId, event.delta.text)
          }
        }
      } catch {
        setThreads((prev) => {
          const t = [...prev[convId]]
          t[t.length - 1] = {
            ...t[t.length - 1],
            content: 'Something went wrong — try reaching Rob directly via the links in the sidebar.',
            streaming: false,
          }
          return { ...prev, [convId]: t }
        })
        setUserStreaming(false)
        return
      }
    }

    if (!ctrl.signal.aborted) finishStream(convId)
    setUserStreaming(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const activeConv = CONVERSATIONS.find((c) => c.id === activeId)
  const currentThread = threads[activeId] || []
  // True if the current conversation's auto-play stream is still in progress
  const autoStreaming = currentThread.some((m) => m.streaming)
  // Input is only blocked while waiting for a reply to a user-typed message
  const inputDisabled = userStreaming
  const showFollowups = streamedConvs[activeId] && !autoStreaming && !userStreaming && activeConv?.followups?.length > 0

  return (
    <div className="chat-app">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} aria-label="Navigation">
        <div className="sidebar-brand">
          <div className="sidebar-avatar" aria-hidden="true">R</div>
          <div>
            <strong>Rob Walsh</strong>
            <span className="sidebar-model-tag">rob-gpt</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Conversations">
          <p className="sidebar-section-label">Conversations</p>
          {CONVERSATIONS.map((conv) => (
            <button
              key={conv.id}
              className={`sidebar-item ${conv.id === activeId ? 'active' : ''}`}
              onClick={() => switchConv(conv.id)}
              aria-current={conv.id === activeId ? 'page' : undefined}
            >
              <span className="sidebar-item-glyph" aria-hidden="true">{conv.icon}</span>
              <span>{conv.title}</span>
              {threads[conv.id]?.length > 0 && (
                <span className="sidebar-item-dot" aria-hidden="true" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="mailto:robertjaywalsh@gmail.com" className="sidebar-link">
            <IconMail /> robertjaywalsh@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/robert-walsh-937703218/"
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
          >
            <IconLinkedIn /> LinkedIn
          </a>
          <a
            href="https://github.com/Rob-Jay/rob-walsh-portfolio"
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
          >
            <IconGithub /> Portfolio source
          </a>
          <a
            href="Rob-Walsh-CV.pdf"
            target="_blank"
            rel="noreferrer"
            className="sidebar-link"
          >
            <IconDoc /> Download CV
          </a>
          <p className="sidebar-copy">© 2026 Rob Walsh · Dublin</p>
        </div>
      </aside>

      {/* ── Main chat area ───────────────────────────────────────── */}
      <main className="chat-main">
        {/* Header */}
        <header className="chat-header">
          <button
            className="menu-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <IconMenu />
          </button>

          <div className="chat-header-center">
            <span className="header-model-dot" aria-hidden="true" />
            <span className="header-conv-name">{activeConv?.title}</span>
            <span className="header-sep" aria-hidden="true">·</span>
            <span className="header-model-name">rob-gpt</span>
            <span className="header-sep header-sep--hide" aria-hidden="true">·</span>
            <span className="header-location">Dublin, IE</span>
          </div>

          <div className="open-badge" aria-label="Open to work">
            <span className="open-dot" aria-hidden="true" />
            <span>Open to work</span>
          </div>
        </header>

        {/* Thread */}
        <div className="chat-thread" ref={threadRef} role="log" aria-live="polite" aria-label="Conversation">
          {currentThread.length === 0 && (
            <div className="chat-loading" aria-hidden="true">
              <div className="loading-dots">
                <span /><span /><span />
              </div>
            </div>
          )}

          {currentThread.map((msg, i) => {
            if (msg.role === 'tool') {
              return <ToolCallBubble key={i} name={msg.name} input={msg.input} result={msg.result} />
            }
            if (msg.role === 'game') {
              return <div key={i} className="game-artifact"><BullRunnerGame /></div>
            }
            if (msg.role === 'training') {
              return <div key={i} className="game-artifact"><TrainingWidget /></div>
            }
            if (msg.role === 'contact') {
              return <div key={i} className="game-artifact"><ContactSection /></div>
            }
            if (msg.role === 'career') {
              return <div key={i} className="game-artifact"><CareerTimeline /></div>
            }
            if (msg.role === 'stack') {
              return <div key={i} className="game-artifact"><TechStackViz /></div>
            }
            if (msg.role === 'intro-city') {
              return <div key={i} className="game-artifact city-artifact"><DublinSkyline /></div>
            }
            if (msg.role === 'ai-flow') {
              return <div key={i} className="game-artifact"><ChatbotFlow /></div>
            }
            if (msg.role === 'terminal') {
              return <div key={i} className="game-artifact"><TerminalStream /></div>
            }
            return (
              <div key={i} className={`chat-msg chat-msg--${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="msg-avatar msg-avatar--assistant" aria-hidden="true">R</div>
                )}
                <div className="msg-bubble">
                  {msg.streaming && !msg.content
                    ? <div className="thinking-dots" aria-label="Thinking"><span /><span /><span /></div>
                    : <><MsgContent content={msg.content} />{msg.streaming && <span className="stream-cursor" aria-hidden="true" />}</>
                  }
                </div>
                {msg.role === 'user' && (
                  <div className="msg-avatar msg-avatar--user" aria-hidden="true">You</div>
                )}
              </div>
            )
          })}

          {/* Follow-up suggestion chips */}
          {showFollowups && (
            <div className="followup-row" aria-label="Suggested questions">
              {activeConv.followups.map((q) => (
                <button
                  key={q}
                  className="followup-chip"
                  onClick={() => sendMessage(q)}
                  disabled={inputDisabled}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} aria-hidden="true" />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-inner">
          <div className="chat-input-row">
            <textarea
              ref={inputRef}
              className="chat-input"
              placeholder="Ask anything about Rob…"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                // Auto-resize
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px'
              }}
              onKeyDown={handleKeyDown}
              disabled={inputDisabled}
              rows={1}
              maxLength={500}
              aria-label="Your question"
            />
            <button
              className="chat-send"
              onClick={() => sendMessage()}
              disabled={!input.trim() || inputDisabled}
              aria-label="Send message"
            >
              <IconSend />
            </button>
          </div>
          <p className="chat-disclaimer">
            rob-gpt · powered by Claude · answers about Rob only
          </p>
          </div>
        </div>
      </main>
    </div>
  )
}

// ── Message content renderer ──────────────────────────────────────────────────
// Handles: \n\n paragraph breaks, \n line breaks, and • / - bullet lists.

function MsgContent({ content }) {
  if (!content) return null

  // Split on \n\n into blocks, then within each block group lines into
  // consecutive text runs and bullet runs so lists render as <ul>.
  const blocks = content.split('\n\n')

  return (
    <div className="msg-content">
      {blocks.map((block, bi) => {
        const lines = block.split('\n')
        const groups = []
        let cur = null

        for (const line of lines) {
          const isBullet = /^[•\-]\s/.test(line)
          if (isBullet) {
            if (!cur || cur.type !== 'list') { cur = { type: 'list', items: [] }; groups.push(cur) }
            cur.items.push(line.replace(/^[•\-]\s+/, ''))
          } else {
            if (!cur || cur.type !== 'text') { cur = { type: 'text', lines: [] }; groups.push(cur) }
            cur.lines.push(line)
          }
        }

        return (
          <div key={bi} className="msg-block">
            {groups.map((g, gi) =>
              g.type === 'list'
                ? (
                  <ul key={gi} className="msg-list">
                    {g.items.map((item, ii) => (
                      <li key={ii} className="msg-list-item">{item}</li>
                    ))}
                  </ul>
                )
                : (
                  <p key={gi} className="msg-para">
                    {g.lines.map((line, li) => (
                      <span key={li}>{li > 0 && <br />}{line}</span>
                    ))}
                  </p>
                )
            )}
          </div>
        )
      })}
    </div>
  )
}