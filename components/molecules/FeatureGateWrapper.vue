<template>
  <div class="relative">
    <!-- Content (shown based on access) -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Overlay for locked features -->
    <div
      v-if="!hasAccess && showOverlay"
      class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-900/70 via-slate-900/50 to-transparent rounded-xl"
      :class="overlayClasses"
    >
      <div class="text-center px-6">
        <div class="bg-white rounded-xl shadow-2xl p-6 max-w-sm mx-auto">
          <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Icon :name="lockIcon" class="w-8 h-8 text-blue-600" />
          </div>

          <h3 class="text-lg font-bold text-slate-900 mb-2">
            {{ upgradeTitle }}
          </h3>

          <p class="text-sm text-slate-600 mb-4">
            {{ access.upgradeMessage }}
          </p>

          <!-- Anonymous User -->
          <Button
            v-if="access.needsAuth"
            @click="navigateTo('/auth/register')"
            variant="primary"
            class="w-full mb-2"
          >
            <Icon name="heroicons:user-plus" class="w-4 h-4 mr-2" />
            Create Free Account
          </Button>

          <!-- Free User -->
          <Button
            v-else-if="access.needsUpgrade"
            @click="handleUpgrade"
            variant="primary"
            class="w-full mb-2"
          >
            <Icon name="heroicons:star" class="w-4 h-4 mr-2" />
            Upgrade to {{ requiredTier }} - $19/month
          </Button>

          <p class="text-xs text-slate-500">
            {{ footerText }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RequiredTier } from '~/composables/useFeatureGate';
import Button from '~/components/atoms/Button.vue';

const props = withDefaults(defineProps<{
  requiredTier: RequiredTier;
  featureName: string;
  description?: string;
  blurContent?: boolean;
  showOverlay?: boolean;
  lockIcon?: string;
}>(), {
  blurContent: true,
  showOverlay: true,
  lockIcon: 'heroicons:lock-closed'
});

const { requireTier } = useFeatureGate();
const { createCheckoutSession } = useBilling();

// Check access
const access = computed(() => requireTier(props.requiredTier, props.featureName, props.description));
const hasAccess = computed(() => access.value.hasAccess);

// Content styling
const contentClasses = computed(() => {
  if (!hasAccess.value && props.blurContent) {
    return 'blur-sm select-none pointer-events-none';
  }
  return '';
});

const overlayClasses = computed(() => {
  return props.blurContent ? '' : 'bg-slate-100/95';
});

// Messaging
const upgradeTitle = computed(() => {
  if (access.value.needsAuth) {
    return `${props.featureName} - Premium Feature`;
  }
  return `Upgrade to ${props.requiredTier}`;
});

const footerText = computed(() => {
  if (access.value.needsAuth) {
    return 'Free account • No credit card required';
  }
  return '30-day money-back guarantee • Cancel anytime';
});

// Handle upgrade
const handleUpgrade = async () => {
  const success = await createCheckoutSession(
    `${window.location.origin}/billing/success`,
    `${window.location.origin}${window.location.pathname}`
  );

  if (!success) {
    navigateTo('/pricing');
  }
};
</script>
