<template>
  <NuxtLink
    :to="`/packages/${pkg.id}`"
    class="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
  >
    <h3 class="font-medium text-slate-900">{{ pkg.name }}</h3>
    <p class="text-xs text-slate-500 capitalize">{{ pkg.goal }}</p>
    <div class="mt-3">
      <div class="flex items-center justify-between text-xs text-slate-600 mb-1">
        <span>Progress</span>
        <span>{{ pkg.progress }}%</span>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all"
          :class="pkg.progress === 100 ? 'bg-green-500' : 'bg-blue-600'"
          :style="{ width: `${pkg.progress}%` }"
        ></div>
      </div>
    </div>
    <div v-if="showPotential && pkg.potentialMonthly" class="mt-2 text-right">
      <span class="text-sm font-medium text-green-600">${{ formatCurrency(pkg.potentialMonthly) }}/mo</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Package } from '~/types/claimready'

interface Props {
  pkg: Package
  showPotential?: boolean
}

withDefaults(defineProps<Props>(), {
  showPotential: false
})

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>
