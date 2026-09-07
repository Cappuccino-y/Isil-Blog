import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Blog } from '@/lib/models'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  let delta = 1
  try {
    const body = await req.json()
    if (body && body.delta === -1) delta = -1
  } catch {}
  await connectDB()
  const blog = await Blog.findById(id).select('likes')
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const next = Math.max(0, (blog.likes || 0) + delta)
  blog.likes = next
  await blog.save()
  return NextResponse.json({ likes: next })
}
