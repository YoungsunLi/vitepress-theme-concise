<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { count, useConcise, usePosts } from '../posts'
import PostList from './PostList.vue'

const { params } = useData()
const posts = usePosts()
const { labels } = useConcise()

const tag = computed(() => params.value!.tag as string)
const tagged = computed(() => posts.filter((p) => p.tags.includes(tag.value)))
</script>

<template>
  <main class="concise-page">
    <h1>{{ tag }}<small>{{ count(labels.postCount, tagged.length) }}</small></h1>
    <PostList :posts="tagged" />
  </main>
</template>
