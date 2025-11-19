<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Patriotic Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Back to Home Link -->
    <div class="absolute top-4 left-4 z-10">
      <NuxtLink
        to="/"
        class="inline-flex items-center text-sm font-medium text-blue-800 hover:text-blue-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-blue-200 hover:shadow-md"
      >
        <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
        Back to ClaimReady
      </NuxtLink>
    </div>

    <div class="relative max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="bg-white p-4 rounded-full shadow-lg">
            <Icon name="heroicons:shield-check" class="w-8 h-8" color="blue-600" />
          </div>
        </div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Join ClaimReady</h2>
        <p class="text-slate-600">Made for veterans by veterans</p>
        <div class="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon name="heroicons:star" class="w-4 h-4 mr-2" color="red-600" />
          <span class="text-sm font-medium text-blue-800">Free Analysis + Premium Features</span>
        </div>
      </div>

      <!-- Signup Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <form @submit.prevent="handleSignup" class="space-y-6">
          <!-- Name Fields -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:envelope" class="w-4 h-4" color="slate-400" />
              </div>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="john.doe@example.com"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="heroicons:lock-closed" class="w-4 h-4" color="slate-400" />
              </div>
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Create a secure password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <Icon 
                  :name="showPassword ? 'eye-slash' : 'eye'" 
                  class="w-4 h-4" 
                  color="slate-400" 
                />
              </button>
            </div>
          </div>

          <!-- Service Branch -->
          <div>
            <label for="serviceBranch" class="block text-sm font-medium text-slate-700 mb-2">
              Service Branch
            </label>
            <select
              id="serviceBranch"
              v-model="form.serviceBranch"
              class="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select your branch</option>
              <option value="army">Army</option>
              <option value="navy">Navy</option>
              <option value="air-force">Air Force</option>
              <option value="marines">Marines</option>
              <option value="coast-guard">Coast Guard</option>
              <option value="space-force">Space Force</option>
            </select>
          </div>

          <!-- Military Occupation Code (Optional) -->
          <div>
            <label for="militaryOccupationCode" class="block text-sm font-medium text-slate-700 mb-2">
              Military Occupation Code (Optional)
            </label>
            <div class="relative">
              <input
                id="militaryOccupationCode"
                v-model="mosSearchQuery"
                @input="onMosSearch"
                @focus="showMosDropdown = true"
                type="text"
                class="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                :placeholder="getMosPlaceholder()"
                :disabled="!form.serviceBranch"
                autocomplete="off"
              />

              <!-- Dropdown results -->
              <div
                v-if="showMosDropdown && filteredOccupations.length > 0"
                class="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
              >
                <button
                  v-for="occupation in filteredOccupations"
                  :key="occupation.code"
                  type="button"
                  @click="selectOccupation(occupation)"
                  class="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-b-0 focus:outline-none focus:bg-blue-50"
                >
                  <div class="font-medium text-slate-900">{{ occupation.code }}</div>
                  <div class="text-sm text-slate-600">{{ occupation.title }}</div>
                </button>
              </div>

              <!-- Selected occupation display -->
              <div v-if="selectedOccupation" class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-blue-900">{{ selectedOccupation.code }}</div>
                    <div class="text-sm text-blue-700">{{ selectedOccupation.title }}</div>
                  </div>
                  <button
                    type="button"
                    @click="clearOccupation"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <Icon name="heroicons:x-mark" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <p class="mt-1 text-xs text-slate-500">
              Your MOS/AFSC/NEC helps us provide personalized claim guidance
            </p>
          </div>

          <!-- Terms and Privacy -->
          <div class="flex items-start">
            <input
              id="terms"
              v-model="form.acceptTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-1"
            />
            <label for="terms" class="ml-2 block text-sm text-slate-700">
              I agree to the
              <a href="/terms-of-service" class="text-blue-600 hover:text-blue-500">Terms of Service</a>
              and
              <a href="/privacy-policy" class="text-blue-600 hover:text-blue-500">Privacy Policy</a>
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <Icon name="exclamation-triangle" class="w-4 h-4 mr-2 mt-0.5" color="red-600" />
              <div class="text-sm text-red-800">{{ error }}</div>
            </div>
          </div>

          <!-- Submit Button -->
          <Button
            type="submit"
            variant="primary"
            :disabled="loading"
            class="w-full"
          >
            <Spinner v-if="loading" class="w-4 h-4 mr-2" color="red-600" />
            <Icon v-else name="user-plus" class="w-4 h-4 mr-2" />
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </Button>
        </form>

        <!-- Login Link -->
        <div class="mt-8 pt-6 border-t border-slate-200">
          <div class="text-center">
            <p class="text-sm text-slate-500">
              Already have an account? 
              <a href="/auth/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <!-- Premium Features Preview -->
      <div class="bg-gradient-to-r from-blue-50 to-amber-50 border border-blue-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-slate-900 mb-4 text-center">Premium Features</h3>
        <div class="grid grid-cols-1 gap-3">
          <div class="flex items-center">
            <Icon name="chart-line" class="w-4 h-4 mr-3" color="blue-600" />
            <span class="text-sm text-slate-700">Claim tracking over time</span>
          </div>
          <div class="flex items-center">
            <Icon name="heroicons:shield-check" class="w-4 h-4 mr-3" color="blue-600" />
            <span class="text-sm text-slate-700">Advanced analytics & predictions</span>
          </div>
          <div class="flex items-center">
            <Icon name="puzzle-piece" class="w-4 h-4 mr-3" color="blue-600" />
            <span class="text-sm text-slate-700">Chrome extension for VA.gov sync</span>
          </div>
          <div class="flex items-center">
            <Icon name="users" class="w-4 h-4 mr-3" color="blue-600" />
            <span class="text-sm text-slate-700">Personalized VSO recommendations</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Button from '~/components/atoms/Button.vue'
import Spinner from '~/components/atoms/Spinner.vue'

// Head
useHead({
  title: 'Sign Up - ClaimReady',
  meta: [
    { name: 'description', content: 'Join ClaimReady for free VA decision letter analysis and premium claim tracking' }
  ]
})

const router = useRouter()
const { login } = useAuth()

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  serviceBranch: '',
  militaryOccupationCode: '',
  acceptTerms: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// MOS Selector state
const mosSearchQuery = ref('')
const showMosDropdown = ref(false)
const selectedOccupation = ref<any>(null)
const allOccupations = ref<any[]>([])
const filteredOccupations = ref<any[]>([])

// Watch for service branch changes to load occupations
watch(() => form.serviceBranch, async (newBranch) => {
  // Clear MOS selection when branch changes
  selectedOccupation.value = null
  mosSearchQuery.value = ''
  form.militaryOccupationCode = ''
  filteredOccupations.value = []

  // Load occupations for the selected branch
  if (newBranch) {
    await loadOccupations(newBranch)
  }
})

// MOS Helper Functions
const getMosPlaceholder = () => {
  const placeholders: Record<string, string> = {
    'army': 'Search Army MOS (e.g., 11B, 68W)',
    'air-force': 'Search Air Force AFSC (e.g., 2A3X3)',
    'navy': 'Search Navy NEC (e.g., AT, CTN)',
    'marines': 'Search Marine Corps MOS (e.g., 0311)',
    'coast-guard': 'Search Coast Guard Rating (e.g., BM)',
    'space-force': 'Search Space Force AFSC'
  }
  return placeholders[form.serviceBranch] || 'Select service branch first'
}

const loadOccupations = async (branch: string) => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall(`/api/military-occupations/branch/${branch}`)

    if (!response.ok) {
      console.error('Failed to load occupations')
      return
    }

    const data = await response.json()
    allOccupations.value = data
    filteredOccupations.value = data.slice(0, 20) // Show first 20 by default
  } catch (err) {
    console.error('Error loading occupations:', err)
  }
}

const onMosSearch = () => {
  const query = mosSearchQuery.value.toLowerCase().trim()

  if (!query) {
    filteredOccupations.value = allOccupations.value.slice(0, 20)
    showMosDropdown.value = true
    return
  }

  filteredOccupations.value = allOccupations.value.filter(occ =>
    occ.code.toLowerCase().includes(query) ||
    occ.title.toLowerCase().includes(query)
  ).slice(0, 20)

  showMosDropdown.value = true
}

const selectOccupation = (occupation: any) => {
  selectedOccupation.value = occupation
  mosSearchQuery.value = occupation.code
  form.militaryOccupationCode = occupation.code
  showMosDropdown.value = false
}

const clearOccupation = () => {
  selectedOccupation.value = null
  mosSearchQuery.value = ''
  form.militaryOccupationCode = ''
}

// Close dropdown when clicking outside
if (process.client) {
  document.addEventListener('click', (e: any) => {
    const mosInput = document.getElementById('militaryOccupationCode')
    if (mosInput && !mosInput.contains(e.target)) {
      showMosDropdown.value = false
    }
  })
}

// Signup handler
const handleSignup = async () => {
  loading.value = true
  error.value = null

  try {
    // Use API composable for consistent URL handling
    const { apiCall } = useApi()
    const response = await apiCall('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(form)
    })

    const result = await response.json()

    if (result.success && result.accessToken) {
      // Prepare user data
      const userData = {
        userId: result.userId,
        email: result.email || form.email,
        firstName: result.firstName || form.firstName,
        lastName: result.lastName || form.lastName,
        serviceBranch: result.serviceBranch || form.serviceBranch,
        isPremium: result.isPremium || false
      }

      // Store token and session using useAuth composable (with userData)
      // This sets both auth_token AND token_expiry, which is required for isAuthenticated() to work
      const expiresIn = result.expiresIn || 86400 // Default 24 hours
      login(result.accessToken, expiresIn, userData)

      // Redirect to dashboard
      await router.push('/dashboard')
    } else {
      error.value = result.error || 'Signup failed'
    }
  } catch (err: any) {
    error.value = 'Signup failed. Please try again.'
    console.error('Signup error:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
