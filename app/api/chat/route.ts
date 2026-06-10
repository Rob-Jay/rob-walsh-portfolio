import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

const anthropic = createAnthropic()

export async function POST(req: Request) {
  const { messages, system } = await req.json()

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: system ?? '',
    messages,
    maxTokens: 400,
  })

  return result.toDataStreamResponse()
}
