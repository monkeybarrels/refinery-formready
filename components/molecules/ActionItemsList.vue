<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200">
    <div class="px-6 py-4 border-b border-slate-200">
      <h2 class="text-lg font-semibold text-slate-900">{{ title }}</h2>
    </div>
    <div class="p-6">
      <div v-if="items.length === 0" class="text-center py-8 text-slate-500">
        <Icon name="heroicons:check-circle" class="w-12 h-12 mx-auto text-green-500" />
        <p class="mt-2">{{ emptyMessage }}</p>
      </div>
      <ul v-else class="space-y-3">
        <li v-for="item in displayedItems" :key="item.id" class="flex items-start">
          <input
            type="checkbox"
            :checked="item.completed"
            class="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300"
            @change="$emit('toggle', item.id)"
          />
          <div class="ml-3">
            <p class="text-sm text-slate-900">{{ item.title }}</p>
            <p v-if="item.description" class="text-xs text-slate-500">{{ item.description }}</p>
          </div>
        </li>
      </ul>
      <div v-if="hasMore" class="mt-4 text-center">
        <NuxtLink :to="moreLink" class="text-sm font-medium text-blue-600 hover:text-blue-700">
          Show {{ remainingCount }} more →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ActionItem } from '~/types/claimready'

interface Props {
  items: ActionItem[]
  title?: string
  emptyMessage?: string
  limit?: number
  moreLink?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Priority Actions',
  emptyMessage: 'All caught up! No pending actions.',
  limit: 5,
  moreLink: '/packages'
})

defineEmits<{
  toggle: [id: string]
}>()

const displayedItems = computed(() => props.items.slice(0, props.limit))
const hasMore = computed(() => props.items.length > props.limit)
const remainingCount = computed(() => props.items.length - props.limit)
</script>
