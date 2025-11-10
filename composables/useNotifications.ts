import { ref, onMounted, onUnmounted, watch, readonly } from 'vue'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './useAuth'
import { useSubscription } from './useSubscription'

interface Notification {
  type: string
  data: any
}

/**
 * Composable for WebSocket push notifications
 * Connects to /notifications namespace and listens for real-time updates
 */
export const useNotifications = () => {
  const socket = ref<Socket | null>(null)
  const connected = ref(false)
  const error = ref<string | null>(null)
  
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
        
        // Handle premium status changes
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
  }
}

