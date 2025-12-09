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
          <StatCard
            label="Combined Rating"
            :value="veteran?.combinedRating || 0"
            format="percent"
            icon="heroicons:chart-pie"
            variant="blue"
          />
          <StatCard
            label="Monthly Award"
            :value="veteran?.monthlyAward || 0"
            format="currency"
            icon="heroicons:banknotes"
            variant="green"
          />
          <StatCard
            label="Money Left on Table"
            :value="`$${formatCurrency(moneyLeftOnTable)}/mo`"
            icon="heroicons:currency-dollar"
            variant="amber"
            sublabel="From denied conditions"
            to="/conditions"
          />
        </div>

        <!-- Sync Status -->
        <SyncStatusBar :last-synced-at="veteran?.lastSyncedAt" />

        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Action Items -->
          <ActionItemsList
            :items="actionItems"
            @toggle="toggleAction"
          />

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
                  <ClaimCard :claim="claim" />
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
              <PackageCard
                v-for="pkg in packages"
                :key="pkg.id"
                :pkg="pkg"
              />
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
import StatCard from '~/components/molecules/StatCard.vue'
import SyncStatusBar from '~/components/molecules/SyncStatusBar.vue'
import ActionItemsList from '~/components/molecules/ActionItemsList.vue'
import ClaimCard from '~/components/molecules/ClaimCard.vue'
import PackageCard from '~/components/molecules/PackageCard.vue'
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
