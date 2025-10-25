<template>
  <svg 
    :class="iconClasses"
    :width="sizePixels"
    :height="sizePixels"
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      v-if="name === 'checkmark'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M5 13l4 4L19 7"
    />
    <path 
      v-else-if="name === 'x-mark'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M6 18L18 6M6 6l12 12"
    />
    <path 
      v-else-if="name === 'clock'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path 
      v-else-if="name === 'document'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
    <path 
      v-else-if="name === 'chevron-down'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M19 9l-7 7-7-7"
    />
    <path 
      v-else-if="name === 'chevron-right'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M9 5l7 7-7 7"
    />
    <path 
      v-else-if="name === 'info'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
    <path 
      v-else-if="name === 'exclamation'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
    <path 
      v-else-if="name === 'phone'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
    <path 
      v-else-if="name === 'external-link'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
    <path 
      v-else-if="name === 'copy'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
    <path 
      v-else-if="name === 'star'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
    <path 
      v-else-if="name === 'calendar'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
    <path 
      v-else-if="name === 'user'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
    <path 
      v-else-if="name === 'shield-check'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.252a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
    <path 
      v-else-if="name === 'lightning-bolt'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
    <path 
      v-else-if="name === 'printer'"
      stroke-linecap="round" 
      stroke-linejoin="round" 
      stroke-width="2" 
      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
    />
  </svg>
</template>

<script setup lang="ts">
type IconName = 
  | 'checkmark' | 'x-mark' | 'clock' | 'document' | 'chevron-down' | 'chevron-right'
  | 'info' | 'exclamation' | 'phone' | 'external-link' | 'copy' | 'star' | 'calendar'
  | 'user' | 'shield-check' | 'lightning-bolt' | 'printer'

interface Props {
  name: IconName
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  color: 'current'
})

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32
}

const sizePixels = computed(() => sizeMap[props.size])

const iconClasses = computed(() => {
  const baseClasses = 'flex-shrink-0'
  const colorClasses = props.color === 'current' ? '' : `text-${props.color}`
  return `${baseClasses} ${colorClasses}`
})
</script>
