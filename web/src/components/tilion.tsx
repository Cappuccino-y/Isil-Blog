'use client'

import { useEffect, useRef, useState } from 'react'
import { SendHorizontal, X } from 'lucide-react'
import { Crescent } from '@/components/moon-phases'
import { Markdown } from '@/components/markdown'

interface ChatMsg {
  role: 'user' | 'assistant' | 'tool'
  content: string
}

const WELCOME =
  '月光已泊岸 —— 我是 Tilion，驾月的守望者。可以与我闲谈，或让我为你寻一页编年史。'

const SUGGESTIONS = [
  '站里都写过些什么文章？',
  '帮我找一篇和相机相关的博客',
  '用一句话介绍这个博客',
]

export function Tilion() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMsg[]>([{ role: 'assistant', content: WELCOME }])
  const [waiting, setWaiting] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, open])

  const send = async (text: string) => {
    const content = text.trim()
    if (!content || waiting) return
    setInput('')
    const history = [...messages, { role: 'user' as const, content }]
    setMessages([...history, { role: 'assistant', content: '' }])
    setWaiting(true)

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history
            .filter((m) => m.role !== 'tool')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `服务失联 (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ''

      const handle = (payload: string) => {
        if (payload === '[DONE]') return
        try {
          const ev = JSON.parse(payload)
          if (ev.type === 'delta') {
            setMessages((list) => {
              const next = [...list]
              const last = next[next.length - 1]
              if (last?.role === 'assistant') last.content += ev.text
              return next
            })
          } else if (ev.type === 'tool') {
            setMessages((list) => [
              ...list,
              { role: 'tool', content: `✦ Tilion 正在翻动${ev.names?.includes('search_blogs') ? '满架古籍' : '一页编年史'}……` },
            ])
          } else if (ev.type === 'error') {
            setMessages((list) => {
              const next = [...list]
              const last = next[next.length - 1]
              if (last?.role === 'assistant' && !last.content) {
                last.content = `月光暂时黯淡了：${ev.message}`
              }
              return next
            })
          }
        } catch {}
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buf += decoder.decode(value, { stream: true })
        let idx: number
        while ((idx = buf.indexOf('\n')) !== -1) {
          const line = buf.slice(0, idx).trim()
          buf = buf.slice(idx + 1)
          if (!line.startsWith('data:')) continue
          handle(line.slice(5).trim())
        }
      }
      setMessages((list) => {
        const last = list[list.length - 1]
        if (last?.role === 'assistant' && !last.content.trim()) {
          return [...list.slice(0, -1), { role: 'assistant', content: '（月之回声消散在风里了，请再试一次。）' }]
        }
        return list
      })
    } catch (error) {
      const msg = error instanceof Error ? error.message : '月光暂时黯淡了，请稍后再试。'
      setMessages((list) => {
        const last = list[list.length - 1]
        if (last?.role === 'assistant' && !last.content) {
          return [...list.slice(0, -1), { role: 'assistant', content: msg }]
        }
        return [...list, { role: 'assistant', content: msg }]
      })
    } finally {
      setWaiting(false)
    }
  }

  return (
    <div className="tilion-anchor">
      {open && (
        <div className="moon-glass moon-hairline mb-3 flex h-[540px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-glass-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Crescent size={17} className="text-gold moon-glow" />
              <div>
                <div className="font-heading text-sm tracking-[0.2em]">TILION</div>
                <div className="text-[10px] text-muted-foreground">月之迈雅 · 守望者</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="收起"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={16} />
            </button>
          </div>

          <div ref={boxRef} className="slide flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) =>
              m.role === 'tool' ? (
                <div key={i} className="text-center text-[11px] italic text-gold/80">
                  {m.content}
                </div>
              ) : (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-xl border px-3.5 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'border-gold/30 bg-accent text-accent-foreground'
                        : 'border-glass-border bg-muted/60 text-foreground'
                    }`}
                  >
                    {m.role === 'assistant' ? <Markdown>{m.content}</Markdown> : m.content}
                  </div>
                </div>
              ),
            )}
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-glass-border px-3 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    ✦ {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="flex items-end gap-2 border-t border-glass-border p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              placeholder="向月之守望者低语……"
              className="slide max-h-24 flex-1 resize-none rounded-xl border border-glass-border bg-transparent px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-gold/50"
            />
            <button
              onClick={() => send(input)}
              disabled={waiting || !input.trim()}
              aria-label="发送"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-all hover:bg-accent disabled:opacity-40"
            >
              <SendHorizontal size={15} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="唤醒 Tilion"
        className={`group relative flex h-13 w-13 items-center justify-center rounded-full border transition-all ${
          open
            ? 'border-glass-border bg-muted'
            : 'moon-glass border-gold/40 hover:shadow-[0_0_28px_var(--glow)]'
        }`}
        style={{ width: 52, height: 52 }}
      >
        <span className="absolute inset-0 rounded-full border border-gold/20 moon-spin-slow border-dashed" />
        <Crescent size={22} className={`text-gold ${open ? '' : 'moon-breathe'}`} />
      </button>
    </div>
  )
}
