import { useEffect, useRef, useState } from 'react'
import { Card } from '../ui'
import { buildPrompt, streamDirect, fetchModelsBrowser, SITE_PROVIDERS, type WriteParams } from '../../lib/writer'

const field = 'w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-[0.86rem] text-fg outline-none transition focus:border-fg placeholder:text-faint'
const label = 'block font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted mb-1.5 mt-5 first:mt-0'
const LS = { cfg: 'lby.write.cfg', key: 'lby.write.key' }

interface Props { markdown: string; setMarkdown: (v: string) => void; goTo: (t: 'write' | 'typeset' | 'score') => void }

export default function WriteModule({ markdown, setMarkdown, goTo }: Props) {
  const [p, setP] = useState<WriteParams>({ topic: '', keywords: '', audience: '', words: '3500-4500', notes: '', who: '', reader: '', offer: '' })
  const set = (k: keyof WriteParams) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setP({ ...p, [k]: e.target.value })

  const [mode, setMode] = useState<'prompt' | 'direct'>('prompt')
  const [copied, setCopied] = useState(false)
  const [providerId, setProviderId] = useState('deepseek')
  const [baseUrl, setBaseUrl] = useState('https://api.deepseek.com')
  const [model, setModel] = useState('deepseek-chat')
  const [apiKey, setApiKey] = useState('')
  const [models, setModels] = useState<string[]>(['deepseek-chat', 'deepseek-reasoner'])
  const [fetching, setFetching] = useState(false)
  const [fetchNote, setFetchNote] = useState<{ ok: boolean; text: string } | null>(null)
  const [generating, setGenerating] = useState(false)
  const [err, setErr] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(LS.cfg) || '{}')
      if (c.providerId) {
        const pr = SITE_PROVIDERS.find((x) => x.id === c.providerId)
        setProviderId(c.providerId); setBaseUrl(c.baseUrl || pr?.baseUrl || ''); setModel(c.model || pr?.model || '')
        if (pr?.fallback?.length) setModels(pr.fallback)
      }
      setApiKey(localStorage.getItem(LS.key) || '')
    } catch { /* 忽略 */ }
  }, [])

  const preset = SITE_PROVIDERS.find((x) => x.id === providerId)!
  const pickProvider = (id: string) => {
    const pr = SITE_PROVIDERS.find((x) => x.id === id)!
    setProviderId(id); setBaseUrl(pr.baseUrl); setModel(pr.model); setModels(pr.fallback); setFetchNote(null)
  }

  const pullModels = async () => {
    if (!baseUrl.trim()) { setFetchNote({ ok: false, text: '先填 Base URL' }); return }
    if (!apiKey.trim() && preset.style !== 'openai') { setFetchNote({ ok: false, text: '先填 API Key' }); return }
    setFetching(true); setFetchNote(null)
    try {
      const list = await fetchModelsBrowser(preset.style, baseUrl, apiKey)
      if (list.length) {
        setModels(list)
        if (!list.includes(model)) setModel(preset.model && list.includes(preset.model) ? preset.model : list[0])
        setFetchNote({ ok: true, text: `已拉取 ${list.length} 个模型` })
      } else {
        setModels(preset.fallback)
        setFetchNote({ ok: false, text: '返回空列表,已用常用清单,可手填' })
      }
    } catch {
      // 跨域/网络失败 → fallback,不阻塞使用
      setModels(preset.fallback)
      setFetchNote({ ok: false, text: '该服务商不支持浏览器直连列模型(跨域),已给常用清单,填 Key 后可直接生成或手填模型名' })
    } finally { setFetching(false) }
  }

  const canGo = p.topic.trim().length > 0

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(buildPrompt(p))
    setCopied(true); setTimeout(() => setCopied(false), 2500)
  }

  const run = async () => {
    if (!canGo || generating) return
    if (!baseUrl.trim() || !apiKey.trim() || !model.trim()) { setErr('先填服务商 Base URL / 模型 / API Key(只存你自己的浏览器)'); return }
    localStorage.setItem(LS.cfg, JSON.stringify({ providerId, baseUrl, model }))
    localStorage.setItem(LS.key, apiKey)
    setGenerating(true); setErr(''); setMarkdown('')
    const ac = new AbortController(); abortRef.current = ac
    let acc = ''
    try {
      await streamDirect({ style: preset.style, baseUrl, apiKey, model }, buildPrompt(p), (d) => { acc += d; setMarkdown(acc) }, ac.signal)
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setErr((e as Error).message)
    } finally { setGenerating(false); abortRef.current = null }
  }

  const han = (markdown.match(/[一-鿿]/g) || []).length

  return (
    <div>
      <Card>
        <div className="grid gap-x-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label}>主题 *</label>
            <textarea className={`${field} h-16 resize-none`} value={p.topic} onChange={set('topic')} placeholder="例:中小老板的第一笔 AI 预算该怎么花" />
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
            <textarea className={`${field} h-24 resize-y`} value={p.notes} onChange={set('notes')} placeholder="给得越具体,文章越可信。不给素材,AI 会写得克制并明说是行业观察,不会编造亲历。" />
          </div>
        </div>

        <div className="mt-7 flex gap-1.5">
          {([['prompt', '① 复制写作指令(零门槛)'], ['direct', '② 在这里直接生成(自带 Key)']] as const).map(([id, name]) => (
            <button key={id} onClick={() => setMode(id)} className={`rounded-full px-4 py-2 text-[0.78rem] font-semibold transition ${mode === id ? 'bg-fg text-canvas' : 'bg-subtle text-muted hover:text-fg'}`}>{name}</button>
          ))}
        </div>

        {mode === 'prompt' && (
          <div className="mt-5 rounded-xl2 border border-line bg-canvas/70 p-5">
            <p className="text-[0.84rem] leading-relaxed text-fg-soft">点击复制后,把整段指令粘贴给你常用的任何 AI(DeepSeek / Kimi / 豆包 / 元宝 / ChatGPT / Claude 都行),它就会按长信宪法给你成稿。<b className="text-fg">写作方法论已全部内嵌</b>:七段式、九条叙事原理、去 AI 味红线、交稿自审清单。成稿后回到「排版」tab 粘贴即可。</p>
            <button onClick={copyPrompt} disabled={!canGo} className="mt-4 rounded-[10px] bg-fg px-7 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40">{copied ? '✓ 已复制,去贴给你的 AI' : canGo ? '复制完整写作指令 →' : '先填主题'}</button>
            <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-faint">指令约 1500 字 · 生成后到「排版」tab 贴进去</p>
          </div>
        )}

        {mode === 'direct' && (
          <div className="mt-5 rounded-xl2 border border-line bg-canvas/70 p-5">
            <div className="rounded-[10px] border border-line bg-surface/60 px-3 py-2 text-[0.75rem] leading-relaxed text-muted">
              选服务商 → 填 API Key,模型会自动拉取(拉不到就用内置常用清单)。<b className="text-fg">你只管填 Key。</b>🆓 零成本先跑:智谱 GLM-Flash / 硅基流动 / OpenRouter :free 模型。
            </div>

            <label className={label}>服务商(点一下自动填好接口)</label>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {SITE_PROVIDERS.map((x) => (
                <button key={x.id} onClick={() => pickProvider(x.id)}
                  className={`rounded-[8px] border px-2 py-2 text-[0.74rem] font-semibold transition text-left ${providerId === x.id ? 'border-fg text-fg bg-surface' : 'border-line text-muted hover:border-line-strong'}`}>
                  {x.name}{x.free ? ' 🆓' : ''}{x.abroad ? <span className="text-[0.6rem] opacity-60"> 海外</span> : ''}
                </button>
              ))}
            </div>
            {(preset.free || preset.note) && (
              <p className="mt-2 text-[0.73rem] text-muted">
                {preset.free && <span className="text-[#248a3d]">🆓 {preset.free}。</span>}{preset.note}
                {preset.abroad && '。海外服务,需网络可达'}
              </p>
            )}

            <label className={label}>
              API Key(只存你的浏览器 localStorage,本站无后端、不上传)
              {preset.keyUrl && <a href={preset.keyUrl} target="_blank" rel="noreferrer" className="ml-2 font-semibold text-accent-hi">去申请 →</a>}
            </label>
            <input className={field} type="password" value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onBlur={() => { if (apiKey.trim().length > 8) pullModels() }}
              placeholder="sk-…(填完自动拉取模型)" />

            <label className={label}>
              模型
              <button onClick={pullModels} disabled={fetching} className="ml-2 font-semibold text-accent-hi disabled:opacity-50">{fetching ? '拉取中…' : '↻ 拉取模型列表'}</button>
            </label>
            {models.length > 0 ? (
              <select className={field} value={models.includes(model) ? model : ''} onChange={(e) => setModel(e.target.value)}>
                {!models.includes(model) && <option value="">{model ? `当前手填:${model}` : '请选择模型'}</option>}
                {models.map((m) => <option key={m} value={m}>{m}{m.endsWith(':free') ? ' 🆓' : ''}</option>)}
              </select>
            ) : (
              <input className={field} value={model} onChange={(e) => setModel(e.target.value)} placeholder={preset.model || '模型名'} />
            )}
            {models.length > 0 && (
              <input className={`${field} mt-1.5`} value={model} onChange={(e) => setModel(e.target.value)} placeholder="也可手动输入/修改模型名(如豆包接入点 ep-…)" />
            )}
            {fetchNote && <p className={`mt-1.5 text-[0.73rem] leading-relaxed ${fetchNote.ok ? 'text-[#248a3d]' : 'text-muted'}`}>{fetchNote.text}</p>}

            {providerId === 'custom' && (
              <>
                <label className={label}>Base URL</label>
                <input className={field} value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://你的中转站/v1" />
              </>
            )}

            <div className="mt-5 flex items-center gap-3">
              {generating ? (
                <button onClick={() => abortRef.current?.abort()} className="rounded-[10px] border border-line-strong bg-surface px-7 py-3 text-label font-semibold text-fg transition hover:border-fg">■ 停止</button>
              ) : (
                <button onClick={run} disabled={!canGo} className="rounded-[10px] bg-fg px-7 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40">开始成稿 →</button>
              )}
              {generating && <span className="font-mono text-[0.66rem] tracking-[0.1em] text-muted">流式生成中 · {han} 汉字…</span>}
            </div>
            {err && <p className="mt-3 rounded-[10px] bg-accent/5 p-3 text-[0.78rem] leading-relaxed text-accent-hi">{err}</p>}
          </div>
        )}
      </Card>

      {markdown.trim() && (
        <Card className="mt-6 !p-0 overflow-hidden">
          <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)} rows={16} className="w-full resize-y bg-transparent p-6 font-mono text-[0.82rem] leading-relaxed text-fg outline-none" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/60 px-6 py-4">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">{han} 汉字 · 这份稿子已贯穿三步,可直接编辑</span>
            <div className="flex gap-2.5">
              <button onClick={() => goTo('typeset')} className="rounded-[10px] bg-fg px-5 py-2.5 text-[0.8rem] font-semibold text-canvas transition hover:bg-accent hover:text-white">下一步:排版 →</button>
              <button onClick={() => goTo('score')} className="rounded-[10px] border border-line-strong bg-surface px-5 py-2.5 text-[0.8rem] font-semibold text-fg transition hover:border-fg">先评分 →</button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
