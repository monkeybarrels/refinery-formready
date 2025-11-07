<template>
  <span class="premium-badge" :class="sizeClass">
    <svg
      v-if="showIcon"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="premium-badge__icon"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
      />
    </svg>
    <span class="premium-badge__text">{{ text }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface PremiumBadgeProps {
  text?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<PremiumBadgeProps>(), {
  text: 'Premium',
  showIcon: true,
  size: 'md',
});

const sizeClass = computed(() => `premium-badge--${props.size}`);
</script>

<style scoped>
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
  color: white;
  font-weight: 500;
  white-space: nowrap;
}

.premium-badge--sm {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
}

.premium-badge--sm .premium-badge__icon {
  width: 0.875rem;
  height: 0.875rem;
}

.premium-badge--md {
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}

.premium-badge--md .premium-badge__icon {
  width: 1rem;
  height: 1rem;
}

.premium-badge--lg {
  font-size: 1rem;
  padding: 0.375rem 1rem;
}

.premium-badge--lg .premium-badge__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.premium-badge__icon {
  flex-shrink: 0;
}

.premium-badge__text {
  line-height: 1;
}

/* Animation on hover */
.premium-badge {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.premium-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
</style>
