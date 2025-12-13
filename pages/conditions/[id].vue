<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Loading State -->
    <AtomsPageLoader v-if="loading" message="Loading condition details..." />

    <!-- Not Found State -->
    <div v-else-if="!condition" class="flex flex-col items-center justify-center min-h-screen">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-slate-300" />
      <h2 class="mt-4 text-xl font-semibold text-slate-900">Condition not found</h2>
      <NuxtLink to="/conditions" class="mt-4 text-blue-600 hover:text-blue-700">
        ← Back to Conditions
      </NuxtLink>
    </div>

    <!-- Condition Detail -->
    <div v-else>
      <!-- Page Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <NuxtLink to="/conditions" class="text-sm text-blue-600 hover:text-blue-700 flex items-center mb-4">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
            Back to Conditions
          </NuxtLink>
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">{{ condition.name }}</h1>
              <p class="mt-1 text-sm text-slate-600">
                Diagnostic Code: {{ condition.diagnosticCode }}
              </p>
            </div>
            <StatusBadge :status="condition.status" size="lg" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Current Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Current Status</h2>

              <div v-if="condition.status === 'granted'" class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p class="text-sm text-green-700">Current Rating</p>
                    <p class="text-3xl font-bold text-green-800">{{ condition.rating }}%</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-green-700">Monthly Amount</p>
                    <p class="text-2xl font-bold text-green-800">${{ formatCurrency(condition.monthlyAmount || 0) }}</p>
                  </div>
                </div>

                <!-- Increase Opportunity -->
                <div v-if="condition.potentialRating && condition.potentialRating > (condition.rating || 0)"
                     class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-amber-900">Increase Opportunity</h3>
                      <p class="text-sm text-amber-700">
                        You may qualify for {{ condition.potentialRating }}% (currently {{ condition.rating }}%)
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-bold text-amber-900">+${{ formatCurrency((condition.potentialMonthly || 0) - (condition.monthlyAmount || 0)) }}/mo</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else-if="condition.status === 'denied'" class="space-y-4">
                <div class="p-4 bg-red-50 rounded-lg">
                  <p class="font-medium text-red-800">Denial Reason</p>
                  <p class="mt-1 text-sm text-red-700">{{ condition.denialReason || 'No reason provided' }}</p>
                </div>

                <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-amber-900">Fight This Denial</h3>
                      <p class="text-sm text-amber-700">
                        Potential rating: {{ condition.potentialRating }}%
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="text-lg font-bold text-amber-900">${{ formatCurrency(condition.potentialMonthly || 0) }}/mo</p>
                      <button class="mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Start Package
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="p-4 bg-amber-50 rounded-lg">
                <p class="text-amber-800">This condition is currently under VA review.</p>
              </div>
            </div>

            <!-- 38 CFR Rating Criteria -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">38 CFR Rating Criteria</h2>
                <p class="text-sm text-slate-500">Official rating schedule for DC {{ condition.diagnosticCode }}</p>
              </div>
              <div class="divide-y divide-slate-200">
                <div
                  v-for="criteria in condition.ratingCriteria"
                  :key="criteria.rating"
                  class="px-6 py-4"
                  :class="{ 'bg-blue-50 border-l-4 border-blue-500': criteria.rating === condition.rating }"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :class="criteria.rating === condition.rating ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'">
                        {{ criteria.rating }}%
                      </span>
                      <p class="mt-2 text-sm text-slate-700">{{ criteria.description }}</p>
                    </div>
                    <span v-if="criteria.rating === condition.rating" class="text-xs font-medium text-blue-600">
                      Current
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Claim History -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">Claim History</h2>
              </div>
              <div class="p-6">
                <div v-if="relatedClaims.length === 0" class="text-center py-4 text-slate-500">
                  No claim history for this condition
                </div>
                <div v-else class="relative">
                  <div class="absolute top-0 left-4 bottom-0 w-0.5 bg-slate-200"></div>
                  <ul class="space-y-6">
                    <li v-for="claim in relatedClaims" :key="claim.id" class="relative pl-10">
                      <div class="absolute left-2.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white"></div>
                      <NuxtLink :to="`/claims/${claim.id}`" class="block hover:bg-slate-50 -ml-2 -mr-2 p-2 rounded-lg transition-colors">
                        <p class="font-medium text-slate-900 capitalize">{{ claim.type }} Claim</p>
                        <p class="text-sm text-slate-500">Filed {{ formatDate(claim.filedDate) }}</p>
                        <StatusBadge :status="claim.status" size="sm" class="mt-1" />
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Secondary Conditions -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">Secondary Conditions</h2>
                <p class="text-sm text-slate-500">Conditions you may also qualify for</p>
              </div>
              <div class="divide-y divide-slate-200">
                <div v-if="condition.secondaryConditions.length === 0" class="p-6 text-center text-slate-500">
                  No secondary conditions identified
                </div>
                <div
                  v-for="secondary in condition.secondaryConditions"
                  :key="secondary.name"
                  class="px-6 py-4"
                >
                  <h3 class="font-medium text-slate-900">{{ secondary.name }}</h3>
                  <p class="text-sm text-slate-500">DC {{ secondary.diagnosticCode }}</p>
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-xs text-slate-500">{{ secondary.prevalence }}% of veterans</span>
                    <span class="text-sm font-medium text-green-600">+${{ formatCurrency(secondary.potentialMonthly) }}/mo</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Items -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">Action Items</h2>
              </div>
              <div class="p-6">
                <div v-if="actionItems.length === 0" class="text-center py-4 text-slate-500">
                  <Icon name="heroicons:check-circle" class="w-8 h-8 mx-auto text-green-500" />
                  <p class="mt-2">No pending actions</p>
                </div>
                <ul v-else class="space-y-3">
                  <li v-for="item in actionItems" :key="item.id" class="flex items-start">
                    <input
                      type="checkbox"
                      :checked="item.completed"
                      class="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300"
                    />
                    <div class="ml-3">
                      <p class="text-sm text-slate-900">{{ item.title }}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '~/components/organisms/Navigation.vue'
import Spinner from '~/components/atoms/Spinner.vue'
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import { getConditionsAdapter, getClaimsAdapter, getActionsAdapter } from '~/adapters'
import type { Condition, Claim, ActionItem } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

const route = useRoute()

// State
const loading = ref(true)
const condition = ref<Condition | null>(null)
const relatedClaims = ref<Claim[]>([])
const actionItems = ref<ActionItem[]>([])

// Methods
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Load data
onMounted(async () => {
  const id = route.params.id as string

  try {
    const [conditionData, claimsData, actionsData] = await Promise.all([
      getConditionsAdapter().getById(id),
      getClaimsAdapter().getByConditionId(id),
      getActionsAdapter().getByConditionId(id)
    ])

    condition.value = conditionData
    relatedClaims.value = claimsData
    actionItems.value = actionsData

    // Set page title
    if (conditionData) {
      useHead({
        title: `${conditionData.name} - ClaimReady`
      })
    }
  } catch (error) {
    console.error('Failed to load condition details:', error)
  } finally {
    loading.value = false
  }
})
</script>
