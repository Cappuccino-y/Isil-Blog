'use client'

import { useEffect, useState } from 'react'
import { Feather } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Comment {
  name: string
  content: string
  id: string
  date: string
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/35 bg-accent font-heading text-xs text-gold">
      {name ? name.slice(0, 1) : '✧'}
    </div>
  )
}

export function Comments({ blogId }: { blogId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`/api/blogs/${blogId}/comments`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setComments(data))
      .catch(() => {})
      .finally(() => setLoaded(true))
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((me) => me?.name && setName(me.name))
      .catch(() => {})
  }, [blogId])

  const submit = async () => {
    if (!name.trim() || !content.trim() || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), content: content.trim() }),
      })
      if (res.ok) {
        const comment = await res.json()
        setComments((list) => [...list, comment])
        setContent('')
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mt-16">
      <div className="moon-divider mb-8 text-xs">✧ 低语与回响 ✧</div>

      <div className="moon-glass moon-hairline rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Avatar name={name} />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="你的名讳"
            maxLength={40}
            className="h-9 max-w-52 flex-1 rounded-xl border-glass-border bg-transparent"
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="留下一句低语，风会把它带到月亮上……"
          rows={4}
          maxLength={1000}
          className="mt-3 resize-none rounded-xl border-glass-border bg-transparent"
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{content.length}/1000</span>
          <Button
            onClick={submit}
            disabled={sending || !name.trim() || !content.trim()}
            className="gap-2 rounded-xl"
          >
            <Feather size={14} />
            {sending ? '随风而去…' : '寄出低语'}
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {loaded && comments.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            尚无人低语 —— 月亮在等第一句话。
          </p>
        )}
        {comments.map((c) => (
          <div
            key={c.id}
            className="moon-glass group flex gap-3 rounded-xl p-4 transition-colors hover:border-gold/30"
          >
            <Avatar name={c.name} />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-heading text-sm text-gold">{c.name}</span>
                <time className="shrink-0 text-xs text-muted-foreground">
                  {c.date?.slice(0, 10)}
                </time>
              </div>
              <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
                {c.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
