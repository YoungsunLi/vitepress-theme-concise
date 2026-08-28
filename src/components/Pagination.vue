<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  total: number
  perPage: number
  current: number
}>()

const emit = defineEmits<{ (e: 'change', page: number): void }>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))
const pages = computed(() => Array.from({ length: totalPages.value }, (_, i) => i + 1))

function go(page: number) {
  if (page < 1 || page > totalPages.value || page === props.current) return
  emit('change', page)
}
</script>

<template>
  <nav class="pagination-wrapper" aria-label="文章分页">
    <ul class="pagination">
      <li :class="{ disabled: current === 1 }">
        <button type="button" :disabled="current === 1" @click="go(current - 1)">
          上一页
        </button>
      </li>
      <li v-for="page of pages" :key="page" :class="{ active: page === current }">
        <button
          type="button"
          :aria-current="page === current ? 'page' : undefined"
          @click="go(page)"
        >
          {{ page }}
        </button>
      </li>
      <li :class="{ disabled: current === totalPages }">
        <button type="button" :disabled="current === totalPages" @click="go(current + 1)">
          下一页
        </button>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.pagination-wrapper {
  margin: 20px 8px;
}

.pagination {
  display: inline-block;
  margin: 0;
  padding-left: 0;
  border-radius: 4px;
  box-shadow: var(--concise-shadow);
  user-select: none;
}

.pagination > li {
  display: inline;
  outline: none;
}

.pagination button {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  font-size: 14px;
  line-height: 1.42857143;
  vertical-align: middle;
  color: var(--concise-c-pagination-text);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

.pagination > li:first-child button {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.pagination > li:last-child button {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.pagination button:hover:not(:disabled),
.pagination button:focus-visible:not(:disabled) {
  z-index: 3;
  color: var(--vp-c-brand-1);
  background-color: var(--concise-c-pagination-hover-bg);
  border-color: var(--concise-c-pagination-hover-border);
}

.pagination > .active button,
.pagination > .active button:hover,
.pagination > .active button:focus-visible {
  z-index: 2;
  color: var(--concise-c-pagination-active-text);
  cursor: default;
  background-color: var(--concise-c-pagination-active-bg);
  border-color: var(--concise-c-pagination-active-bg);
}

.pagination > .disabled button,
.pagination > .disabled button:hover {
  color: var(--concise-c-pagination-disabled-text);
  cursor: not-allowed;
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}
</style>
