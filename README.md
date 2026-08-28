# vitepress-theme-concise

卡片式首页呈现的 VitePress 博客主题。

这是一个**派生主题**，继承 VitePress 默认主题，在其之上提供：

- 卡片式首页与分页
- 文章发布日期（取自 frontmatter，不随 git 提交变动）
- 经典排版手感：系统字体栈、`h2` 下划线、左侧粗边框的提示容器、深色代码块
- 主题色 `#2050FF`，并补齐了深色模式

> 2.x 面向 **VitePress**。VuePress 1.x 版本请用 [`v1.0.0`](https://github.com/YoungsunLi/vitepress-theme-concise/tree/v1.0.0)。

## 安装

```bash
npm install vitepress-theme-concise
```

## 使用

**1. 收集文章列表** —— `docs/.vitepress/theme/posts.data.mts`

```ts
import { createPostsLoader } from 'vitepress-theme-concise/loader'

export default createPostsLoader('posts/*.md')
```

**2. 启用主题** —— `docs/.vitepress/theme/index.ts`

```ts
import { createConciseTheme } from 'vitepress-theme-concise'
import { data as posts } from './posts.data.mjs'

export default createConciseTheme({ posts })
```

**3. 首页** —— `docs/index.md`

```md
---
layout: page
heroText: 🚀
tagline: DEV DESIGN DIY
---

<Home />
```

**4. 配置** —— `docs/.vitepress/config.mts`

```ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    // 主题以源码形式发布，需要交给 Vite 编译
    ssr: { noExternal: ['vitepress-theme-concise'] }
  },
  themeConfig: {
    concise: {
      perPage: 10 // 首页每页文章数，默认 10
    }
  }
})
```

## 文章格式

`docs/posts/` 下的 Markdown，frontmatter 写标题与日期：

```md
---
title: '文章标题'
date: '2020-03-18'
---
```

首页卡片按 `date` 倒序排列，文章页顶部显示"发布于 …"。

## 自定义

所有颜色与尺寸都是 CSS 变量，在自己的样式里覆盖即可：

```css
:root {
  --vp-c-brand-1: #2050ff;          /* 主题色 */
  --concise-content-width: 1200px;  /* 正文宽度 */
  --vp-sidebar-width: 22rem;        /* 侧边栏宽度 */
}
```

完整清单见 [`src/styles/vars.css`](src/styles/vars.css)。

主题也导出了各个组件，可单独取用：

```ts
import { Home, PostCard, Pagination, Layout } from 'vitepress-theme-concise'
```

## 效果

[lsun.net](https://lsun.net)

## License

[MIT](LICENSE)
