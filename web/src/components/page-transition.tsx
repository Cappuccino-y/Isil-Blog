'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

/**
 * 路由切换时的轻量页面过渡：以 pathname 为 key 强制重挂载，
 * 重放入场淡入动画。仅动 opacity（不动 transform），
 * 避免产生 containing block 影响 fixed 定位的导航/进度条/Tilion。
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  return (
    <div key={pathname} className="moon-page-enter flex flex-1 flex-col">
      {children}
    </div>
  )
}
