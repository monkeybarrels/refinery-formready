<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Page Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 class="text-2xl font-bold text-slate-900">My Conditions</h1>
        <p class="mt-1 text-sm text-slate-600">
          View and manage all your VA disability conditions
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <Spinner class="w-8 h-8" />
        <span class="ml-3 text-slate-600">Loading conditions...</span>
      </div>

      <div v-else class="space-y-8">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-green-50 border border-green-200 rounded-xl p-6">
            <div class="flex items-center">
              <Icon name="heroicons:check-circle" class="w-8 h-8 text-green-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-green-800">Granted</p>
                <p class="text-2xl font-bold text-green-900">{{ grantedConditions.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <div class="flex items-center">
              <Icon name="heroicons:x-circle" class="w-8 h-8 text-red-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-red-800">Denied</p>
                <p class="text-2xl font-bold text-red-900">{{ deniedConditions.length }}</p>
              </div>
            </div>
          </div>

          <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <div class="flex items-center">
              <Icon name="heroicons:clock" class="w-8 h-8 text-amber-600" />
              <div class="ml-4">
                <p class="text-sm font-medium text-amber-800">Pending</p>
                <p class="text-2xl font-bold text-amber-900">{{ pendingConditions.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Granted Conditions -->
        <div v-if="grantedConditions.length > 0" class="bg-white rounded-xl shadow-sm border border-slate-200">
          <div class="px-6 py-4 border-b border-slate-200 bg-green-50 rounded-t-xl">
            <h2 class="text-lg font-semibold text-green-900 flex items-center">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              Granted Conditions
            </h2>
          </div>
          <div class="divide-y divide-slate-200">
            <NuxtLink
              v-for="condition in grantedConditions"
              :key="condition.id"
              :to="`/conditions/${condition.id}`"
              class="block px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-900">{{ condition.name }}</h3>
                  <p class="text-sm text-slate-500">DC {{ condition.diagnosticCode }}</p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-green-600">{{ condition.rating }}%</p>
                  <p class="text-sm text-slate-500">${{ formatCurrency(condition.monthlyAmount || 0) }}/mo</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Denied Conditions - Money Left on Table -->
        <div v-if="deniedConditions.length > 0" class="bg-white rounded-xl shadow-sm border border-slate-200">
          <div class="px-6 py-4 border-b border-slate-200 bg-red-50 rounded-t-xl">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-red-900 flex items-center">
                <Icon name="heroicons:currency-dollar" class="w-5 h-5 mr-2" />
                Money Left on Table
              </h2>
              <div class="text-right">
                <p class="text-sm text-red-700">Potential Monthly</p>
                <p class="text-xl font-bold text-red-900">${{ formatCurrency(totalDeniedPotential) }}</p>
              </div>
            </div>
          </div>
          <div class="divide-y divide-slate-200">
            <NuxtLink
              v-for="condition in deniedConditions"
              :key="condition.id"
              :to="`/conditions/${condition.id}`"
              class="block px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-900">{{ condition.name }}</h3>
                  <p class="text-sm text-slate-500">DC {{ condition.diagnosticCode }}</p>
                  <p v-if="condition.denialReason" class="mt-1 text-sm text-red-600">
                    {{ condition.denialReason }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-lg font-bold text-amber-600">${{ formatCurrency(condition.potentialMonthly || 0) }}/mo</p>
                  <p class="text-sm text-slate-500">potential</p>
                  <button class="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                    Fight This →
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Pending Conditions -->
        <div v-if="pendingConditions.length > 0" class="bg-white rounded-xl shadow-sm border border-slate-200">
          <div class="px-6 py-4 border-b border-slate-200 bg-amber-50 rounded-t-xl">
            <h2 class="text-lg font-semibold text-amber-900 flex items-center">
              <Icon name="heroicons:clock" class="w-5 h-5 mr-2" />
              Pending Review
            </h2>
          </div>
          <div class="divide-y divide-slate-200">
            <NuxtLink
              v-for="condition in pendingConditions"
              :key="condition.id"
              :to="`/conditions/${condition.id}`"
              class="block px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-900">{{ condition.name }}</h3>
                  <p class="text-sm text-slate-500">DC {{ condition.diagnosticCode }}</p>
                </div>
                <StatusBadge status="pending" />
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="conditions.length === 0" class="text-center py-12">
          <Icon name="heroicons:document-magnifying-glass" class="w-16 h-16 mx-auto text-slate-300" />
          <h3 class="mt-4 text-lg font-medium text-slate-900">No conditions found</h3>
          <p class="mt-2 text-slate-500">
            Sync your VA.gov account to import your conditions.
          </p>
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
import { getConditionsAdapter } from '~/adapters'
import type { Condition } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

useHead({
  title: 'My Conditions - ClaimReady'
})

// State
const loading = ref(true)
const conditions = ref<Condition[]>([])

// Computed
const grantedConditions = computed(() =>
  conditions.value.filter(c => c.status === 'granted')
)

const deniedConditions = computed(() =>
  conditions.value.filter(c => c.status === 'denied')
)

const pendingConditions = computed(() =>
  conditions.value.filter(c => c.status === 'pending')
)

const totalDeniedPotential = computed(() =>
  deniedConditions.value.reduce((sum, c) => sum + (c.potentialMonthly || 0), 0)
)

// Methods
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// Load data
onMounted(async () => {
  try {
    const adapter = getConditionsAdapter()
    conditions.value = await adapter.getAll()
  } catch (error) {
    console.error('Failed to load conditions:', error)
  } finally {
    loading.value = false
  }
})
</script>
