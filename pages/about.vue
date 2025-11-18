<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <Navigation />

    <div class="max-w-4xl mx-auto px-4 py-16">
      <!-- Header Section -->
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-slate-900 mb-6 leading-tight">
          About <span class="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">ClaimReady</span>
        </h1>
        <p class="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
          Empowering Veterans Through AI-Powered VA Decision Analysis
        </p>
      </div>

      <!-- Mission Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="heroicons:flag" class="w-8 h-8 text-blue-600" />
          </div>
          <h2 class="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
        </div>

        <p class="text-lg text-slate-700 leading-relaxed mb-6">
          ClaimReady exists to ensure every veteran fully understands their VA benefits and can navigate the system with confidence. We leverage technology to translate complex bureaucratic processes into clear, actionable guidance, empowering veterans to secure the benefits they've earned through their service.
        </p>
      </div>

      <!-- Problem & Solution Section -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <!-- The Problem -->
        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600" />
            </div>
            <h3 class="text-2xl font-bold text-slate-900">The Problem We Solve</h3>
          </div>
          <p class="text-slate-700 leading-relaxed mb-4">
            VA decision letters are notoriously difficult to understand, leaving veterans confused about their ratings, next steps, and rights. This confusion often results in missed opportunities for appeals, inadequate compensation, and prolonged frustration with the benefits process.
          </p>
          <p class="text-slate-600 leading-relaxed">
            Veterans deserve better than bureaucratic language that obscures their earned benefits.
          </p>
        </div>

        <!-- Our Solution -->
        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <Icon name="heroicons:light-bulb" class="w-6 h-6 text-green-600" />
            </div>
            <h3 class="text-2xl font-bold text-slate-900">Our Solution</h3>
          </div>
          <p class="text-slate-700 leading-relaxed mb-4">
            ClaimReady uses advanced AI to analyze VA decision letters, providing clear explanations of ratings, timelines, and actionable next steps. We translate bureaucratic language into plain English, helping veterans make informed decisions about their benefits.
          </p>
          <p class="text-slate-600 leading-relaxed">
            Clear understanding leads to confident action and better outcomes.
          </p>
        </div>
      </div>

      <!-- Why We Exist Section -->
      <div class="bg-blue-50 rounded-2xl p-8 mb-12">
        <div class="max-w-3xl mx-auto text-center">
          <div class="flex items-center justify-center mb-6">
            <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Icon name="heroicons:heart" class="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 class="text-3xl font-bold text-slate-900 mb-6">Why We Exist</h2>
          <p class="text-lg text-slate-700 leading-relaxed">
            Founded by a veteran who experienced the frustration of incomprehensible VA communications, ClaimReady was born from a simple belief: veterans shouldn't need a law degree to understand their own benefits. We exist to eliminate the confusion, reduce the stress, and restore confidence in a system designed to serve those who served our country.
          </p>
        </div>
      </div>

      <!-- Company Values -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <h2 class="text-3xl font-bold text-slate-900 text-center mb-8">Our Values</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:shield-check" class="w-8 h-8 text-blue-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Transparency</h3>
            <p class="text-slate-600">
              Clear communication about how our tools work, what they can and cannot do, and how your data is protected.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:academic-cap" class="w-8 h-8 text-green-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Accuracy</h3>
            <p class="text-slate-600">
              Precise analysis and reliable guidance built on proven AI technology and veteran knowledge.
            </p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="heroicons:users" class="w-8 h-8 text-purple-600" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">Veteran Empowerment</h3>
            <p class="text-slate-600">
              Every decision we make prioritizes veteran success and independence in navigating their benefits.
            </p>
          </div>
        </div>
      </div>

      <!-- Team Section -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-12">
        <h2 class="text-3xl font-bold text-slate-900 text-center mb-8">Meet Our Team</h2>

        <div class="max-w-2xl mx-auto">
          <div class="bg-blue-50 rounded-xl p-6">
            <div class="flex items-center mb-4">
              <div class="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                <Icon name="heroicons:user" class="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-900">Jim Livingston</h3>
                <p class="text-slate-600 font-medium">Founder & CEO</p>
              </div>
            </div>
            <p class="text-slate-700 leading-relaxed">
              U.S. military veteran and software engineer with 10 years of experience in fintech and prior experience in GIS technology. Jim founded ClaimReady after experiencing the complexity of VA benefits firsthand, driving his mission to simplify the process for all veterans.
            </p>
          </div>
        </div>
      </div>

      <!-- About MonkeyBarrels LLC -->
      <div class="bg-white rounded-2xl shadow-sm p-8 mb-12">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mr-4">
            <Icon name="heroicons:building-office" class="w-6 h-6 text-slate-600" />
          </div>
          <h3 class="text-2xl font-bold text-slate-900">About MonkeyBarrels LLC</h3>
        </div>
        <p class="text-slate-700 leading-relaxed mb-4">
          ClaimReady is proudly developed and maintained by MonkeyBarrels LLC, a veteran-owned technology company based in Columbia, South Carolina. Our focus is building tools that serve those who served.
        </p>
        <p class="text-slate-600 leading-relaxed">
          As a veteran-founded company, we understand the challenges firsthand and are committed to solving them through innovative technology solutions.
        </p>
      </div>

      <!-- Platform Vision -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
        <h2 class="text-3xl font-bold mb-4">Our Vision for the Future</h2>
        <p class="text-xl text-blue-100 mb-6 max-w-3xl mx-auto leading-relaxed">
          ClaimReady is more than a document analysis tool—it's a comprehensive platform designed to empower veterans throughout their benefits journey. Our AI-powered system analyzes VA decision letters, explains complex ratings, and provides actionable guidance for next steps.
        </p>
        <p class="text-lg text-blue-100 mb-6 max-w-2xl mx-auto leading-relaxed">
          We serve veterans nationwide who struggle to understand their VA communications, from newly separated service members navigating their first claims to experienced veterans managing complex appeals. Our platform democratizes access to benefits understanding, regardless of location or resources.
        </p>
        <p class="text-blue-100 leading-relaxed">
          Our long-term vision extends beyond document analysis to create a complete veteran benefits ecosystem, including claims tracking, appeals guidance, and educational resources. We're building the definitive platform where veterans can confidently manage their benefits with clarity and control.
        </p>
      </div>

      <!-- CTA Section -->
      <div class="mt-12 text-center">
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h3>
        <p class="text-lg text-slate-600 mb-8">
          Join thousands of veterans who trust ClaimReady to understand their VA decisions.
        </p>
        <NuxtLink
          to="/analyze"
          class="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Icon name="heroicons:arrow-right" class="w-5 h-5 mr-2" />
          Analyze Your Decision Letter
        </NuxtLink>
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
  title: 'About ClaimReady - Veteran-Built VA Decision Analysis',
  meta: [
    { name: 'description', content: 'Learn about ClaimReady, a veteran-built platform that transforms how veterans understand their VA disability decisions. Built by MonkeyBarrels LLC to empower veterans through AI-powered analysis.' }
  ]
})
</script>