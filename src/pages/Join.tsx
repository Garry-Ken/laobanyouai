import { Layout } from '../components/Layout'
import { Card, Section, SectionHeading, WeChatCTA } from '../components/ui'
import { LOOP } from '../site'

const FIT = [
  '已经在经营一门生意，有真实的营收和团队',
  '这个月有一个具体的、说得出口的经营问题',
  '愿意亲自跑一遍，而不是让助理去听',
] as const

const NOT_FIT = [
  '还没开始做生意，想先学 AI 再找方向',
  '想快速搞一个 AI 项目变现',
  '希望有人代做，自己不参与',
] as const

export default function Join() {
  return (
    <Layout current="/join.html">
      <Section className="py-16 sm:py-20">
        <div className="max-w-3xl animate-fade-up">
          <p className="text-eyebrow font-semibold uppercase text-accent">加入</p>
          <h1 className="mt-4 text-headline font-semibold text-fg">先确认合不合适，再谈其他</h1>
          <p className="prose-cn mt-6 text-body text-muted">
            社区规模会控制得很小，因为陪跑是有产能上限的。所以第一步不是付款，是判断你现在适不适合进来。
          </p>
        </div>
      </Section>

      <div className="border-y border-line bg-surface">
        <Section className="py-16 sm:py-20">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <Card>
              <h2 className="flex items-center gap-2.5 text-title font-semibold text-fg">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-success/10 text-success">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                适合你，如果
              </h2>
              <ul className="mt-5 space-y-3.5">
                {FIT.map((t) => (
                  <li key={t} className="flex gap-3 text-body text-fg-soft">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h2 className="flex items-center gap-2.5 text-title font-semibold text-fg">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-danger/10 text-danger">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </span>
                暂时不适合，如果
              </h2>
              <ul className="mt-5 space-y-3.5">
                {NOT_FIT.map((t) => (
                  <li key={t} className="flex gap-3 text-body text-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-faint" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </Section>
      </div>

      <Section className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="进来以后"
          title="你的第一个月"
          desc="不是给你一堆资料让你自学，而是带你完整跑一遍这六步。"
        />

        <ol className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {LOOP.map((s) => (
            <li key={s.step} className="rounded-xl2 border border-line bg-surface p-5 shadow-card">
              <span className="font-mono text-label font-semibold text-accent">{s.step}</span>
              <h3 className="mt-2 text-title font-semibold text-fg">{s.title}</h3>
              <p className="mt-2 text-label text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pb-20 sm:pb-24">
        <WeChatCTA title="扫码加我，说说你的生意" />
        <p className="mx-auto mt-6 max-w-xl text-center text-[13px] text-faint">
          现阶段不通过网站收款。所有沟通与交付都在微信完成。
        </p>
      </Section>
    </Layout>
  )
}
