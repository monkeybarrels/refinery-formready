/**
 * Composable for making API calls with proper URL configuration
 * Updated: 2025-10-26 - Force Railway rebuild
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get the base API URL (without /api suffix - endpoints provide that)
   */
  const getApiUrl = (endpoint: string = '') => {
    let baseUrl = config.public.apiUrl
    if (window.location.hostname === 'claimready.io') {
      baseUrl = 'https://api.claimready.io'
    }

    // Normalize endpoint to start with /
    if (endpoint && !endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`
    }

    return `${baseUrl}${endpoint}`
  }
  
  /**
   * Get the full API URL for a specific endpoint
   */
  const getFullApiUrl = (endpoint: string) => {
    return `${config.public.apiUrl}${endpoint}`
  }
  
  /**
   * Make an authenticated API call
   * Automatically handles session expiration (401) and premium errors (403)
   */
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token')

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
    const url = getApiUrl(endpoint)
    console.log('🔧 API URL:', url)
    
    let response: Response
    try {
      response = await fetch(url, {
        ...options,
        credentials: 'include',
        mode: 'cors',
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      })
    } catch (error) {
      // Network error - don't treat as auth failure
      console.error('🔴 Network error:', error)
      throw error
    }

    // Handle 401 (Unauthorized) - actual auth failure
    if (response.status === 401) {
      console.log('🔒 Session expired (401), logging out')
      const { logout } = useAuth()
      await logout(true)
      return response
    }

    // Handle 403 (Forbidden) - could be premium error or other permission issue
    if (response.status === 403) {
      try {
        // Clone response to read body without consuming it
        const responseClone = response.clone()
        const errorData = await responseClone.json()
        
        // Check if it's a premium_required error
        if (errorData.error === 'premium_required') {
          console.log('🔒 Premium required, redirecting to pricing')
          // Redirect to pricing page (or upgradeUrl from error response)
          if (typeof window !== 'undefined') {
            const upgradeUrl = errorData.upgradeUrl || '/pricing'
            navigateTo(upgradeUrl)
          }
          return response
        }
        
        // Other 403 errors - don't auto-logout, let calling code handle it
        console.log('🔒 Access forbidden (403) - not a premium error, letting calling code handle')
        return response
      } catch (parseError) {
        // Can't parse JSON - might be a different error format
        // Don't auto-logout, let calling code handle it
        console.log('🔒 Access forbidden (403) - unable to parse error, letting calling code handle')
        return response
      }
    }

    return response
  }
  
  return {
    getApiUrl,
    getFullApiUrl,
    apiCall
  }
}
