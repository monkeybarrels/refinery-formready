// Conditions Adapter Interface
import type { Condition, ConditionsByStatus } from '~/types/claimready'

export interface ConditionsAdapter {
  /**
   * Get all conditions
   */
  getAll(): Promise<Condition[]>

  /**
   * Get condition by ID
   */
  getById(id: string): Promise<Condition | null>

  /**
   * Get conditions grouped by status
   */
  getByStatus(): Promise<ConditionsByStatus>

  /**
   * Get denied conditions (money left on table)
   */
  getDenied(): Promise<Condition[]>

  /**
   * Get granted conditions
   */
  getGranted(): Promise<Condition[]>

  /**
   * Calculate total money left on table
   */
  getMoneyLeftOnTable(): Promise<number>
}
