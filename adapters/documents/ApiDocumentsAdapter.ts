// API Documents Adapter Implementation
import type { DocumentsAdapter } from './DocumentsAdapter'
import type { Document, DocumentType } from '~/types/claimready'

// API response types
interface DocumentsResponse {
  documents: Document[]
  count: number
}

interface DocumentResponse {
  document: Document
}

interface UploadUrlResponse {
  uploadUrl: string
  documentId: string
  gcsPath: string
}

interface DownloadUrlResponse {
  downloadUrl: string
  filename: string
}

export class ApiDocumentsAdapter implements DocumentsAdapter {
  private api: ReturnType<typeof useClaimReadyApi>

  constructor() {
    this.api = useClaimReadyApi()
  }

  async getAll(): Promise<Document[]> {
    const response = await this.api.get<DocumentsResponse>('/api/documents')
    return response.documents.map(this.transformDocument)
  }

  async getById(id: string): Promise<Document | null> {
    try {
      const response = await this.api.get<DocumentResponse>(`/api/documents/${id}`)
      return this.transformDocument(response.document)
    } catch (error) {
      console.error('Failed to get document by ID:', error)
      return null
    }
  }

  async getByType(type: DocumentType): Promise<Document[]> {
    const response = await this.api.get<DocumentsResponse>(`/api/documents?type=${type}`)
    return response.documents.map(this.transformDocument)
  }

  async getByPackageId(packageId: string): Promise<Document[]> {
    const response = await this.api.get<DocumentsResponse>(`/api/documents?packageId=${packageId}`)
    return response.documents.map(this.transformDocument)
  }

  async getByClaimId(claimId: string): Promise<Document[]> {
    const response = await this.api.get<DocumentsResponse>(`/api/documents?claimId=${claimId}`)
    return response.documents.map(this.transformDocument)
  }

  async upload(file: File, packageId?: string): Promise<Document> {
    // Use signed URL upload for direct client-to-GCS upload
    // This is more efficient as the file goes directly to GCS
    // without passing through the API server
    return this.uploadWithSignedUrl(file, 'evidence', packageId, undefined)
  }

  async delete(id: string): Promise<void> {
    await this.api.del(`/api/documents/${id}`)
  }

  /**
   * Rename a document
   */
  async rename(id: string, newName: string): Promise<Document> {
    const response = await this.api.patch<DocumentResponse>(`/api/documents/${id}`, {
      name: newName,
    })
    return this.transformDocument(response.document)
  }

  /**
   * Get a fresh download URL for a document
   */
  async getDownloadUrl(id: string): Promise<string> {
    const response = await this.api.get<DownloadUrlResponse>(`/api/documents/${id}/download`)
    return response.downloadUrl
  }

  /**
   * Upload using signed URL (for large files or direct upload)
   */
  async uploadWithSignedUrl(
    file: File,
    type: DocumentType = 'evidence',
    packageId?: string,
    claimId?: string
  ): Promise<Document> {
    // Step 1: Get signed upload URL
    const urlResponse = await this.api.post<UploadUrlResponse>('/api/documents/upload-url', {
      filename: file.name,
      mimeType: file.type,
      type,
      packageId,
      claimId,
    })

    // Step 2: Upload directly to GCS
    await fetch(urlResponse.uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    // Step 3: Confirm upload and get document
    const confirmResponse = await this.api.post<DocumentResponse>('/api/documents/confirm-upload', {
      documentId: urlResponse.documentId,
    })

    return this.transformDocument(confirmResponse.document)
  }

  /**
   * Transform API document to frontend Document type
   */
  private transformDocument = (apiDoc: any): Document => {
    return {
      id: apiDoc._id || apiDoc.id,
      type: apiDoc.type,
      name: apiDoc.name,
      uploadedAt: new Date(apiDoc.uploadedAt),
      source: apiDoc.source,
      url: apiDoc.url,
      claimId: apiDoc.claimId,
      packageId: apiDoc.packageId,
    }
  }
}
