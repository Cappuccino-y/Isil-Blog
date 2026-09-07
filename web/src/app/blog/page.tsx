import { listVisibleBlogs, excerpt } from '@/lib/blogs'
import { getSessionUser } from '@/lib/auth'
import { BlogBrowser } from '@/components/blog-browser'
import type { BlogCardData } from '@/components/blog-card'

export const dynamic = 'force-dynamic'

export const metadata = { title: '编年史' }

export default async function BlogPage() {
  const session = await getSessionUser()
  let blogs: BlogCardData[] = []
  try {
    const raw = await listVisibleBlogs(session)
    blogs = raw.map((b) => ({
      id: b.id,
      title: b.title || '',
      tag: b.tag || '',
      date: b.date,
      likes: b.likes ?? 0,
      views: b.views ?? 0,
      excerpt: excerpt(b.content, 90),
      author: b.user?.name || b.user?.username,
    }))
  } catch {}

  return (
    <>
      <section className="relative -mt-20 flex h-[46vh] min-h-80 flex-col items-center justify-end overflow-hidden pb-14">
        <div
          className="absolute inset-0 bg-cover bg-[center_35%]"
          style={{ backgroundImage: "url('/art/minastirith.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(4,8,18,0.2)] via-transparent to-background" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[rgba(8,12,24,0.6)] to-transparent" />
        <div className="relative z-10 px-6 text-center">
          <div className="flex items-center justify-center gap-3 text-xs tracking-[0.5em] text-gold drop-shadow">
            <span className="moon-eyebrow-line" />
            THE CHRONICLES
            <span className="moon-eyebrow-line-right" />
          </div>
          <h1 className="moon-title-glow mt-4 font-heading text-4xl tracking-[0.3em] text-[#f4f6fa]">
            编 年 史
          </h1>
          <p className="mt-3 text-sm text-[#c9d4ea] drop-shadow">
            共 {blogs.length} 页编年史 · 如白塔七层，层层有月光
          </p>
        </div>
      </section>
      <main className="mx-auto max-w-6xl px-6 pb-10">
        <BlogBrowser blogs={blogs} currentUsername={session?.username} />
      </main>
    </>
  )
}
