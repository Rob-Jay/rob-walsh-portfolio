import Anthropic from '@anthropic-ai/sdk'
import { getVercelOidcToken } from '@vercel/oidc'
import { REFUSAL, buildSystemPrompt, notesAnswer, retrieve } from '../../../lib/knowledge'
import {
  MAX_OUTPUT_TOKENS,
  MODEL,
  checkModelBudget,
  checkRateLimit,
  clientIp,
  isAllowedOrigin,
  validateMessages,
} from './limits'

const GATEWAY_URL = 'https://ai-gateway.vercel.sh'

// Same line format as before: 0: carries text. The client and the eval runner read it.
const encoder = new TextEncoder()
const textLine = (text: string) => encoder.encode(`0:${JSON.stringify(text)}\n`)

// AI Gateway auth: an API key if one is set, otherwise the deployment's own OIDC
// token, so no secret is needed on Vercel. Returns null when neither is available.
async function gatewayCredential(): Promise<string | null> {
  if (process.env.AI_GATEWAY_API_KEY) return process.env.AI_GATEWAY_API_KEY
  try {
    return await getVercelOidcToken()
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) return Response.json({ error: 'Forbidden' }, { status: 403 })

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
  const sources = JSON.stringify(Array.from(new Set(chunks.map((chunk) => chunk.source))))
  const respond = (body: BodyInit, mode: 'ai' | 'notes' | 'refusal') =>
    new Response(body, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Rob-Sources': sources, 'X-Rob-Mode': mode },
    })

  // Not covered by the notes: refuse here, without any model call.
  if (chunks.length === 0) return respond(textLine(REFUSAL), 'refusal')

  // Fallback that costs nothing: quote the best matching note.
  const fromNotes = () => respond(textLine(notesAnswer(chunks)), 'notes')

  const credential = await gatewayCredential()
  if (!credential || !checkModelBudget()) return fromNotes()

  const client = new Anthropic({ apiKey: credential, baseURL: GATEWAY_URL, maxRetries: 0 })
  const reply = client.messages.stream({
    model: MODEL,
    max_tokens: MAX_OUTPUT_TOKENS,
    output_config: { effort: 'low' },
    system: buildSystemPrompt(chunks),
    messages,
  })

  // Wait for the first event so a failed call (no credit, rate limited, model not
  // on the free tier) falls back to the notes instead of a broken answer.
  const iterator = reply[Symbol.asyncIterator]()
  let first: IteratorResult<Anthropic.MessageStreamEvent>
  try {
    first = await iterator.next()
  } catch (err) {
    logError(err)
    return fromNotes()
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let sent = false
      const handle = (event: Anthropic.MessageStreamEvent) => {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          controller.enqueue(textLine(event.delta.text))
          sent = true
        }
      }
      try {
        if (!first.done) handle(first.value)
        for (let next = await iterator.next(); !next.done; next = await iterator.next()) handle(next.value)
        const final = await reply.finalMessage()
        if (final.stop_reason === 'refusal') controller.enqueue(textLine(REFUSAL))
      } catch (err) {
        logError(err)
        if (!sent) controller.enqueue(textLine(notesAnswer(chunks)))
      }
      controller.close()
    },
  })

  return respond(stream, 'ai')
}

function logError(err: unknown) {
  if (err instanceof Anthropic.APIError) {
    console.error('chat model error', err.status, err.name, err.message.slice(0, 300))
  } else {
    console.error('chat model error', err)
  }
}
