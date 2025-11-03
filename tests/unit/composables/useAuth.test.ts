import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Create mocks that will be shared
const mockPush = vi.fn()
const mockApiCall = vi.fn()

// Override the global mocks with our test-specific ones
// The global setup creates these, but we need to control them
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

// Mock Vue's onUnmounted
vi.mock('vue', async () => {
  const actual = await vi.importActual('vue')
  return {
    ...actual,
    onUnmounted: vi.fn(),
  }
})

// Import after mocks are set up
import { useAuth } from '../../../composables/useAuth'

describe('useAuth', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear all mocks
    vi.clearAllMocks()
    // Reset mock return values
    mockApiCall.mockReset()
    mockPush.mockReset()
    mockPush.mockResolvedValue(undefined) // Make mockPush return a resolved promise
    // Reset timers
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('login', () => {
    it('should store token and expiry in localStorage', () => {
      const { login } = useAuth()
      const testToken = 'test-token-123'
      const expiresIn = 3600 // 1 hour

      login(testToken, expiresIn)

      expect(localStorage.getItem('auth_token')).toBe(testToken)
      const storedExpiry = localStorage.getItem('token_expiry')
      expect(storedExpiry).toBeTruthy()

      // Check expiry is approximately 1 hour from now
      const expiryTime = parseInt(storedExpiry!, 10)
      const expectedExpiry = Date.now() + (expiresIn * 1000)
      expect(expiryTime).toBeGreaterThan(Date.now())
      expect(expiryTime).toBeLessThanOrEqual(expectedExpiry + 1000) // Allow 1s tolerance
    })
  })

  describe('logout', () => {
    it('should clear localStorage and redirect to login', async () => {
      const { login, logout } = useAuth()

      // Set up auth state
      login('test-token', 3600)
      localStorage.setItem('user_data', JSON.stringify({ userId: '123' }))

      await logout()

      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('token_expiry')).toBeNull()
      expect(localStorage.getItem('user_data')).toBeNull()
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })

    it('should not redirect when skipRedirect is true', async () => {
      const { logout } = useAuth()

      await logout(false) // false means don't redirect

      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  describe('isAuthenticated', () => {
    it('should return false when no token exists', () => {
      const { isAuthenticated } = useAuth()

      expect(isAuthenticated()).toBe(false)
    })

    it('should return true when valid token exists', () => {
      const { login, isAuthenticated } = useAuth()

      login('test-token', 3600)

      expect(isAuthenticated()).toBe(true)
    })

    it('should return false when token is expired', () => {
      const { isAuthenticated } = useAuth()

      // Set expired token
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('token_expiry', String(Date.now() - 1000)) // Expired 1 second ago

      expect(isAuthenticated()).toBe(false)
      // Should clear expired session
      expect(localStorage.getItem('auth_token')).toBeNull()
    })
  })

  describe('validateSession', () => {
    it('should return user data when session is valid', async () => {
      const { login, validateSession } = useAuth()
      const mockUserData = { userId: '123', email: 'test@example.com' }

      login('test-token', 3600)
      mockApiCall.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => mockUserData,
      })

      const result = await validateSession()

      expect(result).toEqual(mockUserData)
      expect(mockApiCall).toHaveBeenCalledWith('/api/auth/profile')
    })

    it('should clear session and return null on 401', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)
      mockApiCall.mockResolvedValue({
        status: 401,
        ok: false,
      })

      const result = await validateSession()

      expect(result).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should clear session and return null on 403', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)
      mockApiCall.mockResolvedValue({
        status: 403,
        ok: false,
      })

      const result = await validateSession()

      expect(result).toBeNull()
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should handle network errors gracefully', async () => {
      const { login, validateSession } = useAuth()

      login('test-token', 3600)
      mockApiCall.mockRejectedValue(new Error('Network error'))

      const result = await validateSession()

      expect(result).toBeNull()
    })
  })

  describe('requireAuth', () => {
    it('should return true when authenticated with valid session', async () => {
      const { login, requireAuth } = useAuth()
      const mockUserData = { userId: '123' }

      login('test-token', 3600)
      mockApiCall.mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => mockUserData,
      })

      const result = await requireAuth()

      expect(result).toBe(true)
    })

    it('should logout and return false when not authenticated', async () => {
      const { requireAuth } = useAuth()

      const result = await requireAuth()

      expect(result).toBe(false)
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })

    it('should logout and return false when session validation fails', async () => {
      const { login, requireAuth } = useAuth()

      login('test-token', 3600)
      mockApiCall.mockResolvedValue({
        status: 401,
        ok: false,
      })

      const result = await requireAuth()

      expect(result).toBe(false)
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })
  })

  describe('setupSessionMonitoring', () => {
    it('should set up interval for session validation', () => {
      const { login, setupSessionMonitoring } = useAuth()

      login('test-token', 3600)
      setupSessionMonitoring()

      // Verify setInterval was called
      expect(vi.getTimerCount()).toBeGreaterThan(0)
    })

    it('should logout when token expires during monitoring', async () => {
      const { login, setupSessionMonitoring } = useAuth()

      // Set token that expires in 1 second
      login('test-token', 1)
      setupSessionMonitoring()

      // Fast-forward time by 6 minutes (beyond check interval)
      await vi.advanceTimersByTimeAsync(6 * 60 * 1000)

      // Should have logged out due to expired token
      expect(localStorage.getItem('auth_token')).toBeNull()
    })

    it('should check session when tab becomes visible', () => {
      const { login, setupSessionMonitoring } = useAuth()

      login('test-token', 3600)
      setupSessionMonitoring()

      // Simulate tab becoming hidden then visible
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // Session should still be valid
      expect(localStorage.getItem('auth_token')).toBeTruthy()
    })

    it('should logout when token is expired and tab becomes visible', async () => {
      const { setupSessionMonitoring } = useAuth()

      // Set expired token
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('token_expiry', String(Date.now() - 1000))

      setupSessionMonitoring()

      // Simulate tab becoming visible
      Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true })
      document.dispatchEvent(new Event('visibilitychange'))

      // Wait for async operations
      await vi.runAllTimersAsync()

      // Should have logged out with session_expired query param
      expect(mockPush).toHaveBeenCalledWith('/auth/login?session_expired=true')
    })
  })

  describe('edge cases', () => {
    it('should handle concurrent login/logout operations', async () => {
      const { login, logout } = useAuth()

      login('token1', 3600)
      await logout()
      login('token2', 3600)

      expect(localStorage.getItem('auth_token')).toBe('token2')
    })

    it('should handle malformed expiry timestamp', () => {
      const { isAuthenticated } = useAuth()

      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('token_expiry', 'invalid-timestamp')

      expect(isAuthenticated()).toBe(false)
    })

    it('should handle missing expiry with valid token', () => {
      const { isAuthenticated } = useAuth()

      localStorage.setItem('auth_token', 'test-token')
      // No expiry set

      expect(isAuthenticated()).toBe(true)
    })
  })
})
