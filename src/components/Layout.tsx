import { useState, type ReactNode } from 'react'
import { BRAND, NAV } from '../site'

function Wordmark({ small = false }: { small?: boolean }) {
  return (
    <a href="/" className="group flex items-center gap-2.5">
      <span className="grid h-[30px] w-[30px] place-items-center rounded-[6px] bg-fg font-mono text-[0.8rem] font-bold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.18),0_1px_2px_rgba(23,22,15,.2)] transition group-hover:bg-accent">
        板
      </span>
      <b className={`whitespace-nowrap font-bold tracking-[0.02em] text-fg ${small ? 'text-[1rem]' : 'text-[1.08rem]'}`}>
        {BRAND.name}
      </b>
      {!small && (
        <span className="ml-0.5 hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-faint md:inline">
          {BRAND.domain}
        </span>
      )}
    </a>
  )
}

function Nav({ current }: { current: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-content items-center justify-between px-[calc(clamp(1.25rem,4vw,3.5rem)+clamp(1rem,2.5vw,2.5rem))]">
        <Wordmark />

        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => {
            const active = item.href === current
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`relative whitespace-nowrap rounded-[6px] px-3.5 py-2 text-label transition ${
                  active
                    ? 'font-semibold text-fg after:absolute after:inset-x-3.5 after:-bottom-px after:h-[2px] after:bg-accent'
                    : 'font-medium text-muted hover:bg-subtle hover:text-fg'
                }`}
              >
                {item.label}
              </a>
            )
          })}
          <a
            href="/join.html"
            className="ml-3 whitespace-nowrap rounded-[8px] bg-fg px-5 py-2.5 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_2px_rgba(23,22,15,.25)] transition hover:bg-accent hover:text-white active:translate-y-[1px]"
          >
            加入社区
          </a>
        </nav>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
          className="grid h-9 w-9 place-items-center rounded-[6px] text-muted transition hover:bg-subtle md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="animate-fade-in border-t border-line bg-surface px-6 py-2 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block border-b border-line/60 py-3 text-label last:border-0 ${
                item.href === current ? 'font-semibold text-accent-hi' : 'text-muted'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-surface">
      <div className="mx-auto max-w-content px-[calc(clamp(1.25rem,4vw,3.5rem)+clamp(1rem,2.5vw,2.5rem))]">
        <div className="flex flex-col gap-10 py-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Wordmark small />
            <p className="mt-4 text-[0.84rem] leading-relaxed text-muted">{BRAND.subtitle}</p>
          </div>

          <nav className="grid gap-2.5" aria-label="页脚导航">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-label text-fg-soft transition hover:text-accent">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div
          aria-hidden
          className="select-none whitespace-nowrap text-center font-sans text-[clamp(4rem,12vw,9rem)] font-extrabold leading-none tracking-[0.02em] text-transparent [-webkit-text-stroke:1px_rgb(var(--line-strong))] [transform:translateY(0.18em)]"
        >
          {BRAND.name}
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-5 pb-8 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {BRAND.name}</span>
          {BRAND.icp && (
            <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer noopener" className="transition hover:text-muted">
              {BRAND.icp}
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}

export function Layout({ current, children }: { current: string; children: ReactNode }) {
  return (
    <div className="rails flex min-h-full flex-col">
      <Nav current={current} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
