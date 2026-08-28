<script setup lang="ts">
defineProps<{
  title: string
  date: string
  url: string
}>()
</script>

<template>
  <li class="post-card">
    <a :href="url" class="post-card-link">
      <h3>{{ title }}</h3>
      <aside>
        <div class="post-card-date">{{ date }}</div>
        <div class="post-card-more">→</div>
      </aside>
    </a>
  </li>
</template>

<style scoped>
.post-card {
  /* 不设 flex-basis：宽度由标题长度自然决定，同一行卡片才不会有的换行有的不换行 */
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
