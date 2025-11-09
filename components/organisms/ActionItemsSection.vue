<template>
  <div class="mt-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <Icon name="heroicons:light-bulb" class="w-8 h-8 text-amber-600" />
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Recommended Action Items</h2>
          <p class="text-sm text-slate-600">
            Personalized steps to improve your claim based on your decision letter
          </p>
        </div>
      </div>
      
      <!-- Progress Badge -->
      <div v-if="completionProgress.total > 0" class="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <div class="text-sm font-semibold text-blue-900">
          {{ completionProgress.completed }}/{{ completionProgress.total }} completed
        </div>
        <div class="w-24 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-600 transition-all duration-300"
            :style="{ width: `${completionProgress.percentage}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-xl shadow-lg p-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-slate-600">Loading action items...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white rounded-xl shadow-lg p-8">
      <div class="flex items-center gap-3 text-red-600 mb-4">
        <Icon name="heroicons:exclamation-circle" class="w-6 h-6" />
        <h3 class="font-semibold">Unable to load action items</h3>
      </div>
      <p class="text-slate-600 mb-4">{{ error }}</p>
      <Button @click="handleRetry" variant="secondary" size="sm">
        <Icon name="heroicons:arrow-path" class="w-4 h-4 mr-2" />
        Retry
      </Button>
    </div>

    <!-- Empty State -->
    <div v-else-if="actionItems.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
      <Icon name="heroicons:clipboard-document-list" class="w-12 h-12 text-slate-400 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-slate-900 mb-2">No action items available</h3>
      <p class="text-slate-600">
        Action items will be generated based on your decision letter analysis.
      </p>
    </div>

    <!-- Action Items Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ActionItemCard
        v-for="item in actionItems"
        :key="`${item.id}-${item.completed ? 'completed' : 'incomplete'}`"
        :item="item"
        :document-id="documentId"
        @click="openDetailModal(item)"
        @complete="handleItemComplete"
        @incomplete="handleItemIncomplete"
      />
    </div>

    <!-- Detail Modal -->
    <ActionItemDetailModal
      :is-open="detailModalOpen"
      :item="selectedItem"
      :document-id="documentId"
      @update:is-open="detailModalOpen = $event"
      @complete="handleItemComplete"
      @incomplete="handleItemIncomplete"
    />
  </div>
</template>

<script setup lang="ts">
import type { ActionItem } from '~/composables/useActionItems'
import ActionItemCard from '~/components/molecules/ActionItemCard.vue'
import ActionItemDetailModal from '~/components/molecules/ActionItemDetailModal.vue'
import Button from '~/components/atoms/Button.vue'

interface Props {
  documentId: string
}

const props = defineProps<Props>()

const {
  actionItems,
  loading,
  error,
  completionProgress,
  fetchActionItems,
  markComplete,
  markIncomplete
} = useActionItems()

const detailModalOpen = ref(false)
const selectedItem = ref<ActionItem | null>(null)

// Fetch action items on mount
onMounted(async () => {
  await fetchActionItems(props.documentId)
})

// Open detail modal
const openDetailModal = (item: ActionItem) => {
  selectedItem.value = item
  detailModalOpen.value = true
}

// Handle item completion
const handleItemComplete = (item: ActionItem) => {
  // Find and update the item in the array to trigger reactivity
  const itemIndex = actionItems.value.findIndex(i => i.id === item.id)
  if (itemIndex !== -1) {
    // Force reactivity by creating a new array
    actionItems.value = actionItems.value.map((i, idx) => 
      idx === itemIndex ? { ...i, completed: true } : i
    )
  }
}

// Handle item incomplete
const handleItemIncomplete = (item: ActionItem) => {
  // Find and update the item in the array to trigger reactivity
  const itemIndex = actionItems.value.findIndex(i => i.id === item.id)
  if (itemIndex !== -1) {
    // Force reactivity by creating a new array
    actionItems.value = actionItems.value.map((i, idx) => 
      idx === itemIndex ? { ...i, completed: false } : i
    )
  }
}

// Retry loading
const handleRetry = async () => {
  await fetchActionItems(props.documentId)
}
</script>

