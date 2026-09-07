import { Blog, User } from './models'
import { connectDB } from './db'
import type { SessionUser } from './auth'

export interface BlogJSON {
  id: string
  title?: string
  content?: string
  tag?: string
  likes?: number
  date: string
  user?: { id: string; username: string; name: string }
  visible: string[]
  comments: { name: string; content: string; id: string; date: string }[]
  summary?: string
  views?: number
}

export async function namesForUser(user: SessionUser | null): Promise<string[]> {
  if (!user) return []
  const doc = await User.findById(user.id).select('name username')
  return Array.from(
    new Set([user.username, doc?.name || '', doc?.username || ''].filter(Boolean)),
  )
}

export function visibleFilterWith(names: string[], userId?: string) {
  if (names.length === 0 && !userId) return { visible: 'public' }
  const or: Record<string, unknown>[] = [{ visible: 'public' }]
  if (names.length) or.push({ visible: { $in: names } })
  if (userId) or.push({ user: userId as never })
  return { $or: or }
}

export async function visibleFilter(user: SessionUser | null) {
  if (!user) return { visible: 'public' }
  const names = await namesForUser(user)
  return visibleFilterWith(names, user.id)
}

export function isVisibleTo(
  blog: { visible?: string[]; user?: unknown },
  user: SessionUser | null,
  names: string[] = [],
) {
  if (blog.visible?.includes('public')) return true
  if (!user) return false
  const all = [...names, user.username]
  if (blog.visible?.some((v) => all.includes(v))) return true
  const uid = userIdString(blog.user)
  return uid !== null && uid === user.id
}

function userIdString(user: unknown): string | null {
  if (user == null) return null
  if (typeof user === 'string') return user
  const u = user as { _id?: { toString(): string }; id?: string }
  if (u._id) return u._id.toString()
  if (u.id) return u.id
  return null
}

function serialized(doc: unknown): BlogJSON {
  const json = (doc as { toJSON(): Record<string, unknown> }).toJSON()
  if (json.date instanceof Date) json.date = json.date.toISOString()
  if (Array.isArray(json.comments)) {
    json.comments = json.comments.map((c) => {
      const comment = { ...(c as Record<string, unknown>) } as Record<string, unknown>
      if (comment.date instanceof Date) comment.date = comment.date.toISOString()
      return comment as BlogJSON['comments'][number]
    })
  }
  if (json.user && typeof json.user === 'object') {
    const u = json.user as Record<string, unknown>
    json.user = {
      id: String(u._id ?? u.id ?? ''),
      username: String(u.username ?? ''),
      name: String(u.name ?? ''),
    }
  }
  return json as unknown as BlogJSON
}

export async function listVisibleBlogs(user: SessionUser | null): Promise<BlogJSON[]> {
  await connectDB()
  const filter = await visibleFilter(user)
  const blogs = await Blog.find(filter)
    .sort({ date: -1 })
    .populate('user', { username: 1, name: 1 })
  return blogs.map(serialized)
}

export async function getVisibleBlog(
  id: string,
  user: SessionUser | null,
): Promise<BlogJSON | null> {
  await connectDB()
  if (!/^[0-9a-fA-F]{24}$/.test(id)) return null
  const blog = await Blog.findById(id).populate('user', { username: 1, name: 1 })
  if (!blog) return null
  if (!user) return isVisibleTo(blog, null) ? serialized(blog) : null
  const names = await namesForUser(user)
  return isVisibleTo(blog, user, names) ? serialized(blog) : null
}

export function readingMinutes(content?: string) {
  const chars = (content || '').replace(/\s/g, '').length
  return Math.max(1, Math.round(chars / 450))
}

export function stripMarkdown(md: string) {
  return md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+>]\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(content: string | undefined, limit = 120) {
  const flat = stripMarkdown(content || '')
  return flat.length <= limit ? flat : flat.slice(0, limit - 1) + '…'
}
