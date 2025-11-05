<template>
  <div class="border-b border-gray-200 last:border-0">
    <button
      @click="isOpen = !isOpen"
      class="w-full text-left py-4 flex items-start justify-between hover:text-blue-600 transition-colors"
      :aria-expanded="isOpen"
    >
      <span class="font-semibold text-gray-900 pr-8">{{ question }}</span>
      <Icon
        :name="isOpen ? 'heroicons:chevron-up' : 'heroicons:chevron-down'"
        class="w-5 h-5 text-gray-400 flex-shrink-0 transition-transform"
      />
    </button>
    <div
      v-show="isOpen"
      class="pb-4 text-gray-700 leading-relaxed"
    >
      {{ answer }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  question: string
  answer: string
}>()

const isOpen = ref(false)
</script>
