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

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-slate-600">Loading your analysis...</p>
    </div>

    <!-- Results -->
    <div v-else-if="results" class="max-w-7xl mx-auto px-4 py-8">
      <!-- Countdown Timer (anonymous users only) -->
      <CountdownTimer
        v-if="!isAuthenticated"
        :expires-at="expirationDate"
        @show-signup="navigateTo('/auth/signup')"
      />

      <!-- Rating Hero Card -->
      <RatingHeroCard
        :combined-rating="results.combinedRating || 0"
        :monthly-payment="results.monthlyPayment || 0"
        :granted-count="grantedCount"
        :denied-count="deniedCount"
        :deferred-count="deferredCount"
      />

      <!-- Conditions Grid Enhanced -->
      <ConditionsGridEnhanced
        :conditions="formattedConditions"
        :denial-reasons="results.denialReasons || []"
        :deferred-reasons="results.deferredReasons || []"
        :is-authenticated="isAuthenticated"
        @show-signup="navigateTo('/auth/signup')"
      />

      <!-- Locked Feature Teaser (anonymous users only) -->
      <LockedFeatureTeaser
        v-if="!isAuthenticated"
        @show-signup="navigateTo('/auth/signup')"
      />

      <!-- Free vs Paid Comparison (anonymous users only) -->
      <FreeVsPaidGrid
        v-if="!isAuthenticated"
        @show-signup="navigateTo('/auth/signup')"
      />

      <!-- Actions -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4">
        <Button @click="downloadSummary" variant="primary">
          <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-2" />
          Download Summary PDF
        </Button>

        <Button v-if="!isAuthenticated" @click="navigateTo('/auth/signup')" variant="secondary">
          <Icon name="heroicons:bookmark" class="w-4 h-4 mr-2" />
          Save Full Results (Sign Up Free)
        </Button>

        <Button v-if="isAuthenticated" @click="navigateTo('/documents')" variant="secondary">
          <Icon name="heroicons:folder" class="w-4 h-4 mr-2" />
          View All Documents
        </Button>

        <Button @click="navigateTo('/analyze')" variant="secondary">
          <Icon name="heroicons:document-plus" class="w-4 h-4 mr-2" />
          Analyze Another Document
        </Button>
      </div>

      <!-- Final CTA (anonymous users only) -->
      <div v-if="!isAuthenticated" class="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-12 text-center text-white">
        <h3 class="text-3xl font-bold mb-4">
          Ready to Take the Next Step?
        </h3>
        <p class="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
          Join thousands of veterans who have successfully increased their ratings and secured the benefits they deserve.
        </p>
        <button
          @click="navigateTo('/auth/signup')"
          class="inline-flex items-center px-12 py-4 text-xl font-bold bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
        >
          <Icon name="heroicons:rocket-launch" class="w-6 h-6 mr-2" />
          Create Free Account Now
        </button>
        <p class="text-blue-200 text-sm mt-4">
          No credit card required • Takes 30 seconds • 100% free forever
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-7xl mx-auto px-4 py-12 text-center">
      <Icon name="heroicons:exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h2 class="text-2xl font-bold text-slate-900 mb-2">Results Not Found</h2>
      <p class="text-slate-600 mb-6">
        This analysis may have expired or the link is invalid.
      </p>
      <Button @click="navigateTo('/analyze')" variant="primary">
        Analyze a New Document
      </Button>
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

const loading = ref(true)
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
  try {
    const config = useRuntimeConfig()
    const apiUrl = config.public.apiUrl || 'http://localhost:3001'

    const response = await fetch(
      `${apiUrl}/api/analyze/results/${sessionId}`
    )

    if (response.ok) {
      results.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to load results:', error)
  } finally {
    loading.value = false
  }
})

const downloadSummary = async () => {
  const config = useRuntimeConfig()
  const apiUrl = config.public.apiUrl || 'http://localhost:3001'

  window.open(
    `${apiUrl}/api/analyze/results/${sessionId}/summary-pdf`,
    '_blank'
  )
}

useHead({
  title: 'Analysis Results - ClaimReady',
  meta: [
    { name: 'description', content: 'View your VA decision letter analysis results.' }
  ]
})
</script>
