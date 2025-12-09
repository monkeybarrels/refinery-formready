<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Page Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p class="mt-1 text-sm text-slate-600">
          Welcome back! Here's an overview of your VA disability claim status.
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Spinner class="w-8 h-8" />
        <span class="ml-3 text-slate-600">Loading your dashboard...</span>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-8">
        <!-- Stats Row -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Combined Rating Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600">Combined Rating</p>
                <p class="mt-2 text-3xl font-bold text-blue-600">{{ veteran?.combinedRating || 0 }}%</p>
              </div>
              <div class="p-3 bg-blue-50 rounded-lg">
                <Icon name="heroicons:chart-pie" class="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <!-- Monthly Award Card -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-slate-600">Monthly Award</p>
                <p class="mt-2 text-3xl font-bold text-green-600">${{ formatCurrency(veteran?.monthlyAward || 0) }}</p>
              </div>
              <div class="p-3 bg-green-50 rounded-lg">
                <Icon name="heroicons:banknotes" class="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <!-- Money Left on Table Card -->
          <NuxtLink to="/conditions" class="block">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:border-amber-300 transition-colors cursor-pointer">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-slate-600">Money Left on Table</p>
                  <p class="mt-2 text-3xl font-bold text-amber-600">${{ formatCurrency(moneyLeftOnTable) }}/mo</p>
                  <p class="mt-1 text-xs text-slate-500">From denied conditions</p>
                </div>
                <div class="p-3 bg-amber-50 rounded-lg">
                  <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Sync Status -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 text-slate-400" />
              <span class="ml-2 text-sm text-slate-600">
                Last synced: {{ veteran?.lastSyncedAt ? formatDate(veteran.lastSyncedAt) : 'Never' }}
              </span>
            </div>
            <a
              href="https://va.gov/my-va/"
              target="_blank"
              class="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
            >
              Open VA.gov to Sync
              <Icon name="heroicons:arrow-top-right-on-square" class="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Action Items -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-200">
              <h2 class="text-lg font-semibold text-slate-900">Priority Actions</h2>
            </div>
            <div class="p-6">
              <div v-if="actionItems.length === 0" class="text-center py-8 text-slate-500">
                <Icon name="heroicons:check-circle" class="w-12 h-12 mx-auto text-green-500" />
                <p class="mt-2">All caught up! No pending actions.</p>
              </div>
              <ul v-else class="space-y-3">
                <li v-for="item in actionItems.slice(0, 5)" :key="item.id" class="flex items-start">
                  <input
                    type="checkbox"
                    :checked="item.completed"
                    class="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300"
                    @change="toggleAction(item.id)"
                  />
                  <div class="ml-3">
                    <p class="text-sm text-slate-900">{{ item.title }}</p>
                    <p v-if="item.description" class="text-xs text-slate-500">{{ item.description }}</p>
                  </div>
                </li>
              </ul>
              <div v-if="actionItems.length > 5" class="mt-4 text-center">
                <NuxtLink to="/packages" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Show {{ actionItems.length - 5 }} more →
                </NuxtLink>
              </div>
            </div>
          </div>

          <!-- Active Claims -->
          <div class="bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Active Claims</h2>
              <NuxtLink to="/claims" class="text-sm font-medium text-blue-600 hover:text-blue-700">
                View All →
              </NuxtLink>
            </div>
            <div class="p-6">
              <div v-if="activeClaims.length === 0" class="text-center py-8 text-slate-500">
                <Icon name="heroicons:document-text" class="w-12 h-12 mx-auto text-slate-300" />
                <p class="mt-2">No active claims</p>
              </div>
              <ul v-else class="space-y-4">
                <li v-for="claim in activeClaims" :key="claim.id">
                  <NuxtLink :to="`/claims/${claim.id}`" class="block p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-slate-900 capitalize">{{ claim.type }} Claim</span>
                      <StatusBadge :status="claim.status" />
                    </div>
                    <p class="mt-1 text-xs text-slate-500">
                      Filed {{ formatDate(claim.filedDate) }} • {{ claim.conditionIds?.length || 0 }} conditions
                    </p>
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Active Packages -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200">
          <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-slate-900">Your Packages</h2>
            <NuxtLink to="/packages" class="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All →
            </NuxtLink>
          </div>
          <div class="p-6">
            <div v-if="packages.length === 0" class="text-center py-8">
              <Icon name="heroicons:folder-plus" class="w-12 h-12 mx-auto text-slate-300" />
              <p class="mt-2 text-slate-500">No packages yet</p>
              <NuxtLink to="/packages" class="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                Create Your First Package →
              </NuxtLink>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <NuxtLink
                v-for="pkg in packages"
                :key="pkg.id"
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
                      class="bg-blue-600 h-2 rounded-full transition-all"
                      :style="{ width: `${pkg.progress}%` }"
                    ></div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import Navigation from '~/components/organisms/Navigation.vue'
import Spinner from '~/components/atoms/Spinner.vue'
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import {
  getVeteranAdapter,
  getClaimsAdapter,
  getConditionsAdapter,
  getPackagesAdapter,
  getActionsAdapter
} from '~/adapters'
import type { Veteran, Claim, Condition, Package, ActionItem } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

useHead({
  title: 'Dashboard - ClaimReady'
})

// State
const loading = ref(true)
const veteran = ref<Veteran | null>(null)
const claims = ref<Claim[]>([])
const conditions = ref<Condition[]>([])
const packages = ref<Package[]>([])
const actionItems = ref<ActionItem[]>([])

// Computed
const activeClaims = computed(() =>
  claims.value.filter(c => c.status === 'pending' || c.status === 'in_review')
)

const moneyLeftOnTable = computed(() =>
  conditions.value
    .filter(c => c.status === 'denied')
    .reduce((sum, c) => sum + (c.potentialMonthly || 0), 0)
)

// Methods
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const toggleAction = async (id: string) => {
  try {
    const adapter = getActionsAdapter()
    await adapter.toggleComplete(id)
    // Refresh action items
    actionItems.value = await adapter.getTopPriority(10)
  } catch (error) {
    console.error('Failed to toggle action:', error)
  }
}

// Load data
onMounted(async () => {
  try {
    const [veteranData, claimsData, conditionsData, packagesData, actionsData] = await Promise.all([
      getVeteranAdapter().get(),
      getClaimsAdapter().getAll(),
      getConditionsAdapter().getAll(),
      getPackagesAdapter().getActive(),
      getActionsAdapter().getTopPriority(10)
    ])

    veteran.value = veteranData
    claims.value = claimsData
    conditions.value = conditionsData
    packages.value = packagesData
    actionItems.value = actionsData
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
})
</script>
