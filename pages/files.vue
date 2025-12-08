<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <!-- Navigation -->
    <Navigation />

    <!-- Premium Gate -->
    <PremiumFeature
      feature-name="File Management"
      description="Upload, analyze, and manage all your VA decision letters in one place."
    >
      <!-- Header -->
      <div class="bg-white border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <!-- Breadcrumbs -->
          <div class="mb-4">
            <Breadcrumb />
          </div>

          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-3xl font-bold text-slate-900 mb-2">Your Files</h1>
              <p class="text-lg text-slate-600">
                Upload, analyze, and manage your VA decision letters
              </p>
            </div>
            <div>
              <input
                ref="fileInput"
                type="file"
                class="hidden"
                @change="handleFileUpload"
              />
              <Button @click="() => fileInput?.click()" :disabled="uploading">
                <Icon name="heroicons:arrow-up-tray" class="w-5 h-5 mr-2" />
                {{ uploading ? "Uploading..." : "Upload File" }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Premium Features Banner -->
        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6"
        >
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-slate-900 mb-1 flex items-center">
                <Icon name="heroicons:star" class="w-5 h-5 text-yellow-500 mr-2" />
                Premium File Management
              </h3>
              <p class="text-sm text-slate-600">
                Upload, analyze, and manage your VA decision letters
              </p>
            </div>
          </div>
        </div>

        <!-- Files Table -->
        <div v-if="loadingFiles" class="py-12">
          <LoadingState
            variant="spinner"
            size="md"
            message="Loading files..."
            :full-height="false"
          />
        </div>
        <div v-else-if="files.length === 0" class="py-16">
          <EmptyState
            variant="empty"
            icon-name="heroicons:document-text"
            title="No files yet"
            description="Upload your first file to get started"
          />
        </div>
        <div v-else class="bg-white rounded-lg shadow-sm border border-slate-200">
          <div class="overflow-x-auto" style="overflow-y: visible">
            <table class="w-full">
              <thead class="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    File Name
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    class="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Upload Date
                  </th>
                  <th
                    class="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr
                  v-for="file in files"
                  :key="file.fileId"
                  class="hover:bg-slate-50 transition-colors"
                >
                  <!-- File Name & Icon -->
                  <td class="px-6 py-5 whitespace-nowrap">
                    <div class="flex items-center">
                      <div
                        class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center"
                      >
                        <Icon name="heroicons:document" class="w-5 h-5 text-blue-600" />
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-slate-900">
                          {{ file.displayName }}
                        </div>
                        <div class="text-xs text-slate-500">
                          {{ formatBytes(file.fileSize) }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- File Type -->
                  <td class="px-6 py-5 whitespace-nowrap">
                    <div class="text-sm text-slate-900">
                      {{ file.fileType || "Unknown" }}
                    </div>
                  </td>

                  <!-- Upload Date -->
                  <td class="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                    {{ formatDate(file.uploadedAt) }}
                  </td>

                  <!-- Actions Menu -->
                  <td class="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div class="relative inline-block text-left">
                      <button
                        :ref="(el) => setButtonRef(file.fileId, el)"
                        @click.stop="toggleFileMenu(file.fileId)"
                        type="button"
                        class="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                        title="Actions"
                      >
                        <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
                      </button>

                      <!-- Dropdown Menu - Portal to body to escape container overflow -->
                      <Teleport to="body">
                        <div
                          v-if="openFileMenuId === file.fileId"
                          class="fixed bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-[1000] w-48"
                          :style="getMenuStyle(file.fileId)"
                          @click.stop
                        >
                        <button
                            @click.stop="extractDecisionsFromFile(file.fileId)"
                            class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Icon name="heroicons:document-text" class="w-4 h-4 mr-3" />
                            Extract Decisions
                          </button>
                          <button
                            @click.stop="analyzeFile(file.fileId)"
                            class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Icon name="heroicons:sparkles" class="w-4 h-4 mr-3" />
                            Analyze
                          </button>
                          <button
                            @click.stop="generateActionPlan(file.fileId)"
                            class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Icon
                              name="heroicons:clipboard-document-list"
                              class="w-4 h-4 mr-3"
                            />
                            Action Plan
                          </button>
                          <button
                            @click.stop="openRenameModal(file)"
                            class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Icon name="heroicons:pencil" class="w-4 h-4 mr-3" />
                            Rename
                          </button>
                          <div class="border-t border-slate-200 my-1"></div>
                          <button
                            @click.stop="downloadFile(file.fileId)"
                            class="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Icon name="heroicons:arrow-down-tray" class="w-4 h-4 mr-3" />
                            Download
                          </button>
                          <button
                            @click.stop="deleteFile(file.fileId)"
                            class="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Icon name="heroicons:trash" class="w-4 h-4 mr-3" />
                            Delete
                          </button>
                        </div>
                      </Teleport>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PremiumFeature>

    <!-- Rename Modal -->
    <Modal
      :is-open="renameModal.isOpen"
      @update:is-open="renameModal.isOpen = $event"
      title="Rename File"
      description="Enter a new name for this file"
      :show-footer="true"
      :show-cancel="true"
      confirm-text="Save"
      cancel-text="Cancel"
      :loading="renameModal.loading"
      @confirm="handleRename"
      @cancel="closeRenameModal"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2"> File Name </label>
          <input
            v-model="renameModal.newFileName"
            type="text"
            class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter file name"
            @keyup.enter="handleRename"
            @keyup.esc="closeRenameModal"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from "~/components/atoms/Button.vue";
import Navigation from "~/components/organisms/Navigation.vue";
import PremiumFeature from "~/components/organisms/PremiumFeature.vue";
import EmptyState from "~/components/molecules/EmptyState.vue";
import LoadingState from "~/components/molecules/LoadingState.vue";
import Breadcrumb from "~/components/molecules/Breadcrumb.vue";
import Modal from "~/components/molecules/Modal.vue";

useHead({
  title: "Your Files - ClaimReady",
  meta: [
    {
      name: "description",
      content: "Upload, analyze, and manage your VA decision letters",
    },
  ],
});

// Protect this page with premium middleware
definePageMeta({
  middleware: "premium",
});

const toast = useToast();
const router = useRouter();

// File upload
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

// Files state
const files = ref<
  Array<{
    fileId: string;
    displayName: string;
    originalFileName: string;
    fileSize: number;
    fileType: string;
    uploadedAt: Date;
  }>
>([]);
const loadingFiles = ref(false);
const openFileMenuId = ref<string | null>(null);

// Rename modal state
const renameModal = ref({
  isOpen: false,
  loading: false,
  fileId: null as string | null,
  currentFileName: "",
  newFileName: "",
});

// Button refs for positioning menu
const buttonRefs = ref<Record<string, HTMLElement>>({});

const setButtonRef = (fileId: string, el: HTMLElement | null) => {
  if (el) {
    buttonRefs.value[fileId] = el;
  }
};

// Get menu position style for fixed positioning
const getMenuStyle = (fileId: string) => {
  if (typeof window === "undefined") return {};

  const button = buttonRefs.value[fileId];
  if (!button) return { display: "none" };

  const rect = button.getBoundingClientRect();
  return {
    top: `${rect.bottom + 8}px`,
    right: `${window.innerWidth - rect.right}px`,
  };
};

// Toggle file action menu
const toggleFileMenu = (fileId: string) => {
  openFileMenuId.value = openFileMenuId.value === fileId ? null : fileId;
};

// Close file menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (openFileMenuId.value) {
    const target = event.target as HTMLElement;
    // Check if click is on the button or inside the menu
    const isButton = Object.values(buttonRefs.value).some((btn) => btn.contains(target));
    const isMenu = target.closest(".fixed.bg-white.rounded-lg");
    if (!isButton && !isMenu) {
      openFileMenuId.value = null;
    }
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  loadFiles();
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Handle file upload
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploading.value = true;
  try {
    const { apiCall } = useApi();
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiCall("/api/file-storage/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      toast.success("File uploaded successfully");
      // Reset input
      if (fileInput.value) {
        fileInput.value.value = "";
      }
      // Reload files
      await loadFiles();
    } else {
      throw new Error("Upload failed");
    }
  } catch (error: any) {
    toast.error("Upload failed", error.message || "Please try again");
  } finally {
    uploading.value = false;
  }
};

// Load files
const loadFiles = async () => {
  loadingFiles.value = true;
  try {
    const { apiCall } = useApi();
    const response = await apiCall("/api/file-storage");
    if (response.ok) {
      files.value = await response.json();
    } else {
      throw new Error("Failed to load files");
    }
  } catch (error: any) {
    console.error("Failed to load files:", error);
    toast.error("Failed to load files", error.message);
    files.value = [];
  } finally {
    loadingFiles.value = false;
  }
};

// Analyze file
const analyzeFile = async (fileId: string) => {
  openFileMenuId.value = null;

  try {
    const { apiCall } = useApi();
    toast.info("Starting analysis...", "This may take a few moments");

    const response = await apiCall("/api/analyze/async", {
      method: "POST",
      body: JSON.stringify({ fileId }),
    });

    if (response.ok) {
      const result = await response.json();
      toast.success(
        "Analysis started",
        "Your document is being analyzed. You will be notified when complete."
      );
      // Navigate to analysis page to see progress
      router.push(`/analysis/${fileId}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to start analysis");
    }
  } catch (error: any) {
    console.error("Failed to analyze file:", error);
    toast.error("Analysis failed", error.message || "Please try again");
  }
};

// Generate action plan
const generateActionPlan = async (fileId: string) => {
  openFileMenuId.value = null;

  try {
    const { apiCall } = useApi();
    toast.info("Generating action plan...", "This may take a moment");

    // GET endpoint automatically generates if action items don't exist
    const response = await apiCall(`/api/action-items/${fileId}`);

    if (response.ok) {
      const result = await response.json();
      toast.success("Action plan generated", "Your personalized action plan is ready!");
      // Navigate to analysis page to see action items
      router.push(`/analysis/${fileId}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to generate action plan");
    }
  } catch (error: any) {
    console.error("Failed to generate action plan:", error);
    toast.error("Action plan generation failed", error.message || "Please try again");
  }
};

// Get file and download
const downloadFile = async (fileId: string) => {
  openFileMenuId.value = null;

  try {
    const { apiCall } = useApi();
    const response = await apiCall(`/api/file-storage/${fileId}`);
    if (response.ok) {
      const file = await response.json();
      window.open(file.downloadUrl, "_blank");
    } else {
      throw new Error("Failed to get file");
    }
  } catch (error: any) {
    console.error("Failed to download file:", error);
    toast.error("Failed to download file", error.message);
  }
};

// Open rename modal
const openRenameModal = (file: { fileId: string; displayName: string }) => {
  openFileMenuId.value = null;
  renameModal.value.isOpen = true;
  renameModal.value.fileId = file.fileId;
  renameModal.value.currentFileName = file.displayName;
  renameModal.value.newFileName = file.displayName;
};

// Close rename modal
const closeRenameModal = () => {
  renameModal.value.isOpen = false;
  renameModal.value.fileId = null;
  renameModal.value.currentFileName = "";
  renameModal.value.newFileName = "";
};

// Rename file
const handleRename = async () => {
  if (!renameModal.value.fileId || !renameModal.value.newFileName.trim()) {
    toast.error("Invalid file name", "Please enter a valid file name");
    return;
  }

  if (renameModal.value.newFileName.trim() === renameModal.value.currentFileName) {
    closeRenameModal();
    return;
  }

  renameModal.value.loading = true;
  try {
    const { apiCall } = useApi();
    const response = await apiCall(
      `/api/file-storage/${renameModal.value.fileId}/rename`,
      {
        method: "PUT",
        body: JSON.stringify({ displayName: renameModal.value.newFileName.trim() }),
      }
    );

    if (response.ok) {
      toast.success("File renamed successfully");
      await loadFiles();
      closeRenameModal();
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to rename file");
    }
  } catch (error: any) {
    console.error("Failed to rename file:", error);
    toast.error("Failed to rename file", error.message);
  } finally {
    renameModal.value.loading = false;
  }
};

// Delete file
const deleteFile = async (fileId: string) => {
  openFileMenuId.value = null;
  if (!confirm("Are you sure you want to delete this file?")) return;

  try {
    const { apiCall } = useApi();
    const response = await apiCall(`/api/file-storage/${fileId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      toast.success("File deleted successfully");
      await loadFiles();
    } else {
      throw new Error("Failed to delete file");
    }
  } catch (error: any) {
    console.error("Failed to delete file:", error);
    toast.error("Failed to delete file", error.message);
  }
};

const extractDecisionsFromFile = async (fileId: string) => {
  openFileMenuId.value = null;

  try {
    const { apiCall } = useApi();
    const { openModal } = useModal();
    const { default: DecisionInfo } = await import('~/components/organisms/DecisionInfo.vue');
    
    toast.info("Extracting decisions...", "Please wait");
    
    const response = await apiCall("/api/extraction/extract", {
      method: "POST",
      body: JSON.stringify({ fileId }),
    });
    
    if (response.ok) {
      const extractionData = await response.json();
      toast.success("Decisions extracted successfully");
      
      // Open modal with DecisionInfo component
      openModal({
        component: DecisionInfo,
        props: { extractionData },
        title: "Extracted Decision Information",
        size: "2xl",
      });
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to extract decisions");
    }
  } catch (error: any) {
    console.error("Failed to extract decisions from file:", error);
    toast.error("Failed to extract decisions from file", error.message);
  }
};

// Format helpers
const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const formatDate = (dateString: string | Date) => {
  if (!dateString) return "Unknown";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return date.toLocaleDateString();
};
</script>
