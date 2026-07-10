import type { CSSProperties, ReactNode } from 'react'
import { WECHAT } from '../site'

export function Section({
  children,
  className = '',
  id,
}: {
  children: ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`mx-auto max-w-content px-5 sm:px-8 ${className}`}>
      {children}
    </section>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-eyebrow font-semibold uppercase text-accent">{children}</p>
}

export function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow?: string
  title: string
  desc?: string
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-balance text-headline font-semibold text-fg">{title}</h2>
      {desc && <p className="mt-4 text-pretty text-body text-muted">{desc}</p>}
    </div>
  )
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  return (
    <div style={style} className={`rounded-2xl2 border border-line bg-surface p-6 shadow-card ${className}`}>
      {children}
    </div>
  )
}

/** 首屏与各页底部共用的转化区：二维码 + 引导语 */
export function WeChatCTA({
  title = '先聊十分钟，再决定要不要一起做',
  compact = false,
}: {
  title?: string
  compact?: boolean
}) {
  return (
    <div
      className={`rounded-2xl2 border border-line bg-surface shadow-pop ${
        compact ? 'p-6' : 'p-7 sm:p-10'
      }`}
    >
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-10">
        <div className="shrink-0 rounded-xl2 border border-line bg-white p-3">
          <img
            src={WECHAT.qr}
            alt="微信二维码"
            width={168}
            height={168}
            className="h-[168px] w-[168px] rounded-lg2 object-contain"
          />
        </div>

        <div className="text-center sm:text-left">
          <h3 className="text-title font-semibold text-fg">{title}</h3>
          <p className="mt-3 text-body text-muted">{WECHAT.guide}</p>
          <p className="mt-2 text-label text-faint">{WECHAT.note}</p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-subtle px-3.5 py-1.5 text-[13px] text-fg-soft">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-success" fill="currentColor" aria-hidden>
              <path d="M9 3C4.9 3 1.6 5.8 1.6 9.2c0 1.9 1.1 3.6 2.8 4.8l-.7 2.2 2.5-1.3c.8.2 1.6.3 2.4.3h.6a5.6 5.6 0 0 1-.2-1.5c0-3.2 3-5.8 6.8-5.8h.6C15.9 5 12.8 3 9 3Zm-2.6 3a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm5.2 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
              <path d="M22.4 13.6c0-2.8-2.7-5-6-5s-6 2.2-6 5 2.7 5 6 5c.7 0 1.4-.1 2-.3l2.1 1.1-.6-1.8c1.5-.9 2.5-2.4 2.5-4Zm-8-1.6a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Zm4 0a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6Z" />
            </svg>
            {WECHAT.name}
          </p>
        </div>
      </div>
    </div>
  )
}
