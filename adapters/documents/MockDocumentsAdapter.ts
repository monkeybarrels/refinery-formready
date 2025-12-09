// Mock Documents Adapter Implementation
import type { DocumentsAdapter } from './DocumentsAdapter'
import type { Document, DocumentType } from '~/types/claimready'

// Mock document data
const mockDocuments: Document[] = [
  {
    id: 'doc-001',
    type: 'decision_letter',
    name: 'Decision Letter - Original Claim',
    uploadedAt: new Date('2024-01-15'),
    source: 'va_sync',
    claimId: 'claim-003',
  },
  {
    id: 'doc-002',
    type: 'evidence',
    name: 'DD-214',
    uploadedAt: new Date('2024-11-20'),
    source: 'upload',
    packageId: 'pkg-001',
  },
  {
    id: 'doc-003',
    type: 'evidence',
    name: 'Service Records',
    uploadedAt: new Date('2024-11-22'),
    source: 'upload',
    packageId: 'pkg-001',
  },
]

export class MockDocumentsAdapter implements DocumentsAdapter {
  private documents: Document[] = [...mockDocuments]

  async getAll(): Promise<Document[]> {
    await new Promise(r => setTimeout(r, 200))
    return [...this.documents]
  }

  async getById(id: string): Promise<Document | null> {
    await new Promise(r => setTimeout(r, 200))
    const doc = this.documents.find(d => d.id === id)
    return doc ? { ...doc } : null
  }

  async getByType(type: DocumentType): Promise<Document[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.documents.filter(d => d.type === type)
  }

  async getByPackageId(packageId: string): Promise<Document[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.documents.filter(d => d.packageId === packageId)
  }

  async getByClaimId(claimId: string): Promise<Document[]> {
    await new Promise(r => setTimeout(r, 200))
    return this.documents.filter(d => d.claimId === claimId)
  }

  async upload(file: File, packageId?: string): Promise<Document> {
    await new Promise(r => setTimeout(r, 500))

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      type: 'evidence',
      name: file.name,
      uploadedAt: new Date(),
      source: 'upload',
      packageId,
    }

    this.documents.push(newDoc)
    return { ...newDoc }
  }

  async delete(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 200))
    const index = this.documents.findIndex(d => d.id === id)
    if (index !== -1) {
      this.documents.splice(index, 1)
    }
  }
}
