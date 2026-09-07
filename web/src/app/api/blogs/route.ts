import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Blog, User } from '@/lib/models'
import { getSessionUser } from '@/lib/auth'
import { listVisibleBlogs } from '@/lib/blogs'

export async function GET() {
  const session = await getSessionUser()
  const blogs = await listVisibleBlogs(session)
  return NextResponse.json(blogs)
}

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let body: { title?: string; content?: string; tag?: string; visible?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }
  const title = (body.title || '').trim()
  const content = body.content || ''
  if (!title) return NextResponse.json({ error: 'title required' }, { status: 400 })

  await connectDB()
  const user = await User.findById(session.id)
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const blog = new Blog({
    title,
    content,
    tag: (body.tag || '').trim(),
    likes: 0,
    views: 0,
    user: user._id,
    visible: Array.isArray(body.visible) && body.visible.length ? body.visible : ['public'],
    comments: [],
  })
  const saved = await blog.save()
  user.blogs = user.blogs.concat(saved._id)
  await user.save()
  await saved.populate('user', { username: 1, name: 1 })
  return NextResponse.json(saved.toJSON())
}
