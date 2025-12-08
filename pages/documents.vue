<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Premium Gate -->
    <PremiumFeature
      feature-name="Document Management"
      description="Access and manage all your VA decision letter analyses in one place."
    >
      <!-- Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <!-- Breadcrumbs -->
          <div class="mb-4">
            <Breadcrumb />
          </div>

          <div>
            <h1 class="text-3xl font-bold text-slate-900 mb-2">Your Documents</h1>
            <p class="text-lg text-slate-600">Coming soon...</p>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <Icon name="heroicons:document-text" class="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 class="text-2xl font-semibold text-slate-900 mb-2">Documents Page</h2>
          <p class="text-slate-600">This page will be populated as needed.</p>
      </div>
      </div>
    </PremiumFeature>
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/components/organisms/Navigation.vue'
import PremiumFeature from '~/components/organisms/PremiumFeature.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'

useHead({
  title: 'Your Documents - ClaimReady',
  meta: [
    { name: 'description', content: 'Access and manage all your VA decision letter analyses' }
  ]
})

// Protect this page with premium middleware
definePageMeta({
  middleware: 'premium'
})
</script>
