<template>
  <div class="flex flex-col items-center justify-center py-12 px-6 text-center">
    <!-- Icon -->
    <div
      class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
      :class="iconContainerClasses"
    >
      <Icon :name="iconName" class="w-12 h-12" :class="iconClasses" />
    </div>

    <!-- Title -->
    <h2 class="text-2xl font-bold text-slate-900 mb-3">
      {{ title }}
    </h2>

    <!-- Description -->
    <p class="text-lg text-slate-600 mb-8 max-w-md">
      {{ description }}
    </p>

    <!-- Benefits List (Optional) -->
    <div v-if="benefits && benefits.length > 0" class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left max-w-md w-full">
      <h3 class="font-semibold text-blue-900 mb-3">{{ benefitsTitle || 'What you get:' }}</h3>
      <ul class="space-y-2">
        <li v-for="benefit in benefits" :key="benefit" class="flex items-start">
          <Icon name="heroicons:check-circle" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <span class="text-sm text-blue-800">{{ benefit }}</span>
        </li>
      </ul>
    </div>

    <!-- Primary Actions -->
    <div class="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
      <Button
        v-if="primaryAction"
        @click="handlePrimaryAction"
        :variant="primaryAction.variant || 'primary'"
        class="min-w-[200px]"
      >
        <Icon v-if="primaryAction.icon" :name="primaryAction.icon" class="w-5 h-5 mr-2" />
        {{ primaryAction.label }}
      </Button>

      <Button
        v-if="secondaryAction"
        @click="handleSecondaryAction"
        :variant="secondaryAction.variant || 'secondary'"
        class="min-w-[200px]"
      >
        <Icon v-if="secondaryAction.icon" :name="secondaryAction.icon" class="w-5 h-5 mr-2" />
        {{ secondaryAction.label }}
      </Button>
    </div>

    <!-- Tertiary Action -->
    <div v-if="tertiaryAction" class="mt-4">
      <button
        @click="handleTertiaryAction"
        class="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
      >
        {{ tertiaryAction.label }}
        <Icon v-if="tertiaryAction.icon" :name="tertiaryAction.icon" class="w-4 h-4 ml-1" />
      </button>
    </div>

    <!-- Footer Message -->
    <p v-if="footerMessage" class="text-sm text-slate-500 mt-6">
      {{ footerMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'

interface Action {
  label: string
  icon?: string
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  to?: string
  action?: () => void
}

interface Props {
  variant?: 'empty' | 'locked' | 'error' | 'success' | 'limit-reached' | 'upgrade'
  iconName?: string
  title: string
  description: string
  benefits?: string[]
  benefitsTitle?: string
  primaryAction?: Action
  secondaryAction?: Action
  tertiaryAction?: Action
  footerMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'empty',
  iconName: 'heroicons:document-text'
})

const emit = defineEmits<{
  primaryAction: []
  secondaryAction: []
  tertiaryAction: []
}>()

const router = useRouter()

// Computed styles based on variant
const iconContainerClasses = computed(() => {
  switch (props.variant) {
    case 'locked':
      return 'bg-blue-100'
    case 'error':
      return 'bg-red-100'
    case 'success':
      return 'bg-green-100'
    case 'limit-reached':
      return 'bg-amber-100'
    case 'upgrade':
      return 'bg-gradient-to-br from-blue-100 to-purple-100'
    default:
      return 'bg-slate-100'
  }
})

const iconClasses = computed(() => {
  switch (props.variant) {
    case 'locked':
      return 'text-blue-600'
    case 'error':
      return 'text-red-600'
    case 'success':
      return 'text-green-600'
    case 'limit-reached':
      return 'text-amber-600'
    case 'upgrade':
      return 'text-blue-600'
    default:
      return 'text-slate-400'
  }
})

// Action handlers
const handlePrimaryAction = () => {
  if (props.primaryAction?.to) {
    router.push(props.primaryAction.to)
  } else if (props.primaryAction?.action) {
    props.primaryAction.action()
  }
  emit('primaryAction')
}

const handleSecondaryAction = () => {
  if (props.secondaryAction?.to) {
    router.push(props.secondaryAction.to)
  } else if (props.secondaryAction?.action) {
    props.secondaryAction.action()
  }
  emit('secondaryAction')
}

const handleTertiaryAction = () => {
  if (props.tertiaryAction?.to) {
    router.push(props.tertiaryAction.to)
  } else if (props.tertiaryAction?.action) {
    props.tertiaryAction.action()
  }
  emit('tertiaryAction')
}
</script>