import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Section, Ruler, SectionHeading, Card, Chip, PrimaryLink, GhostLink, WeChatCTA } from '../components/ui'
import { analyze, ruleTotal, DIM_META, type HeuristicsResult } from '../lib/heuristics'

/** 九维口径速览(与长信 scoring.md 同源,这里只放一句话版) */
const DIM_DESC: Record<string, string> = {
  spread: '标题钩子、开头停留力、金句可截图性——读者愿不愿意转发。',
  emotion: '痛点场景具体到对话与金额,让目标读者"这说的就是我"。',
  story: '论点是讲出来的还是列出来的:张力 → 转折 → 兑现。',
  info: '读者本来不知道的东西有多少,搬运常识等于零增量。',
  value: '读完能带走什么:可上手的方法、判断标准、干货密度。',
  structure: '手机屏上的阅读节奏:段落长度、小标题间隔、扫读友好。',
  framework: '宏观骨架:钩子→痛点→认知重构→方法论→案例→边界→收束。',
  acquisition: '高客单信任:敢说边界、体系有命名、真实经历可验证。',
  cta: '下一步动作清不清楚:唯一 CTA、低门槛、承接全文立场。',
}

const GITHUB = 'https://github.com/Garry-Ken/changxin'

function ScoreBar({ label, weight, score }: { label: string; weight: number; score: number }) {
  return (
    <div className="grid grid-cols-[6.5em_3em_1fr_2.6em] items-center gap-3">
      <span className="text-label font-semibold text-fg">{label}</span>
      <span className="font-mono text-[0.62rem] tracking-[0.1em] text-faint">{weight}分权</span>
      <div className="h-[8px] overflow-hidden rounded-full bg-subtle">
        <div
          className="h-full rounded-full bg-accent transition-all duration-700 ease-spring"
          style={{ width: `${Math.max(4, score * 10)}%` }}
        />
      </div>
      <span className="text-right font-mono text-[0.8rem] font-bold text-fg">{score}</span>
    </div>
  )
}

export default function Score() {
  const [input, setInput] = useState('')
  const [r, setR] = useState<HeuristicsResult | null>(null)

  const run = () => {
    if (!input.trim()) return
    setR(analyze(input))
  }

  const total = r ? ruleTotal(r.rule) : 0

  return (
    <Layout current="/score.html">
      {/* 工具区 */}
      <Section className="pt-16 sm:pt-20">
        <Chip pulse>免费工具 · 浏览器本地计算 · 文章不上传</Chip>
        <div className="mt-6">
          <SectionHeading
            eyebrow="Article Score / 长文评分"
            title="你的公众号长文,值几分?"
            desc="粘贴文章,10 秒拿到九维客观测量:钩子强度、干货密度、结构节奏、CTA 设计……每一条旗标都是一处可动手的修改。评分口径来自「长信」信任长文方法论。"
          />
        </div>

        <Card className="mt-10 !p-0 overflow-hidden">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            placeholder={'把整篇文章(Markdown 或纯文本)粘贴到这里。\n\n带标题的写法:第一行用「# 你的标题」,标题也会被评。\n\n所有计算都在你的浏览器里完成,文章不会被上传到任何服务器。'}
            className="w-full resize-y bg-transparent p-6 font-mono text-[0.85rem] leading-relaxed text-fg outline-none placeholder:text-faint"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-canvas/60 px-6 py-4">
            <span className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
              {input ? `${(input.match(/[一-鿿]/g) || []).length} 汉字` : '等待粘贴'}
            </span>
            <button
              onClick={run}
              disabled={!input.trim()}
              className="rounded-[10px] bg-fg px-8 py-3 text-label font-semibold text-canvas shadow-[inset_0_1px_0_rgba(255,255,255,.16),0_1px_3px_rgba(23,22,15,.3)] transition hover:bg-accent hover:text-white active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-40"
            >
              开始评分 →
            </button>
          </div>
        </Card>

        {r && (
          <Card className="mt-6">
            <div className="flex flex-wrap items-end gap-5">
              <span className="font-display text-[3.4rem] font-extrabold leading-none text-fg">{total}</span>
              <div className="pb-1.5">
                <Chip>{total >= 88 ? 'S · 结构面很硬' : total >= 80 ? 'A · 客观面达标' : total >= 70 ? 'B · 有明确提升点' : 'C · 先按旗标改'}</Chip>
                <p className="mt-2 max-w-md text-[0.78rem] leading-relaxed text-muted">
                  这是<b>规则分</b>:只测客观信号(结构/密度/钩子/CTA)。信息增量、获客信任这类判断维度,规则天然保守——完整的 LLM 九维深评在本地版长信里,免费。
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3.5">
              {DIM_META.map((d) => (
                <ScoreBar key={d.key} label={d.label} weight={d.weight} score={r.rule[d.key] ?? 0} />
              ))}
            </div>

            {r.flags.length > 0 && (
              <div className="mt-8 rounded-xl2 border border-line-strong bg-canvas p-5">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-accent-hi">旗标 / 每条都可直接动手改</p>
                <ul className="mt-3 grid gap-1.5">
                  {r.flags.map((f, i) => (
                    <li key={i} className="text-label text-fg-soft">— {f}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}
      </Section>

      {/* 九维说明 */}
      <Section className="mt-20">
        <Ruler idx="02" name="Nine Dimensions" tick="权重合计 100" />
        <div className="mt-8">
          <SectionHeading
            title="九个维度,三种能力"
            desc="传播力(传播性/情绪共鸣/讲故事)让文章被看到;内容力(信息增量/价值量/结构/框架)让读者留下来;转化力(获取客户/引流程度)让信任变成生意。口径融合了高星内容项目与《疯传》STEPPS、《让创意更有黏性》SUCCESs。"
          />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DIM_META.map((d) => (
            <Card key={d.key} className="!p-6">
              <div className="flex items-baseline justify-between">
                <b className="text-[1rem] text-fg">{d.label}</b>
                <span className="font-mono text-[0.62rem] tracking-[0.12em] text-faint">{d.weight} / 100</span>
              </div>
              <p className="mt-2.5 text-[0.82rem] leading-relaxed text-muted">{DIM_DESC[d.key]}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* 长信产品区 */}
      <Section className="mt-20">
        <Ruler idx="03" name="Changxin / 长信" tick="MIT 开源" />
        <div className="mt-8">
          <SectionHeading
            eyebrow="这个评分器从哪来"
            title="长信:公众号信任长文,从主题到草稿箱一条龙"
            desc="输入主题 → 按「信任长文方法论」自动成稿(3000–5000 字)→ 11 套主题排版 → 九维评分自审 → 直进公众号草稿箱。写作宪法、人设证据库、评分口径全部开放微调。"
          />
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          <Card>
            <Chip>Agent Skill</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">装进 Claude Code / Codex / 任意 agent,宿主模型写作,<b className="text-fg">零 API Key</b>。写完自动评分,低于 80 分自己改。</p>
          </Card>
          <Card>
            <Chip>Web 工作台</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">图形界面:流式成稿、11 主题实时预览、一键进草稿箱;内置 14 家模型服务商,填 Key 自动拉模型列表,含免费选项。</p>
          </Card>
          <Card>
            <Chip>命令行</Chip>
            <p className="mt-4 text-label leading-relaxed text-fg-soft">脚本党友好:<span className="kbd">publish.mjs</span> 排版推送、<span className="kbd">heuristics.mjs</span> 客观测量,接进你自己的流水线。</p>
          </Card>
        </div>
        <div className="mt-9 flex flex-wrap gap-4">
          <PrimaryLink href={GITHUB}>GitHub 开源仓库</PrimaryLink>
          <GhostLink href={`${GITHUB}#快速开始web-工作台`}>三分钟装好</GhostLink>
        </div>
      </Section>

      {/* 转化 */}
      <Section className="mt-24">
        <WeChatCTA title="想让 AI 替你把「写长文建信任」这条线跑起来?" />
      </Section>
    </Layout>
  )
}
