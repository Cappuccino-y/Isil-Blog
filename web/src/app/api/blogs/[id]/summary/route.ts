import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Blog } from '@/lib/models'
import { getSessionUser } from '@/lib/auth'
import { getVisibleBlog } from '@/lib/blogs'
import { streamGateway, type GatewayMessage } from '@/lib/ai'
import { allowRequest, clientIp } from '@/lib/rate-limit'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const session = await getSessionUser()
  const blog = await getVisibleBlog(id, session)
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })

  if (blog.summary) return NextResponse.json({ summary: blog.summary, cached: true })

  if (!process.env.MINIMAX_API_KEY) {
    return NextResponse.json({ error: 'AI service is not configured' }, { status: 503 })
  }
  if (!allowRequest(`summary:${session?.id || clientIp(_req)}`, 10, 5 * 60 * 1000)) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 })
  }

  const content = (blog.content || '').slice(0, 6000)
  if (!content.trim()) return NextResponse.json({ error: 'empty content' }, { status: 400 })

  const messages: GatewayMessage[] = [
    {
      role: 'system',
      content:
        '你是博客文章摘要助手。用不超过 120 字的中文概括这篇文章的核心内容，输出摘要正文本身，不要任何前缀、引语或标题。',
    },
    { role: 'user', content: `文章标题：${blog.title || ''}\n\n${content}` },
  ]

  let summary = ''
  for await (const ev of streamGateway(messages, false)) {
    if (ev.type === 'delta') summary += ev.text
  }
  summary = summary.trim()
  if (!summary) return NextResponse.json({ error: 'empty summary' }, { status: 502 })

  await connectDB()
  await Blog.findByIdAndUpdate(id, { summary })
  return NextResponse.json({ summary, cached: false })
}
