import { MoonPhases } from '@/components/moon-phases'
import { LoginForm } from '@/components/login-form'

export const metadata = { title: '归乡' }

export default function LoginPage() {
  return (
    <main className="relative -mt-20 flex min-h-[92vh] items-center justify-center overflow-hidden px-6 py-16">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/art/shire.jpg')" }}
      />
      <div className="absolute inset-0 bg-[rgba(8,12,24,0.42)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 text-xs tracking-[0.5em] text-gold">
            <span className="moon-eyebrow-line" />
            HOMEWARD
            <span className="moon-eyebrow-line-right" />
          </div>
          <h1 className="mt-4 font-heading text-2xl tracking-[0.3em] text-[#f4f6fa] drop-shadow">
            归 乡
          </h1>
          <p className="mt-2 text-sm italic text-[#dde6f5] drop-shadow">
            穿过星野，明月迎你归夏尔
          </p>
        </div>

        <div className="mt-8 flex justify-center">
          <MoonPhases glass height={15} />
        </div>

        <LoginForm />
      </div>
    </main>
  )
}
