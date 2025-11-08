<template>
  <div
    class="rounded-lg p-4 border transition-all duration-200"
    :class="cardClasses"
  >
    <div class="flex items-center justify-between">
      <!-- Left side: Status info -->
      <div class="flex items-center space-x-3">
        <div :class="iconContainerClasses">
          <Icon :name="statusIcon" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-medium" :class="titleClasses">
            {{ statusTitle }}
          </p>
          <p class="text-xs" :class="subtitleClasses">
            {{ statusSubtitle }}
          </p>
        </div>
      </div>

      <!-- Right side: Action or badge -->
      <div>
        <PremiumBadge v-if="userState === 'premium'" size="sm" />
        <Button
          v-else-if="showUpgradeAction"
          @click="handleUpgrade"
          variant="ghost"
          size="sm"
          class="text-xs"
        >
          {{ upgradeButtonText }}
          <Icon name="heroicons:arrow-right" class="w-3 h-3 ml-1" />
        </Button>
        <div v-else-if="remainingUses !== undefined" class="text-right">
          <p class="text-sm font-semibold" :class="remainingClasses">
            {{ remainingUses }}
          </p>
          <p class="text-xs text-slate-500">remaining</p>
        </div>
      </div>
    </div>

    <!-- Progress bar for limited uses -->
    <div v-if="showProgressBar" class="mt-3">
      <div class="bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="progressBarClasses"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'
import PremiumBadge from '~/components/atoms/PremiumBadge.vue'

interface Props {
  userState: 'guest' | 'free' | 'premium'
  remainingUses?: number
  totalUses?: number
  showUpgradeAction?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showUpgradeAction: true,
  compact: false
})

const router = useRouter()

// Computed properties for status display
const statusTitle = computed(() => {
  switch (props.userState) {
    case 'guest':
      return 'Guest Access'
    case 'free':
      return 'Free Account'
    case 'premium':
      return 'Premium Account'
  }
})

const statusSubtitle = computed(() => {
  switch (props.userState) {
    case 'guest':
      return props.remainingUses === 0 ? 'Sign up to continue' : 'Limited analysis available'
    case 'free':
      return 'Basic features unlocked'
    case 'premium':
      return 'All features unlocked'
  }
})

const statusIcon = computed(() => {
  switch (props.userState) {
    case 'guest':
      return 'heroicons:user'
    case 'free':
      return 'heroicons:check-badge'
    case 'premium':
      return 'heroicons:star'
  }
})

const upgradeButtonText = computed(() => {
  switch (props.userState) {
    case 'guest':
      return 'Sign Up Free'
    case 'free':
      return 'Go Premium'
    default:
      return ''
  }
})

// Progress bar calculations
const showProgressBar = computed(() => {
  return props.userState === 'guest' && props.totalUses !== undefined
})

const progressPercentage = computed(() => {
  if (!props.totalUses || props.remainingUses === undefined) return 0
  return ((props.totalUses - props.remainingUses) / props.totalUses) * 100
})

// Styling classes
const cardClasses = computed(() => {
  const classes = []

  switch (props.userState) {
    case 'guest':
      classes.push('bg-slate-50 border-slate-200')
      break
    case 'free':
      classes.push('bg-blue-50 border-blue-200')
      break
    case 'premium':
      classes.push('bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300')
      break
  }

  if (!props.compact) {
    classes.push('p-4')
  } else {
    classes.push('p-3')
  }

  return classes.join(' ')
})

const iconContainerClasses = computed(() => {
  const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center'

  switch (props.userState) {
    case 'guest':
      return `${baseClasses} bg-slate-200 text-slate-600`
    case 'free':
      return `${baseClasses} bg-blue-200 text-blue-700`
    case 'premium':
      return `${baseClasses} bg-gradient-to-br from-blue-200 to-purple-200 text-blue-700`
  }
})

const titleClasses = computed(() => {
  switch (props.userState) {
    case 'guest':
      return 'text-slate-900'
    case 'free':
      return 'text-blue-900'
    case 'premium':
      return 'text-blue-900'
  }
})

const subtitleClasses = computed(() => {
  switch (props.userState) {
    case 'guest':
      return props.remainingUses === 0 ? 'text-red-600' : 'text-slate-600'
    case 'free':
      return 'text-blue-700'
    case 'premium':
      return 'text-blue-700'
  }
})

const remainingClasses = computed(() => {
  if (props.remainingUses === 0) return 'text-red-600'
  if (props.remainingUses === 1) return 'text-amber-600'
  return 'text-blue-600'
})

const progressBarClasses = computed(() => {
  if (props.remainingUses === 0) return 'bg-red-500'
  if (props.remainingUses === 1) return 'bg-amber-500'
  return 'bg-blue-500'
})

// Action handler
const handleUpgrade = () => {
  if (props.userState === 'guest') {
    router.push('/auth/signup')
  } else {
    router.push('/pricing')
  }
}
</script>