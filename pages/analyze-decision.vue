<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold text-slate-900 mb-4">
          VA Decision Letter Analysis
        </h1>
        <p class="text-xl text-slate-600">
          Upload your VA decision letter to get instant analysis and understand your claim decision
        </p>
      </div>

      <!-- Upload Section -->
      <FileUploadZone
        v-if="!analyzing && !processing && !results"
        :uploading="uploading"
        :error="error"
        @file-select="handleFileSelect"
        @analyze="analyzeDecision"
      />

      <!-- Analyzing State -->
      <AnalysisLoadingState
        v-if="analyzing || processing"
        :stage="currentStage"
      />

      <!-- Results Section -->
      <div v-if="results" class="space-y-8">
        <!-- Veteran Info -->
        <VeteranInfoCard 
          v-if="results.veteranInfo"
          :veteran-info="results.veteranInfo"
        />

        <!-- Main Content Grid -->
        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Decision Summary -->
            <DecisionSummarySection
              :conditions="results.ratings"
              :combined-rating="results.combinedRating"
              :monthly-payment="results.monthlyPayment"
            />

            <!-- Denial Analysis -->
            <DenialAnalysisCard
              v-if="results.denialReasons?.length > 0"
              :denial-reasons="results.denialReasons"
            />

            <!-- Deferred Reasons -->
            <div v-if="results.deferredReasons?.length > 0" class="bg-white rounded-2xl shadow-xl p-8">
              <div class="flex items-center mb-6">
                <Icon name="clock" size="lg" color="amber-600" class="mr-3" />
                <h2 class="text-2xl font-bold text-slate-900">Deferred Conditions</h2>
                <Badge 
                  :text="`${results.deferredReasons.length} Deferred`"
                  variant="deferred"
                  class="ml-3"
                />
              </div>
              
              <div class="space-y-4">
                <div
                  v-for="(deferred, index) in results.deferredReasons"
                  :key="index"
                  class="p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <h3 class="font-semibold text-amber-900 mb-2">{{ deferred.condition }}</h3>
                  <p class="text-amber-800">{{ deferred.reason }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Sticky Sidebar -->
          <div class="lg:col-span-1">
            <ComprehensiveNextStepsPanel
              :comprehensive-next-steps="results.comprehensiveNextSteps"
              :sticky="true"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4">
          <Button
            @click="reset"
            variant="secondary"
            size="lg"
            class="flex-1"
          >
            <Icon name="document" size="sm" class="mr-2" />
            Analyze Another Letter
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            class="flex-1"
            @click="printReport"
          >
            <Icon name="printer" size="sm" class="mr-2" />
            Print Report
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from '~/components/atoms/Badge.vue'
import Button from '~/components/atoms/Button.vue'
import Icon from '~/components/atoms/Icon.vue'
import FileUploadZone from '~/components/organisms/FileUploadZone.vue'
import AnalysisLoadingState from '~/components/organisms/AnalysisLoadingState.vue'
import VeteranInfoCard from '~/components/molecules/VeteranInfoCard.vue'
import DecisionSummarySection from '~/components/organisms/DecisionSummarySection.vue'
import DenialAnalysisCard from '~/components/organisms/DenialAnalysisCard.vue'
import ComprehensiveNextStepsPanel from '~/components/organisms/ComprehensiveNextStepsPanel.vue'

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl

// State
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const analyzing = ref(false)
const processing = ref(false)
const results = ref<any>(null)
const error = ref<string | null>(null)

// Computed
const currentStage = computed(() => {
  if (uploading.value) return 'uploading'
  if (analyzing.value) return 'analyzing'
  if (processing.value) return 'processing'
  return 'uploading'
})

// Head
useHead({
  title: 'VA Decision Letter Analysis - FormReady',
  meta: [
    { name: 'description', content: 'Upload and analyze your VA decision letter to understand your claim decision' }
  ]
})

// Methods
const handleFileSelect = (file: File | null) => {
  if (file) {
    selectedFile.value = file
    error.value = null
  } else {
    error.value = 'Please upload a PDF file'
  }
}

const analyzeDecision = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  error.value = null

  try {
    // 1. Get presigned upload URL
    const presignedResponse = await fetch(`${apiUrl}/v1/storage/upload/presigned`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: selectedFile.value.name,
        contentType: selectedFile.value.type,
        path: 'decisions'
      })
    })

    if (!presignedResponse.ok) {
      throw new Error('Failed to get upload URL')
    }

    const { uploadUrl, s3Key, fileId } = await presignedResponse.json()

    // 2. Upload directly to S3 using presigned URL
    const s3Response = await fetch(uploadUrl, {
      method: 'PUT',
      body: selectedFile.value,
      headers: {
        'Content-Type': selectedFile.value.type
      }
    })

    if (!s3Response.ok) {
      throw new Error('Upload to S3 failed')
    }

    // Artificial delay to show upload progress
    await new Promise(resolve => setTimeout(resolve, 2000))

    uploading.value = false
    analyzing.value = true

    // Artificial delay to show analysis progress
    await new Promise(resolve => setTimeout(resolve, 3000))

    // 3. Trigger Python extraction service via API proxy
    const documentId = `decision-${Date.now()}`
    const extractResponse = await fetch(`${apiUrl}/v1/va-knowledge/extract-from-s3`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentId: documentId,
        storageUrl: s3Key,
        skipCache: true  // Always force re-extraction to get latest improvements
      })
    })

    if (!extractResponse.ok) {
      throw new Error('Analysis failed')
    }

    const extractData = await extractResponse.json()
    analyzing.value = false
    processing.value = true

    // Artificial delay to show processing progress
    await new Promise(resolve => setTimeout(resolve, 2000))

    processing.value = false

    // Display results
    results.value = extractData

  } catch (err: any) {
    console.error('Analysis error:', err)
    error.value = err.message || 'Failed to analyze decision letter. Please try again.'
    uploading.value = false
    analyzing.value = false
    processing.value = false
  }
}

const reset = () => {
  selectedFile.value = null
  uploading.value = false
  analyzing.value = false
  processing.value = false
  results.value = null
  error.value = null
}

const printReport = () => {
  window.print()
}
</script>
