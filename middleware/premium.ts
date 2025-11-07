/**
 * Premium middleware - protects routes requiring premium subscription
 * Usage: Add definePageMeta({ middleware: 'premium' }) to premium-only pages
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
  // Skip on server
  if (process.server) return

  const { isPremium, loading, fetchSubscriptionStatus, subscriptionStatus } = useSubscription()
  const { isAuthenticated } = useAuth()

  // Check authentication first
  if (!isAuthenticated()) {
    console.log('🔒 Premium page requires authentication, redirecting to login')
    return navigateTo(`/auth/login?redirect=${encodeURIComponent(to.path)}`)
  }

  // Always fetch fresh subscription status to ensure we have the latest
  try {
    console.log('🔍 Fetching subscription status for premium check...')
    await fetchSubscriptionStatus()
    
    // Debug logging
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
    console.log('📊 Subscription check:', {
      isPremium: isPremium.value,
      subscriptionStatus: subscriptionStatus.value,
      userDataIsPremium: userData?.isPremium,
      userRoles: userData?.roles,
    })
  } catch (error) {
    console.error('Failed to fetch subscription status:', error)
    // If fetch fails, check cached status
    const cached = localStorage.getItem('subscriptionStatus')
    console.log('⚠️ Using cached subscription status:', cached)
    if (cached !== 'premium') {
      console.log('🔒 Premium subscription required (fetch failed), redirecting to pricing')
      return navigateTo(`/pricing?redirect=${encodeURIComponent(to.path)}`)
    }
  }

  // Check premium status - check both computed and ref for reliability
  const hasPremium = isPremium.value || subscriptionStatus.value === 'premium'
  
  if (!hasPremium) {
    console.log('🔒 Premium subscription required, redirecting to pricing')
    return navigateTo(`/pricing?redirect=${encodeURIComponent(to.path)}`)
  }

  // User has premium access
  console.log('✅ Premium access granted for', to.path)
})

