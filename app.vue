<template>
  <div>
    <NuxtPage />
    <!-- Global Modal Container - can be triggered from anywhere -->
    <ModalContainer />
  </div>
</template>

<script setup lang="ts">
import ModalContainer from '~/components/organisms/ModalContainer.vue'

// Initialize WebSocket notifications for authenticated users
// This runs globally and connects/disconnects based on auth state
useNotifications()
</script>
