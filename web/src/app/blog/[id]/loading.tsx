export default function BlogDetailLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 pb-10">
      <div className="grid gap-10 lg:grid-cols-[1fr_250px]">
        <article className="mx-auto w-full min-w-0 max-w-3xl">
          <div className="pt-2">
            <div className="h-4 w-24 animate-pulse rounded-full bg-muted" />
          </div>
          <header className="pb-8 pt-6 text-center">
            <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-muted" />
            <div className="mx-auto mt-5 h-8 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
              <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-24 animate-pulse rounded-full bg-muted" />
            </div>
          </header>

          {/* Tilion 撮萃骨架 */}
          <div className="moon-glass moon-hairline rounded-2xl border-gold/25 p-5">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-20 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-11/12 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
            </div>
          </div>

          {/* 正文骨架 */}
          <div className="mt-10 space-y-4">
            <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
            <div className="space-y-2.5">
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-10/12 animate-pulse rounded-full bg-muted" />
            </div>
            <div className="h-32 w-full animate-pulse rounded-2xl bg-muted" />
            <div className="h-5 w-1/4 animate-pulse rounded-md bg-muted" />
            <div className="space-y-2.5">
              <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-9/12 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="moon-glass moon-hairline rounded-2xl p-5">
              <div className="h-3 w-14 animate-pulse rounded-full bg-muted" />
              <div className="mt-4 space-y-3">
                <div className="h-3 w-4/5 animate-pulse rounded-full bg-muted" />
                <div className="ml-4 h-3 w-3/5 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
                <div className="ml-4 h-3 w-2/3 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
