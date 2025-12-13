<template>
  <div class="animate-pulse">
    <!-- Packages Grid Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <div class="h-5 w-40 bg-slate-200 rounded"></div>
            <div class="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
          <div class="h-6 w-16 bg-slate-200 rounded-full"></div>
        </div>

        <!-- Progress -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="h-3 w-16 bg-slate-200 rounded"></div>
            <div class="h-3 w-8 bg-slate-200 rounded"></div>
          </div>
          <div class="h-2 w-full bg-slate-200 rounded-full"></div>
        </div>

        <!-- Potential Value -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div class="h-4 w-28 bg-slate-200 rounded"></div>
          <div class="h-6 w-20 bg-slate-200 rounded"></div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between pt-4 border-t border-slate-100">
          <div class="h-3 w-24 bg-slate-200 rounded"></div>
          <div class="h-5 w-5 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
