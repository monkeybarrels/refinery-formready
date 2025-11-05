<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navigation />

    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p class="text-gray-600">Last updated: {{ lastUpdated }}</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Agreement to Terms</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              By accessing or using ClaimReady ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
            </p>
            <p class="text-gray-700 leading-relaxed">
              These Terms constitute a legally binding agreement between you and ClaimReady. Please read them carefully.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Description of Service</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              ClaimReady provides AI-powered analysis of VA decision letters to help veterans and their representatives:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Extract and organize information from VA decision letters</li>
              <li>Identify key issues, denials, and deferrals</li>
              <li>Generate insights and recommendations for appeals</li>
              <li>Manage and track multiple claims</li>
            </ul>
            <p class="text-gray-700 leading-relaxed mt-4">
              <strong class="text-gray-900">Important Disclaimer:</strong> ClaimReady is a tool to assist in the analysis process. It does not provide legal advice, and should not be used as a substitute for professional legal counsel or representation.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">User Accounts</h2>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Account Creation</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Account Termination</h3>
            <p class="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion, including for violation of these Terms, suspected fraud, or other harmful activities.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree NOT to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights of others</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Use the Service for fraudulent purposes</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Resell or redistribute the Service without authorization</li>
              <li>Use automated tools to scrape or collect data</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">User Content</h2>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Ownership</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              You retain all rights to the documents and content you upload to the Service ("User Content"). By uploading User Content, you grant ClaimReady a limited, non-exclusive license to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Process and analyze your documents</li>
              <li>Store your documents securely</li>
              <li>Generate insights and recommendations</li>
              <li>Improve our AI models using anonymized data</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Responsibility</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              You are solely responsible for the User Content you upload. You represent and warrant that:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>You own or have the right to upload the content</li>
              <li>The content does not violate any laws or third-party rights</li>
              <li>The content does not contain malicious code or viruses</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              The Service, including its software, design, text, graphics, and other content (excluding User Content), is owned by ClaimReady and protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p class="text-gray-700 leading-relaxed">
              You may not copy, modify, distribute, sell, or lease any part of our Service without our express written permission.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Payment Terms</h2>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Subscription Plans</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              Access to certain features requires a paid subscription. By subscribing, you agree to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Pay all fees associated with your selected plan</li>
              <li>Automatic renewal unless cancelled before the renewal date</li>
              <li>Pricing changes with 30 days' notice</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Refunds</h3>
            <p class="text-gray-700 leading-relaxed">
              Refunds are provided at our discretion. Contact <a href="mailto:support@claimready.io" class="text-blue-600 hover:text-blue-800">support@claimready.io</a> for refund requests.
            </p>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Free Trial</h3>
            <p class="text-gray-700 leading-relaxed">
              We may offer free trials for certain plans. You may cancel before the trial ends to avoid charges. If not cancelled, your payment method will be charged automatically.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Disclaimers and Limitations</h2>

            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p class="text-sm text-yellow-800">
                <strong>IMPORTANT LEGAL DISCLAIMER</strong>
              </p>
            </div>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">No Legal Advice</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              ClaimReady is NOT a law firm and does NOT provide legal advice. The Service provides informational analysis only. You should consult with a qualified attorney or accredited VA representative for legal advice regarding your specific situation.
            </p>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Service "As Is"</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Accuracy, reliability, or completeness of analysis</li>
              <li>Uninterrupted or error-free operation</li>
              <li>Fitness for a particular purpose</li>
              <li>Non-infringement of third-party rights</li>
            </ul>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">AI Limitations</h3>
            <p class="text-gray-700 leading-relaxed">
              Our AI-powered analysis may contain errors or inaccuracies. You acknowledge that AI technology has limitations and should not be solely relied upon for making legal decisions. Always verify information and consult with qualified professionals.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLAIMREADY SHALL NOT BE LIABLE FOR:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Errors or inaccuracies in the analysis provided</li>
              <li>Decisions made based on information from the Service</li>
              <li>Unauthorized access to your account or data</li>
            </ul>
            <p class="text-gray-700 leading-relaxed mt-4">
              Our total liability shall not exceed the amount you paid for the Service in the 12 months preceding the claim.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Indemnification</h2>
            <p class="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless ClaimReady from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Service, violation of these Terms, or violation of any rights of another party.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Privacy</h2>
            <p class="text-gray-700 leading-relaxed">
              Your use of the Service is also governed by our <NuxtLink to="/privacy-policy" class="text-blue-600 hover:text-blue-800">Privacy Policy</NuxtLink>. Please review it to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Modifications to Terms</h2>
            <p class="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify you of material changes by email or through the Service. Your continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
            <p class="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of applicable jurisdiction.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Severability</h2>
            <p class="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700"><strong>Email:</strong> <a href="mailto:legal@claimready.io" class="text-blue-600 hover:text-blue-800">legal@claimready.io</a></p>
              <p class="text-gray-700"><strong>Support:</strong> <a href="mailto:support@claimready.io" class="text-blue-600 hover:text-blue-800">support@claimready.io</a></p>
            </div>
          </section>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/components/organisms/Navigation.vue'
import Footer from '~/components/organisms/Footer.vue'

const lastUpdated = 'November 5, 2025'

useSeoMeta({
  title: 'Terms of Service - ClaimReady',
  description: 'Read the terms and conditions for using ClaimReady\'s VA decision letter analysis service.',
})
</script>
