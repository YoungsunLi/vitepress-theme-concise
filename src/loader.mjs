// 本文件在 Node 端执行（VitePress 的 data loader 不经 Vite 编译），
// 而 Node 无法剥离 node_modules 下 .ts 文件的类型，故以 JS 编写，
// 类型声明见同名 .d.mts。
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import matter from 'gray-matter'

/** 取文件被加入版本库那次提交的完整时间戳，作为发布时间 —— 之后再修改文章也不会变 */
function gitCreationTime(file) {
  try {
    const out = execFileSync(
      'git',
      ['log', '--follow', '--diff-filter=A', '--format=%aI', '--', path.basename(file)],
      { cwd: path.dirname(file), encoding: 'utf-8', stdio: ['ignore', 'pipe', 'ignore'] }
    ).trim()
    if (!out) return ''
    // 文件若曾被删除又重新加入，会有多行，取最早的那次
    const lines = out.split('\n').filter(Boolean)
    return lines[lines.length - 1]
  } catch {
    return ''
  }
}

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  return ''
}

/** 正文里的第一个一级标题 */
function firstHeading(content) {
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
 * 同一天的文章按 git 入库时间倒序——日期只有日粒度，不加这层会退化成按文件名排序。
 */
export function createPostsLoader(pattern, options = {}) {
  const prefix = (options.urlPrefix ?? 'posts').replace(/^\/|\/$/g, '')

  return {
    watch: [pattern],
    load(files) {
      return files
        .map((file) => {
          const raw = fs.readFileSync(file, 'utf-8')
          const { data, content } = matter(raw)
          const slug = path.basename(file, path.extname(file))

          const gitTime = gitCreationTime(file)
          const mtime = fs.statSync(file).mtime.toISOString()
          const date = normalizeDate(data.date) || gitTime.slice(0, 10) || mtime.slice(0, 10)

          return {
            title: data.title || firstHeading(content) || slug,
            url: `/${prefix}/${slug}/`,
            date,
            time: gitTime || mtime
          }
        })
        .sort((a, b) => b.date.localeCompare(a.date) || new Date(b.time) - new Date(a.time))
        .map(({ time, ...post }) => post)
    }
  }
}
