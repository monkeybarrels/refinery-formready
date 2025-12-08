<template>
  <div class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border-2 border-blue-200 p-8">
    <!-- Icon and Badge -->
    <div class="flex items-start justify-between mb-6">
      <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
        <Icon name="heroicons:rocket-launch" class="w-8 h-8 text-white" />
      </div>
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs px-3 py-1 rounded-full">
        FREE
      </div>
    </div>

    <!-- Headline -->
    <h2 class="text-3xl font-bold text-slate-900 mb-3">
      Get Your Complete VA Profile
    </h2>
    <p class="text-slate-600 mb-6">
      Install our Chrome extension to unlock your full disability rating, track all your conditions, and monitor changes automatically.
    </p>

    <!-- Benefits List -->
    <div class="space-y-3 mb-8">
      <div class="flex items-start">
        <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-semibold text-slate-900">See your current disability rating</div>
          <div class="text-sm text-slate-600">Real-time sync from VA.gov</div>
        </div>
      </div>
      <div class="flex items-start">
        <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-semibold text-slate-900">Track all service-connected conditions</div>
          <div class="text-sm text-slate-600">Complete breakdown with percentages</div>
        </div>
      </div>
      <div class="flex items-start">
        <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-semibold text-slate-900">Monitor rating changes automatically</div>
          <div class="text-sm text-slate-600">Get notified when your rating updates</div>
        </div>
      </div>
      <div class="flex items-start">
        <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <div class="font-semibold text-slate-900">Access historical rating timeline</div>
          <div class="text-sm text-slate-600">See how your rating has changed over time</div>
        </div>
      </div>
    </div>

    <!-- CTA Buttons -->
    <div class="flex flex-col sm:flex-row gap-3">
      <Button
        @click="handleInstallClick"
        variant="primary"
        class="flex-1 py-3 text-base font-semibold"
      >
        <Icon name="heroicons:arrow-down-tray" class="w-5 h-5 mr-2" />
        Install Chrome Extension
      </Button>
      <Button
        @click="showLearnMore = true"
        variant="secondary"
        class="flex-1 py-3 text-base"
      >
        Learn More
      </Button>
    </div>

    <!-- Learn More Modal -->
    <Modal 
      :is-open="showLearnMore" 
      @update:is-open="showLearnMore = $event"
      title="Chrome Extension Setup"
      :show-footer="false"
      size="lg"
    >
      <div class="space-y-4">
        <p class="text-slate-700">
          Our Chrome extension securely syncs your VA disability rating and conditions directly from VA.gov. 
          Your data is encrypted and only accessible by you.
        </p>
        
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="font-semibold text-blue-900 mb-2">How it works:</h4>
          <ol class="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Install the extension from Chrome Web Store</li>
            <li>Sign in to VA.gov (you'll need your credentials)</li>
            <li>Click the extension icon to sync your data</li>
            <li>Your complete VA profile appears in ClaimReady</li>
          </ol>
        </div>

        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="font-semibold text-green-900 mb-2">Privacy & Security:</h4>
          <ul class="list-disc list-inside space-y-1 text-sm text-green-800">
            <li>We never store your VA.gov password</li>
            <li>All data is encrypted in transit and at rest</li>
            <li>You control when to sync</li>
            <li>Uninstall anytime - your data stays private</li>
          </ul>
        </div>

        <Button
          @click="handleInstallClick"
          variant="primary"
          class="w-full py-3"
        >
          Install Now
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Button from '~/components/atoms/Button.vue'
import Modal from '~/components/molecules/Modal.vue'

const showLearnMore = ref(false)

// Chrome Web Store URL with actual extension ID
const CHROME_EXTENSION_URL = 'https://chrome.google.com/webstore/detail/claimready-va-sync/inlacincoinmnhoonohkdlhpkibjgnfh'

const handleInstallClick = () => {
  // SSR-safe: Only run on client side
  if (import.meta.client) {
    // Track analytics event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'extension_install_click', {
        event_category: 'engagement',
        event_label: 'dashboard_cta'
      })
    }

    // Open Chrome Web Store in new tab
    window.open(CHROME_EXTENSION_URL, '_blank')
  }
}
</script>
