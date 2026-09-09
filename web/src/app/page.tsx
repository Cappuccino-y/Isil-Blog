import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Feather, Sparkles, Eye, Compass } from 'lucide-react'
import { listVisibleBlogs, excerpt, type BlogJSON } from '@/lib/blogs'
import { getSessionUser } from '@/lib/auth'
import { MoonPhases, Crescent } from '@/components/moon-phases'
import { BlogCard } from '@/components/blog-card'
import { Reveal } from '@/components/reveal'
import { OrnamentDivider } from '@/components/ornament-divider'

export const dynamic = 'force-dynamic'

const CHIPS = ['知识', '技术', '手记', '长夜灯下']

export default async function HomePage() {
  const session = await getSessionUser()
  let blogs: BlogJSON[] = []
  try {
    blogs = await listVisibleBlogs(session)
  } catch {}

  const featured = blogs.slice(0, 3)
  const totalLikes = blogs.reduce((s, b) => s + (b.likes || 0), 0)
  const totalViews = blogs.reduce((s, b) => s + (b.views || 0), 0)

  return (
    <main>
      <section className="relative -mt-20 flex min-h-[92vh] items-center justify-center overflow-hidden">
        <Image
          src="/art/rivendell.jpg"
          alt="Rivendell · 幽谷中的精灵居所"
          fill
          priority
          quality={82}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(4,8,18,0.72)] via-[rgba(4,8,18,0.45)] to-background" />
        <div className="relative z-10 flex flex-col items-center px-6 pt-10 text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3 text-xs tracking-[0.5em] text-gold">
              <span className="moon-eyebrow-line" />
              EÄ · 中土月境
              <span className="moon-eyebrow-line-right" />
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="moon-title-glow mt-6 font-heading text-6xl tracking-[0.18em] sm:text-7xl">
              <span className="moon-gold-text">ISIL</span>
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mt-3 font-heading text-xl tracking-[0.6em] text-[#eef2fb] sm:text-2xl">
              月境编年史
            </p>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-6 max-w-xl text-balance text-sm leading-loose text-[#c9d4ea] drop-shadow sm:text-base">
              维拉时代，迈雅 Tilion 驾着银船巡行天穹；
              如今他停驻于此，守望一座安放知识与思绪的月境。
            </p>
          </Reveal>
          <Reveal delay={420}>
            <div className="mt-8">
              <MoonPhases glass height={16} />
            </div>
          </Reveal>
          <Reveal delay={520}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-2.5 text-sm text-primary-foreground shadow-[0_0_28px_rgba(0,0,0,0.5)] transition-all hover:shadow-[0_0_44px_var(--glow)]"
              >
                开启编年史
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#keeper"
                className="rounded-full border border-white/35 px-7 py-2.5 text-sm text-[#eef2fb] backdrop-blur-sm transition-colors hover:border-gold/70 hover:text-gold"
              >
                拜会执笔者
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {featured.length > 0 && (
          <section className="mt-4">
            <Reveal>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs tracking-[0.4em] text-gold">
                    <span className="moon-eyebrow-line" />
                    珍卷
                  </div>
                  <h2 className="mt-3 font-heading text-2xl tracking-wider">月光浸润的篇章</h2>
                </div>
                <Link
                  href="/blog"
                  className="text-sm text-muted-foreground transition-colors hover:text-gold"
                >
                  全部篇章 →
                </Link>
              </div>
            </Reveal>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((b, i) => (
                <Reveal key={b.id} delay={i * 120} className="h-full">
                  <BlogCard
                    blog={{
                      id: b.id,
                      title: b.title,
                      excerpt: excerpt(b.content, 80),
                      tag: b.tag,
                      date: b.date,
                      likes: b.likes,
                      views: b.views,
                    }}
                    featured
                  />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>

      <OrnamentDivider
        phrase="Elen síla lúmenn' omentielvo"
        translation="一颗星辰，照耀我们相遇的时刻"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <section className="relative mt-8 flex h-72 overflow-hidden">
          <Image
            src="/art/moonhart.jpg"
            alt="Moonlit forest and stag"
            fill
            quality={70}
            sizes="(min-width: 1280px) 80rem, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[rgba(4,8,18,0.42)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_135%_at_50%_50%,rgba(4,8,18,0.9)_32%,rgba(4,8,18,0.4)_66%,transparent_100%)]" />
          <Reveal className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-6">
            <p className="text-center text-[10px] tracking-[0.6em] text-gold/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
              ✦ 编年史纪要 · IN NUMBERS ✦
            </p>
            <div className="mt-9 grid w-full grid-cols-2 gap-y-8 text-center sm:grid-cols-4 sm:divide-x sm:divide-[rgba(201,168,106,0.25)]">
              {[
                { icon: Feather, label: '篇章', value: blogs.length },
                { icon: Sparkles, label: '星光', value: totalLikes },
                { icon: Eye, label: '驻足', value: totalViews },
                { icon: Crescent, label: '守望者', value: 1 },
              ].map((s) => (
                <div key={s.label} className="px-2">
                  <div className="flex items-center justify-center gap-2 font-heading text-4xl text-gold [text-shadow:0_0_20px_rgba(0,0,0,0.9),0_0_34px_rgba(201,168,106,0.4)] sm:text-[2.6rem]">
                    <s.icon size={20} className="text-gold/80" />
                    {s.value}
                  </div>
                  <div className="mt-3 text-[11px] tracking-[0.5em] text-[#eef2fb] [text-shadow:0_1px_10px_rgba(0,0,0,0.95)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <section id="keeper" className="mt-24 scroll-mt-24">
          <Reveal>
            <div className="mb-8 flex items-center gap-3 text-xs tracking-[0.4em] text-gold">
              <span className="moon-eyebrow-line" />
              执笔者
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid items-stretch gap-8 md:grid-cols-[1fr_340px]">
              <div className="moon-glass moon-hairline flex flex-col justify-between rounded-2xl p-8 sm:p-10">
                <div>
                  <h3 className="font-heading text-xl tracking-wider">LYY · 白塔下的执笔者</h3>
                  <p className="mt-4 text-sm leading-loose text-muted-foreground">
                    把读过的书、写过的代码、想通的道理，一一誊进这卷编年史。
                    深信所有被认真记录的知识，都会像星光一样，在多年后的某个夜里重新亮起。
                  </p>
                </div>
                <div className="mt-6 space-y-5">
                  <p className="border-l-2 border-gold/40 pl-4 font-body text-sm italic leading-relaxed text-foreground/80 dark:text-[#cfd9ee]">
                    “All that is gold does not glitter；
                    金子未必闪光，静静写下的字句亦是。”
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CHIPS.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-glass-border px-3 py-1 text-xs text-muted-foreground"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-glass-border pt-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Compass size={13} className="text-gold/70" />
                      坐标 · 中土西境 / mistysakura.top
                    </span>
                    <a
                      href="https://www.mistysakura.top"
                      className="inline-flex items-center gap-1 text-gold-bright transition-colors hover:text-gold"
                    >
                      拜访居所 →
                    </a>
                  </div>
                </div>
              </div>
              <figure className="moon-card-hover group relative overflow-hidden rounded-2xl border border-gold/25 shadow-[0_16px_50px_rgba(4,8,18,0.45)]">
                <Image
                  src="/art/gandalf.jpg"
                  alt="You shall not pass"
                  fill
                  quality={80}
                  sizes="(min-width: 768px) 340px, 100vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-4 pt-14 text-xs italic leading-relaxed text-[#e8edf7] [text-shadow:0_1px_6px_rgba(0,0,0,0.95)]">
                  “我巴不得这事从未发生……”
                  <br />
                  “凡人皆是如此。但决定如何度过余下的时光，是我们自己的事。”
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </section>
      </div>

      <OrnamentDivider
        phrase="A Elbereth Gilthoniel"
        translation="啊，点燃星辰的埃尔贝瑞丝"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <section className="mt-8">
          <Link
            href="/blog"
            aria-label="走进中土地图 · 浏览全部篇章"
            className="group relative block h-72 overflow-hidden rounded-2xl border border-glass-border transition-all hover:border-gold/40 hover:shadow-[0_0_44px_var(--glow)]"
          >
            <Image
              src="/art/map.jpg"
              alt="Middle Earth map"
              fill
              quality={72}
              sizes="(min-width: 1280px) 80rem, 100vw"
              className="object-cover object-center transition-transform duration-[1200ms] group-hover:scale-[1.04]"
              style={{
                maskImage:
                  'radial-gradient(ellipse 72% 85% at 50% 50%, black 52%, transparent 99%)',
                WebkitMaskImage:
                  'radial-gradient(ellipse 72% 85% at 50% 50%, black 52%, transparent 99%)',
              }}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(6,10,22,0.72)] via-[rgba(6,10,22,0.2)] to-transparent pb-7 pt-20 text-center">
              <Reveal>
                <p className="font-heading text-2xl tracking-[0.2em] text-[#f4f6fa] drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
                  世界在地图上延展，知识在笔下生根
                </p>
                <p className="mt-2 text-xs tracking-[0.4em] text-[#c9d4ea] transition-colors group-hover:text-gold">
                  <span className="inline-flex items-center gap-2">
                    <Compass size={13} />
                    MIDDLE EARTH · 第三纪元 —— 走进地图
                  </span>
                </p>
              </Reveal>
            </div>
          </Link>
        </section>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <section className="mt-24 text-center">
          <Reveal>
            <p className="font-body text-lg italic text-muted-foreground">
              “启程吧 —— 去读那些被月光浸润的文字。”
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-8 py-2.5 text-sm text-gold transition-all hover:shadow-[0_0_30px_var(--glow)]"
            >
              <ArrowRight size={15} />
              走进编年史
            </Link>
          </Reveal>
        </section>
      </div>
    </main>
  )
}
