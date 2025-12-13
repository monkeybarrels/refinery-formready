<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200">
    <div class="px-6 py-4 border-b border-slate-200">
      <h2 class="text-lg font-semibold text-slate-900">Correspondence</h2>
    </div>
    <div class="p-6">
      <div v-if="items.length === 0" class="text-center py-8 text-slate-500">
        <Icon name="heroicons:envelope" class="w-12 h-12 mx-auto text-slate-300" />
        <p class="mt-2">No correspondence for this claim</p>
      </div>
      <ul v-else class="space-y-4">
        <li v-for="item in items" :key="item.id" class="p-4 bg-slate-50 rounded-lg">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-medium text-slate-900">{{ item.title }}</h3>
              <p class="text-sm text-slate-500 capitalize">{{ formatType(item.type) }}</p>
            </div>
            <span class="text-xs text-slate-400">{{ formatDate(item.date) }}</span>
          </div>
          <p v-if="item.summary" class="mt-2 text-sm text-slate-600">{{ item.summary }}</p>
          <div v-if="item.actionRequired" class="mt-3 flex items-center text-sm text-amber-600">
            <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 mr-1" />
            Action Required
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Correspondence } from '~/types/claimready'

defineProps<{
  items: Correspondence[]
}>()

const formatType = (type: string) => {
  return type.replace(/_/g, ' ')
}

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
