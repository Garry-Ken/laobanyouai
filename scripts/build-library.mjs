/**
 * 团队手册静态生成器
 * 把 stormzhang/ai-coding-guide(MIT)的 93 篇 markdown 转成
 * public/library/ 下的静态阅读站:index + 每篇文档页 + 图片资产。
 *
 * 用法:
 *   node scripts/build-library.mjs <源仓库目录>
 *   源目录 = ai-coding-guide 的本地 clone(默认 ../ai-coding-guide)
 *
 * 产物全部提交进仓库,CI 构建不依赖网络。
 */
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { marked } from 'marked'

const SRC = resolve(process.argv[2] || '../ai-coding-guide')
const OUT = resolve(import.meta.dirname, '../public/library')

const TRACKS = [
  { dir: 'claude-code', label: 'Claude Code', short: 'CC', desc: '从安装、代理循环，到 MCP、子代理、技能与钩子，直至真实项目发布。' },
  { dir: 'codex', label: 'Codex', short: 'CX', desc: '从入口点、沙盒审批、AGENTS.md，到工作树、CI/CD 与团队级自动化。' },
]

/** 起步路径:全量 93 篇里抽出来先读的 8 篇 */
const FEATURED = [
  ['claude-code', '01'], ['claude-code', '02'], ['claude-code', '07'], ['claude-code', '15'],
  ['claude-code', '18'], ['claude-code', '22'], ['claude-code', '49'], ['codex', '01'],
]

const ATTRIBUTION = {
  author: 'stormzhang',
  repo: 'https://github.com/stormzhang/ai-coding-guide',
  site: 'https://coding.stormzhang.ai',
  license: 'MIT License',
  licenseUrl: 'https://github.com/stormzhang/ai-coding-guide/blob/main/LICENSE',
  copyright: 'Copyright (c) 2026 stormzhang',
}

marked.setOptions({ gfm: true, breaks: false })

/** 解析一个 track 目录 → 章节数组 */
function readTrack(track) {
  const dir = join(SRC, track.dir)
  const files = readdirSync(dir).filter((f) => /^\d{2}-.*\.md$/.test(f)).sort()
  return files.map((file) => {
    const raw = readFileSync(join(dir, file), 'utf8')
    const m = raw.match(/^#\s+(.+)$/m)
    const rawTitle = m ? m[1].trim() : file
    // 标题形如「22 · MCP：给 Claude 接上外部世界」→ 拆编号与题名
    const tm = rawTitle.match(/^(\d+)\s*·\s*(.+)$/)
    const num = tm ? tm[1].padStart(2, '0') : file.slice(0, 2)
    const title = tm ? tm[2].trim() : rawTitle
    const slug = file.replace(/\.md$/, '')
    // 去掉正文里的 H1(页头自己渲染)
    const body = raw.replace(/^#\s+.+$/m, '').trim()
    return { file, slug, num, title, body }
  })
}

/** md → html,并把站内 .md 链接改写为 .html */
function render(md) {
  let html = marked.parse(md)
  // 同目录链接: href="21-security.md" / 跨轨: href="../codex/01-xxx.md"(可带 #锚点)
  html = html.replace(/href="((?:\.\.\/(?:claude-code|codex)\/)?[\w][\w.-]*?)\.md(#[^"]*)?"/g, 'href="$1.html$2"')
  return html
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const attributionBlock = `
<div class="attrib">
  <p class="attrib-title">出处与许可</p>
  <p>本手册内容来自 <a href="${ATTRIBUTION.repo}" target="_blank" rel="noreferrer noopener">stormzhang/ai-coding-guide</a>(原站 <a href="${ATTRIBUTION.site}" target="_blank" rel="noreferrer noopener">coding.stormzhang.ai</a>),原作者 <b>${ATTRIBUTION.author}</b>,以 <a href="${ATTRIBUTION.licenseUrl}" target="_blank" rel="noreferrer noopener">${ATTRIBUTION.license}</a> 许可开源。我们原样收录,保留全部署名与版权声明:<span class="mono">${ATTRIBUTION.copyright}</span></p>
</div>`

function pageShell({ title, desc, path, body, extraHead = '' }) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)} — 老板有AI · 团队手册</title>
<meta name="description" content="${esc(desc)}" />
<link rel="canonical" href="https://laobanyouai.com/library/${path}" />
<meta name="theme-color" content="#fbfaf7" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/library/doc.css" />
${extraHead}
</head>
<body>
${body}
</body>
</html>
`
}

const topbar = (active) => `
<header class="top">
  <div class="bar">
    <a class="brand" href="/"><span class="mark">板</span><b>老板有AI</b><small>团队手册</small></a>
    <nav>
      ${TRACKS.map((t) => `<a href="/library/${t.dir}/" class="${active === t.dir ? 'on' : ''}">${t.label}</a>`).join('')}
      <a href="/library/">总览</a>
      <a class="cta" href="/join.html">加入社区</a>
    </nav>
  </div>
</header>`

/* ============ 文档页 ============ */
function docPage(track, chapters, i) {
  const c = chapters[i]
  const prev = chapters[i - 1]
  const next = chapters[i + 1]
  const sidebar = `
<aside class="side">
  <p class="side-title mono">${track.label} · ${chapters.length} 篇</p>
  <nav class="toc">
    ${chapters.map((x) => `<a href="/library/${track.dir}/${x.slug}.html" class="${x.slug === c.slug ? 'cur' : ''}"><span>${x.num}</span>${esc(x.title)}</a>`).join('\n    ')}
  </nav>
</aside>`

  const pager = `
<div class="pager">
  ${prev ? `<a class="pg" href="/library/${track.dir}/${prev.slug}.html"><span class="mono">← 上一篇 · ${prev.num}</span><b>${esc(prev.title)}</b></a>` : '<span></span>'}
  ${next ? `<a class="pg nx" href="/library/${track.dir}/${next.slug}.html"><span class="mono">下一篇 · ${next.num} →</span><b>${esc(next.title)}</b></a>` : '<span></span>'}
</div>`

  const body = `
${topbar(track.dir)}
<div class="wrap doc-grid">
  ${sidebar}
  <main class="doc">
    <details class="m-toc"><summary class="mono">目录 · ${track.label} ${chapters.length} 篇</summary>${chapters
      .map((x) => `<a href="/library/${track.dir}/${x.slug}.html" class="${x.slug === c.slug ? 'cur' : ''}"><span>${x.num}</span>${esc(x.title)}</a>`)
      .join('')}</details>
    <div class="doc-head">
      <p class="crumb mono"><a href="/library/">团队手册</a> / <a href="/library/${track.dir}/">${track.label}</a> / 第 ${c.num} 篇</p>
      <h1>${esc(c.title)}</h1>
    </div>
    <article class="prose">
${render(c.body)}
    </article>
    ${pager}
    ${attributionBlock}
  </main>
</div>
<footer class="foot"><div class="wrap"><span>© 2026 老板有AI</span><span class="mono">内容 ${ATTRIBUTION.license} · ${ATTRIBUTION.author}</span></div></footer>`

  return pageShell({
    title: `${c.num} ${c.title}`,
    desc: `${track.label} 实操手册第 ${c.num} 篇:${c.title}。原作者 stormzhang,MIT 许可。`,
    path: `${track.dir}/${c.slug}.html`,
    body,
  })
}

/* ============ 轨道目录页(/library/claude-code/) ============ */
function trackIndex(track, chapters) {
  const body = `
${topbar(track.dir)}
<div class="wrap">
  <div class="hero-s">
    <p class="mono red">${track.label} 路线 · ${chapters.length} 篇</p>
    <h1>${esc(track.desc)}</h1>
    <p class="lede">按编号顺读即可,每篇都是可照做的实操。</p>
  </div>
  <div class="cat">
    ${chapters.map((x) => `<a class="row" href="/library/${track.dir}/${x.slug}.html"><span class="no mono">${x.num}</span><b>${esc(x.title)}</b><span class="arr mono">→</span></a>`).join('\n    ')}
  </div>
  ${attributionBlock}
</div>
<footer class="foot"><div class="wrap"><span>© 2026 老板有AI</span><span class="mono">内容 ${ATTRIBUTION.license} · ${ATTRIBUTION.author}</span></div></footer>`
  return pageShell({
    title: `${track.label} 路线`,
    desc: `${track.label} 实操手册,共 ${chapters.length} 篇。${track.desc}`,
    path: `${track.dir}/`,
    body,
  })
}

/* ============ 手册首页(/library/) ============ */
function libraryIndex(all) {
  const total = all.reduce((n, t) => n + t.chapters.length, 0)
  const featured = FEATURED.map(([dir, num]) => {
    const t = all.find((x) => x.track.dir === dir)
    const c = t.chapters.find((x) => x.num === num)
    return { dir, label: t.track.label, c }
  }).filter((x) => x.c)

  const body = `
${topbar('')}
<div class="wrap">
  <div class="hero-l">
    <div>
      <p class="chip"><i></i>MIT 开源 · 原样收录 · 保留署名</p>
      <h1>你不用会敲命令，<br />但你的团队得会。</h1>
      <p class="lede">Claude Code 与 Codex 双线实操手册,共 <b>${total} 篇</b>,给你的技术负责人。原作者 ${ATTRIBUTION.author},我们逐篇收录、持续跟原仓库同步。</p>
      <div class="stats mono">
        <span><b>${total}</b> 篇</span><span><b>2</b> 条路线</span><span><b>MIT</b> 开源</span><span><b>中文</b> 实操</span>
      </div>
    </div>
    <div class="term" aria-hidden="true">
      <div class="term-bar"><span class="lights"><i></i><i></i><i></i></span><span class="mono">claude-code — zsh</span></div>
      <div class="term-body mono">
        <p class="in">&gt; 帮我给官网加一个预约表单</p>
        <p class="ai">● 好，我先看一下项目结构。</p>
        <p class="wk">✳ Working… (3s · esc to interrupt)</p>
      </div>
    </div>
  </div>

  <div class="tracks">
    ${all.map(({ track, chapters }) => `
    <a class="tcard" href="/library/${track.dir}/">
      <span class="fico mono">${track.short}</span>
      <div><p class="mono red">${track.label} 路线 · ${chapters.length} 篇</p><b>${esc(track.desc)}</b></div>
      <span class="arr mono">→</span>
    </a>`).join('')}
  </div>

  <div class="feat">
    <div class="feat-head"><p class="mono red">起步路径</p><h2>先读这 ${featured.length} 篇,第一周就够了</h2></div>
    <div class="feat-grid">
      ${featured.map((f, i) => `
      <a class="fcard" href="/library/${f.dir}/${f.c.slug}.html">
        <span class="mono step">第 ${String(i + 1).padStart(2, '0')} 站 · ${f.label} ${f.c.num}</span>
        <b>${esc(f.c.title)}</b>
      </a>`).join('')}
    </div>
  </div>

  <div class="cat-all">
    <h2 class="mono red">完整目录 · ${total} 篇</h2>
    <div class="cat-cols">
      ${all.map(({ track, chapters }) => `
      <div>
        <p class="mono">${track.label} × ${chapters.length}</p>
        ${chapters.map((x) => `<a class="row" href="/library/${track.dir}/${x.slug}.html"><span class="no mono">${x.num}</span><b>${esc(x.title)}</b></a>`).join('\n        ')}
      </div>`).join('')}
    </div>
  </div>

  ${attributionBlock}
</div>
<footer class="foot"><div class="wrap"><span>© 2026 老板有AI</span><span class="mono">内容 ${ATTRIBUTION.license} · ${ATTRIBUTION.author}</span></div></footer>`

  return pageShell({
    title: '团队手册',
    desc: `AI 编程实操手册,Claude Code 与 Codex 双线共 ${total} 篇。原作者 stormzhang,MIT 许可原样收录。`,
    path: '',
    body,
  })
}

/* ============ 主流程 ============ */
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const all = []
for (const track of TRACKS) {
  const chapters = readTrack(track)
  all.push({ track, chapters })
  const dir = join(OUT, track.dir)
  mkdirSync(dir, { recursive: true })
  chapters.forEach((c, i) => writeFileSync(join(dir, `${c.slug}.html`), docPage(track, chapters, i)))
  writeFileSync(join(dir, 'index.html'), trackIndex(track, chapters))
  // 图片资产原样镜像,md 里的相对引用不用改写
  cpSync(join(SRC, track.dir, 'assets'), join(dir, 'assets'), { recursive: true })
  console.log(`${track.label}: ${chapters.length} 篇`)
}
writeFileSync(join(OUT, 'index.html'), libraryIndex(all))
cpSync(join(import.meta.dirname, 'library.css'), join(OUT, 'doc.css'))
console.log(`总计 ${all.reduce((n, t) => n + t.chapters.length, 0)} 篇 → ${OUT}`)
