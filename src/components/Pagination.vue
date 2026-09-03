<script setup lang="ts">
import { computed } from 'vue'
import { pageUrl, useConcise } from '../posts'

const props = defineProps<{
  total: number
  perPage: number
  current: number
}>()

const { labels } = useConcise()

const totalPages = computed(() => Math.ceil(props.total / props.perPage))
</script>

<template>
  <nav v-if="totalPages > 1" class="pagination-wrapper" :aria-label="labels.pagination">
    <ul class="pagination">
      <li :class="{ disabled: current === 1 }">
        <a v-if="current > 1" :href="pageUrl(current - 1)">{{ labels.prevPage }}</a>
        <span v-else>{{ labels.prevPage }}</span>
      </li>
      <li v-for="page in totalPages" :key="page" :class="{ active: page === current }">
        <a v-if="page !== current" :href="pageUrl(page)">{{ page }}</a>
        <span v-else aria-current="page">{{ page }}</span>
      </li>
      <li :class="{ disabled: current === totalPages }">
        <a v-if="current < totalPages" :href="pageUrl(current + 1)">{{ labels.nextPage }}</a>
        <span v-else>{{ labels.nextPage }}</span>
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
}

.pagination > li > * {
  position: relative;
  float: left;
  padding: 6px 12px;
  margin-left: -1px;
  font-size: 14px;
  line-height: 1.42857143;
  color: var(--concise-c-pagination-text);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  text-decoration: none;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
}

.pagination > li:first-child > * {
  margin-left: 0;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.pagination > li:last-child > * {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.pagination a:hover,
.pagination a:focus-visible {
  z-index: 3;
  color: var(--vp-c-brand-1);
  background-color: var(--concise-c-pagination-hover-bg);
  border-color: var(--concise-c-pagination-hover-border);
}

.pagination > .active > span {
  z-index: 2;
  color: var(--concise-c-pagination-active-text);
  background-color: var(--concise-c-pagination-active-bg);
  border-color: var(--concise-c-pagination-active-bg);
}

.pagination > .disabled > span {
  color: var(--concise-c-pagination-disabled-text);
  cursor: not-allowed;
}
</style>
