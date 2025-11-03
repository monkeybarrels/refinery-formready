import { onUnmounted } from 'vue'

/**
 * Authentication composable with session expiration detection
 * Handles token validation, expiration checking, and automatic logout
 */
export const useAuth = () => {
  const router = useRouter()
  const { apiCall } = useApi()

  /**
   * Check if user has a valid session
   * Returns true if logged in with valid token
   */
  const isAuthenticated = (): boolean => {
    if (import.meta.server) return false

    const token = localStorage.getItem('auth_token')
    const tokenExpiry = localStorage.getItem('token_expiry')

    if (!token) return false

    // Check if token is expired
    if (tokenExpiry) {
      const expiryTime = parseInt(tokenExpiry, 10)
      // Handle invalid/malformed expiry timestamp
      if (isNaN(expiryTime)) {
        clearSession()
        return false
      }
      if (Date.now() > expiryTime) {
        // Token expired, clean up
        clearSession()
        return false
      }
    }

    return true
  }

  /**
   * Validate token with backend
   * Returns user data if valid, null if invalid/expired
   */
  const validateSession = async (): Promise<any | null> => {
    try {
      const response = await apiCall('/api/auth/profile')

      if (response.status === 401 || response.status === 403) {
        // Session expired or invalid
        clearSession()
        return null
      }

      if (!response.ok) {
        return null
      }

      const userData = await response.json()
      return userData
    } catch (error) {
      console.error('Session validation failed:', error)
      return null
    }
  }

  /**
   * Clear session data and redirect to login
   */
  const clearSession = () => {
    if (import.meta.server) return

    localStorage.removeItem('auth_token')
    localStorage.removeItem('token_expiry')
    localStorage.removeItem('user_data')
  }

  /**
   * Logout user and redirect to login page
   */
  const logout = async (redirectToLogin = true) => {
    clearSession()

    if (redirectToLogin) {
      await router.push('/auth/login?session_expired=true')
    }
  }

  /**
   * Login and store session data
   */
  const login = (token: string, expiresIn: number = 86400) => {
    if (import.meta.server) return

    localStorage.setItem('auth_token', token)

    // Set expiry time (default 24 hours)
    const expiryTime = Date.now() + (expiresIn * 1000)
    localStorage.setItem('token_expiry', expiryTime.toString())
  }

  /**
   * Require authentication - redirect if not authenticated
   * Call this in onMounted() on protected pages
   */
  const requireAuth = async () => {
    // Basic auth check
    if (!isAuthenticated()) {
      await logout()
      return false
    }

    // Validate with backend
    const userData = await validateSession()
    if (!userData) {
      await logout()
      return false
    }

    return true
  }

  /**
   * Set up automatic session monitoring
   * Checks session validity every 5 minutes
   */
  const setupSessionMonitoring = () => {
    if (import.meta.server) return

    // Check every 5 minutes
    const intervalId = setInterval(async () => {
      if (!isAuthenticated()) {
        clearInterval(intervalId)
        await logout()
      }
    }, 5 * 60 * 1000) // 5 minutes

    // Also check on visibility change (when user comes back to tab)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        if (!isAuthenticated()) {
          await logout()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup on unmount
    onUnmounted(() => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    })
  }

  return {
    isAuthenticated,
    validateSession,
    requireAuth,
    login,
    logout,
    clearSession,
    setupSessionMonitoring
  }
}
