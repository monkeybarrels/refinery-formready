<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    :class="{ 'hover:border-blue-300 transition-colors cursor-pointer': to }"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-slate-600">{{ label }}</p>
        <p class="mt-2 text-3xl font-bold" :class="valueClass">{{ formattedValue }}</p>
        <p v-if="sublabel" class="mt-1 text-xs text-slate-500">{{ sublabel }}</p>
      </div>
      <div class="p-3 rounded-lg" :class="iconBgClass">
        <Icon :name="icon" class="w-6 h-6" :class="iconClass" />
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NuxtLink } from '#components'

interface Props {
  label: string
  value: number | string
  icon: string
  variant?: 'blue' | 'green' | 'amber' | 'red'
  format?: 'currency' | 'percent' | 'number' | 'none'
  sublabel?: string
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'blue',
  format: 'none'
})

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value

  switch (props.format) {
    case 'currency':
      return `$${props.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    case 'percent':
      return `${props.value}%`
    case 'number':
      return props.value.toLocaleString('en-US')
    default:
      return String(props.value)
  }
})

const variantClasses = {
  blue: {
    value: 'text-blue-600',
    iconBg: 'bg-blue-50',
    icon: 'text-blue-600'
  },
  green: {
    value: 'text-green-600',
    iconBg: 'bg-green-50',
    icon: 'text-green-600'
  },
  amber: {
    value: 'text-amber-600',
    iconBg: 'bg-amber-50',
    icon: 'text-amber-600'
  },
  red: {
    value: 'text-red-600',
    iconBg: 'bg-red-50',
    icon: 'text-red-600'
  }
}

const valueClass = computed(() => variantClasses[props.variant].value)
const iconBgClass = computed(() => variantClasses[props.variant].iconBg)
const iconClass = computed(() => variantClasses[props.variant].icon)
</script>
