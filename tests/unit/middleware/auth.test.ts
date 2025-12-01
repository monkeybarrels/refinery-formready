import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock dependencies
const mockIsAuthenticated = vi.fn()
const mockValidateSession = vi.fn()
const mockNavigateTo = vi.fn()

// Override global mocks with test-specific ones
;(global as any).useAuth = vi.fn(() => ({
  isAuthenticated: mockIsAuthenticated,
  validateSession: mockValidateSession,
  login: vi.fn(),
  logout: vi.fn(),
  requireAuth: vi.fn(),
  setupSessionMonitoring: vi.fn(),
}))

;(global as any).navigateTo = mockNavigateTo

// Import middleware after mocks are set up
import authMiddleware from '../../../middleware/auth'

describe('auth middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset navigateTo mock - return a navigation result object
    mockNavigateTo.mockReturnValue({ type: 'redirect' } as any)
    ;(global as any).navigateTo = mockNavigateTo
  })

  describe('public routes', () => {
    const publicRoutes = [
      { path: '/', name: 'index' },
      { path: '/auth/login', name: 'auth-login' },
      { path: '/auth/signup', name: 'auth-signup' },
      // /analyze and /results now require authentication
    ]

    publicRoutes.forEach(({ path, name }) => {
      it(`should allow access to ${path} without authentication`, async () => {
        const to = { path, name }
        const from = { path: '/', name: 'index' }

        await authMiddleware(to as any, from as any)

        expect(mockIsAuthenticated).not.toHaveBeenCalled()
        expect(mockNavigateTo).not.toHaveBeenCalled()
      })
    })
  })

  describe('protected routes', () => {
    const protectedRoutes = [
      { path: '/dashboard', name: 'dashboard' },
      { path: '/documents', name: 'documents' },
      { path: '/profile', name: 'profile' },
      { path: '/settings', name: 'settings' },
      { path: '/analysis/doc123', name: 'analysis-documentId' },
      { path: '/analyze', name: 'analyze' }, // Now requires authentication
      { path: '/results/abc123', name: 'results-sessionId' }, // Now requires authentication
    ]

    protectedRoutes.forEach(({ path, name }) => {
      it(`should redirect to login when not authenticated for ${path}`, async () => {
        mockIsAuthenticated.mockReturnValue(false)

        const to = { path, name }
        const from = { path: '/', name: 'index' }

        const result = await authMiddleware(to as any, from as any)

        expect(mockIsAuthenticated).toHaveBeenCalled()
        expect(result).toBeDefined()
        // Verify redirect includes the original path for post-login navigation
        expect(mockNavigateTo.mock.calls[0][0]).toContain('/auth/login')
        expect(mockNavigateTo.mock.calls[0][0]).toContain(`redirect=${path}`)
      })

      it(`should validate session when authenticated for ${path}`, async () => {
        mockIsAuthenticated.mockReturnValue(true)
        mockValidateSession.mockResolvedValue({ userId: '123' })

        const to = { path, name }
        const from = { path: '/', name: 'index' }

        await authMiddleware(to as any, from as any)

        expect(mockIsAuthenticated).toHaveBeenCalled()
        expect(mockValidateSession).toHaveBeenCalled()
        expect(mockNavigateTo).not.toHaveBeenCalled()
      })

      it(`should allow navigation when validation fails but token exists for ${path}`, async () => {
        mockIsAuthenticated.mockReturnValue(true)
        mockValidateSession.mockResolvedValue(null)

        const to = { path, name }
        const from = { path: '/', name: 'index' }

        await authMiddleware(to as any, from as any)

        expect(mockValidateSession).toHaveBeenCalled()
        // CRITICAL: Don't redirect if user has valid token, even if backend validation fails
        // This ensures logged-in users always have navigation
        expect(mockNavigateTo).not.toHaveBeenCalled()
      })
    })
  })

  describe('edge cases', () => {
    it('should handle routes with query parameters', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      const to = { path: '/dashboard?tab=analytics', name: 'dashboard' }
      const from = { path: '/', name: 'index' }

      await authMiddleware(to as any, from as any)

      expect(mockNavigateTo.mock.calls[0][0]).toContain('redirect=/dashboard?tab=analytics')
    })

    it('should require authentication for results routes with different session IDs', async () => {
      const sessionIds = ['abc123', 'xyz789', 'test-session-id']

      for (const sessionId of sessionIds) {
        vi.clearAllMocks()
        mockIsAuthenticated.mockReturnValue(false)

        const to = { path: `/results/${sessionId}`, name: 'results-sessionId' }
        const from = { path: '/', name: 'index' }

        await authMiddleware(to as any, from as any)

        // Should redirect to login since /results now requires authentication
        expect(mockIsAuthenticated).toHaveBeenCalled()
        expect(mockNavigateTo).toHaveBeenCalled()
        expect(mockNavigateTo.mock.calls[0][0]).toContain('/auth/login')
        expect(mockNavigateTo.mock.calls[0][0]).toContain(`redirect=/results/${sessionId}`)
      }
    })

    it('should handle nested protected routes', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockValidateSession.mockResolvedValue({ userId: '123' })

      const to = { path: '/admin/dashboard/analytics', name: 'admin-dashboard-analytics' }
      const from = { path: '/admin/dashboard', name: 'admin-dashboard' }

      await authMiddleware(to as any, from as any)

      expect(mockValidateSession).toHaveBeenCalled()
    })

    it('should allow navigation when validation fails but token exists', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      // validateSession catches errors and returns null (it doesn't throw)
      mockValidateSession.mockResolvedValue(null)

      const to = { path: '/dashboard', name: 'dashboard' }
      const from = { path: '/', name: 'index' }

      await authMiddleware(to as any, from as any)

      // CRITICAL: Don't redirect if user has valid token, even if backend validation fails
      // This ensures logged-in users always have navigation
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should preserve hash fragments in redirect', async () => {
      mockIsAuthenticated.mockReturnValue(false)

      const to = { path: '/dashboard#section', name: 'dashboard' }
      const from = { path: '/', name: 'index' }

      await authMiddleware(to as any, from as any)

      expect(mockNavigateTo.mock.calls[0][0]).toContain('redirect=/dashboard#section')
    })
  })

  describe('route transitions', () => {
    it('should allow authenticated user to navigate between protected routes', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockValidateSession.mockResolvedValue({ userId: '123' })

      const to = { path: '/settings', name: 'settings' }
      const from = { path: '/dashboard', name: 'dashboard' }

      await authMiddleware(to as any, from as any)

      expect(mockValidateSession).toHaveBeenCalled()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should allow navigation from public to public route', async () => {
      const to = { path: '/auth/signup', name: 'auth-signup' }
      const from = { path: '/auth/login', name: 'auth-login' }

      await authMiddleware(to as any, from as any)

      expect(mockIsAuthenticated).not.toHaveBeenCalled()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should validate session when navigating from public to protected route', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockValidateSession.mockResolvedValue({ userId: '123' })

      const to = { path: '/dashboard', name: 'dashboard' }
      const from = { path: '/', name: 'index' }

      await authMiddleware(to as any, from as any)

      expect(mockValidateSession).toHaveBeenCalled()
    })
  })
})
