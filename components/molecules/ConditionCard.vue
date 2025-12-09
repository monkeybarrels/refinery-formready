<template>
  <NuxtLink
    :to="`/conditions/${condition.id}`"
    class="block bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
  >
    <div class="p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3">
            <h3 class="font-semibold text-slate-900">{{ condition.name }}</h3>
            <StatusBadge :status="condition.status" size="sm" />
          </div>
          <p class="mt-1 text-sm text-slate-500">DC {{ condition.diagnosticCode }}</p>
        </div>
        <div class="text-right">
          <div v-if="condition.status === 'granted' && condition.rating" class="text-2xl font-bold text-green-600">
            {{ condition.rating }}%
          </div>
          <div v-if="condition.monthlyAmount" class="text-sm text-slate-500">
            ${{ formatCurrency(condition.monthlyAmount) }}/mo
          </div>
        </div>
      </div>

      <!-- Potential increase indicator -->
      <div
        v-if="showPotential && condition.potentialRating && condition.potentialRating > (condition.rating || 0)"
        class="mt-4 p-3 bg-amber-50 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-amber-700">
            Potential: {{ condition.potentialRating }}%
          </span>
          <span class="text-sm font-medium text-amber-900">
            +${{ formatCurrency((condition.potentialMonthly || 0) - (condition.monthlyAmount || 0)) }}/mo
          </span>
        </div>
      </div>

      <!-- Denied opportunity -->
      <div
        v-if="condition.status === 'denied' && condition.potentialMonthly"
        class="mt-4 p-3 bg-amber-50 rounded-lg"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-amber-700">
            Fight this denial
          </span>
          <span class="text-sm font-medium text-amber-900">
            ${{ formatCurrency(condition.potentialMonthly) }}/mo potential
          </span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import type { Condition } from '~/types/claimready'

interface Props {
  condition: Condition
  showPotential?: boolean
}

withDefaults(defineProps<Props>(), {
  showPotential: true
})

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
</script>
