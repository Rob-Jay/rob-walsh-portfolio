'use client'

import { useChat } from 'ai/react'
import { useEffect, useRef, useState } from 'react'

// ── Pre-prepared answers for suggestion chips ──────────────────────────────────
// Canned answers stream locally — no API call, instant, consistent wording.
const CANNED_ANSWERS = {
  "What's your tech stack?":
    "Java and Spring Boot are my core — that's where most of my 5 years of professional experience lives. I'm comfortable across the backend stack: REST APIs, event-driven systems with Kafka, API Gateway, Docker and Kubernetes, and observability tooling. On the frontend I can deliver in React when the project needs it — this portfolio site is a live example. I've also been building LLM and RAG systems in my own time.",

  "Tell me about your AI experience":
    "I led the backend architecture for an internal LLM-powered chatbot at Mastercard — RAG retrieval flow, service structure, and team onboarding standards. The design keeps retrieval and LLM provider layers independently evolvable, which was intentional. Outside of work I built my own LLM-powered training engine that I use to fine-tune my UTMB prep — real-world validation that the architecture actually works. I learn best by building things I'll use myself.",

  "Are you open to work?":
    "Yes — actively looking for senior backend or platform engineering roles. I'm based in Dublin and open to hybrid or remote. I'm looking for somewhere that builds serious backend systems and values engineering quality over just feature output. If that sounds like your team, I'd genuinely love to talk — links to email and LinkedIn are in the footer.",

  "What makes you stand out?":
    "Three things. First, I've shipped production backend systems in regulated financial environments — I know what production quality actually means. Second, I've led architecture and mentored other engineers since my promotion to Senior earlier this year. Third, I build personal projects in the areas I want to grow — the LLM/RAG tooling and this portfolio site are both real examples of that, not just lines on a CV.",
}

const SUGGESTIONS = Object.keys(CANNED_ANSWERS)

const SYSTEM_PROMPT = `You are a portfolio assistant for Rob Walsh, a Senior Backend Software Engineer based in Dublin, Ireland. Answer questions about Rob concisely and honestly.

Key facts:
- Senior SE at Mastercard (promoted Feb 2026); previously SWE II at Mastercard and J.P. Morgan Dublin (2021–2023)
- 5 years of financial services engineering in regulated environments
- Core stack: Java, Spring Boot, Microservices, REST APIs, Spring Security, OAuth2 + JWT
- Frontend when needed: React, TypeScript — this portfolio is a live example
- Platform: API Gateway, Kafka, Docker, Kubernetes, AWS + Azure
- AI/LLM: architected RAG-backed LLM chatbot backend at Mastercard; building personal LLM + RAG tooling
- Hobbies: training for UTMB (Ultra-Trail du Mont-Blanc) using his own LLM-powered training engine to fine-tune the plan
- Looking for: Senior Backend or Platform Engineering role, hybrid or remote, Dublin-based

Keep responses 2–4 sentences. Only answer questions about Rob. For anything unrelated, politely redirect.`

const CHAR_DELAY_MS = 14

// ─────────────────────────────────────────────────────────────────────────────

function AskRobWidget() {
  const [open, setOpen] = useState(false)
  const [isLocalStreaming, setIsLocalStreaming] = useState(false)
  const localAbortRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const {
    messages,
    input,
    handleInputChange,
    isLoading,
    setMessages,
    append,
    setInput,
  } = useChat({
    api: '/api/chat',
    body: { system: SYSTEM_PROMPT },
  })

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120)
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Stream a canned answer character-by-character into the messages array
  // without triggering an API call.
  const streamCanned = async (question, text) => {
    if (isLoading || isLocalStreaming) return

    const ctrl = new AbortController()
    localAbortRef.current = ctrl
    setIsLocalStreaming(true)

    const userId = `u-${Date.now()}`
    const assistantId = `a-${Date.now()}`

    setMessages((prev) => [
      ...prev,
      { id: userId, role: 'user', content: question },
      { id: assistantId, role: 'assistant', content: '' },
    ])

    for (let i = 0; i < text.length; i++) {
      if (ctrl.signal.aborted) break
      await new Promise((r) => setTimeout(r, CHAR_DELAY_MS))
      if (ctrl.signal.aborted) break
      setMessages((prev) => {
        const updated = [...prev]
        const idx = updated.findIndex((m) => m.id === assistantId)
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], content: updated[idx].content + text[i] }
        }
        return updated
      })
    }

    setIsLocalStreaming(false)
  }

  const handleSuggestion = (suggestion) => {
    if (isLoading || isLocalStreaming) return
    if (CANNED_ANSWERS[suggestion]) {
      streamCanned(suggestion, CANNED_ANSWERS[suggestion])
    } else {
      append({ role: 'user', content: suggestion })
    }
  }

  const handleSend = () => {
    const text = input.trim()
    if (!text || isLoading || isLocalStreaming) return
    setInput('')
    if (CANNED_ANSWERS[text]) {
      streamCanned(text, CANNED_ANSWERS[text])
    } else {
      append({ role: 'user', content: text })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const busy = isLoading || isLocalStreaming

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        className={`ask-rob-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI assistant' : 'Ask Rob anything'}
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 2a1 1 0 0 1 .993.883L13 3v1.07A8.001 8.001 0 0 1 19.929 11H21a1 1 0 0 1 .117 1.993L21 13h-1.07A8.001 8.001 0 0 1 13 19.929V21a1 1 0 0 1-1.993.117L11 21v-1.07A8.001 8.001 0 0 1 4.071 13H3a1 1 0 0 1-.117-1.993L3 11h1.071A8.001 8.001 0 0 1 11 4.07V3a1 1 0 0 1 1-1zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
          </svg>
        )}
        <span>{open ? 'Close' : 'Ask Rob'}</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="ask-rob-panel" role="dialog" aria-label="Ask Rob AI assistant">
          <div className="ask-rob-header">
            <div className="ask-rob-header-info">
              <div className="ask-rob-avatar" aria-hidden="true">R</div>
              <div>
                <strong>Ask Rob</strong>
                <span className="ask-rob-sub">AI-powered · Answers about me</span>
              </div>
            </div>
            <div className="ask-rob-powered">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor" aria-hidden="true">
                <path d="M12 2a1 1 0 0 1 .993.883L13 3v1.07A8.001 8.001 0 0 1 19.929 11H21a1 1 0 0 1 .117 1.993L21 13h-1.07A8.001 8.001 0 0 1 13 19.929V21a1 1 0 0 1-1.993.117L11 21v-1.07A8.001 8.001 0 0 1 4.071 13H3a1 1 0 0 1-.117-1.993L3 11h1.071A8.001 8.001 0 0 1 11 4.07V3a1 1 0 0 1 1-1zm0 4a6 6 0 1 0 0 12A6 6 0 0 0 12 6zm0 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 1.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
              </svg>
              Claude
            </div>
          </div>

          <div className="ask-rob-messages">
            {messages.length === 0 && (
              <div className="ask-rob-empty">
                <p>Hey! Ask me anything about Rob — his experience, tech stack, projects, or what he's working on.</p>
                <div className="ask-rob-suggestions">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="ask-rob-suggestion"
                      onClick={() => handleSuggestion(s)}
                      disabled={busy}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`ask-rob-msg ${msg.role}`}>
                <p>
                  {msg.content}
                  {busy && msg === messages[messages.length - 1] && msg.role === 'assistant' && (
                    <span className="ask-rob-cursor" aria-hidden="true" />
                  )}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="ask-rob-input-row">
            <input
              ref={inputRef}
              type="text"
              className="ask-rob-input"
              placeholder="Ask anything about Rob…"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={busy}
              maxLength={400}
              aria-label="Your question"
            />
            <button
              type="button"
              className="ask-rob-send"
              onClick={handleSend}
              disabled={!input.trim() || busy}
              aria-label="Send"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AskRobWidget
