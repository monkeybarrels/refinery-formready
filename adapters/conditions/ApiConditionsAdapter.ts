// API Conditions Adapter Implementation
import type { ConditionsAdapter } from './ConditionsAdapter'
import type { Condition, ConditionsByStatus } from '~/types/claimready'

// API response types
interface ConditionsResponse {
  conditions: Condition[]
  count: number
}

interface ConditionResponse {
  condition: Condition
}

interface ConditionsByStatusResponse {
  conditions: {
    granted: Condition[]
    denied: Condition[]
    pending: Condition[]
    deferred: Condition[]
  }
  summary: {
    grantedCount: number
    deniedCount: number
    pendingCount: number
    deferredCount: number
    totalRating: number
    totalMonthly: number
  }
}

interface DeniedConditionsResponse {
  conditions: Condition[]
  count: number
  moneyLeftOnTable: number
}

export class ApiConditionsAdapter implements ConditionsAdapter {
  private api: ReturnType<typeof useClaimReadyApi>

  constructor() {
    this.api = useClaimReadyApi()
  }

  async getAll(): Promise<Condition[]> {
    const response = await this.api.get<ConditionsResponse>('/api/conditions')
    return response.conditions.map(this.transformCondition)
  }

  async getById(id: string): Promise<Condition | null> {
    try {
      const response = await this.api.get<ConditionResponse>(`/api/conditions/${id}`)
      return this.transformCondition(response.condition)
    } catch (error) {
      console.error('Failed to get condition by ID:', error)
      return null
    }
  }

  async getByStatus(): Promise<ConditionsByStatus> {
    const response = await this.api.get<ConditionsByStatusResponse>('/api/conditions/by-status')
    return {
      granted: response.conditions.granted.map(this.transformCondition),
      denied: response.conditions.denied.map(this.transformCondition),
      pending: response.conditions.pending.map(this.transformCondition),
      deferred: response.conditions.deferred.map(this.transformCondition)
    }
  }

  async getDenied(): Promise<Condition[]> {
    const response = await this.api.get<DeniedConditionsResponse>('/api/conditions/denied')
    return response.conditions.map(this.transformCondition)
  }

  async getGranted(): Promise<Condition[]> {
    const byStatus = await this.getByStatus()
    return byStatus.granted
  }

  async getMoneyLeftOnTable(): Promise<number> {
    const response = await this.api.get<DeniedConditionsResponse>('/api/conditions/denied')
    return response.moneyLeftOnTable
  }

  /**
   * Transform API condition to frontend Condition type
   * Handles any field name differences between API and frontend
   */
  private transformCondition = (apiCondition: any): Condition => {
    return {
      id: apiCondition._id || apiCondition.id,
      name: apiCondition.name,
      diagnosticCode: apiCondition.diagnosticCode,
      status: apiCondition.status,
      rating: apiCondition.rating,
      monthlyAmount: apiCondition.monthlyAmount,
      denialReason: apiCondition.denialReason,
      potentialRating: apiCondition.potentialRating,
      potentialMonthly: apiCondition.potentialMonthly,
      ratingCriteria: apiCondition.ratingCriteria || [],
      secondaryConditions: apiCondition.secondaryConditions || [],
      claimHistory: apiCondition.claimHistory
    }
  }
}
