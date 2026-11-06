import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { SYSTEM_PROMPT } from '../../../src/data/systemPrompt.js'
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
  if (error) return Response.json({ error }, { status: 400 })

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: SYSTEM_PROMPT,
    messages,
    maxTokens: MAX_OUTPUT_TOKENS,
  })

  return result.toDataStreamResponse()
}
