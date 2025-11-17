<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navigation />

    <div class="max-w-5xl mx-auto px-4 py-16">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Product <span class="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Roadmap</span>
        </h1>
        <p class="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
          Building the future of veteran benefits understanding—one feature at a time
        </p>
      </div>

      <!-- Current Features -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-600" />
          </div>
          <h2 class="text-3xl font-bold text-slate-900">Currently Available</h2>
        </div>

        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center mb-3">
              <Icon name="heroicons:document-text" class="w-6 h-6 text-green-600 mr-3" />
              <h3 class="text-lg font-bold text-slate-900">VA Decision Letter Analysis</h3>
            </div>
            <p class="text-slate-600 leading-relaxed">
              AI-powered analysis of VA decision letters with condition extraction, rating explanations, and denial reason identification.
            </p>
          </div>

          <div class="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
            <div class="flex items-center mb-3">
              <Icon name="heroicons:light-bulb" class="w-6 h-6 text-green-600 mr-3" />
              <h3 class="text-lg font-bold text-slate-900">Plain English Explanations</h3>
            </div>
            <p class="text-slate-600 leading-relaxed">
              Complex VA language translated into clear, actionable guidance that veterans can understand and act upon.
            </p>
          </div>
        </div>
      </div>

      <!-- Coming Soon Features -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div class="flex items-center mb-8">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
            <Icon name="heroicons:rocket-launch" class="w-6 h-6 text-blue-600" />
          </div>
          <h2 class="text-3xl font-bold text-slate-900">Coming Soon</h2>
        </div>

        <div class="space-y-8">
          <!-- Chrome Extension -->
          <div class="border-l-4 border-blue-500 bg-blue-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:puzzle-piece" class="w-6 h-6 text-blue-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">Chrome Extension for VA.gov Integration</h3>
              </div>
              <span class="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Q1 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              Browser extension that seamlessly syncs your VA.gov claim data directly into ClaimReady for comprehensive tracking and analysis.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">One-click sync</span>
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Automatic updates</span>
              <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Secure integration</span>
            </div>
          </div>

          <!-- VA.gov Data Integration -->
          <div class="border-l-4 border-purple-500 bg-purple-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:link" class="w-6 h-6 text-purple-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">VA.gov Claims Data Integration</h3>
              </div>
              <span class="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Q1 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              Full integration with VA systems to automatically import your claims history and status updates in real-time.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Real-time sync</span>
              <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Complete history</span>
              <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">Status tracking</span>
            </div>
          </div>

          <!-- Decision History Timeline -->
          <div class="border-l-4 border-amber-500 bg-amber-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:clock" class="w-6 h-6 text-amber-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">Decision History Timeline</h3>
              </div>
              <span class="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">Q2 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              Visual timeline of all your VA decisions, ratings changes, and important dates in one clear, chronological view.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">Visual timeline</span>
              <span class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">Key milestones</span>
              <span class="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs">Rating changes</span>
            </div>
          </div>

          <!-- Appeals Analysis -->
          <div class="border-l-4 border-red-500 bg-red-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:scale" class="w-6 h-6 text-red-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">Appeals Analysis & Guidance</h3>
              </div>
              <span class="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium">Q2 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              AI-powered analysis of appeal options with step-by-step guidance through the complex appeals process.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Appeals options</span>
              <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Step-by-step guide</span>
              <span class="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">Timeline tracking</span>
            </div>
          </div>

          <!-- Document Management -->
          <div class="border-l-4 border-green-500 bg-green-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:folder" class="w-6 h-6 text-green-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">Document Management Hub</h3>
              </div>
              <span class="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Q3 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              Secure storage and organization of all your VA documents, medical records, and correspondence in one accessible location.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Secure storage</span>
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Smart organization</span>
              <span class="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Quick search</span>
            </div>
          </div>

          <!-- Community & Education -->
          <div class="border-l-4 border-indigo-500 bg-indigo-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:academic-cap" class="w-6 h-6 text-indigo-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">Veteran Community & Education</h3>
              </div>
              <span class="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Q3 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              Access to educational resources, community discussions, and expert guidance on benefits topics from fellow veterans.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">Learning resources</span>
              <span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">Peer support</span>
              <span class="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">Expert guidance</span>
            </div>
          </div>

          <!-- Personalized Insights -->
          <div class="border-l-4 border-cyan-500 bg-cyan-50 rounded-lg p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <Icon name="heroicons:chart-bar" class="w-6 h-6 text-cyan-600 mr-3" />
                <h3 class="text-xl font-bold text-slate-900">Personalized Claim Insights</h3>
              </div>
              <span class="bg-cyan-200 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">Q4 2025</span>
            </div>
            <p class="text-slate-700 mb-3">
              Customized recommendations and insights based on your specific claim history, profile, and similar veteran experiences.
            </p>
            <div class="flex flex-wrap gap-2">
              <span class="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs">Custom insights</span>
              <span class="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs">Smart recommendations</span>
              <span class="bg-cyan-100 text-cyan-700 px-2 py-1 rounded text-xs">Data-driven</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Vision Statement -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Our Long-Term Vision</h2>
        <p class="text-xl text-blue-100 mb-6 max-w-4xl mx-auto leading-relaxed">
          We're building more than tools—we're creating a complete ecosystem where veterans can confidently navigate their benefits journey with clarity, community support, and cutting-edge technology.
        </p>
        <p class="text-blue-100 leading-relaxed max-w-3xl mx-auto">
          Every feature we build serves one purpose: empowering veterans to understand and access the benefits they've earned through their service to our country.
        </p>
      </div>

      <!-- CTA Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started Today?</h3>
        <p class="text-lg text-slate-600 mb-8">
          While we're building these amazing features, you can start analyzing your VA decision letters right now.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/analyze"
            class="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Icon name="heroicons:arrow-right" class="w-5 h-5 mr-2" />
            Analyze Your Decision Letter
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-slate-600 font-medium hover:text-blue-700 transition-colors"
          >
            Learn More About ClaimReady →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/components/organisms/Navigation.vue'
import Footer from '~/components/organisms/Footer.vue'

useHead({
  title: 'Product Roadmap - ClaimReady Feature Development',
  meta: [
    { name: 'description', content: 'Explore ClaimReady\'s product roadmap including Chrome extension, VA.gov integration, appeals analysis, and more features designed to empower veterans.' }
  ]
})
</script>