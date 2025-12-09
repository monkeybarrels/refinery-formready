// Packages Adapter Interface
import type { Package, PackageFilter, CreatePackageRequest, Checklist, PackageForm, TimelineEvent } from '~/types/claimready'

export interface PackagesAdapter {
  /**
   * Get all packages
   */
  getAll(): Promise<Package[]>

  /**
   * Get package by ID
   */
  getById(id: string): Promise<Package | null>

  /**
   * Get packages filtered by status
   */
  getByFilter(filter: PackageFilter): Promise<Package[]>

  /**
   * Get active packages
   */
  getActive(): Promise<Package[]>

  /**
   * Create a new package
   */
  create(request: CreatePackageRequest): Promise<Package>

  /**
   * Get checklists for a package
   */
  getChecklists(packageId: string): Promise<Checklist[]>

  /**
   * Toggle checklist item completion
   */
  toggleChecklistItem(packageId: string, checklistId: string, itemId: string): Promise<Checklist>

  /**
   * Get forms for a package
   */
  getForms(packageId: string): Promise<PackageForm[]>

  /**
   * Get timeline events for a package
   */
  getTimeline(packageId: string): Promise<TimelineEvent[]>
}
