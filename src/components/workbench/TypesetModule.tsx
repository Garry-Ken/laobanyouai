import { useEffect, useRef, useState } from 'react'
import { Card } from '../ui'
import { md, preprocessMarkdown, applyTheme } from '../../lib/markdown'
import { makeWeChatCompatible } from '../../lib/wechatCompat'
import { THEME_GROUPS } from '../../lib/themes'
import { toPreviewSource } from '../../lib/frontmatter'
import { handleSmartPaste } from '../../lib/htmlToMarkdown'

interface Props {
  markdown: string
  setMarkdown: (v: string) => void
  theme: string
  setTheme: (t: string) => void
  goTo: (t: 'write' | 'typeset' | 'score') => void
}

export default function TypesetModule({ markdown, setMarkdown, theme, setTheme, goTo }: Props) {
  const [html, setHtml] = useState('')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = md.render(preprocessMarkdown(toPreviewSource(markdown)))
    setHtml(applyTheme(raw, theme))
  }, [markdown, theme])

  const copy = async () => {
    if (!previewRef.current) return
    try {
      const finalHtml = await makeWeChatCompatible(html, theme)
      const htmlBlob = new Blob([finalHtml], { type: 'text/html' })
      const textBlob = new Blob([previewRef.current.innerText], { type: 'text/plain' })
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })])
      setCopied('ok')
    } catch {
      try { await navigator.clipboard.writeText(html); setCopied('ok') } catch { setCopied('fail') }
    }
    setTimeout(() => setCopied('idle'), 2500)
  }

  const han = (markdown.match(/[一-鿿]/g) || []).length

  return (
    <div>
      {/* 主题选择 */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        {THEME_GROUPS.map((g) => (
          <div key={g.label} className="flex items-center gap-2">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">{g.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {g.themes.map((t) => (
                <button key={t.id} onClick={() => setTheme(t.id)} className={`rounded-[8px] border px-2.5 py-1.5 text-[0.76rem] font-semibold transition ${theme === t.id ? 'border-fg bg-fg text-canvas' : 'border-line text-muted hover:border-line-strong hover:text-fg'}`}>{t.name}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 手机端 tab */}
      <div className="mt-6 flex gap-1.5 md:hidden">
        {([['edit', '编辑'], ['preview', '预览']] as const).map(([id, name]) => (
          <button key={id} onClick={() => setTab(id)} className={`flex-1 rounded-full py-2 text-[0.82rem] font-semibold transition ${tab === id ? 'bg-fg text-canvas' : 'bg-subtle text-muted'}`}>{name}</button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className={`${tab === 'edit' ? 'block' : 'hidden'} md:block`}>
          <Card className="!p-0 overflow-hidden h-full">
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              onPaste={(e) => handleSmartPaste(e, setMarkdown)}
              spellCheck={false}
              className="h-[58vh] w-full resize-none bg-transparent p-5 font-mono text-[0.84rem] leading-[1.75] text-fg outline-none placeholder:text-faint"
              placeholder="从「写作」tab 生成会自动带到这里;也可以直接写或粘贴 Markdown。支持从飞书 / Word / Notion 粘贴富文本,自动转 Markdown。"
            />
            <div className="flex items-center justify-between border-t border-line bg-canvas/60 px-5 py-3">
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">{han} 汉字</span>
              <button onClick={() => setMarkdown('')} className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint transition hover:text-accent-hi">清空</button>
            </div>
          </Card>
        </div>

        <div className={`${tab === 'preview' ? 'block' : 'hidden'} md:block`}>
          <div className="sticky top-[80px]">
            <div className="mx-auto max-w-[420px] overflow-hidden rounded-[20px] border border-line-strong bg-white shadow-pop ring-1 ring-inset ring-white/70">
              <div className="flex items-center gap-1.5 border-b border-line bg-surface px-4 py-2.5">
                <i className="h-2 w-2 rounded-full bg-accent/40" />
                <i className="h-2 w-2 rounded-full bg-line-strong" />
                <i className="h-2 w-2 rounded-full bg-line-strong" />
                <span className="ml-2 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-faint">公众号预览</span>
              </div>
              <div className="max-h-[54vh] overflow-y-auto">
                {markdown.trim()
                  ? <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
                  : <div ref={previewRef} className="p-10 text-center text-[0.82rem] leading-relaxed text-faint">左侧还没有内容。<br />去「写作」tab 生成一篇,或直接粘贴文章。</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={copy} disabled={!markdown.trim()} className="rounded-[10px] bg-fg px-7 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40">
          {copied === 'ok' ? '✓ 已复制,去公众号后台粘贴' : copied === 'fail' ? '复制失败,检查浏览器权限' : '复制到公众号 →'}
        </button>
        <button onClick={() => goTo('score')} className="rounded-[10px] border border-line-strong bg-surface px-6 py-3 text-label font-semibold text-fg transition hover:border-fg active:translate-y-[1px]">下一步:评分 →</button>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint">图片自动 Base64 · macOS ⌘V / Windows Ctrl+V</span>
      </div>
    </div>
  )
}
