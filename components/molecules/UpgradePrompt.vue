<template>
  <div
    v-if="show && !isPremium"
    class="upgrade-prompt"
    :class="variantClass"
  >
    <div class="upgrade-prompt__content">
      <div class="upgrade-prompt__icon">
        <svg
          v-if="variant === 'info'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
        <svg
          v-else-if="variant === 'warning'"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>

      <div class="upgrade-prompt__text">
        <h3 v-if="title" class="upgrade-prompt__title">
          {{ title }}
        </h3>
        <p class="upgrade-prompt__message">
          {{ message }}
        </p>
      </div>

      <div class="upgrade-prompt__actions">
        <button
          v-if="dismissible"
          type="button"
          class="upgrade-prompt__dismiss"
          @click="handleDismiss"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          type="button"
          class="upgrade-prompt__cta"
          :disabled="loading"
          @click="handleUpgrade"
        >
          <span v-if="!loading">{{ ctaText }}</span>
          <span v-else class="upgrade-prompt__spinner">Redirecting...</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface UpgradePromptProps {
  title?: string;
  message: string;
  ctaText?: string;
  variant?: 'info' | 'warning' | 'success';
  dismissible?: boolean;
  successUrl?: string;
  cancelUrl?: string;
}

const props = withDefaults(defineProps<UpgradePromptProps>(), {
  title: '',
  ctaText: 'Upgrade to Premium',
  variant: 'info',
  dismissible: true,
  successUrl: undefined,
  cancelUrl: undefined,
});

const emit = defineEmits<{
  dismiss: [];
  upgrade: [];
}>();

const { isPremium } = useSubscription();
const loading = ref(false);
const error = ref<string | null>(null);

const show = ref(true);

const variantClass = computed(() => `upgrade-prompt--${props.variant}`);

const handleDismiss = () => {
  show.value = false;
  emit('dismiss');
};

const handleUpgrade = async () => {
  emit('upgrade');
  
  // Phase 1: Redirect to pricing page (Stripe integration will be added in Phase 2)
  // Phase 2: Will use createCheckoutSession from useBilling
  loading.value = true;
  
  try {
    // For now, redirect to pricing page
    // In Phase 2, this will create a Stripe checkout session
    navigateTo('/pricing');
  } catch (e: any) {
    error.value = e.message || 'Failed to start upgrade process';
    console.error('Upgrade failed:', error.value);
    alert(`Failed to start upgrade process: ${error.value}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.upgrade-prompt {
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
}

.upgrade-prompt--info {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.upgrade-prompt--warning {
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
}

.upgrade-prompt--success {
  background-color: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
}

.upgrade-prompt__content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.upgrade-prompt__icon {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
}

.upgrade-prompt__text {
  flex: 1;
}

.upgrade-prompt__title {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.upgrade-prompt__message {
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.upgrade-prompt__actions {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  flex-shrink: 0;
}

.upgrade-prompt__dismiss {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: currentColor;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.upgrade-prompt__dismiss:hover {
  opacity: 1;
}

.upgrade-prompt__cta {
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.upgrade-prompt__cta:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.upgrade-prompt__cta:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upgrade-prompt__spinner {
  display: inline-block;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .upgrade-prompt--info {
    background-color: #1e3a8a;
    border-color: #3b82f6;
    color: #93c5fd;
  }

  .upgrade-prompt--warning {
    background-color: #78350f;
    border-color: #f59e0b;
    color: #fcd34d;
  }

  .upgrade-prompt--success {
    background-color: #064e3b;
    border-color: #10b981;
    color: #6ee7b7;
  }

  .upgrade-prompt__cta {
    background-color: #3b82f6;
  }

  .upgrade-prompt__cta:hover:not(:disabled) {
    background-color: #2563eb;
  }
}
</style>
