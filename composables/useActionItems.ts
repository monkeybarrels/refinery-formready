/**
 * ActionItem type matching backend schema
 */
export interface ActionItem {
  id: string
  title: string
  description: string
  priority: 'quick_win' | 'normal' | 'complex'
  difficulty: 1 | 2 | 3 | 4 | 5
  estimatedDays: number
  category: 'appeal' | 'evidence' | 'medical' | 'form' | 'other'
  steps: string[]
  formsNeeded: string[]
  evidenceNeeded: string[]
  deadline?: string
  dependsOn?: string[]
  relatedCondition?: string
  completed?: boolean
}

/**
 * ActionItems response from API
 */
interface ActionItemsResponse {
  documentId: string
  userId: string
  generatedAt: string
  actionItems: ActionItem[]
  metadata: {
    generationTimeMs: number
    model: string
    cacheHit?: boolean
  }
}

/**
 * Composable for managing action items state
 * Handles fetching, filtering, completion tracking, and localStorage persistence
 */
export const useActionItems = () => {
  const { apiCall } = useApi()
  const { trackEvent } = useAnalytics()

  // State
  const actionItems = ref<ActionItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const completedItems = ref<Set<string>>(new Set())

  /**
   * Load completed items from localStorage
   */
  const loadCompletedItems = (documentId: string) => {
    if (import.meta.server) return

    try {
      const key = `action_items_completed_${documentId}`
      const stored = localStorage.getItem(key)
      if (stored) {
        const completed = JSON.parse(stored) as string[]
        completedItems.value = new Set(completed)
      }
    } catch (e) {
      console.error('Failed to load completed items:', e)
    }
  }

  /**
   * Save completed items to localStorage
   */
  const saveCompletedItems = (documentId: string) => {
    if (import.meta.server) return

    try {
      const key = `action_items_completed_${documentId}`
      localStorage.setItem(key, JSON.stringify([...completedItems.value]))
    } catch (e) {
      console.error('Failed to save completed items:', e)
    }
  }

  /**
   * Fetch action items for a document
   */
  const fetchActionItems = async (documentId: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiCall(`/api/action-items/${documentId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          error.value = 'Action items not found for this document'
        } else if (response.status === 403) {
          error.value = 'Premium subscription required to view action items'
        } else {
          error.value = 'Failed to load action items'
        }
        return
      }

      const data: ActionItemsResponse = await response.json()
      // Create a new array to ensure reactivity
      actionItems.value = data.actionItems ? [...data.actionItems] : []

      // Sync completion state from backend (source of truth)
      // Update localStorage to match backend state
      const backendCompleted = new Set<string>()
      actionItems.value.forEach(item => {
        if (item.completed) {
          backendCompleted.add(item.id)
        }
      })
      completedItems.value = backendCompleted
      saveCompletedItems(documentId)

      // Track analytics
      trackEvent('action_items_viewed' as any, {
        documentId,
        itemCount: actionItems.value.length,
        cacheHit: data.metadata?.cacheHit || false
      })
    } catch (e: any) {
      console.error('Failed to fetch action items:', e)
      error.value = e.message || 'Failed to load action items'
    } finally {
      loading.value = false
    }
  }

  /**
   * Mark an action item as complete
   */
  const markComplete = async (documentId: string, itemId: string) => {
    // Update local state optimistically - use nextTick to ensure Vue processes it
    const itemIndex = actionItems.value.findIndex(i => i.id === itemId)
    if (itemIndex !== -1) {
      // Create a new array with updated item to force reactivity
      actionItems.value = actionItems.value.map((item, idx) => 
        idx === itemIndex 
          ? { ...item, completed: true }
          : item
      )
      // Force Vue to process the change
      await nextTick()
    }
    completedItems.value.add(itemId)
    saveCompletedItems(documentId)

    const item = actionItems.value.find(i => i.id === itemId)

    // Track analytics
    trackEvent('action_item_completed' as any, {
      documentId,
      itemId,
      title: item?.title || ''
    })

    // Call backend API to persist completion
    try {
      console.log('🔄 Marking item as complete:', { documentId, itemId })
      const response = await apiCall(`/api/action-items/${documentId}/${itemId}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ completed: true })
      })

      console.log('📡 Response status:', response.status, response.statusText)

      if (!response.ok) {
        // Revert optimistic update on error
        const revertIndex = actionItems.value.findIndex(i => i.id === itemId)
        if (revertIndex !== -1) {
          actionItems.value = actionItems.value.map((item, idx) => 
            idx === revertIndex 
              ? { ...item, completed: false }
              : item
          )
          await nextTick()
        }
        completedItems.value.delete(itemId)
        saveCompletedItems(documentId)
        
        // Get error message from response
        let errorMessage = 'Failed to mark item as complete'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // Failed to parse error response
        }
        
        throw new Error(errorMessage)
      }

      // Update with server response
      const data = await response.json()
      console.log('✅ Successfully updated completion status')
      
      // Don't refresh immediately - let the optimistic update show
      // The optimistic update is already correct, so we don't need to refresh
      // We'll refresh on next page load or when user explicitly refreshes
    } catch (error: any) {
      console.error('Failed to mark item as complete:', error)
      // Revert optimistic update
      const revertIndex = actionItems.value.findIndex(i => i.id === itemId)
      if (revertIndex !== -1) {
        actionItems.value = actionItems.value.map((item, idx) => 
          idx === revertIndex 
            ? { ...item, completed: false }
            : item
        )
        await nextTick()
      }
      completedItems.value.delete(itemId)
      saveCompletedItems(documentId)
      throw error
    }
  }

  /**
   * Mark an action item as incomplete
   */
  const markIncomplete = async (documentId: string, itemId: string) => {
    // Update local state optimistically - use nextTick to ensure Vue processes it
    const itemIndex = actionItems.value.findIndex(i => i.id === itemId)
    if (itemIndex !== -1) {
      // Create a new array with updated item to force reactivity
      actionItems.value = actionItems.value.map((item, idx) => 
        idx === itemIndex 
          ? { ...item, completed: false }
          : item
      )
      // Force Vue to process the change
      await nextTick()
    }
    completedItems.value.delete(itemId)
    saveCompletedItems(documentId)

    // Call backend API to persist completion status
    try {
      console.log('🔄 Marking item as incomplete:', { documentId, itemId })
      const response = await apiCall(`/api/action-items/${documentId}/${itemId}/complete`, {
        method: 'PUT',
        body: JSON.stringify({ completed: false })
      })

      console.log('📡 Response status:', response.status, response.statusText)

      if (!response.ok) {
        // Revert optimistic update on error
        const revertIndex = actionItems.value.findIndex(i => i.id === itemId)
        if (revertIndex !== -1) {
          actionItems.value = actionItems.value.map((item, idx) => 
            idx === revertIndex 
              ? { ...item, completed: true }
              : item
          )
          await nextTick()
        }
        completedItems.value.add(itemId)
        saveCompletedItems(documentId)
        
        // Get error message from response
        let errorMessage = 'Failed to mark item as incomplete'
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          // Failed to parse error response
        }
        
        throw new Error(errorMessage)
      }

      // Update with server response
      const data = await response.json()
      console.log('✅ Successfully updated completion status')
      
      // Don't refresh immediately - let the optimistic update show
      // The optimistic update is already correct, so we don't need to refresh
      // We'll refresh on next page load or when user explicitly refreshes
    } catch (error: any) {
      console.error('Failed to mark item as incomplete:', error)
      // Revert optimistic update
      const revertIndex = actionItems.value.findIndex(i => i.id === itemId)
      if (revertIndex !== -1) {
        actionItems.value = actionItems.value.map((item, idx) => 
          idx === revertIndex 
            ? { ...item, completed: true }
            : item
        )
        await nextTick()
      }
      completedItems.value.add(itemId)
      saveCompletedItems(documentId)
      throw error
    }
  }

  /**
   * Filter action items by priority
   */
  const filterByPriority = (items: ActionItem[], priority: ActionItem['priority'] | null) => {
    if (!priority) return items
    return items.filter(item => item.priority === priority)
  }

  /**
   * Filter action items by category
   */
  const filterByCategory = (items: ActionItem[], category: ActionItem['category'] | null) => {
    if (!category) return items
    return items.filter(item => item.category === category)
  }

  /**
   * Filter action items by completion status
   */
  const filterByCompletion = (items: ActionItem[], completed: boolean | null) => {
    if (completed === null) return items
    return items.filter(item => (item.completed || false) === completed)
  }

  /**
   * Get completion progress
   */
  const completionProgress = computed(() => {
    if (actionItems.value.length === 0) return { completed: 0, total: 0, percentage: 0 }
    
    const completed = actionItems.value.filter(item => item.completed).length
    const total = actionItems.value.length
    const percentage = Math.round((completed / total) * 100)

    return { completed, total, percentage }
  })

  /**
   * Get filtered and sorted action items
   */
  const getFilteredItems = (
    priority: ActionItem['priority'] | null = null,
    category: ActionItem['category'] | null = null,
    completed: boolean | null = null,
    sortBy: 'priority' | 'difficulty' | 'estimatedDays' | 'deadline' = 'priority'
  ) => {
    let filtered = [...actionItems.value]

    // Apply filters
    filtered = filterByPriority(filtered, priority)
    filtered = filterByCategory(filtered, category)
    filtered = filterByCompletion(filtered, completed)

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { quick_win: 0, normal: 1, complex: 2 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case 'difficulty':
          return a.difficulty - b.difficulty
        case 'estimatedDays':
          return a.estimatedDays - b.estimatedDays
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0
          if (!a.deadline) return 1
          if (!b.deadline) return -1
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        default:
          return 0
      }
    })

    return filtered
  }

  return {
    // State
    actionItems, // Remove readonly wrapper to allow reactivity
    loading: readonly(loading),
    error: readonly(error),
    completedItems: readonly(completedItems),
    completionProgress,

    // Methods
    fetchActionItems,
    markComplete,
    markIncomplete,
    getFilteredItems,
    filterByPriority,
    filterByCategory,
    filterByCompletion
  }
}

