/**
 * Polling-based job status tracking
 * Simple, reliable alternative to Firebase RTDB
 * Polls /api/analyze/job/:jobId every 2 seconds until complete
 */

export interface PollJobStatus {
  jobId: string
  fileId: string
  userId: string
  status: 'waiting' | 'active' | 'completed' | 'failed'
  progress: number
  result?: {
    sessionId?: string
    documentId?: string
    status: string
  }
  failedReason?: string
  createdAt?: string
  processedAt?: string
  finishedAt?: string
}

export interface PollJobOptions {
  jobId: string
  onUpdate: (status: PollJobStatus) => void
  onComplete: (status: PollJobStatus) => void
  onError: (error: Error) => void
  pollInterval?: number // Default: 2000ms
  maxAttempts?: number // Default: 300 (10 minutes at 2s intervals)
}

/**
 * Poll job status from API
 * Returns cleanup function to stop polling
 */
export const pollJobStatus = (options: PollJobOptions): (() => void) => {
  const {
    jobId,
    onUpdate,
    onComplete,
    onError,
    pollInterval = 2000,
    maxAttempts = 300, // 10 minutes max
  } = options

  let attempts = 0
  let pollTimer: NodeJS.Timeout | null = null
  let isCancelled = false

  const poll = async () => {
    if (isCancelled) return

    attempts++
    if (attempts > maxAttempts) {
      onError(new Error('Polling timeout: Job took too long'))
      return
    }

    try {
      // Get apiCall from useApi composable
      const { apiCall } = useApi()
      const response = await apiCall(`/api/analyze/job/${jobId}`)

      if (!response.ok) {
        if (response.status === 404) {
          // Job not found yet, keep polling
          pollTimer = setTimeout(poll, pollInterval)
          return
        }
        throw new Error(`Failed to get job status: ${response.status}`)
      }

      const status: PollJobStatus = await response.json()

      // Call update handler
      onUpdate(status)

      // Check if complete
      if (status.status === 'completed') {
        onComplete(status)
        return // Stop polling
      }

      // Check if failed
      if (status.status === 'failed') {
        onError(new Error(status.failedReason || 'Job failed'))
        return // Stop polling
      }

      // Continue polling
      pollTimer = setTimeout(poll, pollInterval)
    } catch (error: any) {
      console.error('Error polling job status:', error)
      onError(error)
    }
  }

  // Start polling immediately
  poll()

  // Return cleanup function
  return () => {
    isCancelled = true
    if (pollTimer) {
      clearTimeout(pollTimer)
      pollTimer = null
    }
  }
}

/**
 * Composable for job polling
 * Usage:
 *   const { startPolling, stopPolling, status } = useJobPolling()
 *   startPolling(jobId, { onComplete: (status) => { ... } })
 */
export const useJobPolling = () => {
  const status = ref<PollJobStatus | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  let stopPollingFn: (() => void) | null = null

  const startPolling = (
    jobId: string,
    callbacks?: {
      onUpdate?: (status: PollJobStatus) => void
      onComplete?: (status: PollJobStatus) => void
      onError?: (error: Error) => void
    }
  ) => {
    isLoading.value = true
    error.value = null

    stopPollingFn = pollJobStatus({
      jobId,
      onUpdate: (jobStatus) => {
        status.value = jobStatus
        callbacks?.onUpdate?.(jobStatus)
      },
      onComplete: (jobStatus) => {
        status.value = jobStatus
        isLoading.value = false
        callbacks?.onComplete?.(jobStatus)
      },
      onError: (err) => {
        error.value = err
        isLoading.value = false
        callbacks?.onError?.(err)
      },
    })
  }

  const stopPolling = () => {
    if (stopPollingFn) {
      stopPollingFn()
      stopPollingFn = null
    }
    isLoading.value = false
  }

  // Cleanup on unmount
  onUnmounted(() => {
    stopPolling()
  })

  return {
    status: readonly(status),
    isLoading: readonly(isLoading),
    error: readonly(error),
    startPolling,
    stopPolling,
  }
}

