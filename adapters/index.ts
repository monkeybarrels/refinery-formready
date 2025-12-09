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
import { ApiConditionsAdapter } from './conditions/ApiConditionsAdapter'
import { ApiClaimsAdapter } from './claims/ApiClaimsAdapter'

// Re-export interfaces for type imports
export type { VeteranAdapter } from './veteran/VeteranAdapter'
export type { ClaimsAdapter } from './claims/ClaimsAdapter'
export type { ConditionsAdapter } from './conditions/ConditionsAdapter'
export type { PackagesAdapter } from './packages/PackagesAdapter'
export type { ActionsAdapter } from './actions/ActionsAdapter'
export type { FormsAdapter } from './forms/FormsAdapter'
export type { DocumentsAdapter } from './documents/DocumentsAdapter'

// Check environment for mock vs real API
// Default to mock for MVP development
const useMocks = import.meta.env?.VITE_USE_MOCKS !== 'false'

// Singleton instances
let veteranAdapter: MockVeteranAdapter | null = null
let claimsAdapter: MockClaimsAdapter | ApiClaimsAdapter | null = null
let conditionsAdapter: MockConditionsAdapter | ApiConditionsAdapter | null = null
let packagesAdapter: MockPackagesAdapter | null = null
let actionsAdapter: MockActionsAdapter | null = null
let formsAdapter: MockFormsAdapter | null = null
let documentsAdapter: MockDocumentsAdapter | null = null

/**
 * Get the veteran adapter instance
 */
export function getVeteranAdapter() {
  if (!veteranAdapter) {
    if (useMocks) {
      veteranAdapter = new MockVeteranAdapter()
    } else {
      // TODO: Replace with ApiVeteranAdapter when backend is ready
      veteranAdapter = new MockVeteranAdapter()
    }
  }
  return veteranAdapter
}

/**
 * Get the claims adapter instance
 */
export function getClaimsAdapter() {
  if (!claimsAdapter) {
    if (useMocks) {
      claimsAdapter = new MockClaimsAdapter()
    } else {
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
    if (useMocks) {
      conditionsAdapter = new MockConditionsAdapter()
    } else {
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
    if (useMocks) {
      packagesAdapter = new MockPackagesAdapter()
    } else {
      // TODO: Replace with ApiPackagesAdapter when backend is ready
      packagesAdapter = new MockPackagesAdapter()
    }
  }
  return packagesAdapter
}

/**
 * Get the actions adapter instance
 */
export function getActionsAdapter() {
  if (!actionsAdapter) {
    if (useMocks) {
      actionsAdapter = new MockActionsAdapter()
    } else {
      // TODO: Replace with ApiActionsAdapter when backend is ready
      actionsAdapter = new MockActionsAdapter()
    }
  }
  return actionsAdapter
}

/**
 * Get the forms adapter instance
 */
export function getFormsAdapter() {
  if (!formsAdapter) {
    if (useMocks) {
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
    if (useMocks) {
      documentsAdapter = new MockDocumentsAdapter()
    } else {
      // TODO: Replace with ApiDocumentsAdapter when backend is ready
      documentsAdapter = new MockDocumentsAdapter()
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
