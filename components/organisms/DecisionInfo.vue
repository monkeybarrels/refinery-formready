<template>
  <div class="space-y-6">
    <!-- Veteran Info -->
    <div v-if="extractionData.veteranInfo" class="bg-slate-50 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-slate-700 mb-2">Veteran Information</h3>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div v-if="extractionData.veteranInfo.firstName">
          <span class="text-slate-500">Name:</span>
          <span class="ml-2 text-slate-900">
            {{ extractionData.veteranInfo.firstName }}
            {{ extractionData.veteranInfo.lastName }}
          </span>
        </div>
        <div v-if="extractionData.veteranInfo.fileNumber">
          <span class="text-slate-500">File Number:</span>
          <span class="ml-2 text-slate-900">{{
            extractionData.veteranInfo.fileNumber
          }}</span>
        </div>
        <div v-if="extractionData.decisionDate" class="col-span-2">
          <span class="text-slate-500">Decision Date:</span>
          <span class="ml-2 text-slate-900">{{ extractionData.decisionDate }}</span>
        </div>
      </div>
    </div>

    <!-- Combined Rating & Payment -->
    <div
      v-if="extractionData.combinedRating || extractionData.monthlyPayment"
      class="grid grid-cols-2 gap-4"
    >
      <div
        v-if="extractionData.combinedRating"
        class="bg-blue-50 rounded-lg p-4 text-center"
      >
        <div class="text-sm text-blue-600 font-medium mb-1">Combined Rating</div>
        <div class="text-3xl font-bold text-blue-900">
          {{ extractionData.combinedRating }}%
        </div>
      </div>
      <div
        v-if="extractionData.monthlyPayment"
        class="bg-green-50 rounded-lg p-4 text-center"
      >
        <div class="text-sm text-green-600 font-medium mb-1">Monthly Payment</div>
        <div
          class="teFound decision date: {{ extractionData.decisionDate }}xt-3xl font-bold text-green-900"
        >
          ${{ extractionData.monthlyPayment.toLocaleString() }}
          <span class="text-slate-500">Decision Date:</span>
          <span class="ml-2 text-slate-900">{{ extractionData.decisionDate }}</span>
        </div>
      </div>
    </div>

    <!-- Ratings -->
    <div v-if="ratings.length > 0">
      <h3 class="text-lg font-semibold text-slate-900 mb-3">Conditions & Ratings</h3>
      <div class="space-y-2">
        <div
          v-for="(rating, index) in ratings"
          :key="index"
          class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="font-medium text-slate-900">{{ rating.condition }}</div>
              <div class="mt-1 flex items-center gap-4 text-sm">
                <span
                  :class="{
                    'text-green-600': rating.decision === 'granted',
                    'text-red-600': rating.decision === 'denied',
                    'text-amber-600': rating.decision === 'deferred',
                  }"
                  class="font-medium capitalize"
                >
                  {{ rating.decision }}
                </span>
                <span v-if="rating.ratingPercentage" class="text-slate-600">
                  {{ rating.ratingPercentage }}% rating
                </span>
                <span v-if="rating.effectiveDate" class="text-slate-500">
                  Effective: {{ formatDate(rating.effectiveDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Denial Reasons -->
    <div v-if="denialReasons.length > 0">
      <h3 class="text-lg font-semibold text-slate-900 mb-3">Denial Reasons</h3>
      <div class="space-y-3">
        <div
          v-for="(reason, index) in denialReasons"
          :key="index"
          class="bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div class="font-medium text-red-900 mb-1">{{ reason.condition }}</div>
          <div class="text-sm text-red-700">{{ reason.reason }}</div>
          <div v-if="reason.laymanReason" class="mt-2 pt-2 border-t border-red-200">
            <div class="text-xs font-medium text-red-600 mb-1">Simple Explanation:</div>
            <div class="text-sm text-red-800">{{ reason.laymanReason }}</div>
          </div>
          <div v-if="reason.nextSteps" class="mt-2 pt-2 border-t border-red-200">
            <div class="text-xs font-medium text-red-600 mb-1">Next Steps:</div>
            <div class="text-sm text-red-800">{{ reason.nextSteps }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deferred Reasons -->
    <div v-if="deferredReasons.length > 0">
      <h3 class="text-lg font-semibold text-slate-900 mb-3">Deferred Conditions</h3>
      <div class="space-y-3">
        <div
          v-for="(reason, index) in deferredReasons"
          :key="index"
          class="bg-amber-50 border border-amber-200 rounded-lg p-4"
        >
          <div class="font-medium text-amber-900 mb-1">{{ reason.condition }}</div>
          <div class="text-sm text-amber-700">{{ reason.reason }}</div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!hasData" class="text-center py-8 text-slate-500">
      <Icon
        name="heroicons:document-text"
        class="w-12 h-12 mx-auto mb-2 text-slate-300"
      />
      <p>No extraction data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ExtractionData {
  veteranInfo?: {
    firstName?: string;
    lastName?: string;
    fileNumber?: string;
  };
  combinedRating?: number;
  monthlyPayment?: number;
  decisionDate?: string;
  ratings?: Array<{
    condition: string;
    decision: "granted" | "denied" | "deferred";
    ratingPercentage?: number;
    effectiveDate?: string;
  }>;
  denialReasons?: Array<{
    condition: string;
    reason: string;
    laymanReason?: string;
    nextSteps?: string;
  }>;
  deferredReasons?: Array<{
    condition: string;
    reason: string;
  }>;
}

interface Props {
  extractionData: ExtractionData;
}

const props = defineProps<Props>();

const ratings = computed(() => props.extractionData.ratings || []);
const denialReasons = computed(() => props.extractionData.denialReasons || []);
const deferredReasons = computed(() => props.extractionData.deferredReasons || []);

const hasData = computed(() => {
  return (
    ratings.value.length > 0 ||
    denialReasons.value.length > 0 ||
    deferredReasons.value.length > 0 ||
    props.extractionData.combinedRating ||
    props.extractionData.monthlyPayment
  );
});

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};
</script>
