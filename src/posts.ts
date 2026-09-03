import { inject, type InjectionKey } from 'vue'
import { useData, withBase } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
}

export interface Labels {
  publishedAt: string
  prevPage: string
  nextPage: string
  pagination: string
  archive: string
  tags: string
  // 以下三个是含 {n} 的模板，见 count()
  postCount: string
  tagCount: string
  pageTitle: string
}

/** themeConfig.concise，由 defineConcise().config() 注入 */
export interface ConciseConfig {
  perPage: number
  labels: Labels
}

/** 文章列表的注入键，由使用方通过 createConciseTheme({ posts }) 提供 */
export const POSTS_KEY: InjectionKey<Post[]> = Symbol('concise:posts')

export const usePosts = () => inject(POSTS_KEY)!

export const useConcise = () => (useData().theme.value as { concise: ConciseConfig }).concise

export const count = (template: string, n: number) => template.replace('{n}', String(n))

/** 首页是第 1 页，其余页由动态路由 page/[page] 提供 */
export const pageUrl = (page: number) => withBase(page === 1 ? '/' : `/page/${page}/`)

export const tagUrl = (tag: string) => withBase(`/tags/${encodeURIComponent(tag)}/`)
