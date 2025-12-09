// API Packages Adapter Implementation
import type { PackagesAdapter } from './PackagesAdapter'
import type { Package, PackageFilter, CreatePackageRequest, Checklist, PackageForm, TimelineEvent } from '~/types/claimready'

// API response types
interface PackagesResponse {
  packages: Package[]
  count: number
}

interface PackageResponse {
  package: Package
}

interface ChecklistsResponse {
  checklists: Checklist[]
  count: number
}

interface ChecklistToggleResponse {
  checklist: Checklist
  progress: number
}

interface FormsResponse {
  forms: PackageForm[]
  count: number
}

interface FormResponse {
  form: PackageForm
}

interface TimelineResponse {
  timeline: TimelineEvent[]
  count: number
}

export class ApiPackagesAdapter implements PackagesAdapter {
  private api: ReturnType<typeof useClaimReadyApi>

  constructor() {
    this.api = useClaimReadyApi()
  }

  async getAll(): Promise<Package[]> {
    const response = await this.api.get<PackagesResponse>('/api/packages')
    return response.packages.map(this.transformPackage)
  }

  async getById(id: string): Promise<Package | null> {
    try {
      const response = await this.api.get<PackageResponse>(`/api/packages/${id}`)
      return this.transformPackage(response.package)
    } catch (error) {
      console.error('Failed to get package by ID:', error)
      return null
    }
  }

  async getByFilter(filter: PackageFilter): Promise<Package[]> {
    const response = await this.api.get<PackagesResponse>(`/api/packages?filter=${filter}`)
    return response.packages.map(this.transformPackage)
  }

  async getActive(): Promise<Package[]> {
    const response = await this.api.get<PackagesResponse>('/api/packages?filter=active')
    return response.packages.map(this.transformPackage)
  }

  async create(request: CreatePackageRequest): Promise<Package> {
    const response = await this.api.post<PackageResponse>('/api/packages', {
      name: request.name,
      goal: request.goal,
      targetConditionIds: request.targetConditionIds
    })
    return this.transformPackage(response.package)
  }

  async getChecklists(packageId: string): Promise<Checklist[]> {
    try {
      const response = await this.api.get<ChecklistsResponse>(`/api/packages/${packageId}/checklists`)
      return response.checklists.map(this.transformChecklist)
    } catch (error) {
      console.error('Failed to get package checklists:', error)
      return []
    }
  }

  async toggleChecklistItem(packageId: string, checklistId: string, itemId: string): Promise<Checklist> {
    const response = await this.api.patch<ChecklistToggleResponse>(
      `/api/packages/${packageId}/checklists/${checklistId}/items/${itemId}`,
      {}
    )
    return this.transformChecklist(response.checklist)
  }

  async getForms(packageId: string): Promise<PackageForm[]> {
    try {
      const response = await this.api.get<FormsResponse>(`/api/packages/${packageId}/forms`)
      return response.forms.map(this.transformPackageForm)
    } catch (error) {
      console.error('Failed to get package forms:', error)
      return []
    }
  }

  async getTimeline(packageId: string): Promise<TimelineEvent[]> {
    try {
      const response = await this.api.get<TimelineResponse>(`/api/packages/${packageId}/timeline`)
      return response.timeline.map(this.transformTimelineEvent)
    } catch (error) {
      console.error('Failed to get package timeline:', error)
      return []
    }
  }

  /**
   * Update a package form's status and data
   */
  async updateForm(packageId: string, formId: string, updates: { status?: string; data?: Record<string, unknown> }): Promise<PackageForm> {
    const response = await this.api.patch<FormResponse>(
      `/api/packages/${packageId}/forms/${formId}`,
      updates
    )
    return this.transformPackageForm(response.form)
  }

  /**
   * Update a package
   */
  async update(packageId: string, updates: Partial<Package>): Promise<Package> {
    const response = await this.api.patch<PackageResponse>(
      `/api/packages/${packageId}`,
      updates
    )
    return this.transformPackage(response.package)
  }

  /**
   * Delete a package
   */
  async delete(packageId: string): Promise<boolean> {
    try {
      await this.api.delete(`/api/packages/${packageId}`)
      return true
    } catch (error) {
      console.error('Failed to delete package:', error)
      return false
    }
  }

  /**
   * Transform API package to frontend Package type
   */
  private transformPackage = (apiPackage: any): Package => {
    return {
      id: apiPackage._id || apiPackage.id,
      name: apiPackage.name,
      goal: apiPackage.goal,
      targetConditions: apiPackage.targetConditions || [],
      status: apiPackage.status,
      progress: apiPackage.progress || 0,
      potentialMonthly: apiPackage.potentialMonthly,
      actionItems: apiPackage.actionItems,
      checklists: (apiPackage.checklists || []).map(this.transformChecklist),
      forms: (apiPackage.forms || []).map(this.transformPackageForm),
      documents: apiPackage.documents,
      createdAt: new Date(apiPackage.createdAt),
      updatedAt: new Date(apiPackage.updatedAt)
    }
  }

  /**
   * Transform API checklist to frontend Checklist type
   */
  private transformChecklist = (apiChecklist: any): Checklist => {
    return {
      id: apiChecklist._id || apiChecklist.id,
      name: apiChecklist.name,
      packageId: apiChecklist.packageId,
      items: (apiChecklist.items || []).map((item: any) => ({
        id: item._id || item.id,
        label: item.label,
        completed: item.completed || false,
        documentId: item.documentId
      }))
    }
  }

  /**
   * Transform API package form to frontend PackageForm type
   */
  private transformPackageForm = (apiForm: any): PackageForm => {
    return {
      id: apiForm._id || apiForm.id,
      packageId: apiForm.packageId,
      formId: apiForm.formId,
      form: apiForm.form,
      status: apiForm.status || 'not_started',
      data: apiForm.data || {},
      completedAt: apiForm.completedAt ? new Date(apiForm.completedAt) : undefined
    }
  }

  /**
   * Transform API timeline event to frontend TimelineEvent type
   */
  private transformTimelineEvent = (apiEvent: any): TimelineEvent => {
    return {
      id: apiEvent._id || apiEvent.id,
      type: apiEvent.type,
      title: apiEvent.title,
      description: apiEvent.description,
      date: new Date(apiEvent.date),
      metadata: apiEvent.metadata
    }
  }
}
