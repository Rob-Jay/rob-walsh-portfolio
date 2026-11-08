'use client'

import { FormEvent, useRef, useState } from 'react'

type Message = { role: 'user' | 'assistant'; content: string; sources?: string[]; error?: boolean }

const SUGGESTIONS = ['What did you build at Mastercard?', 'What is your core stack?', 'What roles are you looking for?']
const MAX_CHARS = 500
const OFFLINE = 'rob-gpt is unavailable right now. Email me at robertjaywalsh@gmail.com instead.'
const BUSY = 'That is a lot of questions in a short time. Try again in a minute, or email me.'

export default function AskRobGpt() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function ask(question: string) {
    const text = question.trim()
    if (!text || busy) return
    setInput('')
    setBusy(true)

    // Send recent turns only; the route caps conversation size.
    const history = [...messages.filter((m) => !m.error), { role: 'user' as const, content: text }]
      .slice(-9)
      .map(({ role, content }) => ({ role, content }))
    setMessages((prev) => [...prev, { role: 'user', content: text }, { role: 'assistant', content: '' }])

    const update = (patch: Partial<Message>) =>
      setMessages((prev) => {
        const next = [...prev]
        next[next.length - 1] = { ...next[next.length - 1], ...patch }
        return next
      })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })
      if (!response.ok || !response.body) {
        update({ content: response.status === 429 ? BUSY : OFFLINE, error: true })
        return
      }

      let sources: string[] = []
      try {
        sources = JSON.parse(response.headers.get('X-Rob-Sources') ?? '[]')
      } catch {
        // No sources header: show the answer without chips.
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let answer = ''
      let failed = false
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (line.startsWith('0:')) {
            answer += JSON.parse(line.slice(2))
            update({ content: answer })
          } else if (line.startsWith('3:')) {
            failed = true
          }
        }
      }
      if (failed || !answer) update({ content: OFFLINE, error: true })
      else update({ sources })
    } catch {
      update({ content: OFFLINE, error: true })
    } finally {
      setBusy(false)
      inputRef.current?.focus()
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    ask(input)
  }

  return (
    <div className="ask">
      {messages.length === 0 ? (
        <ul className="suggestions" aria-label="Suggested questions">
          {SUGGESTIONS.map((s) => (
            <li key={s}>
              <button type="button" className="chip" onClick={() => ask(s)} disabled={busy}>
                {s}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <ol className="thread" aria-live="polite" aria-busy={busy}>
          {messages.map((m, i) => (
            <li key={i} className={`turn turn-${m.role}${m.error ? ' turn-error' : ''}`}>
              <span className="turn-who">{m.role === 'user' ? 'You' : 'rob-gpt'}</span>
              <p>{m.content || '…'}</p>
              {m.sources && m.sources.length > 0 && (
                <ul className="sources" aria-label="Sources">
                  {m.sources.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}
      <form className="ask-form" onSubmit={onSubmit}>
        <label className="sr-only" htmlFor="ask-input">
          Your question
        </label>
        <input
          id="ask-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={MAX_CHARS}
          placeholder="Ask about my experience…"
          autoComplete="off"
        />
        <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}>
          {busy ? 'Thinking…' : 'Ask'}
        </button>
      </form>
    </div>
  )
}
