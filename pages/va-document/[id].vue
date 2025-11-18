<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header with Back Button -->
      <div class="mb-6 flex items-center justify-between">
        <button
          @click="navigateTo('/documents')"
          class="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Icon name="heroicons:arrow-left" size="20" class="mr-2" />
          Back to Documents
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-sm p-8">
        <div class="flex items-center justify-center">
          <Icon name="svg-spinners:ring-resize" size="48" class="text-blue-600" />
          <span class="ml-3 text-slate-600">Loading document details...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-sm p-8">
        <EmptyState
          variant="error"
          icon-name="heroicons:exclamation-circle"
          title="Failed to load document"
          :description="error"
          :primary-action="{
            label: 'Back to Documents',
            icon: 'heroicons:arrow-left',
            to: '/documents',
            variant: 'primary'
          }"
        />
      </div>

      <!-- Document Details -->
      <div v-else-if="document" class="space-y-6">
        <!-- Document Header Card -->
        <Card class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <Icon name="heroicons:document-text" size="24" class="text-slate-600" />
                <h1 class="text-2xl font-bold text-slate-900">{{ document.fileName }}</h1>
              </div>
              <p class="text-slate-600 text-sm mb-4">
                Synced from {{ document.sourceService }} on {{ formatDate(document.createdAt) }}
              </p>

              <!-- Status Badge -->
              <div class="flex items-center gap-3">
                <Badge
                  :text="getStatusLabel(document.processingStatus)"
                  :variant="getStatusVariant(document.processingStatus)"
                  size="md"
                  :icon="getStatusIcon(document.processingStatus)"
                />
                <Badge
                  v-if="document.documentType"
                  :text="getDocumentTypeLabel(document.documentType)"
                  variant="primary"
                  size="md"
                  icon="heroicons:document-check"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col gap-2">
              <Button
                v-if="document.processingStatus === 'failed'"
                @click="retryProcessing"
                :loading="retrying"
                variant="primary"
                size="sm"
              >
                <Icon name="heroicons:arrow-path" size="16" class="mr-1" />
                Retry Processing
              </Button>
              <Button
                v-if="document.filePath"
                @click="downloadDocument"
                variant="secondary"
                size="sm"
              >
                <Icon name="heroicons:arrow-down-tray" size="16" class="mr-1" />
                Download
              </Button>
            </div>
          </div>
        </Card>

        <!-- Document Metadata Card -->
        <Card class="p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Icon name="heroicons:information-circle" size="20" class="mr-2" />
            Document Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-slate-500">Document ID</p>
              <p class="text-sm font-mono text-slate-900">{{ document.id }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Source Document ID</p>
              <p class="text-sm font-mono text-slate-900">{{ document.sourceDocumentId }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">File Size</p>
              <p class="text-sm text-slate-900">{{ formatBytes(document.fileSizeBytes) }}</p>
            </div>
            <div v-if="document.classificationConfidence">
              <p class="text-sm text-slate-500">Classification Confidence</p>
              <p class="text-sm text-slate-900">{{ Math.round(document.classificationConfidence * 100) }}%</p>
            </div>
            <div>
              <p class="text-sm text-slate-500">Created</p>
              <p class="text-sm text-slate-900">{{ formatDateTime(document.createdAt) }}</p>
            </div>
            <div v-if="document.processedAt">
              <p class="text-sm text-slate-500">Processed</p>
              <p class="text-sm text-slate-900">{{ formatDateTime(document.processedAt) }}</p>
            </div>
            <div v-if="document.processingModel" class="md:col-span-2">
              <p class="text-sm text-slate-500">Processing Model</p>
              <p class="text-sm text-slate-900">{{ document.processingModel }} (v{{ document.processingVersion }})</p>
            </div>
          </div>
        </Card>

        <!-- Processing Error Card (if failed) -->
        <Card v-if="document.processingStatus === 'failed' && document.processingError" class="p-6 border-l-4 border-red-500">
          <h2 class="text-lg font-semibold text-red-900 mb-2 flex items-center">
            <Icon name="heroicons:exclamation-triangle" size="20" class="mr-2" />
            Processing Error
          </h2>
          <p class="text-sm text-red-700 font-mono bg-red-50 p-3 rounded">
            {{ document.processingError }}
          </p>
        </Card>

        <!-- Processing Timeline Card -->
        <Card v-if="document.processingStatus !== 'uploaded'" class="p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Icon name="heroicons:clock" size="20" class="mr-2" />
            Processing Timeline
          </h2>

          <div class="space-y-4">
            <!-- Uploaded -->
            <div class="flex items-start">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 flex-shrink-0">
                <Icon name="heroicons:arrow-up-tray" size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Document Uploaded</p>
                <p class="text-xs text-slate-500">{{ formatDateTime(document.createdAt) }}</p>
              </div>
            </div>

            <!-- Processing -->
            <div v-if="document.processingStatus !== 'uploaded'" class="flex items-start">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 mr-3 flex-shrink-0">
                <Icon name="heroicons:cog-6-tooth" size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Processing Started</p>
                <p class="text-xs text-slate-500">Text extraction and classification</p>
              </div>
            </div>

            <!-- Classified -->
            <div v-if="document.processingStatus === 'classified'" class="flex items-start">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mr-3 flex-shrink-0">
                <Icon name="heroicons:check-circle" size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Classification Complete</p>
                <p class="text-xs text-slate-500">
                  {{ formatDateTime(document.processedAt) }} -
                  Classified as {{ getDocumentTypeLabel(document.documentType) }}
                </p>
              </div>
            </div>

            <!-- Failed -->
            <div v-if="document.processingStatus === 'failed'" class="flex items-start">
              <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mr-3 flex-shrink-0">
                <Icon name="heroicons:x-circle" size="16" />
              </div>
              <div>
                <p class="text-sm font-medium text-slate-900">Processing Failed</p>
                <p class="text-xs text-slate-500">{{ formatDateTime(document.processedAt || document.createdAt) }}</p>
              </div>
            </div>
          </div>
        </Card>

        <!-- Content Preview Card -->
        <Card class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-900 flex items-center">
              <Icon name="heroicons:document-magnifying-glass" size="20" class="mr-2" />
              Document Content
            </h2>
            <button
              v-if="documentContent && documentContent.hasFullContent"
              @click="toggleContentExpanded"
              class="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              {{ contentExpanded ? 'Show Less' : 'View Full Content' }}
            </button>
          </div>

          <!-- Loading Content -->
          <div v-if="contentLoading" class="flex items-center justify-center py-8">
            <Icon name="svg-spinners:ring-resize" size="32" class="text-blue-600 mr-2" />
            <span class="text-slate-600">Loading content...</span>
          </div>

          <!-- Content Error -->
          <div v-else-if="contentError" class="text-center py-8 bg-red-50 rounded-lg border border-red-200">
            <Icon name="heroicons:exclamation-circle" size="48" class="text-red-400 mx-auto mb-2" />
            <p class="text-red-700">{{ contentError }}</p>
          </div>

          <!-- No Content Extracted -->
          <div v-else-if="!documentContent?.hasFullContent" class="text-center py-8 bg-slate-50 rounded-lg">
            <Icon name="heroicons:eye-slash" size="48" class="text-slate-400 mx-auto mb-2" />
            <p class="text-slate-600">No content has been extracted from this document yet</p>
            <p class="text-sm text-slate-500 mt-1">
              Content will be available once document processing completes
            </p>
          </div>

          <!-- Document Content -->
          <div v-else>
            <!-- Content Metadata -->
            <div class="flex items-center gap-4 mb-4 text-sm text-slate-600">
              <div class="flex items-center">
                <Icon name="heroicons:document-text" size="16" class="mr-1" />
                {{ documentContent.wordCount }} words
              </div>
              <div v-if="documentContent.extractionMethod !== 'not-extracted'" class="flex items-center">
                <Icon name="heroicons:cpu-chip" size="16" class="mr-1" />
                {{ formatExtractionMethod(documentContent.extractionMethod) }}
              </div>
            </div>

            <!-- Content Text -->
            <div class="prose prose-sm max-w-none bg-slate-50 p-4 rounded-lg border border-slate-200">
              <pre class="whitespace-pre-wrap font-sans text-slate-800 text-sm leading-relaxed">{{ displayedContent }}</pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { apiCall } = useApi()

const documentId = route.params.id as string

// State
const document = ref<any>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const retrying = ref(false)

// Content state
const documentContent = ref<any>(null)
const contentLoading = ref(false)
const contentError = ref<string | null>(null)
const contentExpanded = ref(false)
const PREVIEW_LENGTH = 1000

// Fetch document details
const fetchDocument = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await apiCall(`/api/document-management/documents/${documentId}`)

    if (!response.ok) {
      if (response.status === 404) {
        error.value = 'Document not found'
      } else {
        error.value = `Failed to load document (${response.status})`
      }
      return
    }

    document.value = await response.json()

    // Fetch content after document loads
    await fetchDocumentContent()
  } catch (err) {
    console.error('Error fetching document:', err)
    error.value = 'Network error - failed to load document'
  } finally {
    loading.value = false
  }
}

// Fetch document content
const fetchDocumentContent = async () => {
  contentLoading.value = true
  contentError.value = null

  try {
    const response = await apiCall(`/api/document-management/documents/${documentId}/content?maxLength=${PREVIEW_LENGTH}`)

    if (!response.ok) {
      throw new Error(`Failed to load content (${response.status})`)
    }

    documentContent.value = await response.json()
  } catch (err) {
    console.error('Error fetching document content:', err)
    contentError.value = 'Failed to load document content'
  } finally {
    contentLoading.value = false
  }
}

// Toggle content expansion
const toggleContentExpanded = () => {
  contentExpanded.value = !contentExpanded.value
}

// Computed displayed content (preview or full)
const displayedContent = computed(() => {
  if (!documentContent.value) return ''

  if (contentExpanded.value) {
    return documentContent.value.extractedText
  } else {
    return documentContent.value.textPreview
  }
})

// Retry processing for failed documents
const retryProcessing = async () => {
  retrying.value = true

  try {
    const response = await apiCall(`/api/document-management/documents/${documentId}/retry`, {
      method: 'POST'
    })

    if (!response.ok) {
      throw new Error(`Failed to retry processing (${response.status})`)
    }

    // Refresh document details
    await fetchDocument()
  } catch (err) {
    console.error('Error retrying processing:', err)
    error.value = 'Failed to retry processing'
  } finally {
    retrying.value = false
  }
}

// Download document
const downloadDocument = () => {
  if (document.value?.filePath) {
    // TODO: Implement actual download from S3
    // For now, just log the file path
    console.log('Download file:', document.value.filePath)
    alert('Download functionality coming soon!')
  }
}

// Formatting helpers
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatBytes = (bytes: number) => {
  if (!bytes) return 'Unknown'
  const kb = bytes / 1024
  const mb = kb / 1024
  if (mb >= 1) return `${mb.toFixed(2)} MB`
  return `${kb.toFixed(2)} KB`
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    uploaded: 'Uploaded',
    processing: 'Processing',
    classified: 'Classified',
    failed: 'Failed'
  }
  return labels[status] || status
}

const getStatusVariant = (status: string): 'approved' | 'denied' | 'deferred' | 'default' | 'primary' | 'secondary' => {
  const variants: Record<string, 'approved' | 'denied' | 'deferred' | 'default' | 'primary' | 'secondary'> = {
    uploaded: 'default',
    processing: 'deferred',
    classified: 'approved',
    failed: 'denied'
  }
  return variants[status] || 'default'
}

const getStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    uploaded: 'heroicons:arrow-up-tray',
    processing: 'heroicons:cog-6-tooth',
    classified: 'heroicons:check-circle',
    failed: 'heroicons:x-circle'
  }
  return icons[status] || 'heroicons:document'
}

const getDocumentTypeLabel = (type: string | undefined) => {
  if (!type) return 'Unknown'
  const labels: Record<string, string> = {
    decision_letter: 'Decision Letter',
    correspondence: 'Correspondence',
    medical_record: 'Medical Record',
    administrative: 'Administrative'
  }
  return labels[type] || type
}

const formatExtractionMethod = (method: string) => {
  const methods: Record<string, string> = {
    'llm-extraction': 'AI Extracted',
    'metadata-summary': 'Metadata Summary',
    'not-extracted': 'Not Extracted',
    'pdf-parse': 'PDF Parser'
  }
  return methods[method] || method
}

// Fetch document on mount
onMounted(() => {
  fetchDocument()
})

// Set page meta
useHead({
  title: document.value?.fileName || 'VA Document Details'
})
</script>
