/**
 * Auth middleware - protects routes requiring authentication
 * Usage: Add definePageMeta({ middleware: 'auth' }) to protected pages
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip on server
  if (process.server) return

  // Public routes that don't require auth
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/analyze', // Anonymous analysis page
    '/results' // Anonymous results page (starts with /results)
  ]

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/results') {
      return to.path.startsWith('/results/')
    }
    return to.path === route
  })

  if (isPublicRoute) {
    return
  }

  // Check authentication
  const { isAuthenticated, validateSession } = useAuth()

  // CRITICAL: Only redirect if token is actually missing or expired
  // If user has a valid token, they should NEVER be redirected away from navigation
  if (!isAuthenticated()) {
    console.log('🔒 No valid local session, redirecting to login')
    return navigateTo(`/auth/login?redirect=${to.path}`)
  }

  // Try to validate with backend, but don't redirect on network errors
  // If user has a valid token, allow them through even if backend validation fails
  // This ensures logged-in users always have access to navigation
  try {
    const userData = await validateSession()
    if (userData) {
      console.log('✅ Session validated with backend, allowing navigation to', to.path)
    } else {
      // validateSession returned null, but user has a valid token
      // This could be a network error or temporary backend issue
      // Don't redirect - let them through so they have navigation
      console.log('⚠️ Backend validation failed, but token exists - allowing navigation (user has session)')
    }
  } catch (error) {
    // Network error or other issue - don't redirect logged-in users
    // They have a valid token, so let them through
    console.log('⚠️ Validation error, but token exists - allowing navigation (user has session):', error)
  }

  // User has a valid token - always allow navigation
  console.log('✅ Allowing navigation to', to.path, '(user has valid session)')
})
