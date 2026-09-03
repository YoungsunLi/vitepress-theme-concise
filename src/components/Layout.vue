<script setup lang="ts">
import { computed, nextTick, onMounted, useSlots, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import BackToTop from './BackToTop.vue'
import Comments from './Comments.vue'
import { tagUrl, useConcise, usePosts } from '../posts'

const { Layout } = DefaultTheme
const { page } = useData()
const route = useRoute()
const slots = useSlots()
const posts = usePosts()
const { labels, giscus } = useConcise()

/** 当前页对应的文章；relativePath 已经过 rewrite，形如 posts/<slug>/index.md */
const post = computed(() => posts.find((p) => p.url === '/' + page.value.relativePath.replace(/index\.md$/, '')))

/** 正文图片点击放大；切换路由后正文 DOM 已换，要重新绑定 */
const zoom = () => mediumZoom('.vp-doc img', { background: 'var(--vp-c-bg)' })
onMounted(zoom)
watch(() => route.path, () => nextTick(zoom))

/** 主题占用的插槽，其余原样透传给默认主题 */
const OWNED = ['doc-before', 'doc-after', 'layout-bottom']
const passThrough = computed(() => Object.keys(slots).filter((name) => !OWNED.includes(name)))
</script>

<template>
  <Layout>
    <template #doc-before>
      <div v-if="post" class="post-meta">
        {{ labels.publishedAt }} {{ post.date }}
        <template v-for="tag of post.tags" :key="tag">
          · <a :href="tagUrl(tag)">{{ tag }}</a>
        </template>
      </div>
      <slot name="doc-before" />
    </template>

    <template #doc-after>
      <slot name="doc-after" />
      <!-- 按路由重建，切换文章时评论区跟着换 -->
      <Comments v-if="post && giscus" :key="route.path" />
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

.post-meta a {
  color: inherit;
  transition: color 0.25s;
}

.post-meta a:hover {
  color: var(--vp-c-brand-1);
}
</style>
