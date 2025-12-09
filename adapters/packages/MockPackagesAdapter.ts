// Mock Packages Adapter Implementation
import type { PackagesAdapter } from './PackagesAdapter'
import type { Package, PackageFilter, CreatePackageRequest, Checklist, PackageForm, TimelineEvent } from '~/types/claimready'
import { mockPackages, mockChecklists, mockPackageForms, mockForms, mockConditions } from '../mockData'

export class MockPackagesAdapter implements PackagesAdapter {
  private packages: Package[] = [...mockPackages]
  private checklists: Checklist[] = [...mockChecklists]

  async getAll(): Promise<Package[]> {
    await new Promise(r => setTimeout(r, 300))
    return [...this.packages]
  }

  async getById(id: string): Promise<Package | null> {
    await new Promise(r => setTimeout(r, 200))
    const pkg = this.packages.find(p => p.id === id)
    return pkg ? { ...pkg } : null
  }

  async getByFilter(filter: PackageFilter): Promise<Package[]> {
    await new Promise(r => setTimeout(r, 300))

    switch (filter) {
      case 'active':
        return this.packages.filter(p => p.status === 'active')
      case 'submitted':
        return this.packages.filter(p => p.status === 'submitted')
      case 'completed':
        return this.packages.filter(p => p.status === 'completed')
      case 'all':
      default:
        return [...this.packages]
    }
  }

  async getActive(): Promise<Package[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.packages.filter(p => p.status === 'active')
  }

  async create(request: CreatePackageRequest): Promise<Package> {
    await new Promise(r => setTimeout(r, 500))

    // Calculate potential monthly from target conditions
    const targetConditions = mockConditions.filter(c =>
      request.targetConditionIds.includes(c.id)
    )
    const potentialMonthly = targetConditions.reduce(
      (sum, c) => sum + (c.potentialMonthly || 0),
      0
    )

    const newPackage: Package = {
      id: `pkg-${Date.now()}`,
      name: request.name,
      goal: request.goal,
      targetConditions: request.targetConditionIds,
      status: 'active',
      progress: 0,
      potentialMonthly,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.packages.push(newPackage)
    return { ...newPackage }
  }

  async getChecklists(packageId: string): Promise<Checklist[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.checklists.filter(c => c.packageId === packageId)
  }

  async toggleChecklistItem(packageId: string, checklistId: string, itemId: string): Promise<Checklist> {
    await new Promise(r => setTimeout(r, 200))

    const checklist = this.checklists.find(c => c.id === checklistId && c.packageId === packageId)
    if (!checklist) {
      throw new Error('Checklist not found')
    }

    const item = checklist.items.find(i => i.id === itemId)
    if (item) {
      item.completed = !item.completed
    }

    // Update package progress
    const pkg = this.packages.find(p => p.id === packageId)
    if (pkg) {
      const packageChecklists = this.checklists.filter(c => c.packageId === packageId)
      const totalItems = packageChecklists.reduce((sum, cl) => sum + cl.items.length, 0)
      const completedItems = packageChecklists.reduce(
        (sum, cl) => sum + cl.items.filter(i => i.completed).length,
        0
      )
      pkg.progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
      pkg.updatedAt = new Date()
    }

    return { ...checklist }
  }

  async getForms(packageId: string): Promise<PackageForm[]> {
    await new Promise(r => setTimeout(r, 200))

    const packageForms = mockPackageForms.filter(pf => pf.packageId === packageId)

    // Populate form details
    return packageForms.map(pf => ({
      ...pf,
      form: mockForms.find(f => f.id === pf.formId),
    }))
  }

  async getTimeline(packageId: string): Promise<TimelineEvent[]> {
    await new Promise(r => setTimeout(r, 200))

    const pkg = this.packages.find(p => p.id === packageId)
    if (!pkg) return []

    // Generate mock timeline events
    const events: TimelineEvent[] = [
      {
        id: `event-${packageId}-1`,
        type: 'package_created',
        title: 'Package created',
        description: `Started working on ${pkg.name}`,
        date: pkg.createdAt,
      },
    ]

    // Add checklist completions
    const packageChecklists = this.checklists.filter(c => c.packageId === packageId)
    packageChecklists.forEach(checklist => {
      checklist.items.filter(i => i.completed).forEach((item, index) => {
        events.push({
          id: `event-${packageId}-checklist-${item.id}`,
          type: 'checklist_item_completed',
          title: 'Evidence collected',
          description: item.label,
          date: new Date(pkg.createdAt.getTime() + (index + 1) * 86400000), // +1 day per item
        })
      })
    })

    // Sort by date descending
    return events.sort((a, b) => b.date.getTime() - a.date.getTime())
  }
}
