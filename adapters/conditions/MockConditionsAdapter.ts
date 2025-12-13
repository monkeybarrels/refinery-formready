// Mock Conditions Adapter Implementation
import type { ConditionsAdapter } from './ConditionsAdapter'
import type { Condition, ConditionsByStatus } from '~/types/claimready'
import { mockConditions, calculateMoneyLeftOnTable } from '../mockData'

export class MockConditionsAdapter implements ConditionsAdapter {
  async getAll(): Promise<Condition[]> {
    // Simulate network delay (1.5s to show skeleton loaders)
    await new Promise(r => setTimeout(r, 1500))
    return [...mockConditions]
  }

  async getById(id: string): Promise<Condition | null> {
    await new Promise(r => setTimeout(r, 200))
    const condition = mockConditions.find(c => c.id === id)
    return condition ? { ...condition } : null
  }

  async getByStatus(): Promise<ConditionsByStatus> {
    await new Promise(r => setTimeout(r, 300))

    return {
      granted: mockConditions.filter(c => c.status === 'granted'),
      denied: mockConditions.filter(c => c.status === 'denied'),
      pending: mockConditions.filter(c => c.status === 'pending'),
      deferred: mockConditions.filter(c => c.status === 'deferred'),
    }
  }

  async getDenied(): Promise<Condition[]> {
    await new Promise(r => setTimeout(r, 200))
    return mockConditions.filter(c => c.status === 'denied')
  }

  async getGranted(): Promise<Condition[]> {
    await new Promise(r => setTimeout(r, 200))
    return mockConditions.filter(c => c.status === 'granted')
  }

  async getMoneyLeftOnTable(): Promise<number> {
    await new Promise(r => setTimeout(r, 100))
    return calculateMoneyLeftOnTable(mockConditions)
  }
}
