import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { REFUSAL, buildSystemPrompt, retrieve } from '../../../lib/knowledge'
import { MAX_OUTPUT_TOKENS, checkRateLimit, clientIp, validateMessages } from './limits'

const anthropic = createAnthropic()

export async function POST(req: Request) {
  const limit = checkRateLimit(clientIp(req))
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    )
  }

  let body: { messages?: unknown }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { messages, error } = validateMessages(body?.messages)
  if (error || !messages) return Response.json({ error }, { status: 400 })

  const userMessages = messages.filter((message) => message.role === 'user')
  const chunks = retrieve(
    userMessages[userMessages.length - 1].content,
    userMessages[userMessages.length - 2]?.content,
  )

  // Not covered by the notes: refuse here, without paying for a model call.
  if (chunks.length === 0) {
    return new Response(`0:${JSON.stringify(REFUSAL)}\n`, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Vercel-AI-Data-Stream': 'v1',
        'X-Rob-Sources': '[]',
      },
    })
  }

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: buildSystemPrompt(chunks),
    messages,
    maxTokens: MAX_OUTPUT_TOKENS,
  })

  const sources = Array.from(new Set(chunks.map((chunk) => chunk.source)))
  return result.toDataStreamResponse({ headers: { 'X-Rob-Sources': JSON.stringify(sources) } })
}
