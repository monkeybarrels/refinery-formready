// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Disable SSR for static SPA hosting (Firebase Hosting)
  ssr: false,

  // Modules
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],

  // Icon configuration
  icon: {
    collections: ['heroicons']
  },

  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001',
      authorizerUrl: process.env.NUXT_PUBLIC_AUTHORIZER_URL || 'https://auth.claimready.io',
      authorizerClientId: process.env.NUXT_PUBLIC_AUTHORIZER_CLIENT_ID || '9c81da5e-0635-43c5-bcef-c629174c7c6f',
      authorizerRedirectUrl: process.env.NUXT_PUBLIC_AUTHORIZER_REDIRECT_URL || 'http://localhost:3000',

      // Notification Provider: 'socketio' | 'firebase-rtdb' | 'auto'
      notificationProvider: process.env.NUXT_PUBLIC_NOTIFICATION_PROVIDER || 'auto',

      // Firebase Configuration (for firebase-rtdb notifications)
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      firebaseDatabaseUrl: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL || '',

      // PostHog Analytics
      posthogApiKey: process.env.NUXT_PUBLIC_POSTHOG_API_KEY || '',
      posthogHost: process.env.NUXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',

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

  // Nitro configuration for static generation
  nitro: {
    preset: 'static'
  }
})