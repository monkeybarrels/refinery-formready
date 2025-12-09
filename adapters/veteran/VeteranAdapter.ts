// Veteran Adapter Interface
import type { Veteran, DashboardSummary } from '~/types/claimready'

export interface VeteranAdapter {
  /**
   * Get current veteran profile
   */
  getProfile(): Promise<Veteran>

  /**
   * Get dashboard summary with all aggregated data
   */
  getDashboardSummary(): Promise<DashboardSummary>

  /**
   * Update last synced timestamp
   */
  updateLastSynced(date: Date): Promise<Veteran>
}
