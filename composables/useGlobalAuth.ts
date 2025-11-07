import { computed, readonly } from 'vue'

/**
 * Global authentication state composable
 * Provides reactive auth state that all components can use
 * Uses Nuxt useState for SSR-safe global state
 */
export const useGlobalAuth = () => {
  // Global auth state (SSR-safe with useState)
  const authState = useState('globalAuth', () => ({
    isAuthenticated: false,
    user: null as {
      id?: string
      email?: string
      firstName?: string
      lastName?: string
      isPremium?: boolean
      roles?: string[]
    } | null,
    loading: false,
    error: null as string | null,
  }))

  /**
   * Update authentication state
   */
  const updateAuthState = (updates: {
    isAuthenticated?: boolean
    user?: any
    loading?: boolean
    error?: string | null
  }) => {
    if (updates.isAuthenticated !== undefined) {
      authState.value.isAuthenticated = updates.isAuthenticated
    }
    if (updates.user !== undefined) {
      authState.value.user = updates.user
    }
    if (updates.loading !== undefined) {
      authState.value.loading = updates.loading
    }
    if (updates.error !== undefined) {
      authState.value.error = updates.error
    }
  }

  /**
   * Set user data
   */
  const setUser = (user: any) => {
    authState.value.user = user
    authState.value.isAuthenticated = !!user
  }

  /**
   * Clear user data (logout)
   */
  const clearUser = () => {
    authState.value.user = null
    authState.value.isAuthenticated = false
    authState.value.error = null
  }

  /**
   * Set loading state
   */
  const setLoading = (loading: boolean) => {
    authState.value.loading = loading
  }

  /**
   * Set error state
   */
  const setError = (error: string | null) => {
    authState.value.error = error
  }

  /**
   * Initialize auth state from localStorage (client-side only)
   */
  const initializeFromStorage = () => {
    if (import.meta.server) return

    const token = localStorage.getItem('auth_token')
    const userDataStr = localStorage.getItem('user_data')

    if (token) {
      authState.value.isAuthenticated = true
      
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr)
          authState.value.user = userData
        } catch {
          // Invalid user data, ignore
        }
      }
    }
  }

  /**
   * Get user display name
   */
  const userDisplayName = computed(() => {
    if (!authState.value.user) return null
    
    const { firstName, lastName, email } = authState.value.user
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    if (firstName) {
      return firstName
    }
    if (email) {
      return email.split('@')[0]
    }
    return 'User'
  })

  /**
   * Get user initials for avatar
   */
  const userInitials = computed(() => {
    if (!authState.value.user) return 'U'
    
    const { firstName, lastName, email } = authState.value.user
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    if (firstName) {
      return firstName[0].toUpperCase()
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return 'U'
  })

  /**
   * Check if user is premium
   */
  const isPremium = computed(() => {
    return authState.value.user?.isPremium === true
  })

  // Initialize from storage on client-side mount
  if (import.meta.client) {
    initializeFromStorage()
  }

  return {
    // State (readonly to prevent direct mutation)
    authState: readonly(authState),
    isAuthenticated: computed(() => authState.value.isAuthenticated),
    user: computed(() => authState.value.user),
    loading: computed(() => authState.value.loading),
    error: computed(() => authState.value.error),
    
    // Computed properties
    userDisplayName,
    userInitials,
    isPremium,
    
    // Methods
    updateAuthState,
    setUser,
    clearUser,
    setLoading,
    setError,
    initializeFromStorage,
  }
}

