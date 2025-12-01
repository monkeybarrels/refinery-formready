<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Use full Navigation for authenticated users, minimal header for anonymous -->
    <Navigation v-if="isAuthenticated" />

    <!-- Minimal header with menu (anonymous users only) -->
    <header v-else class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-4">
            <Logo size="md" to="/" />
            <div class="hidden sm:block">
              <Breadcrumb />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Desktop Links -->
            <NuxtLink to="/analyze" class="hidden sm:inline text-sm text-slate-600 hover:text-blue-800 transition-colors">
              Analyze Another
            </NuxtLink>
            <NuxtLink to="/pricing" class="hidden sm:inline text-sm text-slate-600 hover:text-blue-800 transition-colors">
              Pricing
            </NuxtLink>
            <NuxtLink to="/faq" class="hidden sm:inline text-sm text-slate-600 hover:text-blue-800 transition-colors">
              Help
            </NuxtLink>
            <NuxtLink to="/auth/signup" class="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              Sign Up Free
            </NuxtLink>

            <!-- Mobile Menu Button -->
            <button
              @click="showMobileMenu = !showMobileMenu"
              class="sm:hidden text-slate-600 hover:text-blue-800 transition-colors"
              aria-label="Toggle menu"
            >
              <Icon v-if="!showMobileMenu" name="heroicons:bars-3" class="w-6 h-6" />
              <Icon v-else name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="sm:hidden mt-4 pt-4 border-t border-slate-200">
          <nav class="flex flex-col space-y-3">
            <NuxtLink to="/" class="text-sm text-slate-700 hover:text-blue-800 transition-colors">
              Home
            </NuxtLink>
            <NuxtLink to="/analyze" class="text-sm text-slate-700 hover:text-blue-800 transition-colors">
              Analyze Another
            </NuxtLink>
            <NuxtLink to="/pricing" class="text-sm text-slate-700 hover:text-blue-800 transition-colors">
              Pricing
            </NuxtLink>
            <NuxtLink to="/faq" class="text-sm text-slate-700 hover:text-blue-800 transition-colors">
              Help
            </NuxtLink>
          </nav>
        </div>
      </div>
    </header>

    <!-- Expiration Notice (anonymous users only) -->
    <div v-if="!isAuthenticated" class="bg-amber-50 border-b border-amber-200 py-3">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <Icon name="heroicons:clock" class="w-4 h-4 inline mr-2" />
        <span class="text-sm text-amber-800">
          Results available for 24 hours.
          <NuxtLink to="/auth/signup" class="underline font-medium">
            Sign up free to save permanently
          </NuxtLink>
        </span>
      </div>
    </div>

    <!-- Success banner for authenticated users -->
    <div v-if="isAuthenticated" class="bg-green-50 border-b border-green-200 py-3">
      <div class="max-w-7xl mx-auto px-4 text-center">
        <Icon name="heroicons:check-circle" class="w-4 h-4 inline mr-2 text-green-600" />
        <span class="text-sm text-green-800">
          Analysis complete! Your results have been saved to your account.
        </span>
      </div>
    </div>

    <!-- Back Navigation -->
    <div class="max-w-7xl mx-auto px-4 py-4 sm:hidden">
      <BackButton :to="isAuthenticated ? '/documents' : '/analyze'" :label="isAuthenticated ? 'Back to Documents' : 'Start New Analysis'" />
    </div>

    <!-- Redirecting State (deprecated route) -->
    <div class="max-w-7xl mx-auto px-4 py-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-slate-600">Redirecting...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "~/components/atoms/Button.vue";
import BackButton from "~/components/atoms/BackButton.vue";
import Logo from "~/components/atoms/Logo.vue";
import Breadcrumb from "~/components/molecules/Breadcrumb.vue";
import Navigation from "~/components/organisms/Navigation.vue";
import RatingHeroCard from "~/components/organisms/RatingHeroCard.vue";
import ConditionsGridEnhanced from "~/components/organisms/ConditionsGridEnhanced.vue";
import CountdownTimer from "~/components/organisms/CountdownTimer.vue";
import LockedFeatureTeaser from "~/components/organisms/LockedFeatureTeaser.vue";
import FreeVsPaidGrid from "~/components/organisms/FreeVsPaidGrid.vue";
import SocialProof from "~/components/organisms/SocialProof.vue";

const route = useRoute()
const sessionId = route.params.sessionId as string

// DEPRECATED: This page is no longer used - redirects immediately
const loading = ref(false)
const results = ref<any>(null)
const showMobileMenu = ref(false)

// Check authentication status
const { isAuthenticated: isAuthenticatedFn } = useAuth()
const isAuthenticated = computed(() => isAuthenticatedFn())

// Computed properties for condition counts and formatting
const formattedConditions = computed(() => {
  if (!results.value?.ratings) return []

  return results.value.ratings.map((rating: any) => ({
    condition: rating.condition,
    decision: rating.decision || 'unknown',
    ratingPercentage: rating.ratingPercentage,
    effectiveDate: rating.effectiveDate,
    reason: rating.reason
  }))
})

const grantedCount = computed(() => {
  return formattedConditions.value.filter((c: any) => c.decision === 'granted').length
})

const deniedCount = computed(() => {
  return formattedConditions.value.filter((c: any) => c.decision === 'denied').length
})

const deferredCount = computed(() => {
  return formattedConditions.value.filter((c: any) => c.decision === 'deferred').length
})

// Calculate expiration date (24 hours from creation)
const expirationDate = computed(() => {
  if (!results.value?.extractedAt) {
    // Default to 24 hours from now if no extractedAt date
    return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
  const extracted = new Date(results.value.extractedAt)
  return new Date(extracted.getTime() + 24 * 60 * 60 * 1000).toISOString()
})

onMounted(async () => {
  // DEPRECATED: /results/:sessionId is no longer supported
  // We no longer create sessionId (authenticated users only)
  // Immediately redirect ALL users to /documents
  console.warn('⚠️ /results/:sessionId is deprecated - redirecting to /documents')
  console.warn('   sessionId:', sessionId)
  console.warn('   Authenticated users should use /analysis/:documentId')
  
  // Redirect immediately - no fetching, no processing
  navigateTo('/documents', { replace: true })
})

const downloadSummary = async () => {
  const { apiCall } = useApi()
  
  // For downloads, we need to fetch the PDF with auth headers and create a blob URL
  // since window.open doesn't support custom headers
  try {
    const response = await apiCall(`/api/analyze/results/${sessionId}/summary-pdf`)
    
    if (response.ok) {
      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `va-decision-summary-${sessionId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(blobUrl)
      document.body.removeChild(a)
    } else {
      console.error('Failed to download PDF:', response.status)
    }
  } catch (error) {
    console.error('Error downloading PDF:', error)
  }
}

useHead({
  title: 'Analysis Results - ClaimReady',
  meta: [
    { name: 'description', content: 'View your VA decision letter analysis results.' }
  ]
})
</script>
