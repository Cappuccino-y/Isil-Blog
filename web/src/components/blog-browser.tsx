'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownWideNarrow, ChevronDown, Search, Sparkles } from 'lucide-react'
import { BlogCard, type BlogCardData } from '@/components/blog-card'
import { Reveal } from '@/components/reveal'
import { Input } from '@/components/ui/input'

function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string
  options: string[]
  selected: Set<string>
  onChange: (next: Set<string>) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const toggle = (opt: string) => {
    const next = new Set(selected)
    if (next.has(opt)) next.delete(opt)
    else next.add(opt)
    onChange(next)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
          selected.size > 0
            ? 'border-gold/60 bg-accent text-gold'
            : 'border-glass-border text-muted-foreground hover:text-foreground'
        }`}
      >
        {label}
        {selected.size > 0 && <span className="font-semibold">· {selected.size}</span>}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="moon-glass slide absolute left-1/2 top-full z-40 mt-2 max-h-72 w-56 -translate-x-1/2 overflow-y-auto rounded-xl p-2">
          {options.length === 0 && (
            <p className="px-2.5 py-2 text-xs text-muted-foreground">暂无可选项</p>
          )}
          {options.map((opt) => (
            <label
              key={opt}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={selected.has(opt)}
                onChange={() => toggle(opt)}
                className="h-3.5 w-3.5 accent-[#b08d57]"
              />
              {opt}
            </label>
          ))}
          {selected.size > 0 && (
            <button
              onClick={() => onChange(new Set())}
              className="mt-1 w-full border-t border-glass-border pt-1.5 text-xs text-muted-foreground transition-colors hover:text-gold"
            >
              清除选择
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function BlogBrowser({
  blogs,
  currentUsername,
}: {
  blogs: BlogCardData[]
  currentUsername?: string
}) {
  const [query, setQuery] = useState('')
  const [tags, setTags] = useState<Set<string>>(new Set())
  const [authors, setAuthors] = useState<Set<string>>(new Set())
  const [sort, setSort] = useState<'date' | 'likes'>('date')

  const tagOptions = useMemo(
    () => Array.from(new Set(blogs.map((b) => b.tag).filter(Boolean))) as string[],
    [blogs],
  )
  const authorOptions = useMemo(() => {
    const map = new Map<string, number>()
    for (const b of blogs) {
      const name = b.author || '佚名'
      map.set(name, (map.get(name) || 0) + 1)
    }
    return Array.from(map.keys()).sort((a, b) => {
      if (a === currentUsername) return -1
      if (b === currentUsername) return 1
      return a.localeCompare(b)
    })
  }, [blogs, currentUsername])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = blogs.filter((b) => {
      if (tags.size > 0 && (!b.tag || !tags.has(b.tag))) return false
      if (authors.size > 0 && !authors.has(b.author || '佚名')) return false
      if (!q) return true
      return (
        (b.title || '').toLowerCase().includes(q) ||
        (b.excerpt || '').toLowerCase().includes(q)
      )
    })
    if (sort === 'likes') return [...list].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    return [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  }, [blogs, query, tags, authors, sort])

  const chip = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
      active
        ? 'border-gold/60 bg-accent text-gold'
        : 'border-glass-border text-muted-foreground hover:text-foreground'
    }`

  return (
    <div className="w-full">
      <Reveal>
        <div className="flex flex-col gap-5 pb-10 pt-10">
          <div className="mx-auto w-full max-w-md">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜寻卷帙中的只言片语……"
                className="moon-glass rounded-full border-glass-border pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button onClick={() => setSort('date')} className={chip(sort === 'date')}>
              <ArrowDownWideNarrow size={11} />
              最新
            </button>
            <button onClick={() => setSort('likes')} className={chip(sort === 'likes')}>
              <Sparkles size={11} />
              最多星光
            </button>
            <span className="mx-1 h-4 w-px bg-border" />
            <MultiSelect
              label="作者"
              options={authorOptions}
              selected={authors}
              onChange={setAuthors}
            />
            <MultiSelect label="标签" options={tagOptions} selected={tags} onChange={setTags} />
          </div>

          <p className="text-center text-xs tracking-wider text-muted-foreground">
            呈上 {filtered.length} 页
          </p>
        </div>
      </Reveal>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted-foreground">
          {blogs.length === 0
            ? '编年史还是一卷空白的星图 —— 第一页正在被书写。'
            : '星图上找不到对应的章节，换一个词试试。'}
        </p>
      ) : (
        <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((b, i) => (
            <BlogCard key={b.id} blog={b} delay={Math.min(i, 8) * 60} />
          ))}
        </div>
      )}
    </div>
  )
}
