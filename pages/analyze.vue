<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
    <!-- Full Navigation -->
    <Navigation />

    <!-- Page Header -->
    <div class="bg-white border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <!-- Breadcrumbs for authenticated users -->
        <div v-if="isAuthenticated" class="mb-4">
          <Breadcrumb />
        </div>

        <div>
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Analyze Decision Letter</h1>
          <p class="text-lg text-slate-600">
            Upload your VA decision letter to get instant analysis and understand your claim decision
          </p>
        </div>
      </div>
    </div>

    <!-- Usage Limit Reached (Anonymous Users Only) -->
    <div v-if="!analyzing && !sessionId && !isAuthenticated && hasUsedFreeAnalysis && !isPremium" class="max-w-3xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <EmptyState
          variant="limit-reached"
          icon-name="heroicons:lock-closed"
          :title="`You've Used Your ${FREE_ANALYSIS_LIMIT} Free Analyses`"
          description="Create a free account to continue analyzing decision letters"
          :benefits="[
            'Unlimited decision letter analysis',
            'Save and access your analysis history',
            'Track multiple claims',
            'Evidence checklists and recommendations'
          ]"
          benefits-title="With a free account you get:"
          :primary-action="{
            label: 'Create Free Account',
            icon: 'heroicons:user-plus',
            to: '/auth/signup'
          }"
          :secondary-action="{
            label: 'Sign In',
            icon: 'heroicons:arrow-right-on-rectangle',
            to: '/auth/login'
          }"
          :tertiary-action="{
            label: 'View Premium Plans',
            icon: 'heroicons:arrow-right',
            to: '/pricing'
          }"
          footer-message="Want advanced features like multi-claim tracking and AI form generation?"
        />
      </div>
    </div>

    <!-- Upload Section -->
    <div v-if="!analyzing && !sessionId && !(hasUsedFreeAnalysis && !isAuthenticated && !isPremium)" class="max-w-3xl mx-auto px-4 py-8">
      <!-- User State Card -->
      <div v-if="!isAuthenticated && !isPremium" class="mb-6">
        <UserStateCard
          user-state="guest"
          :remaining-uses="FREE_ANALYSIS_LIMIT - freeAnalysisCount"
          :total-uses="FREE_ANALYSIS_LIMIT"
          :show-upgrade-action="true"
        />
      </div>

      <FileUploadZone
        @file-select="handleFileSelect"
        @analyze="analyzeDocument"
      />
    </div>

    <!-- Analyzing State with Progress -->
    <div v-if="analyzing" class="max-w-3xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <LoadingState
          variant="steps"
          size="lg"
          message="Analyzing Your Decision Letter"
          sub-message="This usually takes 30-60 seconds"
          :steps="[
            'Uploading document',
            'Extracting text from PDF',
            'Analyzing decision details'
          ]"
          :current-step="currentStep - 1"
        />
      </div>
    </div>

    <!-- Redirect to results -->
    <div v-if="sessionId">
      <!-- Auto-redirect handled in script -->
    </div>

    <!-- Footer -->
    <Footer class="mt-auto" />
  </div>
</template>

<script setup lang="ts">
import FileUploadZone from "~/components/organisms/FileUploadZone.vue";
import Navigation from "~/components/organisms/Navigation.vue";
import Footer from "~/components/organisms/Footer.vue";
import Button from "~/components/atoms/Button.vue";
import EmptyState from "~/components/molecules/EmptyState.vue";
import LoadingState from "~/components/molecules/LoadingState.vue";
import UserStateCard from "~/components/molecules/UserStateCard.vue";
import Breadcrumb from "~/components/molecules/Breadcrumb.vue";
import { useToast } from "~/composables/useToast";
import { useAnalysisErrors } from "~/composables/useAnalysisErrors";
import { useAnalytics } from "~/composables/useAnalytics";
import { useApi } from "~/composables/useApi";
import { useJobPolling, type PollJobStatus } from "~/composables/useJobPolling";

const toast = useToast()
const { handleError } = useAnalysisErrors()
const { trackFunnel, trackAnalysis, trackFileUpload } = useAnalytics()
const { startPolling, stopPolling } = useJobPolling()
const route = useRoute()

const analyzing = ref(false)
const sessionId = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const currentStep = ref(0) // Track progress: 0=idle, 1=uploading, 2=extracting, 3=analyzing
const analysisStartTime = ref<number | null>(null)
const currentJobId = ref<string | null>(null) // Track active job for cleanup

// Map polling status to UI step (0-indexed for LoadingState)
const statusToStep = (status: string): number => {
  switch (status) {
    case 'waiting':
    case 'active':
      return 2 // "Extracting text from PDF"
    case 'completed':
      return 3 // "Analyzing decision details"
    case 'failed':
      return 0 // Error state
    default:
      return 1
  }
}

// Get authentication and subscription state
const { isAuthenticated: isAuthenticatedFn } = useAuth()
const isAuthenticated = computed(() => isAuthenticatedFn())
const { isPremium } = useSubscription()
const FREE_ANALYSIS_LIMIT = 3
const freeAnalysisCount = ref(0)
const hasUsedFreeAnalysis = computed(() => freeAnalysisCount.value >= FREE_ANALYSIS_LIMIT)
const showUpgradePrompt = ref(false)

// Track upload page view on mount (funnel step 2)
onMounted(async () => {
  const source = route.query.utm_source as string | undefined
  trackFunnel.uploadPageViewed(source)

  // Check if user is authenticated and fetch subscription status
  if (isAuthenticated.value) {
    const { fetchSubscriptionStatus } = useSubscription()
    await fetchSubscriptionStatus()
  }

  // Dev helper: Reset free analysis count (remove in production)
  // Add ?reset=1 to URL to reset: /analyze?reset=1
  if (import.meta.dev && route.query.reset === '1') {
    localStorage.removeItem('free_analysis_count')
    freeAnalysisCount.value = 0
    console.log('✅ Free analysis count reset')
  }

  // Check if anonymous user has used their free analyses
  // Premium users bypass this limit
  if (!isAuthenticated.value && !isPremium.value) {
    const storedCount = localStorage.getItem('free_analysis_count')
    freeAnalysisCount.value = storedCount ? parseInt(storedCount, 10) : 0
  } else {
    // Premium users or authenticated users don't have limits
    freeAnalysisCount.value = 0
  }
})

// Cleanup polling if user navigates away during analysis
onUnmounted(() => {
  if (currentJobId.value) {
    stopPolling()
    currentJobId.value = null
  }
})

const handleFileSelect = (file: File) => {
  selectedFile.value = file
}

const stepClasses = (step: number) => {
  const isActive = currentStep.value === step
  const isComplete = currentStep.value > step

  if (isComplete) {
    return 'flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white'
  }
  if (isActive) {
    return 'flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white animate-pulse'
  }
  return 'flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-500'
}

const analyzeDocument = async () => {
  if (!selectedFile.value) return

  // REQUIRE AUTHENTICATION
  if (!isAuthenticated.value) {
    toast.error('Authentication Required', 'Please log in to analyze documents')
    navigateTo('/auth/login?redirect=/analyze')
    return
  }

  analyzing.value = true
  currentStep.value = 1
  analysisStartTime.value = Date.now()

  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl || 'http://localhost:3001'
    const { apiCall } = useApi()
    const userId = 'authenticated' // Authentication is required

    console.log('Starting analysis for file:', selectedFile.value.name)
    console.log('User authenticated:', isAuthenticated.value)

    // Track analysis started
    trackAnalysis.started(userId, undefined)

    // Step 1 & 2 combined: Upload file directly through API (avoids GCS CORS issues)
    console.log('Step 1: Uploading file through API...')
    currentStep.value = 1

    // REQUIRE AUTHENTICATION for upload
    if (!isAuthenticated.value) {
      console.error('❌ User not authenticated - redirecting to login')
      toast.error('Authentication Required', 'Please log in to analyze documents')
      analyzing.value = false
      navigateTo('/auth/login?redirect=/analyze')
      return
    }

    // Create FormData for multipart upload
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    formData.append('path', 'documents')

    // Use authenticated endpoint (useApi detects FormData and sets correct headers)
    const uploadResponse = await apiCall('/api/storage/upload', {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json().catch(() => ({}))
      throw { response: uploadResponse, message: errorData.message || 'Upload failed' }
    }

    const uploadData = await uploadResponse.json()
    const fileId = uploadData.fileId
    console.log('Step 1 complete: File uploaded via API, fileId:', fileId)

    // Step 2: Upload complete (already done in step 1)
    currentStep.value = 2
    console.log('Step 2 complete: File uploaded successfully')

    // Track file upload completion
    if (selectedFile.value) {
      const uploadTime = Date.now() - analysisStartTime.value!
      trackFileUpload.completed(userId, selectedFile.value.type, selectedFile.value.size, uploadTime)
    }

    // No storageUrl needed - fileId is all we need for the analyze endpoint

    // Step 3: Analyze
    console.log('Step 3: Starting analysis...')
    currentStep.value = 3

    // Add timeout to fetch request (90 seconds)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)

    try {
      // REQUIRE authentication - already checked above, but double-check
      if (!isAuthenticated.value) {
        console.error('❌ User not authenticated - redirecting to login')
        toast.error('Authentication Required', 'Please log in to analyze documents')
        navigateTo('/auth/login?redirect=/analyze')
        analyzing.value = false
        return
      }

      // Use async endpoint - AUTHENTICATED ONLY
      console.log('Using async analyze endpoint with fileId:', fileId)
      const analyzeResponse = await apiCall('/api/analyze/async', {
        method: 'POST',
        body: JSON.stringify({
          fileId: fileId
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}))
        throw { response: analyzeResponse, message: errorData.message || 'Analysis failed' }
      }

      const responseData = await analyzeResponse.json()
      console.log('Async analyze response:', responseData)

      const jobId = responseData.jobId
      currentJobId.value = jobId

      console.log(`Job queued: ${jobId}, starting polling...`)

      // Capture fileId in closure
      const capturedFileId = fileId
      const handleJobComplete = (result: { sessionId?: string; documentId?: string }) => {
        const redirectDocumentId = result.documentId || capturedFileId
        
        console.log('✅ Analysis complete!', {
          documentId: redirectDocumentId,
          fileId: capturedFileId,
        })

        // Track analysis completion
        const totalTime = Date.now() - analysisStartTime.value!
        trackAnalysis.completed(userId, totalTime, redirectDocumentId)

        // Show success toast
        toast.success('Analysis Complete!', 'Redirecting to your results...')

        // Cleanup
        stopPolling()
        currentJobId.value = null
        analyzing.value = false

        setTimeout(() => {
          // ALWAYS redirect to /analysis/:documentId for authenticated users
          if (redirectDocumentId) {
            console.log(`🔄 Redirecting to /analysis/${redirectDocumentId}`)
            navigateTo(`/analysis/${redirectDocumentId}`)
          } else {
            console.error('❌ No documentId available!')
            navigateTo('/documents')
          }
        }, 500)
      }

      // Start polling
      startPolling(jobId, {
        onUpdate: (status: PollJobStatus) => {
          console.log(`Job ${jobId} status update:`, status.status, `(${status.progress}%)`)
          const stepMap: Record<string, number> = {
            'waiting': 1,
            'active': 2,
            'completed': 4,
            'failed': 0,
          }
          currentStep.value = stepMap[status.status] || 2
        },
        onComplete: (status: PollJobStatus) => {
          if (status.result) {
            handleJobComplete({
              sessionId: status.result.sessionId || undefined,
              documentId: status.result.documentId || undefined,
            })
          } else {
            console.error('Job completed but no result data')
            toast.error('Analysis Complete', 'But result data is missing')
            analyzing.value = false
          }
        },
        onError: (error: Error) => {
          console.error('Polling failed:', error)
          toast.error('Status Tracking Failed', error.message || 'Unable to track job status')
          analyzing.value = false
        },
      })
    } catch (fetchError: any) {
      clearTimeout(timeoutId)

      if (fetchError.name === 'AbortError') {
        throw { message: 'Analysis is taking longer than expected. Please try again.' }
      }
      throw fetchError
    }

  } catch (error: any) {
    console.error('Analysis failed:', error)

    // Determine which stage failed based on currentStep
    let stage: 'upload' | 'extraction' | 'analysis' = 'upload'
    if (currentStep.value >= 2) stage = 'extraction'
    if (currentStep.value >= 3) stage = 'analysis'

    // Track analysis failure
    const errorMessage = error?.message || error?.response?.statusText || 'Unknown error'
    const errorCode = error?.response?.status?.toString()
    trackAnalysis.failed('anonymous', errorMessage, errorCode)

    // Use our error handler with retry capability
    handleError(error, stage, () => {
      // Reset and retry
      analyzing.value = false
      currentStep.value = 0
      setTimeout(() => analyzeDocument(), 100)
    })
  } finally {
    if (!sessionId.value) {
      // Only reset if we didn't succeed
      analyzing.value = false
      currentStep.value = 0
    }
  }
}

useHead({
  title: 'Analyze VA Decision Letter - ClaimReady',
  meta: [
    { name: 'description', content: 'Upload your VA decision letter for instant analysis. No account required.' }
  ]
})
</script>
