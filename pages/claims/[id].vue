<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <Spinner class="w-8 h-8" />
      <span class="ml-3 text-slate-600">Loading claim details...</span>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!claim" class="flex flex-col items-center justify-center min-h-screen">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-slate-300" />
      <h2 class="mt-4 text-xl font-semibold text-slate-900">Claim not found</h2>
      <NuxtLink to="/claims" class="mt-4 text-blue-600 hover:text-blue-700">
        ← Back to Claims
      </NuxtLink>
    </div>

    <!-- Claim Detail -->
    <div v-else>
      <!-- Page Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <NuxtLink to="/claims" class="text-sm text-blue-600 hover:text-blue-700 flex items-center mb-4">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
            Back to Claims
          </NuxtLink>
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900 capitalize">{{ claim.type }} Claim</h1>
              <p class="mt-1 text-sm text-slate-600">
                Filed {{ formatDate(claim.filedDate) }}
                <span v-if="claim.closedDate"> • Closed {{ formatDate(claim.closedDate) }}</span>
              </p>
            </div>
            <StatusBadge :status="claim.status" size="lg" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Column -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Status Timeline -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-6">Claim Status</h2>

              <div class="relative">
                <!-- Progress Line -->
                <div class="absolute top-4 left-0 right-0 h-1 bg-slate-200">
                  <div
                    class="h-full bg-blue-600 transition-all"
                    :style="{ width: getProgressWidth() }"
                  ></div>
                </div>

                <!-- Status Steps -->
                <div class="relative flex justify-between">
                  <div v-for="(step, index) in statusSteps" :key="step.id" class="flex flex-col items-center">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center z-10"
                      :class="getStepClass(index)"
                    >
                      <Icon
                        v-if="isStepComplete(index)"
                        name="heroicons:check"
                        class="w-5 h-5"
                      />
                      <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
                    </div>
                    <p class="mt-2 text-xs text-center max-w-20" :class="isStepComplete(index) || isCurrentStep(index) ? 'text-slate-900 font-medium' : 'text-slate-400'">
                      {{ step.label }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Current Status Description -->
              <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-800">
                  <strong>Current Status:</strong> {{ getStatusDescription() }}
                </p>
              </div>
            </div>

            <!-- Conditions -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">Conditions in This Claim</h2>
              </div>
              <div class="divide-y divide-slate-200">
                <div v-if="claimConditions.length === 0" class="p-6 text-center text-slate-500">
                  No conditions linked to this claim
                </div>
                <NuxtLink
                  v-for="condition in claimConditions"
                  :key="condition.id"
                  :to="`/conditions/${condition.id}`"
                  class="block px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-slate-900">{{ condition.name }}</h3>
                      <p class="text-sm text-slate-500">DC {{ condition.diagnosticCode }}</p>
                    </div>
                    <div class="flex items-center space-x-4">
                      <StatusBadge :status="condition.status" size="sm" />
                      <span v-if="condition.rating" class="text-lg font-bold text-green-600">
                        {{ condition.rating }}%
                      </span>
                      <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </NuxtLink>
              </div>
            </div>

            <!-- Correspondence -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-semibold text-slate-900">Correspondence</h2>
              </div>
              <div class="p-6">
                <div v-if="correspondence.length === 0" class="text-center py-8 text-slate-500">
                  <Icon name="heroicons:envelope" class="w-12 h-12 mx-auto text-slate-300" />
                  <p class="mt-2">No correspondence for this claim</p>
                </div>
                <ul v-else class="space-y-4">
                  <li v-for="item in correspondence" :key="item.id" class="p-4 bg-slate-50 rounded-lg">
                    <div class="flex items-start justify-between">
                      <div>
                        <h3 class="font-medium text-slate-900">{{ item.title }}</h3>
                        <p class="text-sm text-slate-500 capitalize">{{ item.type.replace('_', ' ') }}</p>
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
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Claim Summary -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 class="font-semibold text-slate-900 mb-4">Claim Summary</h2>
              <dl class="space-y-4">
                <div>
                  <dt class="text-sm text-slate-500">Claim Type</dt>
                  <dd class="font-medium text-slate-900 capitalize">{{ claim.type }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-slate-500">Filed Date</dt>
                  <dd class="font-medium text-slate-900">{{ formatDate(claim.filedDate) }}</dd>
                </div>
                <div v-if="claim.closedDate">
                  <dt class="text-sm text-slate-500">Closed Date</dt>
                  <dd class="font-medium text-slate-900">{{ formatDate(claim.closedDate) }}</dd>
                </div>
                <div>
                  <dt class="text-sm text-slate-500">Conditions</dt>
                  <dd class="font-medium text-slate-900">{{ claim.conditionIds?.length || 0 }}</dd>
                </div>
              </dl>
            </div>

            <!-- Action Items -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="font-semibold text-slate-900">Action Items</h2>
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

            <!-- Related Packages -->
            <div class="bg-white rounded-xl shadow-sm border border-slate-200">
              <div class="px-6 py-4 border-b border-slate-200">
                <h2 class="font-semibold text-slate-900">Related Packages</h2>
              </div>
              <div class="p-6">
                <div v-if="relatedPackages.length === 0" class="text-center py-4 text-slate-500">
                  No packages linked to this claim
                </div>
                <ul v-else class="space-y-3">
                  <li v-for="pkg in relatedPackages" :key="pkg.id">
                    <NuxtLink
                      :to="`/packages/${pkg.id}`"
                      class="block p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <p class="font-medium text-slate-900">{{ pkg.name }}</p>
                      <div class="mt-1 flex items-center justify-between text-sm">
                        <span class="text-slate-500">{{ pkg.progress }}% complete</span>
                        <StatusBadge :status="pkg.status" size="sm" />
                      </div>
                    </NuxtLink>
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
import {
  getClaimsAdapter,
  getConditionsAdapter,
  getActionsAdapter,
  getPackagesAdapter
} from '~/adapters'
import type { Claim, Condition, ActionItem, Package, Correspondence } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

const route = useRoute()

// State
const loading = ref(true)
const claim = ref<Claim | null>(null)
const claimConditions = ref<Condition[]>([])
const actionItems = ref<ActionItem[]>([])
const relatedPackages = ref<Package[]>([])
const correspondence = ref<Correspondence[]>([])

// Status steps
const statusSteps = [
  { id: 'submitted', label: 'Submitted' },
  { id: 'review', label: 'Initial Review' },
  { id: 'evidence', label: 'Evidence Gathering' },
  { id: 'rating', label: 'Rating' },
  { id: 'decision', label: 'Decision' }
]

// Methods
const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getCurrentStepIndex = () => {
  if (!claim.value) return 0
  switch (claim.value.status) {
    case 'pending': return 1
    case 'in_review': return 2
    case 'granted':
    case 'denied': return 4
    default: return 0
  }
}

const getProgressWidth = () => {
  const index = getCurrentStepIndex()
  return `${(index / (statusSteps.length - 1)) * 100}%`
}

const isStepComplete = (index: number) => {
  return index < getCurrentStepIndex()
}

const isCurrentStep = (index: number) => {
  return index === getCurrentStepIndex()
}

const getStepClass = (index: number) => {
  if (isStepComplete(index)) {
    return 'bg-blue-600 text-white'
  }
  if (isCurrentStep(index)) {
    return 'bg-blue-600 text-white ring-4 ring-blue-200'
  }
  return 'bg-white border-2 border-slate-300 text-slate-400'
}

const getStatusDescription = () => {
  if (!claim.value) return ''
  switch (claim.value.status) {
    case 'pending': return 'Your claim has been submitted and is awaiting initial review.'
    case 'in_review': return 'A VA reviewer is evaluating your claim and evidence.'
    case 'granted': return 'Your claim has been granted. Check your conditions for rating details.'
    case 'denied': return 'Your claim was denied. You may be eligible to appeal or file a supplemental claim.'
    default: return ''
  }
}

// Load data
onMounted(async () => {
  const id = route.params.id as string

  try {
    const claimData = await getClaimsAdapter().getById(id)
    claim.value = claimData

    if (claimData) {
      // Set page title
      useHead({
        title: `${claimData.type.charAt(0).toUpperCase() + claimData.type.slice(1)} Claim - ClaimReady`
      })

      // Load related data
      const [conditionsData, actionsData, packagesData, correspondenceData] = await Promise.all([
        claimData.conditionIds?.length
          ? Promise.all(claimData.conditionIds.map(id => getConditionsAdapter().getById(id)))
          : Promise.resolve([]),
        getActionsAdapter().getByClaimId(id),
        getPackagesAdapter().getAll().then(pkgs =>
          pkgs.filter(p => p.targetConditions?.some(c => claimData.conditionIds?.includes(c)))
        ),
        getClaimsAdapter().getCorrespondence(id)
      ])

      claimConditions.value = conditionsData.filter(Boolean) as Condition[]
      actionItems.value = actionsData
      relatedPackages.value = packagesData
      correspondence.value = correspondenceData
    }
  } catch (error) {
    console.error('Failed to load claim details:', error)
  } finally {
    loading.value = false
  }
})
</script>
