<template>
  <div>
    <!-- Show content if feature flag is enabled -->
    <div v-if="isEnabled">
      <slot />
    </div>
    
    <!-- Show fallback if feature flag is disabled -->
    <div v-else-if="showFallback">
      <slot name="fallback">
        <div v-if="fallbackMessage" class="p-4 bg-gray-50 rounded-lg text-gray-600 text-sm">
          {{ fallbackMessage }}
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

interface Props {
  flagName: string
  fallbackMessage?: string
  showFallback?: boolean
  autoRefresh?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFallback: true,
  autoRefresh: true,
})

const { isEnabled: checkEnabled, checkFlag, refreshFlags } = useFeatureFlags()

// Check if flag is enabled (from cache)
const isEnabled = computed(() => checkEnabled(props.flagName))

// Refresh flag status on mount if autoRefresh is enabled
onMounted(async () => {
  if (props.autoRefresh) {
    await checkFlag(props.flagName)
  }
})
</script>

