/**
 * Middleware to redirect /analysis to /analyze
 * Only redirects the exact /analysis route, not /analysis/[documentId]
 */
export default defineNuxtRouteMiddleware((to) => {
  // Only redirect if path is exactly /analysis (no params, no query)
  if (to.path === '/analysis') {
    return navigateTo('/analyze', { replace: true })
  }
  // Otherwise, let the route continue (for /analysis/[documentId])
})

