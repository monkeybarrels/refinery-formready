// Forms Adapter Interface
import type { VAForm, PackageForm, FormStatus } from '~/types/claimready'

export interface FormsAdapter {
  /**
   * Get all available VA forms
   */
  getAll(): Promise<VAForm[]>

  /**
   * Get form by ID
   */
  getById(id: string): Promise<VAForm | null>

  /**
   * Get form by form number (e.g., "20-0995")
   */
  getByFormNumber(formNumber: string): Promise<VAForm | null>

  /**
   * Get recommended forms for a package goal
   */
  getRecommendedForGoal(goal: string): Promise<VAForm[]>

  /**
   * Get package form (filled form) by ID
   */
  getPackageForm(id: string): Promise<PackageForm | null>

  /**
   * Update package form data
   */
  updatePackageForm(id: string, data: Record<string, unknown>): Promise<PackageForm>

  /**
   * Update package form status
   */
  updatePackageFormStatus(id: string, status: FormStatus): Promise<PackageForm>
}
