// API Claims Adapter Implementation
import type { ClaimsAdapter } from './ClaimsAdapter'
import type { Claim, ClaimFilter, ClaimCondition, Correspondence } from '~/types/claimready'

// API response types
interface ClaimsResponse {
  claims: Claim[]
  count: number
}

interface ClaimResponse {
  claim: Claim
}

interface CorrespondenceResponse {
  correspondence: Correspondence[]
  count: number
}

export class ApiClaimsAdapter implements ClaimsAdapter {
  private api: ReturnType<typeof useClaimReadyApi>

  constructor() {
    this.api = useClaimReadyApi()
  }

  async getAll(): Promise<Claim[]> {
    const response = await this.api.get<ClaimsResponse>('/api/claims')
    return response.claims.map(this.transformClaim)
  }

  async getById(id: string): Promise<Claim | null> {
    try {
      const response = await this.api.get<ClaimResponse>(`/api/claims/${id}`)
      return this.transformClaim(response.claim)
    } catch (error) {
      console.error('Failed to get claim by ID:', error)
      return null
    }
  }

  async getByFilter(filter: ClaimFilter): Promise<Claim[]> {
    const response = await this.api.get<ClaimsResponse>(`/api/claims?filter=${filter}`)
    return response.claims.map(this.transformClaim)
  }

  async getActive(): Promise<Claim[]> {
    const response = await this.api.get<ClaimsResponse>('/api/claims?filter=active')
    return response.claims.map(this.transformClaim)
  }

  /**
   * Get correspondence for a specific claim
   */
  async getCorrespondence(claimId: string): Promise<Correspondence[]> {
    try {
      const response = await this.api.get<CorrespondenceResponse>(`/api/claims/${claimId}/correspondence`)
      return response.correspondence.map(this.transformCorrespondence)
    } catch (error) {
      console.error('Failed to get claim correspondence:', error)
      return []
    }
  }

  /**
   * Transform API claim to frontend Claim type
   * Handles any field name differences between API and frontend
   */
  private transformClaim = (apiClaim: any): Claim => {
    return {
      id: apiClaim._id || apiClaim.id,
      type: apiClaim.type,
      status: apiClaim.status,
      filedDate: new Date(apiClaim.filedDate),
      decidedDate: apiClaim.decidedDate ? new Date(apiClaim.decidedDate) : undefined,
      conditions: (apiClaim.conditions || []).map(this.transformClaimCondition),
      correspondence: (apiClaim.correspondence || []).map(this.transformCorrespondence)
    }
  }

  /**
   * Transform API claim condition to frontend ClaimCondition type
   */
  private transformClaimCondition = (apiCondition: any): ClaimCondition => {
    return {
      conditionId: apiCondition.conditionId,
      claimId: apiCondition.claimId,
      status: apiCondition.status,
      rating: apiCondition.rating,
      decisionDate: apiCondition.decisionDate ? new Date(apiCondition.decisionDate) : undefined,
      denialReason: apiCondition.denialReason
    }
  }

  /**
   * Get claims that include a specific condition
   */
  async getByConditionId(conditionId: string): Promise<Claim[]> {
    try {
      const response = await this.api.get<ClaimsResponse>(`/api/claims?conditionId=${conditionId}`)
      return response.claims.map(this.transformClaim)
    } catch (error) {
      console.error('Failed to get claims by condition ID:', error)
      return []
    }
  }

  /**
   * Transform API correspondence to frontend Correspondence type
   */
  private transformCorrespondence = (apiCorrespondence: any): Correspondence => {
    return {
      id: apiCorrespondence._id || apiCorrespondence.id,
      claimId: apiCorrespondence.claimId,
      type: apiCorrespondence.type,
      date: new Date(apiCorrespondence.date),
      summary: apiCorrespondence.summary,
      documentId: apiCorrespondence.documentId
    }
  }
}
