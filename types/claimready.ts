// ClaimReady MVP TypeScript Interfaces
// Based on claimready-mvp-spec.md

// ============================================
// Core Entities
// ============================================

/**
 * Veteran's profile with combined rating and sync info
 */
export interface Veteran {
  id: string
  combinedRating: number // 0-100
  monthlyAward: number // dollars
  lastSyncedAt: Date | null
}

/**
 * Claim synced from VA.gov
 */
export interface Claim {
  id: string
  type: ClaimType
  status: ClaimStatus
  filedDate: Date
  decidedDate?: Date
  conditions: ClaimCondition[]
  correspondence: Correspondence[]
}

export type ClaimType = 'original' | 'supplemental' | 'increase' | 'appeal'

export type ClaimStatus =
  | 'pending'
  | 'in_progress'
  | 'evidence_gathering'
  | 'review'
  | 'decided'

/**
 * Medical condition (can exist across multiple claims)
 */
export interface Condition {
  id: string
  name: string
  diagnosticCode: string // e.g., "9411" for PTSD
  status: ConditionStatus
  rating?: number // percentage if granted (0-100)
  monthlyAmount?: number // dollars if granted
  denialReason?: string // if denied
  potentialRating?: number // for denied conditions
  potentialMonthly?: number // for denied conditions
  ratingCriteria: RatingCriteria[]
  secondaryConditions: SecondaryCondition[]
  claimHistory?: ClaimCondition[]
}

export type ConditionStatus = 'granted' | 'denied' | 'deferred' | 'pending'

/**
 * Condition as it appears in a specific claim
 */
export interface ClaimCondition {
  conditionId: string
  claimId: string
  status: ConditionStatus
  rating?: number
  decisionDate?: Date
  denialReason?: string
}

/**
 * Claim Package - veteran-initiated work to appeal/file
 */
export interface Package {
  id: string
  name: string
  goal: PackageGoal
  targetConditions: string[] // condition IDs
  status: PackageStatus
  progress: number // 0-100 percentage
  potentialMonthly?: number // total potential if successful
  actionItems?: ActionItem[]
  checklists?: Checklist[]
  forms?: PackageForm[]
  documents?: Document[]
  createdAt: Date
  updatedAt: Date
}

export type PackageGoal = 'appeal' | 'supplemental' | 'increase' | 'new' | 'secondary'

export type PackageStatus = 'active' | 'submitted' | 'completed'

/**
 * MCP-generated action item
 */
export interface ActionItem {
  id: string
  title: string
  description?: string
  priority: ActionPriority
  completed: boolean
  completedAt?: Date
  // Scoping - action item can belong to multiple levels
  packageId?: string
  claimId?: string
  conditionId?: string
}

export type ActionPriority = 'high' | 'medium' | 'low'

/**
 * Evidence checklist for a package
 */
export interface Checklist {
  id: string
  name: string
  packageId: string
  items: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  label: string
  completed: boolean
  documentId?: string // linked evidence
}

/**
 * VA Form definition
 */
export interface VAForm {
  id: string
  formNumber: string // e.g., "20-0995"
  name: string
  description: string
  sections?: FormSection[]
}

export interface FormSection {
  id: string
  name: string
  fields: FormField[]
}

export interface FormField {
  id: string
  name: string
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox' | 'radio'
  required: boolean
  options?: string[]
}

/**
 * Form as it relates to a package (filled form)
 */
export interface PackageForm {
  id: string
  packageId: string
  formId: string
  form?: VAForm // populated when fetched
  status: FormStatus
  data: Record<string, unknown> // filled form data
  completedAt?: Date
}

export type FormStatus = 'not_started' | 'in_progress' | 'complete'

/**
 * 38 CFR Rating Criteria for a diagnostic code
 */
export interface RatingCriteria {
  diagnosticCode: string
  ratingPercent: number // 0, 10, 20, 30, 50, 70, 100
  criteria: string // description of what qualifies
  monthlyAmount: number // dollars at this rating level
}

/**
 * Secondary condition suggestion
 */
export interface SecondaryCondition {
  conditionName: string
  diagnosticCode: string
  relationship: string // why it's secondary to primary
  potentialRating: number
  potentialMonthly: number
}

/**
 * Document (decision letters, evidence, etc.)
 */
export interface Document {
  id: string
  type: DocumentType
  name: string
  uploadedAt: Date
  source: DocumentSource
  url?: string
  claimId?: string
  packageId?: string
}

export type DocumentType = 'decision_letter' | 'correspondence' | 'evidence' | 'form'

export type DocumentSource = 'va_sync' | 'upload'

/**
 * Correspondence from VA
 */
export interface Correspondence {
  id: string
  claimId: string
  type: string
  title: string
  date: Date
  summary: string
  actionRequired?: boolean
  documentId?: string
}

// ============================================
// Computed / Derived Types
// ============================================

/**
 * Dashboard summary data
 */
export interface DashboardSummary {
  veteran: Veteran
  moneyLeftOnTable: number
  deniedConditionsCount: number
  activeClaimsCount: number
  activePackagesCount: number
  topActionItems: ActionItem[]
}

/**
 * Conditions grouped by status for display
 */
export interface ConditionsByStatus {
  granted: Condition[]
  denied: Condition[]
  pending: Condition[]
  deferred: Condition[]
}

/**
 * Package creation request
 */
export interface CreatePackageRequest {
  name: string
  goal: PackageGoal
  targetConditionIds: string[]
}

// ============================================
// Filter Types
// ============================================

export type ClaimFilter = 'all' | 'active' | 'completed' | 'appeals'

export type PackageFilter = 'all' | 'active' | 'submitted' | 'completed'

// ============================================
// Activity Timeline
// ============================================

export interface TimelineEvent {
  id: string
  type: TimelineEventType
  title: string
  description?: string
  date: Date
  metadata?: Record<string, unknown>
}

export type TimelineEventType =
  | 'package_created'
  | 'checklist_item_completed'
  | 'document_uploaded'
  | 'form_started'
  | 'form_completed'
  | 'action_item_completed'
  | 'claim_status_changed'
  | 'correspondence_received'
