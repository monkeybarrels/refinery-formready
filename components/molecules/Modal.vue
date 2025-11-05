<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="handleBackdropClick"
        />

        <!-- Modal Container -->
        <div class="flex items-center justify-center min-h-screen p-4">
          <div
            class="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all"
            @click.stop
          >
            <!-- Close Button -->
            <button
              v-if="showClose"
              @click="handleClose"
              class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close modal"
            >
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>

            <!-- Icon (if provided) -->
            <div v-if="icon" class="flex items-center justify-center mb-4">
              <div :class="iconContainerClass">
                <Icon :name="icon" class="w-8 h-8" />
              </div>
            </div>

            <!-- Title -->
            <h3 v-if="title" class="text-xl font-bold text-slate-900 mb-2 text-center">
              {{ title }}
            </h3>

            <!-- Description -->
            <p v-if="description" class="text-slate-600 mb-6 text-center">
              {{ description }}
            </p>

            <!-- Content Slot -->
            <div v-if="$slots.default" class="mb-6">
              <slot />
            </div>

            <!-- Actions -->
            <div class="flex gap-3 justify-end">
              <Button
                v-if="showCancel"
                @click="handleCancel"
                variant="ghost"
                :disabled="loading"
              >
                {{ cancelText }}
              </Button>
              <Button
                @click="handleConfirm"
                :variant="confirmVariant"
                :disabled="loading"
              >
                <span v-if="loading" class="flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {{ loadingText }}
                </span>
                <span v-else>{{ confirmText }}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from '~/components/atoms/Button.vue'

interface Props {
  isOpen: boolean
  title?: string
  description?: string
  icon?: string
  iconVariant?: 'danger' | 'warning' | 'info' | 'success'
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  showClose?: boolean
  showCancel?: boolean
  loading?: boolean
  loadingText?: string
  closeOnBackdrop?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'primary',
  showClose: true,
  showCancel: true,
  loading: false,
  loadingText: 'Processing...',
  closeOnBackdrop: true,
  iconVariant: 'info'
})

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  confirm: []
  cancel: []
  close: []
}>()

const iconContainerClass = computed(() => {
  const baseClasses = 'w-16 h-16 rounded-full flex items-center justify-center'

  switch (props.iconVariant) {
    case 'danger':
      return `${baseClasses} bg-red-100 text-red-600`
    case 'warning':
      return `${baseClasses} bg-amber-100 text-amber-600`
    case 'success':
      return `${baseClasses} bg-green-100 text-green-600`
    case 'info':
    default:
      return `${baseClasses} bg-blue-100 text-blue-600`
  }
})

const handleClose = () => {
  emit('update:isOpen', false)
  emit('close')
}

const handleCancel = () => {
  emit('update:isOpen', false)
  emit('cancel')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.loading) {
    handleClose()
  }
}

// Prevent body scroll when modal is open
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
