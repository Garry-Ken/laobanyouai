import { Layout } from '../components/Layout'
import { Card, Eyebrow, Section, SectionHeading, WeChatCTA } from '../components/ui'
import { BRAND, LOOP, PILLARS } from '../site'

function Hero() {
  return (
    <div className="relative overflow-hidden border-b border-line">
      {/* 顶部柔光，暗色下自动减弱 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-80 bg-[radial-gradient(60%_100%_at_50%_100%,rgb(var(--accent)/0.12),transparent)]"
      />
      <Section className="relative py-20 sm:py-28">
        <div className="max-w-3xl animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[13px] text-muted shadow-card">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            面向中小企业老板 · 每月一场经营战役
          </div>

          {/* CJK 可在任意字符间断行，给品牌词加 nowrap 免得「老板」被拆到两行 */}
          <h1 className="mt-7 text-balance text-display font-semibold text-fg">
            让 AI 替你干活，而不是让<span className="whitespace-nowrap">老板</span>重新学一门技术。
          </h1>

          <p className="mt-6 max-w-2xl text-body text-muted sm:text-[1.0625rem]">{BRAND.subtitle}</p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/join.html"
              className="inline-flex items-center justify-center rounded-xl2 bg-accent px-6 py-3.5 text-label font-medium text-accent-fg shadow-glow transition hover:bg-accent-hi"
            >
              加入社区
            </a>
            <a
              href="/cases.html"
              className="inline-flex items-center justify-center rounded-xl2 border border-line bg-surface px-6 py-3.5 text-label font-medium text-fg transition hover:bg-subtle"
            >
              看看案例长什么样
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}

function Pillars() {
  return (
    <Section className="py-20 sm:py-24">
      <SectionHeading
        eyebrow="解决什么"
        title="老板的问题只有五类，工具每周都在变"
        desc="所以我们不追工具。把生意拆成五类固定问题，每一类都有已经跑通的做法，你只需要挑一个开始。"
      />

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p, i) => (
          <Card key={p.key} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg2 bg-brand-50 text-label font-semibold text-accent">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-title font-semibold text-fg">{p.title}</h3>
            </div>
            <p className="mt-4 text-body text-fg-soft">{p.desc}</p>
            <p className="mt-3 border-t border-line pt-3 text-label text-muted">{p.detail}</p>
          </Card>
        ))}

        <Card className="flex flex-col justify-center bg-brand-50/60">
          <p className="text-body font-medium text-fg">不确定自己卡在哪一类？</p>
          <p className="mt-2 text-label text-muted">
            那就从经营诊断开始。加微信后我会先问你三个问题，通常十分钟就能定位。
          </p>
          <a href="/join.html" className="mt-5 text-label font-medium text-accent transition hover:text-accent-hi">
            去做一次诊断 →
          </a>
        </Card>
      </div>
    </Section>
  )
}

function Loop() {
  return (
    <div className="border-y border-line bg-surface">
      <Section className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="怎么运转"
          title="以结果收口的六步闭环"
          desc="课程的终点是听完，这里的终点是一个能被验证的数字。每个月只跑一轮，不贪多。"
        />

        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {LOOP.map((s) => (
            <li key={s.step} className="relative pl-14">
              <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-xl2 border border-line bg-canvas font-mono text-label font-semibold text-accent">
                {s.step}
              </span>
              <h3 className="text-title font-semibold text-fg">{s.title}</h3>
              <p className="mt-2 text-body text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  )
}

function Difference() {
  return (
    <Section className="py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
        <div>
          <Eyebrow>为什么再做一个</Eyebrow>
          <h2 className="mt-3 text-headline font-semibold text-fg">
            市面上不缺 AI 课程，缺的是有人陪你把一件事做完
          </h2>
        </div>

        <div className="prose-cn space-y-5">
          <p>
            生财有术这样的社区把「发现项目 → 找高手 → 参加航海 → 跑出结果」这条链路做得很成熟，覆盖的方向也足够宽。
            但正因为宽，AI 只是其中一个方向，而老板的经营问题往往需要有人盯着看完一整个月。
          </p>
          <p>
            我们把人群收窄到<strong className="font-medium text-fg">已经在经营一门生意的中小企业老板</strong>，
            把交付物收窄到<strong className="font-medium text-fg">可被验证的经营结果</strong>——
            省下的小时数、多出来的线索、降下去的成本。
          </p>
          <p>
            这意味着我们不教你怎么调参数，也不做工具评测。
            你要的是这个月的获客成本降下来，不是又收藏了三十个提示词。
          </p>
        </div>
      </div>
    </Section>
  )
}

function CasesTeaser() {
  return (
    <div className="border-t border-line bg-surface">
      <Section className="py-20 sm:py-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="案例库"
            title="首批案例正在征集"
            desc="这里以后会放真实的行业案例。在有真实结果之前，我们不会放任何数字——包括看起来很好看的那种。"
          />
          <a
            href="/cases.html"
            className="shrink-0 text-label font-medium text-accent transition hover:text-accent-hi"
          >
            看看一条案例会包含什么 →
          </a>
        </div>
      </Section>
    </div>
  )
}

function Contact() {
  return (
    <Section className="py-20 sm:py-24">
      <WeChatCTA />
    </Section>
  )
}

export default function Home() {
  return (
    <Layout current="/">
      <Hero />
      <Pillars />
      <Loop />
      <Difference />
      <CasesTeaser />
      <Contact />
    </Layout>
  )
}
