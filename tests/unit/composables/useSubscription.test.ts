import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Create mocks that will be shared
const mockApiCall = vi.fn()

// Override the global mocks with our test-specific ones
;(global as any).useApi = vi.fn(() => ({
  apiCall: mockApiCall,
  getApiUrl: vi.fn(),
  getFullApiUrl: vi.fn(),
}))

// Mock Vue's onMounted
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    ref: vi.fn((val) => ({ value: val })),
    computed: vi.fn((fn) => ({ value: fn() })),
    onMounted: vi.fn((fn) => fn()),
  }
})

// Import after mocks are set up
import { useSubscription } from '../../../composables/useSubscription'

describe('useSubscription', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear all mocks
    vi.clearAllMocks()
    // Reset mock return values
    mockApiCall.mockReset()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe('isPremium computed property', () => {
    it('should return true when user has isPremium in localStorage', () => {
      localStorage.setItem('user_data', JSON.stringify({
        userId: 'user-123',
        email: 'test@example.com',
        isPremium: true,
      }))

      const { isPremium } = useSubscription()

      expect(isPremium.value).toBe(true)
    })

    it('should return false when user does not have isPremium', () => {
      localStorage.setItem('user_data', JSON.stringify({
        userId: 'user-123',
        email: 'test@example.com',
        isPremium: false,
      }))

      const { isPremium } = useSubscription()

      expect(isPremium.value).toBe(false)
    })

    it('should return false when user_data is missing', () => {
      const { isPremium } = useSubscription()

      expect(isPremium.value).toBe(false)
    })

    it('should return false when user_data is invalid JSON', () => {
      localStorage.setItem('user_data', 'invalid-json')

      const { isPremium } = useSubscription()

      expect(isPremium.value).toBe(false)
    })
  })

  describe('fetchSubscriptionStatus', () => {
    it('should fetch subscription status from API and update state', async () => {
      const mockProfileResponse = {
        user: {
          userId: 'user-123',
          email: 'test@example.com',
          isPremium: true,
          roles: ['basic', 'premium'],
        },
      }

      mockApiCall.mockResolvedValue({
        ok: true,
        json: async () => mockProfileResponse,
      })

      const { fetchSubscriptionStatus, subscriptionStatus, loading } = useSubscription()

      const result = await fetchSubscriptionStatus()

      expect(result).toBe('premium')
      expect(subscriptionStatus.value).toBe('premium')
      expect(loading.value).toBe(false)
      expect(mockApiCall).toHaveBeenCalledWith('/api/auth/profile')
      
      // Check that user_data was updated
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      expect(userData.isPremium).toBe(true)
      expect(userData.roles).toEqual(['basic', 'premium'])
      
      // Check that subscriptionStatus was cached
      expect(localStorage.getItem('subscriptionStatus')).toBe('premium')
    })

    it('should set subscriptionStatus to free when user is not premium', async () => {
      const mockProfileResponse = {
        user: {
          userId: 'user-123',
          email: 'test@example.com',
          isPremium: false,
          roles: ['basic'],
        },
      }

      mockApiCall.mockResolvedValue({
        ok: true,
        json: async () => mockProfileResponse,
      })

      const { fetchSubscriptionStatus, subscriptionStatus } = useSubscription()

      const result = await fetchSubscriptionStatus()

      expect(result).toBe('free')
      expect(subscriptionStatus.value).toBe('free')
      expect(localStorage.getItem('subscriptionStatus')).toBe('free')
    })

    it('should handle API errors gracefully', async () => {
      mockApiCall.mockResolvedValue({
        ok: false,
        status: 500,
      })

      const { fetchSubscriptionStatus, error, subscriptionStatus } = useSubscription()

      await expect(fetchSubscriptionStatus()).rejects.toThrow()
      expect(error.value).toBeTruthy()
    })

    it('should use cached status on error', async () => {
      localStorage.setItem('subscriptionStatus', 'premium')

      mockApiCall.mockResolvedValue({
        ok: false,
        status: 500,
      })

      const { fetchSubscriptionStatus, subscriptionStatus } = useSubscription()

      try {
        await fetchSubscriptionStatus()
      } catch {
        // Expected to throw
      }

      // Should fall back to cached value
      expect(subscriptionStatus.value).toBe('premium')
    })

    it('should update loading state during fetch', async () => {
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      mockApiCall.mockReturnValue(promise)

      const { fetchSubscriptionStatus, loading } = useSubscription()

      const fetchPromise = fetchSubscriptionStatus()

      // Loading should be true while fetching
      expect(loading.value).toBe(true)

      resolvePromise!({
        ok: true,
        json: async () => ({ user: { isPremium: false } }),
      })

      await fetchPromise

      // Loading should be false after fetch completes
      expect(loading.value).toBe(false)
    })
  })

  describe('loadCachedStatus', () => {
    it('should load subscriptionStatus from localStorage cache', () => {
      localStorage.setItem('subscriptionStatus', 'premium')

      const { loadCachedStatus, subscriptionStatus } = useSubscription()

      loadCachedStatus()

      expect(subscriptionStatus.value).toBe('premium')
    })

    it('should load isPremium from user_data if subscriptionStatus not cached', () => {
      localStorage.setItem('user_data', JSON.stringify({
        isPremium: true,
      }))

      const { loadCachedStatus, subscriptionStatus } = useSubscription()

      loadCachedStatus()

      expect(subscriptionStatus.value).toBe('premium')
    })

    it('should handle missing cache gracefully', () => {
      const { loadCachedStatus, subscriptionStatus } = useSubscription()

      loadCachedStatus()

      expect(subscriptionStatus.value).toBe('free')
    })
  })

  describe('checkPremium', () => {
    it('should return true for premium users', () => {
      localStorage.setItem('user_data', JSON.stringify({
        isPremium: true,
      }))

      const { checkPremium } = useSubscription()

      expect(checkPremium()).toBe(true)
    })

    it('should return false for free users', () => {
      localStorage.setItem('user_data', JSON.stringify({
        isPremium: false,
      }))

      const { checkPremium } = useSubscription()

      expect(checkPremium()).toBe(false)
    })
  })

  describe('initialization', () => {
    it('should load cached status on mount', () => {
      localStorage.setItem('subscriptionStatus', 'premium')
      localStorage.setItem('user_data', JSON.stringify({
        isPremium: true,
      }))

      const { subscriptionStatus } = useSubscription()

      // onMounted is mocked to call immediately
      expect(subscriptionStatus.value).toBe('premium')
    })
  })
})

