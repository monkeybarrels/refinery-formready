<template>
  <div class="relative">
    <!-- Premium Content (shown if user has access) -->
    <div v-if="isPremium">
      <slot />
    </div>

    <!-- Upgrade Prompt (shown if user doesn't have access) -->
    <div v-else>
      <UpgradePrompt
        :title="upgradeTitle"
        :message="upgradeMessage"
        :cta-text="ctaText"
        variant="info"
        :dismissible="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UpgradePrompt from '~/components/molecules/UpgradePrompt.vue'

interface Props {
  featureName: string
  description?: string
}

const props = defineProps<Props>()

const { isPremium } = useSubscription()

const upgradeTitle = computed(() => {
  return `${props.featureName} - Premium Feature`
})

const upgradeMessage = computed(() => {
  if (props.description) {
    return props.description
  }
  return `Upgrade to Premium to access ${props.featureName}. Get personalized action plans, evidence recommendations, appeal timeline tracking, and advanced form generation tools.`
})

const ctaText = computed(() => {
  return 'Upgrade to Premium - $19/month'
})
</script>

