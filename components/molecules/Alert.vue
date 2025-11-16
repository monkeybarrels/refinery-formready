<script setup lang="ts">
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  message: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  dismissible: false
})

const emit = defineEmits<{
  dismiss: []
}>()

const typeConfig = {
  info: {
    bgClass: 'bg-blue-50 border-blue-200',
    textClass: 'text-blue-800',
    icon: 'info'
  },
  success: {
    bgClass: 'bg-green-50 border-green-200',
    textClass: 'text-green-800',
    icon: 'check'
  },
  warning: {
    bgClass: 'bg-yellow-50 border-yellow-200',
    textClass: 'text-yellow-800',
    icon: 'warning'
  },
  error: {
    bgClass: 'bg-red-50 border-red-200',
    textClass: 'text-red-800',
    icon: 'error'
  }
}

const config = computed(() => typeConfig[props.type])
</script>

<template>
  <div
    :class="['alert', config.bgClass, config.textClass]"
    role="alert"
  >
    <div class="flex items-start gap-3">
      <div class="flex-1">
        {{ message }}
      </div>
      <button
        v-if="dismissible"
        class="alert__dismiss"
        @click="emit('dismiss')"
        aria-label="Dismiss alert"
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.alert {
  padding: 0.75rem 1rem;
  border: 1px solid;
  border-radius: 0.375rem;
}

.alert__dismiss {
  flex-shrink: 0;
  padding: 0.125rem;
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.alert__dismiss:hover {
  opacity: 1;
}
</style>