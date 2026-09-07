'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTheme } from 'next-themes'
import { useRouter, useSearchParams } from 'next/navigation'
import { ImagePlus, Loader2, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Me {
  id: string
  username: string
  name: string
}

interface BlogData {
  id: string
  title?: string
  content?: string
  tag?: string
  visible: string[]
  user?: { id: string }
}

export default function ComposePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('id')
  const { resolvedTheme } = useTheme()

  const [me, setMe] = useState<Me | null>(null)
  const [checked, setChecked] = useState(false)
  const [title, setTitle] = useState('')
  const [tag, setTag] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [sharedUsers, setSharedUsers] = useState<string[]>([])
  const [users, setUsers] = useState<{ username: string; name: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
    ])
      .then(([meData, usersData]) => {
        if (!meData?.id) {
          router.replace('/login')
          return
        }
        setMe(meData)
        setUsers(Array.isArray(usersData) ? usersData : [])
        if (editId) {
          return fetch(`/api/blogs/${editId}`)
            .then((r) => r.json())
            .then((blog: BlogData) => {
              if (!blog?.id) {
                toast.error('寻不见这一页编年史')
                router.replace('/blog')
                return
              }
              if (blog.user?.id !== meData.id) {
                toast.error('这不是你的卷帙')
                router.replace(`/blog/${editId}`)
                return
              }
              setTitle(blog.title || '')
              setTag(blog.tag || '')
              setContent(blog.content || '')
              const vis = blog.visible || []
              setIsPublic(vis.includes('public'))
              setSharedUsers(vis.filter((v) => v !== 'public' && v !== 'private'))
            })
        }
      })
      .catch(() => toast.error('与月境的连结中断'))
      .finally(() => setChecked(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId])

  const visible = isPublic ? ['public'] : sharedUsers.length ? sharedUsers : ['private']

  const save = async () => {
    if (!title.trim()) {
      toast.error('篇章需要名字')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(editId ? `/api/blogs/${editId}` : '/api/blogs', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content, tag: tag.trim(), visible }),
      })
      if (!res.ok) throw new Error()
      const blog = await res.json()
      toast.success(editId ? '编年史已重铸' : '新的篇章已封存进月境')
      router.push(`/blog/${blog.id}`)
      router.refresh()
    } catch {
      toast.error('封存失败，请再试')
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!editId) return
    setSaving(true)
    try {
      const res = await fetch(`/api/blogs/${editId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('这一页已归于星尘')
      router.push('/blog')
      router.refresh()
    } catch {
      toast.error('删除失败')
    } finally {
      setSaving(false)
    }
  }

  const upload = async (file: File) => {
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/images', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok || !data.imageUrl) throw new Error(data.error)
      setContent((c) => `${c}\n\n![](${data.imageUrl})\n\n`)
      toast.success('影像已镶嵌进篇章')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '影像上传失败')
    } finally {
      setUploading(false)
    }
  }

  if (!checked) {
    return (
      <div className="flex justify-center py-24 text-muted-foreground">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1 text-xs transition-colors ${
      active
        ? 'border-gold/60 bg-accent text-gold'
        : 'border-glass-border text-muted-foreground hover:text-foreground'
    }`

  return (
    <main className="mx-auto max-w-3xl px-6 pb-10">
      <div className="pb-8 pt-4 text-center">
        <div className="flex items-center justify-center gap-3 text-xs tracking-[0.5em] text-gold">
          <span className="moon-eyebrow-line" />
          {editId ? '重铸篇章' : '落笔新篇'}
          <span className="moon-eyebrow-line-right" />
        </div>
        <h1 className="mt-4 font-heading text-2xl tracking-[0.3em]">
          {editId ? '重 铸' : '执 笔'}
        </h1>
      </div>

      <div className="moon-glass moon-hairline rounded-2xl p-6 sm:p-8">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="篇章之名……"
          className="h-auto rounded-none border-0 border-b border-glass-border bg-transparent px-0 pb-3 font-heading text-2xl tracking-wide focus-visible:ring-0 focus-visible:border-gold/60"
        />

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Input
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="标签（如：笔记 / 技术 / 随想）"
            className="h-8 w-56 rounded-full border-glass-border bg-transparent text-xs"
          />
          <span className="mx-1 h-4 w-px bg-border" />
          <button onClick={() => setIsPublic((v) => !v)} className={chip(isPublic)}>
            公开于月境
          </button>
          {!isPublic && (
            <>
              {users
                .filter((u) => u.username !== me?.username)
                .map((u) => {
                  const on = sharedUsers.includes(u.name)
                  return (
                    <button
                      key={u.username}
                      onClick={() =>
                        setSharedUsers((list) =>
                          on ? list.filter((n) => n !== u.name) : [...list, u.name],
                        )
                      }
                      className={chip(on)}
                    >
                      {u.name}
                    </button>
                  )
                })}
              {sharedUsers.length === 0 && (
                <span className="text-xs text-muted-foreground">私密 —— 只有你能看见</span>
              )}
            </>
          )}
        </div>

        <div className="mt-5 overflow-hidden rounded-xl border border-glass-border" data-color-mode={resolvedTheme ?? 'dark'}>
          <MDEditor
            value={content}
            onChange={(v) => setContent(v || '')}
            height={520}
            preview="edit"
            style={{ background: 'transparent' }}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) upload(f)
              e.target.value = ''
            }}
          />
          <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-2 rounded-xl">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            镶嵌影像
          </Button>
          <span className="text-xs text-muted-foreground">Markdown · 数学公式 · 代码高亮 皆可入卷</span>
          <div className="ml-auto flex items-center gap-3">
            {editId && (
              <Button
                variant="outline"
                onClick={remove}
                disabled={saving}
                className="gap-2 rounded-xl text-destructive"
              >
                <Trash2 size={14} />
                归于星尘
              </Button>
            )}
            <Button onClick={save} disabled={saving || !title.trim()} className="gap-2 rounded-xl">
              <Save size={14} />
              {saving ? '封存中……' : editId ? '重铸此篇' : '封存篇章'}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
