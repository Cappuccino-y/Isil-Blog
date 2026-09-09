'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password || loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })
      if (!res.ok) {
        toast.error('星门未曾开启 —— 名讳或密语有误')
        return
      }
      toast.success('登录成功 · 明月迎你归')
      router.push('/blog')
      router.refresh()
    } catch {
      toast.error('与月境的连结暂时中断，请稍后再试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="moon-glass moon-hairline mt-6 space-y-4 rounded-2xl p-7">
      <div>
        <label
          htmlFor="login-username"
          className="mb-1.5 block text-xs tracking-[0.2em] text-muted-foreground"
        >
          名讳
        </label>
        <div className="relative">
          <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="名讳"
            autoComplete="username"
            className="rounded-xl border-glass-border bg-transparent pl-10"
          />
        </div>
      </div>
      <div>
        <label
          htmlFor="login-password"
          className="mb-1.5 block text-xs tracking-[0.2em] text-muted-foreground"
        >
          密语
        </label>
        <div className="relative">
          <KeyRound size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密语"
            autoComplete="current-password"
            className="rounded-xl border-glass-border bg-transparent pl-10"
          />
        </div>
      </div>
      <Button type="submit" disabled={loading} className="w-full rounded-xl tracking-[0.3em]">
        {loading ? '星门开启中……' : '推 门 而 入'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        尚未拥有名讳？留言给守月人，他会为你缀一颗星。
      </p>
    </form>
  )
}
