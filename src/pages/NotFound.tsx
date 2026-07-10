import { Layout } from '../components/Layout'
import { Section } from '../components/ui'
import { NAV } from '../site'

export default function NotFound() {
  return (
    <Layout current="">
      <Section className="py-24 sm:py-32">
        <div className="max-w-xl animate-fade-up">
          <p className="font-mono text-eyebrow font-semibold uppercase text-accent">404</p>
          <h1 className="mt-4 text-headline font-semibold text-fg">这个页面不存在</h1>
          <p className="mt-5 text-body text-muted">
            可能是链接输错了，也可能是这一页还没写。下面几个是现在真实存在的：
          </p>

          <nav className="mt-8 flex flex-wrap gap-2.5">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-xl2 border border-line bg-surface px-4 py-2.5 text-label font-medium text-fg shadow-card transition hover:bg-subtle"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </Section>
    </Layout>
  )
}
