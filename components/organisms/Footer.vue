<template>
  <footer class="bg-white border-t border-gray-200 mt-auto">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Brand & About -->
        <div class="col-span-1 md:col-span-2">
          <Logo size="sm" class="mb-4" />
          <p class="text-gray-600 text-sm max-w-md">
            ClaimReady helps veterans and their representatives analyze VA decision letters and build stronger appeals with AI-powered insights.
          </p>
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

      <!-- Bottom Bar -->
      <div class="border-t border-gray-200 mt-8 pt-8">
        <div class="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {{ currentYear }} ClaimReady. All rights reserved.</p>
          <div class="flex space-x-4 mt-4 md:mt-0">
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
