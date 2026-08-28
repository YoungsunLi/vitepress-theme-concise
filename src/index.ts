import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import Home from './components/Home.vue'
import PostCard from './components/PostCard.vue'
import Pagination from './components/Pagination.vue'
import BackToTop from './components/BackToTop.vue'
import { POSTS_KEY, type Post } from './posts'
import './styles/index.css'

export { POSTS_KEY }
export type { Post }
export { Layout, Home, PostCard, Pagination, BackToTop }

export interface ConciseThemeOptions {
  /** 文章列表，通常来自 createPostsLoader() 的构建时数据 */
  posts?: Post[]
}

/**
 * 创建 concise 主题。
 *
 * ```ts
 * // docs/.vitepress/theme/index.ts
 * import { createConciseTheme } from 'vitepress-theme-concise'
 * import { data as posts } from './posts.data.mjs'
 *
 * export default createConciseTheme({ posts })
 * ```
 */
export function createConciseTheme(options: ConciseThemeOptions = {}): Theme {
  return {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
      app.provide(POSTS_KEY, options.posts ?? [])
      app.component('Home', Home)
      app.component('PostCard', PostCard)
      app.component('Pagination', Pagination)
    }
  }
}

export default createConciseTheme()
