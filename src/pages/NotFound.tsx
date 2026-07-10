import { Layout } from '../components/Layout'
import { Eyebrow, Section } from '../components/ui'
import { NAV } from '../site'

export default function NotFound() {
  return (
    <Layout current="">
      <Section className="py-28 sm:py-36">
        <div className="max-w-xl animate-fade-up">
          <Eyebrow>404</Eyebrow>
          <h1 className="mt-5 font-display text-headline text-fg">这个页面不存在</h1>
          <div className="mt-8 h-px w-24 bg-accent" />
          <p className="mt-8 text-body text-muted">
            可能是链接输错了，也可能是这一页还没写。下面几个是现在真实存在的：
          </p>

          <nav className="mt-10 border-t border-line">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center justify-between border-b border-line py-4 text-label text-fg transition hover:text-accent"
              >
                {item.label}
                <span className="text-faint">→</span>
              </a>
            ))}
          </nav>
        </div>
      </Section>
    </Layout>
  )
}
