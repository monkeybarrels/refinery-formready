/**
 * Composable for making API calls with proper URL configuration
 */
export const useApi = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get the base API URL (without /api suffix for auth endpoints)
   */
  const getApiUrl = (endpoint: string = '') => {
    let baseUrl = config.public.apiUrl
    
    // Remove /api suffix if it exists
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.replace('/api', '')
    }
    
    // Ensure endpoint starts with /
    if (endpoint && !endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`
    }
    
    const finalUrl = `${baseUrl}${endpoint}`
    console.log('🔧 API URL Debug:', {
      originalApiUrl: config.public.apiUrl,
      baseUrl,
      endpoint,
      finalUrl
    })
    
    return finalUrl
  }
  
  /**
   * Get the full API URL for a specific endpoint
   */
  const getFullApiUrl = (endpoint: string) => {
    return `${config.public.apiUrl}${endpoint}`
  }
  
  /**
   * Make an authenticated API call
   */
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('auth_token')
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
    
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    })
    
    return response
  }
  
  return {
    getApiUrl,
    getFullApiUrl,
    apiCall
  }
}
