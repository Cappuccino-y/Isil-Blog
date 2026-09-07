import Link from 'next/link'
import { Crescent } from '@/components/moon-phases'

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-24 pb-10">
      <div className="mx-auto max-w-4xl px-6">
        <div className="moon-divider text-xs">✦</div>
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="font-body text-sm italic text-muted-foreground">
            Not all those who wander are lost —— 并非所有彷徨者皆已迷失
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/blog" className="transition-colors hover:text-gold">
              编年史
            </Link>
            <span className="text-border">·</span>
            <Link href="/login" className="transition-colors hover:text-gold">
              归乡
            </Link>
            <span className="text-border">·</span>
            <a
              href="https://www.mistysakura.top"
              className="transition-colors hover:text-gold"
            >
              mistysakura.top
            </a>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Crescent size={12} className="text-gold/70" />
            <span>© {new Date().getFullYear()} LYY · 由 Tilion 守望的月境</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
