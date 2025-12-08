<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex justify-between items-center">
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <NuxtLink
            :to="getHomeRoute()"
            class="flex items-center hover:opacity-80 transition-opacity"
            :title="getHomeRouteTitle()"
          >
            <div class="w-8 h-8 mr-3">
              <svg viewBox="0 0 512 512" class="w-full h-full">
                <path fill="#1844AF" d="M382.048828,204.017303 C384.137329,241.870575 382.818817,279.127991 365.279541,314.075073 C349.008820,346.494507 323.487305,369.639191 292.787628,387.646057 C283.643799,393.009338 274.064606,397.766907 264.285248,401.843292 C260.349274,403.483978 254.658905,404.137756 250.924759,402.538116 C216.989273,388.000610 186.671829,368.256348 163.935577,338.480591 C143.861755,312.191559 133.630356,282.210754 132.028839,249.318741 C131.422455,236.864822 131.801239,224.362930 132.155457,211.156189 C132.685333,195.382843 132.796799,180.336243 132.864258,165.289444 C132.866135,164.871918 132.396423,164.452255 132.146622,164.033600 C132.171158,158.642181 135.639664,156.230896 140.138016,154.509460 C172.677475,142.057144 205.186356,129.524872 237.726181,117.073486 C258.966125,108.945992 254.770325,108.950294 276.026062,117.030373 C308.437683,129.351196 340.819824,141.749588 373.236450,154.057220 C377.714417,155.757385 381.205658,158.177948 381.742554,163.758698 C381.651398,164.468506 381.757172,164.721695 381.862976,164.974899 C381.916382,166.061142 381.969818,167.147400 381.672363,168.944061 C381.221130,180.394806 381.100861,191.135071 381.065491,201.875626 C381.063141,202.588425 381.706055,203.303360 382.048828,204.017303 z"/>
                <path fill="#D9E2FA" d="M153.930206,171.754913 C181.884827,160.876312 210.150009,150.715439 237.661346,138.812180 C251.141983,132.979553 262.572845,132.862900 276.127136,138.709396 C303.518921,150.524551 331.709869,160.487000 359.876495,171.711914 C360.403076,172.463715 360.624420,172.717133 360.845764,172.970551 C360.892853,199.437943 362.484009,226.014374 360.623871,252.347015 C357.859375,291.481445 340.936279,324.363342 310.431122,349.713409 C295.258636,362.321930 278.556854,372.505157 260.645447,380.702026 C259.033478,381.439758 256.620392,381.885162 255.133789,381.222504 C227.336533,368.832092 201.896927,352.999268 182.835022,328.701324 C161.735550,301.806122 152.304794,270.873718 152.561554,236.838852 C152.719833,215.859421 152.846756,194.879745 153.268814,173.290253 C153.676636,172.371872 153.803421,172.063400 153.930206,171.754913 z"/>
                <path fill="#1843AF" d="M210.969055,213.889557 C222.692917,225.256042 234.156464,236.368149 245.836731,247.690369 C246.505905,247.061844 247.719070,245.981079 248.867249,244.835205 C269.034515,224.708389 289.183929,204.563644 309.360535,184.446213 C316.000000,177.826202 319.573425,177.851456 326.096039,184.420486 C327.387268,185.720917 328.697174,187.004135 329.953552,188.337601 C334.301697,192.952515 334.379395,196.761047 329.914215,201.396759 C324.251221,207.276062 318.437775,213.011139 312.660522,218.779663 C292.734039,238.675995 272.799988,258.564758 252.857941,278.445496 C246.453827,284.829895 242.322311,284.819000 235.937149,278.415588 C221.936661,264.375214 207.931808,250.339111 193.964828,236.265457 C187.504730,229.756058 187.473709,226.355789 193.624100,219.800171 C195.106049,218.220612 196.588165,216.641006 198.089096,215.079559 C202.624207,210.361511 204.983353,210.095810 210.969055,213.889557 z"/>
                <path fill="#F59F13" d="M229.742126,332.288513 C225.553955,328.450043 221.553314,324.931122 217.739731,321.220001 C216.529175,320.041962 215.817047,318.351685 214.876831,316.895813 C216.408981,316.184082 217.885498,315.044006 219.483124,314.836548 C225.576630,314.045258 231.701874,313.459930 237.829819,312.985748 C241.760696,312.681549 244.522400,311.469025 246.087646,307.326599 C248.370621,301.284607 251.311508,295.483459 254.144196,289.663452 C254.725479,288.469208 256.041107,286.898529 257.063354,286.864685 C258.033722,286.832550 259.445618,288.406708 260.002777,289.586487 C262.908325,295.738892 265.380981,302.105896 268.506134,308.138245 C269.449585,309.959351 271.846558,311.799866 273.842896,312.159424 C280.041962,313.275818 286.387909,313.548859 292.634644,314.443878 C294.777466,314.750885 296.795685,315.927795 298.870850,316.707306 C297.667389,318.548248 296.742401,320.673553 295.207733,322.176208 C290.811584,326.480530 286.306580,330.699646 281.567291,334.617035 C278.968842,336.764893 278.536926,339.009888 279.248718,342.048096 C280.724915,348.348999 282.079437,354.681549 283.301758,361.036102 C283.549744,362.325165 283.458374,364.356415 282.676483,364.975128 C281.903778,365.586487 279.859009,365.225189 278.717346,364.629364 C272.533966,361.402283 266.392212,358.081848 260.374695,354.556946 C257.754059,353.021851 255.581985,353.096619 253.027893,354.605347 C247.451096,357.899689 241.794022,361.066071 236.072647,364.101746 C234.763794,364.796204 233.061981,364.750031 231.541016,365.044708 C231.276947,363.527283 230.590927,361.941376 230.823975,360.504578 C231.700424,355.101410 232.493118,349.632812 234.048111,344.406158 C235.597931,339.196960 234.557098,335.402039 229.742126,332.288513 z"/>
              </svg>
            </div>
            <h1 class="text-xl font-bold text-blue-800">ClaimReady</h1>
          </NuxtLink>
        </div>
        
        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-6">
          <!-- Dashboard/Home -->
          <NuxtLink
            v-if="isAuthenticated"
            :to="getHomeRoute()"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': isHomeRoute() }"
          >
            {{ getHomeLabel() }}
            <span v-if="isHomeRoute()" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Analyze -->
          <NuxtLink
            to="/analyze"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': $route.path === '/analyze' }"
          >
            Analyze
            <span v-if="$route.path === '/analyze'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Files -->
          <NuxtLink
            v-if="isAuthenticated"
            to="/files"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold flex items-center relative py-1"
            :class="{ 'text-blue-600': $route.path === '/files' }"
          >
            Files
            <Icon
              v-if="!isPremiumUser"
              name="heroicons:lock-closed"
              class="w-3 h-3 ml-1 text-amber-500"
            />
            <span v-if="$route.path === '/files'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Documents (Always show but with different states) -->
          <NuxtLink
            v-if="isAuthenticated"
            to="/documents"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold flex items-center relative py-1"
            :class="{ 'text-blue-600': $route.path === '/documents' }"
          >
            Documents
            <Icon
              v-if="!isPremiumUser"
              name="heroicons:lock-closed"
              class="w-3 h-3 ml-1 text-amber-500"
            />
            <span v-if="$route.path === '/documents'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Claim Status -->
          <NuxtLink
            v-if="isAuthenticated"
            to="/claim-status"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': $route.path === '/claim-status' }"
          >
            Claim Status
            <span v-if="$route.path === '/claim-status'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Pricing (Show for non-premium or guests) -->
          <NuxtLink
            v-if="!isPremiumUser"
            to="/pricing"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': $route.path === '/pricing' }"
          >
            {{ isAuthenticated ? 'Upgrade' : 'Pricing' }}
            <span v-if="$route.path === '/pricing'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- About -->
          <NuxtLink
            to="/about"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': $route.path === '/about' }"
          >
            About
            <span v-if="$route.path === '/about'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Roadmap -->
          <NuxtLink
            to="/roadmap"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': $route.path === '/roadmap' }"
          >
            Roadmap
            <span v-if="$route.path === '/roadmap'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>

          <!-- Help -->
          <NuxtLink
            to="/faq"
            class="text-slate-600 hover:text-blue-600 transition-colors font-semibold relative py-1"
            :class="{ 'text-blue-600': $route.path === '/faq' }"
          >
            Help
            <span v-if="$route.path === '/faq'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
          </NuxtLink>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex items-center space-x-3">
          <!-- User Menu -->
          <div class="relative" v-if="isAuthenticated">
            <Button
              @click="toggleUserMenu"
              variant="outline"
              class="flex items-center"
            >
              <!-- User Avatar -->
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-2">
                <span class="text-white font-semibold text-xs">
                  {{ userInitials }}
                </span>
              </div>
              <!-- User Name or Account -->
              <span class="hidden sm:inline">
                {{ userDisplayName || 'Account' }}
              </span>
              <span class="sm:hidden">Account</span>
              <Icon name="heroicons:chevron-down" class="w-4 h-4 ml-2" />
            </Button>

            <!-- Dropdown Menu -->
            <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <!-- User Info Header -->
              <div v-if="userDisplayName || authState.user?.email" class="px-4 py-3 border-b border-gray-200">
                <div class="flex items-center">
                  <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-semibold text-sm">
                      {{ userInitials }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div v-if="userDisplayName" class="text-sm font-medium text-slate-900 truncate">
                      {{ userDisplayName }}
                    </div>
                    <div v-if="authState.user?.email" class="text-xs text-slate-500 truncate">
                      {{ authState.user.email }}
                    </div>
                  </div>
                </div>
                <div v-if="isPremiumUser" class="mt-2">
                  <PremiumBadge size="sm" />
                </div>
              </div>
              
              <!-- Menu Items -->
              <NuxtLink
                v-if="isPremiumUser"
                to="/files"
                class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <Icon name="heroicons:folder" class="w-4 h-4 mr-3" />
                Files
              </NuxtLink>
              <NuxtLink
                v-if="isPremiumUser"
                to="/documents"
                class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <Icon name="heroicons:document-text" class="w-4 h-4 mr-3" />
                Documents
              </NuxtLink>
              <div class="border-t border-gray-200 my-2"></div>
              <div class="px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Account
              </div>
              <NuxtLink
                to="/profile"
                class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <Icon name="heroicons:user" class="w-4 h-4 mr-3" />
                Profile
              </NuxtLink>
              <NuxtLink
                to="/settings"
                class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <Icon name="heroicons:cog-6-tooth" class="w-4 h-4 mr-3" />
                Settings
              </NuxtLink>
              <NuxtLink
                v-if="!isPremiumUser"
                to="/pricing"
                class="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-gray-50"
                @click="userMenuOpen = false"
              >
                <Icon name="heroicons:credit-card" class="w-4 h-4 mr-3" />
                Upgrade to Premium
              </NuxtLink>
              <div class="border-t border-gray-200 my-2"></div>
              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>

          <!-- Auth Links (Simple links, not buttons) -->
          <div v-else class="flex items-center space-x-4">
            <NuxtLink
              v-if="$route.path !== '/'"
              to="/pricing"
              class="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              :class="{ 'text-blue-600': $route.path === '/pricing' }"
            >
              Pricing
            </NuxtLink>
            <NuxtLink
              to="/auth/login"
              class="text-slate-600 hover:text-blue-600 transition-colors font-medium"
              :class="{ 'text-blue-600': $route.path === '/auth/login' }"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/try-it"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Try It Free
            </NuxtLink>
          </div>
        </div>
        
        <!-- Mobile Menu Button -->
        <Button 
          @click="toggleMobileMenu"
          variant="outline"
          class="md:hidden flex items-center"
        >
          <Icon name="heroicons:bars-3" class="w-4 h-4" />
        </Button>
      </div>
      
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-4 pt-4 border-t border-gray-200">
        <div class="space-y-2">
          <NuxtLink
            v-if="isAuthenticated"
            to="/dashboard"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Dashboard
          </NuxtLink>
          <NuxtLink
            to="/analyze"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Analyze Decision
          </NuxtLink>
          <NuxtLink
            v-if="!isAuthenticated"
            to="/try-it"
            class="block px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors font-semibold"
            @click="mobileMenuOpen = false"
          >
            Try It Free
          </NuxtLink>
          <NuxtLink
            v-if="isAuthenticated && isPremiumUser"
            to="/files"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Files
          </NuxtLink>
          <NuxtLink
            v-if="isAuthenticated && isPremiumUser"
            to="/documents"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Documents
          </NuxtLink>
          <NuxtLink
            v-if="!isPremiumUser"
            to="/pricing"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Pricing
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            About
          </NuxtLink>
          <NuxtLink
            to="/roadmap"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Roadmap
          </NuxtLink>
          <NuxtLink
            to="/faq"
            class="block px-3 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            @click="mobileMenuOpen = false"
          >
            Help
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import Button from "~/components/atoms/Button.vue";
import PremiumBadge from "~/components/atoms/PremiumBadge.vue";
import Logo from "~/components/atoms/Logo.vue";

interface Props {
  showNewAnalysis?: boolean
  showDashboard?: boolean
  showUserMenu?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showNewAnalysis: false,
  showDashboard: false,
  showUserMenu: false
})

const userMenuOpen = ref(false)
const mobileMenuOpen = ref(false)
const route = useRoute()

// Use global auth state and useAuth composable
const { isAuthenticated: isAuthFromComposable } = useAuth()
const { authState, userDisplayName, userInitials, isPremium } = useGlobalAuth()
const { isPremium: subscriptionPremium } = useSubscription()

// Computed auth state - check both local token and global state
const isAuthenticated = computed(() => {
  // Check useAuth composable first (validates token expiry)
  if (isAuthFromComposable()) {
    return true
  }
  // Fallback to global state
  return authState.value.isAuthenticated
})

// Combined premium status
const isPremiumUser = computed(() => {
  return isPremium.value || subscriptionPremium.value || authState.value.user?.isPremium === true
})

// Navigation helper functions
const getHomeRoute = () => {
  if (!isAuthenticated.value) {
    return '/'
  }
  // Premium users go to dashboard, free users to analyze
  return isPremiumUser.value ? '/dashboard' : '/analyze'
}

const getHomeRouteTitle = () => {
  if (!isAuthenticated.value) {
    return 'Go to home page'
  }
  return isPremiumUser.value ? 'Go to dashboard' : 'Go to analyze page'
}

const getHomeLabel = () => {
  return isPremiumUser.value ? 'Dashboard' : 'Home'
}

const isHomeRoute = () => {
  const homeRoute = getHomeRoute()
  return route.path === homeRoute
}

// Load user data from API
const loadUserData = async () => {
  if (import.meta.server) return
  
  const { apiCall } = useApi()
  const { setUser, setLoading } = useGlobalAuth()
  
  try {
    setLoading(true)
    const response = await apiCall('/api/auth/profile')
    
    if (response.ok) {
      const data = await response.json()
      if (data.user) {
        setUser(data.user)
        
        // Also update localStorage
        localStorage.setItem('user_data', JSON.stringify(data.user))
      }
    }
  } catch (error) {
    console.error('Failed to load user data:', error)
  } finally {
    setLoading(false)
  }
}

// Watch for auth state changes and update global state
watch(() => isAuthFromComposable(), (newValue) => {
  if (newValue) {
    // Load user data when authenticated
    loadUserData()
  } else {
    // Clear user data when not authenticated
    const { clearUser } = useGlobalAuth()
    clearUser()
  }
}, { immediate: true })

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  userMenuOpen.value = false
}

const handleLogout = async () => {
  const { logout } = useAuth()
  const { clearUser } = useGlobalAuth()
  
  // Clear global state
  clearUser()
  
  // Close menu
  userMenuOpen.value = false
  
  // Logout (clears localStorage and redirects)
  await logout(true)
}

// Close menus when clicking outside
onMounted(() => {
  // Initialize auth state from storage
  const { initializeFromStorage } = useGlobalAuth()
  initializeFromStorage()
  
  // Load user data if authenticated
  if (isAuthenticated.value) {
    loadUserData()
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (userMenuOpen.value || mobileMenuOpen.value) {
      const target = event.target as HTMLElement
      if (!target.closest('.relative')) {
        userMenuOpen.value = false
        mobileMenuOpen.value = false
      }
    }
  }

  document.addEventListener('click', handleClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})
</script>
