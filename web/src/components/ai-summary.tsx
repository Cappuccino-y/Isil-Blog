'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'

export function AiSummary({ blogId }: { blogId: string }) {
  const [state, setState] = useState<'loading' | 'typing' | 'done' | 'error'>('loading')
  const [summary, setSummary] = useState('')
  const [cached, setCached] = useState(false)
  const fullRef = useRef('')
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    let alive = true
    const load = async () => {
      setState('loading')
      try {
        const res = await fetch(`/api/blogs/${blogId}/summary`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        if (!alive) return
        fullRef.current = data.summary || ''
        setSummary(fullRef.current)
        setCached(Boolean(data.cached))
        setState(data.cached || fullRef.current.length < 60 ? 'done' : 'typing')
      } catch {
        if (alive) setState('error')
      }
    }
    load()
    return () => {
      alive = false
      if (timer.current) clearInterval(timer.current)
    }
  }, [blogId])

  useEffect(() => {
    if (state !== 'typing') return
    let i = 0
    timer.current = setInterval(() => {
      i += 2
      const full = fullRef.current
      if (i >= full.length) {
        if (timer.current) clearInterval(timer.current)
        setSummary(full)
        setState('done')
        return
      }
      setSummary(full.slice(0, i))
    }, 24)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [state])

  return (
    <aside className="moon-glass moon-hairline rounded-2xl border-gold/25 p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm tracking-widest text-gold">
          <Sparkles size={14} className="moon-breathe" />
          Tilion 凝萃
        </div>
        {state === 'done' && (
          <span className="text-[10px] text-muted-foreground">{cached ? '凝萃如初' : '新凝之萃'}</span>
        )}
      </div>
      <div className="mt-3 min-h-10 text-sm leading-relaxed text-foreground/85">
        {state === 'loading' && (
          <span className="inline-flex items-center gap-2 text-muted-foreground">
            <Loader2 size={14} className="animate-spin" />
            月光正凝成文字……
          </span>
        )}
        {state === 'typing' && (
          <span>
            {summary}
            <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-gold align-middle" />
          </span>
        )}
        {state === 'done' && <p>{summary}</p>}
        {state === 'error' && (
          <span className="text-muted-foreground">月光暂时被云遮蔽了。</span>
        )}
      </div>
    </aside>
  )
}
