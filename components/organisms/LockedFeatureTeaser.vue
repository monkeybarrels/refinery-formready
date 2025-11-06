<template>
  <div class="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl shadow-xl overflow-hidden mb-8 border-2 border-blue-200">
    <!-- Header with Premium Badge -->
    <div class="relative bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
      <div class="absolute top-4 right-4">
        <PremiumBadge size="sm" />
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">
        🎯 Your Personalized Action Plan
      </h2>
      <p class="text-blue-100">
        {{ headerMessage }}
      </p>
    </div>

    <!-- Blurred Preview Content -->
    <div class="relative">
      <!-- Actual Content (Blurred) -->
      <div class="p-8 space-y-6 blur-sm select-none pointer-events-none">
        <!-- Appeal Recommendation -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div class="flex items-start mb-4">
            <div class="bg-blue-100 rounded-lg p-3 mr-4">
              <Icon name="heroicons:scale" class="w-6 h-6 text-blue-600" />
            </div>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-slate-900 mb-2">
                Appeal Strategy: Higher-Level Review
              </h3>
              <p class="text-slate-600 mb-4">
                Based on your denial reasons, a Higher-Level Review has the highest success rate for your case.
              </p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 class="font-semibold text-slate-900 mb-3 flex items-center">
              <Icon name="heroicons:calendar" class="w-5 h-5 mr-2 text-blue-600" />
              Your Timeline
            </h4>
            <div class="space-y-2">
              <div class="flex items-center text-sm">
                <div class="w-24 font-medium text-slate-600">Day 1-7:</div>
                <div class="flex-1 text-slate-900">Gather medical evidence from VA records</div>
              </div>
              <div class="flex items-center text-sm">
                <div class="w-24 font-medium text-slate-600">Day 8-14:</div>
                <div class="flex-1 text-slate-900">Request DBQ from private provider</div>
              </div>
              <div class="flex items-center text-sm">
                <div class="w-24 font-medium text-slate-600">Day 15-30:</div>
                <div class="flex-1 text-slate-900">Submit HLR with new evidence</div>
              </div>
            </div>
          </div>

          <!-- Evidence Checklist -->
          <div class="bg-amber-50 rounded-lg p-4">
            <h4 class="font-semibold text-slate-900 mb-3 flex items-center">
              <Icon name="heroicons:clipboard-document-check" class="w-5 h-5 mr-2 text-amber-600" />
              Evidence You Need
            </h4>
            <ul class="space-y-2">
              <li class="flex items-start text-sm">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-slate-900">Sleep study results showing AHI score</span>
              </li>
              <li class="flex items-start text-sm">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-slate-900">Nexus letter linking condition to service</span>
              </li>
              <li class="flex items-start text-sm">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span class="text-slate-900">Buddy statements from service members</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Additional Denied Conditions -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
          <div class="flex items-start mb-4">
            <div class="bg-red-100 rounded-lg p-3 mr-4">
              <Icon name="heroicons:document-text" class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">
                Next Steps for PTSD Denial
              </h3>
              <p class="text-slate-600">
                Your PTSD claim was denied due to insufficient evidence of a stressor event...
              </p>
            </div>
          </div>
        </div>

        <!-- Increase Rating Opportunities -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div class="flex items-start mb-4">
            <div class="bg-green-100 rounded-lg p-3 mr-4">
              <Icon name="heroicons:arrow-trending-up" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-slate-900 mb-2">
                Potential Rating Increases
              </h3>
              <p class="text-slate-600">
                Your current conditions may qualify for higher ratings. We identified 2 opportunities...
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Overlay with CTA -->
      <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-slate-900/70 via-slate-900/50 to-transparent">
        <div class="text-center px-6 mt-24">
          <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto transform hover:scale-105 transition-transform">
            <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Icon :name="ctaIcon" class="w-10 h-10 text-blue-600" />
            </div>
            <h3 class="text-2xl font-bold text-slate-900 mb-3">
              {{ ctaTitle }}
            </h3>
            <p class="text-slate-600 mb-6">
              {{ ctaDescription }}
            </p>
            <ul class="text-left space-y-2 mb-6">
              <li class="flex items-center text-sm text-slate-700">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Step-by-step appeal timelines</span>
              </li>
              <li class="flex items-center text-sm text-slate-700">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Specific evidence recommendations</span>
              </li>
              <li class="flex items-center text-sm text-slate-700">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Rating increase opportunities</span>
              </li>
              <li class="flex items-center text-sm text-slate-700">
                <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Deadline tracking & reminders</span>
              </li>
            </ul>

            <!-- Anonymous User CTA -->
            <button
              v-if="!isAuthenticated"
              @click="$emit('show-signup')"
              class="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg transform hover:scale-105"
            >
              <Icon name="heroicons:user-plus" class="w-5 h-5 inline mr-2" />
              Create Free Account
            </button>

            <!-- Free User CTA -->
            <button
              v-else-if="isFree"
              @click="handleUpgrade"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg transform hover:scale-105"
            >
              <Icon name="heroicons:star" class="w-5 h-5 inline mr-2" />
              Upgrade to Premium - $19/month
            </button>

            <!-- Premium User Message -->
            <div v-else class="bg-green-50 border border-green-200 rounded-xl p-4">
              <p class="text-sm text-green-800 font-medium">
                ✨ These features are coming soon for Premium members!
              </p>
            </div>

            <p class="text-xs text-slate-500 mt-3">
              {{ ctaFooter }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import PremiumBadge from '~/components/atoms/PremiumBadge.vue';

const emit = defineEmits<{
  'show-signup': []
}>();

// Props to allow customization
const props = withDefaults(defineProps<{
  requiredTier?: 'free' | 'premium' | 'pro';
  featureName?: string;
}>(), {
  requiredTier: 'premium',
  featureName: 'Personalized Action Plans'
});

// Get auth and billing state
const { isAuthenticated } = useAuth();
const { isPremium, isFree, subscription, createCheckoutSession } = useBilling();

// Computed properties for extensible tier checking
const userTier = computed(() => {
  if (!isAuthenticated.value) return 'anonymous';
  return subscription.value?.tier || 'free';
});

const hasAccess = computed(() => {
  const tierHierarchy = { anonymous: 0, free: 1, premium: 2, pro: 3 };
  const userLevel = tierHierarchy[userTier.value as keyof typeof tierHierarchy] || 0;
  const requiredLevel = tierHierarchy[props.requiredTier] || 2;
  return userLevel >= requiredLevel;
});

// Dynamic messaging based on user state
const headerMessage = computed(() => {
  if (!isAuthenticated.value) {
    return 'Sign up free to unlock premium features';
  } else if (isFree.value) {
    return `Upgrade to ${props.requiredTier} to unlock these features`;
  } else if (isPremium.value) {
    return 'Premium features coming soon';
  }
  return 'Advanced features for your tier';
});

const ctaIcon = computed(() => {
  if (!isAuthenticated.value) return 'heroicons:user-plus';
  if (isFree.value) return 'heroicons:star';
  return 'heroicons:clock';
});

const ctaTitle = computed(() => {
  if (!isAuthenticated.value) return 'Create Free Account';
  if (isFree.value) return 'Upgrade to Premium';
  return 'Coming Soon';
});

const ctaDescription = computed(() => {
  if (!isAuthenticated.value) {
    return 'Sign up for free to save your results and get notified when premium features launch:';
  } else if (isFree.value) {
    return `Unlock ${props.featureName} and advanced analytics for just $19/month:`;
  }
  return 'These premium features are being developed and will be available soon:';
});

const ctaFooter = computed(() => {
  if (!isAuthenticated.value) {
    return 'Free account • No credit card required • Save your results now';
  } else if (isFree.value) {
    return '30-day money-back guarantee • Cancel anytime';
  }
  return 'You\'ll be notified when these features are ready';
});

// Handle upgrade for authenticated free users
const handleUpgrade = async () => {
  const success = await createCheckoutSession(
    `${window.location.origin}/billing/success`,
    `${window.location.origin}${window.location.pathname}`
  );

  if (!success) {
    // Fallback to pricing page if checkout fails
    navigateTo('/pricing');
  }
};
</script>
