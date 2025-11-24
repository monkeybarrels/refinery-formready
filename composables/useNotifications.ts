import { ref, onMounted, onUnmounted, watch, readonly, computed } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './useAuth'
import { useSubscription } from './useSubscription'
import { useFirebaseNotifications } from './useFirebaseNotifications'

interface Notification {
  type: string
  data: any
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  buffered?: boolean
  createdAt?: string
  id?: string
  acknowledged?: boolean
}

type NotificationHandler = (notification: Notification) => void | Promise<void>
type NotificationProviderType = 'socketio' | 'firebase-rtdb' | 'auto'

/**
 * Composable for push notifications
 * Supports both Socket.IO (WebSocket) and Firebase RTDB providers
 * Set NUXT_PUBLIC_NOTIFICATION_PROVIDER to switch:
 * - 'socketio': Use Socket.IO WebSocket connections (default for local dev)
 * - 'firebase-rtdb': Use Firebase Realtime Database (recommended for cloud)
 * - 'auto' (default): Auto-detect based on environment
 */
export const useNotifications = () => {
  const config = useRuntimeConfig()
  const providerType = (config.public.notificationProvider || 'auto') as NotificationProviderType

  // Determine which provider to use
  const useFirebase = computed(() => {
    if (providerType === 'firebase-rtdb') return true
    if (providerType === 'socketio') return false
    // Auto-detect: use Firebase if configured, otherwise Socket.IO
    return !!(config.public.firebaseDatabaseUrl && config.public.firebaseProjectId)
  })

  // If using Firebase, delegate to Firebase composable
  if (useFirebase.value) {
    console.log('Using Firebase RTDB for notifications')
    const firebase = useFirebaseNotifications()
    return {
      socket: ref(null), // No socket in Firebase mode
      connected: firebase.connected,
      error: firebase.error,
      connect: firebase.connect,
      disconnect: firebase.disconnect,
      reconnect: firebase.reconnect,
      on: firebase.on,
      off: firebase.off,
    }
  }

  // Socket.IO implementation (original code)
  console.log('Using Socket.IO for notifications')
  const socket = ref<Socket | null>(null)
  const connected = ref(false)
  const error = ref<string | null>(null)
  const handlers = new Map<string, Set<NotificationHandler>>()

  const { isAuthenticated } = useAuth()
  const { refreshSubscriptionStatus } = useSubscription()

  /**
   * Connect to notifications socket
   */
  const connect = () => {
    if (import.meta.server) return
    if (!isAuthenticated()) return
    if (socket.value?.connected) return

    const apiUrl = useRuntimeConfig().public.apiUrl || 'http://localhost:3001'
    const token = localStorage.getItem('auth_token')

    if (!token) {
      console.warn('⚠️ No auth token found, cannot connect to notifications')
      return
    }

    try {
      console.log('🔌 Connecting to notifications socket...')
      
      socket.value = io(`${apiUrl}/notifications`, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      })

      socket.value.on('connect', () => {
        console.log('✅ Connected to notifications socket')
        connected.value = true
        error.value = null
      })

      socket.value.on('connected', (data: { userId: string; timestamp: string }) => {
        console.log('✅ Notifications socket authenticated:', data)
      })

      socket.value.on('notification', async (notification: Notification) => {
        console.log('📬 Received notification:', notification)

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
          console.log(`🔄 Premium status changed: ${isPremium}`)

          // Refresh subscription status to sync with backend
          try {
            await refreshSubscriptionStatus()
            console.log('✅ Premium status synced')
          } catch (e) {
            console.error('❌ Failed to sync premium status:', e)
          }
        }
      })

      socket.value.on('disconnect', () => {
        console.log('🔌 Disconnected from notifications socket')
        connected.value = false
      })

      socket.value.on('connect_error', (err: Error) => {
        console.error('❌ Notification socket connection error:', err.message)
        error.value = err.message
        connected.value = false
      })
    } catch (e: any) {
      console.error('❌ Failed to initialize notifications socket:', e)
      error.value = e.message || 'Failed to connect'
    }
  }

  /**
   * Disconnect from notifications socket
   */
  const disconnect = () => {
    if (socket.value) {
      console.log('🔌 Disconnecting from notifications socket...')
      socket.value.disconnect()
      socket.value = null
      connected.value = false
    }
  }

  /**
   * Reconnect to notifications socket
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
  const off = (type: string, handler: NotificationHandler) => {
    const typeHandlers = handlers.get(type)
    if (typeHandlers) {
      typeHandlers.delete(handler)
      if (typeHandlers.size === 0) {
        handlers.delete(type)
      }
    }
  }

  // Watch for auth changes and connect/disconnect accordingly
  watch(() => isAuthenticated(), (authenticated) => {
    if (authenticated) {
      connect()
    } else {
      disconnect()
    }
  }, { immediate: true })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
  })

  return {
    socket: readonly(socket),
    connected: readonly(connected),
    error: readonly(error),
    connect,
    disconnect,
    reconnect,
    on,
    off,
  }
}

