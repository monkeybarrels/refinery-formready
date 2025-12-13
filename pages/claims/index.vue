<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Page Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Claims</h1>
            <p class="mt-1 text-sm text-slate-600">
              View your VA disability claims history
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex items-center text-sm text-slate-500">
              <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-1" />
              Last synced: {{ lastSynced }}
            </div>
            <a
              href="https://va.gov/my-va/"
              target="_blank"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 mr-2" />
              Sync from VA.gov
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Filter Tabs -->
      <div class="mb-6">
        <nav class="flex space-x-4">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            @click="setActiveFilter(tab.value)"
            class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="activeFilter === tab.value
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="ml-2 px-2 py-0.5 text-xs rounded-full"
                  :class="activeFilter === tab.value ? 'bg-blue-200' : 'bg-slate-200'">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Loading State -->
      <SkeletonsClaimsListSkeleton v-if="loading" />

      <!-- Claims List -->
      <div v-else-if="filteredClaims.length > 0" class="space-y-4">
        <NuxtLink
          v-for="claim in filteredClaims"
          :key="claim.id"
          :to="`/claims/${claim.id}`"
          class="block bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div class="p-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <h3 class="font-semibold text-slate-900 capitalize">{{ claim.type }} Claim</h3>
                  <StatusBadge :status="claim.status" />
                </div>
                <p class="mt-1 text-sm text-slate-500">
                  Filed {{ formatDate(claim.filedDate) }}
                  <span v-if="claim.closedDate"> • Closed {{ formatDate(claim.closedDate) }}</span>
                </p>
              </div>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400" />
            </div>

            <!-- Conditions Preview -->
            <div class="mt-4 flex flex-wrap gap-2">
              <span
                v-for="claimCondition in claim.conditions?.slice(0, 3)"
                :key="claimCondition.conditionId"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700"
              >
                {{ getConditionName(claimCondition.conditionId) }}
              </span>
              <span
                v-if="claim.conditions && claim.conditions.length > 3"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500"
              >
                +{{ claim.conditions.length - 3 }} more
              </span>
            </div>

            <!-- Status Progress (for active claims) -->
            <div v-if="claim.status === 'pending' || claim.status === 'in_review'" class="mt-4 pt-4 border-t border-slate-100">
              <div class="flex items-center space-x-2 text-sm">
                <span class="text-slate-500">Status:</span>
                <span class="font-medium text-amber-600">{{ getStatusLabel(claim.status) }}</span>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <Icon name="heroicons:document-text" class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="text-lg font-medium text-slate-900">No claims found</h3>
        <p class="mt-2 text-slate-500 max-w-sm mx-auto">
          {{ activeFilter === 'all'
            ? 'Sync your VA.gov account to import your claims history.'
            : 'No claims match the selected filter.' }}
        </p>
        <a
          v-if="activeFilter === 'all'"
          href="https://va.gov/my-va/"
          target="_blank"
          class="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 mr-2" />
          Open VA.gov to Sync
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Navigation from '~/components/organisms/Navigation.vue'
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import { getClaimsAdapter, getConditionsAdapter, getVeteranAdapter } from '~/adapters'
import type { Claim, Condition, ClaimFilter } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

useHead({
  title: 'Claims - ClaimReady'
})

const route = useRoute()
const router = useRouter()

// Valid filter values for URL sync
const validFilters: ClaimFilter[] = ['all', 'active', 'completed', 'appeals']

const getInitialFilter = (): ClaimFilter => {
  const filterFromUrl = route.query.filter as string
  return validFilters.includes(filterFromUrl as ClaimFilter) ? filterFromUrl as ClaimFilter : 'all'
}

const setActiveFilter = (filter: ClaimFilter) => {
  activeFilter.value = filter
  router.replace({
    query: { ...route.query, filter }
  })
}

// State
const loading = ref(true)
const claims = ref<Claim[]>([])
const conditions = ref<Condition[]>([])
const lastSynced = ref('Never')
const activeFilter = ref<ClaimFilter>(getInitialFilter())

// Filter tabs
const tabs = computed(() => [
  { label: 'All', value: 'all' as ClaimFilter, count: claims.value.length },
  { label: 'Active', value: 'active' as ClaimFilter, count: claims.value.filter(c => c.status === 'pending' || c.status === 'in_review').length },
  { label: 'Completed', value: 'completed' as ClaimFilter, count: claims.value.filter(c => c.status === 'granted' || c.status === 'denied').length },
  { label: 'Appeals', value: 'appeals' as ClaimFilter, count: claims.value.filter(c => c.type === 'appeal').length }
])

// Computed
const filteredClaims = computed(() => {
  switch (activeFilter.value) {
    case 'active':
      return claims.value.filter(c => c.status === 'pending' || c.status === 'in_review')
    case 'completed':
      return claims.value.filter(c => c.status === 'granted' || c.status === 'denied')
    case 'appeals':
      return claims.value.filter(c => c.type === 'appeal')
    default:
      return claims.value
  }
})

// Methods
const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getConditionName = (id: string) => {
  const condition = conditions.value.find(c => c.id === id)
  return condition?.name || id
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'Pending Initial Review'
    case 'in_review': return 'Under Review'
    case 'granted': return 'Granted'
    case 'denied': return 'Denied'
    default: return status
  }
}

// Load data
onMounted(async () => {
  try {
    const [claimsData, conditionsData, veteranData] = await Promise.all([
      getClaimsAdapter().getAll(),
      getConditionsAdapter().getAll(),
      getVeteranAdapter().getProfile()
    ])

    claims.value = claimsData
    conditions.value = conditionsData

    if (veteranData?.lastSyncedAt) {
      const syncDate = new Date(veteranData.lastSyncedAt)
      lastSynced.value = syncDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      })
    }
  } catch (error) {
    console.error('Failed to load claims:', error)
  } finally {
    loading.value = false
  }
})
</script>
