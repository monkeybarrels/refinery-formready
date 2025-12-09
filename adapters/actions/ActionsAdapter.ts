// Actions Adapter Interface
import type { ActionItem } from '~/types/claimready'

export interface ActionsAdapter {
  /**
   * Get all action items
   */
  getAll(): Promise<ActionItem[]>

  /**
   * Get incomplete action items sorted by priority
   */
  getIncomplete(): Promise<ActionItem[]>

  /**
   * Get action items for a specific package
   */
  getByPackageId(packageId: string): Promise<ActionItem[]>

  /**
   * Get action items for a specific claim
   */
  getByClaimId(claimId: string): Promise<ActionItem[]>

  /**
   * Get action items for a specific condition
   */
  getByConditionId(conditionId: string): Promise<ActionItem[]>

  /**
   * Toggle action item completion
   */
  toggleComplete(id: string): Promise<ActionItem>

  /**
   * Get top N priority action items
   */
  getTopPriority(limit: number): Promise<ActionItem[]>
}
