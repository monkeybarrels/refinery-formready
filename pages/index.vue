<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-6xl mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold text-gray-900 mb-4">
          FormReady
        </h1>
        <p class="text-2xl text-gray-600 mb-8">
          VA Claims Made Simple
        </p>
        <p class="text-lg text-gray-500 max-w-2xl mx-auto">
          Upload your VA decision letter for instant analysis, understand your claim decisions, and get personalized next steps to strengthen your case.
        </p>
      </div>

      <!-- Available Tools -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-3xl font-semibold text-gray-900 mb-6">
          VA Decision Analysis
        </h2>

        <div class="grid gap-6 md:grid-cols-1">
          <!-- Decision Analysis Card -->
          <NuxtLink
            to="/analyze-decision"
            class="group block p-8 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600">
                  📄 VA Decision Letter Analysis
                </h3>
                <p class="text-gray-600 mb-4 text-lg">
                  Upload your VA decision letter and get comprehensive analysis with personalized next steps
                </p>
                <div class="grid md:grid-cols-3 gap-4 mb-4">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Extract conditions & ratings
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Understand denial reasons
                  </div>
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Get next steps guidance
                  </div>
                </div>
                <div class="flex items-center text-sm text-gray-500">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ~1 minute • Free to use
                </div>
              </div>
              <div class="text-indigo-600 group-hover:translate-x-1 transition-transform ml-4">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- How It Works -->
      <div class="mt-16 grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">1. Upload Your Decision Letter</h3>
          <p class="text-gray-600">Simply drag and drop your VA decision letter PDF</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">2. Get Instant Analysis</h3>
          <p class="text-gray-600">AI extracts conditions, ratings, and denial reasons</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">3. Take Action</h3>
          <p class="text-gray-600">Get personalized next steps and evidence requirements</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'FormReady - VA Claims Made Simple',
  meta: [
    { name: 'description', content: 'Upload your VA decision letter for instant analysis. Understand your claim decisions and get personalized next steps to strengthen your case.' }
  ]
})
</script>
