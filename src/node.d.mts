import type { DefaultTheme, UserConfig } from 'vitepress'
import type { Giscus, Labels, Post } from './posts'

export interface ConciseOptions {
  /** 文章目录，绝对路径或 file: URL；目录下每个 .md 即一篇文章，地址为 /<目录名>/<文件名>/ */
  posts: string | URL
  /** 首页每页文章数，默认 10 */
  perPage?: number
  /** 站点根地址，如 https://example.com；给了才生成 feed.xml、sitemap 与 og:url */
  hostname?: string
  /** 界面文案，缺省为中文，可只覆盖一部分 */
  labels?: Partial<Labels>
  /** 文章页评论，存在 GitHub Discussions 里；不配则没有评论区 */
  giscus?: Giscus
}

export interface Concise {
  /**
   * 包一层站点配置，注入文章地址 rewrite、草稿排除、sitemap、themeConfig.concise、
   * 文章页的上一篇/下一篇与 og 标签，以及构建后的 feed.xml。
   * 你自己的 transformPageData / buildEnd 会在主题之后照常执行。
   */
  config(userConfig: UserConfig<DefaultTheme.Config>): Promise<UserConfig<DefaultTheme.Config>>
  /** 供 docs/.vitepress/theme/posts.data.mts 默认导出 */
  loader: { watch: string[]; load(files: string[]): Post[] }
  /** 首页第 2 页起的路由参数，供 page/[page]/index.paths.mts */
  pagePaths(): { params: { page: string } }[]
  /** 每个标签一条路由参数，供 tags/[tag]/index.paths.mts */
  tagPaths(): { params: { tag: string } }[]
}

export function defineConcise(options: ConciseOptions): Concise
