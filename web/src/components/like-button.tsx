'use client'

import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const LIKED_KEY = 'isil_liked'

function readLiked(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]')
  } catch {
    return []
  }
}

export function LikeButton({ blogId, initial }: { blogId: string; initial: number }) {
  const [likes, setLikes] = useState(initial)
  const [liked, setLiked] = useState(false)
  const [burst, setBurst] = useState(false)

  useEffect(() => {
    setLiked(readLiked().includes(blogId))
  }, [blogId])

  const toggle = async () => {
    const next = !liked
    setLiked(next)
    setLikes((n) => Math.max(0, n + (next ? 1 : -1)))
    if (next) {
      setBurst(true)
      setTimeout(() => setBurst(false), 600)
    }
    const stored = readLiked()
    localStorage.setItem(
      LIKED_KEY,
      JSON.stringify(next ? [...stored, blogId] : stored.filter((id) => id !== blogId)),
    )
    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta: next ? 1 : -1 }),
      })
      const data = await res.json()
      if (typeof data.likes === 'number') setLikes(data.likes)
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className={`moon-like-btn group inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-all ${
        liked
          ? 'border-gold/60 bg-accent text-gold'
          : 'border-glass-border text-muted-foreground hover:border-gold/40 hover:text-gold'
      }`}
    >
      <Sparkles
        size={15}
        className={burst ? 'animate-ping' : 'transition-transform group-hover:scale-125'}
      />
      <span>{likes}</span>
      <span className="hidden sm:inline">{liked ? '星光已缀' : '缀一颗星'}</span>
    </button>
  )
}

export function ViewPing({ blogId }: { blogId: string }) {
  useEffect(() => {
    if (sessionStorage.getItem(`viewed:${blogId}`)) return
    sessionStorage.setItem(`viewed:${blogId}`, '1')
    fetch(`/api/blogs/${blogId}/view`, { method: 'POST' }).catch(() => {})
  }, [blogId])
  return null
}
