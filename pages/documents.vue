<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Premium Gate -->
    <PremiumFeature
      feature-name="Document Management"
      description="Access and manage all your VA decision letter analyses in one place."
    >
      <!-- Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <!-- Breadcrumbs -->
          <div class="mb-4">
            <Breadcrumb />
          </div>

          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Your Documents</h1>
            <p class="text-lg text-slate-600">View and manage all your VA decision letter analyses</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingState
          variant="spinner"
          size="md"
          message="Loading your documents..."
          :full-height="false"
        />
      </div>

      <!-- Main Content -->
      <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Empty State -->
        <div v-if="documents.length === 0 && !loading" class="py-16">
          <EmptyState
            variant="empty"
            icon-name="heroicons:document-text"
            title="No documents yet"
            description="Upload your first VA decision letter to get started"
            :primary-action="{
              label: 'Analyze Your First Document',
              icon: 'heroicons:document-plus',
              to: '/analyze',
              variant: 'primary'
            }"
            footer-message="Your documents are securely stored and accessible anytime"
          />
        </div>

        <!-- Documents Grid -->
        <div v-else>
          <!-- Premium Features Banner -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold text-slate-900 mb-1 flex items-center">
                  <Icon name="heroicons:star" class="w-5 h-5 text-yellow-500 mr-2" />
                  Premium Document Management
                </h3>
                <p class="text-sm text-slate-600">
                  Export documents, advanced filtering, bulk operations, and unlimited storage
                </p>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-bold text-slate-900">
              All Documents ({{ pagination.total }})
            </h2>
            <Button
              @click="navigateTo('/analyze')"
              variant="primary"
            >
              <Icon name="heroicons:document-plus" class="w-5 h-5 mr-2" />
              Analyze New Document
            </Button>
          </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="doc in documents"
            :key="doc.documentId"
            class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-blue-300 overflow-hidden"
          >
            <!-- Document Header -->
            <div
              @click="navigateTo(`/analysis/${doc.documentId}`)"
              class="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200 cursor-pointer"
            >
              <div class="flex items-start justify-between mb-4">
                <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform">
                  <Icon name="heroicons:document-text" class="w-6 h-6 text-white" />
                </div>
                <Badge :variant="getStatusVariant(doc.status)" :text="doc.status" />
              </div>
              <h3 class="font-semibold text-slate-900 mb-1 truncate">
                {{ doc.fileName }}
              </h3>
              <p class="text-sm text-slate-600">
                {{ formatDate(doc.analyzedAt) }}
              </p>
            </div>

            <!-- Document Stats -->
            <div
              @click="navigateTo(`/analysis/${doc.documentId}`)"
              class="p-6 cursor-pointer"
            >
              <div v-if="doc.combinedRating !== null || doc.monthlyPayment !== null" class="grid grid-cols-2 gap-4 mb-4">
                <div v-if="doc.combinedRating !== null" class="text-center p-3 bg-blue-50 rounded-lg">
                  <div class="text-2xl font-bold text-blue-600">{{ doc.combinedRating }}%</div>
                  <div class="text-xs text-slate-600">Combined Rating</div>
                </div>
                <div v-if="doc.monthlyPayment !== null" class="text-center p-3 bg-green-50 rounded-lg">
                  <div class="text-xl font-bold text-green-600">${{ Math.round(doc.monthlyPayment) }}</div>
                  <div class="text-xs text-slate-600">Monthly</div>
                </div>
              </div>

              <!-- Condition Summary -->
              <div v-if="doc.conditionsCount" class="flex items-center justify-between text-sm mb-4">
                <div class="flex items-center text-green-600">
                  <Icon name="heroicons:check-circle" class="w-4 h-4 mr-1" />
                  <span>{{ doc.grantedCount || 0 }} Granted</span>
                </div>
                <div class="flex items-center text-red-600">
                  <Icon name="heroicons:x-circle" class="w-4 h-4 mr-1" />
                  <span>{{ doc.deniedCount || 0 }} Denied</span>
                </div>
                <div v-if="doc.deferredCount > 0" class="flex items-center text-amber-600">
                  <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
                  <span>{{ doc.deferredCount || 0 }} Deferred</span>
                </div>
              </div>

              <!-- View Button -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-200">
                <span class="text-sm text-slate-600">Click to view details</span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5 text-blue-600 hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="px-6 pb-6 flex gap-2">
              <Button
                @click.stop="downloadPdf(doc.documentId, doc.fileName)"
                variant="secondary"
                size="sm"
                class="flex-1"
                :disabled="downloadingId === doc.documentId"
              >
                <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-1" />
                {{ downloadingId === doc.documentId ? 'Downloading...' : 'Download PDF' }}
              </Button>
              <Button
                @click.stop="confirmDelete(doc)"
                variant="danger"
                size="sm"
              >
                <Icon name="heroicons:trash" class="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.limit" class="mt-8 flex items-center justify-center gap-2">
          <Button
            @click="goToPage(pagination.page - 1)"
            variant="ghost"
            size="sm"
            :disabled="pagination.page === 1"
          >
            <Icon name="heroicons:chevron-left" class="w-5 h-5" />
            Previous
          </Button>

          <div class="flex gap-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="page !== '...' && goToPage(page as number)"
              :class="[
                'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                page === pagination.page
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'text-slate-400 cursor-default'
                  : 'text-slate-600 hover:bg-slate-100'
              ]"
              :disabled="page === '...'"
            >
              {{ page }}
            </button>
          </div>

          <Button
            @click="goToPage(pagination.page + 1)"
            variant="ghost"
            size="sm"
            :disabled="pagination.page >= totalPages"
          >
            Next
            <Icon name="heroicons:chevron-right" class="w-5 h-5" />
          </Button>
        </div>
        </div>
      </div>
    </PremiumFeature>

    <!-- Delete Confirmation Modal -->
    <Modal
      v-model:isOpen="deleteModal.isOpen"
      title="Delete Document"
      description="Are you sure you want to delete this document? This action cannot be undone."
      icon="heroicons:exclamation-triangle"
      icon-variant="danger"
      confirm-text="Delete"
      confirm-variant="danger"
      :loading="deleteModal.loading"
      loading-text="Deleting..."
      @confirm="handleDelete"
      @cancel="deleteModal.isOpen = false"
    >
      <div class="bg-slate-50 rounded-lg p-4 text-sm">
        <div class="font-medium text-slate-900 mb-1">{{ deleteModal.document?.fileName }}</div>
        <div class="text-slate-600">Document ID: {{ deleteModal.document?.documentId }}</div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'
import Badge from '~/components/atoms/Badge.vue'
import Navigation from '~/components/organisms/Navigation.vue'
import Modal from '~/components/molecules/Modal.vue'
import PremiumFeature from '~/components/organisms/PremiumFeature.vue'
import EmptyState from '~/components/molecules/EmptyState.vue'
import LoadingState from '~/components/molecules/LoadingState.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'

useHead({
  title: 'Your Documents - ClaimReady',
  meta: [
    { name: 'description', content: 'View all your VA decision letter analyses' }
  ]
})

// Protect this page with premium middleware
definePageMeta({
  middleware: 'premium'
})

const router = useRouter()
const toast = useToast()
// Use subscription composable for premium features
const { isPremium, fetchSubscriptionStatus } = useSubscription()

const loading = ref(true)
const documents = ref<any[]>([])
const downloadingId = ref<string | null>(null)

// Pagination state
const pagination = ref({
  page: 1,
  limit: 9,
  total: 0
})

// Delete modal state
const deleteModal = ref({
  isOpen: false,
  loading: false,
  document: null as any
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
    await Promise.all([
      loadDocuments(),
      fetchSubscriptionStatus()
    ])
  } catch (error) {
    console.error('Failed to load documents:', error)
    toast.error('Failed to load documents')
  } finally {
    loading.value = false
  }
})

const loadDocuments = async () => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall(`/api/documents/analyses?page=${pagination.value.page}&limit=${pagination.value.limit}`)

    if (response.ok) {
      const data = await response.json()
      documents.value = data.analyses.map((doc: any) => ({
        documentId: doc.documentId,
        fileName: doc.fileName,
        status: doc.status || 'analyzed',
        analyzedAt: doc.analyzedAt,
        combinedRating: doc.combinedRating,
        monthlyPayment: doc.monthlyPayment,
        conditionsCount: doc.conditions.length || 0,
        grantedCount: doc.conditions.filter((condition: any) => condition.status === 'approved').length || 0,
        deniedCount: doc.conditions.filter((condition: any) => condition.status === 'denied').length || 0,
        deferredCount: doc.conditions.filter((condition: any) => condition.status === 'deferred').length || 0
      }))

      pagination.value.total = data.pagination.total
    } else {
      throw new Error('Failed to fetch documents')
    }
  } catch (error) {
    console.error('Failed to load documents:', error)
    throw error
  }
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPages.value) return

  pagination.value.page = page
  loading.value = true

  try {
    await loadDocuments()
  } catch (error) {
    toast.error('Failed to load page')
  } finally {
    loading.value = false
  }
}

const totalPages = computed(() => {
  return Math.ceil(pagination.value.total / pagination.value.limit)
})

const visiblePages = computed(() => {
  const current = pagination.value.page
  const total = totalPages.value
  const pages: (number | string)[] = []

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    pages.push(total)
  }

  return pages
})

const confirmDelete = (doc: any) => {
  deleteModal.value.document = doc
  deleteModal.value.isOpen = true
}

const handleDelete = async () => {
  if (!deleteModal.value.document) return

  deleteModal.value.loading = true
  const documentIdToDelete = deleteModal.value.document.documentId

  try {
    const { apiCall } = useApi()
    const response = await apiCall(`/api/documents/${documentIdToDelete}`, {
      method: 'DELETE'
    })

    if (response.ok) {
      toast.success('Document deleted successfully')

      // If we're on a page that will be empty after deletion, go to previous page
      const willBeEmpty = documents.value.length === 1 && pagination.value.page > 1
      if (willBeEmpty) {
        pagination.value.page -= 1
      }

      // Reload documents to refresh the list
      loading.value = true
      try {
        await loadDocuments()
      } finally {
        loading.value = false
      }
    } else {
      let errorMessage = 'Failed to delete document'
      try {
        const error = await response.json()
        errorMessage = error.message || errorMessage
      } catch (e) {
        // Failed to parse error response, use default message
      }
      throw new Error(errorMessage)
    }
  } catch (error: any) {
    console.error('Failed to delete document:', error)
    toast.error(error.message || 'Failed to delete document')
  } finally {
    // Always close modal and reset state, whether success or failure
    deleteModal.value.loading = false
    deleteModal.value.isOpen = false
    deleteModal.value.document = null
  }
}

const downloadPdf = async (documentId: string, fileName: string) => {
  downloadingId.value = documentId

  try {
    const { apiCall } = useApi()
    const response = await apiCall(`/api/documents/${documentId}/pdf`)

    if (response.ok) {
      const data = await response.json()

      // Open the presigned URL in a new tab to download
      window.open(data.downloadUrl, '_blank')

      toast.success('Download started')
    } else {
      throw new Error('Failed to get download URL')
    }
  } catch (error: any) {
    console.error('Failed to download PDF:', error)
    toast.error(error.message || 'Failed to download PDF')
  } finally {
    downloadingId.value = null
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

const getStatusVariant = (status: string): string => {
  switch (status) {
    case 'approved': return 'success'
    case 'denied': return 'danger'
    case 'pending': return 'warning'
    default: return 'neutral'
  }
}
</script>
