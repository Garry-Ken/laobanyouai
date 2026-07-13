// 长文写作页共享逻辑:写作指令组装 + 浏览器直连流式成稿
// 指令内容与开源长信(Garry-Ken/changxin)的 methodology/tangzhi-narrative 同源精简版。

export interface WriteParams {
  topic: string
  keywords?: string
  audience?: string
  words?: string
  notes?: string
  who?: string      // 简版人设:我是谁
  reader?: string   // 写给谁
  offer?: string    // 产品/CTA 指向
}

export function buildPrompt(p: WriteParams): string {
  return `你是「长信」,一个公众号高客单信任长文写手。严格按下面的宪法写作,违反诚实红线则整篇作废重写。

# 信任长文七段式(3000–5000 汉字)
① 钩子开头(~5%):认知差或结果前置,3 行内让目标读者停下,绝不铺垫背景
② 痛点共鸣(~10%):写到具体场景与对话级,让读者"这说的就是我"
③ 认知重构(~20%):先点破读者现在用的旧范畴,再给新范畴并**命名**;敢下判断
④ 方法论(~25%):给有名字的框架,可操作,有判断标准;一个核心隐喻贯穿全文
⑤ 真实案例(~20%):第一人称,带数字与颗粒度细节;没有素材就用行业观察但明说
⑥ 边界与反面(~10%,不可省):什么情况不适用、什么人别用这招——冒犯朝向自己的坦诚
⑦ 立场收束+软CTA(~10%):一段立得住的话收尾;CTA 唯一、给"下一步"而非成交

# 九条叙事原理(写与自查都对照)
1 为解释而写:每段问"读者会把这段解释成什么",不是"我表达了什么"
2 语境先行:开头三行同时回答"你是谁、凭什么说"
3 流露>给予:细节(时间/金额/犹豫/失败)才可信,自我标榜天然被打折
4 关系先于内容:敢下判断是与读者确立关系的动作,四平八稳=拒绝建立关系
5 打破预期:全文都在读者预期内=沦为他心理剧场的群演
6 不舒服的坦诚:自曝短处、说"这事别找我",信任浓度最高
7 换范畴并命名:改变观念靠新范畴+能带走的名字,不靠堆论据
8 一个核心隐喻:贯穿全文的结构类比抵一千字解释,散装比喻不如一个用到底
9 流畅是强准备:证据、数字、案例先备足再写

# 文风红线
第一人称有立场;单段≤4行;每300–500字一个小标题(##);禁"首先/其次/最后"八股;禁排比堆砌;禁"赋能/抓手"黑话;每个抽象论点后必须跟具体的东西(数字/场景/对话);金句全文2–3处;连续列表不超过2组。

# 诚实红线(最高优先级)
案例与数字**只能来自下面提供的素材**;没有的就不写或用行业观察并明说;不虚构客户故事、收入数字、聊天记录;不确定的数字写"约"或删掉;标题承诺的正文必须兑现。

# 本次任务
${p.who ? `作者人设:${p.who}` : '作者人设:一位有实操经验的从业者(素材不足时写得克制)'}
${p.reader ? `目标读者:${p.reader}` : ''}
${p.offer ? `最终转化指向(只在文末软引导,不报价不硬推):${p.offer}` : '无明确产品:文末 CTA 只做"关注+留言聊你的场景"'}
主题:${p.topic}
${p.keywords ? `关键词:${p.keywords}` : ''}
${p.audience ? `补充人群信息:${p.audience}` : ''}
${p.notes ? `真实素材(案例只能取自这里):\n${p.notes}` : '(未提供素材:案例一律用"行业常见情形"表述并明说,不得写成亲历)'}
目标字数:${p.words || '3500–4500'} 汉字

# 交稿前自审(逐条过,过不了就地改)
钩子3行内有停留理由 / 每500字至少一个数字或场景 / ⑥边界段在且敢说"不" / 无八股无排比无空洞总结 / 至少一处朝向自己的坦诚 / 至少一处"不是X,是Y"的范畴重构 / CTA唯一且在文末

# 输出格式(直接输出成品,不要解释过程)
第一行开始就是 markdown,frontmatter 必带:
---
title: (5个候选里最强的,≤30字,认知差+具体数字)
digest: (≤100字:一句认知差+一句读完得到什么)
---
正文(不要重复标题,直接从钩子开头)。文末用 HTML 注释附另外 4 个候选标题。`
}

// ── 浏览器直连(BYO key,key 只存访客本机 localStorage)────────────────
export interface DirectCfg { style: 'openai' | 'anthropic'; baseUrl: string; apiKey: string; model: string }

export interface SiteProvider {
  id: string
  name: string
  style: 'openai' | 'anthropic'
  baseUrl: string
  model: string
  keyUrl?: string           // 去哪申请 Key
  free?: string             // 免费说明(有就显示 🆓)
  abroad?: boolean          // 海外,国内需网络可达
  fallback: string[]        // 浏览器拉不到模型列表时的常用兜底清单
  note: string
}

// 国内主流全覆盖 + 海外。浏览器直连拉模型:能拉到用真实列表,拉不到(跨域)用 fallback。
export const SITE_PROVIDERS: SiteProvider[] = [
  { id: 'deepseek', name: 'DeepSeek', style: 'openai', baseUrl: 'https://api.deepseek.com', model: 'deepseek-chat', keyUrl: 'https://platform.deepseek.com/api_keys', fallback: ['deepseek-chat', 'deepseek-reasoner'], note: '国内主流,便宜量大' },
  { id: 'zhipu', name: '智谱 GLM', style: 'openai', baseUrl: 'https://open.bigmodel.cn/api/paas/v4', model: 'glm-4.5-flash', keyUrl: 'https://open.bigmodel.cn/usercenter/apikeys', free: 'GLM-Flash 系列长期免费', fallback: ['glm-4.6', 'glm-4.5', 'glm-4.5-air', 'glm-4.5-flash', 'glm-4-flash'], note: '国内直连' },
  { id: 'siliconflow', name: '硅基流动', style: 'openai', baseUrl: 'https://api.siliconflow.cn/v1', model: 'deepseek-ai/DeepSeek-V3.1', keyUrl: 'https://cloud.siliconflow.cn/account/ak', free: '注册送额度,多款小模型免费', fallback: ['deepseek-ai/DeepSeek-V3.1', 'Qwen/Qwen3-8B', 'Qwen/Qwen2.5-7B-Instruct', 'THUDM/glm-4-9b-chat'], note: '聚合多家,浏览器直连友好' },
  { id: 'moonshot', name: 'Kimi 月之暗面', style: 'openai', baseUrl: 'https://api.moonshot.cn/v1', model: 'kimi-latest', keyUrl: 'https://platform.moonshot.cn/console/api-keys', fallback: ['kimi-k2-0905-preview', 'kimi-latest', 'moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'], note: '长文能力强' },
  { id: 'qwen', name: '通义千问/百炼', style: 'openai', baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus', keyUrl: 'https://bailian.console.aliyun.com/?apiKey=1', free: '新用户各模型有免费额度', fallback: ['qwen-plus', 'qwen-max', 'qwen-turbo', 'qwen-long'], note: '阿里,稳定' },
  { id: 'doubao', name: '火山方舟 豆包', style: 'openai', baseUrl: 'https://ark.cn-beijing.volces.com/api/v3', model: '', keyUrl: 'https://console.volcengine.com/ark', fallback: ['doubao-seed-1-6-250615', 'doubao-seed-1-6-flash-250615', 'doubao-1-5-pro-32k-250115'], note: '豆包用「接入点/模型名」以控制台为准,建议填 Key 后拉取或手填' },
  { id: 'hunyuan', name: '腾讯混元', style: 'openai', baseUrl: 'https://api.hunyuan.cloud.tencent.com/v1', model: 'hunyuan-turbos-latest', keyUrl: 'https://console.cloud.tencent.com/hunyuan/api-key', fallback: ['hunyuan-turbos-latest', 'hunyuan-large', 'hunyuan-standard'], note: '腾讯' },
  { id: 'minimax', name: 'MiniMax', style: 'openai', baseUrl: 'https://api.minimaxi.com/v1', model: 'MiniMax-Text-01', keyUrl: 'https://platform.minimaxi.com/user-center/basic-information/interface-key', fallback: ['MiniMax-Text-01', 'abab6.5s-chat'], note: '模型名以控制台为准' },
  { id: 'stepfun', name: '阶跃星辰', style: 'openai', baseUrl: 'https://api.stepfun.com/v1', model: 'step-2-16k', keyUrl: 'https://platform.stepfun.com/interface-key', fallback: ['step-2-16k', 'step-2-mini', 'step-1-8k'], note: '阶跃' },
  { id: 'qianfan', name: '百度千帆', style: 'openai', baseUrl: 'https://qianfan.baidubce.com/v2', model: 'ernie-4.5-turbo-128k', keyUrl: 'https://console.bce.baidu.com/iam/#/iam/apikey/list', fallback: ['ernie-4.5-turbo-128k', 'ernie-x1-turbo-32k', 'ernie-speed-128k'], note: '文心一言' },
  { id: 'openrouter', name: 'OpenRouter', style: 'openai', baseUrl: 'https://openrouter.ai/api/v1', model: 'deepseek/deepseek-chat-v3.1', keyUrl: 'https://openrouter.ai/keys', free: 'id 以 :free 结尾的模型免费', abroad: true, fallback: ['deepseek/deepseek-chat-v3.1', 'deepseek/deepseek-chat-v3.1:free', 'meta-llama/llama-3.3-70b-instruct:free'], note: '聚合海外,浏览器直连友好' },
  { id: 'gemini', name: 'Google Gemini', style: 'openai', baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash', keyUrl: 'https://aistudio.google.com/apikey', free: 'AI Studio 免费额度', abroad: true, fallback: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'], note: '免费额度大' },
  { id: 'groq', name: 'Groq', style: 'openai', baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', keyUrl: 'https://console.groq.com/keys', free: '免费额度大,速度极快', abroad: true, fallback: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'], note: '极速' },
  { id: 'anthropic', name: 'Claude 官方', style: 'anthropic', baseUrl: 'https://api.anthropic.com', model: 'claude-sonnet-5', keyUrl: 'https://console.anthropic.com/settings/keys', abroad: true, fallback: ['claude-sonnet-5', 'claude-opus-4-8', 'claude-haiku-4-5'], note: '长文质量首选' },
  { id: 'openai', name: 'OpenAI', style: 'openai', baseUrl: 'https://api.openai.com/v1', model: 'gpt-5.2', keyUrl: 'https://platform.openai.com/api-keys', abroad: true, fallback: ['gpt-5.2', 'gpt-5.2-mini'], note: '' },
  { id: 'custom', name: '中转站/自定义', style: 'openai', baseUrl: '', model: '', fallback: [], note: '任何 OpenAI 兼容中转(one-api/new-api 等,通常开了浏览器直连,国内最稳)' },
]

/**
 * 浏览器直连拉取模型列表。纯静态站无后端,直连服务商 /models。
 * 部分国内厂商的 /models 不开 CORS,会抛错 → 上层用 fallback 兜底。
 */
export async function fetchModelsBrowser(style: 'openai' | 'anthropic', baseUrl: string, apiKey: string): Promise<string[]> {
  const base = baseUrl.replace(/\/+$/, '')
  let res: Response
  if (style === 'anthropic') {
    res = await fetch(`${base}/v1/models?limit=200`, {
      headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
    })
  } else {
    res = await fetch(`${base}/models`, { headers: apiKey ? { authorization: `Bearer ${apiKey}` } : {} })
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const j = await res.json()
  const ids = (j.data || j.models || [])
    .map((m: unknown) => (typeof m === 'string' ? m : ((m as { id?: string; name?: string }).id || (m as { name?: string }).name)))
    .filter((x: unknown): x is string => Boolean(x))
  return [...new Set<string>(ids)].sort()
}

export async function streamDirect(
  cfg: DirectCfg,
  prompt: string,
  onDelta: (t: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  let res: Response
  try {
    if (cfg.style === 'anthropic') {
      res = await fetch(`${cfg.baseUrl.replace(/\/+$/, '')}/v1/messages`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': cfg.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model: cfg.model, max_tokens: 16000, stream: true, messages: [{ role: 'user', content: prompt }] }),
        signal,
      })
    } else {
      res = await fetch(`${cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` },
        body: JSON.stringify({ model: cfg.model, stream: true, messages: [{ role: 'user', content: prompt }] }),
        signal,
      })
    }
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new Error('浏览器直连失败(该服务商未开 CORS 或网络不可达)。换「中转站/自定义」或 Gemini/OpenRouter,或改用上面的「复制写作指令」模式。')
  }
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`服务商返回 HTTP ${res.status}:${t.slice(0, 200)}`)
  }
  const reader = res.body!.getReader()
  const dec = new TextDecoder()
  let buf = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buf += dec.decode(value, { stream: true })
    const lines = buf.split('\n')
    buf = lines.pop() || ''
    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (!payload || payload === '[DONE]') continue
      try {
        const j = JSON.parse(payload)
        const delta = cfg.style === 'anthropic'
          ? (j.type === 'content_block_delta' ? j.delta?.text || '' : '')
          : (j.choices?.[0]?.delta?.content || '')
        if (delta) onDelta(delta)
      } catch { /* 跳过非 JSON 行 */ }
    }
  }
}
