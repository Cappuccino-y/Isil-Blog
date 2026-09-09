import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock3, Eye } from 'lucide-react'
import { getVisibleBlog, readingMinutes } from '@/lib/blogs'
import { getSessionUser } from '@/lib/auth'
import { Markdown } from '@/components/markdown'
import { AiSummary } from '@/components/ai-summary'
import { LikeButton, ViewPing } from '@/components/like-button'
import { Comments } from '@/components/comments'
import { ReadingProgress, Toc } from '@/components/toc'
import { Crescent } from '@/components/moon-phases'
import { AuthorActions } from '@/components/author-actions'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const session = await getSessionUser()
  const blog = await getVisibleBlog(id, session).catch(() => null)
  return { title: blog?.title || '无题之篇' }
}

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params
  const session = await getSessionUser()
  const blog = await getVisibleBlog(id, session).catch(() => null)
  if (!blog) notFound()
  const isAuthor = Boolean(session && blog.user?.id === session.id)

  return (
    <main className="mx-auto max-w-6xl px-6 pb-10">
      <ViewPing blogId={blog.id} />
      <ReadingProgress />
      <div className="grid gap-10 lg:grid-cols-[1fr_250px]">
        <article className="mx-auto w-full min-w-0 max-w-3xl">
          <div className="pt-2 text-left">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
            >
              <ArrowLeft size={14} />
              回到卷帙
            </Link>
          </div>
          <header className="pb-8 pt-4 text-center">
            <div className="flex items-center justify-center gap-3 text-xs tracking-[0.4em] text-gold">
              <span className="moon-eyebrow-line" />
              {blog.tag || '无羁'}
              <span className="moon-eyebrow-line-right" />
            </div>
            <h1 className="mt-5 break-words font-body text-3xl font-semibold leading-snug tracking-wide sm:text-4xl">
              {blog.title || '无题之篇'}
            </h1>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Crescent size={11} className="text-gold" />
                {blog.user?.name || '守月人'}
              </span>
              <time>{blog.date?.slice(0, 10)}</time>
              <span className="inline-flex items-center gap-1">
                <Clock3 size={12} />
                {readingMinutes(blog.content)} 分钟的月光
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={12} />
                {blog.views ?? 0} 次驻足
              </span>
            </div>
          </header>

          <AiSummary blogId={blog.id} />

          <div className="mt-10">
            <Markdown>{blog.content || ''}</Markdown>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-between gap-4">
            <LikeButton blogId={blog.id} initial={blog.likes ?? 0} />
            <div className="flex items-center gap-4">
              {isAuthor && <AuthorActions blogId={blog.id} />}
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-gold"
              >
                <ArrowLeft size={14} />
                回到卷帙
              </Link>
            </div>
          </div>

          <Comments blogId={blog.id} />
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Toc />
          </div>
        </aside>
      </div>
    </main>
  )
}
