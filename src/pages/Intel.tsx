import { Layout } from '../components/Layout'
import { Card, Section, SectionHeading, WeChatCTA } from '../components/ui'
import { INTEL_SCOPE, PILLARS } from '../site'

export default function Intel() {
  return (
    <Layout current="/intel.html">
      <Section className="py-16 sm:py-20">
        <div className="max-w-3xl animate-fade-up">
          <p className="text-eyebrow font-semibold uppercase text-accent">AI 情报</p>
          <h1 className="mt-4 text-headline font-semibold text-fg">每周一封，只写会影响你这个月决策的事</h1>
          <div className="prose-cn mt-6 space-y-4">
            <p>
              第一期还没有发。在开始之前，先把边界讲清楚——这样你能判断值不值得订，我也能被你监督。
            </p>
          </div>
        </div>
      </Section>

      <div className="border-y border-line bg-surface">
        <Section className="py-16 sm:py-20">
          <SectionHeading eyebrow="写什么" title="四个栏目，写满为止，写不满就不发" />

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {INTEL_SCOPE.map((item) => (
              <Card key={item.title}>
                <h3 className="text-title font-semibold text-fg">{item.title}</h3>
                <p className="mt-3 text-body text-muted">{item.desc}</p>
              </Card>
            ))}
          </div>
        </Section>
      </div>

      <Section className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="不写什么"
          title="任何和这五类问题无关的 AI 新闻"
          desc="模型跑分、融资金额、参数规模、发布会——它们不会让你这个月多一个客户。所以不写。"
        />

        <div className="mt-8 flex flex-wrap gap-2.5">
          {PILLARS.map((p) => (
            <span
              key={p.key}
              className="rounded-full border border-line bg-surface px-4 py-2 text-label text-fg-soft shadow-card"
            >
              {p.title}
            </span>
          ))}
        </div>

        <div className="mt-14">
          <WeChatCTA title="加微信，第一期发出时你会收到" />
        </div>
      </Section>
    </Layout>
  )
}
