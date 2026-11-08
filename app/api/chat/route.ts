import Anthropic from '@anthropic-ai/sdk'
import { REFUSAL, buildSystemPrompt, retrieve } from '../../../lib/knowledge'
import { MAX_OUTPUT_TOKENS, MODEL, checkRateLimit, clientIp, validateMessages } from './limits'

const client = new Anthropic()

// Same line format as before: 0: carries text, 3: an error. The client and the
// eval runner read this format.
const encoder = new TextEncoder()
const textLine = (text: string) => encoder.encode(`0:${JSON.stringify(text)}\n`)
const errorLine = () => encoder.encode(`3:${JSON.stringify('An error occurred.')}\n`)

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

  const headers = {
    'Content-Type': 'text/plain; charset=utf-8',
    'X-Rob-Sources': JSON.stringify(Array.from(new Set(chunks.map((chunk) => chunk.source)))),
  }

  // Not covered by the notes: refuse here, without paying for a model call.
  if (chunks.length === 0) return new Response(textLine(REFUSAL), { headers })

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const reply = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          // Short factual answers: low effort keeps thinking light and replies fast.
          output_config: { effort: 'low' },
          system: buildSystemPrompt(chunks),
          messages,
        })
        for await (const event of reply) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(textLine(event.delta.text))
          }
        }
        const final = await reply.finalMessage()
        if (final.stop_reason === 'refusal') controller.enqueue(textLine(REFUSAL))
      } catch (err) {
        // The client only sees a generic error, so record the cause here.
        if (err instanceof Anthropic.APIError) {
          console.error('chat stream error', err.status, err.name, err.message.slice(0, 300))
        } else {
          console.error('chat stream error', err)
        }
        controller.enqueue(errorLine())
      }
      controller.close()
    },
  })

  return new Response(stream, { headers })
}
