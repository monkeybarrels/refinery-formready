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
    
    // Debug the original URL and environment
    console.log('🔧 URL Debug Info:', {
      originalApiUrl: baseUrl,
      isClient: process.client,
      hostname: process.client ? window.location.hostname : 'server',
      origin: process.client ? window.location.origin : 'server',
      userAgent: process.client ? navigator.userAgent : 'server',
      allConfig: config.public
    })
    
    // Handle the malformed URL issue by detecting and fixing it
    if (baseUrl.includes('/.claimready.io/')) {
      console.log('🔧 Detected malformed URL with domain duplication')
      // The URL is malformed like "https://claimready.io/.claimready.io/api"
      // We need to extract the correct domain
      const urlParts = baseUrl.split('/')
      const protocol = urlParts[0] // https:
      const domain = urlParts[2] // claimready.io
      baseUrl = `${protocol}//${domain}/api`
      console.log('🔧 Fixed malformed URL to:', baseUrl)
    }
    
    // Railway-specific fallback: if we're on claimready.io but API URL is malformed
    if (process.client && window.location.hostname === 'claimready.io' && baseUrl.includes('claimready.io')) {
      console.log('🔧 Railway fallback: Using current domain for API')
      // Use the current domain but point to the API service
      // This assumes the API is on a subdomain or different port
      baseUrl = 'https://claimready.io/api' // or whatever your actual API URL should be
      console.log('🔧 Railway fallback URL:', baseUrl)
    }
    
    // Remove /api suffix if it exists for auth endpoints
    if (baseUrl.endsWith('/api')) {
      baseUrl = baseUrl.replace('/api', '')
    }
    
    // Ensure endpoint starts with /
    if (endpoint && !endpoint.startsWith('/')) {
      endpoint = `/${endpoint}`
    }
    
    const finalUrl = `${baseUrl}${endpoint}`
    console.log('🔧 Final constructed URL:', finalUrl)
    
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
