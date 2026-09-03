# vitepress-theme-concise

卡片式首页呈现的 VitePress 博客主题。

这是一个**派生主题**，继承 VitePress 默认主题，在其之上提供：

- 卡片式首页与分页（`/page/2/`）
- 归档页（按年）、标签页；不写标签就不出现标签
- 文章页的发布日期、上一篇/下一篇
- 草稿：`draft: true` 的文章 dev 可见、构建不收录
- Atom 订阅 `feed.xml`、sitemap、og 标签
- 正文图片点击放大
- 经典排版手感：系统字体栈、`h2` 下划线、左侧粗边框的提示容器、深色代码块
- 主题色 `#2050FF`，并补齐了深色模式

> 3.x 面向 **VitePress**，需要 Node 22+。VuePress 1.x 版本请用 [`v1.0.0`](https://github.com/YoungsunLi/vitepress-theme-concise/tree/v1.0.0)。

## 安装

```bash
npm install github:YoungsunLi/vitepress-theme-concise#v3.0.0
```

建议带上版本标签；省略则跟随 `master`，日后的改动会直接进入你的构建。

## 使用

**1. 声明文章目录** —— `docs/.vitepress/concise.mts`

```ts
import { defineConcise } from 'vitepress-theme-concise/node'

export default defineConcise({
  posts: new URL('../posts/', import.meta.url),
  perPage: 10, // 首页每页文章数，默认 10
  hostname: 'https://example.com' // 给了才生成 feed.xml、sitemap 与 og:url
})
```

**2. 包一层站点配置** —— `docs/.vitepress/config.mts`

```ts
import concise from './concise.mjs'

export default concise.config({
  title: '…',
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '归档', link: '/archive/' },
      { text: '标签', link: '/tags/' }
    ]
  }
})
```

`config()` 会注入文章地址 rewrite、草稿排除、sitemap、上一篇/下一篇、og 标签和构建后的 `feed.xml`；
你自己写的 `transformPageData` / `buildEnd` 照常执行。

**3. 文章列表** —— `docs/.vitepress/theme/posts.data.mts`

```ts
import concise from '../concise.mjs'

export default concise.loader
```

**4. 启用主题** —— `docs/.vitepress/theme/index.ts`

```ts
import { createConciseTheme } from 'vitepress-theme-concise'
import { data as posts } from './posts.data.mjs'

export default createConciseTheme({ posts })
```

**5. 页面**

首页 `docs/index.md`：

```md
---
layout: page
heroText: 🚀
tagline: DEV DESIGN DIY
---

<Home />
```

首页第 2 页起 `docs/page/[page]/index.md`（内容同首页）与 `docs/page/[page]/index.paths.mts`：

```ts
import concise from '../../.vitepress/concise.mjs'

export default { paths: concise.pagePaths }
```

归档 `docs/archive/index.md`、标签索引 `docs/tags/index.md`、单个标签 `docs/tags/[tag]/index.md`，
各自 `layout: page` 并放入 `<Archive />`、`<Tags />`、`<Tag />`；
标签页另需 `docs/tags/[tag]/index.paths.mts`：

```ts
import concise from '../../.vitepress/concise.mjs'

export default { paths: concise.tagPaths }
```

不需要的页面不建即可。

## 文章格式

`docs/posts/` 下每个 Markdown 就是一篇文章，地址为 `/posts/<文件名>/`（目录名即地址前缀），
日常写文章只要写正文，frontmatter 全部可选：

```md
---
title: 文章标题        # 缺省取正文第一个 # 标题
date: 2020-03-18       # 缺省取 git 首次提交时间
tags: [esp32, pcb]     # 缺省无标签
description: 一句话摘要 # 用于 og:description 与 feed 的 summary，卡片不显示
draft: true            # dev 可见，构建不收录
---
```

> 发布日期依赖 git 历史，CI 中需设置 `fetch-depth: 0`（浅克隆会退回文件修改时间）。

## 自定义

界面文案默认中文，在 `defineConcise` 里按需覆盖：

```ts
defineConcise({
  posts: …,
  labels: {
    publishedAt: 'Published on',
    prevPage: 'Previous',
    nextPage: 'Next',
    pagination: 'Pagination',
    archive: 'Archive',
    tags: 'Tags',
    postCount: '{n} posts',
    tagCount: '{n} tags',
    pageTitle: 'Page {n}'
  }
})
```

上一篇/下一篇与回到顶部的文案沿用 VitePress 的 `themeConfig.docFooter` 与 `returnToTopLabel`。

所有颜色与尺寸都是 CSS 变量，在自己的样式里覆盖即可：

```css
:root {
  --vp-c-brand-1: #2050ff;          /* 主题色 */
  --concise-content-width: 1200px;  /* 正文宽度 */
}
```

完整清单见 [`src/styles/vars.css`](src/styles/vars.css)。

主题也导出了各个组件，可单独取用：

```ts
import { Home, Archive, Tags, Tag, PostCard, Pagination, Layout } from 'vitepress-theme-concise'
```

## 效果

[lsun.net](https://lsun.net)

## License

[MIT](LICENSE)
