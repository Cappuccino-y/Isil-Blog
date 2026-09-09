export default function BlogLoading() {
  return (
    <>
      {/* 英雄区骨架 */}
      <section className="relative -mt-20 flex h-[46vh] min-h-80 flex-col items-center justify-end overflow-hidden pb-14">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(4,8,18,0.35)] via-transparent to-background" />
        <div className="relative z-10 flex flex-col items-center gap-4 px-6">
          <div className="h-3 w-40 animate-pulse rounded-full bg-white/15" />
          <div className="h-9 w-56 animate-pulse rounded-xl bg-white/15" />
          <div className="h-3 w-64 animate-pulse rounded-full bg-white/10" />
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 pb-10">
        {/* 搜索与筛选骨架 */}
        <div className="flex flex-col items-center gap-5 pb-10 pt-10">
          <div className="moon-glass h-9 w-full max-w-md animate-pulse rounded-full" />
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['最新', '最多星光', '作者', '标签'].map((w, i) => (
              <div
                key={w}
                className="h-7 animate-pulse rounded-full border border-glass-border bg-muted/60"
                style={{ width: `${64 + i * 14}px` }}
              />
            ))}
          </div>
        </div>

        {/* 卡片网格骨架 */}
        <div className="grid w-full gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="moon-glass moon-hairline flex h-52 flex-col rounded-2xl p-6"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="mt-5 h-5 w-3/4 animate-pulse rounded-md bg-muted" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
              </div>
              <div className="mt-auto flex items-center gap-4 pt-4">
                <div className="h-3 w-10 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-10 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
