import { ref, computed } from 'vue'

/**
 * Composable for fetching and managing Chrome extension rating snapshot data
 * This is the PRIMARY data source for authenticated users with Chrome extension
 */
export const useRatingSnapshot = () => {
    const { apiCall } = useApi()

    // State
    const latestSnapshot = ref<any>(null)
    const ratingHistory = ref<any[]>([])
    const extensionStatus = ref<any>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const hasExtension = computed(() => extensionStatus.value?.hasExtension || false)
    const needsSync = computed(() => extensionStatus.value?.needsSync || false)
    const combinedRating = computed(() => latestSnapshot.value?.combinedRating || 0)
    const conditions = computed(() => latestSnapshot.value?.conditions || [])
    const lastSyncDate = computed(() => extensionStatus.value?.lastSyncDate || null)

    /**
     * Fetch latest rating snapshot for user
     */
    const fetchLatestSnapshot = async (userId: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiCall(`/api/va-sync/rating-snapshot/latest/${userId}`)

            if (response.ok) {
                latestSnapshot.value = await response.json()
            } else if (response.status === 404) {
                // No snapshot found - user doesn't have Chrome extension
                latestSnapshot.value = null
            } else {
                throw new Error('Failed to fetch rating snapshot')
            }
        } catch (err: any) {
            console.error('Error fetching rating snapshot:', err)
            error.value = err.message || 'Failed to fetch rating snapshot'
            latestSnapshot.value = null
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch rating history for user
     */
    const fetchRatingHistory = async (userId: string, limit: number = 12) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiCall(`/api/va-sync/rating-history/${userId}?limit=${limit}`)

            if (response.ok) {
                const data = await response.json()
                ratingHistory.value = data.snapshots || []
            } else {
                throw new Error('Failed to fetch rating history')
            }
        } catch (err: any) {
            console.error('Error fetching rating history:', err)
            error.value = err.message || 'Failed to fetch rating history'
            ratingHistory.value = []
        } finally {
            loading.value = false
        }
    }

    /**
     * Check Chrome extension sync status
     */
    const checkExtensionStatus = async (userId: string) => {
        loading.value = true
        error.value = null

        try {
            const response = await apiCall(`/api/va-sync/extension-status/${userId}`)

            if (response.ok) {
                extensionStatus.value = await response.json()
            } else {
                throw new Error('Failed to check extension status')
            }
        } catch (err: any) {
            console.error('Error checking extension status:', err)
            error.value = err.message || 'Failed to check extension status'
            extensionStatus.value = { hasExtension: false, needsSync: true }
        } finally {
            loading.value = false
        }
    }

    /**
     * Fetch all data for user (snapshot + status)
     */
    const fetchAll = async (userId: string) => {
        await Promise.all([
            checkExtensionStatus(userId),
            fetchLatestSnapshot(userId),
        ])
    }

    return {
        // State
        latestSnapshot,
        ratingHistory,
        extensionStatus,
        loading,
        error,

        // Computed
        hasExtension,
        needsSync,
        combinedRating,
        conditions,
        lastSyncDate,

        // Methods
        fetchLatestSnapshot,
        fetchRatingHistory,
        checkExtensionStatus,
        fetchAll,
    }
}
