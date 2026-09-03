<script setup lang="ts">
import { withBase } from 'vitepress'
import type { Post } from '../posts'

defineProps<{ post: Post }>()
</script>

<template>
  <li class="post-card">
    <a :href="withBase(post.url)" class="post-card-link">
      <h3>{{ post.title }}</h3>
      <aside>
        <div class="post-card-date">{{ post.date }}</div>
        <div class="post-card-more">→</div>
      </aside>
    </a>
  </li>
</template>

<style scoped>
.post-card {
  /*
   * 不设 flex-basis：宽度就是标题的 max-content，能同行的卡片标题都不换行，
   * 同行因此天然等高；标题换行只发生在独占一行的卡片上。
   * 往卡片里加会换行的内容会破坏这条规则。
   */
  flex-grow: 1;
  margin: 8px;
  padding: 15px 19px 0 19px;
  list-style-type: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--concise-shadow);
  transition: background-color 0.25s, border-color 0.25s;
}

.post-card-link {
  display: block;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.post-card h3 {
  margin: 0;
  padding-bottom: 0.5rem;
  font-size: 1.17em;
  font-weight: bold;
  line-height: 1.4;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: color 0.25s, border-color 0.25s;
}

.post-card aside {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0 8px 0;
  color: var(--concise-c-card-meta);
  transition: color 0.25s;
}

.post-card-date {
  font-size: 14px;
}

.post-card-more {
  transition: transform 0.25s;
}

.post-card:hover,
.post-card:focus-within {
  background-color: var(--concise-c-card-hover-bg);
  border-color: var(--concise-c-card-hover-border);
}

.post-card:hover h3,
.post-card:focus-within h3 {
  color: var(--vp-c-brand-1);
  border-color: var(--concise-c-card-hover-border);
}

.post-card:hover aside,
.post-card:focus-within aside {
  color: var(--concise-c-card-hover-meta);
}

.post-card:hover .post-card-more {
  transform: translateX(4px);
}
</style>
