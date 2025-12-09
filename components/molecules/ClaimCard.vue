<template>
  <NuxtLink :to="`/claims/${claim.id}`" class="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-slate-900 capitalize">{{ claim.type }} Claim</span>
      <StatusBadge :status="claim.status" />
    </div>
    <p class="mt-1 text-xs text-slate-500">
      Filed {{ formatDate(claim.filedDate) }} • {{ claim.conditionIds?.length || 0 }} conditions
    </p>
  </NuxtLink>
</template>

<script setup lang="ts">
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import type { Claim } from '~/types/claimready'

interface Props {
  claim: Claim
}

defineProps<Props>()

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
