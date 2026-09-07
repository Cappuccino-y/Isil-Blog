import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Starfield } from '@/components/starfield'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Tilion } from '@/components/tilion'
import { Toaster } from '@/components/ui/sonner'

const cinzel = localFont({
  src: '../../public/fonts/cinzel-latin-600.woff2',
  weight: '600',
  variable: '--font-cinzel',
  display: 'swap',
})

const garamond = localFont({
  src: [
    { path: '../../public/fonts/eb-garamond-latin-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/eb-garamond-latin-400italic.woff2', weight: '400', style: 'italic' },
    { path: '../../public/fonts/eb-garamond-latin-600.woff2', weight: '600', style: 'normal' },
  ],
  variable: '--font-garamond',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Isil · 月境编年史',
    template: '%s · Isil 月境编年史',
  },
  description:
    'LYY 的月境编年史 —— 一座安放知识与思绪的中土小站。由月之迈雅 Tilion 守望。',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${cinzel.variable} ${garamond.variable} font-sans min-h-dvh flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <Starfield />
          <SiteNav />
          <div className="relative z-10 flex flex-1 flex-col pt-20">{children}</div>
          <SiteFooter />
          <Tilion />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
