import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Blog } from '@/lib/models'

type Params = { params: Promise<{ id: string }> }

export async function POST(_req: Request, { params }: Params) {
  const { id } = await params
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
  await connectDB()
  const blog = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true }).select('views')
  if (!blog) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json({ views: blog.views ?? 0 })
}
