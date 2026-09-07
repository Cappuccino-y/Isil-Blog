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
  return NextResponse.json(blog)
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  await connectDB()
  const blog = await Blog.findById(id)
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (blog.user.toString() !== session.id) {
    return NextResponse.json({ error: 'no permission' }, { status: 403 })
  }

  let body: { title?: string; content?: string; tag?: string; visible?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  if (typeof body.title === 'string') blog.title = body.title.trim()
  if (typeof body.content === 'string') {
    if (body.content !== blog.content) blog.summary = undefined
    blog.content = body.content
  }
  if (typeof body.tag === 'string') blog.tag = body.tag.trim()
  if (Array.isArray(body.visible) && body.visible.length) blog.visible = body.visible

  const saved = await blog.save()
  await saved.populate('user', { username: 1, name: 1 })
  return NextResponse.json(saved.toJSON())
}

export async function DELETE(_req: Request, { params }: Params) {
  const { id } = await params
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  await connectDB()
  const blog = await Blog.findById(id)
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })
  if (blog.user.toString() !== session.id) {
    return NextResponse.json({ error: 'no permission' }, { status: 403 })
  }
  await blog.deleteOne()
  return new NextResponse(null, { status: 204 })
}
