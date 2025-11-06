<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
    <!-- Full Navigation -->
    <Navigation />

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h1 class="text-4xl font-bold mb-4">VA Decision Letter Analysis</h1>
          <p class="text-xl text-blue-100">
            Upload your VA decision letter to get instant analysis and understand your claim decision
          </p>
        </div>
      </div>
    </div>

    <!-- Usage Limit Reached (Anonymous Users) -->
    <div v-if="!analyzing && !sessionId && !isAuthenticated && hasUsedFreeAnalysis" class="max-w-3xl mx-auto px-4 py-8">
      <div class="bg-white rounded-2xl shadow-xl p-8 border-2 border-blue-200">
        <div class="text-center">
          <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:lock-closed" class="w-10 h-10 text-blue-600" />
          </div>

          <h2 class="text-2xl font-bold text-slate-900 mb-4">
            You've Used Your Free Analysis
          </h2>

          <p class="text-lg text-slate-600 mb-6">
            Create a free account to continue analyzing decision letters
          </p>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
            <h3 class="font-semibold text-blue-900 mb-3">With a free account you get:</h3>
            <ul class="space-y-2">
              <li class="flex items-start">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-blue-800">Unlimited decision letter analysis</span>
              </li>
              <li class="flex items-start">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-blue-800">Save and access your analysis history</span>
              </li>
              <li class="flex items-start">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-blue-800">Track multiple claims</span>
              </li>
              <li class="flex items-start">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-sm text-blue-800">Evidence checklists and recommendations</span>
              </li>
            </ul>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              @click="navigateTo('/auth/register')"
              variant="primary"
              class="px-8 py-3"
            >
              <Icon name="heroicons:user-plus" class="w-5 h-5 mr-2" />
              Create Free Account
            </Button>

            <Button
              @click="navigateTo('/auth/login')"
              variant="secondary"
              class="px-8 py-3"
            >
              <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
              Sign In
            </Button>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-200">
            <p class="text-sm text-slate-600 mb-3">
              Want advanced features like multi-claim tracking and AI form generation?
            </p>
            <Button
              @click="navigateTo('/pricing')"
              variant="ghost"
              class="text-blue-600 hover:text-blue-700"
            >
              View Premium Plans →
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Section -->
    <div v-if="!analyzing && !sessionId && !(hasUsedFreeAnalysis && !isAuthenticated)" class="max-w-3xl mx-auto px-4 py-8">
      <FileUploadZone
        @file-select="handleFileSelect"
        @analyze="analyzeDocument"
      />
    </div>

    <!-- Analyzing State with Progress -->
    <div v-if="analyzing" class="max-w-3xl mx-auto px-4 py-12">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center">
          <div class="mb-8">
            <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          </div>

          <h2 class="text-2xl font-semibold text-slate-900 mb-4">
            Analyzing Your Decision Letter
          </h2>

          <!-- Progress Steps -->
          <div class="space-y-4 max-w-md mx-auto text-left mt-8">
            <div class="flex items-center space-x-3">
              <div :class="stepClasses(1)">
                <Icon v-if="currentStep > 1" name="heroicons:check" class="w-4 h-4" />
                <span v-else class="text-sm font-medium">1</span>
              </div>
              <span :class="currentStep >= 1 ? 'text-slate-900 font-medium' : 'text-slate-400'">
                Uploading document
              </span>
            </div>

            <div class="flex items-center space-x-3">
              <div :class="stepClasses(2)">
                <Icon v-if="currentStep > 2" name="heroicons:check" class="w-4 h-4" />
                <span v-else class="text-sm font-medium">2</span>
              </div>
              <span :class="currentStep >= 2 ? 'text-slate-900 font-medium' : 'text-slate-400'">
                Extracting text from PDF
              </span>
            </div>

            <div class="flex items-center space-x-3">
              <div :class="stepClasses(3)">
                <Icon v-if="currentStep > 3" name="heroicons:check" class="w-4 h-4" />
                <span v-else class="text-sm font-medium">3</span>
              </div>
              <span :class="currentStep >= 3 ? 'text-slate-900 font-medium' : 'text-slate-400'">
                Analyzing decision details
              </span>
            </div>
          </div>

          <p class="text-sm text-slate-500 mt-8">
            This usually takes 30-60 seconds
          </p>
        </div>
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
import { useToast } from "~/composables/useToast";
import { useAnalysisErrors } from "~/composables/useAnalysisErrors";
import { useAnalytics } from "~/composables/useAnalytics";

const toast = useToast()
const { handleError } = useAnalysisErrors()
const { trackFunnel, trackAnalysis, trackFileUpload } = useAnalytics()
const route = useRoute()

const analyzing = ref(false)
const sessionId = ref<string | null>(null)
const selectedFile = ref<File | null>(null)
const currentStep = ref(0) // Track progress: 0=idle, 1=uploading, 2=extracting, 3=analyzing
const analysisStartTime = ref<number | null>(null)

// Get authentication and billing state
const { isAuthenticated } = useAuth()
const { isPremium, isFree, fetchSubscription } = useBilling()
const hasUsedFreeAnalysis = ref(false)
const showUpgradePrompt = ref(false)

// Track upload page view on mount (funnel step 2)
onMounted(async () => {
  const source = route.query.utm_source as string | undefined
  trackFunnel.uploadPageViewed(source)

  // Check if user is authenticated and fetch subscription status
  if (isAuthenticated.value) {
    await fetchSubscription()
  }

  // Check if anonymous user has already used their free analysis
  if (!isAuthenticated.value) {
    const usedFree = localStorage.getItem('used_free_analysis')
    hasUsedFreeAnalysis.value = usedFree === 'true'
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

  // Check usage limits before proceeding
  if (!isAuthenticated.value && hasUsedFreeAnalysis.value) {
    toast.warning('Free Analysis Used', 'Create a free account to continue analyzing decision letters')
    showUpgradePrompt.value = true
    return
  }

  // For free tier authenticated users, could add analysis count check here in future
  // For now, authenticated free users get unlimited basic analysis

  analyzing.value = true
  currentStep.value = 1
  analysisStartTime.value = Date.now()

  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl || 'http://localhost:3001'

    console.log('Starting analysis for file:', selectedFile.value.name)

    // Track analysis started
    trackAnalysis.started('anonymous', undefined)

    // Step 1: Upload to S3
    console.log('Step 1: Getting presigned URL...')
    const presignedResponse = await fetch(
      `${apiUrl}/api/storage/upload/presigned/anonymous`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: selectedFile.value.name,
          contentType: selectedFile.value.type,
          path: 'anonymous'
        })
      }
    )

    if (!presignedResponse.ok) {
      const errorData = await presignedResponse.json().catch(() => ({}))
      throw { response: presignedResponse, message: errorData.message || 'Presigned URL failed' }
    }

    const { uploadUrl, s3Key } = await presignedResponse.json()
    console.log('Step 1 complete: Got presigned URL')

    // Step 2: Upload to S3
    console.log('Step 2: Uploading to S3...')
    currentStep.value = 2
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: selectedFile.value,
      headers: { 'Content-Type': selectedFile.value.type }
    })

    if (!uploadResponse.ok) {
      throw { response: uploadResponse, message: 'S3 upload failed' }
    }
    console.log('Step 2 complete: File uploaded to S3')

    // Track file upload completion
    if (selectedFile.value) {
      const uploadTime = Date.now() - analysisStartTime.value!
      trackFileUpload.completed('anonymous', selectedFile.value.type, selectedFile.value.size, uploadTime)
    }

    // Construct full S3 URL from the upload URL
    // The uploadUrl is a presigned URL like: https://endpoint/bucket/key?signature
    // We need to extract just the base URL (without query params)
    const s3Url = new URL(uploadUrl)
    const storageUrl = `${s3Url.protocol}//${s3Url.host}${s3Url.pathname}`

    // Step 3: Analyze
    console.log('Step 3: Starting analysis...')
    currentStep.value = 3

    // Add timeout to fetch request (90 seconds)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)

    try {
      const analyzeResponse = await fetch(
        `${apiUrl}/api/analyze/anonymous`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ storageUrl }),
          signal: controller.signal
        }
      )

      clearTimeout(timeoutId)

      console.log('Got analyze response, status:', analyzeResponse.status)

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json().catch(() => ({}))
        throw { response: analyzeResponse, message: errorData.message || 'Analysis failed' }
      }

      const responseData = await analyzeResponse.json()
      console.log('Analyze response data:', responseData)

      const newSessionId = responseData.sessionId
      if (!newSessionId) {
        throw new Error('No sessionId in response')
      }

      console.log('Step 3 complete: Got session ID', newSessionId)
      sessionId.value = newSessionId

      // Mark free analysis as used for anonymous users
      if (!isAuthenticated.value) {
        localStorage.setItem('used_free_analysis', 'true')
        hasUsedFreeAnalysis.value = true
      }

      // Track analysis completion
      const totalTime = Date.now() - analysisStartTime.value!
      trackAnalysis.completed('anonymous', totalTime, newSessionId)

      // Show success toast
      toast.success('Analysis Complete!', 'Redirecting to your results...')

      // Redirect to results
      setTimeout(() => {
        navigateTo(`/results/${newSessionId}`)
      }, 500)
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
