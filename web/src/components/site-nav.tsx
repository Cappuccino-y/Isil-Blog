'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, PenLine, LogOut } from 'lucide-react'
import { Crescent } from '@/components/moon-phases'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Me {
  username: string
  name: string
}

export function SiteNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    setMounted(true)
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setMe(data))
      .catch(() => {})
  }, [pathname])

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setMe(null)
    router.push('/')
    router.refresh()
  }

  const links = [
    { href: '/', label: '月境' },
    { href: '/blog', label: '编年史' },
  ]

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3">
      <nav className="moon-glass moon-hairline mx-auto flex h-12 max-w-4xl items-center justify-between rounded-full px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
          <Crescent size={19} className="text-gold" />
          <span className="font-heading text-base tracking-[0.28em]">ISIL</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">月境编年史</span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                pathname === l.href
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {mounted && (
            <button
              onClick={toggleTheme}
              aria-label="切换昼夜"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:text-gold"
            >
              {resolvedTheme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
          {mounted &&
            (me ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label="用户菜单"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-gold/40 bg-accent font-heading text-xs text-gold transition-shadow hover:shadow-[0_0_14px_var(--glow)]"
                >
                  {me.name.slice(0, 1)}
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="moon-glass border-glass-border">
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    {me.name === me.username ? me.name : `${me.name} · ${me.username}`}
                  </div>
                  <DropdownMenuItem onClick={() => router.push('/compose')}>
                    <PenLine size={14} className="mr-2" /> 撰写新篇
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut size={14} className="mr-2" /> 归于尘世
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="rounded-full border border-gold/40 px-3.5 py-1 text-sm text-gold transition-shadow hover:shadow-[0_0_14px_var(--glow)]"
              >
                归乡
              </Link>
            ))}
        </div>
      </nav>
    </header>
  )
}
