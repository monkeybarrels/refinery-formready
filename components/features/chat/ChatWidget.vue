<template>
  <FeatureFlag flag-name="case_aware_chat_enabled">
    <div :class="['chat-widget', { 'chat-widget--open': isOpen }]">
      <!-- Toggle Button (when closed) -->
      <button
        v-if="!isOpen"
        class="chat-widget__toggle"
        @click="toggleChat"
        aria-label="Open chat assistant"
      >
        <Icon name="chat" class="chat-widget__toggle-icon" />
        <Badge v-if="messageCount > 0" :count="messageCount" variant="danger" class="chat-widget__badge" />
      </button>

      <!-- Chat Panel (when open) -->
      <div v-if="isOpen" class="chat-widget__panel">
        <!-- Header -->
        <div class="chat-widget__header">
          <div class="chat-widget__title">
            <Icon name="chat" />
            <span>VA Claims Assistant</span>
          </div>
          <div class="chat-widget__actions">
            <button
              v-if="hasMessages"
              class="chat-widget__action"
              @click="handleClearChat"
              aria-label="Clear chat"
              title="Clear chat"
            >
              <Icon name="trash" />
            </button>
            <button
              class="chat-widget__action"
              @click="toggleChat"
              aria-label="Close chat"
            >
              <Icon name="close" />
            </button>
          </div>
        </div>

        <!-- Messages Container -->
        <div ref="messagesContainer" class="chat-widget__messages">
          <!-- Welcome Message (empty state) -->
          <div v-if="!hasMessages && !loading" class="chat-widget__welcome">
            <Icon name="info-circle" size="large" />
            <h3>Ask about your VA claim</h3>
            <p>I can help you understand your claim analysis and answer questions about your benefits.</p>
          </div>

          <!-- Error Message -->
          <Alert v-if="error" type="error" :message="error" />

          <!-- Messages -->
          <ChatMessage
            v-for="(message, index) in messages"
            :key="`${sessionId}-${index}`"
            :message="message"
            :show-timestamp="true"
          />

          <!-- Loading Indicator -->
          <div v-if="loading" class="chat-widget__loading">
            <LoadingDots />
          </div>
        </div>

        <!-- Input Area -->
        <div class="chat-widget__input-container">
          <form @submit.prevent="handleSendMessage" class="chat-widget__form">
            <textarea
              v-model="inputMessage"
              class="chat-widget__input"
              placeholder="Ask a question about your VA claim..."
              rows="1"
              :disabled="loading"
              @keydown.enter.exact.prevent="handleSendMessage"
              @input="autoResize"
              ref="inputTextarea"
            />
            <button
              type="submit"
              class="chat-widget__send"
              :disabled="!inputMessage.trim() || loading"
              aria-label="Send message"
            >
              <Icon name="send" />
            </button>
          </form>
          <div class="chat-widget__disclaimer">
            <span class="text-xs">This assistant provides information only. Not medical or legal advice.</span>
          </div>
        </div>
      </div>
    </div>

    <template #fallback>
      <!-- Silent fallback - no UI shown when feature is disabled -->
    </template>
  </FeatureFlag>
</template>

<script setup lang="ts">
/**
 * ChatWidget Component
 *
 * ISOLATION PRINCIPLES:
 * - Only receives documentId as prop
 * - Uses shared atoms/molecules (Icon, Badge, Alert, LoadingDots)
 * - Uses only useChat composable (isolated to /api/chat/* endpoints)
 * - Never imports from other features (documents, action-items, etc.)
 * - Protected by feature flag
 */

import { ref, nextTick } from 'vue'
import { useChat } from '~/composables/features/chat/useChat'
import ChatMessage from './ChatMessage.vue'
import FeatureFlag from '~/components/organisms/FeatureFlag.vue'

// Shared atoms/molecules (generic, no business logic)
import Icon from '~/components/atoms/Icon.vue'
import Badge from '~/components/atoms/Badge.vue'
import Alert from '~/components/molecules/Alert.vue'
import LoadingDots from '~/components/atoms/LoadingDots.vue'

interface Props {
  documentId: string
}

const props = defineProps<Props>()

// Initialize chat composable (isolated state)
const {
  messages,
  sessionId,
  loading,
  error,
  isOpen,
  hasMessages,
  messageCount,
  sendMessage,
  deleteSession,
  toggleChat,
} = useChat(props.documentId)

// Local UI state
const inputMessage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const inputTextarea = ref<HTMLTextAreaElement | null>(null)

const handleSendMessage = async () => {
  const message = inputMessage.value.trim()
  if (!message || loading.value) return

  const success = await sendMessage(message)

  if (success) {
    inputMessage.value = ''
    if (inputTextarea.value) {
      inputTextarea.value.style.height = 'auto'
    }
    await nextTick()
    scrollToBottom()
  }
}

const handleClearChat = async () => {
  if (!confirm('Are you sure you want to clear this chat?')) return
  await deleteSession()
  inputMessage.value = ''
}

const autoResize = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${Math.min(target.scrollHeight, 120)}px`
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>

<style scoped>
/* Widget positioning and animations */
.chat-widget {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
}

.chat-widget__toggle {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.chat-widget__toggle:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5);
}

.chat-widget__toggle-icon {
  color: white;
}

.chat-widget__badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
}

.chat-widget__panel {
  width: 24rem;
  height: 32rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-widget__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.chat-widget__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.chat-widget__actions {
  display: flex;
  gap: 0.5rem;
}

.chat-widget__action {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.chat-widget__action:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chat-widget__messages {
  flex: 1;
  overflow-y: auto;
  background-color: #f9fafb;
}

.chat-widget__welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.chat-widget__welcome h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 1rem 0 0.5rem;
}

.chat-widget__welcome p {
  font-size: 0.875rem;
  line-height: 1.5;
}

.chat-widget__loading {
  display: flex;
  justify-content: flex-start;
  padding: 0.75rem 1rem;
}

.chat-widget__input-container {
  border-top: 1px solid #e5e7eb;
  background-color: white;
}

.chat-widget__form {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
}

.chat-widget__input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: none;
  font-family: inherit;
  max-height: 120px;
  transition: border-color 0.2s;
}

.chat-widget__input:focus {
  outline: none;
  border-color: #10b981;
}

.chat-widget__input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.chat-widget__send {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background-color: #10b981;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.chat-widget__send:hover:not(:disabled) {
  background-color: #059669;
}

.chat-widget__send:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.chat-widget__disclaimer {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem 0.75rem;
  font-size: 0.6875rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .chat-widget__panel {
    width: calc(100vw - 2rem);
    height: calc(100vh - 4rem);
    max-width: 24rem;
  }
}
</style>