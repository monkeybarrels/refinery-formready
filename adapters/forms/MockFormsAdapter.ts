// Mock Forms Adapter Implementation
import type { FormsAdapter } from './FormsAdapter'
import type { VAForm, PackageForm, FormStatus } from '~/types/claimready'
import { mockForms, mockPackageForms } from '../mockData'

export class MockFormsAdapter implements FormsAdapter {
  private packageForms: PackageForm[] = [...mockPackageForms]

  async getAll(): Promise<VAForm[]> {
    await new Promise(r => setTimeout(r, 200))
    return [...mockForms]
  }

  async getById(id: string): Promise<VAForm | null> {
    await new Promise(r => setTimeout(r, 200))
    const form = mockForms.find(f => f.id === id)
    return form ? { ...form } : null
  }

  async getByFormNumber(formNumber: string): Promise<VAForm | null> {
    await new Promise(r => setTimeout(r, 200))
    const form = mockForms.find(f => f.formNumber === formNumber)
    return form ? { ...form } : null
  }

  async getRecommendedForGoal(goal: string): Promise<VAForm[]> {
    await new Promise(r => setTimeout(r, 200))

    // Map goals to recommended forms
    const goalFormMap: Record<string, string[]> = {
      supplemental: ['20-0995', '21-4138', '21-10210'],
      appeal: ['20-0995', '21-4138'],
      increase: ['21-526EZ', '21-4138'],
      new: ['21-526EZ', '21-0966', '21-4138'],
      secondary: ['21-526EZ', '21-4138', '21-10210'],
    }

    const formNumbers = goalFormMap[goal] || ['21-526EZ']
    return mockForms.filter(f => formNumbers.includes(f.formNumber))
  }

  async getPackageForm(id: string): Promise<PackageForm | null> {
    await new Promise(r => setTimeout(r, 200))
    const packageForm = this.packageForms.find(pf => pf.id === id)
    if (!packageForm) return null

    return {
      ...packageForm,
      form: mockForms.find(f => f.id === packageForm.formId),
    }
  }

  async updatePackageForm(id: string, data: Record<string, unknown>): Promise<PackageForm> {
    await new Promise(r => setTimeout(r, 300))

    const packageForm = this.packageForms.find(pf => pf.id === id)
    if (!packageForm) {
      throw new Error('Package form not found')
    }

    packageForm.data = { ...packageForm.data, ...data }
    if (packageForm.status === 'not_started') {
      packageForm.status = 'in_progress'
    }

    return {
      ...packageForm,
      form: mockForms.find(f => f.id === packageForm.formId),
    }
  }

  async updatePackageFormStatus(id: string, status: FormStatus): Promise<PackageForm> {
    await new Promise(r => setTimeout(r, 200))

    const packageForm = this.packageForms.find(pf => pf.id === id)
    if (!packageForm) {
      throw new Error('Package form not found')
    }

    packageForm.status = status
    if (status === 'complete') {
      packageForm.completedAt = new Date()
    }

    return {
      ...packageForm,
      form: mockForms.find(f => f.id === packageForm.formId),
    }
  }
}
