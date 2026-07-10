import { Layout } from '../components/Layout'
import { Eyebrow, Section, SectionHeading, WeChatCTA } from '../components/ui'
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
      <div className="border-b border-line">
        <Section className="py-20 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <Eyebrow>加入</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-headline text-fg">先确认合不合适，再谈其他</h1>
            <div className="mt-8 h-px w-24 bg-accent" />
            <p className="prose-cn mt-8 max-w-xl text-body text-muted">
              社区规模会控制得很小，因为陪跑是有产能上限的。所以第一步不是付款，是判断你现在适不适合进来。
            </p>
          </div>
        </Section>
      </div>

      <div className="border-b border-line bg-surface">
        <Section className="py-20 sm:py-24">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Eyebrow>适合你，如果</Eyebrow>
              <ul className="mt-7 border-t border-line">
                {FIT.map((t) => (
                  <li key={t} className="flex gap-4 border-b border-line py-5 text-body text-fg-soft">
                    <span className="mt-3.5 h-px w-5 shrink-0 bg-accent" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-faint">暂时不适合，如果</p>
              <ul className="mt-7 border-t border-line">
                {NOT_FIT.map((t) => (
                  <li key={t} className="flex gap-4 border-b border-line py-5 text-body text-muted">
                    <span className="mt-3.5 h-px w-5 shrink-0 bg-line-strong" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>

      <Section className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="进来以后"
          title="你的第一个月"
          desc="不是给你一堆资料让你自学，而是带你完整跑一遍这六步。"
        />

        <ol className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {LOOP.map((s) => (
            <li key={s.step} className="border-t border-line pt-5">
              <span className="font-mono text-[0.7rem] tracking-[0.16em] text-accent">STEP {s.step}</span>
              <h3 className="mt-3 font-display text-title text-fg">{s.title}</h3>
              <p className="mt-2 text-label text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pb-24 sm:pb-28">
        <WeChatCTA title="扫码加我，说说你的生意" />
        <p className="mx-auto mt-8 max-w-xl text-center text-[12px] text-faint">
          现阶段不通过网站收款。所有沟通与交付都在微信完成。
        </p>
      </Section>
    </Layout>
  )
}
