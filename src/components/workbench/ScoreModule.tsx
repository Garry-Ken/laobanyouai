import { useState } from 'react'
import { Ruler, SectionHeading, Card, Chip } from '../ui'
import { analyze, ruleTotal, DIM_META, type HeuristicsResult } from '../../lib/heuristics'

const DIM_DESC: Record<string, string> = {
  spread: '标题钩子 + 打破读者预期的判断——全文都在预期之内,你就沦为读者心理剧场的群演。',
  emotion: '痛点场景具体到对话与金额,让目标读者"这说的就是我"。',
  story: '张力→转折→兑现,带"超出舒适度的坦诚"——细节颗粒度是伪造不出来的流露。',
  info: '给新信息只是及格,给旧问题换范畴并命名才是增量——不是没逻辑,而是没概念。',
  value: '读完能带走什么:可上手的方法、判断标准、干货密度。',
  structure: '手机屏上的阅读节奏:段落长度、小标题间隔、扫读友好。',
  framework: '宏观骨架:钩子→痛点→认知重构→方法论→案例→边界→收束,配一个贯穿全文的核心隐喻。',
  acquisition: '信任四支柱 + 敢说"这事别找我"——冒犯朝向自己,善意才对准读者。',
  cta: '下一步动作清不清楚:唯一 CTA、低门槛、承接全文立场、不赤裸谈利害。',
}

const PRINCIPLES: { t: string; d: string }[] = [
  { t: '为解释而写', d: '你写的 ≠ 读者解出来的。每段问一句:目标读者会把这段解释成什么?' },
  { t: '语境先行', d: '开头三行既是钩子,也在回答"你是谁、凭什么说"——语境决定后文每句怎么被解读。' },
  { t: '流露 > 给予', d: '读者只信漏出来的:时间、金额、犹豫、失败过程。自我标榜天然被打折。' },
  { t: '关系先于内容', d: '评价一件事 = 建构你我关系。敢下判断不是文风,是与读者确立关系的动作。' },
  { t: '打破预期,顺应张力', d: '符合预期 = 群演;敢说同行不说的话,读者才把你当"人"看。' },
  { t: '不舒服的坦诚', d: '冒犯朝向自己(自曝短处/说"别找我"),善意就对准了读者。说服是生理级的。' },
  { t: '换范畴,并命名', d: '改变观念不靠堆论据,靠给旧问题一个新范畴,再起一个带得走的名字。' },
  { t: '一个核心隐喻', d: '"逝者如斯夫"让时间秒懂。一个贯穿全文的结构类比,抵一千字解释。' },
  { t: '流畅是强准备', d: '"张嘴就来"是即时性错觉。内容力 = 写前备足的证据、数字与案例密度。' },
]

function ScoreBar({ label, weight, score }: { label: string; weight: number; score: number }) {
  return (
    <div className="grid grid-cols-[6.5em_3em_1fr_2.6em] items-center gap-3">
      <span className="text-label font-semibold text-fg">{label}</span>
      <span className="font-mono text-[0.62rem] tracking-[0.1em] text-faint">{weight}分权</span>
      <div className="h-[8px] overflow-hidden rounded-full bg-subtle">
        <div className="h-full rounded-full bg-accent transition-all duration-700 ease-spring" style={{ width: `${Math.max(4, score * 10)}%` }} />
      </div>
      <span className="text-right font-mono text-[0.8rem] font-bold text-fg">{score}</span>
    </div>
  )
}

interface Props { markdown: string; setMarkdown: (v: string) => void; goTo: (t: 'write' | 'typeset' | 'score') => void }

export default function ScoreModule({ markdown, setMarkdown }: Props) {
  const [r, setR] = useState<HeuristicsResult | null>(null)
  const run = () => { if (markdown.trim()) setR(analyze(markdown)) }
  const total = r ? ruleTotal(r.rule) : 0

  return (
    <div>
      <Card className="!p-0 overflow-hidden">
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          rows={12}
          placeholder={'从「写作」/「排版」tab 带来的稿子会显示在这里,可直接改。\n\n也可以粘贴任意文章(Markdown 或纯文本)。带标题就用「# 标题」,标题也会被评。\n\n所有计算都在你的浏览器里完成,文章不上传。'}
          className="w-full resize-y bg-transparent p-6 font-mono text-[0.85rem] leading-relaxed text-fg outline-none placeholder:text-faint"
        />
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/60 px-6 py-4">
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">{markdown ? `${(markdown.match(/[一-鿿]/g) || []).length} 汉字` : '等待稿子'}</span>
          <button onClick={run} disabled={!markdown.trim()} className="rounded-[10px] bg-fg px-8 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40">开始评分 →</button>
        </div>
      </Card>

      {r && (
        <Card className="mt-6">
          <div className="flex flex-wrap items-end gap-5">
            <span className="font-display text-[3.4rem] font-extrabold leading-none text-fg">{total}</span>
            <div className="pb-1.5">
              <Chip>{total >= 88 ? 'S · 结构面很硬' : total >= 80 ? 'A · 客观面达标' : total >= 70 ? 'B · 有明确提升点' : 'C · 先按旗标改'}</Chip>
              <p className="mt-2 max-w-md text-[0.78rem] leading-relaxed text-muted">这是<b>规则分</b>:只测客观信号(结构/密度/钩子/CTA)。信息增量、获客信任这类判断维度,规则天然保守——完整的 LLM 九维深评在本地版长信里,免费。</p>
            </div>
          </div>
          <div className="mt-8 grid gap-3.5">
            {DIM_META.map((d) => <ScoreBar key={d.key} label={d.label} weight={d.weight} score={r.rule[d.key] ?? 0} />)}
          </div>
          <div className="mt-7 rounded-xl2 border border-line bg-canvas/70 p-4">
            <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">信任信号(叙事底座探测)</p>
            <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-1.5 text-[0.82rem] text-fg-soft">
              <span>朝向自己的坦诚 <b className="text-fg">{Number(r.stats.candorHits) || 0}</b> 处</span>
              <span>立场判断句 <b className="text-fg">{Number(r.stats.stanceHits) || 0}</b> 处</span>
              <span>换范畴/命名 <b className="text-fg">{Number(r.stats.recatHits) || 0}</b> 处</span>
              <span>金句候选 <b className="text-fg">{Number(r.stats.goldenCandidates) || 0}</b> 处</span>
            </div>
          </div>
          {r.flags.length > 0 && (
            <div className="mt-5 rounded-xl2 border border-line-strong bg-canvas p-5">
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent-hi">旗标 / 每条都可直接动手改</p>
              <ul className="mt-3 grid gap-1.5">{r.flags.map((f, i) => <li key={i} className="text-label text-fg-soft">— {f}</li>)}</ul>
            </div>
          )}
        </Card>
      )}

      {/* 九维说明 */}
      <div className="mt-16">
        <Ruler idx="—" name="Nine Dimensions" tick="权重合计 100" />
        <div className="mt-8">
          <SectionHeading title="九个维度,三种能力" desc="传播力(传播性/情绪共鸣/讲故事)让文章被看到;内容力(信息增量/价值量/结构/框架)让读者留下来;转化力(获取客户/引流程度)让信任变成生意。口径融合了高星内容项目、《疯传》STEPPS、《让创意更有黏性》SUCCESs,以及对汤质《关于说话的一切》一手文稿的蒸馏。" />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIM_META.map((d) => (
            <Card key={d.key} className="!p-6">
              <div className="flex items-baseline justify-between"><b className="text-[1rem] text-fg">{d.label}</b><span className="font-mono text-[0.62rem] tracking-[0.12em] text-faint">{d.weight} / 100</span></div>
              <p className="mt-2.5 text-[0.82rem] leading-relaxed text-muted">{DIM_DESC[d.key]}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* 叙事底座 */}
      <div className="mt-16">
        <Ruler idx="—" name="Narrative Base" tick="九条原理" />
        <div className="mt-8">
          <SectionHeading eyebrow="评分背后的功夫" title="好文章不靠技巧,靠这九条底层原理" desc="蒸馏自 B 站知识区 UP 主汤质(《关于说话的一切》作者)的一手文稿——意义、关系、洞见与隐喻四篇,近三万字逐字读完提炼,再对照传播学经典校准。评分器的「信任信号」探测就来自这里。" />
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <Card key={p.t} className="!p-5">
              <div className="flex items-baseline gap-2.5"><span className="font-mono text-[0.66rem] tracking-[0.1em] text-accent">{String(i + 1).padStart(2, '0')}</span><b className="text-[0.94rem] text-fg">{p.t}</b></div>
              <p className="mt-2 text-[0.8rem] leading-relaxed text-muted">{p.d}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
