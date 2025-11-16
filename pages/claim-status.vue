<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation
      :show-new-analysis="true"
      :show-dashboard="true"
      :show-user-menu="true"
    />

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Breadcrumbs -->
        <div class="mb-6">
          <Breadcrumb theme="dark" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">VA Claim Status</h1>
            <p class="text-xl text-blue-100 mb-4">Track your VA claims and disability ratings</p>
          </div>

          <!-- Sync Status Badge -->
          <div v-if="syncStatus" class="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-4">
            <div class="text-sm text-blue-100 mb-1">Last Synced</div>
            <div class="text-lg font-semibold">
              {{ syncStatus.lastSyncAt ? formatRelativeTime(syncStatus.lastSyncAt) : 'Never' }}
            </div>
            <div class="mt-2">
              <span
                :class="syncStatus.isActive ? 'bg-green-500' : 'bg-gray-500'"
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white"
              >
                <span class="w-2 h-2 rounded-full bg-white mr-1.5"></span>
                {{ syncStatus.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LoadingState
        variant="spinner"
        size="md"
        message="Loading your claim data..."
        :full-height="false"
      />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <div class="flex items-start">
          <Icon name="heroicons:exclamation-circle" class="w-6 h-6 text-red-600 mt-0.5 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-red-900 mb-2">Error Loading Claims</h3>
            <p class="text-red-700">{{ error }}</p>
            <button
              @click="fetchData"
              class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Empty State - No Claims -->
      <div v-if="!claims || claims.length === 0" class="text-center py-12">
        <div class="max-w-md mx-auto">
          <Icon name="heroicons:document-text" class="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 class="text-2xl font-bold text-slate-900 mb-2">No Claims Synced</h2>
          <p class="text-slate-600 mb-6">
            You don't have any VA claims synced yet. Install the ClaimReady Chrome extension to sync your claims from VA.gov.
          </p>
          <button
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Learn How to Sync
          </button>
        </div>
      </div>

      <!-- Claims Content -->
      <div v-else>
        <!-- Stats Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Total Claims</p>
                <p class="text-3xl font-bold text-slate-900">{{ claimStats.total }}</p>
              </div>
              <Icon name="heroicons:document-duplicate" class="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Pending</p>
                <p class="text-3xl font-bold text-yellow-600">{{ claimStats.pending }}</p>
              </div>
              <Icon name="heroicons:clock" class="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Completed</p>
                <p class="text-3xl font-bold text-green-600">{{ claimStats.completed }}</p>
              </div>
              <Icon name="heroicons:check-circle" class="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-slate-600 mb-1">Current Rating</p>
                <p class="text-3xl font-bold text-blue-600">{{ currentRating }}%</p>
              </div>
              <Icon name="heroicons:chart-bar" class="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- Claims List -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200">
            <h2 class="text-xl font-bold text-slate-900">Your Claims</h2>
          </div>

          <div class="divide-y divide-slate-200">
            <div
              v-for="claim in claims"
              :key="claim._id"
              class="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              @click="selectedClaim = claim"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-semibold text-slate-900">
                      Claim #{{ claim.vaClaimId }}
                    </h3>
                    <span
                      :class="getStatusBadgeClass(claim.claimStatus)"
                      class="px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {{ claim.claimStatus }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-3">
                    <div>
                      <span class="font-medium">Type:</span> {{ claim.claimType }}
                    </div>
                    <div>
                      <span class="font-medium">Phase:</span> {{ claim.phase || 'N/A' }}
                    </div>
                    <div>
                      <span class="font-medium">Filed:</span> {{ formatDate(claim.claimDate) }}
                    </div>
                    <div v-if="claim.completionDate">
                      <span class="font-medium">Completed:</span> {{ formatDate(claim.completionDate) }}
                    </div>
                  </div>

                  <div v-if="claim.conditions && claim.conditions.length > 0" class="mb-2">
                    <p class="text-sm text-slate-600 mb-1">
                      <span class="font-medium">Conditions ({{ claim.conditions.length }}):</span>
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(condition, idx) in claim.conditions.slice(0, 3)"
                        :key="idx"
                        class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                      >
                        {{ condition.name || condition }}
                      </span>
                      <span
                        v-if="claim.conditions.length > 3"
                        class="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                      >
                        +{{ claim.conditions.length - 3 }} more
                      </span>
                    </div>
                  </div>
                </div>

                <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400 ml-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Claim Detail Modal (TODO: Create separate component) -->
    <div
      v-if="selectedClaim"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedClaim = null"
    >
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-slate-900">Claim #{{ selectedClaim.vaClaimId }}</h2>
          <button
            @click="selectedClaim = null"
            class="text-slate-400 hover:text-slate-600"
          >
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <div class="p-6">
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p class="text-sm text-slate-600 mb-1">Claim Type</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedClaim.claimType }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600 mb-1">Status</p>
              <span
                :class="getStatusBadgeClass(selectedClaim.claimStatus)"
                class="inline-block px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ selectedClaim.claimStatus }}
              </span>
            </div>
            <div>
              <p class="text-sm text-slate-600 mb-1">Current Phase</p>
              <p class="text-lg font-semibold text-slate-900">{{ selectedClaim.phase || 'N/A' }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600 mb-1">Filed Date</p>
              <p class="text-lg font-semibold text-slate-900">{{ formatDate(selectedClaim.claimDate) }}</p>
            </div>
          </div>

          <!-- Conditions -->
          <div v-if="selectedClaim.conditions && selectedClaim.conditions.length > 0" class="mb-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Claimed Conditions</h3>
            <div class="space-y-2">
              <div
                v-for="(condition, idx) in selectedClaim.conditions"
                :key="idx"
                class="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <span class="text-slate-900">{{ condition.name || condition }}</span>
                <span v-if="condition.status" class="text-sm text-slate-600">
                  {{ condition.status }}
                </span>
              </div>
            </div>
          </div>

          <!-- Phase History -->
          <div v-if="selectedClaim.phaseHistory && selectedClaim.phaseHistory.length > 0" class="mb-6">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Phase History</h3>
            <div class="space-y-3">
              <div
                v-for="(phase, idx) in selectedClaim.phaseHistory"
                :key="idx"
                class="flex items-start space-x-3"
              >
                <div class="w-3 h-3 rounded-full bg-blue-600 mt-1.5"></div>
                <div class="flex-1">
                  <p class="font-semibold text-slate-900">{{ phase.phase || phase }}</p>
                  <p v-if="phase.date" class="text-sm text-slate-600">{{ formatDate(phase.date) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Development Items -->
          <div v-if="selectedClaim.developmentItems && selectedClaim.developmentItems.length > 0">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Development Items</h3>
            <div class="space-y-2">
              <div
                v-for="(item, idx) in selectedClaim.developmentItems"
                :key="idx"
                class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p class="text-slate-900">{{ item.description || item }}</p>
                <p v-if="item.status" class="text-sm text-slate-600 mt-1">Status: {{ item.status }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Define types
interface Claim {
  _id: string
  vaClaimId: string
  claimType: string
  claimStatus: string
  phase?: string
  claimDate: string
  completionDate?: string
  conditions?: Array<{ name?: string; status?: string } | string>
  phaseHistory?: Array<{ phase?: string; date?: string } | string>
  developmentItems?: Array<{ description?: string; status?: string } | string>
}

interface SyncStatus {
  lastSyncAt: Date | null
  isActive: boolean
}

// State
const loading = ref(true)
const error = ref<string | null>(null)
const claims = ref<Claim[]>([])
const ratings = ref<any>(null)
const syncStatus = ref<SyncStatus | null>(null)
const selectedClaim = ref<Claim | null>(null)

// Composables
const { apiCall } = useApi()
const { user } = useAuth()

// Computed
const claimStats = computed(() => {
  if (!claims.value) return { total: 0, pending: 0, completed: 0 }

  return {
    total: claims.value.length,
    pending: claims.value.filter(c =>
      c.claimStatus?.toLowerCase().includes('pending') ||
      c.claimStatus?.toLowerCase().includes('evidence') ||
      c.claimStatus?.toLowerCase().includes('review')
    ).length,
    completed: claims.value.filter(c =>
      c.claimStatus?.toLowerCase().includes('closed') ||
      c.claimStatus?.toLowerCase().includes('complete')
    ).length
  }
})

const currentRating = computed(() => {
  if (!ratings.value || !ratings.value.combinedRating) return 0
  return ratings.value.combinedRating
})

// Methods
const fetchData = async () => {
  if (!user.value?.authorizerId) {
    error.value = 'User not authenticated'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null

  try {
    // Fetch claims, ratings, and sync status in parallel
    const [claimsRes, ratingsRes, statusRes] = await Promise.all([
      apiCall(`/api/va-sync/claims/${user.value.authorizerId}`, { method: 'GET' }),
      apiCall(`/api/va-sync/ratings/${user.value.authorizerId}`, { method: 'GET' }),
      apiCall(`/api/va-sync/stats/${user.value.authorizerId}`, { method: 'GET' })
    ])

    if (claimsRes.ok) {
      const claimsData = await claimsRes.json()
      claims.value = claimsData.claims || claimsData || []
    }

    if (ratingsRes.ok) {
      ratings.value = await ratingsRes.json()
    }

    if (statusRes.ok) {
      const statsData = await statusRes.json()
      syncStatus.value = {
        lastSyncAt: statsData.lastSyncAt ? new Date(statsData.lastSyncAt) : null,
        isActive: statsData.isActive ?? true
      }
    }
  } catch (err: any) {
    console.error('Error fetching claim data:', err)
    error.value = err.message || 'Failed to load claim data'
  } finally {
    loading.value = false
  }
}

const getStatusBadgeClass = (status: string) => {
  const statusLower = status?.toLowerCase() || ''

  if (statusLower.includes('closed') || statusLower.includes('complete')) {
    return 'bg-green-100 text-green-800'
  } else if (statusLower.includes('pending') || statusLower.includes('evidence')) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (statusLower.includes('review') || statusLower.includes('decision')) {
    return 'bg-blue-100 text-blue-800'
  } else {
    return 'bg-slate-100 text-slate-800'
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatRelativeTime = (date: Date) => {
  if (!date) return 'Never'

  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return formatDate(date.toString())
}

// Lifecycle
onMounted(() => {
  fetchData()
})

// SEO
useHead({
  title: 'VA Claim Status | ClaimReady',
  meta: [
    { name: 'description', content: 'Track your VA claims and disability ratings with ClaimReady' }
  ]
})
</script>
