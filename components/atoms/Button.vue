<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <Icon 
      v-if="icon" 
      :name="icon" 
      :size="iconSize"
      class="mr-2"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string | null
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  icon: null,
  type: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const { colors, sizes, transitions } = useDesignTokens()

const buttonClasses = computed(() => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2'
  const sizeClasses = sizes.button[props.size]
  const transitionClasses = transitions.normal
  
  let variantClasses = ''
  let focusClasses = ''
  
  if (props.disabled) {
    variantClasses = 'bg-slate-100 text-slate-400 cursor-not-allowed'
  } else {
    switch (props.variant) {
      case 'primary':
        variantClasses = `${colors.primary.bg} ${colors.primary.hover} text-white`
        focusClasses = 'focus:ring-indigo-500'
        break
      case 'secondary':
        variantClasses = `${colors.secondary.bg} ${colors.secondary.hover} text-white`
        focusClasses = 'focus:ring-slate-500'
        break
      case 'ghost':
        variantClasses = 'bg-transparent text-slate-600 hover:bg-slate-100'
        focusClasses = 'focus:ring-slate-500'
        break
      case 'danger':
        variantClasses = 'bg-red-600 hover:bg-red-700 text-white'
        focusClasses = 'focus:ring-red-500'
        break
    }
  }
  
  return `${baseClasses} ${sizeClasses} ${variantClasses} ${focusClasses} ${transitionClasses}`
})

const iconSize = computed(() => {
  return props.size === 'sm' ? 'sm' : 'md'
})
</script>
