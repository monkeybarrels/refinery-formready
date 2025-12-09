<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <Spinner class="w-8 h-8" />
      <span class="ml-3 text-slate-600">Loading package details...</span>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!pkg" class="flex flex-col items-center justify-center min-h-screen">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-slate-300" />
      <h2 class="mt-4 text-xl font-semibold text-slate-900">Package not found</h2>
      <NuxtLink to="/packages" class="mt-4 text-blue-600 hover:text-blue-700">
        ← Back to Packages
      </NuxtLink>
    </div>

    <!-- Package Detail -->
    <div v-else>
      <!-- Page Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <NuxtLink to="/packages" class="text-sm text-blue-600 hover:text-blue-700 flex items-center mb-4">
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-1" />
            Back to Packages
          </NuxtLink>
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-bold text-slate-900">{{ pkg.name }}</h1>
              <p class="mt-1 text-sm text-slate-600 capitalize">
                {{ pkg.goal }} • Created {{ formatDate(pkg.createdAt) }}
              </p>
            </div>
            <div class="flex items-center space-x-3">
              <StatusBadge :status="pkg.status" size="lg" />
              <div class="text-right">
                <p class="text-sm text-slate-500">Potential</p>
                <p class="text-xl font-bold text-green-600">${{ formatCurrency(pkg.potentialMonthly || 0) }}/mo</p>
              </div>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mt-6">
            <div class="flex items-center justify-between text-sm mb-2">
              <span class="text-slate-600">Overall Progress</span>
              <span class="font-medium text-slate-900">{{ pkg.progress }}%</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-3">
              <div
                class="h-3 rounded-full transition-all"
                :class="pkg.progress === 100 ? 'bg-green-500' : 'bg-blue-600'"
                :style="{ width: `${pkg.progress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav class="flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-1 text-sm font-medium border-b-2 transition-colors"
              :class="activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Quick Stats -->
              <div class="grid grid-cols-3 gap-4">
                <div class="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <p class="text-2xl font-bold text-slate-900">{{ checklists.reduce((sum, c) => sum + c.items.filter(i => i.completed).length, 0) }}</p>
                  <p class="text-sm text-slate-500">Evidence Collected</p>
                </div>
                <div class="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <p class="text-2xl font-bold text-slate-900">{{ forms.filter(f => f.status === 'completed').length }}</p>
                  <p class="text-sm text-slate-500">Forms Ready</p>
                </div>
                <div class="bg-white rounded-lg border border-slate-200 p-4 text-center">
                  <p class="text-2xl font-bold text-slate-900">{{ actionItems.filter(a => !a.completed).length }}</p>
                  <p class="text-sm text-slate-500">Actions Pending</p>
                </div>
              </div>

              <!-- Action Items -->
              <div class="bg-white rounded-xl shadow-sm border border-slate-200">
                <div class="px-6 py-4 border-b border-slate-200">
                  <h2 class="text-lg font-semibold text-slate-900">Priority Actions</h2>
                </div>
                <div class="p-6">
                  <div v-if="actionItems.length === 0" class="text-center py-4 text-slate-500">
                    No action items for this package
                  </div>
                  <ul v-else class="space-y-3">
                    <li v-for="item in actionItems" :key="item.id" class="flex items-start">
                      <input
                        type="checkbox"
                        :checked="item.completed"
                        class="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300"
                        @change="toggleAction(item.id)"
                      />
                      <div class="ml-3">
                        <p class="text-sm text-slate-900" :class="{ 'line-through text-slate-400': item.completed }">
                          {{ item.title }}
                        </p>
                        <p v-if="item.description" class="text-xs text-slate-500">{{ item.description }}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
              <!-- Target Conditions -->
              <div class="bg-white rounded-xl shadow-sm border border-slate-200">
                <div class="px-6 py-4 border-b border-slate-200">
                  <h2 class="font-semibold text-slate-900">Target Conditions</h2>
                </div>
                <div class="p-6">
                  <ul class="space-y-2">
                    <li v-for="conditionId in pkg.targetConditions" :key="conditionId">
                      <NuxtLink
                        :to="`/conditions/${conditionId}`"
                        class="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {{ getConditionName(conditionId) }}
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Recommended Forms -->
              <div class="bg-white rounded-xl shadow-sm border border-slate-200">
                <div class="px-6 py-4 border-b border-slate-200">
                  <h2 class="font-semibold text-slate-900">Recommended Forms</h2>
                </div>
                <div class="divide-y divide-slate-200">
                  <div v-for="form in forms" :key="form.id" class="px-6 py-3">
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-sm font-medium text-slate-900">{{ form.form?.number }}</p>
                        <p class="text-xs text-slate-500">{{ form.form?.title }}</p>
                      </div>
                      <StatusBadge :status="form.status" size="sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Checklists Tab -->
        <div v-if="activeTab === 'checklists'" class="space-y-6">
          <div v-for="checklist in checklists" :key="checklist.id" class="bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-slate-900">{{ checklist.title }}</h2>
                <span class="text-sm text-slate-500">
                  {{ checklist.items.filter(i => i.completed).length }} / {{ checklist.items.length }} completed
                </span>
              </div>
            </div>
            <div class="p-6">
              <ul class="space-y-3">
                <li v-for="item in checklist.items" :key="item.id" class="flex items-start">
                  <input
                    type="checkbox"
                    :checked="item.completed"
                    class="mt-1 h-4 w-4 text-blue-600 rounded border-slate-300"
                    @change="toggleChecklistItem(checklist.id, item.id)"
                  />
                  <div class="ml-3 flex-1">
                    <p class="text-sm text-slate-900" :class="{ 'line-through text-slate-400': item.completed }">
                      {{ item.label }}
                    </p>
                    <p v-if="item.description" class="text-xs text-slate-500">{{ item.description }}</p>
                  </div>
                  <span v-if="item.required" class="text-xs text-red-500 font-medium">Required</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="checklists.length === 0" class="text-center py-12">
            <Icon name="heroicons:clipboard-document-list" class="w-12 h-12 mx-auto text-slate-300" />
            <p class="mt-4 text-slate-500">No checklists for this package</p>
          </div>
        </div>

        <!-- Evidence Tab -->
        <div v-if="activeTab === 'evidence'" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-slate-900">Uploaded Documents</h2>
              <button class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <Icon name="heroicons:arrow-up-tray" class="w-4 h-4 mr-2" />
                Upload Document
              </button>
            </div>
            <div class="p-6">
              <div v-if="documents.length === 0" class="text-center py-12">
                <Icon name="heroicons:document-plus" class="w-12 h-12 mx-auto text-slate-300" />
                <p class="mt-4 text-slate-500">No documents uploaded yet</p>
                <p class="text-sm text-slate-400">Upload evidence to support your claim</p>
              </div>
              <ul v-else class="divide-y divide-slate-200">
                <li v-for="doc in documents" :key="doc.id" class="py-4 flex items-center justify-between">
                  <div class="flex items-center">
                    <Icon name="heroicons:document" class="w-8 h-8 text-slate-400" />
                    <div class="ml-3">
                      <p class="text-sm font-medium text-slate-900">{{ doc.name }}</p>
                      <p class="text-xs text-slate-500">Uploaded {{ formatDate(doc.uploadedAt) }}</p>
                    </div>
                  </div>
                  <button class="text-red-600 hover:text-red-700">
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Forms Tab -->
        <div v-if="activeTab === 'forms'" class="space-y-6">
          <div v-for="form in forms" :key="form.id" class="bg-white rounded-xl shadow-sm border border-slate-200">
            <div class="px-6 py-4 flex items-center justify-between">
              <div>
                <h3 class="font-semibold text-slate-900">{{ form.form?.number }}</h3>
                <p class="text-sm text-slate-500">{{ form.form?.title }}</p>
              </div>
              <div class="flex items-center space-x-4">
                <StatusBadge :status="form.status" />
                <button
                  v-if="form.status !== 'completed'"
                  class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fill Out
                </button>
                <button
                  v-else
                  class="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  View
                </button>
              </div>
            </div>
          </div>

          <div v-if="forms.length === 0" class="text-center py-12">
            <Icon name="heroicons:document-text" class="w-12 h-12 mx-auto text-slate-300" />
            <p class="mt-4 text-slate-500">No forms associated with this package</p>
          </div>
        </div>

        <!-- Timeline Tab -->
        <div v-if="activeTab === 'timeline'" class="space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div v-if="timeline.length === 0" class="text-center py-8 text-slate-500">
              No activity yet
            </div>
            <div v-else class="relative">
              <div class="absolute top-0 left-4 bottom-0 w-0.5 bg-slate-200"></div>
              <ul class="space-y-6">
                <li v-for="event in timeline" :key="event.id" class="relative pl-10">
                  <div
                    class="absolute left-2.5 w-3 h-3 rounded-full border-2 border-white"
                    :class="getEventColor(event.type)"
                  ></div>
                  <div>
                    <p class="font-medium text-slate-900">{{ event.title }}</p>
                    <p v-if="event.description" class="text-sm text-slate-500">{{ event.description }}</p>
                    <p class="text-xs text-slate-400 mt-1">{{ formatDateTime(event.date) }}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navigation from '~/components/organisms/Navigation.vue'
import Spinner from '~/components/atoms/Spinner.vue'
import StatusBadge from '~/components/molecules/StatusBadge.vue'
import {
  getPackagesAdapter,
  getActionsAdapter,
  getDocumentsAdapter,
  getConditionsAdapter
} from '~/adapters'
import type { Package, Checklist, PackageForm, ActionItem, Document, TimelineEvent, Condition } from '~/types/claimready'

// Page meta
definePageMeta({
  middleware: ['auth', 'premium']
})

const route = useRoute()

// State
const loading = ref(true)
const pkg = ref<Package | null>(null)
const checklists = ref<Checklist[]>([])
const forms = ref<PackageForm[]>([])
const actionItems = ref<ActionItem[]>([])
const documents = ref<Document[]>([])
const timeline = ref<TimelineEvent[]>([])
const conditions = ref<Condition[]>([])
const activeTab = ref('overview')

// Tabs config
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'forms', label: 'Forms' },
  { id: 'timeline', label: 'Timeline' }
]

// Methods
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const formatDate = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const formatDateTime = (date: Date | string | null) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const getConditionName = (id: string) => {
  const condition = conditions.value.find(c => c.id === id)
  return condition?.name || id
}

const getEventColor = (type: string) => {
  switch (type) {
    case 'package_created': return 'bg-blue-600'
    case 'checklist_item_completed': return 'bg-green-600'
    case 'document_uploaded': return 'bg-purple-600'
    case 'form_completed': return 'bg-amber-600'
    default: return 'bg-slate-400'
  }
}

const toggleAction = async (id: string) => {
  try {
    await getActionsAdapter().toggleComplete(id)
    // Update local state
    const item = actionItems.value.find(a => a.id === id)
    if (item) item.completed = !item.completed
  } catch (error) {
    console.error('Failed to toggle action:', error)
  }
}

const toggleChecklistItem = async (checklistId: string, itemId: string) => {
  if (!pkg.value) return

  try {
    await getPackagesAdapter().toggleChecklistItem(pkg.value.id, checklistId, itemId)
    // Update local state
    const checklist = checklists.value.find(c => c.id === checklistId)
    if (checklist) {
      const item = checklist.items.find(i => i.id === itemId)
      if (item) item.completed = !item.completed
    }
  } catch (error) {
    console.error('Failed to toggle checklist item:', error)
  }
}

// Load data
onMounted(async () => {
  const id = route.params.id as string

  try {
    const packagesAdapter = getPackagesAdapter()

    const [packageData, checklistsData, formsData, actionsData, documentsData, timelineData, conditionsData] = await Promise.all([
      packagesAdapter.getById(id),
      packagesAdapter.getChecklists(id),
      packagesAdapter.getForms(id),
      getActionsAdapter().getByPackageId(id),
      getDocumentsAdapter().getByPackageId(id),
      packagesAdapter.getTimeline(id),
      getConditionsAdapter().getAll()
    ])

    pkg.value = packageData
    checklists.value = checklistsData
    forms.value = formsData
    actionItems.value = actionsData
    documents.value = documentsData
    timeline.value = timelineData
    conditions.value = conditionsData

    // Set page title
    if (packageData) {
      useHead({
        title: `${packageData.name} - ClaimReady`
      })
    }
  } catch (error) {
    console.error('Failed to load package details:', error)
  } finally {
    loading.value = false
  }
})
</script>
