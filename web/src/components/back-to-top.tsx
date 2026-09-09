'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="回到顶部"
      className={`moon-glass fixed bottom-24 right-7 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold transition-all duration-300 hover:shadow-[0_0_24px_var(--glow)] ${
        show ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      } max-md:right-3.5`}
    >
      <ArrowUp size={17} />
    </button>
  )
}
