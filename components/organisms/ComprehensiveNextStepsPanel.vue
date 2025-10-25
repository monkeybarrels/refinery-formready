<template>
  <div 
    :class="panelClasses"
    class="bg-white rounded-2xl shadow-xl p-6 max-h-screen overflow-y-auto"
  >
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Icon name="lightning-bolt" size="lg" color="indigo-600" class="mr-3" />
        <h2 class="text-xl font-bold text-slate-900">Your Action Plan</h2>
      </div>
      <Button 
        variant="ghost" 
        size="sm"
        icon="printer"
        @click="printActionPlan"
      >
        Print
      </Button>
    </div>
    
    <div v-if="!comprehensiveNextSteps" class="text-center py-8">
      <Icon name="info" size="lg" color="slate-400" class="mx-auto mb-2" />
      <p class="text-slate-500">No action plan available</p>
    </div>
    
    <div v-else class="space-y-6">
      <!-- Summary Banner -->
      <div v-if="comprehensiveNextSteps.summary" class="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
        <h3 class="font-medium text-indigo-900 mb-2">Summary</h3>
        <p class="text-sm text-indigo-800 leading-relaxed">
          {{ comprehensiveNextSteps.summary }}
        </p>
      </div>
      
      <!-- Immediate Actions -->
      <div v-if="comprehensiveNextSteps.immediate_actions?.length > 0">
        <button
          @click="toggleSection('immediate')"
          class="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
        >
          <div class="flex items-center">
            <Icon name="star" size="sm" color="slate-600" class="mr-2" />
            <span class="font-medium text-slate-700">Immediate Actions</span>
            <Badge 
              :text="`${comprehensiveNextSteps.immediate_actions.length} items`"
              size="sm"
              class="ml-2"
            />
          </div>
          <Icon 
            :name="expandedSections.immediate ? 'chevron-down' : 'chevron-right'" 
            size="sm" 
            color="slate-500"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': expandedSections.immediate }"
          />
        </button>
        
        <div v-if="expandedSections.immediate" class="mt-3 space-y-2">
          <div
            v-for="(action, index) in comprehensiveNextSteps.immediate_actions"
            :key="index"
            class="flex items-start p-3 bg-slate-50 rounded-lg"
          >
            <Icon name="checkmark" size="sm" color="green-600" class="mr-2 mt-0.5 flex-shrink-0" />
            <span class="text-sm text-slate-700">{{ action }}</span>
          </div>
        </div>
      </div>
      
      <!-- Appeal Options -->
      <div v-if="comprehensiveNextSteps.appeal_options?.options?.length > 0">
        <button
          @click="toggleSection('appeal')"
          class="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
        >
          <div class="flex items-center">
            <Icon name="shield-check" size="sm" color="slate-600" class="mr-2" />
            <span class="font-medium text-slate-700">Appeal Options</span>
            <Badge 
              :text="`${comprehensiveNextSteps.appeal_options.options.length} options`"
              size="sm"
              class="ml-2"
            />
          </div>
          <Icon 
            :name="expandedSections.appeal ? 'chevron-down' : 'chevron-right'" 
            size="sm" 
            color="slate-500"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': expandedSections.appeal }"
          />
        </button>
        
        <div v-if="expandedSections.appeal" class="mt-3 space-y-3">
          <div
            v-for="(option, index) in comprehensiveNextSteps.appeal_options.options"
            :key="index"
            class="p-4 border border-slate-200 rounded-lg"
          >
            <h5 class="font-medium text-slate-900 mb-2">{{ option.option }}</h5>
            <p class="text-sm text-slate-600 mb-2">{{ option.best_for }}</p>
            <div class="flex items-center justify-between text-xs text-slate-500">
              <span>Deadline: {{ option.deadline }}</span>
              <Badge 
                :variant="getUrgencyVariant(option.deadline)"
                :text="getUrgencyText(option.deadline)"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
      
      <!-- Evidence Gathering Timeline -->
      <div v-if="comprehensiveNextSteps.evidence_gathering?.priority_evidence?.length > 0">
        <button
          @click="toggleSection('evidence')"
          class="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
        >
          <div class="flex items-center">
            <Icon name="document" size="sm" color="slate-600" class="mr-2" />
            <span class="font-medium text-slate-700">Evidence Timeline</span>
            <Badge 
              :text="`${comprehensiveNextSteps.evidence_gathering.priority_evidence.length} items`"
              size="sm"
              class="ml-2"
            />
          </div>
          <Icon 
            :name="expandedSections.evidence ? 'chevron-down' : 'chevron-right'" 
            size="sm" 
            color="slate-500"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': expandedSections.evidence }"
          />
        </button>
        
        <div v-if="expandedSections.evidence" class="mt-3 space-y-3">
          <div
            v-for="(evidence, index) in comprehensiveNextSteps.evidence_gathering.priority_evidence"
            :key="index"
            class="p-3 bg-amber-50 border border-amber-200 rounded-lg"
          >
            <div class="flex items-start">
              <Icon name="star" size="sm" color="amber-600" class="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h6 class="font-medium text-amber-900">{{ evidence.evidence }}</h6>
                <p class="text-sm text-amber-800 mt-1">{{ evidence.why }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Resources -->
      <div v-if="comprehensiveNextSteps.resources?.free_help?.length > 0">
        <button
          @click="toggleSection('resources')"
          class="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
        >
          <div class="flex items-center">
            <Icon name="user" size="sm" color="slate-600" class="mr-2" />
            <span class="font-medium text-slate-700">Free Help Resources</span>
            <Badge 
              :text="`${comprehensiveNextSteps.resources.free_help.length} resources`"
              size="sm"
              class="ml-2"
            />
          </div>
          <Icon 
            :name="expandedSections.resources ? 'chevron-down' : 'chevron-right'" 
            size="sm" 
            color="slate-500"
            class="transition-transform duration-200"
            :class="{ 'rotate-180': expandedSections.resources }"
          />
        </button>
        
        <div v-if="expandedSections.resources" class="mt-3 space-y-2">
          <div
            v-for="(resource, index) in comprehensiveNextSteps.resources.free_help"
            :key="index"
            class="p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <div class="flex items-start">
              <Icon name="phone" size="sm" color="green-600" class="mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h6 class="font-medium text-green-900">{{ resource.resource }}</h6>
                <p class="text-sm text-green-800 mt-1">{{ resource.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from '../atoms/Badge.vue'
import Button from '../atoms/Button.vue'
import Icon from '../atoms/Icon.vue'

interface ComprehensiveNextSteps {
  summary?: string
  immediate_actions?: string[]
  appeal_options?: {
    overview?: string
    options?: Array<{
      option: string
      best_for: string
      deadline: string
      pros: string[]
      cons: string[]
    }>
  }
  evidence_gathering?: {
    priority_evidence?: Array<{
      evidence: string
      why: string
    }>
  }
  resources?: {
    free_help?: Array<{
      resource: string
      description: string
    }>
  }
}

interface Props {
  comprehensiveNextSteps?: ComprehensiveNextSteps | null
  sticky?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sticky: true
})

const expandedSections = ref({
  immediate: true,
  appeal: false,
  evidence: false,
  resources: false
})

const panelClasses = computed(() => {
  return props.sticky ? 'sticky top-6' : ''
})

const toggleSection = (section: keyof typeof expandedSections.value) => {
  expandedSections.value[section] = !expandedSections.value[section]
}

const getUrgencyVariant = (deadline: string) => {
  // Simple heuristic - could be more sophisticated
  if (deadline.toLowerCase().includes('immediate') || deadline.toLowerCase().includes('asap')) {
    return 'danger'
  }
  if (deadline.toLowerCase().includes('30') || deadline.toLowerCase().includes('month')) {
    return 'deferred'
  }
  return 'default'
}

const getUrgencyText = (deadline: string) => {
  if (deadline.toLowerCase().includes('immediate') || deadline.toLowerCase().includes('asap')) {
    return 'Urgent'
  }
  if (deadline.toLowerCase().includes('30') || deadline.toLowerCase().includes('month')) {
    return 'Soon'
  }
  return 'Plenty of time'
}

const printActionPlan = () => {
  window.print()
}
</script>
