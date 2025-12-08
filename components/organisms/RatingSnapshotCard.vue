<template>
  <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl p-8 text-white overflow-hidden relative">
    <!-- Background Pattern -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
    <div class="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

    <div class="relative z-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-xl font-semibold text-blue-100">Your Disability Rating</h2>
        <div class="flex items-center space-x-2">
          <div class="bg-blue-500/30 px-3 py-1 rounded-full text-xs font-medium flex items-center border border-blue-400/30">
            <Icon name="heroicons:check-circle" class="w-3 h-3 mr-1.5" />
            Verified by VA.gov
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <!-- Left: The Big Gauge -->
        <div class="flex flex-col items-center justify-center">
          <div class="relative w-48 h-48">
            <!-- Gauge Background -->
            <svg class="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                stroke-width="12"
                class="text-blue-900/40"
              />
              <!-- Gauge Progress -->
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                stroke-width="12"
                stroke-linecap="round"
                class="text-white transition-all duration-1000 ease-out"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
              />
            </svg>
            <!-- Center Text -->
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-5xl font-bold tracking-tighter">{{ combinedRating }}%</span>
              <span class="text-sm text-blue-200 font-medium mt-1">Combined</span>
            </div>
          </div>
          
          <div v-if="effectiveDate" class="mt-4 text-sm text-blue-200 bg-blue-900/30 px-4 py-1.5 rounded-full">
            Effective Date: <span class="text-white font-medium">{{ formatDate(effectiveDate) }}</span>
          </div>
        </div>

        <!-- Right: Key Stats & Details -->
        <div class="space-y-6">
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <div class="text-sm text-blue-200 mb-1">Service-Connected Conditions</div>
            <div class="flex items-baseline">
              <span class="text-3xl font-bold">{{ conditionCount }}</span>
              <span class="ml-2 text-sm text-blue-200">conditions found</span>
            </div>
          </div>

          <!-- Top Conditions Preview -->
          <div v-if="topConditions.length > 0">
            <div class="text-xs font-bold text-blue-300 uppercase tracking-wider mb-3">Highest Rated Conditions</div>
            <div class="space-y-3">
              <div 
                v-for="condition in topConditions" 
                :key="condition.name"
                class="flex items-center justify-between text-sm group"
              >
                <span class="font-medium text-blue-50 truncate pr-4">{{ condition.name }}</span>
                <span class="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{{ condition.ratingPercentage }}%</span>
              </div>
            </div>
          </div>

          <div class="pt-2">
            <NuxtLink 
              to="/va-profile" 
              class="inline-flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors group"
            >
              View Full Disability Breakdown
              <Icon name="heroicons:arrow-right" class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  combinedRating: number
  effectiveDate?: Date | string
  lastSyncDate: Date | string
  conditionCount: number
  conditions: Array<{
    name: string
    ratingPercentage: number
    isServiceConnected: boolean
  }>
}>()

// Get top 3 conditions by rating percentage
const topConditions = computed(() => {
  return props.conditions
    .filter(c => c.isServiceConnected)
    .sort((a, b) => b.ratingPercentage - a.ratingPercentage)
    .slice(0, 3)
})

// Gauge calculations
const radius = 88
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() => {
  const progress = props.combinedRating / 100
  return circumference * (1 - progress)
})

const formatDate = (dateString: Date | string) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const formatSyncDate = (dateString: Date | string) => {
  if (!dateString) return 'recently'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formatDate(dateString)
}
</script>
