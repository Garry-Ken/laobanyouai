import { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { Section, Ruler, SectionHeading, Card, Chip, GhostLink, WeChatCTA } from '../components/ui'
import { md, preprocessMarkdown, applyTheme } from '../lib/markdown'
import { makeWeChatCompatible } from '../lib/wechatCompat'
import { THEME_GROUPS } from '../lib/themes'
import { toPreviewSource } from '../lib/frontmatter'
import { handleSmartPaste } from '../lib/htmlToMarkdown'

const DRAFT_KEY = 'lby.draft'
const THEME_KEY = 'lby.studio.theme'

const SAMPLE = `---
title: 在这里粘贴你的文章,右侧就是公众号里的样子
---

这是「老板有AI」的公众号排版工具。左边写或粘贴 **Markdown**,右边实时渲染成公众号里的排版效果,顶部换主题,写完点「复制到公众号」——图片会自动打包,粘进后台样式零丢失。

## 它支持什么

- **加粗**、*斜体*、\`行内代码\`,列表和引用
- 从飞书 / Notion / Word 直接粘贴富文本,自动转成干净 Markdown
- 11 套主题,浅色深色都有

> 好文章值得好排版。但排版救不了内容——先去「长文写作」把稿子写扎实。

写完可以一键「送去九维评分」,看看这篇够不够格发。`

export default function Studio() {
  const [input, setInput] = useState<string>(() => {
    try {
      if (window.location.hash === '#draft') {
        const d = localStorage.getItem(DRAFT_KEY)
        if (d && d.trim()) return d
      }
      const saved = localStorage.getItem('lby.studio.input')
      if (saved) return saved
    } catch { /* 忽略 */ }
    return SAMPLE
  })
  const [theme, setTheme] = useState<string>(() => {
    try { return localStorage.getItem(THEME_KEY) || 'claude' } catch { return 'claude' }
  })
  const [html, setHtml] = useState('')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raw = md.render(preprocessMarkdown(toPreviewSource(input)))
    setHtml(applyTheme(raw, theme))
    try {
      localStorage.setItem('lby.studio.input', input)
      localStorage.setItem(DRAFT_KEY, input) // 与 write / score 页共享同一稿
    } catch { /* 忽略 */ }
  }, [input, theme])
  useEffect(() => { try { localStorage.setItem(THEME_KEY, theme) } catch { /* 忽略 */ } }, [theme])

  const copy = async () => {
    if (!previewRef.current) return
    try {
      const finalHtml = await makeWeChatCompatible(html, theme)
      const htmlBlob = new Blob([finalHtml], { type: 'text/html' })
      const textBlob = new Blob([previewRef.current.innerText], { type: 'text/plain' })
      await navigator.clipboard.write([new ClipboardItem({ 'text/html': htmlBlob, 'text/plain': textBlob })])
      setCopied('ok')
    } catch {
      // 富文本失败:退回复制 HTML 源码
      try { await navigator.clipboard.writeText(html); setCopied('ok') }
      catch { setCopied('fail') }
    }
    setTimeout(() => setCopied('idle'), 2500)
  }

  const han = (input.match(/[一-鿿]/g) || []).length

  return (
    <Layout current="/studio.html">
      <Section className="pt-16 sm:pt-20">
        <Chip pulse>免费工具 · 浏览器本地渲染 · 图片自动打包</Chip>
        <div className="mt-6">
          <SectionHeading
            eyebrow="Typesetting / 公众号排版"
            title="Markdown 写完,一键变成公众号里的样子"
            desc="左边写或粘贴,右边就是读者手机上看到的排版。11 套主题任选,图片自动转 Base64,点「复制到公众号」粘进后台,样式零丢失。整个过程在你的浏览器里完成,文章不上传。"
          />
        </div>

        {/* 主题选择 */}
        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
          {THEME_GROUPS.map((g) => (
            <div key={g.label} className="flex items-center gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-faint">{g.label}</span>
              <div className="flex flex-wrap gap-1.5">
                {g.themes.map((t) => (
                  <button key={t.id} onClick={() => setTheme(t.id)}
                    className={`rounded-[8px] border px-2.5 py-1.5 text-[0.76rem] font-semibold transition ${theme === t.id ? 'border-fg bg-fg text-canvas' : 'border-line text-muted hover:border-line-strong hover:text-fg'}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 手机端 tab */}
        <div className="mt-6 flex gap-1.5 md:hidden">
          {([['edit', '编辑'], ['preview', '预览']] as const).map(([id, name]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 rounded-full py-2 text-[0.82rem] font-semibold transition ${tab === id ? 'bg-fg text-canvas' : 'bg-subtle text-muted'}`}>
              {name}
            </button>
          ))}
        </div>

        {/* 双栏 */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div className={`${tab === 'edit' ? 'block' : 'hidden'} md:block`}>
            <Card className="!p-0 overflow-hidden h-full">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={(e) => handleSmartPaste(e, setInput)}
                spellCheck={false}
                className="h-[62vh] w-full resize-none bg-transparent p-5 font-mono text-[0.84rem] leading-[1.75] text-fg outline-none placeholder:text-faint"
                placeholder="在这里写或粘贴 Markdown…支持从飞书 / Word / Notion 粘贴富文本,自动转 Markdown。"
              />
              <div className="flex items-center justify-between border-t border-line bg-canvas/60 px-5 py-3">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">{han} 汉字</span>
                <button onClick={() => setInput('')} className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint transition hover:text-accent-hi">清空</button>
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
                <div className="max-h-[58vh] overflow-y-auto">
                  <div ref={previewRef} dangerouslySetInnerHTML={{ __html: html }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作条 */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={copy}
            className="rounded-[10px] bg-fg px-7 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px]">
            {copied === 'ok' ? '✓ 已复制,去公众号后台粘贴' : copied === 'fail' ? '复制失败,检查浏览器权限' : '复制到公众号 →'}
          </button>
          <a href="/score.html#draft"
            className="rounded-[10px] border border-line-strong bg-surface px-6 py-3 text-label font-semibold text-fg transition hover:border-fg active:translate-y-[1px]">
            送去九维评分 →
          </a>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint">macOS 微信编辑器 ⌘V · Windows Ctrl+V</span>
        </div>
      </Section>

      {/* 流水线说明 */}
      <Section className="mt-20">
        <Ruler idx="02" name="One pipeline" tick="写作 → 排版 → 评分" />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card>
            <Chip>① 写作</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">先去<a href="/write.html" className="font-semibold text-accent-hi">「长文写作」</a>按信任长文宪法把稿子写扎实——排版救不了内容。写完可直接带稿过来排版。</p>
          </Card>
          <Card>
            <Chip>② 排版(你在这)</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">选主题、看预览、一键复制。图片自动 Base64 打包,微信兼容处理已内置,粘进后台不掉样式。</p>
          </Card>
          <Card>
            <Chip>③ 评分</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">发之前用<a href="/score.html" className="font-semibold text-accent-hi">「长文评分」</a>过一遍九维,九个维度告诉你这篇够不够信任分。</p>
          </Card>
        </div>
        <div className="mt-9 flex flex-wrap gap-4">
          <GhostLink href="https://github.com/Garry-Ken/changxin">开源本地版(排版+成稿+进草稿箱)</GhostLink>
        </div>
      </Section>

      <Section className="mt-24">
        <WeChatCTA title="想把「写→排→发」做成你团队每周都在跑的流水线?" />
      </Section>
    </Layout>
  )
}
