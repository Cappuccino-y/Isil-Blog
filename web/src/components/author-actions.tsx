'use client'

import { useRouter } from 'next/navigation'
import { PenLine, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export function AuthorActions({ blogId }: { blogId: string }) {
  const router = useRouter()

  const remove = async () => {
    if (!window.confirm('确定要将这一篇归于星尘吗？此操作不可逆。')) return
    try {
      const res = await fetch(`/api/blogs/${blogId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('这一页已归于星尘')
      router.push('/blog')
      router.refresh()
    } catch {
      toast.error('删除失败')
    }
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={`/compose?id=${blogId}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-4 py-1.5 text-sm text-gold transition-all hover:bg-accent"
      >
        <PenLine size={14} />
        重铸此篇
      </Link>
      <button
        onClick={remove}
        className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 px-4 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
      >
        <Trash2 size={14} />
        归于星尘
      </button>
    </div>
  )
}
