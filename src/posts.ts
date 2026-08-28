import type { InjectionKey } from 'vue'

export interface Post {
  title: string
  url: string
  date: string
}

/** 文章列表的注入键，由使用方通过 createConciseTheme({ posts }) 提供 */
export const POSTS_KEY: InjectionKey<Post[]> = Symbol('concise:posts')

/** 主题相关的配置，写在 themeConfig.concise 下 */
export interface ConciseConfig {
  /** 首页每页文章数，默认 10 */
  perPage?: number
}
