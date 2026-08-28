<script setup lang="ts">
import { computed, inject, useSlots } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import BackToTop from './BackToTop.vue'
import { POSTS_KEY, type Post } from '../posts'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const route = useRoute()
const slots = useSlots()
const posts = inject<Post[]>(POSTS_KEY, [])

function normalize(path: string) {
  return path.replace(/\/+$/, '')
}

/**
 * 发布日期：优先 frontmatter.date；没有就用文章列表里的值
 * （由 loader 在构建时从 git 首次提交时间推断）。
 */
const publishDate = computed(() => {
  const explicit = frontmatter.value.date
  if (explicit instanceof Date) return explicit.toISOString().slice(0, 10)
  if (typeof explicit === 'string' && explicit) return explicit.slice(0, 10)

  const current = normalize(route.path)
  return posts.find((p) => normalize(p.url) === current)?.date ?? ''
})

/** 主题占用的插槽，其余原样透传给默认主题 */
const OWNED = ['doc-before', 'layout-bottom']
const passThrough = computed(() => Object.keys(slots).filter((name) => !OWNED.includes(name)))
</script>

<template>
  <Layout>
    <template #doc-before>
      <div v-if="publishDate" class="post-meta">发布于 {{ publishDate }}</div>
      <slot name="doc-before" />
    </template>

    <template #layout-bottom>
      <slot name="layout-bottom" />
      <BackToTop />
    </template>

    <template v-for="name of passThrough" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </Layout>
</template>

<style scoped>
.post-meta {
  margin-bottom: 1.25rem;
  color: var(--vp-c-text-3);
  font-size: 14px;
}
</style>
