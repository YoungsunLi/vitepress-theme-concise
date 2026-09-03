import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './components/Layout.vue'
import Home from './components/Home.vue'
import Archive from './components/Archive.vue'
import Tags from './components/Tags.vue'
import Tag from './components/Tag.vue'
import PostCard from './components/PostCard.vue'
import Pagination from './components/Pagination.vue'
import BackToTop from './components/BackToTop.vue'
import { POSTS_KEY, type Post } from './posts'
import './styles/index.css'

export { POSTS_KEY }
export type { Post }
export { Layout, Home, Archive, Tags, Tag, PostCard, Pagination, BackToTop }

export interface ConciseThemeOptions {
  /** 文章列表，来自 posts.data.mts 的构建时数据 */
  posts: Post[]
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
export function createConciseTheme({ posts }: ConciseThemeOptions): Theme {
  return {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app }) {
      app.provide(POSTS_KEY, posts)
      app.component('Home', Home)
      app.component('Archive', Archive)
      app.component('Tags', Tags)
      app.component('Tag', Tag)
    }
  }
}
