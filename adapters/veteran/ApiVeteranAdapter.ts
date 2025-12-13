// API Veteran Adapter Implementation
import type { VeteranAdapter } from './VeteranAdapter'
import type { Veteran, DashboardSummary } from '~/types/claimready'

// API response types
interface VeteranResponse {
  id: string
  combinedRating: number
  monthlyAward: number
  lastSyncedAt?: string
}

interface DashboardApiResponse {
  combinedRating: number
  monthlyAward: number
  moneyLeftOnTable: number
  lastSyncedAt?: string
  conditionCounts: {
    granted: number
    denied: number
    pending: number
  }
  activeClaimsCount: number
  activePackagesCount: number
}

export class ApiVeteranAdapter implements VeteranAdapter {
  private api: ReturnType<typeof useClaimReadyApi>

  constructor() {
    this.api = useClaimReadyApi()
  }

  async getProfile(): Promise<Veteran> {
    const response = await this.api.get<VeteranResponse>('/api/veterans/me')
    return this.transformVeteran(response)
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await this.api.get<DashboardApiResponse>('/api/veterans/me/dashboard')
    return this.transformDashboard(response)
  }

  async updateLastSynced(date: Date): Promise<Veteran> {
    const response = await this.api.patch<VeteranResponse>('/api/veterans/me', {
      lastSyncedAt: date.toISOString()
    })
    return this.transformVeteran(response)
  }

  /**
   * Transform API veteran response to frontend Veteran type
   */
  private transformVeteran = (apiVeteran: VeteranResponse): Veteran => {
    return {
      id: apiVeteran.id,
      combinedRating: apiVeteran.combinedRating,
      monthlyAward: apiVeteran.monthlyAward,
      lastSyncedAt: apiVeteran.lastSyncedAt ? new Date(apiVeteran.lastSyncedAt) : null
    }
  }

  /**
   * Transform API dashboard response to frontend DashboardSummary type
   * Note: Frontend type expects `veteran` object and `topActionItems`,
   * but API returns flat structure. We construct the required format.
   */
  private transformDashboard = (apiDashboard: DashboardApiResponse): DashboardSummary => {
    return {
      veteran: {
        id: '', // Will be populated from separate profile call if needed
        combinedRating: apiDashboard.combinedRating,
        monthlyAward: apiDashboard.monthlyAward,
        lastSyncedAt: apiDashboard.lastSyncedAt ? new Date(apiDashboard.lastSyncedAt) : null
      },
      moneyLeftOnTable: apiDashboard.moneyLeftOnTable,
      deniedConditionsCount: apiDashboard.conditionCounts.denied,
      activeClaimsCount: apiDashboard.activeClaimsCount,
      activePackagesCount: apiDashboard.activePackagesCount,
      topActionItems: [] // Will be populated from actions endpoint if needed
    }
  }
}
