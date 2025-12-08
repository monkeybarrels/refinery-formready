<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation
      :show-new-analysis="true"
      :show-dashboard="true"
      :show-user-menu="true"
    />

    <!-- Simplified Hero Section -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-900">Welcome back, {{ user.firstName }}</h1>
            <p class="text-lg text-slate-600 mt-1">{{ user.serviceBranch }} Veteran</p>
          </div>
          <div v-if="isPremium" class="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
            <Icon name="heroicons:star" class="w-4 h-4 mr-1" />
            Premium Member
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <LoadingState
        variant="spinner"
        size="md"
        message="Loading your profile..."
        :full-height="false"
      />
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Main Focus (66%) -->
        <div class="lg:col-span-2 space-y-8">
          
          <!-- 1. RATING CARD (The "North Star") -->
          <div>
            <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Icon name="heroicons:chart-pie" class="w-5 h-5 mr-2 text-blue-600" />
              Current Rating
            </h2>
            
            <RatingSnapshotCard
              v-if="hasExtension && latestSnapshot"
              :combined-rating="latestSnapshot.combinedRating"
              :effective-date="latestSnapshot.effectiveDate"
              :last-sync-date="latestSnapshot.snapshotDate"
              :condition-count="latestSnapshot.conditions.length"
              :conditions="latestSnapshot.conditions"
            />
            
            <ExtensionInstallCTA v-else-if="!hasExtension" />
          </div>

          <!-- 2. MY DECISION LETTERS (Simplified List) -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-slate-900 flex items-center">
                <Icon name="heroicons:document-text" class="w-5 h-5 mr-2 text-blue-600" />
                My Decision Letters
              </h2>
              <Button 
                v-if="recentAnalysis.length > 0"
                @click="navigateTo('/documents')"
                variant="ghost"
                size="sm"
              >
                View All
              </Button>
            </div>

            <div v-if="recentAnalysis.length === 0" class="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon name="heroicons:document-plus" class="w-6 h-6 text-slate-400" />
              </div>
              <h3 class="text-sm font-medium text-slate-900">No letters yet</h3>
              <p class="text-sm text-slate-500 mt-1 mb-4">Upload a decision letter to get started</p>
              <Button 
                @click="navigateTo('/analyze')"
                variant="secondary"
                size="sm"
              >
                Upload Letter
              </Button>
            </div>

            <div v-else class="space-y-3">
              <div 
                v-for="doc in recentAnalysis" 
                :key="doc.documentId"
                class="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition-colors cursor-pointer flex items-center justify-between group"
                @click="navigateTo(`/analysis/${doc.documentId}`)"
              >
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 text-blue-600">
                    <Icon name="heroicons:document-text" class="w-6 h-6" />
                  </div>
                  <div>
                    <h3 class="font-medium text-slate-900">{{ doc.fileName }}</h3>
                    <p class="text-xs text-slate-500">
                      {{ formatDate(doc.analyzedAt) }} • 
                      <span :class="{
                        'text-green-600': doc.status === 'analyzed' || doc.status === 'approved',
                        'text-amber-600': doc.status === 'processing' || doc.status === 'uploaded',
                        'text-red-600': doc.status === 'failed'
                      }">{{ formatStatus(doc.status) }}</span>
                    </p>
                  </div>
                </div>
                <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column: Actions & Support (33%) -->
        <div class="space-y-6">
          
          <!-- Quick Actions -->
          <div class="bg-white rounded-xl border border-slate-200 p-6">
            <h3 class="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div class="space-y-3">
              <button 
                @click="navigateTo('/analyze')"
                class="w-full flex items-center p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                <Icon name="heroicons:arrow-up-tray" class="w-5 h-5 mr-3" />
                Upload New Letter
              </button>
              
              <button 
                @click="navigateTo('/documents')"
                class="w-full flex items-center p-3 rounded-lg bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors font-medium text-sm"
              >
                <Icon name="heroicons:folder-open" class="w-5 h-5 mr-3" />
                View All Documents
              </button>
            </div>
          </div>

          <!-- Need Help? -->
          <div class="bg-slate-900 rounded-xl p-6 text-white">
            <h3 class="font-semibold mb-2">Need Help?</h3>
            <p class="text-sm text-slate-300 mb-4">Our team of VA experts is here to help you understand your rating.</p>
            <Button 
              variant="secondary" 
              class="w-full justify-center"
              @click="navigateTo('/support')"
            >
              Contact Support
            </Button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '~/components/atoms/Button.vue'
import Badge from '~/components/atoms/Badge.vue'
import Navigation from '~/components/organisms/Navigation.vue'
import PremiumBadge from '~/components/atoms/PremiumBadge.vue'
import EmptyState from '~/components/molecules/EmptyState.vue'
import LoadingState from '~/components/molecules/LoadingState.vue'
import UserStateCard from '~/components/molecules/UserStateCard.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'
import RatingSnapshotCard from '~/components/organisms/RatingSnapshotCard.vue'
import ExtensionInstallCTA from '~/components/organisms/ExtensionInstallCTA.vue'

// Head
useHead({
  title: 'Dashboard - ClaimReady',
  meta: [
    { name: 'description', content: 'Your ClaimReady dashboard for VA claim tracking and analysis' }
  ]
})

const router = useRouter()

// Use subscription composable
const { isPremium: subscriptionPremium, fetchSubscriptionStatus } = useSubscription()

// Use rating snapshot composable (Chrome extension data)
const {
  latestSnapshot,
  hasExtension,
  fetchAll: fetchRatingSnapshotData,
} = useRatingSnapshot()

// State
const loading = ref(true)
const user = reactive({
  userId: '',
  firstName: '',
  lastName: '',
  email: '',
  serviceBranch: '',
  isPremium: false
})

// Computed property for premium status
const isPremium = computed(() => subscriptionPremium.value || user.isPremium)

const recentAnalysis = ref([])

// Check user session and load data
onMounted(async () => {
  const { requireAuth, setupSessionMonitoring } = useAuth()

  // Require authentication - will redirect if not authenticated
  const isAuth = await requireAuth()
  if (!isAuth) {
    return // Already redirected by requireAuth
  }

  // Set up session monitoring for auto-logout
  setupSessionMonitoring()

  try {
    // Load user profile first (needed for userId-dependent calls)
    await loadUserProfile()

    // Then load remaining data in parallel (all depend on user.userId)
    await Promise.all([
      loadRecentAnalysis(),
      fetchSubscriptionStatus(),
      fetchRatingSnapshotData(user.userId), // Fetch Chrome extension data
    ])
  } catch (error) {
    console.error('Failed to load dashboard:', error)
    // CRITICAL: Don't redirect logged-in users to login on errors
    // They have a valid session, so they should stay on the page with navigation
    // Only clear token if it's actually an auth error (401)
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated()) {
      // Token expired or missing - redirect to login
      router.push('/auth/login')
    } else {
      // User has valid token - show error but keep them on page with navigation
      console.log('⚠️ Dashboard load failed, but user has valid session - keeping on page')
    }
  } finally {
    loading.value = false
  }
})

// Load user profile from API
const loadUserProfile = async () => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall('/api/auth/profile')

    if (!response.ok) {
      throw new Error('Authentication failed')
    }

    const profileData = await response.json()
    Object.assign(user, profileData.user)
  } catch (error) {
    console.error('Failed to load user profile:', error)
    throw error
  }
}

// Load recent analysis from VA sync decisions
const loadRecentAnalysis = async () => {
  try {
    const { apiCall } = useApi()
    // Only load if premium (documents endpoint is premium-only)
    if (!isPremium.value) {
      recentAnalysis.value = []
      return
    }

    // Get user ID for the API call
    if (!user.userId) {
      console.warn('No user ID available for loading analysis')
      recentAnalysis.value = []
      return
    }

    // Use VA sync endpoint for decision letters (new architecture)
    // Note: analyses endpoint returns decision_letter type documents
    const response = await apiCall(`/api/va-sync/analyses/${user.userId}`)

    if (response.ok) {
      const data = await response.json()
      // Map VA decision documents to dashboard format, limit to 5 most recent
      const docs = Array.isArray(data) ? data : []
      recentAnalysis.value = docs.slice(0, 5).map((doc: any) => ({
        documentId: doc._id || doc.id,
        fileName: doc.displayName || doc.pdfFileName || 'Decision Letter',
        status: doc.processingState || 'uploaded',
        analyzedAt: doc.analyzedAt || doc.uploadedAt,
      }))
    }
  } catch (error) {
    console.error('Failed to load recent analysis:', error)
  }
}

// Logout handler
const handleLogout = async () => {
  const { logout } = useAuth()
  const { apiCall } = useApi()

  try {
    // Call backend logout endpoint
    await apiCall('/api/auth/logout', { method: 'POST' })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear local session and redirect
    await logout(true)
  }
}

// Helper functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

const getAnalysisVariant = (status: string): string => {
  switch (status) {
    case 'approved': return 'success'
    case 'denied': return 'danger'
    case 'pending': return 'warning'
    default: return 'neutral'
  }
}

const formatStatus = (status: string): string => {
  switch (status) {
    case 'uploaded': return 'Uploaded'
    case 'extracting': return 'Extracting...'
    case 'extracted': return 'Extracted'
    case 'analyzing': return 'Analyzing...'
    case 'analyzed': return 'Analyzed'
    case 'failed': return 'Failed'
    default: return status
  }
}
</script>
```
