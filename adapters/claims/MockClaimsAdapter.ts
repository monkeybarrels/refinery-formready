// Mock Claims Adapter Implementation
import type { ClaimsAdapter } from './ClaimsAdapter'
import type { Claim, ClaimFilter, Correspondence } from '~/types/claimready'
import { mockClaims, mockCorrespondence } from '../mockData'

export class MockClaimsAdapter implements ClaimsAdapter {
  async getAll(): Promise<Claim[]> {
    // Simulate network delay (1.5s to show skeleton loaders)
    await new Promise(r => setTimeout(r, 1500))
    return [...mockClaims]
  }

  async getById(id: string): Promise<Claim | null> {
    await new Promise(r => setTimeout(r, 200))
    const claim = mockClaims.find(c => c.id === id)
    return claim ? { ...claim } : null
  }

  async getByFilter(filter: ClaimFilter): Promise<Claim[]> {
    await new Promise(r => setTimeout(r, 300))

    switch (filter) {
      case 'active':
        return mockClaims.filter(c =>
          ['pending', 'in_progress', 'evidence_gathering', 'review'].includes(c.status)
        )
      case 'completed':
        return mockClaims.filter(c => c.status === 'decided')
      case 'appeals':
        return mockClaims.filter(c => c.type === 'appeal')
      case 'all':
      default:
        return [...mockClaims]
    }
  }

  async getActive(): Promise<Claim[]> {
    await new Promise(r => setTimeout(r, 300))
    return mockClaims.filter(c => c.status !== 'decided')
  }

  async getCorrespondence(claimId: string): Promise<Correspondence[]> {
    await new Promise(r => setTimeout(r, 200))
    return mockCorrespondence.filter(c => c.claimId === claimId)
  }

  async getByConditionId(conditionId: string): Promise<Claim[]> {
    await new Promise(r => setTimeout(r, 200))
    return mockClaims.filter(claim =>
      claim.conditions?.some(c => c.conditionId === conditionId)
    )
  }
}
