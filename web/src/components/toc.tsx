'use client'

import { useEffect, useState } from 'react'
import { ListTree } from 'lucide-react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? Math.min(1, el.scrollTop / total) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed inset-x-0 top-0 z-[55] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-star via-gold to-gold-bright transition-[width] duration-150"
        style={{ width: `${progress * 100}%`, boxShadow: '0 0 10px var(--glow)' }}
      />
    </div>
  )
}

interface TocItem {
  id: string
  text: string
  level: number
}

export function Toc() {
  const [items, setItems] = useState<TocItem[]>([])
  const [active, setActive] = useState('')

  useEffect(() => {
    const prose = document.querySelector('.moon-prose')
    if (!prose) return
    const headings = Array.from(prose.querySelectorAll('h2, h3')) as HTMLElement[]
    const list = headings
      .filter((h) => h.id)
      .map((h) => ({ id: h.id, text: h.textContent?.replace(/^✦\s*/, '') || '', level: h.tagName === 'H2' ? 2 : 3 }))
    setItems(list)
    if (list.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-80px 0px -70% 0px' },
    )
    headings.forEach((h) => h.id && io.observe(h))
    return () => io.disconnect()
  }, [])

  if (items.length === 0) return null

  return (
    <nav
      aria-label="目录"
      className="moon-glass moon-hairline max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl p-5 [scrollbar-width:thin]"
    >
      <div className="mb-3 flex items-center gap-2 text-xs tracking-widest text-gold">
        <ListTree size={13} />
        卷目
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block truncate transition-colors ${
                active === item.id
                  ? 'text-gold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={item.text}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
