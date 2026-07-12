// 长信 · 启发式客观测量(浏览器版,与 skill/scripts/heuristics.mjs 同逻辑同口径)
// v2:并入汤质底座三组信号(坦诚自曝/立场判断/换范畴命名),见 tangzhi-narrative.md
export interface HeuristicsResult {
  title: string
  stats: Record<string, number | string | Record<string, boolean>>
  rule: Record<string, number>
  flags: string[]
}

const EMOTION_WORDS = ['焦虑', '后悔', '害怕', '崩溃', '心疼', '心动', '扎心', '委屈', '愤怒', '生气', '爽', '痛', '怕', '亏', '血亏', '烧光', '睡不着', '后背发凉', '惊', '居然', '竟然', '没想到', '救命', '离谱', '崩', '燃', '狠', '敢']
const CANDOR_WORDS = ['说实话', '坦白', '老实说', '说来惭愧', '我纠结', '我犹豫', '我怕', '我不确定', '我不懂', '我错', '我亏', '我没做到', '我失败', '交学费', '翻车', '踩坑', '搞砸', '返工', '我没跑通', '让我后背发凉']
const STANCE_WORDS = ['我不建议', '别买', '别学', '别急着', '劝你', '我反对', '别碰', '别找我', '不适合', '都先别', '别再', '我拒绝', '我的规矩', '坚决不']
const RECAT_HINTS = ['本质上', '说白了', '换句话说', '真正的问题', '我把它叫', '我称之为', '我管这叫']
const BUREAU_WORDS = ['首先', '其次', '再次', '最后,', '综上所述', '总而言之', '总之,']
const AI_SMELL = ['不仅仅是', '更是一种', '赋能', '抓手', '众所周知', '毋庸置疑', '值得注意的是', '不难发现', '让我们一起', '在这个快速发展的时代', '随着人工智能的发展']
const STORY_WORDS = ['那天', '那一刻', '去年', '前年', '上个月', '有一阵子', '后来', '直到', '当时', '一开始', '第一次', '突然']
const CONTRAST_WORDS = ['但', '却', '居然', '竟然', '别再', '才明白', '才想明白', '悟了', '错了', '反而', '相反', '真相是', '其实']
const CTA_WORDS = ['关注', '留言', '评论区', '回复', '加我', '预约', '点在看', '转发给', '收藏', '下一篇']
const JUDGE_WORDS = ['就是', '不是', '别', '才', '必须', '从来', '永远', '唯一', '本质']

const count = (text: string, words: string[]) => words.reduce((n, w) => n + text.split(w).length - 1, 0)
const clamp = (v: number, lo = 0, hi = 10) => Math.max(lo, Math.min(hi, v))
const r1 = (v: number) => Math.round(v * 10) / 10

export function analyze(raw: string): HeuristicsResult {
  let title = ''
  let body = raw
  if (raw.startsWith('---')) {
    const end = raw.indexOf('\n---', 3)
    if (end !== -1) {
      const fmBlock = raw.slice(4, end)
      const m = fmBlock.match(/^title\s*:\s*(.+)$/m)
      if (m) title = m[1].trim().replace(/^["']|["']$/g, '')
      body = raw.slice(raw.indexOf('\n', end + 1) + 1)
    }
  }
  const text = body.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '')
  const han = (text.match(/[一-鿿]/g) || []).length
  const per500 = (n: number) => (han ? (n / han) * 500 : 0)

  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !/^#/.test(p) && !/^[-*>]/.test(p))
  const paraLens = paras.map((p) => (p.match(/[一-鿿]/g) || []).length)
  const avgPara = paraLens.length ? paraLens.reduce((a, b) => a + b, 0) / paraLens.length : 0
  const longParaRatio = paraLens.length ? paraLens.filter((l) => l > 150).length / paraLens.length : 0
  const h2s = text.match(/^##\s+.+$/gm) || []
  const h2Gap = h2s.length ? han / h2s.length : han
  const listBlocks = (text.match(/(?:^[-*]\s.+\n?)+/gm) || []).length

  const numbers = (text.match(/\d+(?:\.\d+)?%?|[一二三四五六七八九十百千万亿]{1,3}(?:多|几)?(?:个|条|步|次|年|天|小时|万|块|篇|种|家|倍)/g) || []).length
  const youCnt = count(text, ['你'])
  const iCnt = count(text, ['我'])
  const questions = (text.match(/[?？]/g) || []).length
  const emotionHits = count(text, EMOTION_WORDS)
  const bureauHits = count(text, BUREAU_WORDS)
  const aiSmellHits = count(text, AI_SMELL)
  const storyHits = count(text, STORY_WORDS)
  const quoteHits = (text.match(/[「“][^」”]{2,40}[」”]/g) || []).length
  const exampleHits = count(text, ['比如', '例如', '举个', '举例'])
  const candorHits = count(text, CANDOR_WORDS)
  const stanceHits = count(text, STANCE_WORDS)
  const recatHits = (text.match(/不是[^。;;\n]{1,16}[,,](而?是|问题是)/g) || []).length
    + count(text, RECAT_HINTS)
    + Math.min(3, (text.match(/[「][^」]{2,8}[」]/g) || []).length)

  const golden = paras.filter((p) => {
    const l = (p.match(/[一-鿿]/g) || []).length
    return l >= 8 && l <= 40 && JUDGE_WORDS.some((w) => p.includes(w))
  }).length

  const head = text.replace(/^#.+\n/, '').trim().slice(0, 120)
  const hookSignals = {
    hasNumber: /\d/.test(head),
    hasContrast: CONTRAST_WORDS.some((w) => head.includes(w)),
    hasQuestion: /[?？]/.test(head),
    hasI: head.includes('我'),
  }
  const hookScore = clamp(2 + (hookSignals.hasNumber ? 2 : 0) + (hookSignals.hasContrast ? 3 : 0) + (hookSignals.hasQuestion ? 1.5 : 0) + (hookSignals.hasI ? 1.5 : 0))

  const titleLen = title.length
  const titleScore = title
    ? clamp((titleLen <= 30 ? 4 : titleLen <= 40 ? 2 : 0) + (/\d|[一二三四五六七八九十]/.test(title) ? 2 : 0) + (CONTRAST_WORDS.some((w) => title.includes(w)) ? 3 : 0) + (title.includes(':') || title.includes(':') ? 1 : 0))
    : 0

  const tail = text.slice(Math.floor(text.length * 0.85))
  const ctaHits = count(tail, CTA_WORDS)

  const stats = {
    hanChars: han, paraCount: paras.length, avgParaLen: r1(avgPara), longParaRatio: r1(longParaRatio),
    h2Count: h2s.length, hanPerH2: Math.round(h2Gap), listBlocks,
    numbersPer500: r1(per500(numbers)), youPer500: r1(per500(youCnt)), iPer500: r1(per500(iCnt)),
    questions, emotionHits, storyHits, quoteHits, exampleHits, goldenCandidates: golden,
    candorHits, stanceHits, recatHits,
    bureauHits, aiSmellHits, ctaHitsInTail: ctaHits, titleLen, hookSignals,
  }

  const rule: Record<string, number> = {
    spread: clamp(titleScore * 0.35 + hookScore * 0.25 + clamp(golden * 2) * 0.2 + clamp(stanceHits * 2.5) * 0.2),
    emotion: clamp(clamp(per500(emotionHits) * 3) * 0.5 + clamp(per500(youCnt) * 1.2) * 0.3 + clamp(questions * 1.2) * 0.2),
    story: clamp(clamp(per500(storyHits) * 4) * 0.35 + clamp(quoteHits * 2.5) * 0.15 + clamp(per500(iCnt) * 0.8) * 0.2 + clamp(candorHits * 2.2) * 0.3),
    info: clamp(clamp(per500(numbers) * 1.6) * 0.45 + clamp(exampleHits * 2) * 0.25 + clamp(recatHits * 2.2) * 0.3),
    value: clamp(clamp(per500(numbers) * 1.4) * 0.5 + clamp(golden * 1.6) * 0.3 + clamp(exampleHits * 1.5) * 0.2),
    structure: clamp((avgPara <= 90 ? 4 : avgPara <= 130 ? 2.5 : 1) + (longParaRatio < 0.1 ? 2 : longParaRatio < 0.25 ? 1 : 0) + (h2Gap >= 250 && h2Gap <= 700 ? 3 : h2s.length ? 1.5 : 0) + (listBlocks <= 2 ? 1 : 0)),
    framework: clamp((h2s.length >= 4 ? 3 : h2s.length >= 2 ? 1.5 : 0) + (han >= 2500 && han <= 6000 ? 3 : han >= 1500 ? 1.5 : 0) + (ctaHits ? 2 : 0) + (hookScore >= 5 ? 2 : 0)),
    acquisition: clamp(clamp(per500(iCnt) * 0.9) * 0.25 + clamp(storyHits * 0.8) * 0.2 + clamp(golden * 1.2) * 0.2 + clamp(candorHits * 2) * 0.2 + clamp(stanceHits * 2) * 0.15),
    cta: clamp(ctaHits >= 2 ? 8 : ctaHits === 1 ? 6 : 1),
  }
  for (const k of Object.keys(rule)) rule[k] = r1(rule[k])

  const flags: string[] = []
  if (bureauHits > 0) flags.push(`八股结构词 ${bureauHits} 处(首先/其次/最后…)`)
  if (aiSmellHits > 0) flags.push(`AI 味用语 ${aiSmellHits} 处(不仅仅是/赋能/众所周知…)`)
  if (longParaRatio > 0.2) flags.push(`超长段占比 ${(longParaRatio * 100).toFixed(0)}%,手机上压屏`)
  if (!h2s.length && han > 1200) flags.push('全文无小标题')
  if (!ctaHits) flags.push('文末没有可识别的 CTA/互动引导')
  if (titleLen > 30) flags.push(`标题 ${titleLen} 字偏长(建议 ≤30)`)
  if (han < 2500) flags.push(`正文 ${han} 字,低于信任长文下限 3000`)
  if (candorHits === 0 && han > 2000) flags.push('无一处朝向自己的坦诚(自曝踩坑/"我不确定")——信任浓度最高的信号缺失')
  if (stanceHits === 0 && han > 2000) flags.push('无立场判断句(不建议/别急着/别碰…)——全文可能都在读者预期之内')

  return { title, stats, rule, flags }
}

export const DIM_META: { key: string; label: string; weight: number }[] = [
  { key: 'spread', label: '传播性', weight: 12 },
  { key: 'emotion', label: '情绪共鸣', weight: 11 },
  { key: 'story', label: '讲故事', weight: 10 },
  { key: 'info', label: '信息增量', weight: 13 },
  { key: 'value', label: '价值量', weight: 11 },
  { key: 'structure', label: '结构', weight: 9 },
  { key: 'framework', label: '文章框架', weight: 9 },
  { key: 'acquisition', label: '获取客户', weight: 13 },
  { key: 'cta', label: '引流程度', weight: 12 },
]

export function ruleTotal(rule: Record<string, number>): number {
  return Math.round(DIM_META.reduce((s, d) => s + ((rule[d.key] || 0) / 10) * d.weight, 0))
}
