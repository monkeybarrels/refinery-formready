<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
    <!-- Minimal Header for Anonymous Users -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <Logo size="sm" />
        </NuxtLink>
        <div class="flex items-center space-x-4">
          <NuxtLink to="/auth/login" class="text-sm text-slate-600 hover:text-slate-900">
            Sign In
          </NuxtLink>
          <Button variant="secondary" size="sm" @click="navigateTo('/auth/register')">
            Create Account
          </Button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <!-- PHASE 1: Upload -->
      <div v-if="phase === 'upload'" class="max-w-3xl mx-auto px-4 py-12">
        <!-- Hero Text -->
        <div class="text-center mb-10">
          <h1 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Discover Money You're
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Missing Out On
            </span>
          </h1>
          <p class="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload your VA decision letter and see exactly how much you could be receiving in benefits.
          </p>
          <p class="text-sm text-slate-500 mt-3">
            No signup required &bull; Takes 60 seconds &bull; 100% confidential
          </p>
        </div>

        <!-- Upload Zone -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <FileUploadZone
            @file-select="handleFileSelected"
            @analyze="startAnalysis"
            :uploading="analyzing"
          />

          <!-- Dependents Calculator (collect before analysis) -->
          <div v-if="selectedFile" class="mt-6 pt-6 border-t border-slate-200">
            <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center">
              <Icon name="heroicons:users" class="w-4 h-4 mr-2 text-blue-600" />
              Tell us about your dependents (for accurate rate calculation)
            </h3>
            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- Spouse -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Spouse</label>
                <select v-model="dependents.hasSpouse" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option :value="false">No spouse</option>
                  <option :value="true">Married</option>
                </select>
              </div>

              <!-- Children under 18 -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Children under 18</label>
                <select v-model="dependents.childrenUnder18" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option :value="0">None</option>
                  <option :value="1">1 child</option>
                  <option :value="2">2 children</option>
                  <option :value="3">3 children</option>
                  <option :value="4">4 children</option>
                  <option :value="5">5+ children</option>
                </select>
              </div>

              <!-- Children 18-23 in school -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Children 18-23 in school</label>
                <select v-model="dependents.childrenInSchool" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option :value="0">None</option>
                  <option :value="1">1 child</option>
                  <option :value="2">2 children</option>
                  <option :value="3">3+ children</option>
                </select>
              </div>

              <!-- Dependent parents -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Dependent parents</label>
                <select v-model="dependents.dependentParents" class="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option :value="0">None</option>
                  <option :value="1">1 parent</option>
                  <option :value="2">2 parents</option>
                </select>
              </div>
            </div>
            <p class="text-xs text-slate-500 mt-2">
              VA compensation varies based on dependents. This helps us show your exact rate.
            </p>
          </div>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:shield-check" class="w-5 h-5 text-green-600" />
            <span>Bank-level encryption</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:clock" class="w-5 h-5 text-blue-600" />
            <span>Results in 60 seconds</span>
          </div>
          <div class="flex items-center space-x-2">
            <Icon name="heroicons:user-group" class="w-5 h-5 text-indigo-600" />
            <span>10,000+ veterans helped</span>
          </div>
        </div>
      </div>

      <!-- PHASE 2: Analyzing -->
      <div v-else-if="phase === 'analyzing'" class="max-w-2xl mx-auto px-4 py-16">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Spinner size="lg" />
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Analyzing Your Decision Letter</h2>
          <p class="text-slate-600 mb-6">{{ analysisStatus }}</p>

          <div class="w-full bg-slate-100 rounded-full h-2 mb-4">
            <div
              class="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${analysisProgress}%` }"
            />
          </div>

          <div class="flex justify-center space-x-8 text-sm text-slate-500 mt-6">
            <div :class="analysisStep >= 1 ? 'text-green-600' : ''">
              <Icon :name="analysisStep >= 1 ? 'heroicons:check-circle' : 'heroicons:clock'" class="w-5 h-5 mx-auto mb-1" />
              <span>Uploading</span>
            </div>
            <div :class="analysisStep >= 2 ? 'text-green-600' : ''">
              <Icon :name="analysisStep >= 2 ? 'heroicons:check-circle' : 'heroicons:clock'" class="w-5 h-5 mx-auto mb-1" />
              <span>Reading</span>
            </div>
            <div :class="analysisStep >= 3 ? 'text-green-600' : ''">
              <Icon :name="analysisStep >= 3 ? 'heroicons:check-circle' : 'heroicons:clock'" class="w-5 h-5 mx-auto mb-1" />
              <span>Analyzing</span>
            </div>
            <div :class="analysisStep >= 4 ? 'text-green-600' : ''">
              <Icon :name="analysisStep >= 4 ? 'heroicons:check-circle' : 'heroicons:clock'" class="w-5 h-5 mx-auto mb-1" />
              <span>Complete</span>
            </div>
          </div>
        </div>
      </div>

      <!-- PHASE 3: Results -->
      <div v-else-if="phase === 'results'" class="max-w-5xl mx-auto px-4 py-8">
        <!-- Ephemeral Results Warning -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p class="font-semibold text-red-800">Your results will be lost when you leave this page!</p>
              <p class="text-red-700 text-sm mt-1">
                These results are not saved.
                <button @click="showSignupModal = true" class="font-medium underline hover:text-red-900">Create a free account</button>
                to save your analysis and unlock all recommendations.
              </p>
            </div>
          </div>
        </div>

        <!-- Money Left on Table Hero (only show if denials exist) -->
        <div v-if="hasDenials" class="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div class="text-center">
            <p class="text-red-100 text-lg mb-2">Money You're Leaving on the Table</p>
            <p class="text-5xl md:text-6xl font-bold mb-2">
              +${{ formatMoney(moneyLeftOnTableMonthly) }}<span class="text-2xl">/mo</span>
            </p>
            <p class="text-red-100 text-lg">
              That's <span class="font-semibold">${{ formatMoney(moneyLeftOnTable) }}/year</span> you could be receiving
            </p>
            <p class="text-red-200 text-sm mt-2">
              Based on {{ deniedConditions.length }} denied condition{{ deniedConditions.length !== 1 ? 's' : '' }}
              that may qualify for appeal
            </p>
          </div>
        </div>

        <!-- Success Hero (no denials) -->
        <div v-else class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <div class="text-center">
            <p class="text-green-100 text-lg mb-2">Your Combined Rating</p>
            <p class="text-5xl md:text-6xl font-bold mb-2">
              {{ results.combinedRating || 0 }}%
            </p>
            <p class="text-green-100">
              ~${{ formatMoney(currentMonthlyPayment) }}/month base rate (varies with dependents)
            </p>
          </div>
        </div>

        <!-- Your Compensation Summary -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h3 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
            <Icon name="heroicons:banknotes" class="w-5 h-5 mr-2 text-green-600" />
            Your VA Compensation
          </h3>

          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-slate-600 mb-1">Your Monthly Compensation</p>
                <p class="text-3xl font-bold text-slate-900">${{ formatMoney(calculatedMonthlyPayment) }}</p>
                <p class="text-xs text-slate-500 mt-1">Based on {{ results.combinedRating || 0 }}% rating{{ hasDependents ? ' + dependents' : '' }}</p>
              </div>
              <div>
                <p class="text-sm text-slate-600 mb-1">Your Annual Compensation</p>
                <p class="text-3xl font-bold text-green-600">${{ formatMoney(calculatedMonthlyPayment * 12) }}</p>
                <p class="text-xs text-slate-500 mt-1">Tax-free VA disability benefits</p>
              </div>
            </div>

            <!-- Show dependents breakdown if any -->
            <div v-if="hasDependents" class="mt-4 pt-4 border-t border-blue-100">
              <p class="text-xs text-slate-600 mb-2">Includes additions for:</p>
              <div class="flex flex-wrap gap-2">
                <span v-if="dependents.hasSpouse" class="inline-flex items-center px-2 py-1 bg-white rounded text-xs text-slate-700">
                  <Icon name="heroicons:heart" class="w-3 h-3 mr-1 text-pink-500" /> Spouse
                </span>
                <span v-if="dependents.childrenUnder18 > 0" class="inline-flex items-center px-2 py-1 bg-white rounded text-xs text-slate-700">
                  <Icon name="heroicons:user" class="w-3 h-3 mr-1 text-blue-500" /> {{ dependents.childrenUnder18 }} child{{ dependents.childrenUnder18 > 1 ? 'ren' : '' }} under 18
                </span>
                <span v-if="dependents.childrenInSchool > 0" class="inline-flex items-center px-2 py-1 bg-white rounded text-xs text-slate-700">
                  <Icon name="heroicons:academic-cap" class="w-3 h-3 mr-1 text-indigo-500" /> {{ dependents.childrenInSchool }} in school (18-23)
                </span>
                <span v-if="dependents.dependentParents > 0" class="inline-flex items-center px-2 py-1 bg-white rounded text-xs text-slate-700">
                  <Icon name="heroicons:users" class="w-3 h-3 mr-1 text-amber-500" /> {{ dependents.dependentParents }} dependent parent{{ dependents.dependentParents > 1 ? 's' : '' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Granted Conditions -->
        <div v-if="grantedConditions.length > 0" class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Icon name="heroicons:check-circle" class="w-6 h-6 text-green-500 mr-2" />
            Service-Connected Conditions ({{ grantedConditions.length }})
          </h2>

          <div class="space-y-4">
            <div
              v-for="(condition, index) in grantedConditions"
              :key="index"
              class="border border-green-200 bg-green-50 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-slate-900">{{ condition.condition }}</h3>
                </div>
                <div class="text-right ml-4">
                  <p class="text-lg font-bold text-green-600">
                    {{ condition.ratingPercentage || 0 }}%
                  </p>
                  <p class="text-xs text-slate-500">rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Denied Conditions -->
        <div v-if="deniedConditions.length > 0" class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Icon name="heroicons:x-circle" class="w-6 h-6 text-red-500 mr-2" />
            Denied Conditions ({{ deniedConditions.length }})
          </h2>

          <div class="space-y-4">
            <div
              v-for="(condition, index) in deniedConditions"
              :key="index"
              class="border border-slate-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-semibold text-slate-900">{{ condition.condition }}</h3>
                  <p class="text-sm text-slate-600 mt-1 line-clamp-2">
                    {{ condition.laymanReason || condition.reason }}
                  </p>
                </div>
                <div class="text-right ml-4">
                  <p class="text-lg font-bold text-red-600">
                    +${{ formatMoney(Math.round(estimateConditionValue(condition))) }}/mo
                  </p>
                  <p class="text-xs text-slate-500">potential value</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- No Denials - Good News Message -->
        <div v-if="!hasDenials && grantedConditions.length > 0" class="bg-green-50 border border-green-200 rounded-2xl p-8 mb-8">
          <div class="text-center">
            <Icon name="heroicons:check-badge" class="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h2 class="text-xl font-bold text-green-800 mb-2">Great News!</h2>
            <p class="text-green-700">
              Your decision letter shows no denied conditions. All your claimed conditions were approved!
            </p>
          </div>
        </div>

        <!-- Quick Wins Preview (only if denials exist) -->
        <div v-if="hasDenials && quickWins.length > 0" class="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6 flex items-center">
            <Icon name="heroicons:light-bulb" class="w-6 h-6 text-amber-500 mr-2" />
            Quick Wins - Your Best Opportunities
          </h2>

          <div class="space-y-4">
            <div
              v-for="(win, index) in quickWins.slice(0, 2)"
              :key="index"
              class="border border-green-200 bg-green-50 rounded-lg p-4"
            >
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {{ index + 1 }}
                </div>
                <div class="flex-1">
                  <h3 class="font-semibold text-slate-900">{{ win.title }}</h3>
                  <p class="text-sm text-slate-600 mt-1">{{ win.description }}</p>
                  <div class="flex items-center space-x-4 mt-2 text-sm">
                    <span class="text-green-700 font-medium">
                      {{ win.successRate }}% success rate
                    </span>
                    <span class="text-slate-500">|</span>
                    <span class="text-slate-600">
                      Potential: +${{ formatMoney(Math.round(win.potentialValue)) }}/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Teaser for more -->
          <div class="mt-6 p-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-900">
                  {{ quickWins.length > 2 ? `+${quickWins.length - 2} more Quick Wins available` : 'Get personalized appeal strategies' }}
                </p>
                <p class="text-sm text-slate-500">Create a free account to unlock all recommendations</p>
              </div>
              <Button variant="primary" size="sm" @click="showSignupModal = true">
                Unlock All
              </Button>
            </div>
          </div>
        </div>

        <!-- Conversion CTA -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 v-if="hasDenials" class="text-2xl font-bold mb-2">Don't Leave +${{ formatMoney(moneyLeftOnTableMonthly) }}/mo on the Table</h2>
          <h2 v-else class="text-2xl font-bold mb-2">Save Your Analysis</h2>
          <p v-if="hasDenials" class="text-blue-100 mb-6">
            Create a free account to save your analysis, get all Quick Win recommendations, and start your appeal.
          </p>
          <p v-else class="text-blue-100 mb-6">
            Create a free account to save your analysis and track your VA benefits over time.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button
              class="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
              @click="showSignupModal = true"
            >
              Create Free Account
            </button>
            <button
              class="px-6 py-3 text-white font-semibold rounded-lg border-2 border-white/50 hover:bg-white/10 transition-colors flex items-center justify-center"
              @click="shareResults"
            >
              <Icon name="heroicons:share" class="w-5 h-5 mr-2" />
              Share Results
            </button>
          </div>
        </div>
      </div>

      <!-- PHASE 4: Error -->
      <div v-else-if="phase === 'error'" class="max-w-2xl mx-auto px-4 py-16">
        <div class="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="heroicons:exclamation-triangle" class="w-8 h-8 text-red-600" />
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Analysis Failed</h2>
          <p class="text-slate-600 mb-6">{{ errorMessage }}</p>
          <Button variant="primary" @click="resetAnalysis">
            Try Again
          </Button>
        </div>
      </div>
    </main>

    <!-- Signup Modal -->
    <Modal v-model="showSignupModal" title="Create Your Free Account">
      <div class="p-6">
        <div class="text-center mb-6">
          <p class="text-slate-600">
            Save your analysis and unlock all features - completely free.
          </p>
        </div>

        <div class="space-y-4">
          <Button
            variant="secondary"
            size="lg"
            class="w-full"
            @click="signupWithGoogle"
          >
            <Icon name="logos:google-icon" class="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-200" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-slate-500">or</span>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            class="w-full"
            @click="navigateTo('/auth/register?returnTo=/try-it')"
          >
            Sign up with Email
          </Button>
        </div>

        <p class="text-xs text-slate-500 text-center mt-4">
          By signing up, you agree to our
          <NuxtLink to="/terms" class="underline">Terms</NuxtLink> and
          <NuxtLink to="/privacy" class="underline">Privacy Policy</NuxtLink>
        </p>
      </div>
    </Modal>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import Button from '~/components/atoms/Button.vue'
import Logo from '~/components/atoms/Logo.vue'
import Spinner from '~/components/atoms/Spinner.vue'
import FileUploadZone from '~/components/organisms/FileUploadZone.vue'
import Footer from '~/components/organisms/Footer.vue'
import Modal from '~/components/molecules/Modal.vue'

// Page meta
useHead({
  title: 'Free VA Decision Letter Analysis - ClaimReady',
  meta: [
    { name: 'description', content: 'Upload your VA decision letter and discover how much money you may be missing. Free analysis, no signup required.' }
  ]
})

// State
const phase = ref<'upload' | 'analyzing' | 'results' | 'error'>('upload')
const selectedFile = ref<File | null>(null)
const analyzing = ref(false)
const analysisStatus = ref('Preparing your document...')
const analysisProgress = ref(0)
const analysisStep = ref(0)
const errorMessage = ref('')
const showSignupModal = ref(false)

// Dependents state (collected during upload for accurate calculation)
const dependents = reactive({
  hasSpouse: false,
  childrenUnder18: 0,
  childrenInSchool: 0,
  dependentParents: 0
})

// Results data
const results = ref<any>({})
const sessionId = ref('')

// API calculation results (fetched from backend)
const paymentData = ref<any>(null)
const moneyLeftOnTableData = ref<any>(null)
const conditionValues = ref<Map<string, number>>(new Map())

// Get API URL
const config = useRuntimeConfig()
const apiUrl = computed(() => config.public.apiUrl || 'http://localhost:3001')

// Computed values
const deniedConditions = computed(() => {
  return results.value?.denialReasons || []
})

const grantedConditions = computed(() => {
  return (results.value.ratings || []).filter((r: any) =>
    r.decision === 'granted' || r.decision === 'service_connected'
  )
})

const hasDenials = computed(() => deniedConditions.value.length > 0)

const hasDependents = computed(() => {
  return dependents.hasSpouse ||
    dependents.childrenUnder18 > 0 ||
    dependents.childrenInSchool > 0 ||
    dependents.dependentParents > 0
})

// Use API-calculated values
const moneyLeftOnTable = computed(() => {
  return moneyLeftOnTableData.value?.annualDifference || 0
})

const moneyLeftOnTableMonthly = computed(() => {
  return moneyLeftOnTableData.value?.monthlyDifference || 0
})

const calculatedMonthlyPayment = computed(() => {
  return paymentData.value?.monthlyPayment || 0
})

const currentMonthlyPayment = computed(() => {
  // Base rate (shown in hero when no denials)
  return paymentData.value?.basePayment || 0
})

const quickWins = computed(() => {
  // Generate quick wins from denied conditions (monthly values)
  return deniedConditions.value.slice(0, 5).map((denial: any, index: number) => ({
    title: `Appeal ${denial.condition}`,
    description: denial.laymanReason || `Your claim for ${denial.condition} was denied but may qualify for a Supplemental Claim with additional evidence.`,
    successRate: 65 - (index * 5), // Decreasing success rates
    potentialValue: conditionValues.value.get(denial.condition) || moneyLeftOnTableData.value?.monthlyDifference || 0
  }))
})

// Fetch calculations from API when results or dependents change
watch([results, dependents], async () => {
  if (!results.value?.combinedRating) return

  const currentRating = results.value.combinedRating
  const denied = deniedConditions.value

  try {
    // Fetch payment calculation
    const paymentResponse = await fetch(`${apiUrl.value}/api/va-calculator/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: currentRating,
        dependents: {
          hasSpouse: dependents.hasSpouse,
          childrenUnder18: dependents.childrenUnder18,
          childrenInSchool: dependents.childrenInSchool,
          dependentParents: dependents.dependentParents
        }
      })
    })
    if (paymentResponse.ok) {
      paymentData.value = await paymentResponse.json()
    }

    // Fetch money left on table if there are denied conditions
    if (denied.length > 0) {
      const mlotResponse = await fetch(`${apiUrl.value}/api/va-calculator/money-left-on-table`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRating,
          deniedConditions: denied.map((d: any) => ({
            estimatedRating: d.estimatedRating,
            requestedRating: d.requestedRating
          })),
          dependents: {
            hasSpouse: dependents.hasSpouse,
            childrenUnder18: dependents.childrenUnder18,
            childrenInSchool: dependents.childrenInSchool,
            dependentParents: dependents.dependentParents
          }
        })
      })
      if (mlotResponse.ok) {
        moneyLeftOnTableData.value = await mlotResponse.json()
      }

      // Fetch individual condition values for Quick Wins
      for (const denial of denied) {
        const conditionResponse = await fetch(`${apiUrl.value}/api/va-calculator/money-left-on-table`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentRating,
            deniedConditions: [{
              estimatedRating: denial.estimatedRating,
              requestedRating: denial.requestedRating
            }],
            dependents: {
              hasSpouse: dependents.hasSpouse,
              childrenUnder18: dependents.childrenUnder18,
              childrenInSchool: dependents.childrenInSchool,
              dependentParents: dependents.dependentParents
            }
          })
        })
        if (conditionResponse.ok) {
          const data = await conditionResponse.json()
          conditionValues.value.set(denial.condition, data.monthlyDifference)
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch calculations:', error)
  }
}, { deep: true })

// Methods
const handleFileSelected = (file: File) => {
  selectedFile.value = file
}

const formatMoney = (amount: number) => {
  return amount.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

const estimateConditionValue = (condition: any) => {
  // Use pre-calculated monthly value from API
  return conditionValues.value.get(condition.condition) || moneyLeftOnTableData.value?.monthlyDifference || 0
}

const startAnalysis = async () => {
  if (!selectedFile.value) return

  phase.value = 'analyzing'
  analyzing.value = true
  analysisStep.value = 1
  analysisProgress.value = 10
  analysisStatus.value = 'Uploading your document...'

  try {
    // Step 1: Upload file via anonymous endpoint (saves to FileStorage)
    // Uses 'anonymous' userId - can be claimed after signup
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    const uploadResponse = await fetch(`${apiUrl.value}/api/storage/upload`, {
      method: 'POST',
      body: formData
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file')
    }

    const uploadData = await uploadResponse.json()
    const fileId = uploadData.fileId
    sessionId.value = fileId

    analysisStep.value = 2
    analysisProgress.value = 30
    analysisStatus.value = 'Reading your decision letter...'

    // Step 2: Start anonymous async analysis (no persistence)
    const analyzeResponse = await fetch(`${apiUrl.value}/api/analyze/anonymous/async`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId
      })
    })

    if (!analyzeResponse.ok) {
      throw new Error('Failed to start analysis')
    }

    const analyzeData = await analyzeResponse.json()
    const jobId = analyzeData.jobId

    analysisStep.value = 3
    analysisProgress.value = 50
    analysisStatus.value = 'Analyzing conditions and ratings...'

    // Step 3: Poll for results
    await pollForResults(jobId, fileId)

  } catch (error: any) {
    console.error('Analysis failed:', error)
    errorMessage.value = error.message || 'Something went wrong. Please try again.'
    phase.value = 'error'
  } finally {
    analyzing.value = false
  }
}

const pollForResults = async (jobId: string, fileId: string) => {
  const maxAttempts = 60 // 2 minutes max
  let attempts = 0

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Poll every 2 seconds

    try {
      // Use anonymous job status endpoint (no auth required)
      const statusResponse = await fetch(`${apiUrl.value}/api/analyze/anonymous/job/${jobId}`)
      const status = await statusResponse.json()

      if (status.status === 'completed') {
        analysisStep.value = 4
        analysisProgress.value = 100
        analysisStatus.value = 'Analysis complete!'

        // Results are returned from job status for anonymous users
        // The result object contains { documentId, status, results }
        // We need the nested 'results' field which has extraction data
        if (status.result) {
          const extractionData = status.result.results || status.result
          results.value = extractionData
          // Store in session for ephemeral access
          storeEphemeralResults(extractionData)
        }

        await new Promise(resolve => setTimeout(resolve, 500))
        phase.value = 'results'
        return
      }

      if (status.status === 'failed') {
        throw new Error(status.failedReason || 'Analysis failed')
      }

      // Update progress
      analysisProgress.value = Math.min(90, 50 + (attempts * 2))
      attempts++

    } catch (error) {
      throw error
    }
  }

  throw new Error('Analysis timed out. Please try again.')
}

/**
 * Store ephemeral results in sessionStorage
 * These are discarded when the browser session ends
 * User must create account to persist results
 */
const storeEphemeralResults = (data: any) => {
  try {
    const ephemeralData = {
      results: data,
      fileId: sessionId.value,
      timestamp: Date.now(),
      expiresAt: Date.now() + (60 * 60 * 1000) // 60 minute timeout
    }
    sessionStorage.setItem('ephemeralAnalysis', JSON.stringify(ephemeralData))
  } catch (e) {
    console.warn('Failed to store ephemeral results:', e)
  }
}

const resetAnalysis = () => {
  phase.value = 'upload'
  selectedFile.value = null
  results.value = {}
  errorMessage.value = ''
  analysisProgress.value = 0
  analysisStep.value = 0
}

const shareResults = async () => {
  const shareText = `I just discovered I might be missing $${formatMoney(moneyLeftOnTable.value)}/year in VA benefits! Check yours free at ClaimReady.`

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'My VA Benefits Analysis',
        text: shareText,
        url: window.location.origin + '/try-it'
      })
    } catch (err) {
      // User cancelled or error
    }
  } else {
    // Fallback: copy to clipboard
    await navigator.clipboard.writeText(shareText + ' ' + window.location.origin + '/try-it')
    // TODO: Show toast
  }
}

const signupWithGoogle = () => {
  // Store session ID in localStorage before redirect
  if (sessionId.value) {
    localStorage.setItem('pendingAnalysisSession', sessionId.value)
  }
  navigateTo('/auth/login?provider=google&returnTo=/try-it')
}
</script>
