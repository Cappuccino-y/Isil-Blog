import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="relative -mt-20 flex min-h-[92vh] items-center justify-center overflow-hidden px-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/art/mordor.jpg')" }}
      />
      <div className="absolute inset-0 bg-[rgba(2,7,6,0.45)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />

      <div className="relative z-10 text-center">
        <div className="flex items-center justify-center gap-3 text-xs tracking-[0.5em] text-gold">
          <span className="moon-eyebrow-line" />
          LOST IN THE WILDERNESS
          <span className="moon-eyebrow-line-right" />
        </div>
        <h1 className="moon-title-glow mt-6 font-heading text-5xl tracking-[0.3em] text-[#f4f6fa]">
          迷 途
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-loose text-[#c9d4ea]">
          你已步入星图之外的荒原 ——
          远处的高塔上燃烧着索伦之眼，
          而远征队的篝火在山下为你留了一席。
        </p>
        <Link
          href="/"
          className="mt-9 inline-flex items-center gap-2 rounded-full border border-gold/50 px-7 py-2.5 text-sm text-gold transition-all hover:bg-gold/10 hover:shadow-[0_0_30px_var(--glow)]"
        >
          <ArrowLeft size={14} />
          回到远征队
        </Link>
      </div>
    </main>
  )
}
