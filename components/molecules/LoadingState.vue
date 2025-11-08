<template>
  <div class="flex flex-col items-center justify-center" :class="containerClasses">
    <!-- Spinner -->
    <div v-if="showSpinner" :class="spinnerClasses"></div>

    <!-- Progress Bar -->
    <div v-if="variant === 'progress' && progress !== undefined" class="w-full max-w-md mt-4">
      <div class="bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          class="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
          :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
        ></div>
      </div>
      <p v-if="progressText" class="text-sm text-slate-600 mt-2 text-center">
        {{ progressText }}
      </p>
    </div>

    <!-- Steps -->
    <div v-if="variant === 'steps' && steps" class="w-full max-w-md mt-8 space-y-4">
      <div v-for="(step, index) in steps" :key="index" class="flex items-center space-x-3">
        <div :class="getStepClasses(index)">
          <Icon v-if="index < currentStep" name="heroicons:check" class="w-4 h-4" />
          <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
        </div>
        <span :class="getStepTextClasses(index)">
          {{ step }}
        </span>
      </div>
    </div>

    <!-- Message -->
    <div v-if="message" class="mt-4 text-center">
      <p :class="messageClasses">{{ message }}</p>
      <p v-if="subMessage" class="text-sm text-slate-500 mt-1">{{ subMessage }}</p>
    </div>

    <!-- Action (for cancellable operations) -->
    <div v-if="showCancel" class="mt-6">
      <Button @click="handleCancel" variant="ghost" size="sm">
        <Icon name="heroicons:x-mark" class="w-4 h-4 mr-1" />
        Cancel
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'

interface Props {
  variant?: 'spinner' | 'progress' | 'steps' | 'skeleton'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  message?: string
  subMessage?: string
  progress?: number
  progressText?: string
  steps?: string[]
  currentStep?: number
  showCancel?: boolean
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'spinner',
  size: 'md',
  currentStep: 0,
  showCancel: false,
  fullHeight: true
})

const emit = defineEmits<{
  cancel: []
}>()

// Show spinner for all variants except skeleton
const showSpinner = computed(() => props.variant !== 'skeleton')

// Container classes
const containerClasses = computed(() => {
  const classes = []
  if (props.fullHeight) {
    classes.push('min-h-[400px]')
  } else {
    classes.push('py-12')
  }
  return classes.join(' ')
})

// Spinner size classes
const spinnerClasses = computed(() => {
  const baseClasses = 'animate-spin rounded-full border-b-2 border-blue-600'
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }
  return `${baseClasses} ${sizeClasses[props.size]}`
})

// Message classes based on size
const messageClasses = computed(() => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return `${sizeClasses[props.size]} text-slate-600 font-medium`
})

// Get step circle classes
const getStepClasses = (index: number) => {
  const baseClasses = 'w-8 h-8 rounded-full flex items-center justify-center text-white'

  if (index < props.currentStep) {
    return `${baseClasses} bg-green-500`
  } else if (index === props.currentStep) {
    return `${baseClasses} bg-blue-600 animate-pulse`
  } else {
    return `${baseClasses} bg-slate-300`
  }
}

// Get step text classes
const getStepTextClasses = (index: number) => {
  if (index <= props.currentStep) {
    return 'text-slate-900 font-medium'
  }
  return 'text-slate-400'
}

// Handle cancel
const handleCancel = () => {
  emit('cancel')
}
</script>