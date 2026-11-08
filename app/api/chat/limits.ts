// Haiku 5.5 thinks by default and thinking counts toward this cap, so leave room above a short answer.
export const MAX_OUTPUT_TOKENS = 800
// AI Gateway model ID. Override with AI_GATEWAY_MODEL, e.g. to a model on the free tier.
export const MODEL = process.env.AI_GATEWAY_MODEL || 'anthropic/claude-haiku-5.5'
export const MAX_USER_MESSAGE_CHARS = 500
export const MAX_TOTAL_CHARS = 12000
export const MAX_MESSAGES = 30

const MINUTE_MS = 60_000
const DAY_MS = 24 * 60 * MINUTE_MS
const PER_MINUTE = 6
const PER_DAY = 40
// Model calls per instance per day across all visitors; past this, answers come from the notes.
const MODEL_CALLS_PER_DAY = 300
const MAX_TRACKED_IPS = 10_000

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

// In-memory, so each serverless instance counts separately. This caps abuse of a
// single instance; a shared store is needed for a hard limit across instances.
const hits = new Map<string, number[]>()

export function checkRateLimit(ip: string, now = Date.now()): { ok: boolean; retryAfter: number } {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < DAY_MS)
  const lastMinute = recent.filter((t) => now - t < MINUTE_MS)

  if (lastMinute.length >= PER_MINUTE) {
    hits.set(ip, recent)
    return { ok: false, retryAfter: Math.ceil((lastMinute[0] + MINUTE_MS - now) / 1000) }
  }
  if (recent.length >= PER_DAY) {
    hits.set(ip, recent)
    return { ok: false, retryAfter: Math.ceil((recent[0] + DAY_MS - now) / 1000) }
  }

  // Oldest entry goes first; Map keeps insertion order.
  if (!hits.has(ip) && hits.size >= MAX_TRACKED_IPS) {
    hits.delete(hits.keys().next().value as string)
  }
  recent.push(now)
  hits.set(ip, recent)
  return { ok: true, retryAfter: 0 }
}

let modelDay = ''
let modelCalls = 0

export function checkModelBudget(now = new Date()): boolean {
  const day = now.toISOString().slice(0, 10)
  if (day !== modelDay) {
    modelDay = day
    modelCalls = 0
  }
  if (modelCalls >= MODEL_CALLS_PER_DAY) return false
  modelCalls++
  return true
}

// Browsers always send Origin on a cross-site POST. Reject other sites calling the
// route from a visitor's browser; requests without Origin still face the limits.
export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.get('host')
  } catch {
    return false
  }
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}

export function validateMessages(input: unknown): { messages?: ChatMessage[]; error?: string } {
  if (!Array.isArray(input) || input.length === 0) return { error: 'messages must be a non-empty array' }
  if (input.length > MAX_MESSAGES) return { error: `at most ${MAX_MESSAGES} messages allowed` }

  let total = 0
  for (const message of input) {
    if (message?.role !== 'user' && message?.role !== 'assistant') return { error: 'invalid message role' }
    if (typeof message.content !== 'string') return { error: 'message content must be a string' }
    if (message.role === 'user' && message.content.length > MAX_USER_MESSAGE_CHARS) {
      return { error: `messages are limited to ${MAX_USER_MESSAGE_CHARS} characters` }
    }
    total += message.content.length
  }
  if (total > MAX_TOTAL_CHARS) return { error: 'conversation is too long' }
  if (input[input.length - 1].role !== 'user') return { error: 'last message must be from the user' }

  return { messages: input.map(({ role, content }) => ({ role, content })) }
}
