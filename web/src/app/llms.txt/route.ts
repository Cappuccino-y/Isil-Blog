import { listVisibleBlogs } from '@/lib/blogs'
import { excerpt } from '@/lib/blogs'

export const dynamic = 'force-dynamic'

export async function GET() {
  const blogs = await listVisibleBlogs(null)
  const lines = [
    '# Isil · LYY 的月境编年史',
    '',
    '> 一座安放知识与思绪的中土小站。站长 LYY，AI 守护者名为 Tilion。',
    '',
    '## 文章目录',
    '',
    ...blogs.map(
      (b) =>
        `- [${b.title || '无题'}](/blog/${b.id}) — ${b.date?.slice(0, 10) || ''}${b.tag ? ` [${b.tag}]` : ''}: ${excerpt(b.content, 100)}`,
    ),
    '',
  ]
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
