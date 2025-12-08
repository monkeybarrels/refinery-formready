<template>
  <Modal
    :is-open="modalState.isOpen"
    :title="modalState.title"
    :size="modalState.size"
    :show-close="modalState.showClose"
    :close-on-backdrop="modalState.closeOnBackdrop"
    :show-footer="false"
    @update:is-open="handleClose"
    @close="handleClose"
  >
    <component
      v-if="modalState.component"
      :is="modalState.component"
      v-bind="modalState.props"
    />
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/molecules/Modal.vue'
import { useModal } from '~/composables/useModal'

const { modalState, closeModal } = useModal()

const handleClose = () => {
  closeModal()
}
</script>

