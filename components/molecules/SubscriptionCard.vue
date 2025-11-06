<template>
  <div class="subscription-card">
    <div class="subscription-card__header">
      <h2 class="subscription-card__title">Subscription</h2>
      <span class="subscription-card__badge" :class="statusClass">
        {{ statusText }}
      </span>
    </div>

    <div v-if="loading" class="subscription-card__loading">
      <div class="subscription-card__spinner"></div>
      <p>Loading subscription details...</p>
    </div>

    <div v-else-if="error" class="subscription-card__error">
      <svg
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
      <p>{{ error }}</p>
    </div>

    <div v-else class="subscription-card__content">
      <div class="subscription-card__plan">
        <div class="subscription-card__plan-icon">
          <svg
            v-if="isPremium"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </div>
        <div class="subscription-card__plan-details">
          <h3 class="subscription-card__plan-name">
            {{ planName }}
          </h3>
          <p class="subscription-card__plan-description">
            {{ planDescription }}
          </p>
        </div>
      </div>

      <div v-if="isPremium" class="subscription-card__info">
        <div v-if="periodEndDate" class="subscription-card__info-item">
          <span class="subscription-card__info-label">
            {{ isCanceled ? 'Expires on' : 'Next billing date' }}
          </span>
          <span class="subscription-card__info-value">
            {{ periodEndDate }}
          </span>
        </div>

        <div v-if="isPaymentFailed" class="subscription-card__warning">
          <svg
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
          <p>Your payment has failed. Please update your payment method.</p>
        </div>

        <div v-if="isCanceled" class="subscription-card__notice">
          <svg
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
          <p>Your subscription has been canceled and will not renew.</p>
        </div>
      </div>

      <div class="subscription-card__actions">
        <button
          v-if="isFree"
          type="button"
          class="subscription-card__button subscription-card__button--primary"
          :disabled="loading"
          @click="handleUpgrade"
        >
          Upgrade to Premium
        </button>
        <button
          v-else
          type="button"
          class="subscription-card__button subscription-card__button--secondary"
          :disabled="loading"
          @click="handleManage"
        >
          Manage Subscription
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';

export interface SubscriptionCardProps {
  autoFetch?: boolean;
}

const props = withDefaults(defineProps<SubscriptionCardProps>(), {
  autoFetch: true,
});

const {
  subscription,
  loading,
  error,
  isPremium,
  isFree,
  isCanceled,
  isPaymentFailed,
  periodEndDate,
  fetchSubscription,
  createCheckoutSession,
  openBillingPortal,
} = useBilling();

const statusClass = computed(() => {
  if (loading.value) return 'subscription-card__badge--loading';
  if (error.value) return 'subscription-card__badge--error';
  if (isPaymentFailed.value) return 'subscription-card__badge--error';
  if (isCanceled.value) return 'subscription-card__badge--warning';
  if (isPremium.value) return 'subscription-card__badge--premium';
  return 'subscription-card__badge--free';
});

const statusText = computed(() => {
  if (loading.value) return 'Loading...';
  if (error.value) return 'Error';
  if (isPaymentFailed.value) return 'Payment Failed';
  if (isCanceled.value) return 'Canceled';
  if (isPremium.value) return 'Premium';
  return 'Free';
});

const planName = computed(() => {
  if (isPremium.value) return 'Premium Plan';
  return 'Free Plan';
});

const planDescription = computed(() => {
  if (isPremium.value) {
    return 'Full access to all premium features';
  }
  return 'Limited access to basic features';
});

const handleUpgrade = async () => {
  await createCheckoutSession(
    `${window.location.origin}/billing/success`,
    `${window.location.origin}/dashboard`,
  );
};

const handleManage = async () => {
  await openBillingPortal(`${window.location.origin}/dashboard`);
};

onMounted(async () => {
  if (props.autoFetch) {
    await fetchSubscription();
  }
});
</script>

<style scoped>
.subscription-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}

.subscription-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.subscription-card__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #111827;
}

.subscription-card__badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.subscription-card__badge--premium {
  background-color: #dbeafe;
  color: #1e40af;
}

.subscription-card__badge--free {
  background-color: #f3f4f6;
  color: #6b7280;
}

.subscription-card__badge--warning {
  background-color: #fef3c7;
  color: #92400e;
}

.subscription-card__badge--error {
  background-color: #fee2e2;
  color: #991b1b;
}

.subscription-card__badge--loading {
  background-color: #f3f4f6;
  color: #6b7280;
}

.subscription-card__loading,
.subscription-card__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  color: #6b7280;
}

.subscription-card__spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid #f3f4f6;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.subscription-card__error {
  color: #dc2626;
  gap: 0.5rem;
}

.subscription-card__content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.subscription-card__plan {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.subscription-card__plan-icon {
  color: #2563eb;
  flex-shrink: 0;
}

.subscription-card__plan-details {
  flex: 1;
}

.subscription-card__plan-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: #111827;
}

.subscription-card__plan-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.subscription-card__info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.375rem;
}

.subscription-card__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subscription-card__info-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.subscription-card__info-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.subscription-card__warning,
.subscription-card__notice {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.375rem;
}

.subscription-card__warning {
  background-color: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.subscription-card__notice {
  background-color: #dbeafe;
  color: #1e40af;
  border: 1px solid #bfdbfe;
}

.subscription-card__warning svg,
.subscription-card__notice svg {
  flex-shrink: 0;
}

.subscription-card__warning p,
.subscription-card__notice p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.subscription-card__actions {
  display: flex;
  gap: 0.75rem;
}

.subscription-card__button {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.subscription-card__button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.subscription-card__button--primary {
  background-color: #2563eb;
  color: white;
}

.subscription-card__button--primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.subscription-card__button--secondary {
  background-color: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.subscription-card__button--secondary:hover:not(:disabled) {
  background-color: #f9fafb;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .subscription-card {
    background: #1f2937;
    border-color: #374151;
  }

  .subscription-card__title,
  .subscription-card__plan-name,
  .subscription-card__info-value {
    color: #f9fafb;
  }

  .subscription-card__plan-description,
  .subscription-card__info-label {
    color: #9ca3af;
  }

  .subscription-card__info {
    background-color: #111827;
  }

  .subscription-card__button--secondary {
    background-color: #374151;
    color: #f9fafb;
    border-color: #4b5563;
  }

  .subscription-card__button--secondary:hover:not(:disabled) {
    background-color: #4b5563;
  }
}
</style>
