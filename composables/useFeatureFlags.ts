import { ref, computed, onMounted } from 'vue'

/**
 * Composable for checking feature flags from the backend
 * 
 * @example
 * ```typescript
 * const { isEnabled, enabledFlags, checkFlag, refreshFlags } = useFeatureFlags()
 * 
 * // Check a specific flag
 * const canUseFeature = isEnabled('premium_analytics')
 * 
 * // Or use the async method
 * const enabled = await checkFlag('new_ui_components')
 * ```
 */
export const useFeatureFlags = () => {
  const { apiCall } = useApi()
  
  // Cache of enabled flags
  const enabledFlags = ref<Set<string>>(new Set())
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  /**
   * Check if a feature flag is enabled (from cache)
   */
  const isEnabled = (flagName: string): boolean => {
    return enabledFlags.value.has(flagName)
  }
  
  /**
   * Check a specific feature flag from the backend
   */
  const checkFlag = async (flagName: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      
      const response = await apiCall(`/api/admin/feature-flags/public/${flagName}`)
      
      if (!response.ok) {
        throw new Error(`Failed to check feature flag: ${response.statusText}`)
      }
      
      const data = await response.json() as { success: boolean; name: string; enabled: boolean }
      
      if (data.enabled) {
        enabledFlags.value.add(flagName)
      } else {
        enabledFlags.value.delete(flagName)
      }
      
      return data.enabled
    } catch (err: any) {
      error.value = err.message || 'Failed to check feature flag'
      // Default to false if flag doesn't exist or error occurs
      enabledFlags.value.delete(flagName)
      return false
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Refresh all enabled flags from the backend
   */
  const refreshFlags = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null
      
      const response = await apiCall('/api/admin/feature-flags/public')
      
      if (!response.ok) {
        throw new Error(`Failed to refresh feature flags: ${response.statusText}`)
      }
      
      const data = await response.json() as { success: boolean; flags: string[]; count: number }
      
      enabledFlags.value = new Set(data.flags || [])
    } catch (err: any) {
      error.value = err.message || 'Failed to refresh feature flags'
      enabledFlags.value.clear()
    } finally {
      loading.value = false
    }
  }
  
  /**
   * Check multiple flags at once
   */
  const checkMultipleFlags = async (flagNames: string[]): Promise<Record<string, boolean>> => {
    const results: Record<string, boolean> = {}
    
    await Promise.all(
      flagNames.map(async (name) => {
        results[name] = await checkFlag(name)
      })
    )
    
    return results
  }
  
  // Load flags on mount
  onMounted(() => {
    refreshFlags()
  })
  
  return {
    // State
    enabledFlags: computed(() => Array.from(enabledFlags.value)),
    loading,
    error,
    
    // Methods
    isEnabled,
    checkFlag,
    refreshFlags,
    checkMultipleFlags,
  }
}

