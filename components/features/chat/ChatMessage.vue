<template>
  <div
    :class="[
      'chat-message',
      `chat-message--${message.role}`,
      { 'chat-message--loading': isLoading }
    ]"
  >
    <div class="chat-message__avatar">
      <div v-if="message.role === 'user'" class="avatar avatar--user">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div v-else class="avatar avatar--assistant">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </div>
    </div>

    <div class="chat-message__content">
      <div class="chat-message__text">
        {{ message.content }}
      </div>
      <div v-if="showTimestamp" class="chat-message__timestamp">
        {{ formattedTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ChatMessage } from '~/composables/features/chat/useChat'

/**
 * ChatMessage Component
 *
 * ISOLATION: Pure presentation component
 * - Only receives props, no external state access
 * - No API calls, no feature dependencies
 * - Fully self-contained and testable
 */

interface Props {
  message: ChatMessage
  showTimestamp?: boolean
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTimestamp: true,
  isLoading: false,
})

const formattedTime = computed(() => {
  if (!props.message.timestamp) return ''

  const date = new Date(props.message.timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`

  return date.toLocaleDateString()
})
</script>

<style scoped>
.chat-message {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-message--user {
  background-color: #f8f9fa;
}

.chat-message--assistant {
  background-color: #ffffff;
}

.chat-message--loading {
  opacity: 0.6;
}

.chat-message__avatar {
  flex-shrink: 0;
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.avatar--user {
  background-color: #3b82f6;
}

.avatar--assistant {
  background-color: #10b981;
}

.avatar svg {
  width: 1.25rem;
  height: 1.25rem;
}

.chat-message__content {
  flex: 1;
  min-width: 0;
}

.chat-message__text {
  color: #1f2937;
  font-size: 0.9375rem;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.chat-message__timestamp {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}
</style>