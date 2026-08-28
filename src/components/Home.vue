<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { useData } from 'vitepress'
import { POSTS_KEY, type ConciseConfig, type Post } from '../posts'
import PostCard from './PostCard.vue'
import Pagination from './Pagination.vue'

const { frontmatter, theme } = useData()

const posts = inject<Post[]>(POSTS_KEY, [])

const perPage = computed(() => {
  const config = (theme.value as { concise?: ConciseConfig }).concise
  return config?.perPage ?? 10
})

const current = ref(1)

const pagedPosts = computed(() =>
  posts.slice((current.value - 1) * perPage.value, current.value * perPage.value)
)

function onPageChange(page: number) {
  current.value = page
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <main class="home">
    <header v-if="frontmatter.heroText || frontmatter.tagline" class="hero">
      <h1 v-if="frontmatter.heroText">{{ frontmatter.heroText }}</h1>
      <p v-if="frontmatter.tagline" class="tagline">{{ frontmatter.tagline }}</p>
    </header>

    <ul class="posts-box">
      <PostCard
        v-for="post of pagedPosts"
        :key="post.url"
        :title="post.title"
        :date="post.date"
        :url="post.url"
      />
    </ul>

    <Pagination
      :total="posts.length"
      :per-page="perPage"
      :current="current"
      @change="onPageChange"
    />
  </main>
</template>

<style scoped>
.home {
  max-width: var(--concise-content-width);
  margin: 0 auto;
  padding: 0 1rem 1.5rem;
}

.hero {
  text-align: center;
}

/*
 * tagline 的行盒比字面高，上方自带 (1.3-1)×1.6rem÷2 = 0.24rem 空白，
 * h1 下边距减去这一截，navbar→heroText 与 heroText→tagline 才视觉等距。
 * VitePress 的 reset 会清掉标题的 margin 与字重，需显式声明。
 */
.hero h1 {
  margin: 1.8rem auto calc(1.8rem - 0.24rem);
  font-size: 3rem;
  font-weight: 600;
  line-height: 1.2;
}

.tagline {
  /* margin-top 必须为 0：否则会和 h1 的下边距折叠，把上面的补偿吃掉 */
  margin: 0 0 1.6rem;
  font-size: 1.6rem;
  line-height: 1.3;
  color: var(--concise-c-hero-tagline);
}

/* 卡片横向排布并自动换行；卡片宽度由标题长度决定（见 PostCard 的 flex-grow） */
.posts-box {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
</style>
