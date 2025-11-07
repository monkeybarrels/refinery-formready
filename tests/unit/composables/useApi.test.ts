import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'

// Create mocks
const mockLogout = vi.fn()
const mockNavigateTo = vi.fn()

// Mock useAuth
;(global as any).useAuth = vi.fn(() => ({
  logout: mockLogout,
}))

// Mock navigateTo
;(global as any).navigateTo = mockNavigateTo

// Mock useRuntimeConfig
;(global as any).useRuntimeConfig = vi.fn(() => ({
  public: {
    apiUrl: 'http://localhost:3001',
  },
}))

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    hostname: 'localhost',
  },
  writable: true,
})

// Import after mocks are set up
import { useApi } from '../../../composables/useApi'

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLogout.mockResolvedValue(undefined)
    mockNavigateTo.mockResolvedValue(undefined)
    
    // Mock fetch globally
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('apiCall error handling', () => {
    it('should logout on 401 (Unauthorized)', async () => {
      const { apiCall } = useApi()

      ;(global.fetch as any).mockResolvedValue({
        status: 401,
        ok: false,
      })

      await apiCall('/api/test')

      expect(mockLogout).toHaveBeenCalledWith(true)
    })

    it('should redirect to pricing on 403 with premium_required error', async () => {
      const { apiCall } = useApi()

      ;(global.fetch as any).mockResolvedValue({
        status: 403,
        ok: false,
        clone: vi.fn().mockReturnValue({
          json: async () => ({
            error: 'premium_required',
            message: 'Upgrade to premium',
            upgradeUrl: '/pricing',
          }),
        }),
      })

      await apiCall('/api/test')

      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockNavigateTo).toHaveBeenCalledWith('/pricing')
    })

    it('should NOT logout on 403 without premium_required error', async () => {
      const { apiCall } = useApi()

      ;(global.fetch as any).mockResolvedValue({
        status: 403,
        ok: false,
        clone: vi.fn().mockReturnValue({
          json: async () => ({
            error: 'forbidden',
            message: 'Access denied',
          }),
        }),
      })

      await apiCall('/api/test')

      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should NOT logout on 403 with unparseable response', async () => {
      const { apiCall } = useApi()

      ;(global.fetch as any).mockResolvedValue({
        status: 403,
        ok: false,
        clone: vi.fn().mockReturnValue({
          json: async () => {
            throw new Error('Parse error')
          },
        }),
      })

      await apiCall('/api/test')

      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should throw network errors without logging out', async () => {
      const { apiCall } = useApi()

      const networkError = new Error('Network error')
      ;(global.fetch as any).mockRejectedValue(networkError)

      await expect(apiCall('/api/test')).rejects.toThrow('Network error')
      expect(mockLogout).not.toHaveBeenCalled()
    })

    it('should return successful responses normally', async () => {
      const { apiCall } = useApi()
      const mockData = { success: true, data: 'test' }

      ;(global.fetch as any).mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => mockData,
      })

      const response = await apiCall('/api/test')
      const data = await response.json()

      expect(data).toEqual(mockData)
      expect(mockLogout).not.toHaveBeenCalled()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should include Authorization header when token exists', async () => {
      const { apiCall } = useApi()

      localStorage.setItem('auth_token', 'test-token-123')

      ;(global.fetch as any).mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({}),
      })

      await apiCall('/api/test')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token-123',
          }),
        })
      )
    })

    it('should not include Authorization header when no token', async () => {
      const { apiCall } = useApi()

      localStorage.removeItem('auth_token')

      ;(global.fetch as any).mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({}),
      })

      await apiCall('/api/test')

      const callArgs = (global.fetch as any).mock.calls[0][1]
      expect(callArgs.headers).not.toHaveProperty('Authorization')
    })
  })

  describe('getApiUrl', () => {
    it('should return correct API URL', () => {
      const { getApiUrl } = useApi()

      const url = getApiUrl('/api/test')

      expect(url).toBe('http://localhost:3001/api/test')
    })

    it('should handle endpoint without leading slash', () => {
      const { getApiUrl } = useApi()

      const url = getApiUrl('api/test')

      expect(url).toBe('http://localhost:3001/api/test')
    })

    it('should use production API URL on claimready.io', () => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'claimready.io' },
        writable: true,
      })

      const { getApiUrl } = useApi()

      const url = getApiUrl('/api/test')

      expect(url).toBe('https://api.claimready.io/api/test')
    })
  })
})

