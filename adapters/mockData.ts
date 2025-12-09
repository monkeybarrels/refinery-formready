// ClaimReady Mock Data
// Based on refinery-docs/mvp/mock-data.ts with full TypeScript types

import type {
  Veteran,
  Claim,
  Condition,
  Package,
  ActionItem,
  Checklist,
  VAForm,
  PackageForm,
} from '~/types/claimready'

// ============================================
// Mock Veteran
// ============================================

export const mockVeteran: Veteran = {
  id: 'vet-001',
  combinedRating: 70,
  monthlyAward: 1716.28,
  lastSyncedAt: new Date('2024-12-08T14:34:00'),
}

// ============================================
// Mock Claims
// ============================================

export const mockClaims: Claim[] = [
  {
    id: 'claim-001',
    type: 'supplemental',
    status: 'in_progress',
    filedDate: new Date('2024-12-01'),
    conditions: [
      { conditionId: 'cond-004', claimId: 'claim-001', status: 'pending' },
      { conditionId: 'cond-005', claimId: 'claim-001', status: 'pending' },
    ],
    correspondence: [],
  },
  {
    id: 'claim-002',
    type: 'increase',
    status: 'evidence_gathering',
    filedDate: new Date('2024-11-15'),
    conditions: [
      { conditionId: 'cond-001', claimId: 'claim-002', status: 'pending' },
    ],
    correspondence: [],
  },
  {
    id: 'claim-003',
    type: 'original',
    status: 'decided',
    filedDate: new Date('2023-11-01'),
    decidedDate: new Date('2024-01-15'),
    conditions: [
      { conditionId: 'cond-001', claimId: 'claim-003', status: 'granted', rating: 70 },
      { conditionId: 'cond-002', claimId: 'claim-003', status: 'granted', rating: 10 },
      { conditionId: 'cond-003', claimId: 'claim-003', status: 'granted', rating: 10 },
      { conditionId: 'cond-004', claimId: 'claim-003', status: 'denied', denialReason: 'No nexus to service' },
      { conditionId: 'cond-005', claimId: 'claim-003', status: 'denied', denialReason: 'Insufficient evidence' },
      { conditionId: 'cond-006', claimId: 'claim-003', status: 'denied', denialReason: 'Not service connected' },
    ],
    correspondence: [
      {
        id: 'corr-001',
        claimId: 'claim-003',
        type: 'Decision Letter',
        date: new Date('2024-01-15'),
        summary: 'Decision on original claim - 3 conditions granted, 3 conditions denied',
      },
    ],
  },
]

// ============================================
// Mock Conditions
// ============================================

export const mockConditions: Condition[] = [
  {
    id: 'cond-001',
    name: 'PTSD (Post-Traumatic Stress Disorder)',
    diagnosticCode: '9411',
    status: 'granted',
    rating: 70,
    monthlyAmount: 1716.28,
    ratingCriteria: [
      { diagnosticCode: '9411', ratingPercent: 100, criteria: 'Total occupational and social impairment', monthlyAmount: 3583.86 },
      { diagnosticCode: '9411', ratingPercent: 70, criteria: 'Deficiencies in most areas, suicidal ideation, difficulty adapting', monthlyAmount: 1716.28 },
      { diagnosticCode: '9411', ratingPercent: 50, criteria: 'Reduced reliability and productivity, panic attacks weekly', monthlyAmount: 1075.16 },
      { diagnosticCode: '9411', ratingPercent: 30, criteria: 'Occasional decrease in work efficiency, depressed mood', monthlyAmount: 508.05 },
      { diagnosticCode: '9411', ratingPercent: 10, criteria: 'Mild or transient symptoms', monthlyAmount: 165.92 },
    ],
    secondaryConditions: [
      { conditionName: 'Sleep Apnea', diagnosticCode: '6847', relationship: 'Often secondary to PTSD due to sleep disturbances', potentialRating: 50, potentialMonthly: 524 },
      { conditionName: 'Migraines', diagnosticCode: '8100', relationship: 'Can be stress-related and linked to PTSD', potentialRating: 30, potentialMonthly: 162 },
      { conditionName: 'GERD', diagnosticCode: '7346', relationship: 'Common medication side effect from PTSD treatments', potentialRating: 10, potentialMonthly: 52 },
    ],
  },
  {
    id: 'cond-002',
    name: 'Left Knee Strain',
    diagnosticCode: '5260',
    status: 'granted',
    rating: 10,
    monthlyAmount: 0, // Absorbed into combined rating
    ratingCriteria: [
      { diagnosticCode: '5260', ratingPercent: 30, criteria: 'Flexion limited to 15 degrees', monthlyAmount: 0 },
      { diagnosticCode: '5260', ratingPercent: 20, criteria: 'Flexion limited to 30 degrees', monthlyAmount: 0 },
      { diagnosticCode: '5260', ratingPercent: 10, criteria: 'Flexion limited to 45 degrees', monthlyAmount: 0 },
      { diagnosticCode: '5260', ratingPercent: 0, criteria: 'Flexion limited to 60 degrees or greater', monthlyAmount: 0 },
    ],
    secondaryConditions: [],
  },
  {
    id: 'cond-003',
    name: 'Right Knee Strain',
    diagnosticCode: '5260',
    status: 'granted',
    rating: 10,
    monthlyAmount: 0,
    ratingCriteria: [
      { diagnosticCode: '5260', ratingPercent: 30, criteria: 'Flexion limited to 15 degrees', monthlyAmount: 0 },
      { diagnosticCode: '5260', ratingPercent: 20, criteria: 'Flexion limited to 30 degrees', monthlyAmount: 0 },
      { diagnosticCode: '5260', ratingPercent: 10, criteria: 'Flexion limited to 45 degrees', monthlyAmount: 0 },
      { diagnosticCode: '5260', ratingPercent: 0, criteria: 'Flexion limited to 60 degrees or greater', monthlyAmount: 0 },
    ],
    secondaryConditions: [],
  },
  {
    id: 'cond-004',
    name: 'Sleep Apnea',
    diagnosticCode: '6847',
    status: 'denied',
    denialReason: 'No nexus to service - VA determined condition is not related to military service',
    potentialRating: 50,
    potentialMonthly: 524,
    ratingCriteria: [
      { diagnosticCode: '6847', ratingPercent: 100, criteria: 'Chronic respiratory failure with carbon dioxide retention, requires tracheostomy', monthlyAmount: 3583.86 },
      { diagnosticCode: '6847', ratingPercent: 50, criteria: 'Requires use of breathing assistance device such as CPAP machine', monthlyAmount: 524 },
      { diagnosticCode: '6847', ratingPercent: 30, criteria: 'Persistent daytime hypersomnolence', monthlyAmount: 162 },
      { diagnosticCode: '6847', ratingPercent: 0, criteria: 'Asymptomatic but with documented sleep disorder', monthlyAmount: 0 },
    ],
    secondaryConditions: [],
  },
  {
    id: 'cond-005',
    name: 'Tinnitus',
    diagnosticCode: '6260',
    status: 'denied',
    denialReason: 'Insufficient evidence - Need audiogram and buddy statements documenting noise exposure',
    potentialRating: 10,
    potentialMonthly: 161,
    ratingCriteria: [
      { diagnosticCode: '6260', ratingPercent: 10, criteria: 'Recurrent tinnitus (ringing, buzzing, or hissing in ears)', monthlyAmount: 161 },
    ],
    secondaryConditions: [],
  },
  {
    id: 'cond-006',
    name: 'Migraines',
    diagnosticCode: '8100',
    status: 'denied',
    denialReason: 'Not service connected - No in-service treatment records found',
    potentialRating: 30,
    potentialMonthly: 162,
    ratingCriteria: [
      { diagnosticCode: '8100', ratingPercent: 50, criteria: 'Very frequent completely prostrating and prolonged attacks productive of severe economic inadaptability', monthlyAmount: 354 },
      { diagnosticCode: '8100', ratingPercent: 30, criteria: 'Characteristic prostrating attacks occurring on an average once a month over last several months', monthlyAmount: 162 },
      { diagnosticCode: '8100', ratingPercent: 10, criteria: 'Characteristic prostrating attacks averaging one in 2 months over last several months', monthlyAmount: 52 },
      { diagnosticCode: '8100', ratingPercent: 0, criteria: 'Less frequent attacks', monthlyAmount: 0 },
    ],
    secondaryConditions: [],
  },
]

// ============================================
// Mock Packages
// ============================================

export const mockPackages: Package[] = [
  {
    id: 'pkg-001',
    name: 'Tinnitus Appeal',
    goal: 'supplemental',
    targetConditions: ['cond-005'],
    status: 'active',
    progress: 57,
    potentialMonthly: 161,
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    id: 'pkg-002',
    name: 'Sleep Apnea Secondary Claim',
    goal: 'secondary',
    targetConditions: ['cond-004'],
    status: 'active',
    progress: 20,
    potentialMonthly: 524,
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-05'),
  },
]

// ============================================
// Mock Action Items
// ============================================

export const mockActionItems: ActionItem[] = [
  {
    id: 'action-001',
    title: 'Upload buddy statement for tinnitus',
    description: 'Get a statement from someone who served with you and can verify noise exposure during service',
    priority: 'high',
    completed: false,
    packageId: 'pkg-001',
    conditionId: 'cond-005',
  },
  {
    id: 'action-002',
    title: 'Request medical records from VA Medical Center',
    description: 'Request records from VA Medical Center Dallas showing CPAP usage and sleep study results',
    priority: 'medium',
    completed: false,
    packageId: 'pkg-002',
  },
  {
    id: 'action-003',
    title: 'Complete Intent to File',
    description: 'Submit VA Form 21-0966 to protect your effective date while gathering evidence',
    priority: 'high',
    completed: true,
    completedAt: new Date('2024-12-05'),
    packageId: 'pkg-001',
  },
  {
    id: 'action-004',
    title: 'Review C&P exam results',
    description: 'Check your recent Compensation & Pension exam results for any errors or missing information',
    priority: 'medium',
    completed: false,
    claimId: 'claim-002',
    conditionId: 'cond-001',
  },
  {
    id: 'action-005',
    title: 'Get nexus letter from doctor',
    description: 'Request a nexus letter from your audiologist connecting tinnitus to military noise exposure',
    priority: 'high',
    completed: false,
    packageId: 'pkg-001',
    conditionId: 'cond-005',
  },
  {
    id: 'action-006',
    title: 'Write personal statement',
    description: 'Document when symptoms started, how they affect daily life, and connection to service',
    priority: 'medium',
    completed: false,
    packageId: 'pkg-001',
  },
  {
    id: 'action-007',
    title: 'Get nexus letter linking sleep apnea to PTSD',
    description: 'Request medical opinion showing sleep apnea is secondary to service-connected PTSD',
    priority: 'high',
    completed: false,
    packageId: 'pkg-002',
    conditionId: 'cond-004',
  },
]

// ============================================
// Mock Checklists
// ============================================

export const mockChecklists: Checklist[] = [
  {
    id: 'checklist-001',
    name: 'Evidence Checklist',
    packageId: 'pkg-001',
    items: [
      { id: 'item-001', label: 'Service records showing noise exposure (MOS, duty stations)', completed: true },
      { id: 'item-002', label: 'DD-214 showing military occupational specialty', completed: true },
      { id: 'item-003', label: 'Nexus letter from audiologist or ENT', completed: false },
      { id: 'item-004', label: 'Buddy statement(s) from fellow service members', completed: false },
      { id: 'item-005', label: 'Personal statement (VA Form 21-4138)', completed: false },
      { id: 'item-006', label: 'Current audiogram showing hearing loss/tinnitus', completed: false },
    ],
  },
  {
    id: 'checklist-002',
    name: 'Evidence Checklist',
    packageId: 'pkg-002',
    items: [
      { id: 'item-007', label: 'Sleep study results (polysomnography)', completed: false },
      { id: 'item-008', label: 'CPAP prescription and usage records', completed: false },
      { id: 'item-009', label: 'Nexus letter linking sleep apnea to PTSD', completed: false },
      { id: 'item-010', label: 'Medical literature on PTSD-sleep apnea connection', completed: false },
      { id: 'item-011', label: 'Buddy statement about observed sleep issues', completed: false },
    ],
  },
]

// ============================================
// Mock Forms
// ============================================

export const mockForms: VAForm[] = [
  {
    id: 'form-001',
    formNumber: '20-0995',
    name: 'Decision Review Request: Supplemental Claim',
    description: 'Use this form to file a supplemental claim with new and relevant evidence',
  },
  {
    id: 'form-002',
    formNumber: '21-4138',
    name: 'Statement in Support of Claim',
    description: 'Personal statement describing your condition and how it relates to service',
  },
  {
    id: 'form-003',
    formNumber: '21-10210',
    name: 'Lay/Witness Statement',
    description: 'Statement from someone who can provide firsthand knowledge about your condition',
  },
  {
    id: 'form-004',
    formNumber: '21-526EZ',
    name: 'Application for Disability Compensation',
    description: 'Use for original claims, claims for increase, or secondary conditions',
  },
  {
    id: 'form-005',
    formNumber: '21-0966',
    name: 'Intent to File a Claim',
    description: 'Establishes an effective date while you gather evidence (protects your back pay)',
  },
]

export const mockPackageForms: PackageForm[] = [
  {
    id: 'pkgform-001',
    packageId: 'pkg-001',
    formId: 'form-001',
    status: 'in_progress',
    data: {
      veteranName: 'John Smith',
      fileNumber: '123-45-6789',
    },
  },
  {
    id: 'pkgform-002',
    packageId: 'pkg-001',
    formId: 'form-002',
    status: 'not_started',
    data: {},
  },
  {
    id: 'pkgform-003',
    packageId: 'pkg-001',
    formId: 'form-003',
    status: 'not_started',
    data: {},
  },
  {
    id: 'pkgform-004',
    packageId: 'pkg-002',
    formId: 'form-004',
    status: 'not_started',
    data: {},
  },
]

// ============================================
// Helper Functions
// ============================================

export function calculateMoneyLeftOnTable(conditions: Condition[]): number {
  return conditions
    .filter(c => c.status === 'denied')
    .reduce((sum, c) => sum + (c.potentialMonthly || 0), 0)
}

export function getAllActionItems(actionItems: ActionItem[]): ActionItem[] {
  return actionItems
    .filter(a => !a.completed)
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
}

export function getPackageActionItems(actionItems: ActionItem[], packageId: string): ActionItem[] {
  return actionItems.filter(a => a.packageId === packageId)
}

export function getConditionActionItems(actionItems: ActionItem[], conditionId: string): ActionItem[] {
  return actionItems.filter(a => a.conditionId === conditionId)
}

export function getClaimActionItems(actionItems: ActionItem[], claimId: string): ActionItem[] {
  return actionItems.filter(a => a.claimId === claimId)
}

export function getConditionById(conditionId: string): Condition | undefined {
  return mockConditions.find(c => c.id === conditionId)
}

export function getClaimById(claimId: string): Claim | undefined {
  return mockClaims.find(c => c.id === claimId)
}

export function getPackageById(packageId: string): Package | undefined {
  return mockPackages.find(p => p.id === packageId)
}
