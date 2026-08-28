import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'
import type { Post } from './posts'

export interface PostsLoaderOptions {
  /**
   * 文章 URL 的目录前缀，默认 'posts'，生成 /posts/<slug>/ 形式的地址。
   */
  urlPrefix?: string
}

/** 取文件被加入版本库那次提交的时间，作为发布日期 —— 之后再修改文章也不会变 */
function gitCreationDate(file: string): string {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--diff-filter=A', '--format=%aI', '--', path.basename(file)],
      { cwd: path.dirname(file), encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim()
    if (!out) return ''
    // 文件若曾被删除又重新加入，会有多行，取最早的那次
    const lines = out.split('\n').filter(Boolean)
    return lines[lines.length - 1].slice(0, 10)
  } catch {
    return ''
  }
}

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return ''
}

/** 正文里的第一个一级标题 */
function firstHeading(content: string): string {
  const m = content.match(/^#\s+(.+?)\s*$/m)
  return m ? m[1].trim() : ''
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
 * 也就是说，日常写文章只要写正文即可，不必手写 frontmatter。
 */
export function createPostsLoader(pattern: string, options: PostsLoaderOptions = {}) {
  const prefix = (options.urlPrefix ?? 'posts').replace(/^\/|\/$/g, '')

  return {
    watch: [pattern],
    load(files: string[]): Post[] {
      return files
        .map((file) => {
          const raw = fs.readFileSync(file, 'utf-8')
          const { data, content } = matter(raw)
          const slug = path.basename(file, path.extname(file))

          const date =
            normalizeDate(data.date) ||
            gitCreationDate(file) ||
            new Date(fs.statSync(file).mtime).toISOString().slice(0, 10)

          return {
            title: data.title || firstHeading(content) || slug,
            url: `/${prefix}/${slug}/`,
            date
          }
        })
        .sort((a, b) => b.date.localeCompare(a.date))
    }
  }
}
