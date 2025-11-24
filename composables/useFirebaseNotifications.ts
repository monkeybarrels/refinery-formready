import { ref, onMounted, onUnmounted, watch, readonly } from 'vue'
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getDatabase, ref as dbRef, onChildAdded, onChildRemoved, onValue, off, type Database } from 'firebase/database'
import { useAuth } from './useAuth'
import { useSubscription } from './useSubscription'

interface StoredNotification {
  id: string
  type: string
  data: any
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  acknowledged: boolean
}

/**
 * Job status stored in RTDB at /jobs/{userId}/{jobId}
 */
export interface JobStatus {
  jobId: string
  fileId: string
  status: 'queued' | 'processing' | 'extracting' | 'analyzing' | 'complete' | 'failed'
  progress: number
  timestamp: string
  sessionId?: string
  documentId?: string
  error?: string
  results?: any
}

type NotificationHandler = (notification: StoredNotification) => void | Promise<void>
type JobStatusHandler = (status: JobStatus) => void | Promise<void>

/**
 * Composable for Firebase Realtime Database push notifications
 * Alternative to Socket.IO for environments where WebSockets aren't supported
 */
export const useFirebaseNotifications = () => {
  const connected = ref(false)
  const error = ref<string | null>(null)
  const handlers = new Map<string, Set<NotificationHandler>>()
  const notifications = ref<StoredNotification[]>([])

  const { isAuthenticated } = useAuth()
  const { refreshSubscriptionStatus } = useSubscription()

  // Helper to get user ID from localStorage
  const getUserId = (): string | null => {
    if (import.meta.server) return null
    try {
      const userData = localStorage.getItem('user_data')
      if (userData) {
        const parsed = JSON.parse(userData)
        return parsed.id || parsed.sub || null
      }
    } catch (e) {
      console.warn('Failed to parse user data:', e)
    }
    return null
  }

  let app: FirebaseApp | null = null
  let database: Database | null = null
  let unsubscribeUser: (() => void) | null = null
  let unsubscribeBroadcast: (() => void) | null = null

  /**
   * Initialize Firebase app
   */
  const initFirebase = () => {
    if (import.meta.server) return false

    const config = useRuntimeConfig()
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      databaseURL: config.public.firebaseDatabaseUrl,
    }

    // Check if required config is present
    if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
      console.warn('Firebase not configured - missing projectId or databaseURL')
      return false
    }

    try {
      // Reuse existing app if available
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig)
        console.log('Firebase app initialized')
      } else {
        app = getApps()[0]
      }

      database = getDatabase(app)
      return true
    } catch (e: any) {
      console.error('Failed to initialize Firebase:', e)
      error.value = e.message
      return false
    }
  }

  /**
   * Process incoming notification
   */
  const processNotification = async (notification: StoredNotification) => {
    console.log('Firebase notification received:', notification)
    notifications.value.push(notification)

    // Call registered handlers for this notification type
    const typeHandlers = handlers.get(notification.type)
    if (typeHandlers && typeHandlers.size > 0) {
      for (const handler of typeHandlers) {
        try {
          await handler(notification)
        } catch (e) {
          console.error(`Error in notification handler for ${notification.type}:`, e)
        }
      }
    }

    // Handle premium status changes (built-in handler)
    if (notification.type === 'premium_status_changed') {
      const { isPremium } = notification.data
      console.log(`Premium status changed: ${isPremium}`)

      try {
        await refreshSubscriptionStatus()
        console.log('Premium status synced')
      } catch (e) {
        console.error('Failed to sync premium status:', e)
      }
    }
  }

  /**
   * Connect to Firebase RTDB and listen for notifications
   */
  const connect = () => {
    if (import.meta.server) return
    if (!isAuthenticated()) return
    if (connected.value) return

    if (!initFirebase() || !database) {
      console.warn('Firebase not available, cannot connect to notifications')
      return
    }

    const userId = getUserId()
    if (!userId) {
      console.warn('No user ID available, cannot connect to notifications')
      return
    }

    try {
      console.log('Connecting to Firebase RTDB notifications...')

      // Listen for user-specific notifications
      const userNotificationsRef = dbRef(database, `notifications/${userId}`)
      onChildAdded(userNotificationsRef, (snapshot) => {
        const notification = snapshot.val() as StoredNotification
        if (notification) {
          processNotification(notification)
        }
      })

      // Listen for broadcasts
      const broadcastsRef = dbRef(database, 'broadcasts')
      onChildAdded(broadcastsRef, (snapshot) => {
        const notification = snapshot.val() as StoredNotification
        if (notification) {
          processNotification(notification)
        }
      })

      // Store unsubscribe functions
      unsubscribeUser = () => off(userNotificationsRef)
      unsubscribeBroadcast = () => off(broadcastsRef)

      connected.value = true
      error.value = null
      console.log('Connected to Firebase RTDB notifications')
    } catch (e: any) {
      console.error('Failed to connect to Firebase RTDB:', e)
      error.value = e.message
      connected.value = false
    }
  }

  /**
   * Disconnect from Firebase RTDB
   */
  const disconnect = () => {
    if (unsubscribeUser) {
      unsubscribeUser()
      unsubscribeUser = null
    }
    if (unsubscribeBroadcast) {
      unsubscribeBroadcast()
      unsubscribeBroadcast = null
    }
    connected.value = false
    console.log('Disconnected from Firebase RTDB notifications')
  }

  /**
   * Reconnect to Firebase RTDB
   */
  const reconnect = () => {
    disconnect()
    connect()
  }

  /**
   * Register a handler for a specific notification type
   */
  const on = (type: string, handler: NotificationHandler) => {
    if (!handlers.has(type)) {
      handlers.set(type, new Set())
    }
    handlers.get(type)!.add(handler)

    // Return unsubscribe function
    return () => {
      const typeHandlers = handlers.get(type)
      if (typeHandlers) {
        typeHandlers.delete(handler)
        if (typeHandlers.size === 0) {
          handlers.delete(type)
        }
      }
    }
  }

  /**
   * Unregister a handler for a specific notification type
   */
  const off_ = (type: string, handler: NotificationHandler) => {
    const typeHandlers = handlers.get(type)
    if (typeHandlers) {
      typeHandlers.delete(handler)
      if (typeHandlers.size === 0) {
        handlers.delete(type)
      }
    }
  }

  /**
   * Clear a notification from local state
   */
  const clearNotification = (notificationId: string) => {
    notifications.value = notifications.value.filter(n => n.id !== notificationId)
  }

  // Track active job watchers for cleanup
  const jobWatchers = new Map<string, () => void>()

  /**
   * Watch a specific job's status at /jobs/{userId}/{jobId}
   * Returns an unsubscribe function
   *
   * @param jobId - The job ID to watch
   * @param handler - Callback for status updates
   * @param userId - Optional Firebase Auth UID (from API response). Falls back to localStorage if not provided.
   * @returns Unsubscribe function
   */
  const watchJob = (jobId: string, handler: JobStatusHandler, userId?: string): (() => void) => {
    if (import.meta.server) {
      console.warn('Cannot watch job: Running on server')
      return () => {}
    }

    // Initialize Firebase if not already done
    if (!database) {
      if (!initFirebase() || !database) {
        console.warn('Cannot watch job: Firebase not available')
        return () => {}
      }
    }

    // Use provided userId (from API response) or fall back to localStorage
    const effectiveUserId = userId || getUserId()
    if (!effectiveUserId) {
      console.warn('Cannot watch job: No user ID available')
      return () => {}
    }

    const jobPath = `jobs/${effectiveUserId}/${jobId}`
    const jobRef = dbRef(database, jobPath)
    console.log(`Watching job at RTDB path: /${jobPath}`)

    // Listen for value changes on this specific job
    const unsubscribe = onValue(jobRef, (snapshot) => {
      const status = snapshot.val() as JobStatus | null
      if (status) {
        console.log(`Job ${jobId} status update:`, status.status, `(${status.progress}%)`)
        handler(status)
      }
    }, (error) => {
      console.error(`Error watching job ${jobId}:`, error)
    })

    // Store for cleanup
    jobWatchers.set(jobId, () => off(jobRef))

    // Return unsubscribe function
    return () => {
      off(jobRef)
      jobWatchers.delete(jobId)
    }
  }

  /**
   * Stop watching a specific job
   */
  const unwatchJob = (jobId: string) => {
    const unsubscribe = jobWatchers.get(jobId)
    if (unsubscribe) {
      unsubscribe()
      jobWatchers.delete(jobId)
    }
  }

  /**
   * Stop watching all jobs
   */
  const unwatchAllJobs = () => {
    for (const unsubscribe of jobWatchers.values()) {
      unsubscribe()
    }
    jobWatchers.clear()
  }

  // Watch for auth changes and connect/disconnect accordingly
  watch(() => isAuthenticated(), (authenticated) => {
    if (authenticated) {
      connect()
    } else {
      disconnect()
      unwatchAllJobs()
    }
  }, { immediate: true })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
    unwatchAllJobs()
  })

  return {
    connected: readonly(connected),
    error: readonly(error),
    notifications: readonly(notifications),
    connect,
    disconnect,
    reconnect,
    on,
    off: off_,
    clearNotification,
    watchJob,
    unwatchJob,
    unwatchAllJobs,
  }
}
