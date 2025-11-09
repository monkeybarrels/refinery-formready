<template>
  <div
    class="bg-white rounded-xl border-2 transition-all hover:shadow-lg cursor-pointer"
    :class="cardClasses"
    @click="$emit('click', item)"
  >
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-start justify-between mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-2">
            <h3 class="text-lg font-semibold text-slate-900">{{ currentItem.title }}</h3>
            <Badge
              :text="priorityLabel"
              :variant="priorityBadgeVariant"
              size="sm"
            />
          </div>
          <p class="text-slate-700 text-sm leading-relaxed">{{ currentItem.description }}</p>
        </div>
        
        <!-- Completion Checkbox -->
        <div class="ml-4 flex-shrink-0">
          <button
            @click.stop="toggleCompletion"
            class="w-6 h-6 rounded border-2 flex items-center justify-center transition-colors"
            :class="checkboxClasses"
            aria-label="Mark as complete"
          >
            <Icon
              v-if="currentItem.completed"
              name="heroicons:check"
              class="w-4 h-4 text-white"
            />
          </button>
        </div>
      </div>

      <!-- Metadata Row -->
      <div class="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
        <!-- Category -->
        <div class="flex items-center gap-1">
          <Icon :name="categoryIcon" class="w-4 h-4" />
          <span class="capitalize">{{ currentItem.category }}</span>
        </div>

        <!-- Difficulty -->
        <div class="flex items-center gap-1">
          <Icon name="heroicons:star" class="w-4 h-4" />
          <span>{{ difficultyStars }}</span>
        </div>

        <!-- Estimated Days -->
        <div class="flex items-center gap-1">
          <Icon name="heroicons:clock" class="w-4 h-4" />
          <span>{{ currentItem.estimatedDays }} day{{ currentItem.estimatedDays !== 1 ? 's' : '' }}</span>
        </div>

        <!-- Deadline Warning -->
        <div
          v-if="currentItem.deadline && isDeadlineNear"
          class="flex items-center gap-1 text-amber-600 font-medium"
        >
          <Icon name="heroicons:exclamation-triangle" class="w-4 h-4" />
          <span>Due soon</span>
        </div>
      </div>

      <!-- Quick Info -->
      <div v-if="hasQuickInfo" class="flex flex-wrap gap-2 mb-4">
        <span
          v-if="currentItem.formsNeeded.length > 0"
          class="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
        >
          <Icon name="heroicons:document-text" class="w-3 h-3" />
          {{ currentItem.formsNeeded.length }} form{{ currentItem.formsNeeded.length !== 1 ? 's' : '' }}
        </span>
        <span
          v-if="currentItem.evidenceNeeded.length > 0"
          class="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
        >
          <Icon name="heroicons:folder" class="w-3 h-3" />
          {{ currentItem.evidenceNeeded.length }} evidence item{{ currentItem.evidenceNeeded.length !== 1 ? 's' : '' }}
        </span>
        <span
          v-if="currentItem.steps.length > 0"
          class="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs"
        >
          <Icon name="heroicons:list-bullet" class="w-3 h-3" />
          {{ currentItem.steps.length }} step{{ currentItem.steps.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-4 border-t border-gray-200">
        <span class="text-xs text-slate-500">
          {{ currentItem.completed ? 'Completed' : 'Click to view details' }}
        </span>
        <Icon name="heroicons:chevron-right" class="w-5 h-5 text-slate-400" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionItem } from '~/composables/useActionItems'
import Badge from '~/components/atoms/Badge.vue'

interface Props {
  item: ActionItem
  documentId: string
}

interface Emits {
  (e: 'click', item: ActionItem): void
  (e: 'complete', item: ActionItem): void
  (e: 'incomplete', item: ActionItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { markComplete, markIncomplete, actionItems } = useActionItems()

// Create a computed property that finds the current item from the reactive array
// This ensures we always have the latest state
const currentItem = computed(() => {
  return actionItems.value.find(i => i.id === props.item.id) || props.item
})

// Priority styling
const priorityLabel = computed(() => {
  switch (currentItem.value.priority) {
    case 'quick_win':
      return 'Quick Win'
    case 'normal':
      return 'Normal'
    case 'complex':
      return 'Complex'
    default:
      return 'Normal'
  }
})

const priorityBadgeVariant = computed(() => {
  switch (currentItem.value.priority) {
    case 'quick_win':
      return 'approved' // Green for quick wins
    case 'normal':
      return 'primary'
    case 'complex':
      return 'secondary' // Amber for complex
    default:
      return 'default'
  }
})

const cardClasses = computed(() => {
  if (currentItem.value.completed) {
    return 'border-green-200 bg-green-50 opacity-75'
  }

  switch (currentItem.value.priority) {
    case 'quick_win':
      return 'border-green-200 bg-green-50'
    case 'normal':
      return 'border-blue-200 bg-blue-50'
    case 'complex':
      return 'border-amber-200 bg-amber-50'
    default:
      return 'border-gray-200 bg-white'
  }
})

const checkboxClasses = computed(() => {
  if (currentItem.value.completed) {
    return 'bg-green-600 border-green-600'
  }
  return 'border-gray-300 hover:border-green-500'
})

// Category icon mapping
const categoryIcon = computed(() => {
  switch (currentItem.value.category) {
    case 'appeal':
      return 'heroicons:scale-balanced'
    case 'evidence':
      return 'heroicons:folder-document'
    case 'medical':
      return 'heroicons:heart'
    case 'form':
      return 'heroicons:document-text'
    case 'other':
      return 'heroicons:information-circle'
    default:
      return 'heroicons:circle'
  }
})

// Difficulty stars display
const difficultyStars = computed(() => {
  return '★'.repeat(currentItem.value.difficulty) + '☆'.repeat(5 - currentItem.value.difficulty)
})

// Deadline check
const isDeadlineNear = computed(() => {
  if (!currentItem.value.deadline) return false
  const deadline = new Date(currentItem.value.deadline)
  const now = new Date()
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return daysUntilDeadline <= 7 && daysUntilDeadline > 0
})

// Quick info check
const hasQuickInfo = computed(() => {
  return (
    currentItem.value.formsNeeded.length > 0 ||
    currentItem.value.evidenceNeeded.length > 0 ||
    currentItem.value.steps.length > 0
  )
})

// Toggle completion
const toggleCompletion = async () => {
  const { success, error: showError } = useToast()
  
  try {
    if (currentItem.value.completed) {
      await markIncomplete(props.documentId, currentItem.value.id)
      emit('incomplete', currentItem.value)
      success('Action item marked as incomplete')
    } else {
      await markComplete(props.documentId, currentItem.value.id)
      emit('complete', currentItem.value)
      success('Action item marked as complete!')
    }
  } catch (error: any) {
    console.error('Failed to toggle completion:', error)
    // Show more detailed error message
    const errorMessage = error.message || 'Failed to update completion status'
    showError(errorMessage, 'Please check your connection and try again')
    // The composable already reverted the optimistic update
  }
}
</script>

