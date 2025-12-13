<template>
  <div class="space-y-4 animate-pulse">
    <!-- Claims List Skeleton -->
    <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1 space-y-3">
          <!-- Title and Status -->
          <div class="flex items-center space-x-3">
            <div class="h-5 w-32 bg-slate-200 rounded"></div>
            <div class="h-6 w-20 bg-slate-200 rounded-full"></div>
          </div>

          <!-- Date -->
          <div class="h-4 w-40 bg-slate-200 rounded"></div>

          <!-- Conditions Tags -->
          <div class="flex flex-wrap gap-2">
            <div v-for="j in 3" :key="j" class="h-6 w-24 bg-slate-200 rounded-full"></div>
          </div>

          <!-- Status Progress (for active claims) -->
          <div v-if="i <= 2" class="pt-4 border-t border-slate-100">
            <div class="flex items-center space-x-2">
              <div class="h-4 w-16 bg-slate-200 rounded"></div>
              <div class="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>

        <div class="h-5 w-5 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
