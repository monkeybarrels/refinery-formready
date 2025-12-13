<template>
  <div class="space-y-8 animate-pulse">
    <!-- Stats Row Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="i in 3" :key="i" class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="flex items-center justify-between">
          <div class="space-y-2">
            <div class="h-4 w-24 bg-slate-200 rounded"></div>
            <div class="h-8 w-32 bg-slate-200 rounded"></div>
          </div>
          <div class="h-12 w-12 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    <!-- Sync Status Skeleton -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="h-5 w-5 bg-slate-200 rounded"></div>
          <div class="h-4 w-48 bg-slate-200 rounded"></div>
        </div>
        <div class="h-9 w-40 bg-slate-200 rounded-lg"></div>
      </div>
    </div>

    <!-- Two Column Layout Skeleton -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Action Items Skeleton -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <div class="px-6 py-4 border-b border-slate-200">
          <div class="h-6 w-32 bg-slate-200 rounded"></div>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="i in 4" :key="i" class="flex items-center space-x-3">
            <div class="h-5 w-5 bg-slate-200 rounded"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-full bg-slate-200 rounded"></div>
              <div class="h-3 w-24 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Claims Skeleton -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div class="h-6 w-28 bg-slate-200 rounded"></div>
          <div class="h-4 w-20 bg-slate-200 rounded"></div>
        </div>
        <div class="p-6 space-y-4">
          <div v-for="i in 2" :key="i" class="border border-slate-200 rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="h-5 w-32 bg-slate-200 rounded"></div>
              <div class="h-6 w-20 bg-slate-200 rounded-full"></div>
            </div>
            <div class="h-4 w-40 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Packages Section Skeleton -->
    <div class="bg-white rounded-xl shadow-sm border border-slate-200">
      <div class="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <div class="h-6 w-32 bg-slate-200 rounded"></div>
        <div class="h-4 w-20 bg-slate-200 rounded"></div>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="border border-slate-200 rounded-lg p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div class="h-5 w-36 bg-slate-200 rounded"></div>
              <div class="h-6 w-16 bg-slate-200 rounded-full"></div>
            </div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <div class="h-3 w-16 bg-slate-200 rounded"></div>
                <div class="h-3 w-8 bg-slate-200 rounded"></div>
              </div>
              <div class="h-2 w-full bg-slate-200 rounded-full"></div>
            </div>
            <div class="h-4 w-24 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
