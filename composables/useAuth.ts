import { onUnmounted } from 'vue'

/**
 * Authentication composable with session expiration detection and automatic renewal
 * Handles token validation, expiration checking, automatic renewal, and logout
 */
export const useAuth = () => {
  const router = useRouter()
  const { apiCall } = useApi()

  // Track last user activity
  let lastActivityTime = Date.now()
  const ACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes of inactivity = timeout
  const REFRESH_THRESHOLD = 15 * 60 * 1000 // Refresh token if less than 15 minutes remaining

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
   * Update activity timestamp
   */
  const updateActivity = () => {
    lastActivityTime = Date.now()
  }

  /**
   * Check if user has been active recently
   */
  const isUserActive = (): boolean => {
    return Date.now() - lastActivityTime < ACTIVITY_TIMEOUT
  }

  /**
   * Check if token needs refresh
   */
  const needsRefresh = (): boolean => {
    const tokenExpiry = localStorage.getItem('token_expiry')
    if (!tokenExpiry) return false

    const expiryTime = parseInt(tokenExpiry, 10)
    if (isNaN(expiryTime)) return false

    const timeUntilExpiry = expiryTime - Date.now()
    return timeUntilExpiry > 0 && timeUntilExpiry < REFRESH_THRESHOLD
  }

  /**
   * Refresh the authentication token
   */
  const refreshToken = async (): Promise<boolean> => {
    try {
      // Get current token
      const currentToken = localStorage.getItem('auth_token')
      if (!currentToken) return false

      // Call profile endpoint which will validate and potentially refresh the token
      const response = await apiCall('/api/auth/profile')

      if (response.ok) {
        const userData = await response.json()

        // If response includes a new token, update it
        if (userData.accessToken) {
          login(userData.accessToken)
        }

        return true
      }

      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  /**
   * Validate token with backend
   * Returns user data if valid, null if invalid/expired
   * Only clears session on actual 401 auth errors, not on 403 (premium) errors
   */
  const validateSession = async (): Promise<any | null> => {
    try {
      const response = await apiCall('/api/auth/profile')

      // Only clear session on 401 (actual auth failure)
      if (response.status === 401) {
        clearSession()
        return null
      }

      // 403 might be premium error, not auth error - don't clear session
      if (response.status === 403) {
        // Check if it's a premium error
        try {
          const errorData = await response.clone().json()
          if (errorData.error === 'premium_required') {
            // Not an auth error, session is still valid
            // Return null to indicate validation didn't succeed, but don't clear session
            return null
          }
        } catch {
          // Can't parse - might be auth error, but be conservative and don't clear
          // Let the calling code decide
          return null
        }
      }

      if (!response.ok) {
        // Other errors - don't clear session, just return null
        return null
      }

      const userData = await response.json()
      return userData
    } catch (error) {
      // Network error - don't clear session, just return null
      console.error('Session validation failed (network error):', error)
      return null
    }
  }

  /**
   * Clear session data
   */
  const clearSession = () => {
    if (import.meta.server) return

    localStorage.removeItem('auth_token')
    localStorage.removeItem('token_expiry')
    localStorage.removeItem('user_data')
    
    // Update global auth state
    const { clearUser } = useGlobalAuth()
    clearUser()
  }

  /**
   * Logout user and redirect to login page
   */
  const logout = async (redirectToLogin = true) => {
    clearSession()

    // Update global auth state
    const { clearUser } = useGlobalAuth()
    clearUser()

    if (redirectToLogin) {
      await router.push('/auth/login?session_expired=true')
    }
  }

  /**
   * Login and store session data
   */
  const login = (token: string, expiresIn: number = 86400, userData?: any) => {
    if (import.meta.server) return

    localStorage.setItem('auth_token', token)

    // Set expiry time (default 24 hours)
    const expiryTime = Date.now() + (expiresIn * 1000)
    localStorage.setItem('token_expiry', expiryTime.toString())

    // Update global auth state
    const { setUser, updateAuthState } = useGlobalAuth()
    updateAuthState({ isAuthenticated: true })
    
    if (userData) {
      setUser(userData)
      localStorage.setItem('user_data', JSON.stringify(userData))
    }
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
   * Set up automatic session monitoring with token refresh
   * Tracks user activity and refreshes token before expiration
   */
  const setupSessionMonitoring = () => {
    if (import.meta.server) return

    // Track user activity
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => {
      updateActivity()
    }

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true })
    })

    // Check session and refresh token every 5 minutes
    const intervalId = setInterval(async () => {
      // If not authenticated, clean up and logout
      if (!isAuthenticated()) {
        clearInterval(intervalId)
        await logout()
        return
      }

      // If user has been inactive for too long, logout
      if (!isUserActive()) {
        clearInterval(intervalId)
        await logout()
        return
      }

      // If token needs refresh and user is active, refresh it
      if (needsRefresh() && isUserActive()) {
        const refreshed = await refreshToken()
        if (!refreshed) {
          // Refresh failed, validate session
          const isValid = await validateSession()
          if (!isValid) {
            clearInterval(intervalId)
            await logout()
          }
        }
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    // Check on visibility change (when user comes back to tab)
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        updateActivity()

        if (!isAuthenticated()) {
          await logout()
          return
        }

        // Try to refresh token if needed when user returns
        if (needsRefresh() && isUserActive()) {
          await refreshToken()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup on unmount
    onUnmounted(() => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
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
