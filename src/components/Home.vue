<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { useConcise, usePosts } from '../posts'
import PostList from './PostList.vue'
import Pagination from './Pagination.vue'

const { frontmatter, params } = useData()
const posts = usePosts()
const { perPage } = useConcise()

const current = computed(() => Number(params.value?.page ?? 1))

const paged = computed(() => posts.slice((current.value - 1) * perPage, current.value * perPage))
</script>

<template>
  <main class="concise-page">
    <header v-if="frontmatter.heroText || frontmatter.tagline" class="hero">
      <h1 v-if="frontmatter.heroText">{{ frontmatter.heroText }}</h1>
      <p v-if="frontmatter.tagline" class="tagline">{{ frontmatter.tagline }}</p>
    </header>

    <PostList :posts="paged" />

    <Pagination :total="posts.length" :per-page="perPage" :current="current" />
  </main>
</template>

<style scoped>
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
</style>
