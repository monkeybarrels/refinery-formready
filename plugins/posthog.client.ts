import posthog from 'posthog-js'
import type { PostHog } from 'posthog-js'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const posthogApiKey = config.public.posthogApiKey as string
  const posthogHost = config.public.posthogHost as string

  let posthogInstance: PostHog | null = null

  // Only initialize if API key is provided
  if (posthogApiKey) {
    // Initialize PostHog
    posthogInstance = posthog.init(posthogApiKey, {
      api_host: posthogHost || 'https://us.i.posthog.com',
      defaults: '2025-05-24',
      person_profiles: 'identified_only', // Only create profiles for identified users
      capture_pageview: false, // We'll handle pageviews manually
      capture_pageleave: true,
      loaded: (ph) => {
        if (import.meta.dev) {
          console.log('[PostHog] Initialized successfully')
          ph.debug() // Enable debugging in development
        }
      }
    })

    // Track route changes
    const router = useRouter()
    router.afterEach((to) => {
      posthog.capture('$pageview', {
        $current_url: to.fullPath
      })
    })
  } else if (import.meta.dev) {
    console.log('[PostHog] API key not provided, skipping initialization')
  }

  return {
    provide: {
      posthog: posthogInstance
    }
  }
})