import { useEffect, useState } from 'react'
import { Layout } from '../components/Layout'
import { Section, Ruler, Card, Chip, PrimaryLink, GhostLink, WeChatCTA } from '../components/ui'
import WriteModule from '../components/workbench/WriteModule'
import TypesetModule from '../components/workbench/TypesetModule'
import ScoreModule from '../components/workbench/ScoreModule'

const GITHUB = 'https://github.com/Garry-Ken/changxin'
const DRAFT_KEY = 'lby.draft'
const THEME_KEY = 'lby.studio.theme'

type Tab = 'write' | 'typeset' | 'score'
const TABS: { id: Tab; step: string; name: string; sub: string }[] = [
  { id: 'write', step: '①', name: '写作', sub: '定主题,按信任长文宪法成稿' },
  { id: 'typeset', step: '②', name: '排版', sub: '选主题,一键复制到公众号' },
  { id: 'score', step: '③', name: '评分', sub: '九维体检,发之前过一遍' },
]

function initTab(fallback: Tab): Tab {
  try {
    const h = window.location.hash.replace('#', '')
    if (h === 'write' || h === 'typeset' || h === 'score') return h
    if (h === 'draft') return 'typeset' // 兼容旧「送去排版」链接
  } catch { /* 忽略 */ }
  return fallback
}

export default function Workbench({ defaultTab = 'write' }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(() => initTab(defaultTab))
  const [markdown, setMarkdownState] = useState<string>(() => {
    try { return localStorage.getItem(DRAFT_KEY) || '' } catch { return '' }
  })
  const [theme, setThemeState] = useState<string>(() => {
    try { return localStorage.getItem(THEME_KEY) || 'claude' } catch { return 'claude' }
  })

  const setMarkdown = (v: string) => {
    setMarkdownState(v)
    try { localStorage.setItem(DRAFT_KEY, v) } catch { /* 忽略 */ }
  }
  const setTheme = (t: string) => {
    setThemeState(t)
    try { localStorage.setItem(THEME_KEY, t) } catch { /* 忽略 */ }
  }
  const goTo = (t: Tab) => {
    setTab(t)
    try { window.history.replaceState(null, '', `#${t}`); window.scrollTo({ top: 0, behavior: 'smooth' }) } catch { /* 忽略 */ }
  }
  useEffect(() => { try { window.history.replaceState(null, '', `#${tab}`) } catch { /* 忽略 */ } }, [tab])

  return (
    <Layout current="/workbench.html">
      <Section className="pt-16 sm:pt-20">
        <Chip pulse>免费工具 · 一份稿子走完三步 · 浏览器本地,不上传</Chip>
        <h1 className="mt-6 max-w-3xl text-balance font-display text-headline text-fg">长文工作台:写作 → 排版 → 评分,一处搞定</h1>
        <p className="mt-4 max-w-2xl text-pretty text-body text-muted">
          输入主题成稿、11 套主题排版、九维评分,是同一件事的三步。同一份稿子在三个步骤间贯穿,切换不丢。全部在你的浏览器里完成,API Key 和文章都不上传。
        </p>

        {/* 三步 tab */}
        <div className="mt-9 grid gap-2.5 sm:grid-cols-3">
          {TABS.map((t) => {
            const active = tab === t.id
            return (
              <button key={t.id} onClick={() => goTo(t.id)}
                className={`group flex items-start gap-3 rounded-xl2 border p-4 text-left transition ${active ? 'border-fg bg-fg text-canvas shadow-pop' : 'border-line-strong bg-surface text-fg hover:border-fg'}`}>
                <span className={`font-display text-[1.5rem] font-extrabold leading-none ${active ? 'text-canvas' : 'text-accent'}`}>{t.step}</span>
                <span>
                  <b className="block text-[0.98rem]">{t.name}</b>
                  <span className={`mt-0.5 block text-[0.74rem] leading-snug ${active ? 'text-canvas/75' : 'text-muted'}`}>{t.sub}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* 活动面板 */}
        <div className="mt-8">
          {tab === 'write' && <WriteModule markdown={markdown} setMarkdown={setMarkdown} goTo={goTo} />}
          {tab === 'typeset' && <TypesetModule markdown={markdown} setMarkdown={setMarkdown} theme={theme} setTheme={setTheme} goTo={goTo} />}
          {tab === 'score' && <ScoreModule markdown={markdown} setMarkdown={setMarkdown} goTo={goTo} />}
        </div>
      </Section>

      {/* 常驻:开源背书 + 转化 */}
      <Section className="mt-20">
        <Ruler idx="＋" name="Changxin / 长信" tick="MIT 开源" />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card>
            <Chip>零后端 · 开源同源</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">这个工作台的写作宪法、11 套排版主题、九维评分口径,都与开源「长信」同源。本站没有服务器,一切在你浏览器里跑。</p>
          </Card>
          <Card>
            <Chip>要更强 → 本地版</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">人设证据库、LLM 九维深评、一键进公众号草稿箱,在开源本地版里:Claude Code / Codex 零 Key 写作,或本地 Web 工作台。</p>
          </Card>
          <Card>
            <Chip>命令行</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">脚本党友好:<span className="kbd">publish.mjs</span> 排版推送、<span className="kbd">heuristics.mjs</span> 客观测量,接进你自己的自动化流水线。</p>
          </Card>
        </div>
        <div className="mt-9 flex flex-wrap gap-4">
          <PrimaryLink href={GITHUB}>GitHub 开源仓库</PrimaryLink>
          <GhostLink href={`${GITHUB}#快速开始web-工作台`}>三分钟装好本地版</GhostLink>
        </div>
      </Section>

      <Section className="mt-24">
        <WeChatCTA title="想把「写→排→发」做成你团队每周都在跑的流水线?" />
      </Section>
    </Layout>
  )
}
