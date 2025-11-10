<template>
  <Modal
    :is-open="isOpen"
    @update:is-open="$emit('update:isOpen', $event)"
    title="Action Item Details"
    :show-close="true"
    :show-cancel="false"
    confirm-text="Close"
    @confirm="handleClose"
  >
    <div v-if="item" class="space-y-6">
      <!-- Header -->
      <div>
        <div class="flex items-center gap-2 mb-2">
          <h2 class="text-2xl font-bold text-slate-900">{{ item.title }}</h2>
          <Badge
            :text="priorityLabel"
            :variant="priorityBadgeVariant"
            size="md"
          />
        </div>
        <p class="text-slate-700 leading-relaxed">{{ item.description }}</p>
      </div>

      <!-- Metadata Grid -->
      <div class="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
        <div>
          <div class="text-xs text-slate-500 mb-1">Category</div>
          <div class="flex items-center gap-2">
            <Icon :name="categoryIcon" class="w-4 h-4 text-slate-600" />
            <span class="font-medium capitalize">{{ item.category }}</span>
          </div>
        </div>
        <div>
          <div class="text-xs text-slate-500 mb-1">Difficulty</div>
          <div class="flex items-center gap-2">
            <span class="text-yellow-600">{{ difficultyStars }}</span>
            <span class="text-sm text-slate-600">({{ item.difficulty }}/5)</span>
          </div>
        </div>
        <div>
          <div class="text-xs text-slate-500 mb-1">Estimated Time</div>
          <div class="flex items-center gap-2">
            <Icon name="heroicons:clock" class="w-4 h-4 text-slate-600" />
            <span class="font-medium">{{ item.estimatedDays }} day{{ item.estimatedDays !== 1 ? 's' : '' }}</span>
          </div>
        </div>
        <div v-if="item.deadline">
          <div class="text-xs text-slate-500 mb-1">Deadline</div>
          <div class="flex items-center gap-2" :class="deadlineClasses">
            <Icon name="heroicons:calendar" class="w-4 h-4" />
            <span class="font-medium">{{ formattedDeadline }}</span>
          </div>
        </div>
      </div>

      <!-- Steps -->
      <div v-if="item.steps.length > 0">
        <h3 class="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Icon name="heroicons:list-bullet" class="w-5 h-5" />
          Steps to Complete
        </h3>
        <ol class="space-y-2">
          <li
            v-for="(step, index) in item.steps"
            :key="index"
            class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
          >
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold">
              {{ index + 1 }}
            </span>
            <span class="text-slate-700 flex-1">{{ step }}</span>
          </li>
        </ol>
      </div>

      <!-- Forms Needed -->
      <div v-if="item.formsNeeded.length > 0">
        <h3 class="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Icon name="heroicons:document-text" class="w-5 h-5" />
          Forms Needed
        </h3>
        <div class="space-y-2">
          <div
            v-for="(form, index) in item.formsNeeded"
            :key="index"
            class="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <Icon name="heroicons:document-text" class="w-5 h-5 text-blue-600" />
            <span class="text-slate-700">{{ form }}</span>
          </div>
        </div>
      </div>

      <!-- Evidence Needed -->
      <div v-if="item.evidenceNeeded.length > 0">
        <h3 class="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <Icon name="heroicons:folder-document" class="w-5 h-5" />
          Evidence Needed
        </h3>
        <div class="space-y-2">
          <div
            v-for="(evidence, index) in item.evidenceNeeded"
            :key="index"
            class="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600" />
            <span class="text-slate-700">{{ evidence }}</span>
          </div>
        </div>
      </div>

      <!-- Related Condition -->
      <div v-if="item.relatedCondition">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Related Condition</h3>
        <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <span class="text-slate-700">{{ item.relatedCondition }}</span>
        </div>
      </div>

      <!-- Dependencies -->
      <div v-if="item.dependsOn && item.dependsOn.length > 0">
        <h3 class="text-lg font-semibold text-slate-900 mb-2">Depends On</h3>
        <div class="p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p class="text-sm text-slate-600">
            This action item depends on completing other items first. Make sure to complete the prerequisite items before starting this one.
          </p>
        </div>
      </div>

      <!-- Completion Toggle -->
      <div class="pt-4 border-t border-gray-200">
        <button
          @click="toggleCompletion"
          class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors"
          :class="completionButtonClasses"
        >
          <Icon
            :name="item.completed ? 'heroicons:check-circle' : 'heroicons:circle'"
            class="w-5 h-5"
          />
          <span>{{ item.completed ? 'Mark as Incomplete' : 'Mark as Complete' }}</span>
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import type { ActionItem } from '~/composables/useActionItems'
import Modal from '~/components/molecules/Modal.vue'
import Badge from '~/components/atoms/Badge.vue'

interface Props {
  isOpen: boolean
  item: ActionItem | null
  documentId: string
}

interface Emits {
  (e: 'update:isOpen', value: boolean): void
  (e: 'complete', item: ActionItem): void
  (e: 'incomplete', item: ActionItem): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { markComplete, markIncomplete } = useActionItems()

// Priority styling
const priorityLabel = computed(() => {
  if (!props.item) return ''
  switch (props.item.priority) {
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
  if (!props.item) return 'default'
  switch (props.item.priority) {
    case 'quick_win':
      return 'approved'
    case 'normal':
      return 'primary'
    case 'complex':
      return 'secondary' // Amber for complex
    default:
      return 'default'
  }
})

// Category icon mapping
const categoryIcon = computed(() => {
  if (!props.item) return 'heroicons:circle'
  switch (props.item.category) {
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
  if (!props.item) return ''
  return '★'.repeat(props.item.difficulty) + '☆'.repeat(5 - props.item.difficulty)
})

// Deadline formatting
const formattedDeadline = computed(() => {
  if (!props.item?.deadline) return ''
  const deadline = new Date(props.item.deadline)
  return deadline.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const deadlineClasses = computed(() => {
  if (!props.item?.deadline) return ''
  const deadline = new Date(props.item.deadline)
  const now = new Date()
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  if (daysUntilDeadline < 0) {
    return 'text-red-600' // Past deadline
  } else if (daysUntilDeadline <= 7) {
    return 'text-amber-600' // Due soon
  }
  return 'text-slate-600' // Normal
})

// Completion button styling
const completionButtonClasses = computed(() => {
  if (!props.item) return ''
  if (props.item.completed) {
    return 'bg-green-100 text-green-700 hover:bg-green-200'
  }
  return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
})

// Toggle completion
const toggleCompletion = async () => {
  if (!props.item) return
  
  const { success, error: showError } = useToast()
  
  try {
    if (props.item.completed) {
      await markIncomplete(props.documentId, props.item.id)
      emit('incomplete', props.item)
      success('Action item marked as incomplete')
    } else {
      await markComplete(props.documentId, props.item.id)
      emit('complete', props.item)
      success('Action item marked as complete!')
    }
  } catch (error) {
    console.error('Failed to toggle completion:', error)
    showError('Failed to update completion status', 'Please try again')
  }
}

const handleClose = () => {
  emit('update:isOpen', false)
}
</script>

