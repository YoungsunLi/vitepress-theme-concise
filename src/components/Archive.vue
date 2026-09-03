<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { count, useConcise, usePosts, type Post } from '../posts'

const posts = usePosts()
const { labels } = useConcise()

/** 文章已按日期倒序，分组后年份自然也是倒序 */
const years = computed(() => {
  const groups = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    groups.set(year, [...(groups.get(year) ?? []), post])
  }
  return [...groups]
})
</script>

<template>
  <main class="concise-page">
    <h1>{{ labels.archive }}<small>{{ count(labels.postCount, posts.length) }}</small></h1>
    <section v-for="[year, list] of years" :key="year">
      <h2>{{ year }}<small>{{ count(labels.postCount, list.length) }}</small></h2>
      <ul class="archive-list">
        <li v-for="post of list" :key="post.url">
          <time :datetime="post.date">{{ post.date.slice(5) }}</time>
          <a :href="withBase(post.url)">{{ post.title }}</a>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.archive-list {
  margin: 0;
  padding: 0 8px;
  list-style: none;
}

.archive-list li {
  display: flex;
  gap: 1rem;
  padding: 0.35rem 0;
  line-height: 1.6;
}

.archive-list time {
  flex: none;
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--vp-c-text-3);
}

.archive-list a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s;
}

.archive-list a:hover,
.archive-list a:focus-visible {
  color: var(--vp-c-brand-1);
}
</style>
