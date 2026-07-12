import { useEffect, useRef, useState } from 'react'
import { Layout } from '../components/Layout'
import { Section, Ruler, SectionHeading, Card, Chip, GhostLink, WeChatCTA } from '../components/ui'
import { buildPrompt, streamDirect, SITE_PROVIDERS, type WriteParams } from '../lib/writer'

const GITHUB = 'https://github.com/Garry-Ken/changxin'
const field = 'w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-[0.86rem] text-fg outline-none transition focus:border-fg placeholder:text-faint'
const label = 'block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted mb-1.5 mt-5 first:mt-0'

const LS = { cfg: 'lby.write.cfg', key: 'lby.write.key', draft: 'lby.draft' }

export default function Write() {
  const [p, setP] = useState<WriteParams>({ topic: '', keywords: '', audience: '', words: '3500-4500', notes: '', who: '', reader: '', offer: '' })
  const set = (k: keyof WriteParams) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value })

  const [mode, setMode] = useState<'prompt' | 'direct'>('prompt')
  const [copied, setCopied] = useState(false)

  // 直连配置(仅存访客本机浏览器)
  const [providerId, setProviderId] = useState('custom')
  const [baseUrl, setBaseUrl] = useState('')
  const [model, setModel] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [generating, setGenerating] = useState(false)
  const [out, setOut] = useState('')
  const [err, setErr] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const outRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(LS.cfg) || '{}')
      if (c.providerId) { setProviderId(c.providerId); setBaseUrl(c.baseUrl || ''); setModel(c.model || '') }
      setApiKey(localStorage.getItem(LS.key) || '')
    } catch { /* 忽略 */ }
  }, [])

  const preset = SITE_PROVIDERS.find((x) => x.id === providerId)!
  const pickProvider = (id: string) => {
    const pr = SITE_PROVIDERS.find((x) => x.id === id)!
    setProviderId(id)
    setBaseUrl(pr.baseUrl)
    setModel(pr.model)
  }

  const canGo = p.topic.trim().length > 0

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(buildPrompt(p))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const run = async () => {
    if (!canGo || generating) return
    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) { setErr('先填服务商 Base URL / 模型 / API Key(只存你自己的浏览器)'); return }
    localStorage.setItem(LS.cfg, JSON.stringify({ providerId, baseUrl, model }))
    localStorage.setItem(LS.key, apiKey)
    setGenerating(true); setErr(''); setOut('')
    const ac = new AbortController()
    abortRef.current = ac
    let acc = ''
    try {
      await streamDirect(
        { style: preset.style, baseUrl, apiKey, model },
        buildPrompt(p),
        (d) => {
          acc += d
          setOut(acc)
          localStorage.setItem(LS.draft, acc)
          if (outRef.current) outRef.current.scrollTop = outRef.current.scrollHeight
        },
        ac.signal,
      )
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setErr((e as Error).message)
    } finally {
      setGenerating(false)
      abortRef.current = null
    }
  }

  const hanCount = (out.match(/[一-鿿]/g) || []).length

  return (
    <Layout current="/write.html">
      <Section className="pt-16 sm:pt-20">
        <Chip pulse>免费工具 · 写作宪法开源 · Key 只存你的浏览器</Chip>
        <div className="mt-6">
          <SectionHeading
            eyebrow="Article Writer / 长文写作"
            title="输入主题,产出一篇「读完就信」的公众号长文"
            desc="按开源「长信」的信任长文宪法成稿:七段式结构 + 九条叙事原理 + 诚实红线(不编造案例)。两种用法:复制完整写作指令贴给你常用的任何 AI;或自带 API Key 在这里直接流式生成。"
          />
        </div>

        {/* 参数表单 */}
        <Card className="mt-10">
          <div className="grid gap-x-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>主题 *</label>
              <textarea className={`${field} h-16 resize-none`} value={p.topic} onChange={set('topic')}
                placeholder="例:中小老板的第一笔 AI 预算该怎么花" />
            </div>
            <div>
              <label className={label}>我是谁(人设,一两句)</label>
              <input className={field} value={p.who} onChange={set('who')} placeholder="例:做了 8 年跨境供应链,自己有工厂" />
            </div>
            <div>
              <label className={label}>写给谁</label>
              <input className={field} value={p.reader} onChange={set('reader')} placeholder="例:年营收千万内的实体老板" />
            </div>
            <div>
              <label className={label}>关键词(可选)</label>
              <input className={field} value={p.keywords} onChange={set('keywords')} placeholder="逗号分隔" />
            </div>
            <div>
              <label className={label}>字数 / 转化指向(可选)</label>
              <div className="flex gap-2">
                <input className={`${field} !w-28`} value={p.words} onChange={set('words')} />
                <input className={field} value={p.offer} onChange={set('offer')} placeholder="例:AI 落地陪跑咨询" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={label}>真实素材(强烈建议:你的案例/数字/踩坑——宪法规定案例只能取自这里)</label>
              <textarea className={`${field} h-24 resize-y`} value={p.notes} onChange={set('notes')}
                placeholder="给得越具体,文章越可信。不给素材,AI 会写得克制并明说是行业观察,不会编造亲历。" />
            </div>
          </div>

          {/* 两种模式 */}
          <div className="mt-7 flex gap-1.5">
            {([['prompt', '① 复制写作指令(零门槛)'], ['direct', '② 在这里直接生成(自带 Key)']] as const).map(([id, name]) => (
              <button key={id} onClick={() => setMode(id)}
                className={`rounded-full px-4 py-2 text-[0.78rem] font-semibold transition ${mode === id ? 'bg-fg text-canvas' : 'bg-subtle text-muted hover:text-fg'}`}>
                {name}
              </button>
            ))}
          </div>

          {mode === 'prompt' && (
            <div className="mt-5 rounded-xl2 border border-line bg-canvas/70 p-5">
              <p className="text-[0.84rem] leading-relaxed text-fg-soft">
                点击复制后,把整段指令粘贴给你常用的任何 AI(DeepSeek / Kimi / 豆包 / 元宝 / ChatGPT / Claude 都行),它就会按长信宪法给你成稿。<b className="text-fg">写作方法论已全部内嵌</b>:七段式、九条叙事原理、去 AI 味红线、交稿自审清单。
              </p>
              <button onClick={copyPrompt} disabled={!canGo}
                className="mt-4 rounded-[10px] bg-fg px-7 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40">
                {copied ? '✓ 已复制,去贴给你的 AI' : canGo ? '复制完整写作指令 →' : '先填主题'}
              </button>
              <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint">
                指令约 1500 字 · 生成后回来用「长文评分」检验
              </p>
            </div>
          )}

          {mode === 'direct' && (
            <div className="mt-5 rounded-xl2 border border-line bg-canvas/70 p-5">
              <label className={label}>服务商</label>
              <div className="flex flex-wrap gap-1.5">
                {SITE_PROVIDERS.map((x) => (
                  <button key={x.id} onClick={() => pickProvider(x.id)}
                    className={`rounded-[8px] border px-3 py-1.5 text-[0.76rem] font-semibold transition ${providerId === x.id ? 'border-fg text-fg bg-surface' : 'border-line text-muted hover:border-line-strong'}`}>
                    {x.name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.74rem] text-muted">{preset.note}</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={label}>Base URL</label>
                  <input className={field} value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://你的中转站/v1" />
                </div>
                <div>
                  <label className={label}>模型</label>
                  <input className={field} value={model} onChange={(e) => setModel(e.target.value)} placeholder="模型名" />
                </div>
              </div>
              <label className={label}>API Key(只存你的浏览器 localStorage,本站无后端、不上传)</label>
              <input className={field} type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-…" />
              <div className="mt-4 flex items-center gap-3">
                {generating ? (
                  <button onClick={() => abortRef.current?.abort()}
                    className="rounded-[10px] border border-line-strong bg-surface px-7 py-3 text-label font-semibold text-fg transition hover:border-fg">
                    ■ 停止
                  </button>
                ) : (
                  <button onClick={run} disabled={!canGo}
                    className="rounded-[10px] bg-fg px-7 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40">
                    开始成稿 →
                  </button>
                )}
                {generating && <span className="font-mono text-[0.66rem] tracking-[0.1em] text-muted">流式生成中 · {hanCount} 汉字…</span>}
              </div>
              {err && <p className="mt-3 rounded-[10px] bg-accent/5 p-3 text-[0.78rem] leading-relaxed text-accent-hi">{err}</p>}
            </div>
          )}
        </Card>

        {/* 产出 */}
        {out && (
          <Card className="mt-6 !p-0 overflow-hidden">
            <textarea ref={outRef} value={out} onChange={(e) => { setOut(e.target.value); localStorage.setItem(LS.draft, e.target.value) }}
              rows={18} className="w-full resize-y bg-transparent p-6 font-mono text-[0.82rem] leading-relaxed text-fg outline-none" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/60 px-6 py-4">
              <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">{hanCount} 汉字 · 可直接编辑</span>
              <div className="flex gap-2.5">
                <button onClick={async () => { await navigator.clipboard.writeText(out) }}
                  className="rounded-[10px] border border-line-strong bg-surface px-5 py-2.5 text-[0.8rem] font-semibold text-fg transition hover:border-fg">
                  复制全文
                </button>
                <a href="/score.html#draft"
                  className="rounded-[10px] bg-fg px-5 py-2.5 text-[0.8rem] font-semibold text-canvas transition hover:bg-accent hover:text-white">
                  送去九维评分 →
                </a>
              </div>
            </div>
          </Card>
        )}
      </Section>

      {/* 说明与产品 */}
      <Section className="mt-20">
        <Ruler idx="02" name="How it works" tick="与开源版同源" />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Card>
            <Chip>宪法内嵌</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">这里用的写作指令,与开源「长信」的 methodology / 叙事底座同源:七段式、九条原理、去 AI 味清单、<b className="text-fg">诚实红线(不编造案例)</b>全部内嵌。</p>
          </Card>
          <Card>
            <Chip>零后端</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">本页没有服务器:指令模式纯复制;直连模式从你的浏览器直达服务商,Key 只存你本机。国内推荐中转站或智谱,海外 Gemini 有免费额度。</p>
          </Card>
          <Card>
            <Chip>完整版</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">要「人设证据库 + 11 主题排版 + 一键进公众号草稿箱 + LLM 九维深评」,用开源本地版:Claude Code/Codex 里零 Key 写作,或本地 Web 工作台。</p>
          </Card>
        </div>
        <div className="mt-9 flex flex-wrap gap-4">
          <GhostLink href={GITHUB}>GitHub:Garry-Ken/changxin</GhostLink>
          <GhostLink href="/score.html">长文评分工具</GhostLink>
        </div>
      </Section>

      <Section className="mt-24">
        <WeChatCTA title="想把「写长文建信任」做成你业务里的一条流水线?" />
      </Section>
    </Layout>
  )
}
