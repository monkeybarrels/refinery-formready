// https://nuxt.com/docs/api/configuration/nuxt-config
// FORCE RAILWAY REBUILD - 2025-10-28 - Fix /api prefix issue
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon', '@nuxtjs/plausible'],

  // Icon configuration
  icon: {
    collections: ['heroicons']
  },

  // Plausible Analytics configuration
  plausible: {
    // Domain will be set via NUXT_PUBLIC_PLAUSIBLE_DOMAIN env var
    // For production, set this to 'claimready.io'
    domain: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN || '',
    // Ignore localhost/development domains
    ignoredHostnames: ['localhost'],
    // Enable server-side proxy to prevent ad-blocker issues
    apiHost: process.env.NUXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io',
    // Automatic page view tracking
    autoPageviews: true,
    // Track outbound links automatically
    autoOutboundTracking: true,
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001',
      authorizerUrl: process.env.NUXT_PUBLIC_AUTHORIZER_URL || 'https://auth.claimready.io',
      authorizerClientId: process.env.NUXT_PUBLIC_AUTHORIZER_CLIENT_ID || '9c81da5e-0635-43c5-bcef-c629174c7c6f',
      authorizerRedirectUrl: process.env.NUXT_PUBLIC_AUTHORIZER_REDIRECT_URL || 'http://localhost:3000',

      // New Relic Browser Monitoring
      newRelicEnabled: process.env.NEW_RELIC_ENABLED || 'false',
      newRelicBrowserLicenseKey: process.env.NEW_RELIC_BROWSER_LICENSE_KEY || '',
      newRelicBrowserApplicationId: process.env.NEW_RELIC_BROWSER_APPLICATION_ID || '',
      newRelicBrowserAccountId: process.env.NEW_RELIC_BROWSER_ACCOUNT_ID || '',
      newRelicBrowserTrustKey: process.env.NEW_RELIC_BROWSER_TRUST_KEY || '',
      newRelicBrowserAgentId: process.env.NEW_RELIC_BROWSER_AGENT_ID || '',
      newRelicBrowserBeacon: process.env.NEW_RELIC_BROWSER_BEACON || 'bam.nr-data.net',
      newRelicBrowserErrorBeacon: process.env.NEW_RELIC_BROWSER_ERROR_BEACON || 'bam.nr-data.net',
      environment: process.env.NODE_ENV || 'development',
    }
  },

  // Nitro (server) configuration for production
  nitro: {
    preset: 'node-server'
  }
})