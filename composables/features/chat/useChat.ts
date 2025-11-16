/**
 * Chat Feature Composable
 *
 * ISOLATION RULES:
 * - This composable ONLY calls /api/chat/* endpoints
 * - NEVER imports from other features (documents, action-items, etc.)
 * - NEVER mutates other feature's state
 * - Only manages chat-specific state
 */

import { ref, computed } from 'vue'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface ChatSession {
  sessionId: string
  documentId: string
  messageCount: number
  lastMessageAt?: Date
  createdAt?: Date
}

export const useChat = (documentId: string) => {
  const messages = ref<ChatMessage[]>([])
  const sessionId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isOpen = ref(false)

  // Use the shared API composable for authentication
  const { apiCall } = useApi()

  /**
   * Send a message to the chat
   * Isolated to /api/chat/message endpoint only
   */
  const sendMessage = async (message: string): Promise<boolean> => {
    if (!message.trim()) return false

    loading.value = true
    error.value = null

    // Optimistically add user message
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    }
    messages.value.push(userMessage)

    try {
      const response = await apiCall('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify({
          documentId,
          message,
          sessionId: sessionId.value,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.statusText}`)
      }

      const data = await response.json()

      // Update session ID if this was first message
      if (data.sessionId && !sessionId.value) {
        sessionId.value = data.sessionId
      }

      // Add assistant response
      const assistantMessage: ChatMessage = {
        role: data.message.role,
        content: data.message.content,
        timestamp: new Date(data.message.timestamp),
        metadata: data.message.metadata,
      }
      messages.value.push(assistantMessage)

      loading.value = false
      return true
    } catch (err) {
      console.error('[useChat] Error sending message:', err)
      error.value = err instanceof Error ? err.message : 'Failed to send message'

      // Remove optimistic user message on error
      messages.value.pop()

      loading.value = false
      return false
    }
  }

  /**
   * Load chat history for the document
   * Isolated to /api/chat/history endpoint only
   */
  const loadHistory = async (): Promise<void> => {
    loading.value = true
    error.value = null

    try {
      let endpoint = `/api/chat/history/${documentId}`
      if (sessionId.value) {
        endpoint += `?sessionId=${sessionId.value}`
      }

      const response = await apiCall(endpoint, {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Failed to load history: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success && data.messages) {
        messages.value = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))

        if (data.sessionId) {
          sessionId.value = data.sessionId
        }
      }

      loading.value = false
    } catch (err) {
      console.error('[useChat] Error loading history:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load chat history'
      loading.value = false
    }
  }

  /**
   * Clear current chat session (local state only)
   */
  const clearChat = () => {
    messages.value = []
    sessionId.value = null
    error.value = null
  }

  /**
   * Delete chat session from server
   * Isolated to /api/chat/session endpoint only
   */
  const deleteSession = async (): Promise<boolean> => {
    if (!sessionId.value) return false

    loading.value = true
    error.value = null

    try {
      const response = await apiCall(`/api/chat/session/${sessionId.value}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Failed to delete session: ${response.statusText}`)
      }

      clearChat()
      loading.value = false
      return true
    } catch (err) {
      console.error('[useChat] Error deleting session:', err)
      error.value = err instanceof Error ? err.message : 'Failed to delete session'
      loading.value = false
      return false
    }
  }

  /**
   * Toggle chat widget open/closed
   */
  const toggleChat = () => {
    isOpen.value = !isOpen.value

    // Load history when opening if not already loaded
    if (isOpen.value && messages.value.length === 0) {
      loadHistory()
    }
  }

  const hasMessages = computed(() => messages.value.length > 0)
  const messageCount = computed(() => messages.value.length)

  return {
    // State
    messages,
    sessionId,
    loading,
    error,
    isOpen,
    hasMessages,
    messageCount,

    // Actions
    sendMessage,
    loadHistory,
    clearChat,
    deleteSession,
    toggleChat,
  }
}
