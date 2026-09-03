// 本文件在 Node 端执行（VitePress 的 config / data loader / paths 由 esbuild 打包，
// 不剥离 node_modules 下 .ts 文件的类型），故以 JS 编写，类型声明见同名 .d.mts。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'

const PACKAGE = 'vitepress-theme-concise'
const FEED = 'feed.xml'
// vitepress build 在读配置之前就把 NODE_ENV 设为 production，dev 不设
const isBuild = process.env.NODE_ENV === 'production'

const DEFAULT_LABELS = {
  publishedAt: '发布于',
  prevPage: '上一页',
  nextPage: '下一页',
  pagination: '文章分页',
  archive: '归档',
  tags: '标签',
  postCount: '{n} 篇',
  tagCount: '{n} 个',
  pageTitle: '第 {n} 页'
}

function git(args, cwd) {
  return execFileSync('git', args, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
}

/**
 * 一次 git log 取出仓库里每个文件被加入版本库的时间（含改名前的历史），
 * 作为发布时间——之后再修改文章也不会变。
 * 不逐文件 --follow：几百篇文章时每次热更新都要开几百个 git 进程。
 */
function gitCreationTimes(dir) {
  let top, log
  try {
    top = git(['rev-parse', '--show-toplevel'], dir)
    log = git(['log', '--diff-filter=AR', '--name-status', '-M', '--format=%x00%aI'], dir)
  } catch (e) {
    // 没装 git（ENOENT）或不在仓库里（git 以 128 退出）时退回文件修改时间，其余错误照常抛出
    if (e.code === 'ENOENT' || e.status === 128) return () => ''
    throw e
  }
  const created = {}
  // 从最早的提交开始处理：同一路径若删除后重新加入，以最早那次为准
  for (const block of log.split('\0').reverse()) {
    const [time, ...changes] = block.trim().split('\n')
    for (const change of changes) {
      const [status, from, to] = change.split('\t')
      if (status === 'A') created[from] ??= time
      else if (status?.startsWith('R')) created[to] = created[from] ?? time
    }
  }
  return (file) => created[path.relative(top, file).replaceAll('\\', '/')] ?? ''
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return ''
}

function firstHeading(content) {
  const m = content.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : ''
}

/** frontmatter 的 tags 允许写成数组、单个字符串或逗号分隔 */
function normalizeTags(value) {
  return [].concat(value ?? []).flatMap((v) => String(v).split(',')).map((t) => t.trim()).filter(Boolean)
}

/** 同一天的文章按 git 入库时间倒序——日期只有日粒度，不加这层会退化成按文件名排序 */
function readPosts(files, prefix) {
  const createdAt = files.length ? gitCreationTimes(path.dirname(files[0])) : () => ''
  return files
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(file, 'utf-8'))
      const slug = path.basename(file, path.extname(file))
      const gitTime = createdAt(file)
      const mtime = fs.statSync(file).mtime.toISOString()
      return {
        file,
        draft: data.draft === true,
        time: gitTime || mtime,
        title: data.title || firstHeading(content) || slug,
        url: `/${prefix}/${slug}/`,
        date: normalizeDate(data.date) || gitTime.slice(0, 10) || mtime.slice(0, 10),
        tags: normalizeTags(data.tags),
        description: data.description ? String(data.description) : ''
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date) || new Date(b.time) - new Date(a.time))
}

/** 草稿只在 dev 出现 */
const visible = (records) => records.filter((p) => !(isBuild && p.draft))

/** 客户端用的文章列表：摘要只用于 og 与 feed，卡片不显示 */
const publish = (records) => visible(records).map(({ file, draft, time, description, ...post }) => post)

const escapeXml = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

/**
 * 从构建好的页面里截出正文：图片已是带 hash 的最终地址，页内 Vue 组件也已渲染成 HTML，
 * 重新渲染 Markdown 得不到这两样。订阅器不知道站点在哪，相对地址一律转成绝对地址。
 */
function articleHtml(file, base) {
  const m = fs.readFileSync(file, 'utf-8').match(/<div[^>]*class="vp-doc[^>]*><div>([\s\S]*?)<\/div><\/div><\/main>/)
  if (!m) throw new Error(`${PACKAGE}: 在 ${file} 里找不到正文，VitePress 默认主题的页面结构可能变了`)
  return m[1]
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\b(src|href)="(?![a-z][a-z0-9+.-]*:|#)([^"]*)"/gi, (_, attr, url) => `${attr}="${new URL(url, base).href}"`)
}

/** root 是带 base 的站点根地址，以 / 结尾 */
function writeFeed(siteConfig, posts, root) {
  const abs = (url) => root + url.slice(1)
  const { title, description } = siteConfig.site
  const entry = (post) => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${abs(post.url)}"/>
    <id>${abs(post.url)}</id>
    <updated>${post.date}T00:00:00Z</updated>
    ${post.description ? `<summary>${escapeXml(post.description)}</summary>` : ''}
    ${post.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join('')}
    <content type="html">${escapeXml(articleHtml(path.join(siteConfig.outDir, post.url, 'index.html'), abs(post.url)))}</content>
  </entry>`
  const updated = posts[0]?.date ?? new Date().toISOString().slice(0, 10)
  fs.writeFileSync(
    path.join(siteConfig.outDir, FEED),
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(description)}</subtitle>
  <link href="${root}"/>
  <link rel="self" href="${root}${FEED}"/>
  <id>${root}</id>
  <updated>${updated}T00:00:00Z</updated>
  <author><name>${escapeXml(title)}</name></author>
  ${posts.map(entry).join('')}
</feed>
`
  )
}

/** 页面在站点内的地址，与 VitePress 输出的一致 */
const outputPath = (pageData, siteConfig) =>
  pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, siteConfig.cleanUrls ? '' : '.html')

/** 带 base 的站点根地址；没给 hostname 时为空 */
const siteRoot = (site, siteConfig) => site.origin && site.origin + siteConfig.site.base

function transformPageData(site, pageData, siteConfig) {
  const { page, tag } = pageData.params ?? {}
  if (page) pageData.title = site.labels.pageTitle.replace('{n}', page)
  if (tag) pageData.title = tag

  const file = path.resolve(siteConfig.srcDir, pageData.filePath)
  const posts = visible(site.records())
  const i = posts.findIndex((p) => p.file === file)
  if (i >= 0) {
    // 列表按时间倒序，「上一篇」是更新的那篇；frontmatter 里手写的 prev/next 优先
    const link = (p) => p && { text: p.title, link: p.url }
    pageData.frontmatter.prev ??= link(posts[i - 1])
    pageData.frontmatter.next ??= link(posts[i + 1])
  }

  const head = (pageData.frontmatter.head ??= [])
  head.push(
    ['meta', { property: 'og:type', content: i >= 0 ? 'article' : 'website' }],
    ['meta', { property: 'og:title', content: pageData.title || siteConfig.site.title }],
    ['meta', { property: 'og:description', content: pageData.description || siteConfig.site.description }]
  )
  const root = siteRoot(site, siteConfig)
  if (root) {
    head.push(
      ['meta', { property: 'og:url', content: root + outputPath(pageData, siteConfig) }],
      ['link', { rel: 'alternate', type: 'application/atom+xml', href: siteConfig.site.base + FEED }]
    )
  }
}

async function config(site, userConfig) {
  const { mergeConfig } = await import('vitepress')
  const { prefix, perPage, labels, giscus, origin } = site
  const merged = mergeConfig(
    {
      rewrites: { [`${prefix}/:slug.md`]: `${prefix}/:slug/index.md` },
      // 草稿不参与构建：没有页面，也不进搜索索引和 sitemap
      srcExclude: isBuild ? site.records().filter((p) => p.draft).map((p) => `${prefix}/${path.basename(p.file)}`) : [],
      // VitePress 生成 sitemap 时不会自己拼 base；此时 siteConfig 尚未解析，只能取用户写的 base
      sitemap: origin && { hostname: origin + (userConfig.base ?? '/') },
      themeConfig: { concise: { perPage, labels, giscus } },
      // 主题以源码发布，SSR 时必须交给 Vite 编译
      vite: { ssr: { noExternal: [PACKAGE] } }
    },
    userConfig
  )
  merged.transformPageData = async (pageData, ctx) => {
    transformPageData(site, pageData, ctx.siteConfig)
    return userConfig.transformPageData?.(pageData, ctx)
  }
  merged.buildEnd = async (siteConfig) => {
    if (origin) writeFeed(siteConfig, visible(site.records()), siteRoot(site, siteConfig))
    await userConfig.buildEnd?.(siteConfig)
  }
  return merged
}

/**
 * 主题的 Node 端接线，见 README「使用」。
 * `posts` 是文章目录，目录下每个 .md 即一篇文章，地址为 /<目录名>/<文件名>/。
 */
export function defineConcise({ posts, perPage = 10, hostname, labels, giscus }) {
  const dir = path.resolve(posts instanceof URL ? fileURLToPath(posts) : posts)
  let cache
  const site = {
    // 目录名即地址前缀：rewrites 与 srcExclude 都按 <srcDir>/<目录名>/ 定位文章
    prefix: path.basename(dir),
    perPage,
    giscus,
    labels: { ...DEFAULT_LABELS, ...labels },
    origin: hostname?.replace(/\/$/, ''),
    records: () =>
      (cache ??= readPosts(
        fs.globSync('*.md', { cwd: dir }).map((f) => path.join(dir, f)),
        site.prefix
      ))
  }

  return {
    config: (userConfig) => config(site, userConfig),
    loader: {
      watch: [`${dir.replaceAll('\\', '/')}/*.md`],
      load: (files) => publish(readPosts(files, site.prefix))
    },
    pagePaths: () =>
      Array.from({ length: Math.ceil(visible(site.records()).length / perPage) - 1 }, (_, i) => ({
        params: { page: String(i + 2) }
      })),
    tagPaths: () => [...new Set(visible(site.records()).flatMap((p) => p.tags))].map((tag) => ({ params: { tag } }))
  }
}
