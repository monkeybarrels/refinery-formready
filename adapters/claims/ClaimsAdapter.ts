// Claims Adapter Interface
import type { Claim, ClaimFilter, Correspondence } from '~/types/claimready'

export interface ClaimsAdapter {
  /**
   * Get all claims
   */
  getAll(): Promise<Claim[]>

  /**
   * Get claim by ID
   */
  getById(id: string): Promise<Claim | null>

  /**
   * Get claims filtered by status
   */
  getByFilter(filter: ClaimFilter): Promise<Claim[]>

  /**
   * Get active (non-decided) claims
   */
  getActive(): Promise<Claim[]>

  /**
   * Get correspondence for a claim
   */
  getCorrespondence(claimId: string): Promise<Correspondence[]>

  /**
   * Get claims that include a specific condition
   */
  getByConditionId(conditionId: string): Promise<Claim[]>
}
