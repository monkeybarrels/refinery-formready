# Modal System Usage

## Overview

The modal system consists of:
1. **`DecisionInfo.vue`** - Component for rendering extracted decision data
2. **`useModal.ts`** - Composable for managing modal state
3. **`ModalContainer.vue`** - Global modal container (already added to `app.vue`)

## Usage Examples

### 1. Open Modal from Button Click

```vue
<script setup lang="ts">
import { useModal } from '~/composables/useModal'
import DecisionInfo from '~/components/organisms/DecisionInfo.vue'

const { openModal } = useModal()

const showExtraction = async (fileId: string) => {
  // Fetch extraction data
  const response = await apiCall(`/api/extraction/extract`, {
    method: 'POST',
    body: JSON.stringify({ fileId })
  })
  const extractionData = await response.json()
  
  // Open modal with DecisionInfo component
  openModal({
    component: DecisionInfo,
    props: { extractionData },
    title: 'Extracted Decision Information',
    size: '2xl'
  })
}
</script>

<template>
  <button @click="showExtraction('file-id')">
    View Extraction
  </button>
</template>
```

### 2. Open Modal from Data Event

```vue
<script setup lang="ts">
import { useModal } from '~/composables/useModal'
import DecisionInfo from '~/components/organisms/DecisionInfo.vue'

const { openModal } = useModal()

// Listen for custom event
onMounted(() => {
  window.addEventListener('show-extraction', (event: CustomEvent) => {
    openModal({
      component: DecisionInfo,
      props: { extractionData: event.detail },
      title: 'Decision Information',
      size: '2xl'
    })
  })
})
</script>
```

### 3. Use Any Component in Modal

```vue
<script setup lang="ts">
import { useModal } from '~/composables/useModal'
import MyCustomComponent from '~/components/MyCustomComponent.vue'

const { openModal, closeModal } = useModal()

const showCustomModal = () => {
  openModal({
    component: MyCustomComponent,
    props: { 
      someProp: 'value',
      anotherProp: 123
    },
    title: 'Custom Modal',
    size: 'lg',
    showClose: true,
    closeOnBackdrop: true
  })
}
</script>
```

## API Reference

### `useModal()`

Returns:
- `modalState` - Readonly reactive state
- `openModal(options)` - Open modal with component
- `closeModal()` - Close modal
- `toggleModal(options?)` - Toggle modal open/close

### `openModal(options)`

Options:
- `component: Component` - Vue component to render (required)
- `props?: Record<string, any>` - Props to pass to component
- `title?: string` - Modal title
- `size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'` - Modal size (default: 'lg')
- `showClose?: boolean` - Show close button (default: true)
- `closeOnBackdrop?: boolean` - Close on backdrop click (default: true)

### `DecisionInfo` Component Props

```typescript
interface ExtractionData {
  veteranInfo?: {
    firstName?: string
    lastName?: string
    fileNumber?: string
  }
  combinedRating?: number
  monthlyPayment?: number
  ratings?: Array<{
    condition: string
    decision: 'granted' | 'denied' | 'deferred'
    ratingPercentage?: number
    effectiveDate?: string
  }>
  denialReasons?: Array<{
    condition: string
    reason: string
    laymanReason?: string
    nextSteps?: string
  }>
  deferredReasons?: Array<{
    condition: string
    reason: string
  }>
}
```

