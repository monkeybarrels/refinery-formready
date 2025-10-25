<template>
  <div class="bg-white rounded-2xl shadow-xl p-12 text-center">
    <div class="max-w-md mx-auto">
      <!-- Main Heading -->
      <h3 class="text-2xl font-semibold text-slate-900 mb-2">
        {{ stageTitle }}
      </h3>
      
      <!-- Description -->
      <p class="text-slate-600 mb-6">
        {{ stageDescription }}
      </p>
      
      <!-- Progress Bar -->
      <div class="mb-6">
        <ProgressBar 
          :percentage="progressPercentage"
          color="blue"
          :showLabel="true"
          :label="`Step ${currentStep + 1} of ${steps.length}`"
          :description="steps[currentStep]?.title"
        />
      </div>
      
      <!-- Progress Steps -->
      <div class="space-y-3">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="flex items-center"
          :class="stepClasses(index)"
        >
          <div class="flex-shrink-0 mr-3">
            <div 
              v-if="index < currentStep"
              class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <Icon name="checkmark" size="sm" color="white" />
            </div>
            <div 
              v-else-if="index === currentStep"
              class="w-6 h-6 bg-blue-800 rounded-full flex items-center justify-center"
            >
              <Spinner size="sm" color="white" variant="pulse" />
            </div>
            <div 
              v-else
              class="w-6 h-6 bg-slate-300 rounded-full"
            ></div>
          </div>
          
          <div class="flex-1">
            <p 
              class="text-sm font-medium"
              :class="index <= currentStep ? 'text-slate-900' : 'text-slate-500'"
            >
              {{ step.title }}
            </p>
            <p 
              v-if="step.description"
              class="text-xs"
              :class="index <= currentStep ? 'text-slate-600' : 'text-slate-400'"
            >
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Estimated Time -->
      <div class="mt-6 p-3 bg-slate-50 rounded-lg">
        <div class="flex items-center justify-center">
          <Icon name="clock" size="sm" color="slate-500" class="mr-2" />
          <span class="text-sm text-slate-600">
            Estimated time remaining: {{ estimatedTime }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '../atoms/Icon.vue'
import Spinner from '../atoms/Spinner.vue'
import ProgressBar from '../atoms/ProgressBar.vue'

interface Step {
  title: string
  description?: string
}

interface Props {
  stage: 'uploading' | 'analyzing' | 'processing'
}

const props = defineProps<Props>()

const steps: Step[] = [
  {
    title: 'Uploading PDF',
    description: 'Securely uploading your decision letter'
  },
  {
    title: 'Extracting Text',
    description: 'Converting PDF to readable text'
  },
  {
    title: 'Analyzing Content',
    description: 'Identifying conditions and decisions'
  },
  {
    title: 'Enhancing with VA Knowledge',
    description: 'Adding regulations and next steps'
  },
  {
    title: 'Generating Report',
    description: 'Creating your personalized analysis'
  }
]

const currentStep = computed(() => {
  switch (props.stage) {
    case 'uploading':
      return 0
    case 'analyzing':
      return 2
    case 'processing':
      return 4
    default:
      return 0
  }
})

const animatedProgress = ref(0)

const animateProgress = (from: number, to: number, duration: number) => {
  const startTime = Date.now()
  const difference = to - from
  
  const updateProgress = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    // Use ease-out easing for smooth animation
    const easedProgress = 1 - Math.pow(1 - progress, 3)
    animatedProgress.value = from + (difference * easedProgress)
    
    if (progress < 1) {
      requestAnimationFrame(updateProgress)
    } else {
      animatedProgress.value = to
    }
  }
  
  requestAnimationFrame(updateProgress)
}

const progressPercentage = computed(() => {
  return Math.round(animatedProgress.value)
})

// Animate progress based on stage
watch(() => props.stage, (newStage) => {
  let targetProgress = 0
  let duration = 2000 // 2 seconds per stage
  
  switch (newStage) {
    case 'uploading':
      targetProgress = 20
      duration = 2000
      break
    case 'analyzing':
      targetProgress = 80
      duration = 3000
      break
    case 'processing':
      targetProgress = 100
      duration = 2000
      break
    default:
      targetProgress = 0
  }
  
  // Only animate if we're moving forward, not backward
  if (targetProgress > animatedProgress.value) {
    animateProgress(animatedProgress.value, targetProgress, duration)
  }
}, { immediate: true })

const stageTitle = computed(() => {
  switch (props.stage) {
    case 'uploading':
      return 'Uploading Your Decision Letter'
    case 'analyzing':
      return 'Analyzing Your Decision Letter'
    case 'processing':
      return 'Processing Your Analysis'
    default:
      return 'Processing...'
  }
})

const stageDescription = computed(() => {
  switch (props.stage) {
    case 'uploading':
      return 'Please wait while we securely upload your file...'
    case 'analyzing':
      return 'This may take 30-60 seconds while we analyze your decision...'
    case 'processing':
      return 'Almost done! We\'re generating your personalized report...'
    default:
      return 'Please wait...'
  }
})

const estimatedTime = computed(() => {
  switch (props.stage) {
    case 'uploading':
      return '10-30 seconds'
    case 'analyzing':
      return '30-60 seconds'
    case 'processing':
      return '5-15 seconds'
    default:
      return '1-2 minutes'
  }
})

const stepClasses = (index: number) => {
  if (index < currentStep.value) {
    return 'opacity-100'
  } else if (index === currentStep.value) {
    return 'opacity-100'
  } else {
    return 'opacity-60'
  }
}
</script>
