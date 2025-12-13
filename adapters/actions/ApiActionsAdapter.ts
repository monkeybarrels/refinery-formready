// API Actions Adapter Implementation
import type { ActionsAdapter } from './ActionsAdapter'
import type { ActionItem } from '~/types/claimready'

// API response types
interface ActionsResponse {
  actions: ActionItem[]
  count: number
}

interface ActionResponse {
  action: ActionItem
}

export class ApiActionsAdapter implements ActionsAdapter {
  private api: ReturnType<typeof useClaimReadyApi>

  constructor() {
    this.api = useClaimReadyApi()
  }

  async getAll(): Promise<ActionItem[]> {
    const response = await this.api.get<ActionsResponse>('/api/actions')
    return response.actions.map(this.transformAction)
  }

  async getIncomplete(): Promise<ActionItem[]> {
    const response = await this.api.get<ActionsResponse>('/api/actions/incomplete')
    return response.actions.map(this.transformAction)
  }

  async getByPackageId(packageId: string): Promise<ActionItem[]> {
    const response = await this.api.get<ActionsResponse>(`/api/actions?packageId=${packageId}`)
    return response.actions.map(this.transformAction)
  }

  async getByClaimId(claimId: string): Promise<ActionItem[]> {
    const response = await this.api.get<ActionsResponse>(`/api/actions?claimId=${claimId}`)
    return response.actions.map(this.transformAction)
  }

  async getByConditionId(conditionId: string): Promise<ActionItem[]> {
    const response = await this.api.get<ActionsResponse>(`/api/actions?conditionId=${conditionId}`)
    return response.actions.map(this.transformAction)
  }

  async toggleComplete(id: string): Promise<ActionItem> {
    const response = await this.api.patch<ActionResponse>(`/api/actions/${id}/toggle`, {})
    return this.transformAction(response.action)
  }

  async getTopPriority(limit: number): Promise<ActionItem[]> {
    const response = await this.api.get<ActionsResponse>(`/api/actions/incomplete?limit=${limit}`)
    return response.actions.map(this.transformAction)
  }

  /**
   * Transform API action to frontend ActionItem type
   * Handles _id to id conversion and date parsing
   */
  private transformAction = (apiAction: any): ActionItem => {
    return {
      id: apiAction._id || apiAction.id,
      title: apiAction.title,
      description: apiAction.description,
      priority: apiAction.priority,
      completed: apiAction.completed,
      completedAt: apiAction.completedAt ? new Date(apiAction.completedAt) : undefined,
      packageId: apiAction.packageId,
      claimId: apiAction.claimId,
      conditionId: apiAction.conditionId
    }
  }
}
