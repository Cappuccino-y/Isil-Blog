import { Blog, type IBlog } from './models'
import { excerpt, isVisibleTo, namesForUser, visibleFilter } from './blogs'
import { connectDB } from './db'
import type { SessionUser } from './auth'

const BASE = process.env.MINIMAX_API_BASE || 'https://api.minimaxi.com/v1'
const KEY = process.env.MINIMAX_API_KEY || ''
const MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M3'

const SUMMARY_CHARS = 120
const SEARCH_RESULTS = 6

export const SYSTEM_PROMPT = [
  '你是 Tilion —— 月之迈雅、双树纪元起便驾月环游天穹的猎手，如今驻守于 Isil 月境，守望博主 LYY 的编年史。',
  '你言辞优雅、温和而睿智，带有一丝中土世界的诗性，但回答必须基于事实、简洁可用。',
  '闲聊问题直接回答；当用户询问博客文章、站内内容时，优先依据下方目录作答；需要全文细节时调用 get_blog；当目录不足以定位时调用 search_blogs 检索标题与正文。',
  '数学公式使用 KaTeX：行内用 $...$，独立公式用 $$...$$。',
  '提及文章时给出文章 id，方便用户取阅。',
].join('\n')

export interface ToolCall {
  id: string
  name: string
  arguments: string
}

export type GatewayMessage = {
  role: 'system' | 'user' | 'assistant' | 'tool'
  content: string
  tool_calls?: { id: string; type: 'function'; function: { name: string; arguments: string } }[]
  tool_call_id?: string
}

export const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'search_blogs',
      description: '按关键词检索当前用户可见的博客文章（匹配标题、正文、标签），返回候选列表。',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: '检索关键词' },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_blog',
      description: '获取一篇博客的完整内容（含目录中列出的或检索到的文章）。',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: '文章 id' },
        },
        required: ['id'],
      },
    },
  },
]

export function aiConfigured() {
  return Boolean(KEY)
}

export async function buildCatalog(user: SessionUser | null) {
  await connectDB()
  const blogs = await Blog.find(await visibleFilter(user)).sort({ date: -1 }).lean()
  return blogs.map((b) => ({
    id: (b as IBlog)._id.toString(),
    title: b.title || '',
    summary: excerpt(b.content, SUMMARY_CHARS),
  }))
}

export async function searchBlogs(user: SessionUser | null, rawQuery: string) {
  await connectDB()
  const q = (rawQuery || '').trim()
  if (!q) return { results: [] }
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(escaped, 'i')
  const scope = await visibleFilter(user)
  const filter = {
    $and: [scope, { $or: [{ title: re }, { content: re }, { tag: re }] }],
  }
  const blogs = await Blog.find(filter).sort({ date: -1 }).limit(SEARCH_RESULTS).lean()
  return {
    results: blogs.map((b) => ({
      id: (b as IBlog)._id.toString(),
      title: b.title || '',
      summary: excerpt(b.content, SUMMARY_CHARS),
    })),
  }
}

export async function blogForTool(id: string, user: SessionUser | null) {
  await connectDB()
  if (typeof id !== 'string' || !/^[0-9a-fA-F]{24}$/.test(id)) return { error: 'invalid blog id' }
  const blog = await Blog.findById(id)
  if (!blog) return { error: 'blog not found or not visible' }
  const names = await namesForUser(user)
  if (!isVisibleTo(blog, user, names)) return { error: 'blog not found or not visible' }
  return {
    id,
    title: blog.title || '',
    tag: blog.tag || '',
    date: blog.date,
    content: blog.content || '',
  }
}

export async function executeTool(call: ToolCall, user: SessionUser | null) {
  let args: Record<string, unknown> = {}
  try {
    args = JSON.parse(call.arguments || '{}')
  } catch {}
  if (call.name === 'get_blog') return blogForTool(String(args.id ?? ''), user)
  if (call.name === 'search_blogs') return searchBlogs(user, String(args.query ?? ''))
  return { error: 'unknown tool' }
}

export type StreamEvent =
  | { type: 'delta'; text: string }
  | { type: 'tool_calls'; calls: ToolCall[] }

export async function* streamGateway(
  messages: GatewayMessage[],
  useTools: boolean,
): AsyncGenerator<StreamEvent> {
  const body: Record<string, unknown> = {
    model: MODEL,
    messages,
    thinking: { type: 'disabled' },
    max_completion_tokens: 4096,
  }
  if (useTools) {
    body.tools = TOOLS
    body.tool_choice = 'auto'
  }
  const res = await fetch(`${BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`gateway ${res.status}: ${text.slice(0, 300)}`)
  }

  const contentType = res.headers.get('content-type') || ''
  const isSSE = res.body && contentType.includes('text/event-stream')

  if (!isSSE) {
    const data = await res.json()
    if (data.base_resp && data.base_resp.status_code !== 0) {
      throw new Error(`MiniMax error ${data.base_resp.status_code}: ${data.base_resp.status_msg}`)
    }
    const msg = data.choices?.[0]?.message
    if (msg?.content) yield { type: 'delta', text: msg.content }
    if (msg?.tool_calls?.length) {
      yield {
        type: 'tool_calls',
        calls: msg.tool_calls.map((tc: { id: string; function: { name: string; arguments: string } }) => ({
          id: tc.id,
          name: tc.function?.name || '',
          arguments: tc.function?.arguments || '',
        })),
      }
    }
    return
  }

  const reader = res.body!.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  const calls: (ToolCall | null)[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += decoder.decode(value, { stream: true })
    let idx: number
    while ((idx = buf.indexOf('\n')) !== -1) {
      const line = buf.slice(0, idx).trim()
      buf = buf.slice(idx + 1)
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      let chunk: {
        base_resp?: { status_code: number; status_msg?: string }
        choices?: { delta?: { content?: string; tool_calls?: { index?: number; id?: string; function?: { name?: string; arguments?: string } }[] } }[]
      }
      try {
        chunk = JSON.parse(payload)
      } catch {
        continue
      }
      if (chunk.base_resp && chunk.base_resp.status_code !== 0) {
        throw new Error(`MiniMax error ${chunk.base_resp.status_code}: ${chunk.base_resp.status_msg}`)
      }
      const delta = chunk.choices?.[0]?.delta
      if (!delta) continue
      if (delta.content) yield { type: 'delta', text: delta.content }
      if (delta.tool_calls) {
        for (const tc of delta.tool_calls) {
          const i = tc.index ?? 0
          if (!calls[i]) calls[i] = { id: '', name: '', arguments: '' }
          if (tc.id) calls[i]!.id = tc.id
          if (tc.function?.name) calls[i]!.name += tc.function.name
          if (tc.function?.arguments) calls[i]!.arguments += tc.function.arguments
        }
      }
    }
  }
  const compact = calls.filter((c): c is ToolCall => Boolean(c && c.id))
  if (compact.length) yield { type: 'tool_calls', calls: compact }
}
