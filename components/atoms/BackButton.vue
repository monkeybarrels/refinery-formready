<template>
  <button
    @click="handleBack"
    class="inline-flex items-center text-slate-600 hover:text-blue-600 transition-colors font-medium"
    :class="[sizeClasses, customClass]"
    :disabled="disabled"
  >
    <Icon name="heroicons:arrow-left" :class="iconClasses" />
    <span v-if="showLabel">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  to?: string
  label?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  customClass?: string
  disabled?: boolean
  fallbackRoute?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Back',
  showLabel: true,
  size: 'md',
  disabled: false
})

const router = useRouter()
const { isAuthenticated } = useAuth()
const { isPremium } = useSubscription()

const emit = defineEmits<{
  back: []
}>()

// Size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-sm py-1'
    case 'lg':
      return 'text-lg py-3'
    default:
      return 'text-base py-2'
  }
})

const iconClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-4 h-4 mr-1'
    case 'lg':
      return 'w-6 h-6 mr-2'
    default:
      return 'w-5 h-5 mr-2'
  }
})

// Handle back navigation
const handleBack = () => {
  if (props.disabled) return

  emit('back')

  if (props.to) {
    // Explicit route provided
    router.push(props.to)
  } else if (window.history.length > 1) {
    // Go back in browser history if possible
    router.back()
  } else {
    // Fallback to appropriate home route
    const fallback = props.fallbackRoute || getDefaultFallback()
    router.push(fallback)
  }
}

// Get default fallback based on user state
const getDefaultFallback = () => {
  if (!isAuthenticated.value) {
    return '/'
  }
  // Premium users go to dashboard, free users to analyze
  return isPremium.value ? '/dashboard' : '/analyze'
}
</script>