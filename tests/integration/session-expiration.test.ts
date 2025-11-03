import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Mock dependencies - must be set up before imports
const mockPush = vi.fn()
const mockApiCall = vi.fn()

// Set up global mocks for Nuxt auto-imports
;(global as any).useRouter = vi.fn(() => ({
  push: mockPush,
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}))

;(global as any).useApi = vi.fn(() => ({
  apiCall: mockApiCall,
  getApiUrl: vi.fn(),
  getFullApiUrl: vi.fn(),
}))

// Import after mocks are set up
import { useAuth } from '../../composables/useAuth'

describe('Session Expiration Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
    // Use fake timers which automatically mocks Date.now()
    vi.useFakeTimers({ now: new Date('2024-01-01T00:00:00Z') })
    mockApiCall.mockClear()
    mockPush.mockResolvedValue(undefined) // Make mockPush return a resolved promise
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('Complete login-to-expiration flow', () => {
    it('should handle full session lifecycle', async () => {
      const { login, isAuthenticated, validateSession, logout } = useAuth()

      // 1. User logs in
      const expiresIn = 3600 // 1 hour
      login('test-token-abc123', expiresIn)

      expect(isAuthenticated()).toBe(true)
      expect(localStorage.getItem('auth_token')).toBe('test-token-abc123')

      // 2. Session validation succeeds
      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ userId: '123', email: 'test@example.com' }),
      } as Response)

      const userData = await validateSession()
      expect(userData).toEqual({ userId: '123', email: 'test@example.com' })

      // 3. Time passes and token expires
      await vi.advanceTimersByTimeAsync(expiresIn * 1000 + 1000) // Advance past expiry

      // 4. Token is now expired
      expect(isAuthenticated()).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()

      // 5. User manually logs out
      await logout()
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })

    it('should auto-logout when API returns 401', async () => {
      const { login, validateSession } = useAuth()

      // Setup authenticated session
      login('test-token', 3600)

      // API returns 401 (session expired on backend)
      mockApiCall.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)

      const result = await validateSession()

      expect(result).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('token_expiry')).toBeNull()
    })

    it('should handle session expiration during monitoring', async () => {
      const { login, setupSessionMonitoring } = useAuth()

      // Login with short expiry
      login('test-token', 60) // 1 minute
      setupSessionMonitoring()

      // Fast-forward past first check (5 minutes)
      await vi.advanceTimersByTimeAsync(5 * 60 * 1000)

      // Token should be expired and cleared
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })
  })

  describe('Tab visibility session checks', () => {
    it('should check session when tab becomes visible', async () => {
      const { login, setupSessionMonitoring } = useAuth()

      login('test-token', 3600)
      setupSessionMonitoring()

      // Simulate tab becoming hidden
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        configurable: true,
        value: 'hidden',
      })
      document.dispatchEvent(new Event('visibilitychange'))

      // Time passes while tab is hidden (but not past expiry)
      const advanceTime = 10 * 60 * 1000 // 10 minutes (token expires in 60 minutes)
      await vi.advanceTimersByTimeAsync(advanceTime)

      // Verify token is still valid after time passed
      expect(localStorage.getItem('auth_token')).toBeTruthy()

      // Tab becomes visible - this should check but not logout
      Object.defineProperty(document, 'visibilityState', { value: 'visible' })
      document.dispatchEvent(new Event('visibilitychange'))

      // Allow async handlers to complete
      await Promise.resolve()

      // Session should still be active since token hasn't expired
      expect(mockPush).not.toHaveBeenCalled()
      expect(localStorage.getItem('auth_token')).toBeTruthy()
    })

    it('should auto-logout when tab becomes visible with expired token', async () => {
      const { login, setupSessionMonitoring } = useAuth()

      // Login with 1 second expiry
      login('test-token', 1)
      setupSessionMonitoring()

      // Wait for token to expire
      await vi.advanceTimersByTimeAsync(2000)

      // Tab becomes visible with expired token
      Object.defineProperty(document, 'visibilityState', {
        writable: true,
        configurable: true,
        value: 'visible',
      })
      document.dispatchEvent(new Event('visibilitychange'))

      await vi.runAllTimersAsync()

      // Should have logged out
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })
  })

  describe('Multiple concurrent sessions', () => {
    it('should handle rapid login/logout cycles', async () => {
      const { login, logout, isAuthenticated } = useAuth()

      // Rapid login/logout
      login('token1', 3600)
      expect(isAuthenticated()).toBe(true)

      await logout(true) // Skip redirect
      expect(isAuthenticated()).toBe(false)

      login('token2', 3600)
      expect(isAuthenticated()).toBe(true)

      await logout(true)
      expect(isAuthenticated()).toBe(false)

      // Final state should be logged out
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should handle login in multiple tabs scenario', () => {
      const { login, isAuthenticated } = useAuth()

      // Simulate tab 1 login
      login('token-tab1', 3600)
      expect(isAuthenticated()).toBe(true)

      // Simulate tab 2 overwriting with new login
      // (In reality this would be a different tab's localStorage update)
      localStorage.setItem('auth_token', 'token-tab2')
      const newExpiry = Date.now() + (7200 * 1000) // 2 hours
      localStorage.setItem('token_expiry', String(newExpiry))

      // Tab 1 checks authentication - should see tab 2's token
      expect(isAuthenticated()).toBe(true)
      expect(localStorage.getItem('auth_token')).toBe('token-tab2')
    })
  })

  describe('Session validation with different API responses', () => {
    it('should handle 403 Forbidden response', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)

      mockApiCall.mockResolvedValueOnce({
        ok: false,
        status: 403,
      } as Response)

      const result = await validateSession()

      expect(result).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should handle 500 server error', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)

      mockApiCall.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      } as Response)

      const result = await validateSession()

      // Should return null but not clear session for server errors
      expect(result).toBeNull()
    })

    it('should handle network timeout', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)

      mockApiCall.mockRejectedValueOnce(new Error('Network timeout'))

      const result = await validateSession()

      expect(result).toBeNull()
    })

    it('should handle malformed JSON response', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)

      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => {
          throw new Error('Invalid JSON')
        },
      } as Response)

      const result = await validateSession()

      expect(result).toBeNull()
    })
  })

  describe('requireAuth integration', () => {
    it('should successfully authenticate and validate', async () => {
      const { login, requireAuth } = useAuth()

      login('valid-token', 3600)

      mockApiCall.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ userId: '123', email: 'user@example.com' }),
      } as Response)

      const result = await requireAuth()

      expect(result).toBe(true)
      expect(mockPush).not.toHaveBeenCalled()
    })

    it('should fail authentication and redirect', async () => {
      const { requireAuth } = useAuth()

      // No token stored

      const result = await requireAuth()

      expect(result).toBe(false)
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })

    it('should fail validation and redirect', async () => {
      const { login, requireAuth } = useAuth()

      login('invalid-token', 3600)

      mockApiCall.mockResolvedValueOnce({
        ok: false,
        status: 401,
      } as Response)

      const result = await requireAuth()

      expect(result).toBe(false)
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })

  describe('Timing edge cases', () => {
    it('should handle token expiring exactly at check time', async () => {
      const { login, setupSessionMonitoring, isAuthenticated } = useAuth()

      const expirySeconds = 5 * 60 // 5 minutes (same as check interval)
      login('test-token', expirySeconds)
      setupSessionMonitoring()

      // Advance past when token expires
      const advanceTime = expirySeconds * 1000 + 1000 // 1 second past expiry
      await vi.advanceTimersByTimeAsync(advanceTime)

      // Token should now be expired (isAuthenticated will check and clear)
      const stillAuthenticated = isAuthenticated()
      expect(stillAuthenticated).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should handle clock skew scenarios', () => {
      const { login, isAuthenticated } = useAuth()

      // Simulate clock skew: expiry in the past
      login('test-token', -100) // Negative expiry

      expect(isAuthenticated()).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should handle very long sessions', () => {
      const { login, isAuthenticated } = useAuth()

      // 30 day session
      const thirtyDays = 30 * 24 * 60 * 60
      login('test-token', thirtyDays)

      expect(isAuthenticated()).toBe(true)

      const expiry = parseInt(localStorage.getItem('token_expiry')!, 10)
      const expectedExpiry = Date.now() + (thirtyDays * 1000)

      // Allow 1 second tolerance
      expect(expiry).toBeGreaterThan(Date.now())
      expect(expiry).toBeLessThanOrEqual(expectedExpiry + 1000)
    })
  })

  describe('localStorage corruption scenarios', () => {
    it('should handle corrupted token_expiry', () => {
      const { isAuthenticated } = useAuth()

      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('token_expiry', 'not-a-number')

      expect(isAuthenticated()).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should handle partial session data', () => {
      const { isAuthenticated } = useAuth()

      // Token without expiry
      localStorage.setItem('auth_token', 'test-token')

      // Should still be considered authenticated if token exists
      expect(isAuthenticated()).toBe(true)
    })

    it('should handle empty token string', () => {
      const { isAuthenticated } = useAuth()

      localStorage.setItem('auth_token', '')
      localStorage.setItem('token_expiry', String(Date.now() + 3600000))

      expect(isAuthenticated()).toBe(false)
    })
  })
})
