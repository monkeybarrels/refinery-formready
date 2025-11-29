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
        <!-- Overall empty state when NO documents in either tab -->
        <div v-if="analysesPagination.total === 0 && vaDocsPagination.total === 0" class="py-16">
          <EmptyState
            variant="empty"
            icon-name="heroicons:document-text"
            title="No documents yet"
            description="Upload your first VA decision letter to get started. Use the Chrome extension to sync documents from VA.gov."
            :primary-action="{
              label: 'Analyze Your First Document',
              icon: 'heroicons:document-plus',
              to: '/analyze',
              variant: 'primary'
            }"
            footer-message="Your documents are securely stored and accessible anytime"
          />
        </div>

        <!-- Show tabs if ANY documents exist (either tab) -->
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

          <!-- Tab Navigation -->
          <div class="flex items-center justify-between mb-6">
            <div class="flex space-x-1 bg-slate-100 rounded-lg p-1">
              <button
                @click="activeTab = 'analyses'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'analyses'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Analyses ({{ analysesPagination.total }})
              </button>
              <button
                @click="activeTab = 'va-documents'"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'va-documents'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                VA Documents ({{ vaDocsPagination.total }})
              </button>
            </div>
            <div class="flex gap-2">
              <!-- Process All Documents temporarily disabled -->
              <!-- <Button
                v-if="activeTab === 'va-documents' && vaDocuments.length > 0"
                @click="processAllDocuments"
                :loading="processingAll"
                variant="secondary"
              >
                <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 mr-2" />
                Process All Documents
              </Button> -->
              <Button
                @click="navigateTo('/analyze')"
                variant="primary"
              >
                <Icon name="heroicons:document-plus" class="w-5 h-5 mr-2" />
                Analyze New Document
              </Button>
            </div>
          </div>

        <!-- Analyses Tab -->
        <div v-if="activeTab === 'analyses'">
          <!-- Empty state for analyses tab -->
          <div v-if="analysisDocuments.length === 0" class="py-16">
            <EmptyState
              variant="empty"
              icon-name="heroicons:document-text"
              title="No analyzed documents yet"
              description="Upload and analyze your first VA decision letter to get started"
              :primary-action="{
                label: 'Analyze Your First Document',
                icon: 'heroicons:document-plus',
                to: '/analyze',
                variant: 'primary'
              }"
            />
          </div>

          <!-- Documents grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="doc in analysisDocuments"
              :key="doc.documentId"
              class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-blue-300 overflow-hidden flex flex-col"
            >
            <!-- Document Header -->
            <div
              @click="navigateTo(`/analysis/${doc.documentId}`)"
              :class="[
                'p-6 border-b cursor-pointer',
                isDocumentAnalyzed(doc)
                  ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200'
                  : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
              ]"
            >
              <div class="flex items-start justify-between mb-4">
                <div
                  :class="[
                    'w-12 h-12 rounded-lg flex items-center justify-center hover:scale-110 transition-transform',
                    isDocumentAnalyzed(doc) ? 'bg-blue-600' : 'bg-amber-500'
                  ]"
                >
                  <Icon
                    :name="isDocumentAnalyzed(doc) ? 'heroicons:document-text' : 'heroicons:clock'"
                    class="w-6 h-6 text-white"
                  />
                </div>
                <Badge :variant="getAnalysisStatusVariant(doc.status)" :text="getAnalysisStatusLabel(doc.status)" />
              </div>
              <h3 class="font-semibold text-slate-900 mb-1 truncate">
                {{ doc.fileName }}
              </h3>
              <p class="text-sm text-slate-600">
                <span v-if="doc.decisionDate">Letter: {{ doc.decisionDate }}</span>
                <span v-else>Uploaded {{ formatDate(doc.analyzedAt) }}</span>
              </p>
            </div>

            <!-- Document Stats - Always shown with consistent height -->
            <div
              @click="navigateTo(`/analysis/${doc.documentId}`)"
              class="p-6 cursor-pointer flex-1 flex flex-col"
            >
              <!-- Rating Section - Always shown -->
              <div class="h-20 mb-4">
                <div v-if="isDocumentAnalyzed(doc) && doc.combinedRating !== null" class="text-center p-3 bg-blue-50 rounded-lg h-full flex flex-col justify-center">
                  <div class="text-2xl font-bold text-blue-600">{{ doc.combinedRating }}%</div>
                  <div class="text-xs text-slate-600">Combined Rating</div>
                </div>
                <div v-else-if="isDocumentAnalyzed(doc)" class="text-center p-3 bg-slate-50 rounded-lg h-full flex flex-col justify-center">
                  <div class="text-lg font-semibold text-slate-400">No Rating</div>
                  <div class="text-xs text-slate-500">Combined rating not found</div>
                </div>
                <div v-else class="text-center p-3 bg-amber-50 rounded-lg h-full flex flex-col justify-center border border-amber-200">
                  <Icon name="heroicons:clock" class="w-6 h-6 text-amber-500 mx-auto mb-1" />
                  <div class="text-sm font-medium text-amber-700">Pending Analysis</div>
                  <div class="text-xs text-amber-600">Click to process</div>
                </div>
              </div>

              <!-- Condition Summary - Always shown with fixed height -->
              <div class="h-8 mb-4">
                <div v-if="isDocumentAnalyzed(doc) && doc.conditionsCount > 0" class="flex items-center justify-center gap-4 text-sm">
                  <div class="flex items-center text-green-600">
                    <Icon name="heroicons:check-circle" class="w-4 h-4 mr-1" />
                    <span>{{ doc.grantedCount || 0 }} Granted</span>
                  </div>
                  <div class="flex items-center text-red-600">
                    <Icon name="heroicons:x-circle" class="w-4 h-4 mr-1" />
                    <span>{{ doc.deniedCount || 0 }} Denied</span>
                  </div>
                </div>
                <div v-else-if="isDocumentAnalyzed(doc)" class="text-center text-sm text-slate-400">
                  No conditions found
                </div>
                <div v-else class="text-center text-sm text-amber-600">
                  Conditions will appear after analysis
                </div>
              </div>

              <!-- View Button - Always at bottom -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-200 mt-auto">
                <span class="text-sm text-slate-600">
                  {{ isDocumentAnalyzed(doc) ? 'Click to view details' : 'Click to analyze' }}
                </span>
                <Icon name="heroicons:arrow-right" class="w-5 h-5 text-blue-600 hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <!-- Action Buttons - Fixed position at bottom -->
            <div class="px-6 pb-6 flex gap-2">
              <Button
                @click.stop="downloadPdf(doc.documentId)"
                variant="secondary"
                size="sm"
                class="flex-1"
                :disabled="downloadingId === doc.documentId || !isDocumentAnalyzed(doc)"
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
        </div>

        <!-- VA Documents Tab -->
        <div v-if="activeTab === 'va-documents'">
          <!-- Empty state for VA documents tab -->
          <div v-if="vaDocuments.length === 0" class="py-16">
            <EmptyState
              variant="empty"
              icon-name="heroicons:document-check"
              title="No VA documents yet"
              description="Sync your VA.gov account to automatically import your decision letters"
              :primary-action="{
                label: 'Go to VA Sync',
                icon: 'heroicons:arrow-path',
                to: '/va-sync',
                variant: 'primary'
              }"
            />
          </div>

          <!-- Documents Table -->
          <div v-else class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Document
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">
                  <tr
                    v-for="doc in vaDocuments"
                    :key="doc.id"
                    @click="openDocumentDetail(doc.id)"
                    class="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <!-- Document Name & Icon -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Icon name="heroicons:document-text" size="20" class="text-green-600" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-slate-900">
                            {{ doc.fileName }}
                          </div>
                          <div class="text-xs text-slate-500">
                            {{ formatBytes(doc.fileSizeBytes) }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <!-- Document Type -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-slate-900">
                        {{ getDocumentTypeLabel(doc.documentType) }}
                      </div>
                      <div v-if="doc.classificationConfidence" class="text-xs text-slate-500">
                        {{ Math.round(doc.classificationConfidence * 100) }}% confidence
                      </div>
                    </td>

                    <!-- Status -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <Badge
                        :variant="getVaStatusVariant(doc.processingStatus)"
                        :text="getStatusLabel(doc.processingStatus)"
                        size="sm"
                      />
                    </td>

                    <!-- Date -->
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div>{{ formatDate(doc.createdAt) }}</div>
                      <div v-if="doc.processedAt" class="text-xs text-slate-400">
                        Processed {{ formatDate(doc.processedAt) }}
                      </div>
                    </td>

                    <!-- Actions -->
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end gap-1">
                        <!-- Slot 1: View Details - Always visible -->
                        <button
                          @click.stop="openDocumentDetail(doc.id)"
                          type="button"
                          title="View Details"
                          class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                          <Icon name="heroicons:eye" size="16" />
                        </button>

                        <!-- Slot 2: Analyze/Retry - Conditional based on doc type and status -->
                        <button
                          v-if="doc.documentType === 'decision_letter'"
                          @click.stop="canAnalyze(doc) && analyzeDocument(doc.id)"
                          type="button"
                          :title="getAnalysisButtonTitle(doc)"
                          :disabled="!canAnalyze(doc)"
                          :class="[
                            'w-8 h-8 flex items-center justify-center rounded transition-colors',
                            doc.analysisStatus === 'analyzing' ? 'text-blue-400 cursor-not-allowed' :
                            doc.analysisStatus === 'completed' ? 'text-green-600 cursor-default' :
                            doc.analysisStatus === 'failed' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' :
                            canAnalyze(doc) ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-50' :
                            'text-gray-300 cursor-not-allowed'
                          ]"
                        >
                          <Icon :name="getAnalysisButtonIcon(doc)" size="16" />
                        </button>
                        <button
                          v-else-if="doc.processingStatus === 'failed'"
                          @click.stop="retryProcessing(doc.id)"
                          type="button"
                          title="Retry Processing"
                          class="w-8 h-8 flex items-center justify-center rounded text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors"
                        >
                          <Icon name="heroicons:arrow-path" size="16" />
                        </button>
                        <div v-else class="w-8 h-8"></div>

                        <!-- Slot 3: Delete - Always visible -->
                        <button
                          @click.stop="confirmDelete(doc)"
                          type="button"
                          title="Delete Document"
                          class="w-8 h-8 flex items-center justify-center rounded text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <Icon name="heroicons:trash" size="16" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="currentPagination.total > currentPagination.limit" class="mt-8 flex items-center justify-center gap-2">
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
      <div class="space-y-3">
        <!-- Document Name -->
        <div class="bg-slate-50 rounded-lg p-4">
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Document Name</p>
          <p class="text-lg font-semibold text-slate-900">{{ deleteModal.document?.fileName }}</p>
        </div>

        <!-- Document Type -->
        <div v-if="deleteModal.document?.documentType" class="bg-slate-50 rounded-lg p-4">
          <p class="text-xs text-slate-500 uppercase tracking-wider mb-2">Document Type</p>
          <Badge :text="getDocumentTypeLabel(deleteModal.document?.documentType)" />
        </div>
      </div>
    </Modal>

    <!-- Document Detail Modal -->
    <Modal
      v-model:isOpen="detailModal.isOpen"
      :title="detailModal.document?.fileName || 'Document Details'"
      size="xl"
      :show-footer="false"
      @cancel="detailModal.isOpen = false"
    >
      <!-- Loading State -->
      <div v-if="detailModal.loading" class="flex items-center justify-center py-12">
        <Icon name="svg-spinners:ring-resize" size="48" class="text-blue-600" />
        <span class="ml-3 text-slate-600">Loading document details...</span>
      </div>

      <!-- Document Details -->
      <div v-else-if="detailModal.document" class="space-y-6 max-h-[70vh] overflow-y-auto">
        <!-- File Name Editor -->
        <div class="bg-slate-50 rounded-lg p-4">
          <label class="block text-xs text-slate-500 uppercase tracking-wider mb-2">
            Document Name
          </label>
          <div class="flex items-center gap-2">
            <input
              v-if="detailModal.editingFileName"
              v-model="detailModal.editedFileName"
              @keyup.enter="saveFileName"
              @keyup.escape="cancelEditFileName"
              type="text"
              class="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document name"
              autofocus
            />
            <p v-else class="flex-1 text-sm font-medium text-slate-900">
              {{ detailModal.document.fileName }}
            </p>
            <Button
              v-if="!detailModal.editingFileName"
              @click="startEditFileName"
              variant="ghost"
              size="sm"
              title="Edit filename"
            >
              <Icon name="heroicons:pencil" size="16" />
            </Button>
            <template v-else>
              <Button
                @click="saveFileName"
                variant="primary"
                size="sm"
                :loading="detailModal.savingFileName"
              >
                <Icon name="heroicons:check" size="16" />
              </Button>
              <Button
                @click="cancelEditFileName"
                variant="ghost"
                size="sm"
              >
                <Icon name="heroicons:x-mark" size="16" />
              </Button>
            </template>
          </div>
        </div>

        <!-- Document Metadata -->
        <div class="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
          <div>
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Status</p>
            <Badge
              :variant="getVaStatusVariant(detailModal.document.processingStatus)"
              :text="getStatusLabel(detailModal.document.processingStatus)"
              size="sm"
            />
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Document Type</p>
            <p class="text-sm font-medium text-slate-900">
              {{ getDocumentTypeLabel(detailModal.document.documentType) }}
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">File Size</p>
            <p class="text-sm font-medium text-slate-900">
              {{ formatBytes(detailModal.document.fileSizeBytes) }}
            </p>
          </div>
          <div v-if="detailModal.document.classificationConfidence">
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Confidence</p>
            <p class="text-sm font-medium text-slate-900">
              {{ Math.round(detailModal.document.classificationConfidence * 100) }}%
            </p>
          </div>
          <div>
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Upload Date</p>
            <p class="text-sm font-medium text-slate-900">
              {{ new Date(detailModal.document.createdAt).toLocaleDateString() }}
            </p>
          </div>
          <div v-if="detailModal.document.processedAt">
            <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Processed Date</p>
            <p class="text-sm font-medium text-slate-900">
              {{ new Date(detailModal.document.processedAt).toLocaleDateString() }}
            </p>
          </div>
        </div>

        <!-- Processing Error (if failed) -->
        <div v-if="detailModal.document.processingStatus === 'failed' && detailModal.document.processingError"
             class="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
          <div class="flex items-start">
            <Icon name="heroicons:exclamation-triangle" size="20" class="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 class="text-sm font-semibold text-red-900 mb-1">Processing Error</h4>
              <p class="text-sm text-red-700">{{ detailModal.document.processingError }}</p>
            </div>
          </div>
        </div>

        <!-- PDF Preview -->
        <div>
          <div class="flex items-center mb-3">
            <h3 class="text-lg font-semibold text-slate-900 flex items-center">
              <Icon name="heroicons:document" size="20" class="mr-2" />
              PDF Preview
            </h3>
          </div>

          <!-- Loading PDF -->
          <div v-if="detailModal.pdfLoading" class="flex items-center justify-center py-12 bg-slate-50 rounded-lg">
            <Icon name="svg-spinners:ring-resize" size="32" class="text-blue-600 mr-2" />
            <span class="text-slate-600">Loading PDF...</span>
          </div>

          <!-- PDF Viewer -->
          <div v-else-if="detailModal.pdfUrl" class="bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            <iframe
              :src="detailModal.pdfUrl"
              class="w-full h-[500px]"
              frameborder="0"
            ></iframe>
          </div>

          <!-- No PDF Available -->
          <div v-else class="text-center py-12 bg-slate-50 rounded-lg">
            <Icon name="heroicons:document-minus" size="48" class="text-slate-400 mx-auto mb-2" />
            <p class="text-slate-600">PDF preview not available</p>
          </div>
        </div>

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

const toast = useToast()
// Use subscription composable for premium features
const { fetchSubscriptionStatus } = useSubscription()

// Setup WebSocket notifications
const notifications = useNotifications()

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const downloadingId = ref<string | null>(null)
const processingAll = ref(false)

// Document detail modal state
const detailModal = ref({
  isOpen: false,
  loading: false,
  document: null as any,
  content: null as any,
  contentLoading: false,
  contentExpanded: false,
  pdfUrl: null as string | null,
  pdfLoading: false,
  editingFileName: false,
  editedFileName: '',
  savingFileName: false
})

// Initialize state from URL query parameters
const activeTab = ref<'analyses' | 'va-documents'>(
  (route.query.tab as 'analyses' | 'va-documents') || 'analyses'
)

// Analysis documents
const analysisDocuments = ref<any[]>([])
const analysesPagination = ref({
  page: parseInt(route.query.analysesPage as string) || 1,
  limit: 9,
  total: 0
})

// VA documents
const vaDocuments = ref<any[]>([])
const vaDocsPagination = ref({
  page: parseInt(route.query.vaPage as string) || 1,
  limit: 9,
  total: 0
})

// Current pagination (based on active tab)
const currentPagination = computed(() => {
  return activeTab.value === 'analyses' ? analysesPagination.value : vaDocsPagination.value
})
const documents = computed(() => {
  return activeTab.value === 'analyses' ? analysisDocuments.value : vaDocuments.value
})

// Legacy pagination for existing code compatibility
const pagination = computed(() => currentPagination.value)

// Delete modal state
const deleteModal = ref({
  isOpen: false,
  loading: false,
  deleting: false,
  document: null as any
})

// Watch for tab changes and update URL
watch(activeTab, (newTab) => {
  updateUrl({ tab: newTab })
})

// Watch for pagination changes and update URL
watch(() => analysesPagination.value.page, (newPage) => {
  if (activeTab.value === 'analyses') {
    updateUrl({ analysesPage: newPage })
  }
})

watch(() => vaDocsPagination.value.page, (newPage) => {
  if (activeTab.value === 'va-documents') {
    updateUrl({ vaPage: newPage })
    loadVaDocuments() // Reload data when page changes
  }
})

// Helper to update URL without navigation
const updateUrl = (params: Record<string, any>) => {
  const query = { ...route.query }

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      delete query[key]
    } else {
      query[key] = String(value)
    }
  })

  router.replace({ query })
}

onMounted(async () => {
  const { requireAuth, setupSessionMonitoring } = useAuth()
  const { initializeFromStorage } = useGlobalAuth()

  // Ensure global auth state is initialized from localStorage first
  initializeFromStorage()

  // Require authentication - will redirect if not authenticated
  const isAuth = await requireAuth()
  if (!isAuth) {
    return // Already redirected by requireAuth
  }

  // Set up session monitoring for auto-logout
  setupSessionMonitoring()

  // Register handler for analysis completion notifications
  notifications.on('analysis.completed', async (notification) => {
    console.log('📊 Analysis completed notification received:', notification.data)

    const { documentClassificationId, summary } = notification.data

    // Show toast notification
    toast.success(`Analysis complete! ${summary ? summary.substring(0, 100) + '...' : ''}`)

    // Reload both VA documents (to update status) and analyses (to show new analysis)
    await Promise.all([
      loadVaDocuments(),
      loadAnalysisDocuments()
    ])
  })

  try {
    console.log('🚀 Starting to load all documents...')
    console.log('🚀 About to call loadAnalysisDocuments, loadVaDocuments, fetchSubscriptionStatus')

    await Promise.all([
      loadAnalysisDocuments(),
      loadVaDocuments(),
      fetchSubscriptionStatus()
    ])

    console.log('✅ All documents loaded successfully')
  } catch (error) {
    console.error('Failed to load documents:', error)
    toast.error('Failed to load documents')
  } finally {
    loading.value = false
  }
})

// Legacy function - now handled by loadAnalysisDocuments
const loadDocuments = async () => {
  await loadAnalysisDocuments()
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

  // Handle document types:
  // - Analysis documents (from VA sync) have 'documentId' property
  // - VA correspondence documents have 'id' property
  const doc = deleteModal.value.document
  const isVaCorrespondence = 'id' in doc && !('documentId' in doc)
  const isAnalysisDocument = 'documentId' in doc
  const documentIdToDelete = isVaCorrespondence ? doc.id : doc.documentId

  // VA correspondence documents can't be deleted yet
  if (isVaCorrespondence) {
    toast.error('Deleting VA correspondence is not yet supported')
    deleteModal.value.loading = false
    deleteModal.value.isOpen = false
    deleteModal.value.document = null
    return
  }

  try {
    const { apiCall } = useApi()

    // Analysis documents use VA sync endpoint
    const endpoint = isAnalysisDocument
      ? `/api/va-sync/decision/${documentIdToDelete}`
      : `/api/documents/${documentIdToDelete}`

    const response = await apiCall(endpoint, {
      method: 'DELETE'
    })

    if (response.ok) {
      toast.success('Document deleted successfully')

      // If we're on a page that will be empty after deletion, go to previous page
      const willBeEmpty = documents.value.length === 1 && pagination.value.page > 1
      if (willBeEmpty) {
        pagination.value.page -= 1
      }

      // Reload appropriate documents list
      loading.value = true
      try {
        if (isAnalysisDocument) {
          await loadAnalysisDocuments()
        } else if (isVaCorrespondence) {
          await loadVaDocuments()
        } else {
          await loadDocuments()
        }
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

const downloadPdf = async (documentId: string) => {
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

type BadgeVariant = 'primary' | 'default' | 'secondary' | 'approved' | 'denied' | 'deferred'

const getStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'approved': return 'approved'
    case 'denied': return 'denied'
    case 'deferred': return 'deferred'
    case 'pending': return 'secondary'
    default: return 'default'
  }
}

const getVaStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'classified': return 'approved'
    case 'processing': return 'secondary'
    case 'failed': return 'denied'
    case 'uploaded': return 'default'
    default: return 'default'
  }
}

// Helper to check if document is analyzed
const isDocumentAnalyzed = (doc: any): boolean => {
  return doc.status === 'analyzed' || doc.status === 'extracted'
}

// Get analysis-specific status variant
const getAnalysisStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'analyzed': return 'approved'
    case 'extracted': return 'primary'
    case 'extracting':
    case 'analyzing': return 'secondary'
    case 'extraction_failed':
    case 'analysis_failed': return 'denied'
    case 'uploaded': return 'deferred'
    default: return 'default'
  }
}

// Get human-readable status label
const getAnalysisStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    uploaded: 'Pending',
    extracting: 'Extracting...',
    extracted: 'Extracted',
    analyzing: 'Analyzing...',
    analyzed: 'Analyzed',
    extraction_failed: 'Extract Failed',
    analysis_failed: 'Analysis Failed'
  }
  return labels[status] || status
}

// Load analysis documents from both sources:
// 1. VA sync decision letters (Chrome extension uploads)
// 2. Documents service analyses (direct uploads from /analyze page)
const loadAnalysisDocuments = async () => {
  try {
    const { apiCall } = useApi()
    const { user } = useGlobalAuth()

    if (!user.value?.id) {
      console.warn('❌ No user ID available, skipping analysis documents load')
      analysisDocuments.value = []
      analysesPagination.value.total = 0
      return
    }

    // Fetch from both sources in parallel
    const userId = user.value.authorizerId || user.value.userId || user.value.id

    const [vaSyncResponse, documentsResponse] = await Promise.all([
      // VA sync analyses (Chrome extension uploads)
      apiCall(`/api/va-sync/analyses/${userId}`).catch(err => {
        console.warn('VA sync analyses failed:', err)
        return { ok: false }
      }),
      // Documents service analyses (direct uploads from /analyze page)
      apiCall('/api/documents/analyses').catch(err => {
        console.warn('Documents analyses failed:', err)
        return { ok: false }
      })
    ])

    let allDocuments: any[] = []

    // Process VA sync documents
    if (vaSyncResponse.ok) {
      const vaSyncData = await vaSyncResponse.json()
      console.log('📊 VA sync documents received:', vaSyncData?.length || 0)

      const vaSyncDocs = (vaSyncData || []).map((doc: any) => ({
        documentId: doc._id || doc.id,
        fileName: doc.displayName || doc.pdfFileName || 'Decision Letter',
        status: doc.processingState || 'uploaded',
        analyzedAt: doc.analyzedAt || doc.uploadedAt,
        decisionDate: doc.extractionData?.decisionDate || null,
        combinedRating: doc.extractionData?.combinedRating || null,
        monthlyPayment: null,
        conditionsCount: doc.extractionData?.ratings?.length || 0,
        grantedCount: doc.extractionData?.ratings?.filter((r: any) => r.decision === 'granted').length || 0,
        deniedCount: doc.extractionData?.ratings?.filter((r: any) => r.decision === 'denied').length || 0,
        deferredCount: 0,
        source: 'va-sync'
      }))
      allDocuments.push(...vaSyncDocs)
    }

    // Process documents service analyses (from /analyze page)
    if (documentsResponse.ok) {
      const documentsData = await documentsResponse.json()
      console.log('📊 Documents service analyses received:', documentsData?.analyses?.length || 0)

      const directUploadDocs = (documentsData?.analyses || []).map((doc: any) => ({
        documentId: doc.documentId,
        fileName: doc.fileName || 'Decision Letter',
        status: doc.status || 'analyzed',
        analyzedAt: doc.analyzedAt,
        decisionDate: null,
        combinedRating: doc.combinedRating || null,
        monthlyPayment: doc.monthlyPayment || null,
        conditionsCount: doc.conditionsCount || 0,
        grantedCount: doc.grantedCount || 0,
        deniedCount: doc.deniedCount || 0,
        deferredCount: doc.deferredCount || 0,
        source: 'direct-upload'
      }))
      allDocuments.push(...directUploadDocs)
    }

    // Deduplicate by documentId first, then by fileName + analyzedAt (within 5 minutes)
    // This handles cases where the same file appears in both VA sync and direct upload with different IDs
    const docMap = new Map<string, any>()
    const fileNameMap = new Map<string, any>() // Track by fileName for cross-source deduplication
    
    for (const doc of allDocuments) {
      // First, try exact documentId match
      const existingById = docMap.get(doc.documentId)
      if (existingById) {
        // Prefer document with better status (analyzed > extracted > uploaded)
        const statusPriority = { 'analyzed': 3, 'extracted': 2, 'uploaded': 1, 'analyzing': 1, 'extracting': 1 }
        const existingPriority = statusPriority[existingById.status] || 0
        const newPriority = statusPriority[doc.status] || 0
        
        if (newPriority > existingPriority || 
            (newPriority === existingPriority && new Date(doc.analyzedAt) > new Date(existingById.analyzedAt))) {
          docMap.set(doc.documentId, doc)
        }
        continue
      }
      
      // Check for duplicate by fileName (same file from different sources)
      const normalizedFileName = doc.fileName?.toLowerCase().trim()
      const existingByFileName = fileNameMap.get(normalizedFileName)
      
      if (existingByFileName) {
        // Check if they're the same file (uploaded within 5 minutes of each other)
        const timeDiff = Math.abs(new Date(doc.analyzedAt).getTime() - new Date(existingByFileName.analyzedAt).getTime())
        const fiveMinutes = 5 * 60 * 1000
        
        if (timeDiff < fiveMinutes) {
          // Same file from different sources - prefer the one with better status
          const statusPriority = { 'analyzed': 3, 'extracted': 2, 'uploaded': 1, 'analyzing': 1, 'extracting': 1 }
          const existingPriority = statusPriority[existingByFileName.status] || 0
          const newPriority = statusPriority[doc.status] || 0
          
          if (newPriority > existingPriority) {
            // Remove old entry and add new one
            docMap.delete(existingByFileName.documentId)
            docMap.set(doc.documentId, doc)
            fileNameMap.set(normalizedFileName, doc)
          }
          // Otherwise keep existing entry
          continue
        }
      }
      
      // New document - add to both maps
      docMap.set(doc.documentId, doc)
      if (normalizedFileName) {
        fileNameMap.set(normalizedFileName, doc)
      }
    }

    // Sort by analyzedAt descending (most recent first)
    analysisDocuments.value = Array.from(docMap.values()).sort((a, b) => {
      return new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime()
    })

    analysesPagination.value.total = analysisDocuments.value.length
    console.log('📊 Total unique analysis documents:', analysisDocuments.value.length)

  } catch (error) {
    console.error('Failed to load analysis documents:', error)
    analysisDocuments.value = []
    analysesPagination.value.total = 0
  }
}

// Load VA documents from VA Sync system
const loadVaDocuments = async () => {
  console.log('📥 loadVaDocuments CALLED!')
  try {
    const { apiCall } = useApi()
    const { user } = useGlobalAuth()

    console.log('🔍 loadVaDocuments - user.value:', user.value)
    console.log('🔍 loadVaDocuments - user.value?.id:', user.value?.id)

    if (!user.value?.id) {
      console.warn('❌ No user ID available, skipping VA documents load')
      console.warn('❌ user.value:', user.value)
      vaDocuments.value = []
      vaDocsPagination.value.total = 0
      return
    }

    // VA sync uses authorizerId (Authorizer UUID), not MongoDB _id
    const userId = user.value.authorizerId || user.value.userId || user.value.id
    // Use va-documents endpoint which filters for correspondence only
    const url = `/api/va-sync/va-documents/${userId}`
    console.log('✅ Calling VA sync API with URL:', url)
    console.log('✅ User ID being used:', userId)
    console.log('✅ Using field:', user.value.authorizerId ? 'authorizerId' : (user.value.userId ? 'userId' : 'id'))

    const response = await apiCall(url)
    console.log('📦 VA sync response status:', response.status)
    console.log('📦 VA sync response ok:', response.ok)

    if (response.ok) {
      const data = await response.json()
      console.log('📦 VA sync data received:', data)
      console.log('📦 Number of documents:', data?.length || 0)

      // Map VA decision letters to frontend format
      vaDocuments.value = (data || []).map((letter: any) => ({
        id: letter._id || letter.id,
        fileName: letter.displayName || letter.pdfFileName || 'VA Document',
        fileSizeBytes: letter.pdfSizeBytes || 0,
        documentType: letter.documentType || 'decision_letter',
        processingStatus: letter.isParsed ? 'classified' : 'uploaded',
        createdAt: letter.syncedAt || letter.createdAt,
        processedAt: letter.parsedAt,
        sourceService: 'VA-SYNC',
        sourceDocumentId: letter.vaDocumentId,
      }))
      vaDocsPagination.value.total = vaDocuments.value.length
      console.log('✅ VA documents loaded successfully:', vaDocuments.value.length)
    } else {
      const errorText = await response.text()
      console.error('❌ VA sync API error response:', errorText)
      throw new Error('Failed to fetch VA documents')
    }
  } catch (error) {
    console.error('💥 EXCEPTION in loadVaDocuments:', error)
    console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack')
    // Don't throw - just set empty state
    vaDocuments.value = []
    vaDocsPagination.value.total = 0
  }
}

// Retry failed document processing
const retryProcessing = async (documentId: string) => {
  try {
    toast.error('Retry processing not yet implemented for VA documents')
  } catch (error: any) {
    console.error('Failed to retry processing:', error)
    toast.error(error.message || 'Failed to retry processing')
  }
}

// Helper functions for analysis button state
const canAnalyze = (doc: any) => {
  // Can only analyze if document is classified and not currently analyzing or already completed
  return doc.processingStatus === 'classified' &&
         (!doc.analysisStatus || doc.analysisStatus === 'not_started' || doc.analysisStatus === 'failed')
}

const getAnalysisButtonTitle = (doc: any) => {
  if (doc.analysisStatus === 'analyzing') return 'Analysis in progress...'
  if (doc.analysisStatus === 'completed') return 'Analysis complete'
  if (doc.analysisStatus === 'failed') return 'Analysis failed - click to retry'
  if (doc.processingStatus !== 'classified') return 'Classification required before analysis'
  return 'Analyze Decision Letter'
}

const getAnalysisButtonIcon = (doc: any) => {
  if (doc.analysisStatus === 'analyzing') return 'svg-spinners:ring-resize'
  if (doc.analysisStatus === 'completed') return 'heroicons:check-circle'
  if (doc.analysisStatus === 'failed') return 'heroicons:arrow-path'
  return 'heroicons:sparkles'
}

// Send document for decision review and analysis
const analyzeDocument = async (documentId: string) => {
  try {
    toast.error('Document analysis not yet implemented for VA documents')
  } catch (error: any) {
    console.error('Failed to analyze document:', error)
    toast.error(error.message || 'Failed to send document for analysis')
  }
}

// Process all VA documents to extract text content
const processAllDocuments = async () => {
  processingAll.value = true

  try {
    const { apiCall } = useApi()
    toast.info('Processing all documents... This may take a few minutes.')

    const response = await apiCall(
      '/api/va-sync/decision-letters/process-all',
      { method: 'POST' }
    )

    if (response.ok) {
      const data = await response.json()
      toast.success(`Successfully processed ${data.processed} documents!`)
      // Reload VA documents to show updated content
      await loadVaDocuments()
    } else {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to process documents')
    }
  } catch (error: any) {
    console.error('Failed to process documents:', error)
    toast.error(error.message || 'Failed to process documents')
  } finally {
    processingAll.value = false
  }
}

// Open document detail modal
const openDocumentDetail = async (documentId: string) => {
  detailModal.value.isOpen = true
  detailModal.value.loading = true
  detailModal.value.document = null
  detailModal.value.content = null
  detailModal.value.pdfUrl = null
  detailModal.value.contentExpanded = false
  detailModal.value.editingFileName = false
  detailModal.value.editedFileName = ''

  try {
    const { apiCall } = useApi()

    // Use VA sync endpoint for VA documents tab, document-management for others
    const isVaDocument = activeTab.value === 'va-documents'
    const endpoint = isVaDocument
      ? `/api/va-sync/correspondence/${documentId}`
      : `/api/document-management/documents/${documentId}`

    // Fetch document details
    const docResponse = await apiCall(endpoint)
    if (!docResponse.ok) {
      throw new Error('Failed to load document details')
    }
    detailModal.value.document = await docResponse.json()

    // Fetch PDF URL (use VA sync endpoint for VA documents)
    detailModal.value.pdfLoading = true
    const pdfEndpoint = isVaDocument
      ? `/api/va-sync/correspondence/${documentId}/pdf`
      : `/api/document-management/documents/${documentId}/pdf`
    const pdfResponse = await apiCall(pdfEndpoint)
    if (pdfResponse.ok) {
      const pdfData = await pdfResponse.json()
      detailModal.value.pdfUrl = pdfData.url
    }
    detailModal.value.pdfLoading = false

    // Fetch document content (only for non-VA documents - VA docs don't have extracted content)
    if (!isVaDocument) {
      detailModal.value.contentLoading = true
      const contentResponse = await apiCall(
        `/api/document-management/documents/${documentId}/content?maxLength=1000`
      )

      if (contentResponse.ok) {
        detailModal.value.content = await contentResponse.json()
      }
    }
  } catch (error: any) {
    console.error('Failed to load document:', error)
    toast.error(error.message || 'Failed to load document')
    detailModal.value.isOpen = false
  } finally {
    detailModal.value.loading = false
    detailModal.value.contentLoading = false
    detailModal.value.pdfLoading = false
  }
}

// Start editing filename
const startEditFileName = () => {
  detailModal.value.editedFileName = detailModal.value.document.fileName
  detailModal.value.editingFileName = true
}

// Cancel editing filename
const cancelEditFileName = () => {
  detailModal.value.editingFileName = false
  detailModal.value.editedFileName = ''
}

// Save filename
const saveFileName = async () => {
  toast.error('Editing filenames not yet implemented for VA documents')
  detailModal.value.editingFileName = false
  detailModal.value.editedFileName = ''
}

</script>
