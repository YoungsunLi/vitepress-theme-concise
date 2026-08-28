<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 300
}

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <Transition name="concise-fade">
    <button v-show="visible" class="go-to-top" type="button" aria-label="回到顶部" @click="toTop">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
/* 沿用文章卡片的视觉语言：同样的圆角、边框、投影与 hover 反馈 */
.go-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: var(--vp-z-index-footer, 10);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--concise-shadow);
  cursor: pointer;
  transition: color 0.25s, background-color 0.25s, border-color 0.25s;
}

.go-to-top:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.go-to-top svg {
  width: 1.25rem;
  height: 1.25rem;
}

.concise-fade-enter-active,
.concise-fade-leave-active {
  transition: opacity 0.25s;
}

.concise-fade-enter-from,
.concise-fade-leave-to {
  opacity: 0;
}

@media (max-width: 719px) {
  .go-to-top {
    right: 1.25rem;
    bottom: 1.25rem;
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>
