import Link from 'next/link'
import { Eye, Sparkles } from 'lucide-react'

export interface BlogCardData {
  id: string
  title?: string
  excerpt?: string
  tag?: string
  date?: string
  likes?: number
  views?: number
  author?: string
}

export function BlogCard({
  blog,
  delay = 0,
  featured = false,
}: {
  blog: BlogCardData
  delay?: number
  featured?: boolean
}) {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className={`moon-glass moon-hairline moon-card-hover moon-stagger group flex h-full min-w-0 flex-col rounded-2xl ${
        featured ? 'p-7' : 'p-6'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-gold/30 px-2.5 py-0.5 text-xs text-gold">
          {blog.tag || '无羁'}
        </span>
        <time className="text-xs text-muted-foreground">{blog.date?.slice(0, 10)}</time>
      </div>
      <h3
        className={`mt-4 break-words font-body font-semibold leading-snug tracking-wide text-foreground transition-colors group-hover:text-gold ${
          featured ? 'text-xl' : 'text-lg'
        }`}
      >
        {blog.title || '无题之篇'}
      </h3>
      <p className="mt-2.5 line-clamp-3 break-words text-sm leading-relaxed text-muted-foreground">
        {blog.excerpt || '静待月光的篇章……'}
      </p>
      <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Sparkles size={12} className="text-gold/70" />
          {blog.likes ?? 0}
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye size={12} />
          {blog.views ?? 0}
        </span>
        {blog.author && <span className="ml-auto">{blog.author}</span>}
      </div>
    </Link>
  )
}
