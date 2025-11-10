<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Initialize WebSocket notifications for authenticated users
// This runs globally and connects/disconnects based on auth state
useNotifications()
</script>
