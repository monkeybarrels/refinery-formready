<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation
      :show-new-analysis="true"
      :show-dashboard="true"
      :show-user-menu="true"
    />

    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Breadcrumbs -->
        <div class="mb-6">
          <Breadcrumb theme="dark" />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-4xl font-bold mb-2">Profile</h1>
            <p class="text-xl text-blue-100">Manage your account information</p>
          </div>
          <div class="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Icon name="heroicons:user" class="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-slate-600">Loading profile...</span>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
            <h2 class="text-2xl font-bold text-slate-900 mb-6">Personal Information</h2>

            <form @submit.prevent="saveProfile" class="space-y-6">
              <!-- First Name -->
              <div>
                <label for="firstName" class="block text-sm font-medium text-slate-700 mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="profileForm.firstName"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <!-- Last Name -->
              <div>
                <label for="lastName" class="block text-sm font-medium text-slate-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="profileForm.lastName"
                  type="text"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  v-model="profileForm.email"
                  type="email"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                  placeholder="your.email@example.com"
                  disabled
                />
                <p class="mt-1 text-sm text-slate-500">Email cannot be changed</p>
              </div>

              <!-- Service Branch -->
              <div>
                <label for="serviceBranch" class="block text-sm font-medium text-slate-700 mb-2">
                  Service Branch
                </label>
                <select
                  id="serviceBranch"
                  v-model="profileForm.serviceBranch"
                  @change="onBranchChange"
                  class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select your service branch</option>
                  <option value="army">Army</option>
                  <option value="navy">Navy</option>
                  <option value="air-force">Air Force</option>
                  <option value="marine-corps">Marine Corps</option>
                  <option value="coast-guard">Coast Guard</option>
                </select>
              </div>

              <!-- Military Occupation Code -->
              <div>
                <label for="militaryOccupationCode" class="block text-sm font-medium text-slate-700 mb-2">
                  Military Occupation Code
                  <span class="text-sm font-normal text-slate-500">(Optional)</span>
                </label>
                <div class="relative">
                  <input
                    id="militaryOccupationCode"
                    v-model="mosSearchQuery"
                    @input="onMosSearch"
                    @focus="showMosDropdown = true"
                    type="text"
                    class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    :placeholder="getMosPlaceholder()"
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
                <p class="mt-1 text-sm text-slate-500">
                  {{ getBranchDescription() }}
                </p>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div class="flex items-center">
                  <Icon name="heroicons:exclamation-circle" class="w-5 h-5 text-red-600 mr-2" />
                  <span class="text-red-800">{{ error }}</span>
                </div>
              </div>

              <!-- Success Message -->
              <div v-if="success" class="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div class="flex items-center">
                  <Icon name="heroicons:check-circle" class="w-5 h-5 text-green-600 mr-2" />
                  <span class="text-green-800">Profile updated successfully!</span>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-4">
                <Button
                  type="button"
                  @click="resetForm"
                  variant="secondary"
                  :disabled="saving"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  :disabled="saving"
                >
                  <span v-if="!saving">Save Changes</span>
                  <span v-else class="flex items-center">
                    <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        <!-- Profile Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-xl shadow-lg p-8 border border-slate-200 sticky top-24">
            <h3 class="text-lg font-semibold text-slate-900 mb-4">Account Summary</h3>

            <div class="space-y-4">
              <div>
                <div class="text-sm text-slate-500 mb-1">Member Since</div>
                <div class="font-medium text-slate-900">{{ formatDate(profile.createdAt) }}</div>
              </div>

              <div class="pt-4 border-t border-slate-200">
                <div class="text-sm text-slate-500 mb-1">Account Status</div>
                <Badge
                  :text="profile.isPremium ? 'Premium' : 'Free'"
                  :variant="profile.isPremium ? 'success' : 'neutral'"
                />
              </div>

              <div class="pt-4 border-t border-slate-200">
                <div class="text-sm text-slate-500 mb-1">Documents Analyzed</div>
                <div class="font-medium text-slate-900">{{ profile.totalDocuments || 0 }}</div>
              </div>

              <!-- Premium Upsell -->
              <div v-if="!profile.isPremium" class="pt-4 border-t border-slate-200">
                <div class="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200">
                  <div class="text-center mb-3">
                    <Icon name="heroicons:star" class="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <div class="font-bold text-amber-900 text-sm mb-1">COMING SOON</div>
                    <div class="text-xs text-amber-800">Premium Features</div>
                  </div>
                  <p class="text-xs text-slate-700 text-center">
                    Advanced analysis and form generation launching soon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Button from '~/components/atoms/Button.vue'
import Badge from '~/components/atoms/Badge.vue'
import Navigation from '~/components/organisms/Navigation.vue'
import Breadcrumb from '~/components/molecules/Breadcrumb.vue'

// Head
useHead({
  title: 'Profile - ClaimReady',
  meta: [
    { name: 'description', content: 'Manage your ClaimReady profile and account information' }
  ]
})

const router = useRouter()

// State
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const success = ref(false)

const profile = reactive({
  userId: '',
  email: '',
  firstName: '',
  lastName: '',
  serviceBranch: '',
  militaryOccupationCode: '',
  isPremium: false,
  createdAt: new Date().toISOString(),
  totalDocuments: 0
})

const profileForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  serviceBranch: '',
  militaryOccupationCode: ''
})

// MOS Selector state
const mosSearchQuery = ref('')
const showMosDropdown = ref(false)
const selectedOccupation = ref<any>(null)
const allOccupations = ref<any[]>([])
const filteredOccupations = ref<any[]>([])

// Load profile on mount
onMounted(async () => {
  const { requireAuth, setupSessionMonitoring } = useAuth()

  // Require authentication - will redirect if not authenticated
  const isAuth = await requireAuth()
  if (!isAuth) {
    return // Already redirected by requireAuth
  }

  // Set up session monitoring for auto-logout
  setupSessionMonitoring()

  try {
    await loadProfile()
  } catch (err) {
    console.error('Failed to load profile:', err)
  } finally {
    loading.value = false
  }
})

// Load profile from API
const loadProfile = async () => {
  try {
    const { apiCall } = useApi()
    const response = await apiCall('/api/auth/profile')

    if (!response.ok) {
      throw new Error('Failed to load profile')
    }

    const data = await response.json()
    Object.assign(profile, data.user)

    // Initialize form with current values
    profileForm.firstName = profile.firstName
    profileForm.lastName = profile.lastName
    profileForm.email = profile.email
    profileForm.serviceBranch = profile.serviceBranch
    profileForm.militaryOccupationCode = profile.militaryOccupationCode || ''

    // Load MOS if branch is set
    if (profile.serviceBranch) {
      await loadOccupations(profile.serviceBranch)

      // Set selected occupation if MOS code exists
      if (profile.militaryOccupationCode) {
        const occupation = allOccupations.value.find(occ => occ.code === profile.militaryOccupationCode)
        if (occupation) {
          selectedOccupation.value = occupation
          mosSearchQuery.value = occupation.code
        }
      }
    }
  } catch (err: any) {
    console.error('Load profile error:', err)
    throw err
  }
}

// Save profile changes
const saveProfile = async () => {
  saving.value = true
  error.value = null
  success.value = false

  try {
    const { apiCall } = useApi()
    const response = await apiCall('/api/auth/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        serviceBranch: profileForm.serviceBranch,
        militaryOccupationCode: profileForm.militaryOccupationCode
      })
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to update profile')
    }

    const data = await response.json()
    Object.assign(profile, data.user)

    success.value = true

    // Clear success message after 3 seconds
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err: any) {
    console.error('Save profile error:', err)
    error.value = err.message || 'Failed to update profile. Please try again.'
  } finally {
    saving.value = false
  }
}

// Reset form to current profile values
const resetForm = () => {
  profileForm.firstName = profile.firstName
  profileForm.lastName = profile.lastName
  profileForm.serviceBranch = profile.serviceBranch
  error.value = null
  success.value = false
}

// Format date helper
const formatDate = (dateString: string) => {
  if (!dateString) return 'Unknown'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// MOS Helper Functions
const getMosPlaceholder = () => {
  const placeholders: Record<string, string> = {
    'army': 'Search Army MOS (e.g., 11B, 68W)',
    'air-force': 'Search Air Force AFSC (e.g., 2A3X3)',
    'navy': 'Search Navy NEC (e.g., AT, CTN)',
    'marine-corps': 'Search Marine Corps MOS (e.g., 0311)',
    'coast-guard': 'Search Coast Guard Rating (e.g., BM)',
  }
  return placeholders[profileForm.serviceBranch] || 'Select service branch first'
}

const getBranchDescription = () => {
  const descriptions: Record<string, string> = {
    'army': 'Enter your Army Military Occupational Specialty (MOS) code',
    'air-force': 'Enter your Air Force Specialty Code (AFSC)',
    'navy': 'Enter your Navy Enlisted Classification (NEC) code',
    'marine-corps': 'Enter your Marine Corps MOS code',
    'coast-guard': 'Enter your Coast Guard rating',
  }
  return descriptions[profileForm.serviceBranch] || 'Select your service branch to choose your occupation code'
}

const onBranchChange = async () => {
  // Clear MOS selection when branch changes
  selectedOccupation.value = null
  mosSearchQuery.value = ''
  profileForm.militaryOccupationCode = ''
  filteredOccupations.value = []

  // Load occupations for the selected branch
  if (profileForm.serviceBranch) {
    await loadOccupations(profileForm.serviceBranch)
  }
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
  profileForm.militaryOccupationCode = occupation.code
  showMosDropdown.value = false
}

const clearOccupation = () => {
  selectedOccupation.value = null
  mosSearchQuery.value = ''
  profileForm.militaryOccupationCode = ''
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
</script>
