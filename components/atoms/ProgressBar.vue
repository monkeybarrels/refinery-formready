<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-2">
      <span v-if="showLabel" class="text-sm font-medium text-slate-700">
        {{ label }}
      </span>
      <span class="text-sm text-slate-500">
        {{ Math.round(percentage) }}%
      </span>
    </div>
    
    <div class="w-full bg-slate-200 rounded-full h-2">
      <div 
        :class="progressClasses"
        :style="{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }"
        class="h-2 rounded-full transition-all duration-300 ease-out"
      ></div>
    </div>
    
    <div v-if="description" class="mt-1 text-xs text-slate-500">
      {{ description }}
    </div>
  </div>
</template>

 <script setup lang="ts">
interface Props {
  percentage: number
  color?: 'indigo' | 'blue' | 'green' | 'amber' | 'red'
  showLabel?: boolean
  label?: string
  description?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  color: 'indigo',
  showLabel: true,
  label: 'Progress',
  description: null
})

const progressClasses = computed(() => {
  const colorMap = {
    indigo: 'bg-indigo-600',
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    amber: 'bg-amber-600',
    red: 'bg-red-600'
  }
  
  return colorMap[props.color]
})
</script>
