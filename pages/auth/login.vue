<template>
  <!-- Updated: 2025-10-26 - Force Railway rebuild -->
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <!-- Patriotic Background Pattern -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div class="absolute top-40 left-40 w-80 h-80 bg-red-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>

    <div class="relative max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div class="flex justify-center mb-6">
          <div class="bg-white p-4 rounded-full shadow-lg">
            <svg viewBox="0 0 500 450" class="w-12 h-12">
              <path fill="#1844AF" d="M382.048828,204.017303 C384.137329,241.870575 382.818817,279.127991 365.279541,314.075073 C349.008820,346.494507 323.487305,369.639191 292.787628,387.646057 C283.643799,393.009338 274.064606,397.766907 264.285248,401.843292 C260.349274,403.483978 254.658905,404.137756 250.924759,402.538116 C216.989273,388.000610 186.671829,368.256348 163.935577,338.480591 C143.861755,312.191559 133.630356,282.210754 132.028839,249.318741 C131.422455,236.864822 131.801239,224.362930 132.155457,211.156189 C132.685333,195.382843 132.796799,180.336243 132.864258,165.289444 C132.866135,164.871918 132.396423,164.452255 132.146622,164.033600 C132.171158,158.642181 135.639664,156.230896 140.138016,154.509460 C172.677475,142.057144 205.186356,129.524872 237.726181,117.073486 C258.966125,108.945992 254.770325,108.950294 276.026062,117.030373 C308.437683,129.351196 340.819824,141.749588 373.236450,154.057220 C377.714417,155.757385 381.205658,158.177948 381.742554,163.758698 C381.651398,164.468506 381.757172,164.721695 381.862976,164.974899 C381.916382,166.061142 381.969818,167.147400 381.672363,168.944061 C381.221130,180.394806 381.100861,191.135071 381.065491,201.875626 C381.063141,202.588425 381.706055,203.303360 382.048828,204.017303 z"/>
              <path fill="#D9E2FA" d="M153.930206,171.754913 C181.884827,160.876312 210.150009,150.715439 237.661346,138.812180 C251.141983,132.979553 262.572845,132.862900 276.127136,138.709396 C303.518921,150.524551 331.709869,160.487000 359.876495,171.711914 C360.403076,172.463715 360.624420,172.717133 360.845764,172.970551 C360.892853,199.437943 362.484009,226.014374 360.623871,252.347015 C357.859375,291.481445 340.936279,324.363342 310.431122,349.713409 C295.258636,362.321930 278.556854,372.505157 260.645447,380.702026 C259.033478,381.439758 256.620392,381.885162 255.133789,381.222504 C227.336533,368.832092 201.896927,352.999268 182.835022,328.701324 C161.735550,301.806122 152.304794,270.873718 152.561554,236.838852 C152.719833,215.859421 152.846756,194.879745 153.268814,173.290253 C153.676636,172.371872 153.803421,172.063400 153.930206,171.754913 z"/>
              <path fill="#1843AF" d="M210.969055,213.889557 C222.692917,225.256042 234.156464,236.368149 245.836731,247.690369 C246.505905,247.061844 247.719070,245.981079 248.867249,244.835205 C269.034515,224.708389 289.183929,204.563644 309.360535,184.446213 C316.000000,177.826202 319.573425,177.851456 326.096039,184.420486 C327.387268,185.720917 328.697174,187.004135 329.953552,188.337601 C334.301697,192.952515 334.379395,196.761047 329.914215,201.396759 C324.251221,207.276062 318.437775,213.011139 312.660522,218.779663 C292.734039,238.675995 272.799988,258.564758 252.857941,278.445496 C246.453827,284.829895 242.322311,284.819000 235.937149,278.415588 C221.936661,264.375214 207.931808,250.339111 193.964828,236.265457 C187.504730,229.756058 187.473709,226.355789 193.624100,219.800171 C195.106049,218.220612 196.588165,216.641006 198.089096,215.079559 C202.624207,210.361511 204.983353,210.095810 210.969055,213.889557 z"/>
              <path fill="#F59F13" d="M229.742126,332.288513 C225.553955,328.450043 221.553314,324.931122 217.739731,321.220001 C216.529175,320.041962 215.817047,318.351685 214.876831,316.895813 C216.408981,316.184082 217.885498,315.044006 219.483124,314.836548 C225.576630,314.045258 231.701874,313.459930 237.829819,312.985748 C241.760696,312.681549 244.522400,311.469025 246.087646,307.326599 C248.370621,301.284607 251.311508,295.483459 254.144196,289.663452 C254.725479,288.469208 256.041107,286.898529 257.063354,286.864685 C258.033722,286.832550 259.445618,288.406708 260.002777,289.586487 C262.908325,295.738892 265.380981,302.105896 268.506134,308.138245 C269.449585,309.959351 271.846558,311.799866 273.842896,312.159424 C280.041962,313.275818 286.387909,313.548859 292.634644,314.443878 C294.777466,314.750885 296.795685,315.927795 298.870850,316.707306 C297.667389,318.548248 296.742401,320.673553 295.207733,322.176208 C290.811584,326.480530 286.306580,330.699646 281.567291,334.617035 C278.968842,336.764893 278.536926,339.009888 279.248718,342.048096 C280.724915,348.348999 282.079437,354.681549 283.301758,361.036102 C283.549744,362.325165 283.458374,364.356415 282.676483,364.975128 C281.903778,365.586487 279.859009,365.225189 278.717346,364.629364 C272.533966,361.402283 266.392212,358.081848 260.374695,354.556946 C257.754059,353.021851 255.581985,353.096619 253.027893,354.605347 C247.451096,357.899689 241.794022,361.066071 236.072647,364.101746 C234.763794,364.796204 233.061981,364.750031 231.541016,365.044708 C231.276947,363.527283 230.590927,361.941376 230.823975,360.504578 C231.700424,355.101410 232.493118,349.632812 234.048111,344.406158 C235.597931,339.196960 234.557098,335.402039 229.742126,332.288513 z"/>
            </svg>
          </div>
        </div>
        <h2 class="text-3xl font-bold text-slate-900 mb-2">Welcome Back</h2>
        <p class="text-slate-600">Sign in to your ClaimReady account</p>

        <!-- Session Expiration Warning -->
        <div v-if="sessionExpired" class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-center justify-center">
            <Icon name="heroicons:clock" class="w-5 h-5 text-amber-600 mr-2" />
            <span class="text-sm font-medium text-amber-800">Your session has expired. Please sign in again.</span>
          </div>
        </div>

        <div v-else class="mt-4 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon name="heroicons:star" class="w-4 h-4" color="blue-600" />
          <span class="text-sm font-medium text-blue-800">Made for Veterans by Veterans</span>
        </div>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="form.rememberMe"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-slate-700">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Forgot password?
              </a>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <Icon name="exclamation-triangle" class="w-4 h-4" color="red-600" />
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
            <Spinner v-if="loading" class="w-4 h-4" color="white"/>
            <Icon v-else name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </Button>
        </form>

        <!-- Divider -->
        <div class="mt-8 pt-6 border-t border-slate-200">
          <div class="text-center">
            <p class="text-sm text-slate-500">
              Don't have an account? 
              <a href="/auth/signup" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign up here
              </a>
            </p>
            <div class="mt-4">
              <a href="/" class="text-sm text-blue-600 hover:text-blue-500 transition-colors">
                ← Back to ClaimReady
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Security Notice -->
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div class="flex">
          <Icon name="heroicons:shield-exclamation" class="w-4 h-4" color="amber-600" />
          <div class="text-sm text-amber-800">
            <strong>Secure Login:</strong> Your data is encrypted and protected. We never share your information.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Button from '~/components/atoms/Button.vue'
import Spinner from '~/components/atoms/Spinner.vue'

// Head
useHead({
  title: 'Sign In - ClaimReady',
  meta: [
    { name: 'description', content: 'Sign in to your ClaimReady account for VA claim tracking and analysis' }
  ]
})

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

// Check for session expiration and redirect params
const sessionExpired = ref(false)
const redirectPath = ref('/try-it')

onMounted(() => {
  // Check if user was redirected due to expired session
  if (route.query.session_expired === 'true') {
    sessionExpired.value = true
  }

  // Check if there's a redirect path
  if (route.query.redirect && typeof route.query.redirect === 'string') {
    redirectPath.value = route.query.redirect
  }
})

// Form state
const form = reactive({
  email: '',
  password: '',
  rememberMe: false
})

const showPassword = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Login handler
const handleLogin = async () => {
  console.log('🔧 LOGIN: Force rebuild 2025-10-26 - API URL should be api.claimready.io')
  loading.value = true
  error.value = null

  try {
    // Use API composable for consistent URL handling
    const { apiCall } = useApi()
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(form)
    })

    // Check if response is ok (200 or 201)
    if (!response.ok && response.status !== 201) {
      const errorData = await response.json().catch(() => ({}))
      error.value = errorData.error || errorData.message || 'Login failed. Please try again.'
      return
    }

    const result = await response.json()

    console.log('🔵 LOGIN RESPONSE:', result)

    if (result.success && result.accessToken) {
      // Prepare user data
      const userData = {
        userId: result.userId,
        email: result.email || form.email,
        firstName: result.firstName,
        lastName: result.lastName,
        serviceBranch: result.serviceBranch,
        isPremium: result.isPremium || false
      }

      // Store token and session using useAuth composable (with userData)
      const expiresIn = result.expiresIn || 86400 // Default 24 hours
      login(result.accessToken, expiresIn, userData)

      // Determine redirect path based on user type
      // Premium users go to dashboard, non-premium to try-it
      // Unless there's an explicit redirect path from a protected route
      let finalRedirectPath = redirectPath.value
      if (redirectPath.value === '/try-it' && userData.isPremium) {
        finalRedirectPath = '/dashboard'
      }

      console.log('✅ Login successful, redirecting to:', finalRedirectPath, '(isPremium:', userData.isPremium, ')')

      // Redirect to appropriate page
      try {
        await router.push(finalRedirectPath)
        console.log('✅ Redirect successful')
      } catch (redirectError) {
        console.error('❌ Redirect error:', redirectError)
        // Fallback based on user type
        await router.push(userData.isPremium ? '/dashboard' : '/try-it')
      }
    } else {
      error.value = result.error || 'Invalid email or password'
      console.error('❌ Login failed:', result)
    }
  } catch (err: any) {
    error.value = 'Login failed. Please try again.'
    console.error('Login error:', err)
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
