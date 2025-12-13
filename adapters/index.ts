// ClaimReady Adapters
// Export active adapters based on environment configuration

import { MockVeteranAdapter } from './veteran/MockVeteranAdapter'
import { MockClaimsAdapter } from './claims/MockClaimsAdapter'
import { MockConditionsAdapter } from './conditions/MockConditionsAdapter'
import { MockPackagesAdapter } from './packages/MockPackagesAdapter'
import { MockActionsAdapter } from './actions/MockActionsAdapter'
import { MockFormsAdapter } from './forms/MockFormsAdapter'
import { MockDocumentsAdapter } from './documents/MockDocumentsAdapter'

// API Adapters (real backend)
import { ApiVeteranAdapter } from './veteran/ApiVeteranAdapter'
import { ApiConditionsAdapter } from './conditions/ApiConditionsAdapter'
import { ApiClaimsAdapter } from './claims/ApiClaimsAdapter'
import { ApiPackagesAdapter } from './packages/ApiPackagesAdapter'
import { ApiActionsAdapter } from './actions/ApiActionsAdapter'
import { ApiDocumentsAdapter } from './documents/ApiDocumentsAdapter'

// Re-export interfaces for type imports
export type { VeteranAdapter } from './veteran/VeteranAdapter'
export type { ClaimsAdapter } from './claims/ClaimsAdapter'
export type { ConditionsAdapter } from './conditions/ConditionsAdapter'
export type { PackagesAdapter } from './packages/PackagesAdapter'
export type { ActionsAdapter } from './actions/ActionsAdapter'
export type { FormsAdapter } from './forms/FormsAdapter'
export type { DocumentsAdapter } from './documents/DocumentsAdapter'

/**
 * Check if mock adapters should be used
 * Uses Nuxt runtime config with fallback to true for MVP
 */
function shouldUseMocks(): boolean {
  try {
    const config = useRuntimeConfig()
    const useMocksValue = config.public.useMocks as string | boolean | undefined

    // Handle both string and boolean values
    // String 'false' or boolean false means don't use mocks
    const useMocks = useMocksValue !== 'false' && useMocksValue !== false && useMocksValue !== '0'

    console.log('[Adapters] useMocks config:', useMocksValue, `(${typeof useMocksValue}) → using mocks:`, useMocks)
    // Default to true (mocks) unless explicitly set to 'false' or false
    return useMocks
  } catch (error) {
    // If useRuntimeConfig fails (e.g., outside Nuxt context), default to mocks
    console.warn('[Adapters] Failed to read runtime config, defaulting to mocks:', error)
    return true
  }
}

// Singleton instances
let veteranAdapter: MockVeteranAdapter | ApiVeteranAdapter | null = null
let claimsAdapter: MockClaimsAdapter | ApiClaimsAdapter | null = null
let conditionsAdapter: MockConditionsAdapter | ApiConditionsAdapter | null = null
let packagesAdapter: MockPackagesAdapter | ApiPackagesAdapter | null = null
let actionsAdapter: MockActionsAdapter | ApiActionsAdapter | null = null
let formsAdapter: MockFormsAdapter | null = null
let documentsAdapter: MockDocumentsAdapter | ApiDocumentsAdapter | null = null

/**
 * Get the veteran adapter instance
 */
export function getVeteranAdapter() {
  if (!veteranAdapter) {
    if (shouldUseMocks()) {
      console.log('[Adapters] Using MockVeteranAdapter')
      veteranAdapter = new MockVeteranAdapter()
    } else {
      console.log('[Adapters] Using ApiVeteranAdapter')
      veteranAdapter = new ApiVeteranAdapter()
    }
  }
  return veteranAdapter
}

/**
 * Get the claims adapter instance
 */
export function getClaimsAdapter() {
  if (!claimsAdapter) {
    if (shouldUseMocks()) {
      console.log('[Adapters] Using MockClaimsAdapter')
      claimsAdapter = new MockClaimsAdapter()
    } else {
      console.log('[Adapters] Using ApiClaimsAdapter')
      claimsAdapter = new ApiClaimsAdapter()
    }
  }
  return claimsAdapter
}

/**
 * Get the conditions adapter instance
 */
export function getConditionsAdapter() {
  if (!conditionsAdapter) {
    if (shouldUseMocks()) {
      console.log('[Adapters] Using MockConditionsAdapter')
      conditionsAdapter = new MockConditionsAdapter()
    } else {
      console.log('[Adapters] Using ApiConditionsAdapter')
      conditionsAdapter = new ApiConditionsAdapter()
    }
  }
  return conditionsAdapter
}

/**
 * Get the packages adapter instance
 */
export function getPackagesAdapter() {
  if (!packagesAdapter) {
    if (shouldUseMocks()) {
      console.log('[Adapters] Using MockPackagesAdapter')
      packagesAdapter = new MockPackagesAdapter()
    } else {
      console.log('[Adapters] Using ApiPackagesAdapter')
      packagesAdapter = new ApiPackagesAdapter()
    }
  }
  return packagesAdapter
}

/**
 * Get the actions adapter instance
 */
export function getActionsAdapter() {
  if (!actionsAdapter) {
    if (shouldUseMocks()) {
      console.log('[Adapters] Using MockActionsAdapter')
      actionsAdapter = new MockActionsAdapter()
    } else {
      console.log('[Adapters] Using ApiActionsAdapter')
      actionsAdapter = new ApiActionsAdapter()
    }
  }
  return actionsAdapter
}

/**
 * Get the forms adapter instance
 */
export function getFormsAdapter() {
  if (!formsAdapter) {
    if (shouldUseMocks()) {
      formsAdapter = new MockFormsAdapter()
    } else {
      // TODO: Replace with ApiFormsAdapter when backend is ready
      formsAdapter = new MockFormsAdapter()
    }
  }
  return formsAdapter
}

/**
 * Get the documents adapter instance
 */
export function getDocumentsAdapter() {
  if (!documentsAdapter) {
    if (shouldUseMocks()) {
      console.log('[Adapters] Using MockDocumentsAdapter')
      documentsAdapter = new MockDocumentsAdapter()
    } else {
      console.log('[Adapters] Using ApiDocumentsAdapter')
      documentsAdapter = new ApiDocumentsAdapter()
    }
  }
  return documentsAdapter
}

/**
 * Reset all adapters (useful for testing)
 */
export function resetAdapters() {
  veteranAdapter = null
  claimsAdapter = null
  conditionsAdapter = null
  packagesAdapter = null
  actionsAdapter = null
  formsAdapter = null
  documentsAdapter = null
}
