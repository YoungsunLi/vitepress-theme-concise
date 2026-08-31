import type { Post } from './posts'

export interface PostsLoaderOptions {
  /**
   * 文章 URL 的目录前缀，默认 'posts'，生成 /posts/<slug>/ 形式的地址。
   */
  urlPrefix?: string
}

/**
 * 收集文章列表，按日期倒序。在使用方的 `*.data.mts` 中调用，
 * glob 相对该 data 文件所在目录：
 *
 * ```ts
 * // docs/.vitepress/theme/posts.data.mts
 * import { createPostsLoader } from 'vitepress-theme-concise/loader'
 * export default createPostsLoader('../../posts/*.md')
 * ```
 *
 * 标题取 frontmatter.title，缺省时取正文第一个 `#` 标题。
 * 日期取 frontmatter.date，缺省时取 git 首次提交时间，再缺省用文件修改时间。
 * 同一天的文章按 git 入库时间倒序。
 */
export function createPostsLoader(
  pattern: string,
  options?: PostsLoaderOptions
): {
  watch: string[]
  load(files: string[]): Post[]
}
