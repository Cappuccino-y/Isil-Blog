'use client'

import { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface Star {
  x: number
  y: number
  r: number
  base: number
  phase: number
  speed: number
  gold: boolean
}

interface Shooter {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
}

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let shooters: Shooter[] = []
    let raf = 0
    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const seed = () => {
      const count = Math.floor((w * h) / 9000)
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.1,
        base: 0.25 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
        gold: Math.random() < 0.08,
      }))
    }

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    const draw = (t: number) => {
      const dark = resolvedTheme !== 'light'
      ctx.clearRect(0, 0, w, h)
      const dim = dark ? 1 : 0.28
      for (const s of stars) {
        const tw = reduced ? 1 : 0.55 + 0.45 * Math.sin(s.phase + (t / 1000) * s.speed)
        const a = s.base * tw * dim
        if (a < 0.02) continue
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = s.gold
          ? `rgba(201, 168, 106, ${a})`
          : `rgba(205, 216, 238, ${a})`
        ctx.fill()
        if (s.r > 1.2 && dark) {
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r * 3.2, 0, Math.PI * 2)
          ctx.fillStyle = s.gold
            ? `rgba(201, 168, 106, ${a * 0.12})`
            : `rgba(159, 180, 216, ${a * 0.1})`
          ctx.fill()
        }
      }

      if (!reduced) {
        if (shooters.length < 2 && Math.random() < 0.004) {
          const fromLeft = Math.random() < 0.5
          shooters.push({
            x: fromLeft ? -40 : w + 40,
            y: Math.random() * h * 0.4,
            vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 4),
            vy: 1.6 + Math.random() * 1.4,
            life: 0,
            maxLife: 90 + Math.random() * 40,
          })
        }
        shooters = shooters.filter((sh) => sh.life < sh.maxLife)
        for (const sh of shooters) {
          sh.x += sh.vx
          sh.y += sh.vy
          sh.life++
          const fade = 1 - sh.life / sh.maxLife
          const grad = ctx.createLinearGradient(
            sh.x,
            sh.y,
            sh.x - sh.vx * 14,
            sh.y - sh.vy * 14,
          )
          grad.addColorStop(0, `rgba(232, 237, 247, ${0.85 * fade})`)
          grad.addColorStop(1, 'rgba(232, 237, 247, 0)')
          ctx.strokeStyle = grad
          ctx.lineWidth = 1.4
          ctx.beginPath()
          ctx.moveTo(sh.x, sh.y)
          ctx.lineTo(sh.x - sh.vx * 14, sh.y - sh.vy * 14)
          ctx.stroke()
        }
      }
    }

    const loop = (t: number) => {
      draw(t)
      raf = requestAnimationFrame(loop)
    }

    resize()
    window.addEventListener('resize', resize)
    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [resolvedTheme])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
