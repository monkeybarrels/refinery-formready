<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full">
      <!-- Cancel Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <!-- Icon -->
        <div class="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:x-circle" class="w-12 h-12 text-amber-600" />
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Upgrade Canceled
        </h1>

        <!-- Message -->
        <p class="text-lg text-slate-600 mb-8">
          No worries! You can upgrade to premium anytime you're ready.
        </p>

        <!-- What You're Missing -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 class="font-semibold text-blue-900 mb-4 text-center">
            Premium features you're missing out on:
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="flex items-start">
              <Icon name="heroicons:star" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-blue-800">Multi-claim tracking</span>
            </div>

            <div class="flex items-start">
              <Icon name="heroicons:star" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-blue-800">Advanced analytics</span>
            </div>

            <div class="flex items-start">
              <Icon name="heroicons:star" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-blue-800">Priority support</span>
            </div>

            <div class="flex items-start">
              <Icon name="heroicons:star" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-blue-800">AI form generation</span>
            </div>

            <div class="flex items-start">
              <Icon name="heroicons:star" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-blue-800">Success predictions</span>
            </div>

            <div class="flex items-start">
              <Icon name="heroicons:star" class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span class="text-sm text-blue-800">Evidence recommendations</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-white rounded-lg border border-blue-300">
            <p class="text-sm text-blue-900 text-center">
              <strong>Special Offer:</strong> Get 30-day money-back guarantee when you upgrade today!
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <Button
            @click="navigateTo('/pricing')"
            variant="primary"
            class="px-8 py-3"
          >
            <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
            Try Premium - $19/month
          </Button>

          <Button
            @click="navigateTo('/dashboard')"
            variant="secondary"
            class="px-8 py-3"
          >
            <Icon name="heroicons:home" class="w-5 h-5 mr-2" />
            Continue with Free
          </Button>
        </div>

        <!-- Free Features Reminder -->
        <div class="text-sm text-slate-600">
          <p class="mb-2">You still have access to:</p>
          <div class="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <span>✓ Decision letter analysis</span>
            <span>✓ Denial explanations</span>
            <span>✓ Evidence checklists</span>
          </div>
        </div>

        <!-- Feedback Section -->
        <div class="mt-8 pt-8 border-t border-slate-200">
          <p class="text-sm text-slate-500 mb-3">
            Why didn't you upgrade? Help us improve!
          </p>
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-for="reason in cancelReasons"
              :key="reason"
              @click="handleFeedback(reason)"
              class="px-3 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors"
            >
              {{ reason }}
            </button>
          </div>
        </div>
      </div>

      <!-- Back Links -->
      <div class="text-center mt-6 space-x-4">
        <NuxtLink to="/" class="text-slate-600 hover:text-slate-900 text-sm">
          ← Back to Home
        </NuxtLink>
        <span class="text-slate-300">|</span>
        <NuxtLink to="/faq" class="text-slate-600 hover:text-slate-900 text-sm">
          Have Questions?
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '~/components/atoms/Button.vue';

// Head
useHead({
  title: 'Upgrade Canceled - ClaimReady',
  meta: [
    { name: 'description', content: 'ClaimReady subscription upgrade canceled' }
  ]
});

const toast = useToast();

const cancelReasons = ref([
  'Too expensive',
  'Don\'t need it yet',
  'Want to try free first',
  'Changed my mind',
  'Technical issues',
]);

const handleFeedback = (reason: string) => {
  // Track feedback
  console.log('Cancel feedback:', reason);

  // You can send this to analytics or your backend
  toast.success('Thank you for your feedback!');

  // Optionally navigate after feedback
  setTimeout(() => {
    navigateTo('/dashboard');
  }, 1500);
};

// Track cancellation
if (process.client) {
  console.log('Subscription upgrade canceled');
}
</script>
