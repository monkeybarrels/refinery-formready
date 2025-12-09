// Documents Adapter Interface
import type { Document, DocumentType } from '~/types/claimready'

export interface DocumentsAdapter {
  /**
   * Get all documents
   */
  getAll(): Promise<Document[]>

  /**
   * Get document by ID
   */
  getById(id: string): Promise<Document | null>

  /**
   * Get documents by type
   */
  getByType(type: DocumentType): Promise<Document[]>

  /**
   * Get documents for a specific package
   */
  getByPackageId(packageId: string): Promise<Document[]>

  /**
   * Get documents for a specific claim
   */
  getByClaimId(claimId: string): Promise<Document[]>

  /**
   * Upload a document
   */
  upload(file: File, packageId?: string): Promise<Document>

  /**
   * Delete a document
   */
  delete(id: string): Promise<void>
}
