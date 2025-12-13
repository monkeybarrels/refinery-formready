<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <Spinner class="w-8 h-8" />
    <span class="mt-3 text-slate-600">{{ message }}</span>
  </div>
</template>

<script setup lang="ts">
import Spinner from '~/components/atoms/Spinner.vue'

defineProps<{
  message?: string
}>()
</script>
