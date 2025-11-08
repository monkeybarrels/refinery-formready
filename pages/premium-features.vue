<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <Navigation
      :show-new-analysis="true"
      :show-dashboard="true"
      :show-user-menu="true"
    />

    <!-- Premium Gate -->
    <PremiumFeature
      feature-name="Premium Features"
      description="Unlock advanced tools and insights to maximize your VA benefits claim success."
    >
      <!-- Premium Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
            <Icon name="heroicons:star" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Premium Features
          </h1>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Access advanced tools and personalized insights to maximize your VA benefits claim success.
          </p>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <!-- Feature 1: Personalized Action Plans -->
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="heroicons:clipboard-document-check" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Personalized Action Plans</h3>
            <p class="text-slate-600 mb-4">
              Get customized recommendations based on your specific decision letter. We analyze your denials and provide step-by-step guidance.
            </p>
            <div class="flex items-center text-sm text-blue-600">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              <span>Available Now</span>
            </div>
          </div>

          <!-- Feature 2: Evidence Recommendations -->
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="heroicons:document-magnifying-glass" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Evidence Recommendations</h3>
            <p class="text-slate-600 mb-4">
              Receive specific guidance on what evidence to gather, where to find it, and how to submit it effectively.
            </p>
            <div class="flex items-center text-sm text-green-600">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              <span>Available Now</span>
            </div>
          </div>

          <!-- Feature 3: Appeal Timeline Tracking -->
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="heroicons:calendar-days" class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Appeal Timeline Tracking</h3>
            <p class="text-slate-600 mb-4">
              Track important deadlines, submission dates, and follow-up requirements for all your claims and appeals.
            </p>
            <div class="flex items-center text-sm text-purple-600">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              <span>Coming Soon</span>
            </div>
          </div>

          <!-- Feature 4: Advanced Form Generation -->
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="heroicons:document-duplicate" class="w-6 h-6 text-orange-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Advanced Form Generation</h3>
            <p class="text-slate-600 mb-4">
              Automatically generate VA forms (21-526EZ, 21-4138, 21-0995) pre-filled with your information.
            </p>
            <div class="flex items-center text-sm text-orange-600">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              <span>Coming Soon</span>
            </div>
          </div>

          <!-- Feature 5: Multi-Claim Analytics -->
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="heroicons:chart-bar-square" class="w-6 h-6 text-indigo-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Multi-Claim Analytics</h3>
            <p class="text-slate-600 mb-4">
              View comprehensive analytics across all your claims, track success rates, and identify patterns.
            </p>
            <div class="flex items-center text-sm text-indigo-600">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              <span>Available Now</span>
            </div>
          </div>

          <!-- Feature 6: Priority Support -->
          <div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div class="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Icon name="heroicons:chat-bubble-left-right" class="w-6 h-6 text-pink-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Priority Support</h3>
            <p class="text-slate-600 mb-4">
              Get faster response times and dedicated support for your questions about claims and appeals.
            </p>
            <div class="flex items-center text-sm text-pink-600">
              <Icon name="heroicons:check-circle" class="w-5 h-5 mr-2" />
              <span>Available Now</span>
            </div>
          </div>
        </div>

        <!-- Usage Stats Section -->
        <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-12">
          <h2 class="text-2xl font-bold mb-6 text-center">Your Premium Usage</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">{{ stats.totalAnalyses }}</div>
              <div class="text-blue-100">Analyses Completed</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">{{ stats.actionItems }}</div>
              <div class="text-blue-100">Action Items Generated</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold mb-2">{{ stats.formsGenerated }}</div>
              <div class="text-blue-100">Forms Generated</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            to="/dashboard"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  View Dashboard
                </h3>
                <p class="text-slate-600">
                  See all your analyses and premium features in one place
                </p>
              </div>
              <Icon name="heroicons:arrow-right" class="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </NuxtLink>

          <NuxtLink
            to="/analyze"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow group"
          >
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  New Analysis
                </h3>
                <p class="text-slate-600">
                  Upload a decision letter to get personalized recommendations
                </p>
              </div>
              <Icon name="heroicons:arrow-right" class="w-6 h-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </NuxtLink>
        </div>
      </div>
    </PremiumFeature>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/components/organisms/Navigation.vue'
import Footer from '~/components/organisms/Footer.vue'
import PremiumFeature from '~/components/organisms/PremiumFeature.vue'

// Protect this page with premium middleware
definePageMeta({
  middleware: 'premium'
})

// Set page metadata
useHead({
  title: 'Premium Features - Refinery',
  meta: [
    {
      name: 'description',
      content: 'Access advanced VA benefits analysis tools and personalized recommendations with Refinery Premium.'
    }
  ]
})

// Mock stats - replace with real data from API
const stats = ref({
  totalAnalyses: 0,
  actionItems: 0,
  formsGenerated: 0
})

// Fetch premium stats
onMounted(async () => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall('/api/documents/analytics')
    
    if (response.ok) {
      const data = await response.json()
      stats.value = {
        totalAnalyses: data.totalAnalyses || 0,
        actionItems: data.totalActionItems || 0,
        formsGenerated: data.totalFormsGenerated || 0
      }
    }
  } catch (error) {
    console.error('Failed to load premium stats:', error)
  }
})
</script>

