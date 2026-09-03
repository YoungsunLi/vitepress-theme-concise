<script setup lang="ts">
import type { Post } from '../posts'
import PostCard from './PostCard.vue'

defineProps<{ posts: Post[] }>()
</script>

<template>
  <ul class="posts-box">
    <PostCard v-for="post of posts" :key="post.url" :post="post" />
  </ul>
</template>

<style scoped>
/* 卡片横向排布并自动换行；卡片宽度由标题长度决定（见 PostCard 的 flex-grow） */
.posts-box {
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}
</style>
