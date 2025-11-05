<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navigation />

    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="mb-8 text-center">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p class="text-xl text-gray-600">Find answers to common questions about ClaimReady</p>
        </div>

        <!-- Support Contact Banner -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div class="flex items-start">
            <Icon name="heroicons:information-circle" class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 class="font-semibold text-blue-900 mb-2">Need More Help?</h3>
              <p class="text-blue-800 mb-3">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="mailto:support@claimready.io"
                class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
                Contact Support: support@claimready.io
              </a>
            </div>
          </div>
        </div>

        <!-- FAQ Sections -->
        <div class="space-y-6">
          <!-- Getting Started -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icon name="heroicons:rocket-launch" class="w-6 h-6 mr-2 text-blue-600" />
              Getting Started
            </h2>
            <div class="space-y-4">
              <FaqItem
                question="What is ClaimReady?"
                answer="ClaimReady is an AI-powered platform that helps veterans and their representatives analyze VA decision letters. We extract key information, identify denials and deferrals, and provide actionable insights to support the appeals process."
              />
              <FaqItem
                question="How do I get started?"
                answer="Simply sign up for a free account, upload your VA decision letter (PDF format), and our AI will analyze the document within seconds. You can then view extracted information, identified issues, and recommended next steps."
              />
              <FaqItem
                question="Do I need to install any software?"
                answer="No installation required! ClaimReady is a web-based application that works in your browser. Just visit our website and create an account to get started."
              />
              <FaqItem
                question="What types of documents can I upload?"
                answer="Currently, ClaimReady supports VA decision letters in PDF format. We're working on expanding support for additional document types in the future."
              />
            </div>
          </section>

          <!-- Features & Functionality -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icon name="heroicons:sparkles" class="w-6 h-6 mr-2 text-blue-600" />
              Features & Functionality
            </h2>
            <div class="space-y-4">
              <FaqItem
                question="How accurate is the AI analysis?"
                answer="Our AI is trained on thousands of VA decision letters and provides highly accurate extraction of key information. However, AI technology has limitations. We recommend always reviewing the analysis and consulting with a qualified VA representative or attorney for your specific case."
              />
              <FaqItem
                question="What information does ClaimReady extract?"
                answer="ClaimReady extracts: veteran information, service connection decisions (granted/denied/deferred), disability ratings, effective dates, evidence considered, reasons for denials, and appeal rights. We also identify patterns and provide recommendations for next steps."
              />
              <FaqItem
                question="Can I analyze multiple decision letters?"
                answer="Yes! You can upload and analyze multiple decision letters. Our dashboard helps you track and manage all your documents in one place."
              />
              <FaqItem
                question="How long does analysis take?"
                answer="Most decision letters are analyzed within 5-30 seconds, depending on the document length and complexity. You'll receive real-time updates as the analysis progresses."
              />
            </div>
          </section>

          <!-- Privacy & Security -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icon name="heroicons:shield-check" class="w-6 h-6 mr-2 text-blue-600" />
              Privacy & Security
            </h2>
            <div class="space-y-4">
              <FaqItem
                question="Is my data secure?"
                answer="Yes. We take security very seriously. All documents are encrypted in transit (TLS/SSL) and at rest. We use secure cloud infrastructure and implement industry-standard security practices. Only you can access your uploaded documents."
              />
              <FaqItem
                question="Who can see my documents?"
                answer="Only you have access to your documents and analysis results. ClaimReady staff cannot view your documents unless you explicitly grant support access for troubleshooting purposes."
              />
              <FaqItem
                question="Do you share my information with third parties?"
                answer="No, we do not sell or share your personal information or documents with third parties. We may use anonymized data to improve our AI models. See our Privacy Policy for complete details."
              />
              <FaqItem
                question="Can I delete my data?"
                answer="Yes. You can delete individual documents or your entire account at any time from your settings page. Deleted data is permanently removed from our systems."
              />
            </div>
          </section>

          <!-- Pricing & Billing -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icon name="heroicons:currency-dollar" class="w-6 h-6 mr-2 text-blue-600" />
              Pricing & Billing
            </h2>
            <div class="space-y-4">
              <FaqItem
                question="What pricing plans are available?"
                answer="We offer several plans to fit different needs: Basic (limited documents per month), Professional (unlimited documents), and Team (multiple users). Visit our Pricing page for current rates and features."
              />
              <FaqItem
                question="Is there a free trial?"
                answer="Yes! New users get a free trial to test ClaimReady with their first decision letter. No credit card required to start."
              />
              <FaqItem
                question="How do I cancel my subscription?"
                answer="You can cancel your subscription at any time from your account settings. You'll retain access until the end of your current billing period."
              />
              <FaqItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor."
              />
            </div>
          </section>

          <!-- Technical Support -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icon name="heroicons:wrench-screwdriver" class="w-6 h-6 mr-2 text-blue-600" />
              Technical Support
            </h2>
            <div class="space-y-4">
              <FaqItem
                question="What browsers are supported?"
                answer="ClaimReady works best on modern browsers: Chrome, Firefox, Safari, and Edge (latest versions). We recommend keeping your browser up to date for the best experience."
              />
              <FaqItem
                question="My upload is failing. What should I do?"
                answer="First, check that your file is a PDF and under 10MB. If issues persist, try a different browser or clear your cache. If you still have trouble, contact support@claimready.io with details about the error."
              />
              <FaqItem
                question="Can I use ClaimReady on mobile?"
                answer="Yes! ClaimReady is mobile-responsive and works on smartphones and tablets. However, for the best experience analyzing documents, we recommend using a desktop or laptop."
              />
              <FaqItem
                question="How do I report a bug or issue?"
                answer="Please email support@claimready.io with a description of the issue, steps to reproduce it, and any error messages. Screenshots are helpful! We aim to respond within 24 hours."
              />
            </div>
          </section>

          <!-- Legal & Compliance -->
          <section class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Icon name="heroicons:scale" class="w-6 h-6 mr-2 text-blue-600" />
              Legal & Compliance
            </h2>
            <div class="space-y-4">
              <FaqItem
                question="Does ClaimReady provide legal advice?"
                answer="No. ClaimReady is an analysis tool, not a law firm. We do not provide legal advice. You should consult with a qualified VA attorney or accredited representative for legal guidance on your specific case."
              />
              <FaqItem
                question="Can I use ClaimReady's analysis in my appeal?"
                answer="Yes, you can use the extracted information and insights as reference material. However, we recommend having a qualified professional review all information before submitting appeals or legal documents."
              />
              <FaqItem
                question="Is ClaimReady affiliated with the VA?"
                answer="No. ClaimReady is an independent service and is not affiliated with, endorsed by, or officially connected to the Department of Veterans Affairs."
              />
            </div>
          </section>
        </div>

        <!-- Still Need Help -->
        <div class="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-center text-white">
          <Icon name="heroicons:chat-bubble-left-right" class="w-12 h-12 mx-auto mb-4" />
          <h2 class="text-2xl font-bold mb-2">Still Have Questions?</h2>
          <p class="text-blue-100 mb-6">
            Our support team is ready to help you get the most out of ClaimReady.
          </p>
          <a
            href="mailto:support@claimready.io"
            class="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            <Icon name="heroicons:envelope" class="w-5 h-5 mr-2" />
            Email Support
          </a>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Navigation from '~/components/organisms/Navigation.vue'
import Footer from '~/components/organisms/Footer.vue'
import FaqItem from '~/components/molecules/FaqItem.vue'

useSeoMeta({
  title: 'FAQ & Help - ClaimReady',
  description: 'Find answers to frequently asked questions about using ClaimReady to analyze VA decision letters and support your appeals process.',
})
</script>
