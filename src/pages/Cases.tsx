import { Layout } from '../components/Layout'
import { Card, Eyebrow, Section, SectionHeading, WeChatCTA } from '../components/ui'
import { CASE_SCHEMA } from '../site'

export default function Cases() {
  return (
    <Layout current="/cases.html">
      <div className="border-b border-line">
        <Section className="py-20 sm:py-24">
          <div className="max-w-3xl animate-fade-up">
            <Eyebrow>案例库</Eyebrow>
            <h1 className="mt-5 text-balance font-display text-headline text-fg">这里现在是空的，这是有意的</h1>
            <div className="mt-8 h-px w-24 bg-accent" />
            <div className="prose-cn mt-8 space-y-5">
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
      </div>

      <div className="border-b border-line bg-surface">
        <Section className="py-20 sm:py-24">
          <SectionHeading
            eyebrow="标准"
            title="一条案例发布出来时，会长这样"
            desc="六个字段缺一不可。尤其是最后一个——如果一条案例没有「没解决的部分」，它多半不是案例，是广告。"
          />

          <div className="mt-14 border-t border-line">
            {CASE_SCHEMA.map((row, i) => (
              <div
                key={row.field}
                className="grid gap-2 border-b border-line py-6 sm:grid-cols-[4rem_minmax(0,12rem)_1fr] sm:gap-8"
              >
                <span className="font-display text-[1.25rem] leading-none text-line-strong">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-label font-medium text-fg">{row.field}</span>
                <p className="text-label text-muted">{row.example}</p>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <Section className="py-20 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <Card>
            <h2 className="font-display text-title text-fg">成为首批共创者</h2>
            <div className="prose-cn mt-5 space-y-4">
              <p>
                首批参与的老板，我们会一起跑完一整场 30 天战役，过程和结果都写进案例库，署名与否由你决定。
              </p>
              <p>作为交换，你会拿到全程陪跑，而不是一份课件。</p>
            </div>
          </Card>

          <Card className="bg-subtle">
            <h2 className="font-display text-title text-fg">我们不会做的事</h2>
            <ul className="mt-5 space-y-4 text-body text-fg-soft">
              {['编造或美化案例数字', '把公开报道包装成「我们的案例」', '只发成功案例，不发失败的那一半'].map((t) => (
                <li key={t} className="flex gap-3.5">
                  <span className="mt-3 h-px w-4 shrink-0 bg-danger" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="mt-16">
          <WeChatCTA title="想成为第一条案例？先聊聊你的生意" />
        </div>
      </Section>
    </Layout>
  )
}
