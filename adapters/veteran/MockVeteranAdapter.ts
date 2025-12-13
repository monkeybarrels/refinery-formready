// Mock Veteran Adapter Implementation
import type { VeteranAdapter } from './VeteranAdapter'
import type { Veteran, DashboardSummary } from '~/types/claimready'
import {
  mockVeteran,
  mockConditions,
  mockClaims,
  mockPackages,
  mockActionItems,
  calculateMoneyLeftOnTable,
  getAllActionItems,
} from '../mockData'

export class MockVeteranAdapter implements VeteranAdapter {
  private veteran: Veteran = { ...mockVeteran }

  async getProfile(): Promise<Veteran> {
    // Simulate network delay (1.5s to show skeleton loaders)
    await new Promise(r => setTimeout(r, 1500))
    return { ...this.veteran }
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    await new Promise(r => setTimeout(r, 300))

    const moneyLeftOnTable = calculateMoneyLeftOnTable(mockConditions)
    const deniedConditions = mockConditions.filter(c => c.status === 'denied')
    const activeClaims = mockClaims.filter(c => c.status !== 'decided')
    const activePackages = mockPackages.filter(p => p.status === 'active')
    const topActionItems = getAllActionItems(mockActionItems).slice(0, 5)

    return {
      veteran: { ...this.veteran },
      moneyLeftOnTable,
      deniedConditionsCount: deniedConditions.length,
      activeClaimsCount: activeClaims.length,
      activePackagesCount: activePackages.length,
      topActionItems,
    }
  }

  async updateLastSynced(date: Date): Promise<Veteran> {
    await new Promise(r => setTimeout(r, 200))
    this.veteran.lastSyncedAt = date
    return { ...this.veteran }
  }
}
