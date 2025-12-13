<template>
  <div class="space-y-6 animate-pulse">
    <!-- Summary Cards Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 bg-slate-200 rounded-lg"></div>
          <div class="space-y-2">
            <div class="h-3 w-16 bg-slate-200 rounded"></div>
            <div class="h-6 w-8 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conditions List Skeleton -->
    <div class="space-y-4">
      <div v-for="i in 5" :key="i" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-start justify-between">
          <div class="flex-1 space-y-3">
            <div class="flex items-center space-x-3">
              <div class="h-6 w-48 bg-slate-200 rounded"></div>
              <div class="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div class="h-4 w-32 bg-slate-200 rounded"></div>
            <div class="flex items-center space-x-4">
              <div class="h-4 w-24 bg-slate-200 rounded"></div>
              <div class="h-4 w-28 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div class="h-5 w-5 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
