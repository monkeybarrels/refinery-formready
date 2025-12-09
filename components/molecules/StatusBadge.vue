<template>
  <span
    :class="[
      'inline-flex items-center font-medium rounded-full',
      sizeClasses,
      statusClasses
    ]"
  >
    <span v-if="showIcon" :class="iconClasses">
      <Icon :name="iconName" :class="iconSizeClasses" />
    </span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type StatusType = 'granted' | 'denied' | 'pending' | 'deferred' | 'in_review' | 'active' | 'submitted' | 'completed' | 'not_started' | 'in_progress'

interface Props {
  status: StatusType | string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showIcon: false
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'px-2 py-0.5 text-xs'
    case 'lg': return 'px-4 py-1.5 text-sm'
    default: return 'px-2.5 py-1 text-xs'
  }
})

const iconSizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-3 h-3'
    case 'lg': return 'w-5 h-5'
    default: return 'w-4 h-4'
  }
})

const iconClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'mr-1'
    case 'lg': return 'mr-2'
    default: return 'mr-1.5'
  }
})

const statusClasses = computed(() => {
  switch (props.status) {
    case 'granted':
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'denied':
      return 'bg-red-100 text-red-800'
    case 'pending':
    case 'in_review':
      return 'bg-amber-100 text-amber-800'
    case 'deferred':
      return 'bg-slate-100 text-slate-600'
    case 'active':
    case 'in_progress':
      return 'bg-blue-100 text-blue-800'
    case 'submitted':
      return 'bg-purple-100 text-purple-800'
    case 'not_started':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
})

const iconName = computed(() => {
  switch (props.status) {
    case 'granted':
    case 'completed':
      return 'heroicons:check-circle'
    case 'denied':
      return 'heroicons:x-circle'
    case 'pending':
    case 'in_review':
      return 'heroicons:clock'
    case 'deferred':
      return 'heroicons:pause-circle'
    case 'active':
    case 'in_progress':
      return 'heroicons:play-circle'
    case 'submitted':
      return 'heroicons:paper-airplane'
    case 'not_started':
      return 'heroicons:minus-circle'
    default:
      return 'heroicons:question-mark-circle'
  }
})

const label = computed(() => {
  switch (props.status) {
    case 'granted': return 'Granted'
    case 'denied': return 'Denied'
    case 'pending': return 'Pending'
    case 'in_review': return 'In Review'
    case 'deferred': return 'Deferred'
    case 'active': return 'Active'
    case 'submitted': return 'Submitted'
    case 'completed': return 'Completed'
    case 'not_started': return 'Not Started'
    case 'in_progress': return 'In Progress'
    default: return props.status.charAt(0).toUpperCase() + props.status.slice(1).replace('_', ' ')
  }
})
</script>
