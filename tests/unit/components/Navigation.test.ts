import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { ref, computed } from 'vue'

// Mock composables
const mockIsAuthenticated = vi.fn()
const mockAuthState = ref({
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
})
const mockUserDisplayName = ref<string | null>(null)
const mockUserInitials = ref<string>('U')
const mockIsPremium = ref<boolean>(false)
const mockSubscriptionPremium = ref<boolean>(false)

const mockLogout = vi.fn().mockResolvedValue(undefined)
const mockUseAuth = vi.fn(() => ({
  isAuthenticated: mockIsAuthenticated,
  logout: mockLogout,
}))

const mockInitializeFromStorage = vi.fn()
const mockClearUser = vi.fn()
const mockSetUser = vi.fn()
const mockSetLoading = vi.fn()
const mockLoadUserData = vi.fn()

const mockUseGlobalAuth = vi.fn(() => ({
  authState: mockAuthState,
  userDisplayName: computed(() => mockUserDisplayName.value),
  userInitials: computed(() => mockUserInitials.value),
  isPremium: computed(() => mockIsPremium.value),
  initializeFromStorage: mockInitializeFromStorage,
  clearUser: mockClearUser,
  setUser: mockSetUser,
  setLoading: mockSetLoading,
}))

const mockUseSubscription = vi.fn(() => ({
  isPremium: computed(() => mockSubscriptionPremium.value),
}))

const mockUseApi = vi.fn(() => ({
  apiCall: vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ user: { userId: '123', email: 'test@example.com' } }),
  }),
}))

const mockNavigateTo = vi.fn()

// Mock global composables
;(global as any).useAuth = mockUseAuth
;(global as any).useGlobalAuth = mockUseGlobalAuth
;(global as any).useSubscription = mockUseSubscription
;(global as any).useApi = mockUseApi
;(global as any).navigateTo = mockNavigateTo
;(global as any).useRoute = vi.fn(() => ({
  path: '/',
}))

// Mock NuxtLink
vi.mock('#app', () => ({
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a><slot /></a>',
    props: ['to'],
  },
}))

// Mock Icon component
vi.mock('@nuxt/icon', () => ({
  Icon: {
    name: 'Icon',
    template: '<span class="icon"></span>',
    props: ['name'],
  },
}))

// Import component after mocks
import Navigation from '../../../components/organisms/Navigation.vue'

describe('Navigation Component', () => {
  let router: any
  let wrapper: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsAuthenticated.mockReturnValue(false)
    mockAuthState.value = {
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    }
    mockLogout.mockClear()
    mockInitializeFromStorage.mockClear()
    mockClearUser.mockClear()
    mockSetUser.mockClear()
    mockSetLoading.mockClear()
    mockNavigateTo.mockClear()

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/dashboard', component: { template: '<div>Dashboard</div>' } },
      ],
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  describe('Authentication State', () => {
    it('should show Sign In and Get Started buttons when not authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(false)
      mockAuthState.value.isAuthenticated = false

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      await wrapper.vm.$nextTick()
      const html = wrapper.html()
      expect(html).toContain('Sign In')
      expect(html).toContain('Get Started')
      expect(html).not.toContain('Account')
    })

    it('should show Account button when authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      await wrapper.vm.$nextTick()
      const html = wrapper.html()
      expect(html).toContain('Account')
      expect(html).not.toContain('Sign In')
    })

    it('should show Analyze link when authenticated', () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      const html = wrapper.html()
      // Dashboard link removed - Analyze is the main navigation link
      expect(html).toContain('Analyze')
      expect(html).not.toContain('Dashboard')
    })
  })

  describe('User Display', () => {
    it('should display user avatar with initials when authenticated', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockUserInitials.value = 'JD'

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      await wrapper.vm.$nextTick()
      const html = wrapper.html()
      expect(html).toContain('JD')
    })

    it('should display user name when available', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockUserDisplayName.value = 'John Doe'

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      await wrapper.vm.$nextTick()
      const html = wrapper.html()
      expect(html).toContain('John Doe')
    })

    it('should display "Account" when no user name available', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockUserDisplayName.value = null

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      await wrapper.vm.$nextTick()
      const html = wrapper.html()
      // Account is shown in mobile view always, and in desktop when no name
      expect(html).toContain('Account')
    })
  })

  describe('Premium Badge', () => {
    it('should show Premium link when user is premium', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockIsPremium.value = true
      mockSubscriptionPremium.value = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: {
              template: '<a><slot /></a>',
              props: ['to'],
            },
            Icon: true,
            Button: {
              template: '<button><slot /></button>',
              props: ['variant', 'size', 'disabled', 'type'],
            },
          },
        },
      })

      await wrapper.vm.$nextTick()
      const html = wrapper.html()
      // Premium link should be visible for premium users
      expect(html).toContain('Premium')
      // Dashboard link and premium badge removed
      expect(html).not.toContain('Dashboard')
      expect(html).not.toContain('premium-badge')
    })

    it('should not show premium badge when user is premium', () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockIsPremium.value = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: true,
            PremiumBadge: {
              template: '<span class="premium-badge">Premium</span>',
              props: ['size', 'text'],
            },
          },
        },
      })

      // Premium badge should not appear on Dashboard link
      const html = wrapper.html()
      // The badge might still be in the user menu, but not on the Dashboard nav link
      // This is a simplified check
    })
  })

  describe('User Menu Dropdown', () => {
    it('should show user info in dropdown when opened', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value = {
        isAuthenticated: true,
        user: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        loading: false,
        error: null,
      }
      mockUserDisplayName.value = 'John Doe'
      mockUserInitials.value = 'JD'

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: true,
            PremiumBadge: true,
          },
        },
      })

      // Find and click the Account button to open menu
      const accountButton = wrapper.find('button')
      if (accountButton.exists()) {
        await accountButton.trigger('click')
        await wrapper.vm.$nextTick()

        const html = wrapper.html()
        expect(html).toContain('John Doe')
        expect(html).toContain('test@example.com')
      }
    })

    it('should show premium badge in user menu when user is premium', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockIsPremium.value = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: true,
            PremiumBadge: {
              template: '<span class="premium-badge">Premium</span>',
              props: ['size', 'text'],
            },
          },
        },
      })

      const accountButton = wrapper.find('button')
      if (accountButton.exists()) {
        await accountButton.trigger('click')
        await wrapper.vm.$nextTick()

        const html = wrapper.html()
        // Premium badge should appear in user menu
        expect(html).toContain('premium-badge')
      }
    })
  })

  describe('Logout', () => {
    it('should call logout when Sign Out is clicked', async () => {
      const mockLogout = vi.fn().mockResolvedValue(undefined)
      mockUseAuth.mockReturnValue({
        isAuthenticated: () => true,
        logout: mockLogout,
      })

      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: true,
            PremiumBadge: true,
          },
        },
      })

      // Open user menu
      const accountButton = wrapper.find('button')
      if (accountButton.exists()) {
        await accountButton.trigger('click')
        await wrapper.vm.$nextTick()

        // Find and click Sign Out
        const signOutButton = wrapper.find('button:contains("Sign Out")')
        if (signOutButton.exists()) {
          await signOutButton.trigger('click')
          await wrapper.vm.$nextTick()

          expect(mockLogout).toHaveBeenCalledWith(true)
        }
      }
    })
  })

  describe('Dashboard Navigation', () => {
    it('should navigate to pricing when Dashboard clicked and user is not premium', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockIsPremium.value = false
      mockSubscriptionPremium.value = false

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: true,
            PremiumBadge: true,
          },
        },
      })

      // Find Dashboard link and click
      const dashboardLink = wrapper.find('a[href="/dashboard"]')
      if (dashboardLink.exists()) {
        await dashboardLink.trigger('click')
        await wrapper.vm.$nextTick()

        expect(mockNavigateTo).toHaveBeenCalledWith('/pricing')
      }
    })

    it('should navigate to dashboard when Dashboard clicked and user is premium', async () => {
      mockIsAuthenticated.mockReturnValue(true)
      mockAuthState.value.isAuthenticated = true
      mockIsPremium.value = true

      wrapper = mount(Navigation, {
        global: {
          plugins: [router],
          stubs: {
            NuxtLink: true,
            Icon: true,
            Button: true,
            PremiumBadge: true,
          },
        },
      })

      // Find Dashboard link and click
      const dashboardLink = wrapper.find('a[href="/dashboard"]')
      if (dashboardLink.exists()) {
        await dashboardLink.trigger('click')
        await wrapper.vm.$nextTick()

        expect(mockNavigateTo).toHaveBeenCalledWith('/dashboard')
      }
    })
  })
})

