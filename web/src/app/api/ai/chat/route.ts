import { getSessionUser } from '@/lib/auth'
import { sanitizeMessages } from '@/lib/sanitize'
import {
  SYSTEM_PROMPT,
  aiConfigured,
  buildCatalog,
  executeTool,
  streamGateway,
  type GatewayMessage,
  type ToolCall,
} from '@/lib/ai'
import { allowRequest, clientIp } from '@/lib/rate-limit'

const MAX_HISTORY = 12
const MAX_TOOL_ROUNDS = 2

export async function POST(req: Request) {
  const session = await getSessionUser()

  let raw: { messages?: unknown }
  try {
    raw = await req.json()
  } catch {
    return Response.json({ error: 'invalid body' }, { status: 400 })
  }
  const messages = sanitizeMessages(raw.messages)
  if (!messages) return Response.json({ error: 'invalid messages' }, { status: 400 })

  if (!aiConfigured()) {
    return Response.json({ error: 'AI service is not configured' }, { status: 503 })
  }

  const limitKey = session ? `chat:user:${session.id}` : `chat:ip:${clientIp(req)}`
  const limit = session ? 20 : 8
  if (!allowRequest(limitKey, limit, 5 * 60 * 1000)) {
    return Response.json({ error: 'too many requests, please try again later' }, { status: 429 })
  }

  const catalog = await buildCatalog(session)
  const chat: GatewayMessage[] = [
    {
      role: 'system',
      content:
        SYSTEM_PROMPT +
        '\n\n当前用户可见的博客目录（JSON 数组，含 id/标题/摘要）：\n' +
        JSON.stringify(catalog),
    },
    ...messages.slice(-MAX_HISTORY),
  ]

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`))
      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const useTools = round < MAX_TOOL_ROUNDS
          let calls: ToolCall[] | null = null
          for await (const ev of streamGateway(chat, useTools)) {
            if (ev.type === 'delta') send({ type: 'delta', text: ev.text })
            else calls = ev.calls
          }
          if (!calls || calls.length === 0) break
          send({ type: 'tool', names: calls.map((c) => c.name) })
          chat.push({
            role: 'assistant',
            content: '',
            tool_calls: calls.map((c) => ({
              id: c.id,
              type: 'function' as const,
              function: { name: c.name, arguments: c.arguments },
            })),
          })
          for (const call of calls) {
            const result = await executeTool(call, session)
            chat.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
          }
        }
      } catch (error) {
        send({
          type: 'error',
          message: error instanceof Error ? error.message : 'AI service error',
        })
      } finally {
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
