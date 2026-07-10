import { Layout } from '../components/Layout'
import { Card, Section, SectionHeading, WeChatCTA } from '../components/ui'
import { CASE_SCHEMA } from '../site'

export default function Cases() {
  return (
    <Layout current="/cases.html">
      <Section className="py-16 sm:py-20">
        <div className="max-w-3xl animate-fade-up">
          <p className="text-eyebrow font-semibold uppercase text-accent">案例库</p>
          <h1 className="mt-4 text-headline font-semibold text-fg">这里现在是空的，这是有意的</h1>
          <div className="prose-cn mt-6 space-y-4">
            <p>
              社区刚开始，还没有跑完一整个月的案例。在有真实结果之前，我们不会往这一页里填任何东西——
              包括那些看起来很专业的「某餐饮企业获客成本下降 40%」。
            </p>
            <p>
              你大概见过太多这样的数字了。它们的问题不在于是不是真的，而在于
              <strong className="font-medium text-fg">你没法验证，也没法照着做</strong>。
            </p>
          </div>
        </div>
      </Section>

      <div className="border-y border-line bg-surface">
        <Section className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="标准"
            title="一条案例发布出来时，会长这样"
            desc="六个字段缺一不可。尤其是最后一个——如果一条案例没有「没解决的部分」，它多半不是案例，是广告。"
          />

          <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl2 border border-line bg-canvas">
            {CASE_SCHEMA.map((row, i) => (
              <div key={row.field} className="grid gap-1 p-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-6 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[13px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-label font-medium text-fg">{row.field}</span>
                </div>
                <p className="text-label text-muted">{row.example}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section className="py-16 sm:py-20">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
          <Card>
            <h2 className="text-title font-semibold text-fg">成为首批共创者</h2>
            <div className="prose-cn mt-4 space-y-3">
              <p>
                首批参与的老板，我们会一起跑完一整场 30 天战役，过程和结果都写进案例库，署名与否由你决定。
              </p>
              <p>作为交换，你会拿到全程陪跑，而不是一份课件。</p>
            </div>
          </Card>

          <Card className="bg-brand-50/60">
            <h2 className="text-title font-semibold text-fg">我们不会做的事</h2>
            <ul className="mt-4 space-y-3 text-body text-fg-soft">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                编造或美化案例数字
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                把公开报道包装成「我们的案例」
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
                只发成功案例，不发失败的那一半
              </li>
            </ul>
          </Card>
        </div>

        <div className="mt-14">
          <WeChatCTA title="想成为第一条案例？先聊聊你的生意" />
        </div>
      </Section>
    </Layout>
  )
}
