<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation
      :show-new-analysis="true"
      :show-dashboard="true"
      :show-user-menu="true"
    />

    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-4xl font-bold mb-2">Subscription Management</h1>
        <p class="text-xl text-blue-100">Manage your ClaimReady subscription and billing</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && !subscription" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-slate-600">Loading subscription...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div class="flex items-center">
          <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600 mr-3" />
          <div>
            <h3 class="text-lg font-semibold text-red-900">Error Loading Subscription</h3>
            <p class="text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Subscription Content -->
      <div v-else class="space-y-6">
        <!-- Current Plan Card -->
        <SubscriptionCard :auto-fetch="false" />

        <!-- Upgrade Options (Free Users) -->
        <div v-if="isFree" class="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900 mb-4">Upgrade to Premium</h2>
          <p class="text-slate-600 mb-6">
            Get access to advanced features and priority support for just $19/month.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="flex items-start">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-slate-900">Multi-claim Tracking</p>
                <p class="text-sm text-slate-600">Track multiple VA claims simultaneously</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-slate-900">Advanced Analytics</p>
                <p class="text-sm text-slate-600">Detailed insights and predictions</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-slate-900">Priority Support</p>
                <p class="text-sm text-slate-600">Get help faster when you need it</p>
              </div>
            </div>
            <div class="flex items-start">
              <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p class="font-medium text-slate-900">Form Generation</p>
                <p class="text-sm text-slate-600">AI-powered VA form assistance</p>
              </div>
            </div>
          </div>

          <Button
            @click="handleUpgrade"
            variant="primary"
            :disabled="loading"
            class="w-full"
          >
            <Icon name="heroicons:star" class="w-5 h-5 mr-2" />
            Upgrade to Premium - $19/month
          </Button>
        </div>

        <!-- Billing Management (Premium Users) -->
        <div v-if="isPremium" class="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Billing Management</h2>

          <div class="space-y-4">
            <!-- Manage Payment Method -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 class="font-semibold text-slate-900">Payment Method</h3>
                <p class="text-sm text-slate-600">Update your payment method and billing details</p>
              </div>
              <Button
                @click="handleManageBilling"
                variant="secondary"
                :disabled="loading"
              >
                <Icon name="heroicons:credit-card" class="w-5 h-5 mr-2" />
                Manage
              </Button>
            </div>

            <!-- View Invoices -->
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <h3 class="font-semibold text-slate-900">Billing History</h3>
                <p class="text-sm text-slate-600">View and download past invoices</p>
              </div>
              <Button
                @click="handleManageBilling"
                variant="secondary"
                :disabled="loading"
              >
                <Icon name="heroicons:document-text" class="w-5 h-5 mr-2" />
                View Invoices
              </Button>
            </div>

            <!-- Cancel Subscription -->
            <div v-if="!isCanceled" class="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div>
                <h3 class="font-semibold text-amber-900">Cancel Subscription</h3>
                <p class="text-sm text-amber-700">You'll keep access until {{ periodEndDate }}</p>
              </div>
              <Button
                @click="showCancelModal = true"
                variant="danger"
                :disabled="loading"
              >
                <Icon name="heroicons:x-circle" class="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>

            <!-- Reactivate Subscription -->
            <div v-else class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <h3 class="font-semibold text-green-900">Reactivate Subscription</h3>
                <p class="text-sm text-green-700">Your subscription is set to cancel on {{ periodEndDate }}</p>
              </div>
              <Button
                @click="handleManageBilling"
                variant="primary"
                :disabled="loading"
              >
                <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
                Reactivate
              </Button>
            </div>
          </div>
        </div>

        <!-- Payment Failed Warning -->
        <div v-if="isPaymentFailed" class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-start">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 class="text-lg font-semibold text-red-900 mb-2">Payment Failed</h3>
              <p class="text-red-700 mb-4">
                Your recent payment was unsuccessful. Please update your payment method to avoid service interruption.
              </p>
              <Button
                @click="handleManageBilling"
                variant="danger"
              >
                Update Payment Method
              </Button>
            </div>
          </div>
        </div>

        <!-- FAQ Section -->
        <div class="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-slate-900 mb-2">Can I cancel anytime?</h3>
              <p class="text-slate-600">
                Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-slate-900 mb-2">What happens to my data if I cancel?</h3>
              <p class="text-slate-600">
                All your documents and analysis history remain accessible even after canceling. You'll just lose access to premium-only features.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-slate-900 mb-2">Do you offer refunds?</h3>
              <p class="text-slate-600">
                We offer a 30-day money-back guarantee. If you're not satisfied within the first 30 days, contact support for a full refund.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-slate-900 mb-2">How do I get support?</h3>
              <p class="text-slate-600">
                Premium users get priority email support. Visit our <NuxtLink to="/faq" class="text-blue-600 hover:underline">FAQ page</NuxtLink> or contact us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Confirmation Modal -->
    <Modal v-if="showCancelModal" @close="showCancelModal = false">
      <template #header>
        <h2 class="text-xl font-bold text-slate-900">Cancel Subscription</h2>
      </template>

      <template #body>
        <div class="space-y-4">
          <p class="text-slate-600">
            Are you sure you want to cancel your subscription? You'll lose access to:
          </p>

          <ul class="space-y-2">
            <li class="flex items-start">
              <Icon name="heroicons:x-mark" class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-slate-700">Multi-claim tracking</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:x-mark" class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-slate-700">Advanced analytics and predictions</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:x-mark" class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-slate-700">Priority support</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:x-mark" class="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-slate-700">AI-powered form generation</span>
            </li>
          </ul>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm text-blue-900">
              <strong>Note:</strong> You'll keep access to premium features until {{ periodEndDate }}. You can reactivate anytime before then.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <Button
            @click="showCancelModal = false"
            variant="secondary"
            :disabled="loading"
          >
            Keep Subscription
          </Button>
          <Button
            @click="handleCancel"
            variant="danger"
            :disabled="loading"
          >
            {{ loading ? 'Canceling...' : 'Yes, Cancel Subscription' }}
          </Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '~/components/atoms/Button.vue';
import Navigation from '~/components/organisms/Navigation.vue';
import SubscriptionCard from '~/components/molecules/SubscriptionCard.vue';
import Modal from '~/components/molecules/Modal.vue';

// Head
useHead({
  title: 'Subscription Management - ClaimReady',
  meta: [
    { name: 'description', content: 'Manage your ClaimReady subscription and billing' }
  ]
});

const router = useRouter();
const toast = useToast();

// Billing composable
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
  cancelSubscription,
} = useBilling();

// Local state
const showCancelModal = ref(false);

// Lifecycle
onMounted(async () => {
  const { requireAuth, setupSessionMonitoring } = useAuth();

  // Require authentication
  const isAuth = await requireAuth();
  if (!isAuth) {
    return;
  }

  // Set up session monitoring
  setupSessionMonitoring();

  // Fetch subscription
  await fetchSubscription();
});

// Handlers
const handleUpgrade = async () => {
  const success = await createCheckoutSession(
    `${window.location.origin}/billing/success`,
    `${window.location.origin}/billing/subscription`,
  );

  if (!success && error.value) {
    toast.error(`Failed to start upgrade: ${error.value}`);
  }
};

const handleManageBilling = async () => {
  const success = await openBillingPortal(`${window.location.origin}/billing/subscription`);

  if (!success && error.value) {
    toast.error(`Failed to open billing portal: ${error.value}`);
  }
};

const handleCancel = async () => {
  const success = await cancelSubscription(false);

  if (success) {
    toast.success('Subscription canceled. You\'ll keep access until ' + periodEndDate.value);
    showCancelModal.value = false;
    await fetchSubscription(); // Refresh subscription data
  } else if (error.value) {
    toast.error(`Failed to cancel subscription: ${error.value}`);
  }
};
</script>
