import { ref, readonly, type Component } from 'vue'

export interface ModalState {
  isOpen: boolean
  component: Component | null
  props?: Record<string, any>
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showClose?: boolean
  closeOnBackdrop?: boolean
}

const modalState = ref<ModalState>({
  isOpen: false,
  component: null,
  props: {},
  title: undefined,
  size: 'lg',
  showClose: true,
  closeOnBackdrop: true,
})

/**
 * Composable for managing modal state
 * Can be triggered by button click or data event
 */
export const useModal = () => {
  /**
   * Open modal with a component
   */
  const openModal = (options: {
    component: Component
    props?: Record<string, any>
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    showClose?: boolean
    closeOnBackdrop?: boolean
  }) => {
    modalState.value = {
      isOpen: true,
      component: options.component,
      props: options.props || {},
      title: options.title,
      size: options.size || 'lg',
      showClose: options.showClose !== false,
      closeOnBackdrop: options.closeOnBackdrop !== false,
    }
  }

  /**
   * Close modal
   */
  const closeModal = () => {
    modalState.value.isOpen = false
    // Clear component after animation
    setTimeout(() => {
      modalState.value.component = null
      modalState.value.props = {}
    }, 300)
  }

  /**
   * Toggle modal
   */
  const toggleModal = (options?: {
    component?: Component
    props?: Record<string, any>
    title?: string
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  }) => {
    if (modalState.value.isOpen) {
      closeModal()
    } else if (options?.component) {
      openModal(options)
    }
  }

  return {
    modalState: readonly(modalState),
    openModal,
    closeModal,
    toggleModal,
  }
}

/**
 * Global modal state (can be imported anywhere)
 */
export const globalModalState = modalState

