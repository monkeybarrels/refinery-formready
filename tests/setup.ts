import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

global.localStorage = localStorageMock as Storage

// Mock document.visibilityState
Object.defineProperty(document, 'visibilityState', {
  writable: true,
  configurable: true,
  value: 'visible',
})

// Mock process.server for Nuxt
;(global as any).process = global.process || {}
;(global as any).process.server = false

// Mock navigateTo (Nuxt navigation helper)
;(global as any).navigateTo = vi.fn()

// Mock defineNuxtRouteMiddleware (Nuxt middleware helper)
;(global as any).defineNuxtRouteMiddleware = vi.fn((middleware) => middleware)

// Mock useRouter (Nuxt router composable)
;(global as any).useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}))

// Mock useApi (Custom composable)
;(global as any).useApi = vi.fn(() => ({
  apiCall: vi.fn(),
}))

// Mock useAuth (Custom composable) - will be overridden in specific tests
;(global as any).useAuth = vi.fn(() => ({
  login: vi.fn(),
  logout: vi.fn(),
  isAuthenticated: vi.fn(),
  validateSession: vi.fn(),
  requireAuth: vi.fn(),
  setupSessionMonitoring: vi.fn(),
}))
