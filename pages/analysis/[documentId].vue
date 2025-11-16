<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation
      :show-new-analysis="true"
      :show-dashboard="true"
      :show-user-menu="true"
    />

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-slate-600">Loading your analysis...</p>
    </div>

    <!-- Results -->
    <div v-else-if="document" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Page Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">
              {{ document.fileName }}
            </h1>
            <p class="text-slate-600">
              Analyzed {{ formatDate(document.uploadedAt) }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <Button @click="navigateTo('/documents')" variant="secondary">
              <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
              Back to Documents
            </Button>
            <Button @click="downloadPDF" variant="primary">
              <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <!-- Rating Hero Card -->
      <RatingHeroCard
        :combined-rating="document.combinedRating || 0"
        :monthly-payment="document.monthlyPayment || 0"
        :granted-count="grantedCount"
        :denied-count="deniedCount"
        :deferred-count="deferredCount"
      />

      <!-- Conditions Grid Enhanced -->
      <ConditionsGridEnhanced
        :conditions="formattedConditions"
        :denial-reasons="document.denialReasons || []"
        :deferred-reasons="document.deferredReasons || []"
        :is-authenticated="true"
      />

      <!-- Action Items Section (Premium + Feature Flag) -->
      <PremiumFeature feature-name="Action Items">
        <FeatureFlag
          flag-name="action_items_results_integration"
          :show-fallback="false"
        >
          <ActionItemsSection :document-id="documentId" />
        </FeatureFlag>
      </PremiumFeature>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="heroicons:exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Document Not Found</h2>
      <p class="text-slate-600 mb-6">
        This document may have been deleted or you don't have access to it.
      </p>
      <Button @click="navigateTo('/documents')" variant="primary">
        Back to Documents
      </Button>
    </div>

    <!-- Chat Widget (Feature Flag) -->
    <ChatWidget v-if="documentId" :document-id="documentId" />
  </div>
</template>

<script setup lang="ts">
import Button from "~/components/atoms/Button.vue";
import Navigation from "~/components/organisms/Navigation.vue";
import RatingHeroCard from "~/components/organisms/RatingHeroCard.vue";
import ConditionsGridEnhanced from "~/components/organisms/ConditionsGridEnhanced.vue";
import PremiumFeature from "~/components/organisms/PremiumFeature.vue";
import FeatureFlag from "~/components/organisms/FeatureFlag.vue";
import ActionItemsSection from "~/components/organisms/ActionItemsSection.vue";
import ChatWidget from "~/components/features/chat/ChatWidget.vue";

const route = useRoute()
const router = useRouter()
const documentId = route.params.documentId as string

const loading = ref(true)
const document = ref<any>(null)

// Computed properties for condition counts and formatting
const formattedConditions = computed(() => {
  if (!document.value?.ratings) return []

  return document.value.ratings.map((rating: any) => ({
    condition: rating.condition,
    decision: rating.decision || 'unknown',
    ratingPercentage: rating.ratingPercentage,
    effectiveDate: rating.effectiveDate,
    reason: rating.reason
  }))
})

const grantedCount = computed(() => {
  return formattedConditions.value.filter((c: any) => c.decision === 'granted').length
})

const deniedCount = computed(() => {
  return formattedConditions.value.filter((c: any) => c.decision === 'denied').length
})

const deferredCount = computed(() => {
  return formattedConditions.value.filter((c: any) => c.decision === 'deferred').length
})

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
    await loadDocument()
  } catch (error) {
    console.error('Failed to load document:', error)
  } finally {
    loading.value = false
  }
})

const loadDocument = async () => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall(`/api/documents/${documentId}`)

    if (response.ok) {
      document.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load document:', error)
    throw error
  }
}

const downloadPDF = async () => {
  // Ensure we're on the client side
  if (import.meta.server) {
    console.warn('PDF download is only available on the client side')
    return
  }

  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || 'http://localhost:3001'
  const token = localStorage.getItem('auth_token')
  const { isPremium } = useSubscription()
  const { error: showError, success } = useToast()

  try {
    // Always try analysis PDF - never fall back to original document
    console.log('🔄 Attempting to download analysis PDF with action items...')
    const response = await fetch(`${apiUrl}/api/documents/${documentId}/analysis-pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (response.ok) {
      // Create blob from PDF buffer
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = `va-analysis-${documentId}.pdf`
      window.document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      window.document.body.removeChild(a)
      success('Analysis PDF downloaded successfully')
      return
    } else {
      // Get error details
      const errorText = await response.text()
      let errorMessage = 'Failed to download analysis PDF'
      
      try {
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error?.message || errorMessage
      } catch (e) {
        // If parsing fails, use the raw text
        errorMessage = errorText || errorMessage
      }

      console.error('Analysis PDF failed:', response.status, errorMessage)
      
      // Show specific error messages based on status code
      if (response.status === 403) {
        showError(
          'Analysis PDF requires premium subscription',
          'Upgrade to premium to download analysis PDF with action items'
        )
      } else if (response.status === 404) {
        showError(
          'Analysis not found',
          'Please wait for the analysis to complete before downloading the PDF'
        )
      } else {
        showError(
          'Failed to generate analysis PDF',
          errorMessage
        )
      }
    }
  } catch (error: any) {
    console.error('Error downloading PDF:', error)
    showError('Failed to download PDF', error.message || 'An unexpected error occurred')
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString()
}

useHead({
  title: 'Analysis Details - ClaimReady',
  meta: [
    { name: 'description', content: 'View your VA decision letter analysis details' }
  ]
})
</script>
