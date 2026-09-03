<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import { useConcise } from '../posts'

const { isDark, site } = useData()
const giscus = useConcise().giscus!
const box = ref<HTMLElement>()

const theme = () => (isDark.value ? 'dark' : 'light')

onMounted(() => {
  const script = document.createElement('script')
  for (const [name, value] of Object.entries({
    src: 'https://giscus.app/client.js',
    'data-repo': giscus.repo,
    'data-repo-id': giscus.repoId,
    'data-category': giscus.category,
    'data-category-id': giscus.categoryId,
    // 按地址对应 discussion；strict 会连带校验地址哈希，避免匹配到别的帖子
    'data-mapping': 'pathname',
    'data-strict': '1',
    'data-theme': theme(),
    'data-lang': site.value.lang,
    // 滚到评论区才加载，不读评论的人不必为它加载第三方脚本
    'data-loading': 'lazy',
    crossorigin: 'anonymous',
    async: ''
  })) {
    script.setAttribute(name, value)
  }
  box.value!.append(script)
})

/** 站点切换明暗后，通知 giscus 的 iframe 跟着换 */
watch(isDark, () => {
  box.value
    ?.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    ?.contentWindow?.postMessage({ giscus: { setConfig: { theme: theme() } } }, 'https://giscus.app')
})
</script>

<template>
  <div ref="box" class="comments" />
</template>

<style scoped>
.comments {
  margin-top: 2.5rem;
}
</style>
