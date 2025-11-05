<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Navigation />

    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p class="text-gray-600">Last updated: {{ lastUpdated }}</p>
        </div>

        <!-- Content -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              ClaimReady ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service to analyze VA decision letters and support appeals processes.
            </p>
            <p class="text-gray-700 leading-relaxed">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Personal Information</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide to us when you:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Register for an account</li>
              <li>Upload documents for analysis</li>
              <li>Contact customer support</li>
              <li>Subscribe to our newsletter or marketing communications</li>
            </ul>
            <p class="text-gray-700 leading-relaxed mb-4">
              This information may include: name, email address, and any other information you choose to provide.
            </p>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Document Information</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              When you upload VA decision letters or related documents for analysis, we collect and process:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Document content and metadata</li>
              <li>Analysis results and extracted information</li>
              <li>Notes and annotations you add to documents</li>
            </ul>
            <p class="text-gray-700 leading-relaxed">
              <strong class="text-gray-900">Important:</strong> We understand the sensitive nature of VA documents. All documents are encrypted in transit and at rest, and we implement strict access controls.
            </p>

            <h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">Usage Information</h3>
            <p class="text-gray-700 leading-relaxed mb-4">
              We automatically collect certain information when you visit, use, or navigate our service:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>Log data (IP address, browser type, operating system)</li>
              <li>Device information</li>
              <li>Usage patterns and preferences</li>
              <li>Performance metrics</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Provide Services:</strong> Process and analyze your documents, generate insights and recommendations</li>
              <li><strong>Improve Our Service:</strong> Enhance our AI models and analysis capabilities (using anonymized data only)</li>
              <li><strong>Communicate:</strong> Send service-related notifications, updates, and support messages</li>
              <li><strong>Security:</strong> Detect, prevent, and address fraud, security issues, and technical problems</li>
              <li><strong>Legal Compliance:</strong> Comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (e.g., cloud hosting, analytics) under strict confidentiality agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li>End-to-end encryption for data in transit (TLS/SSL)</li>
              <li>Encryption at rest for stored documents</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure cloud infrastructure (AWS/Railway)</li>
            </ul>
            <p class="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
            <p class="text-gray-700 leading-relaxed">
              We retain your personal information and documents only as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data at any time by contacting us at <a href="mailto:privacy@claimready.io" class="text-blue-600 hover:text-blue-800">privacy@claimready.io</a>.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul class="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            </ul>
            <p class="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at <a href="mailto:privacy@claimready.io" class="text-blue-600 hover:text-blue-800">privacy@claimready.io</a>.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p class="text-gray-700 leading-relaxed">
              We use cookies and similar tracking technologies to improve your experience. You can control cookie preferences through your browser settings. Disabling cookies may limit some functionality of our service.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              Our service may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these external services. We encourage you to review their privacy policies.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Children's Privacy</h2>
            <p class="text-gray-700 leading-relaxed">
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
            <p class="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. Your continued use of our service after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p class="text-gray-700 leading-relaxed mb-4">
              If you have questions or concerns about this Privacy Policy, please contact us:
            </p>
            <div class="bg-gray-50 rounded-lg p-4">
              <p class="text-gray-700"><strong>Email:</strong> <a href="mailto:privacy@claimready.io" class="text-blue-600 hover:text-blue-800">privacy@claimready.io</a></p>
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
const lastUpdated = 'November 5, 2025'

useSeoMeta({
  title: 'Privacy Policy - ClaimReady',
  description: 'Learn how ClaimReady collects, uses, and protects your personal information and VA documents.',
})
</script>
