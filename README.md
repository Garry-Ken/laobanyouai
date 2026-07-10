# 老板有AI · laobanyouai.com

面向中小企业老板的 AI 经营实战社区，品牌站。

## 技术

Vite 8 + React 19 + TypeScript + Tailwind 3。**MPA 多页**，不是 SPA：
`index.html` / `cases.html` / `intel.html` / `join.html` 各是一个真实静态页，
返回 200 与独立 meta，将来迁到国内 CDN 无需任何 rewrite 规则。

全站文案集中在 [`src/site.ts`](src/site.ts)，改文案只改这一个文件。

```bash
pnpm install
pnpm dev      # http://localhost:5195
pnpm build    # tsc --noEmit && vite build → dist/
```

## 部署

推送 `main` 触发 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)，
构建产物经 `actions/deploy-pages` 发布到 GitHub Pages。

自定义域名由 [`public/CNAME`](public/CNAME) 声明，DNS 在 DNSPod 侧配置：

| 类型 | 主机记录 | 记录值 |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | garry-ken.github.io. |

## 备案

当前托管在境外（GitHub Pages），**无需 ICP 备案**。

若将来要切国内 CDN 加速，需先备案，而备案主体不能是个人——
网站名称含「AI」属产品/行业信息，内容也属行业类，个人性质备案会被驳回。
届时需以个体工商户或公司为主体，并先将域名实名信息过户到该主体。
备案号填入 `src/site.ts` 的 `BRAND.icp`，页脚会自动展示。

## 内容边界

案例库与 AI 情报两页目前是**有意留空的**。在有真实、可验证的结果之前，
不放任何案例数字。后续可由 `content-loop` / `gold-radar` 的产出喂入。
