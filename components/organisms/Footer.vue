<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand & About -->
        <div class="col-span-1 md:col-span-2">
          <Logo size="sm" class="mb-4" />
          <p class="text-gray-600 text-sm max-w-md mb-4">
            ClaimReady helps veterans and their representatives analyze VA decision letters and build stronger appeals with AI-powered insights.
          </p>

          <!-- Trust Signals -->
          <div class="space-y-2">
            <div class="flex items-center text-sm text-gray-700">
              <Icon name="heroicons:shield-check" class="w-4 h-4 mr-2 text-blue-600" />
              <span>Encrypted & Secure Storage</span>
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <Icon name="heroicons:user-group" class="w-4 h-4 mr-2 text-blue-600" />
              <span>Built by Veterans, For Veterans</span>
            </div>
            <div class="flex items-center text-sm text-gray-700">
              <Icon name="heroicons:heart" class="w-4 h-4 mr-2 text-blue-600" />
              <span>Always Free Tier Available</span>
            </div>
          </div>
        </div>

        <!-- Legal Links -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Legal</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/privacy-policy"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Privacy Policy
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/terms-of-service"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                Terms of Service
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support Links -->
        <div>
          <h3 class="font-semibold text-gray-900 mb-4">Support</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/faq"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                FAQ & Help
              </NuxtLink>
            </li>
            <li>
              <a
                href="mailto:support@claimready.io"
                class="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center"
              >
                <Icon name="heroicons:envelope" class="w-4 h-4 mr-1" />
                Contact Support
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Privacy Statement -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-900 text-center">
          <Icon name="heroicons:lock-closed" class="w-4 h-4 inline mr-1" />
          Your data is encrypted, never sold, and you can delete it anytime.
        </p>
      </div>

      <!-- Company Information -->
      <div class="border-t border-gray-200 mt-8 pt-8">
        <div class="text-center mb-6">
          <div class="text-sm text-gray-600 space-y-1">
            <p class="font-semibold text-gray-900">MonkeyBarrels LLC</p>
            <p>Columbia, South Carolina</p>
            <p>
              <a href="mailto:support@claimready.io" class="text-blue-600 hover:text-blue-700 transition-colors">
                support@claimready.io
              </a>
            </p>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 border-t border-gray-100 pt-6">
          <p>&copy; {{ currentYear }} ClaimReady.io – All Rights Reserved</p>
          <div class="flex space-x-4 mt-4 md:mt-0">
            <NuxtLink to="/about" class="hover:text-blue-600 transition-colors">
              About
            </NuxtLink>
            <NuxtLink to="/roadmap" class="hover:text-blue-600 transition-colors">
              Roadmap
            </NuxtLink>
            <NuxtLink to="/privacy-policy" class="hover:text-blue-600 transition-colors">
              Privacy
            </NuxtLink>
            <NuxtLink to="/terms-of-service" class="hover:text-blue-600 transition-colors">
              Terms
            </NuxtLink>
            <NuxtLink to="/faq" class="hover:text-blue-600 transition-colors">
              Help
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>
