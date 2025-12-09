// Mock Actions Adapter Implementation
import type { ActionsAdapter } from './ActionsAdapter'
import type { ActionItem } from '~/types/claimready'
import { mockActionItems, getAllActionItems } from '../mockData'

export class MockActionsAdapter implements ActionsAdapter {
  private actionItems: ActionItem[] = [...mockActionItems]

  async getAll(): Promise<ActionItem[]> {
    await new Promise(r => setTimeout(r, 200))
    return [...this.actionItems]
  }

  async getIncomplete(): Promise<ActionItem[]> {
    await new Promise(r => setTimeout(r, 200))
    return getAllActionItems(this.actionItems)
  }

  async getByPackageId(packageId: string): Promise<ActionItem[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.actionItems.filter(a => a.packageId === packageId)
  }

  async getByClaimId(claimId: string): Promise<ActionItem[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.actionItems.filter(a => a.claimId === claimId)
  }

  async getByConditionId(conditionId: string): Promise<ActionItem[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.actionItems.filter(a => a.conditionId === conditionId)
  }

  async toggleComplete(id: string): Promise<ActionItem> {
    await new Promise(r => setTimeout(r, 200))

    const actionItem = this.actionItems.find(a => a.id === id)
    if (!actionItem) {
      throw new Error('Action item not found')
    }

    actionItem.completed = !actionItem.completed
    actionItem.completedAt = actionItem.completed ? new Date() : undefined

    return { ...actionItem }
  }

  async getTopPriority(limit: number): Promise<ActionItem[]> {
    await new Promise(r => setTimeout(r, 200))
    return getAllActionItems(this.actionItems).slice(0, limit)
  }
}
