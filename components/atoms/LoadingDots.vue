<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'currentColor'
})

const sizeClasses = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3'
}
</script>

<template>
  <div class="loading-dots">
    <span
      v-for="i in 3"
      :key="i"
      :class="['dot', sizeClasses[size]]"
      :style="{ backgroundColor: color, animationDelay: `${i * 0.15}s` }"
    />
  </div>
</template>

<style scoped>
.loading-dots {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.dot {
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>