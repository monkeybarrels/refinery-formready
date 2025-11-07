<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
    <div class="max-w-2xl w-full">
      <!-- Success Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
        <!-- Success Icon -->
        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="heroicons:check-circle" class="w-12 h-12 text-green-600" />
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          Welcome to Premium!
        </h1>

        <!-- Message -->
        <p class="text-lg text-slate-600 mb-8">
          Your subscription has been activated successfully. You now have access to all premium features.
        </p>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
          <div class="flex items-start p-4 bg-green-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-slate-900">Multi-claim Tracking</p>
              <p class="text-sm text-slate-600">Track multiple VA claims</p>
            </div>
          </div>

          <div class="flex items-start p-4 bg-green-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-slate-900">Advanced Analytics</p>
              <p class="text-sm text-slate-600">Insights and predictions</p>
            </div>
          </div>

          <div class="flex items-start p-4 bg-green-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-slate-900">Priority Support</p>
              <p class="text-sm text-slate-600">Get help faster</p>
            </div>
          </div>

          <div class="flex items-start p-4 bg-green-50 rounded-lg">
            <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-slate-900">Form Generation</p>
              <p class="text-sm text-slate-600">AI-powered assistance</p>
            </div>
          </div>
        </div>

        <!-- Next Steps -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 text-left">
          <h2 class="font-semibold text-blue-900 mb-3 flex items-center">
            <Icon name="heroicons:light-bulb" class="w-5 h-5 mr-2" />
            What's Next?
          </h2>
          <ul class="space-y-2 text-sm text-blue-800">
            <li class="flex items-start">
              <span class="mr-2">1.</span>
              <span>Check your email for a receipt and subscription details</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">2.</span>
              <span>Explore premium features on your dashboard</span>
            </li>
            <li class="flex items-start">
              <span class="mr-2">3.</span>
              <span>Visit your subscription page to manage billing anytime</span>
            </li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            @click="navigateTo('/dashboard')"
            variant="primary"
            class="px-8 py-3"
          >
            <Icon name="heroicons:home" class="w-5 h-5 mr-2" />
            Go to Dashboard
          </Button>

          <Button
            @click="navigateTo('/billing/subscription')"
            variant="secondary"
            class="px-8 py-3"
          >
            <Icon name="heroicons:credit-card" class="w-5 h-5 mr-2" />
            Manage Subscription
          </Button>
        </div>

        <!-- Support Link -->
        <div class="mt-8 pt-8 border-t border-slate-200">
          <p class="text-sm text-slate-500">
            Have questions?
            <NuxtLink to="/faq" class="text-blue-600 hover:underline font-medium">
              Visit our FAQ
            </NuxtLink>
            or contact support
          </p>
        </div>
      </div>

      <!-- Back to Home Link -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-slate-600 hover:text-slate-900 text-sm">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue';

// Head
useHead({
  title: 'Welcome to Premium! - ClaimReady',
  meta: [
    { name: 'description', content: 'Your ClaimReady Premium subscription is now active' }
  ]
});

// Track successful conversion
if (process.client) {
  // You can add analytics tracking here
  console.log('Premium subscription activated');
}
</script>
