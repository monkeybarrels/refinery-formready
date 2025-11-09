import { ref, computed, onMounted } from 'vue'

/**
 * Subscription composable for managing premium status
 * Works with both Authorizer (Phase 1) and Stripe (Phase 2) systems
 */
export const useSubscription = () => {
  const { apiCall } = useApi()
  
  // Subscription state
  const subscriptionStatus = ref<'free' | 'premium'>('free')
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Get user data from localStorage (set by useAuth)
  const getUserData = () => {
    if (import.meta.server) return null
    
    const userDataStr = localStorage.getItem('user_data')
    if (!userDataStr) return null
    
    try {
      return JSON.parse(userDataStr)
    } catch {
      return null
    }
  }
  
  /**
   * Check if user is premium
   * Phase 1: Checks isPremium from Authorizer (stored in localStorage)
   * Phase 2: Will check subscriptionStatus from Stripe
   */
  const isPremium = computed(() => {
    // Phase 1: Check Authorizer isPremium from localStorage
    const userData = getUserData()
    if (userData?.isPremium === true) {
      return true
    }
    
    // Phase 2: Check subscriptionStatus (when Stripe is integrated)
    // return subscriptionStatus.value === 'premium'
    
    return false
  })
  
  /**
   * Fetch subscription status from backend
   * Calls /api/auth/profile which returns isPremium and roles
   */
  const fetchSubscriptionStatus = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiCall('/api/auth/profile')
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status')
      }
      
      const data = await response.json()
      
      // Update subscription status based on isPremium
      if (data.user?.isPremium === true) {
        subscriptionStatus.value = 'premium'
      } else {
        subscriptionStatus.value = 'free'
      }
      
      // Update user_data in localStorage with latest info
      const userData = getUserData() || {}
      const updatedUserData = {
        ...userData,
        isPremium: data.user?.isPremium || false,
        roles: data.user?.roles || [],
      }
      localStorage.setItem('user_data', JSON.stringify(updatedUserData))
      
      // Cache subscription status
      localStorage.setItem('subscriptionStatus', subscriptionStatus.value)
      
      return subscriptionStatus.value
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch subscription status'
      console.error('Failed to fetch subscription status:', e)
      
      // On error, try to use cached status
      const cached = localStorage.getItem('subscriptionStatus')
      if (cached === 'premium' || cached === 'free') {
        subscriptionStatus.value = cached as 'free' | 'premium'
      }
      
      throw e
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Load subscription status from cache on initialization
   */
  const loadCachedStatus = () => {
    if (import.meta.server) return
    
    // Try to load from localStorage cache
    const cached = localStorage.getItem('subscriptionStatus')
    if (cached === 'premium' || cached === 'free') {
      subscriptionStatus.value = cached as 'free' | 'premium'
    }
    
    // Also check user_data for isPremium
    const userData = getUserData()
    if (userData?.isPremium === true) {
      subscriptionStatus.value = 'premium'
    }
  }
  
  /**
   * Check premium status (convenience method)
   * Returns current premium status without fetching
   */
  const checkPremium = (): boolean => {
    return isPremium.value
  }
  
  /**
   * Refresh subscription status immediately from backend
   * Useful after role updates or when premium status might have changed
   */
  const refreshSubscriptionStatus = async () => {
    return fetchSubscriptionStatus()
  }
  
  // Load cached status on mount
  onMounted(() => {
    loadCachedStatus()
    // Fetch fresh status on mount to ensure we have latest premium status
    fetchSubscriptionStatus()
  })
  
  return {
    // State
    isPremium,
    subscriptionStatus,
    loading,
    error,
    
    // Methods
    fetchSubscriptionStatus,
    refreshSubscriptionStatus, // Alias for immediate refresh
    checkPremium,
    loadCachedStatus,
  }
}

