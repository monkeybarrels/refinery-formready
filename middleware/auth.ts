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

  // Quick local check first
  if (!isAuthenticated()) {
    console.log('🔒 No valid local session, redirecting to login')
    return navigateTo(`/auth/login?redirect=${to.path}`)
  }

  // Validate with backend (async check)
  const userData = await validateSession()
  if (!userData) {
    console.log('🔒 Session expired or invalid, redirecting to login')
    return navigateTo(`/auth/login?session_expired=true&redirect=${to.path}`)
  }

  // Session is valid, allow navigation
  console.log('✅ Session valid, allowing navigation to', to.path)
})
