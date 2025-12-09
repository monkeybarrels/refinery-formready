<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navigation />

    <div class="max-w-6xl mx-auto px-4 py-16">
      <!-- Hero Section -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center mb-6">
          <Logo size="xl" :show-text="false" />
        </div>

        <!-- Main Headline - Clear & Benefit-Focused -->
        <h1 class="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          See How Much Money<br/>
          <span class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">You're Leaving on the Table</span>
        </h1>

        <!-- Value Prop -->
        <p class="text-xl md:text-2xl text-slate-700 mb-4 font-medium max-w-4xl mx-auto leading-relaxed">
          Upload your VA decision letter. Instantly see your denied conditions' dollar value and get a clear path to appeal. No signup required.
        </p>

        <!-- Social Proof Banner -->
        <div class="inline-flex items-center bg-blue-50 border border-blue-200 rounded-full px-6 py-3 mb-8">
          <svg class="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="font-semibold text-blue-900">Veteran-Built • Bank-Level Security • 100% Free Tier</span>
        </div>

        <!-- Supporting Copy -->
        <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
          Our free calculator shows exactly how much your denied conditions could be worth monthly—using the official 2026 VA rates. Get your personalized analysis in 90 seconds.
        </p>

        <!-- Primary CTA -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <NuxtLink
            to="/try-it"
            class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Icon name="heroicons:calculator" class="w-5 h-5 mr-2" />
            Calculate My Benefits Free
          </NuxtLink>
          <button
            @click="scrollToHowItWorks"
            class="text-slate-600 font-medium hover:text-blue-700 transition-colors"
          >
            See How It Works →
          </button>
        </div>

        <!-- Supporting Text -->
        <p class="text-sm text-slate-500">
          No signup required • Takes 90 seconds • 2026 VA rates included
        </p>
      </div>

      <!-- Trust Indicators -->
      <div class="mb-16 bg-white rounded-xl shadow-sm p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:lock-closed" class="w-6 h-6 text-blue-800" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Encrypted Storage</h3>
            <p class="text-xs text-gray-600">Your data is secure</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:trash" class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Delete Anytime</h3>
            <p class="text-xs text-gray-600">Full control of your data</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:eye-slash" class="w-6 h-6 text-purple-600" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Private Analysis</h3>
            <p class="text-xs text-gray-600">Never shared or sold</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-sm font-semibold text-gray-900 mb-1">Always Free Tier</h3>
            <p class="text-xs text-gray-600">No hidden costs</p>
          </div>
        </div>
      </div>

      <!-- Money Left on Table Calculator -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-200">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">
            Free VA Benefits Calculator
          </h2>
          <p class="text-lg text-gray-600">
            See exactly how much money your denied conditions could be worth
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl p-6 text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:document-arrow-up" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Upload Letter</h3>
            <p class="text-sm text-gray-600">Drop your VA decision letter PDF</p>
          </div>
          <div class="bg-white rounded-xl p-6 text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:calculator" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">See Dollar Value</h3>
            <p class="text-sm text-gray-600">Calculate your denied conditions' worth</p>
          </div>
          <div class="bg-white rounded-xl p-6 text-center">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="heroicons:arrow-trending-up" class="w-6 h-6 text-blue-600" />
            </div>
            <h3 class="font-semibold text-gray-900 mb-2">Get Next Steps</h3>
            <p class="text-sm text-gray-600">Learn how to appeal and win</p>
          </div>
        </div>

        <!-- CTA -->
        <div class="text-center">
          <NuxtLink
            to="/try-it"
            class="inline-flex items-center justify-center px-10 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Icon name="heroicons:calculator" class="w-6 h-6 mr-2" />
            Calculate My Benefits Now
          </NuxtLink>
          <p class="mt-3 text-sm text-gray-600">
            No signup • Uses official 2026 VA rates • Results in 90 seconds
          </p>
        </div>
      </div>

      <!-- Company Platform Overview -->
      <div class="mt-16 bg-slate-50 rounded-2xl p-8">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Transforming Veteran Benefits Through Technology</h2>
          <p class="text-xl text-slate-700 mb-6 leading-relaxed">
            ClaimReady is more than a document analysis tool—it's a comprehensive platform designed to empower veterans throughout their benefits journey.
          </p>
          <div class="grid md:grid-cols-2 gap-8 text-left mb-8">
            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <Icon name="heroicons:users" class="w-5 h-5 text-blue-600" />
                </div>
                <h3 class="text-lg font-bold text-slate-900">Who We Serve</h3>
              </div>
              <p class="text-slate-600 leading-relaxed">
                We serve veterans nationwide who struggle to understand their VA communications, from newly separated service members navigating their first claims to experienced veterans managing complex appeals.
              </p>
            </div>
            <div class="bg-white rounded-lg p-6">
              <div class="flex items-center mb-4">
                <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <Icon name="heroicons:rocket-launch" class="w-5 h-5 text-green-600" />
                </div>
                <h3 class="text-lg font-bold text-slate-900">Our Mission</h3>
              </div>
              <p class="text-slate-600 leading-relaxed">
                Our platform democratizes access to benefits understanding, regardless of location or resources. We're building the definitive platform where veterans can confidently manage their benefits.
              </p>
            </div>
          </div>
          <div class="bg-white rounded-lg p-6 text-center">
            <h3 class="text-lg font-bold text-slate-900 mb-3">Why ClaimReady Matters</h3>
            <p class="text-slate-700 leading-relaxed">
              ClaimReady matters because veteran benefits are earned, not given. Every veteran deserves to understand what they've earned and how to access it fully. Our long-term vision extends beyond document analysis to create a complete veteran benefits ecosystem, including claims tracking, appeals guidance, and educational resources.
            </p>
          </div>
        </div>
      </div>

      <!-- Veteran Connection -->
      <div class="mt-16 bg-white border-2 border-blue-100 rounded-2xl p-8">
        <div class="max-w-4xl mx-auto text-center">
          <div class="flex items-center justify-center mb-6">
            <div class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-slate-900">Built by Veterans, For Veterans</h2>
          </div>
          <p class="text-xl text-slate-700 mb-4 leading-relaxed">
            We've been in your shoes—staring at confusing VA decision letters, wondering what went wrong and what to do next.
          </p>
          <p class="text-lg text-slate-600 mb-6 leading-relaxed">
            That's why we built ClaimReady. As veterans who've navigated the VA claims process ourselves, we created this tool to give you the clarity and confidence you deserve. Every veteran should understand their decision letter and know their next steps—without hiring expensive lawyers or waiting weeks for help.
          </p>
          <div class="grid md:grid-cols-3 gap-6 text-left">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h3 class="font-semibold text-slate-900">Veteran-Led</h3>
              </div>
              <p class="text-sm text-slate-600">Created by veterans who understand the VA system</p>
            </div>
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h3 class="font-semibold text-slate-900">Battle-Tested</h3>
              </div>
              <p class="text-sm text-slate-600">Proven to help veterans understand their decisions</p>
            </div>
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center mb-2">
                <svg class="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h3 class="font-semibold text-slate-900">Always Free</h3>
              </div>
              <p class="text-sm text-slate-600">No cost, no strings attached - just helping fellow veterans</p>
            </div>
          </div>
        </div>
      </div>

      <!-- How It Works -->
      <div id="how-it-works" class="mt-16">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">1. Upload Your Decision Letter</h3>
          <p class="text-gray-600">Simply drag and drop your VA decision letter PDF</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">2. Get Instant Analysis</h3>
          <p class="text-gray-600">AI extracts conditions, ratings, and denial reasons</p>
        </div>

        <div class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">3. Take Action</h3>
          <p class="text-gray-600">Get personalized next steps and evidence requirements</p>
        </div>
        </div>

        <!-- CTA After How It Works -->
        <div class="mt-12 text-center">
          <NuxtLink
            to="/try-it"
            class="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Icon name="heroicons:calculator" class="w-5 h-5 mr-2" />
            Calculate My Benefits Free
          </NuxtLink>
          <p class="mt-3 text-sm text-gray-600">
            No signup required • Uses 2026 VA rates
          </p>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="mt-16 bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-3">Frequently Asked Questions</h2>
          <p class="text-gray-600">Quick answers to common questions about ClaimReady</p>
        </div>

        <div class="max-w-3xl mx-auto space-y-4">
          <FaqItem
            question="What is ClaimReady?"
            answer="ClaimReady is an AI-powered platform that helps veterans analyze VA decision letters. We extract key information, identify denials and deferrals, and provide actionable insights in plain English—all in about 90 seconds."
          />
          <FaqItem
            question="Is my information secure?"
            answer="Yes. All documents are encrypted in transit and at rest. We use secure cloud infrastructure and industry-standard security practices. Only you can access your uploaded documents, and you can delete them anytime."
          />
          <FaqItem
            question="Do I need to create an account?"
            answer="No! You can analyze your decision letter anonymously without creating an account. If you want to save your analysis and track multiple documents, you can optionally create a free account."
          />
          <FaqItem
            question="Is this really free?"
            answer="Yes. Our core analysis tool is 100% free to use, with no hidden costs or credit card required. We offer optional premium features for power users, but the essential analysis is always free for veterans."
          />
          <FaqItem
            question="How long does analysis take?"
            answer="Most decision letters are analyzed in 60-90 seconds. You'll get instant extraction of conditions, ratings, denials, and personalized next steps."
          />
          <FaqItem
            question="Do you provide legal advice?"
            answer="No. ClaimReady is an analysis tool, not a law firm. We help you understand your decision letter, but you should consult with a qualified VA attorney or accredited representative for legal guidance on your specific case."
          />
        </div>

        <!-- Link to Full FAQ -->
        <div class="mt-8 text-center">
          <NuxtLink
            to="/faq"
            class="inline-flex items-center text-blue-800 hover:text-blue-900 font-medium"
          >
            View All FAQs
            <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-2" />
          </NuxtLink>
        </div>
      </div>

      <!-- Final CTA Before Footer -->
      <div class="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Ready to See What You're Owed?</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Calculate the value of your denied conditions in 90 seconds. No signup required.
        </p>
        <NuxtLink
          to="/try-it"
          class="inline-flex items-center justify-center px-10 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Icon name="heroicons:calculator" class="w-5 h-5 mr-2" />
          Calculate My Benefits Now
        </NuxtLink>
      </div>

      <!-- Footer Note -->
      <div class="mt-16 text-center">
        <div class="inline-flex items-center text-sm text-gray-600 bg-white rounded-full px-6 py-3 shadow-sm border">
          <svg class="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <span class="font-medium text-blue-600">Proudly serving our fellow veterans</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/components/organisms/Navigation.vue'
import FaqItem from '~/components/molecules/FaqItem.vue'
import Footer from '~/components/organisms/Footer.vue'
import { useAnalytics } from '~/composables/useAnalytics'

const { trackFunnel } = useAnalytics()
const route = useRoute()

// Track landing page views (for all users - landing page should be visible to everyone)
onMounted(() => {
  const source = route.query.utm_source as string | undefined
  const medium = route.query.utm_medium as string | undefined
  const campaign = route.query.utm_campaign as string | undefined

  trackFunnel.landingViewed(source, medium, campaign)
})

// Scroll to How It Works section
const scrollToHowItWorks = () => {
  const element = document.getElementById('how-it-works')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

useHead({
  title: 'ClaimReady - Turn Denials Into Approvals',
  meta: [
    { name: 'description', content: 'AI-powered VA decision letter analysis built by veterans. Understand denials, identify missing evidence, and get your next steps—in minutes, not weeks.' }
  ]
})
</script>
