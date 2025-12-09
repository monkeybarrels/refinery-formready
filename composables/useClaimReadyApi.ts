/**
 * Composable for making ClaimReady API calls
 * This is separate from useApi to allow for different API configurations
 */
export const useClaimReadyApi = () => {
  const config = useRuntimeConfig()

  /**
   * Get the ClaimReady API base URL
   */
  const getApiUrl = (endpoint: string = '') => {
    // Use claimReadyApiUrl config, fallback to localhost for dev
    let baseUrl = config.public.claimReadyApiUrl || 'http://localhost:3002'

    // Normalize endpoint to start with /
    if (endpoint && !endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`
    }

    return `${baseUrl}${endpoint}`
  }

  /**
   * Make an authenticated ClaimReady API call
   * Uses Firebase ID token for authentication
   */
  const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    // Get the Firebase ID token from localStorage
    const token = localStorage.getItem('auth_token')

    if (!token) {
      throw new Error('No authentication token available')
    }

    const url = getApiUrl(endpoint)
    console.log('[ClaimReady API]', options.method || 'GET', url)

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API error: ${response.status}`)
    }

    return response.json()
  }

  /**
   * GET request helper
   */
  const get = <T>(endpoint: string): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'GET' })
  }

  /**
   * POST request helper
   */
  const post = <T>(endpoint: string, body?: unknown): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  /**
   * PATCH request helper
   */
  const patch = <T>(endpoint: string, body?: unknown): Promise<T> => {
    return apiCall<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    })
  }

  /**
   * DELETE request helper
   */
  const del = <T>(endpoint: string): Promise<T> => {
    return apiCall<T>(endpoint, { method: 'DELETE' })
  }

  return {
    getApiUrl,
    apiCall,
    get,
    post,
    patch,
    del
  }
}
