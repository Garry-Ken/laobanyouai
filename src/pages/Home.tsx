import { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { ArrowLink, Chip, GhostLink, Kbd, PrimaryLink, Ruler, Section, WeChatCTA } from '../components/ui'
import { LIBRARY, PILLARS } from '../site'

/* ============ 五类问题的线稿图标 ============ */
function PillarIcon({ k, className = 'h-[21px] w-[21px]' }: { k: string; className?: string }) {
  const paths: Record<string, ReactNodeLike> = {
    acquire: <path d="M4 4h16l-6 8v6l-4 2v-8z" />,
    sales: (
      <>
        <path d="M4 5h16v11H9l-5 4z" />
        <path d="M9 10.5l2 2 4-4" />
      </>
    ),
    manage: (
      <>
        <rect x="9" y="3" width="6" height="5" rx="1" />
        <rect x="3" y="16" width="6" height="5" rx="1" />
        <rect x="15" y="16" width="6" height="5" rx="1" />
        <path d="M12 8v4M6 16v-2h12v2" />
      </>
    ),
    cost: (
      <>
        <path d="M4 14l5-5 4 4 7-7" />
        <path d="M20 11V6h-5" />
        <path d="M4 20h16" />
      </>
    ),
    decide: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5z" />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[k]}
    </svg>
  )
}
type ReactNodeLike = React.ReactNode

/* ============ 滚动显影 ============ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv')
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ============ 原则跑马灯 ============ */
function Ticker() {
  const line =
    '第 001 期 · 招募中 ◆ 每月一场经营战役 ◆ 一个月只解决一个问题 ◆ 结果必须可核验 ◆ 没有真实结果之前，不放任何数字 ◆ 诊断免费 · 通常十分钟定位 ◆ 不教调参数 · 不做工具评测 ◆ '
  return (
    <div className="overflow-hidden border-b border-line bg-surface" aria-hidden>
      <div className="flex w-max motion-safe:animate-tick hover:[animation-play-state:paused]">
        {[0, 1].map((i) => (
          <span key={i} className="whitespace-nowrap px-4 py-2 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-muted">
            {line}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ============ 签名元素:经营诊断台 ============ */
function Console() {
  const [sel, setSel] = useState<string | null>(null)
  const touched = useRef(false)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const demo = ['acquire', 'sales', 'manage']
    const timers = demo.map((k, i) => setTimeout(() => !touched.current && setSel(k), 1500 + i * 2600))
    return () => timers.forEach(clearTimeout)
  }, [])

  const p = sel ? PILLARS.find((x) => x.key === sel) : null

  return (
    <aside
      className="overflow-hidden rounded-xl2 border border-line-strong bg-surface shadow-pop ring-1 ring-inset ring-white/70"
      aria-label="经营诊断台"
    >
      <div className="flex items-center justify-between gap-4 border-b border-line bg-canvas px-4.5 py-3 px-[1.15rem]">
        <span className="inline-flex gap-[5px]">
          <i className="h-2 w-2 rounded-full bg-accent" />
          <i className="h-2 w-2 rounded-full bg-line-strong" />
          <i className="h-2 w-2 rounded-full bg-line-strong" />
        </span>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-accent">经营诊断台</span>
        <span className="font-mono text-[0.68rem] tracking-[0.15em] text-muted">第 001 期</span>
      </div>
      <p className="px-[1.15rem] pb-1.5 pt-4 text-[1rem] font-bold tracking-[-0.01em] text-fg">你的生意，现在卡在哪一环？</p>
      <div className="grid grid-cols-3 gap-1.5 p-[1.15rem] pt-3 min-[561px]:grid-cols-5" role="group" aria-label="选择卡住的环节">
        {PILLARS.map((x) => {
          const on = sel === x.key
          return (
            <button
              key={x.key}
              type="button"
              aria-pressed={on}
              onClick={() => {
                touched.current = true
                setSel(x.key)
              }}
              className={`grid justify-items-center gap-1.5 rounded-[8px] border border-b-2 px-1 py-2.5 text-[0.85rem] font-semibold tracking-[0.03em] transition duration-150 ease-spring ${
                on
                  ? 'border-fg bg-fg text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.14)]'
                  : 'border-line-strong bg-canvas text-fg-soft hover:-translate-y-[1px] hover:border-fg'
              }`}
            >
              <PillarIcon k={x.key} className={`h-[17px] w-[17px] ${on ? '' : 'opacity-75'}`} />
              {x.title.replace('AI ', '')}
            </button>
          )
        })}
      </div>
      <div className="flex min-h-[11.6rem] flex-col border-t border-dashed border-line-strong px-[1.15rem] py-4" aria-live="polite">
        {p ? (
          <>
            <div className="flex items-center gap-3">
              <b className="text-[1.04rem] font-bold text-fg">{p.title}</b>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-accent">本月战役候选</span>
            </div>
            <p className="mt-2 text-[0.84rem] leading-[1.72] text-fg-soft">{p.desc}</p>
            <p className="mt-2 text-[0.77rem] leading-[1.68] text-muted">
              <span className="font-semibold text-accent">打法 · </span>
              {p.detail}
            </p>
            <a
              href="/join.html"
              className="group mt-auto inline-flex items-center gap-1.5 self-start pt-3.5 text-[0.84rem] font-bold text-accent-hi"
            >
              这个月就解决它
              <span className="font-mono transition-transform duration-300 ease-spring group-hover:translate-x-[3px]">→</span>
            </a>
          </>
        ) : (
          <p className="m-auto py-4 text-center text-[0.84rem] text-muted">点一个试试 —— 每一类都有已经跑通的做法。</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas px-[1.15rem] py-2.5">
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">诊断免费 · 十分钟定位</span>
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">不推销</span>
      </div>
    </aside>
  )
}

/* ============ Hero ============ */
function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-line">
      {/* 点阵图纸,径向淡出 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-75 [background-image:radial-gradient(circle,rgb(var(--line-strong))_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_90%_at_68%_10%,black_0%,transparent_62%)]"
      />
      <Section>
        <div className="relative grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.42fr)_minmax(22rem,1fr)] lg:gap-16">
          <div>
            <span className="animate-fade-up">
              <Chip pulse>面向中小企业老板 · 每月一场经营战役</Chip>
            </span>
            <h1 className="mt-7 animate-fade-up text-balance font-display text-display text-fg [animation-delay:0.1s]">
              让 AI 替你干活，
              <br />
              而不是让老板<span className="text-accent">重新学</span>一门技术。
            </h1>
            <p className="mt-8 max-w-xl animate-fade-up text-[1.02rem] text-muted [animation-delay:0.22s]">
              面向中小企业老板的 AI 经营实战社区，<b className="font-semibold text-fg-soft">每月解决一个真实经营问题</b>。
            </p>
            <div className="mt-10 flex flex-wrap gap-3 animate-fade-up [animation-delay:0.32s]">
              <PrimaryLink href="/join.html">加入社区</PrimaryLink>
              <GhostLink href="/cases.html">看看案例长什么样</GhostLink>
            </div>
          </div>
          <div className="animate-fade-up [animation-delay:0.42s]">
            <Console />
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ============ 01 五类问题 ============ */
function Pillars() {
  return (
    <Section className="pb-20 sm:pb-28">
      <Ruler idx="01" name="解决什么" tick="Problems ×5" />
      <div className="rv max-w-3xl pt-12 sm:pt-16">
        <h2 className="text-balance font-display text-headline text-fg">
          老板的问题只有五类，
          <br />
          工具每周都在变
        </h2>
        <p className="mt-5 max-w-2xl text-body text-muted">
          所以我们不追工具。把生意拆成五类固定问题，每一类都有已经跑通的做法，你只需要挑一个开始。
        </p>
      </div>

      <div className="rv mt-12 border-t-2 border-fg">
        {PILLARS.map((p, i) => (
          <div
            key={p.key}
            className="group grid items-center gap-5 rounded-sm border-b border-line px-1.5 py-6 transition hover:bg-surface hover:shadow-[inset_0_0_0_1px_rgb(var(--line))] sm:grid-cols-[3.4rem_11.5rem_1fr_2.2rem] sm:gap-8"
          >
            <span className="grid h-[3.1rem] w-[3.1rem] place-items-center rounded-lg2 border border-line-strong bg-surface text-fg-soft shadow-card transition duration-300 ease-spring group-hover:rotate-[-3deg] group-hover:scale-105 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
              <PillarIcon k={p.key} />
            </span>
            <div>
              <span className="font-mono text-[0.64rem] tracking-[0.16em] text-faint">NO.{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-0.5 text-[1.24rem] font-bold tracking-[-0.01em] text-fg">{p.title}</h3>
            </div>
            <div>
              <p className="text-[0.92rem] text-fg-soft">{p.desc}</p>
              <p className="mt-1.5 text-[0.8rem] text-muted">
                <span className="font-semibold text-accent">打法 — </span>
                {p.detail}
              </p>
            </div>
            <span className="hidden font-mono text-faint opacity-0 transition-all duration-300 ease-spring group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100 sm:block sm:-translate-x-1.5">
              →
            </span>
          </div>
        ))}
      </div>

      <div className="rv mt-10 flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
        <p className="max-w-lg text-[0.94rem] text-muted">
          不确定自己卡在哪一类？那就从经营诊断开始。加微信后我会先问你三个问题，通常十分钟就能定位。
        </p>
        <ArrowLink href="/join.html">去做一次诊断</ArrowLink>
      </div>
    </Section>
  )
}

/* ============ 02 六步闭环:电路 + 30天轴 ============ */
const LOOP_STEPS = [
  { n: '01', t: '经营诊断', d: '先看你的生意目前卡在哪一环，而不是先看有什么工具。' },
  { n: '02', t: '选择问题', d: '从五类问题里挑一个，本月只解决它。' },
  { n: '03', t: '30 天战役', d: '一个月一场，有起点、有动作清单、有截止日。' },
  { n: '04', t: '使用 AI 方案', d: '给现成的提示词、工作流和工具组合，不从零摸索。' },
  { n: '05', t: '记录结果', d: '用数字收口：省了多少小时、多了多少线索、降了多少成本。' },
  { n: '06', t: '沉淀案例', d: '跑通的路径写成行业案例，成为下一位老板的起点。' },
]

function Loop() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [lit, setLit] = useState(-1)
  const [axisGo, setAxisGo] = useState(false)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAxisGo(true)
      return
    }
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return
        io.disconnect()
        setTimeout(() => setAxisGo(true), 300)
        LOOP_STEPS.forEach((_, i) => {
          setTimeout(() => setLit(i), i * 240)
          setTimeout(() => setLit((cur) => (cur === i ? -1 : cur)), i * 240 + 850)
        })
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="relative bg-band text-band-fg after:pointer-events-none after:absolute after:inset-0 after:opacity-[0.05] after:content-[''] after:[background-image:var(--noise)]">
      <Section className="relative z-10 pb-20 sm:pb-28">
        <div className="flex items-baseline gap-4 border-b border-band-rule py-4">
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-accent">02</span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-band-muted">怎么运转</span>
          <span className="flex-1" />
          <span className="font-mono text-[0.7rem] tracking-[0.1em] text-band-muted/60">Loop ×6 / 月</span>
        </div>

        <div className="rv flex flex-wrap items-start gap-5 pt-12 sm:pt-16">
          <div className="max-w-3xl">
            <h2 className="text-balance font-display text-headline">以结果收口的六步闭环</h2>
            <p className="mt-5 text-body text-band-muted">课程的终点是听完，这里的终点是一个能被验证的数字。每个月只跑一轮，不贪多。</p>
          </div>
          <span className="mt-2 inline-flex items-center rounded-full border border-band-rule bg-band-card px-[0.9em] py-[0.3em] font-mono text-[0.66rem] uppercase tracking-[0.12em] text-band-muted">
            每月一轮 · 不贪多
          </span>
        </div>

        <div ref={rootRef} className="rv mt-12">
          <ol className="relative grid gap-8 min-[561px]:grid-cols-2 lg:grid-cols-6 lg:gap-0 lg:before:absolute lg:before:left-0 lg:before:right-0 lg:before:top-[5px] lg:before:h-px lg:before:bg-band-rule">
            {LOOP_STEPS.map((s, i) => (
              <li key={s.n} className="lg:pr-5">
                <span
                  className={`mb-3.5 block h-[11px] w-[11px] rotate-45 border transition duration-300 lg:mb-5 ${
                    lit === i ? 'border-accent bg-accent shadow-[0_0_12px_rgba(226,52,11,.5)]' : 'border-band-muted bg-band'
                  }`}
                />
                <span className="font-mono text-[0.66rem] tracking-[0.14em] text-accent">STEP {s.n}</span>
                <h3 className="mt-2 text-[1.06rem] font-bold tracking-[-0.01em]">{s.t}</h3>
                <p className="mt-1.5 text-[0.79rem] leading-[1.7] text-band-muted">{s.d}</p>
              </li>
            ))}
          </ol>
          <div className="relative ml-[5px] mr-[30%] mt-10 h-6 border border-t-0 border-dashed border-band-rule before:absolute before:-left-1 before:-top-1.5 before:border-[5px] before:border-transparent before:border-b-accent before:border-b-[7px] before:content-[''] lg:mr-[calc(100%/6-5px)] lg:h-9" aria-hidden>
            <span className="absolute bottom-[-0.72em] left-1/2 -translate-x-1/2 whitespace-nowrap bg-band px-4 font-mono text-[0.66rem] tracking-[0.2em] text-band-muted">
              沉淀为案例 → 回到 01 · 下一轮战役
            </span>
          </div>
          <div className="mt-14" aria-hidden>
            <div className="mb-2.5 flex justify-between font-mono text-[0.64rem] tracking-[0.16em] text-band-muted">
              <span>第 1 天 · 开战</span>
              <span>第 30 天 · 收口</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-band-rule">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent to-[#ff6a3d] transition-[width] duration-[1800ms] ease-spring"
                style={{ width: axisGo ? '100%' : '0%' }}
              />
            </div>
            <div className="mt-2.5 text-right font-mono text-[0.64rem] tracking-[0.16em] text-band-muted">一轮战役 = 一个自然月</div>
          </div>
        </div>
      </Section>
    </div>
  )
}

/* ============ 03 服务全景 bento ============ */
function CellShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-xl2 border border-line-strong bg-surface p-6 shadow-card ring-1 ring-inset ring-white/70 transition duration-300 ease-spring hover:-translate-y-[3px] hover:shadow-pop ${className}`}
    >
      {children}
    </div>
  )
}

function Bento() {
  return (
    <div className="border-b border-line bg-subtle">
      <Section className="pb-20 sm:pb-28">
        <div className="flex items-baseline gap-4 border-b border-line-strong py-4">
          <span className="font-mono text-[0.7rem] tracking-[0.14em] text-accent">03</span>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">加入后你拿到什么</span>
          <span className="flex-1" />
          <span className="font-mono text-[0.7rem] tracking-[0.1em] text-faint">Services ×5</span>
        </div>
        <div className="rv max-w-3xl pt-12 sm:pt-16">
          <h2 className="text-balance font-display text-headline text-fg">一个社区，五件实在东西</h2>
          <p className="mt-5 text-body text-muted">不发年度大课，不卖工具会员。每个月围绕一场战役，把下面这些交到你手上。</p>
        </div>

        <div className="rv mt-12 grid grid-cols-1 gap-3.5 md:grid-cols-12">
          {/* 本月战役 */}
          <CellShell className="md:col-span-12 lg:col-span-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle,rgb(var(--line-strong))_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_70%_80%_at_90%_0%,black,transparent_65%)]"
            />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="eyebrow">本月战役</span>
                <Chip pulse>第 001 期 · 招募中</Chip>
              </div>
              <h3 className="text-[1.18rem] font-bold tracking-[-0.015em] text-fg">一个月，围着你的一个问题打</h3>
              <p className="mt-2 text-[0.86rem] text-muted">
                从五类问题里挑一个立项。有起点、有动作清单、有截止日，我盯着你跑完，月底用数字收口。
              </p>
              <div className="mb-6 mt-4 flex flex-wrap gap-2">
                {PILLARS.map((p) => (
                  <Kbd key={p.key}>{p.title}</Kbd>
                ))}
              </div>
            </div>
            <div className="relative mt-auto flex flex-wrap gap-7 border-t border-dashed border-line pt-4">
              {[
                ['30 天', '一轮周期'],
                ['1 个', '本月只解决它'],
                ['可核验', '结果收口标准'],
              ].map(([b, s]) => (
                <div key={s}>
                  <b className="block text-[1.05rem] font-bold tabular-nums text-fg">{b}</b>
                  <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-faint">{s}</span>
                </div>
              ))}
            </div>
          </CellShell>

          {/* 案例解剖 */}
          <CellShell className="md:col-span-12 lg:col-span-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="eyebrow">案例库</span>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">征集中</span>
            </div>
            <h3 className="text-[1.18rem] font-bold tracking-[-0.015em] text-fg">一条合格案例的解剖</h3>
            <p className="mt-2 text-[0.86rem] text-muted">在有真实结果之前，这里不放任何数字——包括看起来很好看的那种。</p>
            <div className="mt-3.5 rounded-lg2 border border-line bg-canvas px-4 py-3.5" aria-label="案例字段模板">
              {[
                ['行业与规模', '如：区域连锁餐饮，8 家门店'],
                ['卡住的问题', '具体到一件事'],
                ['当月动作', '30 天做了哪几步，谁执行'],
                ['可验证结果', '带数字，说明怎么统计'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline gap-3 border-b border-dashed border-line py-1.5">
                  <span className="w-[6.4em] shrink-0 font-mono text-[0.6rem] tracking-[0.1em] text-muted">{k}</span>
                  <span className="flex-1 text-[0.74rem] text-faint">{v}</span>
                </div>
              ))}
              <div className="flex items-baseline gap-3 py-1.5">
                <span className="w-[6.4em] shrink-0 font-mono text-[0.6rem] tracking-[0.1em] text-accent-hi">没解决的部分</span>
                <span className="flex-1 text-[0.74rem] text-accent-hi">
                  哪些没跑通、为什么 <span className="text-[0.86em]">←这一栏不能空</span>
                </span>
              </div>
            </div>
            <div className="mt-auto pt-4">
              <ArrowLink href="/cases.html">看看完整案例标准</ArrowLink>
            </div>
          </CellShell>

          {/* 团队手册 */}
          <CellShell className="md:col-span-6 lg:col-span-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="eyebrow">团队手册</span>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">92 篇 · MIT</span>
            </div>
            <h3 className="text-[1.18rem] font-bold tracking-[-0.015em] text-fg">给你技术负责人的实操手册</h3>
            <p className="mt-2 text-[0.86rem] text-muted">
              原作者 {LIBRARY.author}，MIT 开源，原样收录并保留署名。你不用会敲命令，但你的团队得会。
            </p>
            <div className="mt-3.5 grid gap-2">
              {LIBRARY.tracks.map((t) => (
                <a
                  key={t.slug}
                  href={`/library/${t.slug}/`}
                  className="flex items-center gap-3 rounded-lg2 border border-line bg-canvas px-3.5 py-2.5 transition hover:border-fg"
                >
                  <span className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[7px] border border-line-strong bg-surface font-mono text-[0.62rem] text-fg-soft">
                    {t.slug === 'claude-code' ? 'CC' : 'CX'}
                  </span>
                  <span>
                    <b className="block text-[0.86rem] font-bold text-fg">{t.title}</b>
                    <span className="block text-[0.68rem] leading-normal text-faint">{t.desc}</span>
                  </span>
                </a>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <ArrowLink href="/library/">打开团队手册</ArrowLink>
            </div>
          </CellShell>

          {/* AI 情报 */}
          <CellShell className="md:col-span-6 lg:col-span-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="eyebrow">AI 情报</span>
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">每周</span>
            </div>
            <h3 className="text-[1.18rem] font-bold tracking-[-0.015em] text-fg">只收录影响你账本的</h3>
            <div className="mt-3.5 grid gap-2.5">
              {[
                ['能落地的新工具', '只收当周真能用在五类问题上的'],
                ['同行在做什么', '国内中小企业跑出结果的做法，附来源'],
                ['成本变化', '模型降价、额度调整，直接影响你的账'],
                ['踩坑记录', '社区当周失败的尝试，替你交学费'],
              ].map(([t, d]) => (
                <div key={t} className="flex gap-2.5 text-[0.82rem] text-fg-soft">
                  <span className="text-[0.75em] leading-[2.2] text-accent">▸</span>
                  <span>
                    {t}
                    <small className="block text-[0.86em] text-faint">{d}</small>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <ArrowLink href="/intel.html">看情报范围</ArrowLink>
            </div>
          </CellShell>

          {/* 经营诊断 */}
          <CellShell className="border-band bg-band text-band-fg after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-[0.05] after:content-[''] after:[background-image:var(--noise)] md:col-span-12 lg:col-span-4">
            <div className="relative z-10 flex h-full flex-col">
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="font-mono text-[0.68rem] uppercase tracking-[0.15em] text-accent">经营诊断</span>
                <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-band-muted">免费 · 10 分钟</span>
              </div>
              <h3 className="text-[1.18rem] font-bold tracking-[-0.015em]">一切从诊断开始</h3>
              <p className="mt-2 text-[0.86rem] text-band-muted">
                三个问题定位你卡在哪一环：做什么生意、现在卡在哪、这个月最想解决什么。
              </p>
              <a
                href="/join.html"
                className="group mt-auto inline-flex items-center gap-2 pt-4 text-label font-bold text-[#ff8a63]"
              >
                现在诊断
                <span className="font-mono transition-transform duration-300 ease-spring group-hover:translate-x-[3px]">→</span>
              </a>
            </div>
          </CellShell>
        </div>
      </Section>
    </div>
  )
}

/* ============ 04 为什么再做一个 ============ */
function Difference() {
  return (
    <Section className="pb-20 sm:pb-28">
      <Ruler idx="04" name="为什么再做一个" tick="Position" />
      <div className="grid gap-10 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
        <div className="rv lg:sticky lg:top-24 lg:self-start">
          <h2 className="text-balance font-display text-headline text-fg">
            市面上不缺 AI 课程，缺的是有人
            <span className="[box-shadow:inset_0_-0.32em_0_rgb(var(--accent-050))]">陪你把一件事做完</span>
          </h2>
          <div className="mt-7 h-1 w-14 rounded-sm bg-accent" />
        </div>

        <div className="rv space-y-6">
          <p className="text-[0.97rem] text-fg-soft">
            生财有术这样的社区把「发现项目 → 找高手 → 参加航海 → 跑出结果」这条链路做得很成熟，覆盖的方向也足够宽。
            但正因为宽，AI 只是其中一个方向，而老板的经营问题往往需要有人盯着看完一整个月。
          </p>
          <p className="text-[0.97rem] text-fg-soft">
            我们把人群收窄到
            <strong className="font-bold text-fg [box-shadow:inset_0_-0.3em_0_rgb(var(--accent-050))]">已经在经营一门生意的中小企业老板</strong>
            ，把交付物收窄到
            <strong className="font-bold text-fg [box-shadow:inset_0_-0.3em_0_rgb(var(--accent-050))]">可被验证的经营结果</strong>
            ——省下的小时数、多出来的线索、降下去的成本。
          </p>
          <p className="text-[0.97rem] text-fg-soft">
            这意味着我们不教你怎么调参数，也不做工具评测。你要的是这个月的获客成本降下来，不是又收藏了三十个提示词。
          </p>
        </div>
      </div>
    </Section>
  )
}

/* ============ 05 诊断单 ============ */
function Intake() {
  return (
    <Section className="pb-24 sm:pb-28">
      <Ruler idx="05" name="开始诊断" tick="Intake" />
      <div className="rv pt-12 sm:pt-14">
        <WeChatCTA />
      </div>
    </Section>
  )
}

export default function Home() {
  useReveal()
  return (
    <Layout current="/">
      <Ticker />
      <Hero />
      <Pillars />
      <Loop />
      <Bento />
      <Difference />
      <Intake />
    </Layout>
  )
}
