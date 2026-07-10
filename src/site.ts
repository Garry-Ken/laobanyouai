/**
 * 全站唯一事实源：品牌文案、导航、五类问题、闭环步骤。
 * 四个页面共用，改文案只改这里。
 */

export const BRAND = {
  name: '老板有AI',
  domain: 'laobanyouai.com',
  tagline: '让 AI 替你干活，而不是让老板重新学一门技术。',
  subtitle: '面向中小企业老板的 AI 经营实战社区，每月解决一个真实经营问题。',
  /** 备案通过后填入备案号，页脚会自动显示 */
  icp: '' as string,
} as const

export type NavItem = { label: string; href: string }

export const NAV: readonly NavItem[] = [
  { label: '首页', href: '/' },
  { label: '案例库', href: '/cases.html' },
  { label: 'AI 情报', href: '/intel.html' },
  { label: '加入', href: '/join.html' },
] as const

/** 老板真正要解决的五类问题——不是五个工具 */
export const PILLARS = [
  {
    key: 'acquire',
    title: 'AI 获客',
    desc: '内容选题、短视频脚本、私域承接、销售线索的筛选与分发。',
    detail: '把"每天发什么"变成一条可复制的流水线，而不是靠老板灵感。',
  },
  {
    key: 'sales',
    title: 'AI 销售',
    desc: '客户画像分析、跟进话术、异议处理、成交复盘。',
    detail: '让新人第一个月就能用上老销售的经验，而不是自己踩三年坑。',
  },
  {
    key: 'manage',
    title: 'AI 管理',
    desc: '会议纪要、任务拆解、招聘筛选、内部培训、知识库沉淀。',
    detail: '把散落在老板脑子里的判断标准，变成团队能直接调用的东西。',
  },
  {
    key: 'cost',
    title: 'AI 降本',
    desc: '客服应答、文案生产、数据整理、重复流程的自动化。',
    detail: '先算清楚一件事一年花多少人力，再决定要不要让 AI 接手。',
  },
  {
    key: 'decide',
    title: 'AI 决策',
    desc: '行业情报、竞品跟踪、经营数据分析、投放与定价判断。',
    detail: '决策质量取决于信息密度，AI 最擅长的恰恰是把信息压缩给你。',
  },
] as const

/** 与"上课—听完—没动作"的循环相对，这里的闭环以结果收口 */
export const LOOP = [
  { step: '01', title: '经营诊断', desc: '先看你的生意目前卡在哪一环，而不是先看有什么工具。' },
  { step: '02', title: '选择问题', desc: '从五类问题里挑一个，本月只解决它。' },
  { step: '03', title: '30 天战役', desc: '一个月一场，有起点、有动作清单、有截止日。' },
  { step: '04', title: '使用 AI 方案', desc: '给现成的提示词、工作流和工具组合，不从零摸索。' },
  { step: '05', title: '记录结果', desc: '用数字收口：省了多少小时、多了多少线索、降了多少成本。' },
  { step: '06', title: '沉淀案例', desc: '跑通的路径写成行业案例，成为下一位老板的起点。' },
] as const

/** 一条真实案例应当包含的字段——案例库页面用它展示"我们要什么样的案例" */
export const CASE_SCHEMA = [
  { field: '行业与规模', example: '例如：区域连锁餐饮，8 家门店，年营收 2000 万' },
  { field: '卡住的问题', example: '具体到一件事，而不是"想做 AI 转型"' },
  { field: '当月动作', example: '30 天里实际做了哪几步，谁执行的' },
  { field: '用了什么', example: '工具、提示词、工作流，可复制的部分' },
  { field: '可验证的结果', example: '带数字，且说明怎么统计的' },
  { field: '没解决的部分', example: '哪些没跑通、为什么——这一栏不能空' },
] as const

/** AI 情报每周覆盖什么——先讲清楚，再开始发 */
export const INTEL_SCOPE = [
  { title: '能落地的新工具', desc: '只收录当周真正能用在上述五类问题上的，不做新品罗列。' },
  { title: '同行在做什么', desc: '国内中小企业里跑出结果的做法，附可核验的来源。' },
  { title: '成本变化', desc: '模型降价、额度调整、替代方案——直接影响你的账。' },
  { title: '踩坑记录', desc: '社区成员当周失败的尝试，避免你重复交学费。' },
] as const

export const WECHAT = {
  qr: '/qr/wechat.png',
  name: '明道 Garry 丨 AI 增长',
  guide: '微信扫码添加，备注「老板有AI」',
  note: '我会先问你三个问题：做什么生意、现在卡在哪、这个月最想解决什么。',
} as const
