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
    <section id={id} className={`relative mx-auto max-w-content px-[calc(clamp(1.25rem,4vw,3.5rem)+clamp(1rem,2.5vw,2.5rem))] ${className}`}>
      {children}
    </section>
  )
}

/** 章节标尺行:编号 + 名称 + 右侧刻度 */
export function Ruler({ idx, name, tick }: { idx: string; name: string; tick?: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-line py-4">
      <span className="font-mono text-[0.7rem] tracking-[0.14em] text-accent">{idx}</span>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">{name}</span>
      <span className="flex-1" />
      {tick && <span className="font-mono text-[0.7rem] tracking-[0.1em] text-faint">{tick}</span>}
    </div>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

/** 状态 chip:圆角胶囊 + 可选脉冲点 */
export function Chip({ children, pulse = false, className = '' }: { children: ReactNode; pulse?: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-[0.5em] rounded-full border border-line-strong bg-surface px-[0.9em] py-[0.3em] font-mono text-[0.66rem] uppercase tracking-[0.12em] text-fg-soft ${className}`}
    >
      {pulse && (
        <span className="relative inline-block h-[6px] w-[6px] rounded-full bg-success">
          <span className="absolute -inset-[3px] rounded-full border border-success opacity-50 motion-safe:animate-ping2" />
        </span>
      )}
      {children}
    </span>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return <span className="kbd">{children}</span>
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
      <h2 className={`text-balance font-display text-headline text-fg ${eyebrow ? 'mt-4' : ''}`}>{title}</h2>
      {desc && <p className="mt-5 text-pretty text-body text-muted">{desc}</p>}
    </div>
  )
}

/** 双层发丝线卡面 */
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
    <div
      style={style}
      className={`rounded-xl2 border border-line-strong bg-surface p-7 shadow-card ring-1 ring-inset ring-white/70 transition duration-300 ease-spring hover:-translate-y-[2px] hover:shadow-pop ${className}`}
    >
      {children}
    </div>
  )
}

export function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center justify-center gap-3 rounded-[10px] bg-fg px-8 py-4 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px]"
    >
      {children}
      <span className="font-mono text-[0.85em] transition-transform duration-300 ease-spring group-hover:translate-x-[3px]">→</span>
    </a>
  )
}

export function GhostLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-[10px] border border-line-strong bg-surface px-8 py-4 text-label font-semibold text-fg shadow-card transition hover:border-fg active:translate-y-[1px]"
    >
      {children}
    </a>
  )
}

/** 红色箭头链接 */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="group inline-flex items-center gap-2 text-label font-bold text-accent-hi no-underline">
      {children}
      <span className="font-mono transition-transform duration-300 ease-spring group-hover:translate-x-[3px]">→</span>
    </a>
  )
}

/** 转化区:诊断单(三个问题的待填表单 + 二维码) */
export function WeChatCTA({ title = '先聊十分钟，再决定要不要一起做' }: { title?: string }) {
  return (
    <div className="grid overflow-hidden rounded-2xl2 border border-line-strong bg-surface shadow-pop ring-1 ring-inset ring-white/70 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="p-8 sm:p-11">
        <h3 className="font-display text-[clamp(1.4rem,2.5vw,1.9rem)] leading-snug text-fg">{title}</h3>
        <p className="mt-3.5 text-label text-fg-soft">
          微信扫码添加，备注<span className="kbd mx-1">老板有AI</span>。我会先问你三个问题：
        </p>
        <div className="mt-7 grid max-w-md gap-4" aria-hidden>
          {['问题 01 / 生意', '问题 02 / 卡点', '问题 03 / 本月目标'].map((label) => (
            <div key={label} className="grid grid-cols-[9.5em_1fr] items-baseline gap-4">
              <span className="font-mono text-[0.66rem] tracking-[0.13em] text-muted">{label}</span>
              <span className="relative h-[1.5em] border-b border-line-strong after:absolute after:-bottom-px after:left-0 after:h-[2px] after:w-9 after:bg-accent" />
            </div>
          ))}
        </div>
        <p className="mt-6 text-[0.82rem] text-muted">{WECHAT.note}</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-3.5 border-t border-dashed border-line-strong bg-canvas p-8 sm:border-l sm:border-t-0 sm:p-10">
        <div className="rounded-xl2 border border-line bg-white p-2.5 shadow-card">
          <img src={WECHAT.qr} alt="微信二维码" width={158} height={158} className="h-[158px] w-[158px] object-contain" />
        </div>
        <span className="inline-flex items-center gap-2 text-[0.78rem] font-semibold text-fg-soft">
          <i className="h-[7px] w-[7px] rounded-full bg-success" />
          {WECHAT.name}
        </span>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">扫码 · 备注「老板有AI」</span>
      </div>
    </div>
  )
}
