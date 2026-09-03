<script setup lang="ts">
import { computed } from 'vue'
import { count, tagUrl, useConcise, usePosts } from '../posts'

const posts = usePosts()
const { labels } = useConcise()

const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})
</script>

<template>
  <main class="concise-page">
    <h1>{{ labels.tags }}<small>{{ count(labels.tagCount, tags.length) }}</small></h1>
    <ul class="tag-list">
      <li v-for="[tag, n] of tags" :key="tag">
        <a :href="tagUrl(tag)">{{ tag }}<small>{{ n }}</small></a>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0 8px;
  list-style: none;
}

.tag-list a {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.25s, background-color 0.25s, border-color 0.25s;
}

.tag-list small {
  margin-left: 0.4em;
  color: var(--vp-c-text-3);
}

.tag-list a:hover,
.tag-list a:focus-visible {
  color: var(--vp-c-brand-1);
  background-color: var(--concise-c-card-hover-bg);
  border-color: var(--concise-c-card-hover-border);
}
</style>
