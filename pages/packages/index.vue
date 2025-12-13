<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Page Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">Packages</h1>
            <p class="mt-1 text-sm text-slate-600">
              Manage your claim packages and track progress
            </p>
          </div>
          <button
            @click="showCreateModal = true"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
            New Package
          </button>
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
            @click="activeFilter = tab.value"
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
      <SkeletonsPackagesListSkeleton v-if="loading" />

      <!-- Packages Grid -->
      <div v-else-if="filteredPackages.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink
          v-for="pkg in filteredPackages"
          :key="pkg.id"
          :to="`/packages/${pkg.id}`"
          class="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div class="p-6">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-slate-900">{{ pkg.name }}</h3>
                <p class="text-sm text-slate-500 capitalize">{{ pkg.goal }}</p>
              </div>
              <StatusBadge :status="pkg.status" size="sm" />
            </div>

            <!-- Progress -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-sm mb-1">
                <span class="text-slate-600">Progress</span>
                <span class="font-medium text-slate-900">{{ pkg.progress }}%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all"
                  :class="pkg.progress === 100 ? 'bg-green-500' : 'bg-blue-600'"
                  :style="{ width: `${pkg.progress}%` }"
                ></div>
              </div>
            </div>

            <!-- Potential Value -->
            <div class="flex items-center justify-between pt-4 border-t border-slate-100">
              <span class="text-sm text-slate-500">Potential Monthly</span>
              <span class="text-lg font-bold text-green-600">${{ formatCurrency(pkg.potentialMonthly || 0) }}</span>
            </div>

            <!-- Footer -->
            <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span class="text-xs text-slate-400">
                Updated {{ formatDate(pkg.updatedAt) }}
              </span>
              <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <Icon name="heroicons:folder-plus" class="w-8 h-8 text-slate-400" />
        </div>
        <h3 class="text-lg font-medium text-slate-900">No packages yet</h3>
        <p class="mt-2 text-slate-500 max-w-sm mx-auto">
          Create a package to start organizing your evidence and forms for a VA claim.
        </p>
        <button
          @click="showCreateModal = true"
          class="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Create Your First Package
        </button>
      </div>
    </div>

    <!-- Create Package Modal (placeholder) -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-slate-900">Create New Package</h2>
          <button @click="showCreateModal = false" class="text-slate-400 hover:text-slate-600">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="createPackage" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Package Name</label>
            <input
              v-model="newPackage.name"
              type="text"
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., PTSD Increase Claim"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Goal</label>
            <select
              v-model="newPackage.goal"
              required
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select a goal...</option>
              <option value="new">New Claim</option>
              <option value="increase">Rating Increase</option>
              <option value="secondary">Secondary Condition</option>
              <option value="supplemental">Supplemental Claim</option>
              <option value="appeal">Appeal</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Target Conditions</label>
            <div class="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3">
              <label
                v-for="condition in availableConditions"
                :key="condition.id"
                class="flex items-center"
              >
                <input
                  type="checkbox"
                  :value="condition.id"
                  v-model="newPackage.targetConditionIds"
                  class="h-4 w-4 text-blue-600 rounded border-slate-300"
                />
                <span class="ml-2 text-sm text-slate-700">{{ condition.name }}</span>
              </label>
            </div>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="showCreateModal = false"
              class="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {{ creating ? 'Creating...' : 'Create Package' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import Navigation from '~/components/organisms/Navigation.vue'
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import { getPackagesAdapter, getConditionsAdapter } from '~/adapters'
import type { Package, Condition, PackageFilter } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

useHead({
  title: 'Packages - ClaimReady'
})

// State
const loading = ref(true)
const packages = ref<Package[]>([])
const availableConditions = ref<Condition[]>([])
const activeFilter = ref<PackageFilter>('active')
const showCreateModal = ref(false)
const creating = ref(false)

const newPackage = reactive({
  name: '',
  goal: '' as Package['goal'] | '',
  targetConditionIds: [] as string[]
})

// Filter tabs
const tabs = computed(() => [
  { label: 'Active', value: 'active' as PackageFilter, count: packages.value.filter(p => p.status === 'active').length },
  { label: 'Submitted', value: 'submitted' as PackageFilter, count: packages.value.filter(p => p.status === 'submitted').length },
  { label: 'Completed', value: 'completed' as PackageFilter, count: packages.value.filter(p => p.status === 'completed').length },
  { label: 'All', value: 'all' as PackageFilter }
])

// Computed
const filteredPackages = computed(() => {
  if (activeFilter.value === 'all') return packages.value
  return packages.value.filter(p => p.status === activeFilter.value)
})

// Methods
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const createPackage = async () => {
  if (!newPackage.name || !newPackage.goal) return

  creating.value = true
  try {
    const adapter = getPackagesAdapter()
    const created = await adapter.create({
      name: newPackage.name,
      goal: newPackage.goal as Package['goal'],
      targetConditionIds: newPackage.targetConditionIds
    })

    packages.value.unshift(created)
    showCreateModal.value = false

    // Reset form
    newPackage.name = ''
    newPackage.goal = ''
    newPackage.targetConditionIds = []

    // Navigate to new package
    navigateTo(`/packages/${created.id}`)
  } catch (error) {
    console.error('Failed to create package:', error)
  } finally {
    creating.value = false
  }
}

// Load data
onMounted(async () => {
  try {
    const [packagesData, conditionsData] = await Promise.all([
      getPackagesAdapter().getAll(),
      getConditionsAdapter().getAll()
    ])

    packages.value = packagesData
    availableConditions.value = conditionsData
  } catch (error) {
    console.error('Failed to load packages:', error)
  } finally {
    loading.value = false
  }
})
</script>
