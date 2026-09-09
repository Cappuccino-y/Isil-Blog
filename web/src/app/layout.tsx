import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Starfield } from '@/components/starfield'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Tilion } from '@/components/tilion'
import { BackToTop } from '@/components/back-to-top'
import { PageTransition } from '@/components/page-transition'
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

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var dark=t==='dark'||((t===null||t==='system')&&m);var c=document.documentElement.classList;if(dark){c.add('dark')}else{c.add('light')}document.documentElement.style.colorScheme=dark?'dark':'light'}catch(e){}})()`

export const metadata: Metadata = {
  metadataBase: new URL('https://www.mistysakura.top'),
  title: {
    default: 'Isil · 月境编年史',
    template: '%s · Isil 月境编年史',
  },
  description:
    'LYY 的月境编年史 —— 一座安放知识与思绪的中土小站。由月之迈雅 Tilion 守望。',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: 'Isil · 月境编年史',
    title: 'Isil · 月境编年史',
    description:
      '维拉时代，迈雅 Tilion 驾着银船巡行天穹；如今他停驻于此，守望一座安放知识与思绪的月境。',
    images: [{ url: '/art/og.jpg', width: 1200, height: 630, alt: 'Isil · 月境编年史' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Isil · 月境编年史',
    description:
      '维拉时代，迈雅 Tilion 驾着银船巡行天穹；如今他停驻于此，守望一座安放知识与思绪的月境。',
    images: ['/art/og.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#070b16' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fa' },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className={`${cinzel.variable} ${garamond.variable} font-sans min-h-dvh flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Starfield />
          <SiteNav />
          <div className="relative z-10 flex flex-1 flex-col pt-20">
            <PageTransition>{children}</PageTransition>
          </div>
          <SiteFooter />
          <BackToTop />
          <Tilion />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  )
}
