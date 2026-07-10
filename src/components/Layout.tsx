import { useState, useSyncExternalStore, type ReactNode } from 'react'
import { BRAND, NAV } from '../site'

/**
 * 主题是外部共享状态：真实来源是 <html> 上的 .dark。
 * 首帧前由 index.html 的内联脚本按 localStorage / 系统偏好设好，
 * 这里只订阅，不在 mount 时回写——否则多个 ThemeToggle 实例
 * 会互相覆盖对方刚写入的值。
 */
const listeners = new Set<() => void>()

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function getSnapshot() {
  return document.documentElement.classList.contains('dark')
}

function setTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  try {
    localStorage.setItem('lby-theme', dark ? 'dark' : 'light')
  } catch {
    // 隐私模式下 localStorage 可能抛错，主题仍然切换，只是不持久化
  }
  listeners.forEach((fn) => fn())
}

function useTheme() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, () => false)
  return { dark, toggle: () => setTheme(!dark) }
}

function ThemeToggle() {
  const { dark, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={dark ? '切换到浅色模式' : '切换到深色模式'}
      className="grid h-9 w-9 place-items-center rounded-lg2 border border-line text-muted transition hover:bg-subtle hover:text-fg"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  )
}

function Nav({ current }: { current: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-content items-center justify-between px-5 sm:px-8">
        <a href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-fg">
          <span className="grid h-8 w-8 place-items-center rounded-lg2 bg-accent text-[13px] font-bold text-accent-fg shadow-glow">
            AI
          </span>
          <span className="text-[17px]">{BRAND.name}</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = item.href === current
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg2 px-3.5 py-2 text-label transition ${
                  active ? 'bg-subtle font-medium text-fg' : 'text-muted hover:bg-subtle hover:text-fg'
                }`}
              >
                {item.label}
              </a>
            )
          })}
          <span className="mx-2 h-5 w-px bg-line" />
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="打开菜单"
            aria-expanded={open}
            className="grid h-9 w-9 place-items-center rounded-lg2 border border-line text-muted"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="animate-fade-in border-t border-line bg-surface px-5 pb-4 pt-2 md:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`block rounded-lg2 px-3 py-2.5 text-label ${
                item.href === current ? 'bg-subtle font-medium text-fg' : 'text-muted'
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
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-content px-5 py-12 sm:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-semibold text-fg">
              <span className="grid h-7 w-7 place-items-center rounded-lg2 bg-accent text-[11px] font-bold text-accent-fg">
                AI
              </span>
              {BRAND.name}
            </div>
            <p className="mt-3 text-label text-muted">{BRAND.subtitle}</p>
          </div>

          <nav className="flex flex-col gap-2.5">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className="text-label text-muted transition hover:text-fg">
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-6 text-[13px] text-faint sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} {BRAND.name} · {BRAND.domain}
          </span>
          {BRAND.icp && (
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-muted"
            >
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
    <div className="flex min-h-full flex-col">
      <Nav current={current} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
