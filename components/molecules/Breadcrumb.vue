<template>
  <nav class="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2">
      <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path || index" class="flex items-center">
        <!-- Home Icon for first crumb -->
        <Icon
          v-if="index === 0 && crumb.showHomeIcon"
          name="heroicons:home"
          :class="homeIconClasses"
        />

        <!-- Crumb Link or Text -->
        <NuxtLink
          v-if="crumb.path && index < breadcrumbs.length - 1"
          :to="crumb.path"
          :class="linkClasses"
          class="transition-colors font-medium"
        >
          {{ crumb.label }}
        </NuxtLink>
        <span
          v-else
          :class="currentPageClasses"
          class="font-medium"
        >
          {{ crumb.label }}
        </span>

        <!-- Separator -->
        <Icon
          v-if="index < breadcrumbs.length - 1"
          name="heroicons:chevron-right"
          :class="separatorClasses"
        />
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface BreadcrumbItem {
  label: string
  path?: string
  showHomeIcon?: boolean
}

interface Props {
  items?: BreadcrumbItem[]
  autoGenerate?: boolean
  theme?: 'light' | 'dark'
}

const props = withDefaults(defineProps<Props>(), {
  autoGenerate: true,
  theme: 'light'
})

const route = useRoute()
const { isAuthenticated } = useAuth()
const { isPremium } = useSubscription()

// Computed style classes based on theme
const homeIconClasses = computed(() => {
  const base = 'w-4 h-4 mr-2'
  return props.theme === 'dark'
    ? `${base} text-blue-200`
    : `${base} text-slate-400`
})

const linkClasses = computed(() => {
  const base = 'ml-2'
  return props.theme === 'dark'
    ? `${base} text-blue-100 hover:text-white`
    : `${base} text-slate-600 hover:text-blue-600`
})

const currentPageClasses = computed(() => {
  const base = 'ml-2'
  return props.theme === 'dark'
    ? `${base} text-white`
    : `${base} text-slate-900`
})

const separatorClasses = computed(() => {
  const base = 'w-4 h-4 mx-2'
  return props.theme === 'dark'
    ? `${base} text-blue-300`
    : `${base} text-slate-400`
})

// Auto-generate breadcrumbs based on current route
const breadcrumbs = computed(() => {
  if (props.items && props.items.length > 0) {
    return props.items
  }

  if (!props.autoGenerate) {
    return []
  }

  const crumbs: BreadcrumbItem[] = []
  const pathSegments = route.path.split('/').filter(Boolean)

  // Add home/dashboard as first crumb for authenticated users
  if (isAuthenticated.value) {
    crumbs.push({
      label: isPremium.value ? 'Dashboard' : 'Home',
      path: isPremium.value ? '/dashboard' : '/analyze',
      showHomeIcon: true
    })
  } else {
    crumbs.push({
      label: 'Home',
      path: '/',
      showHomeIcon: true
    })
  }

  // Generate breadcrumbs based on path
  let currentPath = ''

  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i]
    currentPath += `/${segment}`

    // Skip adding duplicate home/dashboard
    if ((currentPath === '/dashboard' && isPremium.value) ||
        (currentPath === '/analyze' && isAuthenticated.value && !isPremium.value) ||
        (currentPath === '/' && !isAuthenticated.value)) {
      continue
    }

    let label = ''
    let path = currentPath

    switch (segment) {
      case 'analyze':
        label = 'Analyze Document'
        break
      case 'dashboard':
        label = 'Dashboard'
        break
      case 'documents':
        label = 'Documents'
        break
      case 'results':
        label = 'Analysis Results'
        break
      case 'analysis':
        label = 'Analysis'
        break
      case 'forms':
        label = 'Forms'
        break
      case 'auth':
        label = 'Authentication'
        break
      case 'login':
        label = 'Sign In'
        break
      case 'signup':
        label = 'Sign Up'
        break
      case 'pricing':
        label = 'Pricing'
        break
      case 'billing':
        label = 'Billing'
        break
      case 'settings':
        label = 'Settings'
        break
      case 'profile':
        label = 'Profile'
        break
      case 'faq':
        label = 'Help & FAQ'
        break
      case 'admin':
        label = 'Admin'
        break
      default:
        // For dynamic segments like [id], [documentId], [sessionId]
        if (segment.match(/^[a-f0-9-]{36}$/) || segment.match(/^[a-zA-Z0-9_-]+$/)) {
          // This looks like an ID, use a more user-friendly label
          const parentPath = pathSegments[i - 1]
          if (parentPath === 'results' || parentPath === 'analysis') {
            label = 'Report'
            // Don't make ID segments clickable
            path = undefined
          } else if (parentPath === 'forms') {
            label = 'Form'
            path = undefined
          } else {
            label = segment.charAt(0).toUpperCase() + segment.slice(1)
            path = undefined
          }
        } else {
          label = segment.charAt(0).toUpperCase() + segment.slice(1)
        }
    }

    if (label) {
      crumbs.push({ label, path })
    }
  }

  return crumbs
})
</script>