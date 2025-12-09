<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <Icon name="heroicons:arrow-path" class="w-5 h-5 text-slate-400" />
        <span class="ml-2 text-sm text-slate-600">
          Last synced: {{ formattedDate }}
        </span>
      </div>
      <a
        :href="syncUrl"
        target="_blank"
        class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
      >
        {{ syncLabel }}
        <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 ml-1" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  lastSyncedAt?: Date | string | null
  syncUrl?: string
  syncLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  syncUrl: 'https://va.gov/my-va/',
  syncLabel: 'Open VA.gov to Sync'
})

const formattedDate = computed(() => {
  if (!props.lastSyncedAt) return 'Never'
  const d = new Date(props.lastSyncedAt)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
})
</script>
