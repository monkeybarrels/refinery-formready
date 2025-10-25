<template>
  <div class="bg-white rounded-2xl shadow-xl p-8">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <Icon name="exclamation" size="lg" color="slate-600" class="mr-3" />
        <h2 class="text-2xl font-bold text-slate-900">Denial Analysis</h2>
      </div>
      <Badge variant="denied" :text="`${denialReasons.length} Denied`" />
    </div>
    
    <div class="space-y-6">
      <div
        v-for="(denial, index) in denialReasons"
        :key="index"
        class="border border-slate-200 rounded-lg p-6"
      >
        <!-- Always Visible: Condition and Layman Explanation -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-slate-900 mb-3">
            {{ denial.condition }}
          </h3>
          
          <LaymanExplanation 
            :layman-reason="denial.laymanReason"
            :next-steps="denial.nextSteps"
          />
        </div>
        
        <!-- Progressive Disclosure: Technical Details -->
        <div class="space-y-4">
          <!-- Technical Reason (Expandable) -->
          <div v-if="denial.reason">
            <button
              @click="toggleTechnicalReason(index)"
              class="flex items-center justify-between w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              <div class="flex items-center">
                <Icon name="document" size="sm" color="slate-600" class="mr-2" />
                <span class="font-medium text-slate-700">Technical Denial Reason</span>
              </div>
              <Icon 
                :name="expandedTechnical[index] ? 'chevron-down' : 'chevron-right'" 
                size="sm" 
                color="slate-500"
                class="transition-transform duration-200"
                :class="{ 'rotate-180': expandedTechnical[index] }"
              />
            </button>
            
            <div v-if="expandedTechnical[index]" class="mt-3 p-4 bg-slate-50 rounded-lg">
              <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {{ denial.reason }}
              </p>
            </div>
          </div>
          
          <!-- MCP Analysis (Expandable) -->
          <div v-if="denial.mcpAnalysis">
            <button
              @click="toggleMcpAnalysis(index)"
              class="flex items-center justify-between w-full p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors duration-200"
            >
              <div class="flex items-center">
                <Icon name="shield-check" size="sm" color="indigo-600" class="mr-2" />
                <span class="font-medium text-indigo-700">VA Knowledge Analysis</span>
                <Badge 
                  v-if="denial.mcpAnalysis.denialCategory"
                  variant="primary"
                  :text="denial.mcpAnalysis.denialCategory"
                  size="sm"
                  class="ml-2"
                />
              </div>
              <Icon 
                :name="expandedMcp[index] ? 'chevron-down' : 'chevron-right'" 
                size="sm" 
                color="indigo-500"
                class="transition-transform duration-200"
                :class="{ 'rotate-180': expandedMcp[index] }"
              />
            </button>
            
            <div v-if="expandedMcp[index]" class="mt-3 space-y-4">
              <!-- Category Explanation -->
              <div v-if="denial.mcpAnalysis.categoryExplanation" class="p-4 bg-indigo-50 rounded-lg">
                <h5 class="font-medium text-indigo-900 mb-2">Why This Denial Happened</h5>
                <p class="text-sm text-indigo-800 leading-relaxed">
                  {{ denial.mcpAnalysis.categoryExplanation }}
                </p>
              </div>
              
              <!-- Evidence Needed -->
              <div v-if="denial.mcpAnalysis.evidenceNeeded?.length > 0" class="p-4 bg-amber-50 rounded-lg">
                <h5 class="font-medium text-amber-900 mb-3">Evidence You Need</h5>
                <div class="space-y-2">
                  <div
                    v-for="(evidence, evidenceIndex) in denial.mcpAnalysis.evidenceNeeded"
                    :key="evidenceIndex"
                    class="flex items-start"
                  >
                    <Icon name="star" size="sm" color="amber-600" class="mr-2 mt-0.5 flex-shrink-0" />
                    <span class="text-sm text-amber-800">{{ evidence }}</span>
                  </div>
                </div>
              </div>
              
              <!-- CFR Regulations -->
              <div v-if="denial.mcpAnalysis.relevantRegulations?.length > 0" class="space-y-3">
                <h5 class="font-medium text-slate-900">Relevant VA Regulations</h5>
                <RegulationSnippet
                  v-for="(regulation, regIndex) in denial.mcpAnalysis.relevantRegulations"
                  :key="regIndex"
                  :citation="regulation.citation"
                  :title="regulation.title"
                  :snippet="regulation.snippet"
                />
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
import Icon from '../atoms/Icon.vue'
import LaymanExplanation from '../molecules/LaymanExplanation.vue'
import RegulationSnippet from '../molecules/RegulationSnippet.vue'

interface DenialReason {
  condition: string
  reason?: string
  laymanReason?: string
  nextSteps?: string
  mcpAnalysis?: {
    denialCategory?: string
    categoryExplanation?: string
    evidenceNeeded?: string[]
    relevantRegulations?: Array<{
      citation: string
      title: string
      snippet: string
    }>
  }
}

interface Props {
  denialReasons: DenialReason[]
}

const props = defineProps<Props>()

const expandedTechnical = ref<boolean[]>([])
const expandedMcp = ref<boolean[]>([])

// Initialize expanded state arrays
watch(() => props.denialReasons.length, (newLength) => {
  expandedTechnical.value = new Array(newLength).fill(false)
  expandedMcp.value = new Array(newLength).fill(false)
}, { immediate: true })

const toggleTechnicalReason = (index: number) => {
  expandedTechnical.value[index] = !expandedTechnical.value[index]
}

const toggleMcpAnalysis = (index: number) => {
  expandedMcp.value[index] = !expandedMcp.value[index]
}
</script>
