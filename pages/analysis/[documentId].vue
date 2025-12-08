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

    <!-- Processing State - Document needs extraction/analysis -->
    <div v-else-if="processing" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 class="text-xl font-bold text-slate-900 mb-2">Analyzing Your Document</h2>
        <p class="text-slate-600 mb-4">
          {{ processingStatus }}
        </p>
        <div class="w-full bg-slate-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full transition-all duration-500"
            :style="{ width: processingProgress + '%' }"
          ></div>
        </div>
        <p class="text-sm text-slate-500 mt-2">This may take a minute...</p>
      </div>
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
              <span v-if="document.decisionDate" class="ml-2 text-slate-500">
                | Letter Date: {{ document.decisionDate }}
              </span>
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

      <!-- No Ratings Found Notice -->
      <div v-if="!hasRatingsData" class="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <div class="flex items-start space-x-4">
          <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-amber-500 flex-shrink-0" />
          <div>
            <h3 class="text-lg font-semibold text-amber-800 mb-2">No Rating Information Found</h3>
            <p class="text-amber-700 mb-3">
              This document may not be a VA rating decision letter. Rating decision letters typically include:
            </p>
            <ul class="list-disc list-inside text-amber-700 text-sm space-y-1 mb-3">
              <li>Service connection decisions (granted, denied, or deferred)</li>
              <li>Disability rating percentages</li>
              <li>Combined evaluation rating</li>
            </ul>
            <p class="text-sm text-amber-600">
              <strong>Document type:</strong> {{ document.processingState === 'analyzed' ? 'Analyzed but no ratings detected' : document.processingState }}
            </p>
          </div>
        </div>
      </div>

      <!-- Rating Hero Card - Only show if there's meaningful data -->
      <RatingHeroCard
        v-if="hasRatingsData"
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

      <!-- Action Items Section (Premium only) -->
      <PremiumFeature feature-name="Action Items">
        <ActionItemsSection :document-id="documentId" />
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
import ActionItemsSection from "~/components/organisms/ActionItemsSection.vue";
import ChatWidget from "~/components/features/chat/ChatWidget.vue";

// Ensure this route is properly registered and doesn't conflict with /analysis
// Note: analysis-redirect middleware handles /analysis → /analyze redirect
// This page handles /analysis/[documentId] routes
definePageMeta({
  middleware: 'auth' // Require authentication for analysis detail pages
})

const route = useRoute()
const router = useRouter()
const documentId = route.params.documentId as string

const loading = ref(true)
const processing = ref(false)
const processingStatus = ref('Preparing document...')
const processingProgress = ref(0)
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

// Check if we have any meaningful ratings data to display
const hasRatingsData = computed(() => {
  // Has ratings data if:
  // 1. There's a combined rating > 0, OR
  // 2. There's at least one condition (granted, denied, or deferred)
  return (document.value?.combinedRating && document.value.combinedRating > 0) ||
         formattedConditions.value.length > 0
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

    // Use va-sync endpoint which supports both FileStorage and VAClaimDecision
    const response = await apiCall(`/api/va-sync/decision/${documentId}`)

    if (response.ok) {
      const doc = await response.json()

      // Check if document needs processing
      // Only trigger processing for FileStorage documents (source: 'file_storage')
      // that don't have ratings yet. Chrome extension documents (source: 'va_sync')
      // are processed separately by the backfill service.
      const hasRatings = Array.isArray(doc.ratings) && doc.ratings.length > 0
      const hasAnalysis = doc.analysisData && doc.analysisData.summary
      const isFileStorage = doc.source === 'file_storage'
      const needsProcessing = isFileStorage && !hasAnalysis && !hasRatings

      if (needsProcessing) {
        console.log('Document needs processing, triggering extraction/analysis...')
        await triggerProcessing()
        return
      }

      // Document is ready - set it for display
      // Map the response to match the expected format
      document.value = {
        ...doc,
        fileName: doc.fileName,
        uploadedAt: doc.uploadedAt,
        combinedRating: doc.combinedRating,
        monthlyPayment: doc.monthlyPayment,
        ratings: doc.ratings,
        denialReasons: doc.denialReasons || [],
        deferredReasons: doc.deferredReasons || [],
        analysisResult: doc.analysisData,
        processingState: doc.processingState,
      }
    } else {
      // Document not found
      const errorText = await response.text().catch(() => 'Unknown error')
      console.error(`❌ Document not found (${response.status}):`, errorText)
      throw new Error(`Document not found: ${response.status}`)
    }
  } catch (error) {
    console.error('Failed to load document:', error)
    // Don't throw - let the error state show in the UI
    // The template will show "Document Not Found" message
  }
}

/**
 * Trigger processing for unprocessed documents
 * This gives documents a "second chance" if they weren't processed correctly
 */
const triggerProcessing = async () => {
  const { apiCall } = useApi()

  processing.value = true
  processingStatus.value = 'Extracting data from document...'
  processingProgress.value = 20

  try {
    // Use StorageFile analyze endpoint (single source of truth)
    // NO legacy VAClaimDecision support
    const processResponse = await apiCall(`/api/analyze/async`, {
      method: 'POST',
      body: JSON.stringify({
        fileId: documentId
      })
    })

    if (!processResponse.ok) {
      const errorData = await processResponse.json().catch(() => ({}))
      throw new Error(errorData.message || 'Processing failed')
    }

    const result = await processResponse.json()
    console.log('Processing result:', result)

    processingStatus.value = 'Analysis complete! Loading results...'
    processingProgress.value = 90

    // Reload the document after processing
    await new Promise(resolve => setTimeout(resolve, 500)) // Brief delay for UX

    const response = await apiCall(`/api/va-sync/decision/${documentId}`)
    if (response.ok) {
      const doc = await response.json()
      // Map the response to match the expected format
      document.value = {
        ...doc,
        fileName: doc.fileName,
        uploadedAt: doc.uploadedAt,
        combinedRating: doc.combinedRating,
        monthlyPayment: doc.monthlyPayment,
        ratings: doc.ratings,
        denialReasons: doc.denialReasons || [],
        deferredReasons: doc.deferredReasons || [],
        analysisResult: doc.analysisData,
        processingState: doc.processingState,
      }
      processingProgress.value = 100
    } else {
      throw new Error('Failed to load processed document')
    }

  } catch (error: any) {
    console.error('Processing failed:', error)
    processingStatus.value = `Processing failed: ${error.message}`
    // Keep showing error for a moment, then show error state
    await new Promise(resolve => setTimeout(resolve, 2000))
  } finally {
    processing.value = false
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
