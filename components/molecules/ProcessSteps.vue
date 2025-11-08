<template>
  <nav class="py-4" aria-label="Progress">
    <ol class="flex items-center justify-center space-x-4 md:space-x-8">
      <li v-for="(step, index) in steps" :key="step.id || index" class="flex items-center">
        <!-- Step Circle -->
        <div class="relative flex items-center">
          <div
            class="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200"
            :class="getStepClasses(index)"
          >
            <Icon
              v-if="index < currentStep"
              name="heroicons:check"
              class="w-4 h-4 text-white"
            />
            <span
              v-else
              class="text-sm font-medium"
              :class="index === currentStep ? 'text-white' : 'text-slate-500'"
            >
              {{ index + 1 }}
            </span>
          </div>

          <!-- Active Step Pulse -->
          <div
            v-if="index === currentStep && showPulse"
            class="absolute inset-0 w-8 h-8 rounded-full bg-blue-600 animate-ping opacity-20"
          ></div>
        </div>

        <!-- Step Label -->
        <div class="ml-3 min-w-0" v-if="!compact">
          <p
            class="text-sm font-medium transition-colors duration-200"
            :class="getStepTextClasses(index)"
          >
            {{ step.label }}
          </p>
          <p
            v-if="step.description && (index <= currentStep || showAllDescriptions)"
            class="text-xs text-slate-500 mt-1"
          >
            {{ step.description }}
          </p>
        </div>

        <!-- Connector Line -->
        <div
          v-if="index < steps.length - 1"
          class="hidden md:block w-8 lg:w-12 h-px mx-4 transition-colors duration-200"
          :class="index < currentStep ? 'bg-green-500' : 'bg-slate-300'"
        ></div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
interface ProcessStep {
  id?: string
  label: string
  description?: string
  href?: string
}

interface Props {
  steps: ProcessStep[]
  currentStep: number
  showPulse?: boolean
  compact?: boolean
  showAllDescriptions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showPulse: true,
  compact: false,
  showAllDescriptions: false
})

// Get step circle classes
const getStepClasses = (index: number) => {
  if (index < props.currentStep) {
    // Completed step
    return 'bg-green-500 border-green-500'
  } else if (index === props.currentStep) {
    // Current active step
    return 'bg-blue-600 border-blue-600'
  } else {
    // Future step
    return 'bg-white border-slate-300'
  }
}

// Get step text classes
const getStepTextClasses = (index: number) => {
  if (index < props.currentStep) {
    return 'text-green-700'
  } else if (index === props.currentStep) {
    return 'text-blue-600'
  } else {
    return 'text-slate-400'
  }
}
</script>