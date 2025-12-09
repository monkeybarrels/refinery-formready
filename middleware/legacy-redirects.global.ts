/**
 * Global middleware to redirect legacy/deleted routes to appropriate pages.
 * This prevents 404s on routes that may be bookmarked or linked externally.
 */
export default defineNuxtRouteMiddleware((to) => {
  const redirects: Record<string, string> = {
    '/analyze': '/try-it',
    '/dashboard': '/try-it',
    '/files': '/pricing',
    '/documents': '/pricing',
    '/claim-status': '/try-it',
    '/premium-features': '/pricing',
    '/test-analyze': '/try-it',
  }

  // Check for exact match
  if (redirects[to.path]) {
    return navigateTo(redirects[to.path], { redirectCode: 301 })
  }

  // Check for prefix matches (e.g., /analysis/*, /results/*, /admin/*)
  const prefixRedirects: Record<string, string> = {
    '/analysis': '/try-it',
    '/results': '/try-it',
    '/admin': '/',
    '/va-document': '/try-it',
    '/forms': '/try-it',
  }

  for (const [prefix, redirect] of Object.entries(prefixRedirects)) {
    if (to.path.startsWith(prefix)) {
      return navigateTo(redirect, { redirectCode: 301 })
    }
  }
})
