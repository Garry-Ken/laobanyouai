import { Layout } from '../components/Layout'
import { Card, Eyebrow, Section, SectionHeading, WeChatCTA } from '../components/ui'
import { INTEL_SCOPE, PILLARS } from '../site'

export default function Intel() {
  return (
    <Layout current="/intel.html">
      <div className="border-b border-line">
        <Section className="py-20 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <Eyebrow>AI 情报</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-headline text-fg">
              每周一封，只写会影响你这个月决策的事
            </h1>
            <div className="mt-8 h-px w-24 bg-accent" />
            <p className="prose-cn mt-8 text-body text-muted">
              第一期还没有发。在开始之前，先把边界讲清楚——这样你能判断值不值得订，我也能被你监督。
            </p>
          </div>
        </Section>
      </div>

      <div className="border-b border-line bg-surface">
        <Section className="py-20 sm:py-24">
          <SectionHeading eyebrow="写什么" title="四个栏目，写满为止，写不满就不发" />

          <div className="mt-14 grid gap-px bg-line sm:grid-cols-2">
            {INTEL_SCOPE.map((item) => (
              <Card key={item.title} className="border-0 bg-surface">
                <h3 className="font-display text-title text-fg">{item.title}</h3>
                <p className="mt-3.5 text-body text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      <Section className="py-20 sm:py-24">
        <SectionHeading
          eyebrow="不写什么"
          title="任何和这五类问题无关的 AI 新闻"
          desc="模型跑分、融资金额、参数规模、发布会——它们不会让你这个月多一个客户。所以不写。"
        />

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
          {PILLARS.map((p) => (
            <span key={p.key} className="font-display text-title text-fg-soft">
              {p.title}
            </span>
          ))}
        </div>

        <div className="mt-16">
          <WeChatCTA title="加微信，第一期发出时你会收到" />
        </div>
      </Section>
    </Layout>
  )
}
