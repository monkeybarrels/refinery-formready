<template>
  <span 
    :class="badgeClasses"
    class="inline-flex items-center font-medium"
  >
    <Icon 
      v-if="icon" 
      :name="icon" 
      :size="iconSize"
      class="mr-1"
    />
    {{ text }}
  </span>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

interface Props {
  variant?: 'approved' | 'denied' | 'deferred' | 'default' | 'primary' | 'secondary'
  text: string
  size?: 'sm' | 'md' | 'lg'
  icon?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  icon: null
})

const { colors, sizes } = useDesignTokens()

const badgeClasses = computed(() => {
  const baseClasses = 'inline-flex items-center font-medium'
  const sizeClasses = sizes.badge[props.size]
  
  let variantClasses = ''
  switch (props.variant) {
    case 'approved':
      variantClasses = colors.approved.badge
      break
    case 'denied':
      variantClasses = colors.denied.badge
      break
    case 'deferred':
      variantClasses = colors.deferred.badge
      break
    case 'primary':
      variantClasses = 'bg-indigo-100 text-indigo-800'
      break
    case 'secondary':
      variantClasses = 'bg-slate-100 text-slate-800'
      break
    default:
      variantClasses = 'bg-slate-100 text-slate-800'
  }
  
  return `${baseClasses} ${sizeClasses} ${variantClasses}`
})

const iconSize = computed(() => {
  return props.size === 'sm' ? 'sm' : 'md'
})
</script>
