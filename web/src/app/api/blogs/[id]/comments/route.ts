import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Blog } from '@/lib/models'
import { getSessionUser } from '@/lib/auth'
import { getVisibleBlog } from '@/lib/blogs'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Params) {
  const { id } = await params
  const session = await getSessionUser()
  const blog = await getVisibleBlog(id, session)
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(blog.comments || [])
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params
  const session = await getSessionUser()
  const blog = await getVisibleBlog(id, session)
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })

  let body: { name?: string; content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  const name = (body.name || '').trim().slice(0, 40)
  const content = (body.content || '').trim().slice(0, 1000)
  if (!name || !content) {
    return NextResponse.json({ error: 'name and content required' }, { status: 400 })
  }

  const comment = { name, content, id: crypto.randomUUID(), date: new Date() }
  await connectDB()
  await Blog.findByIdAndUpdate(id, { $push: { comments: comment } })
  return NextResponse.json(comment)
}
