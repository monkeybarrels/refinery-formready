<template>
  <div class="min-h-screen bg-slate-900 text-white p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-2">Async Analyze Pipeline Test</h1>
      <p class="text-slate-400 mb-8">Test page for async document analysis with real-time Firebase RTDB status updates</p>

      <!-- Connection Status -->
      <div class="mb-6 p-4 rounded-lg" :class="notificationConnected ? 'bg-green-900/30 border border-green-600' : 'bg-red-900/30 border border-red-600'">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="notificationConnected ? 'bg-green-500' : 'bg-red-500'"></div>
          <span class="font-medium">{{ notificationConnected ? 'Connected to notifications' : 'Not connected to notifications' }}</span>
        </div>
        <p class="text-sm text-slate-400 mt-1">Provider: {{ notificationProvider }}</p>
      </div>

      <!-- File Upload Section -->
      <div class="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">1. Upload Document</h2>

        <div v-if="!fileId" class="space-y-4">
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            @change="handleFileChange"
            class="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
          <p v-if="selectedFile" class="text-sm text-slate-400">
            Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
          </p>
          <button
            @click="uploadFile"
            :disabled="!selectedFile || uploading"
            class="px-6 py-2 bg-blue-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {{ uploading ? 'Uploading...' : 'Upload to Storage' }}
          </button>
        </div>

        <div v-else class="p-4 bg-green-900/30 rounded-lg border border-green-600">
          <p class="font-medium">File uploaded successfully!</p>
          <p class="text-sm text-slate-400 mt-1">File ID: <code class="bg-slate-700 px-2 py-1 rounded">{{ fileId }}</code></p>
        </div>
      </div>

      <!-- Analyze Section -->
      <div class="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">2. Queue Analysis Job</h2>

        <div v-if="!jobId" class="space-y-4">
          <button
            @click="startAsyncAnalysis"
            :disabled="!fileId || analyzing"
            class="px-6 py-2 bg-purple-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700"
          >
            {{ analyzing ? 'Queueing...' : 'Start Async Analysis' }}
          </button>
          <p class="text-sm text-slate-400">
            This will call <code class="bg-slate-700 px-2 py-1 rounded">POST /api/analyze/async</code> and return immediately with a jobId
          </p>
        </div>

        <div v-else class="p-4 bg-purple-900/30 rounded-lg border border-purple-600">
          <p class="font-medium">Job queued!</p>
          <p class="text-sm text-slate-400 mt-1">Job ID: <code class="bg-slate-700 px-2 py-1 rounded">{{ jobId }}</code></p>
        </div>
      </div>

      <!-- Real-time Status Section -->
      <div class="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">3. Real-time Status Updates</h2>

        <div v-if="statusUpdates.length === 0" class="text-slate-400">
          <p>Waiting for status updates via Firebase RTDB...</p>
          <p class="text-sm mt-2">Updates will appear here as the job progresses through: queued → processing → extracting → analyzing → complete</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(update, index) in statusUpdates"
            :key="index"
            class="p-4 rounded-lg border"
            :class="getStatusClass(update.status)"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="text-2xl">{{ getStatusIcon(update.status) }}</div>
                <div>
                  <p class="font-semibold capitalize">{{ update.status }}</p>
                  <p class="text-sm opacity-75">{{ formatTime(update.timestamp) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-2xl font-bold">{{ update.progress }}%</p>
                <div class="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-current transition-all duration-500"
                    :style="{ width: `${update.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Show result data if complete -->
            <div v-if="update.status === 'complete' && update.sessionId" class="mt-3 pt-3 border-t border-slate-600">
              <p class="text-sm">Session ID: <code class="bg-slate-700 px-2 py-1 rounded">{{ update.sessionId }}</code></p>
              <a
                :href="`/results/${update.sessionId}`"
                class="inline-block mt-2 px-4 py-2 bg-green-600 rounded-lg text-sm font-medium hover:bg-green-700"
              >
                View Results →
              </a>
            </div>

            <!-- Show error if failed -->
            <div v-if="update.status === 'failed' && update.error" class="mt-3 pt-3 border-t border-red-600">
              <p class="text-sm text-red-300">Error: {{ update.error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Polling Fallback Section -->
      <div class="bg-slate-800 rounded-xl p-6 mb-6">
        <h2 class="text-xl font-semibold mb-4">4. Polling Fallback</h2>
        <p class="text-sm text-slate-400 mb-4">If Firebase RTDB is not available, you can poll for status:</p>

        <div class="flex gap-4">
          <button
            @click="pollJobStatus"
            :disabled="!jobId || polling"
            class="px-4 py-2 bg-slate-600 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-500"
          >
            {{ polling ? 'Polling...' : 'Poll Status' }}
          </button>
          <button
            @click="toggleAutoPoll"
            :disabled="!jobId"
            class="px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            :class="autoPoll ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-slate-600 hover:bg-slate-500'"
          >
            {{ autoPoll ? 'Stop Auto-Poll' : 'Start Auto-Poll (2s)' }}
          </button>
        </div>

        <div v-if="pollResult" class="mt-4 p-4 bg-slate-700 rounded-lg">
          <pre class="text-sm overflow-auto">{{ JSON.stringify(pollResult, null, 2) }}</pre>
        </div>
      </div>

      <!-- Debug Log -->
      <div class="bg-slate-800 rounded-xl p-6">
        <h2 class="text-xl font-semibold mb-4">Debug Log</h2>
        <div class="bg-slate-900 rounded-lg p-4 h-64 overflow-auto font-mono text-sm">
          <div v-for="(log, index) in debugLogs" :key="index" class="mb-1">
            <span class="text-slate-500">{{ log.time }}</span>
            <span :class="log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : 'text-slate-300'">
              {{ log.message }}
            </span>
          </div>
        </div>
        <button
          @click="clearLogs"
          class="mt-2 px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600"
        >
          Clear Logs
        </button>
      </div>

      <!-- Reset Button -->
      <div class="mt-6 text-center">
        <button
          @click="resetAll"
          class="px-6 py-2 bg-red-600/50 rounded-lg font-medium hover:bg-red-600"
        >
          Reset All
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getDatabase, ref as dbRef, onValue, off, type Database } from 'firebase/database'
import { getAuth, signInWithCustomToken, onAuthStateChanged, type Auth } from 'firebase/auth'

const config = useRuntimeConfig()
const apiUrl = config.public.apiUrl || 'http://localhost:3001'
const notificationProvider = config.public.notificationProvider || 'auto'

// State
const selectedFile = ref<File | null>(null)
const uploading = ref(false)
const fileId = ref<string | null>(null)
const jobId = ref<string | null>(null)
const analyzing = ref(false)
const statusUpdates = ref<any[]>([])
const polling = ref(false)
const autoPoll = ref(false)
const pollResult = ref<any>(null)
const debugLogs = ref<{ time: string; message: string; type: string }[]>([])
let autoPollInterval: NodeJS.Timeout | null = null

// Direct Firebase connection
const notificationConnected = ref(false)
const firebaseAuthReady = ref(false)
let firebaseApp: FirebaseApp | null = null
let firebaseDb: Database | null = null
let firebaseAuth: Auth | null = null
let unsubscribeListener: (() => void) | null = null

// Debug logger
const log = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
  const time = new Date().toLocaleTimeString()
  debugLogs.value.push({ time, message: ` ${message}`, type })
  console.log(`[${time}] ${message}`)
}

const clearLogs = () => {
  debugLogs.value = []
}

// File handling
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    selectedFile.value = input.files[0]
    log(`File selected: ${selectedFile.value.name}`)
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// Upload file to storage (authenticated endpoint)
const uploadFile = async () => {
  if (!selectedFile.value) return

  uploading.value = true
  log('Getting presigned URL (authenticated)...')

  try {
    // Get auth token if available
    const token = localStorage.getItem('auth_token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    // Get presigned URL (authenticated endpoint - returns fileId UUID)
    const presignedResponse = await fetch(`${apiUrl}/api/storage/upload/presigned`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        fileName: selectedFile.value.name,
        contentType: selectedFile.value.type,
        path: 'documents'
      })
    })

    if (!presignedResponse.ok) {
      const errData = await presignedResponse.json().catch(() => ({}))
      throw new Error(errData.message || `Presigned URL failed: ${presignedResponse.status}`)
    }

    const { uploadUrl, fileId: newFileId } = await presignedResponse.json()
    log(`Got presigned URL, fileId: ${newFileId}`, 'success')

    // Upload to storage (GCS)
    log('Uploading to GCS...')
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      body: selectedFile.value,
      headers: { 'Content-Type': selectedFile.value.type }
    })

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.status}`)
    }

    fileId.value = newFileId
    log(`File uploaded successfully! fileId: ${newFileId}`, 'success')
  } catch (error: any) {
    log(`Upload error: ${error.message}`, 'error')
  } finally {
    uploading.value = false
  }
}

// Start async analysis
const startAsyncAnalysis = async () => {
  if (!fileId.value) return

  analyzing.value = true
  log(`Starting async analysis for fileId: ${fileId.value}`)

  try {
    // Get auth token - REQUIRED for /api/analyze/async
    const token = localStorage.getItem('auth_token')
    if (!token) {
      throw new Error('Authentication required - please log in first')
    }

    const response = await fetch(`${apiUrl}/api/analyze/async`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        fileId: fileId.value
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Analysis failed: ${response.status}`)
    }

    const result = await response.json()
    jobId.value = result.jobId
    log(`Job queued! jobId: ${result.jobId}, status: ${result.status}, userId: ${result.userId}`, 'success')

    // Add initial queued status
    statusUpdates.value.push({
      status: 'queued',
      progress: 0,
      timestamp: new Date().toISOString(),
      jobId: result.jobId
    })

    // Start watching for RTDB updates at /jobs/{userId}/{jobId}
    // Use userId from API response (Firebase Auth UID) not localStorage (MongoDB ID)
    watchJobStatus(result.jobId, result.userId)
  } catch (error: any) {
    log(`Analysis error: ${error.message}`, 'error')
  } finally {
    analyzing.value = false
  }
}

// Poll for job status
const pollJobStatus = async () => {
  if (!jobId.value) return

  polling.value = true
  log(`Polling status for job: ${jobId.value}`)

  try {
    const response = await fetch(`${apiUrl}/api/analyze/job/${jobId.value}`)

    if (!response.ok) {
      throw new Error(`Poll failed: ${response.status}`)
    }

    pollResult.value = await response.json()
    log(`Poll result: status=${pollResult.value.status}, progress=${pollResult.value.progress}%`, 'success')

    // Stop auto-poll if job is complete or failed
    if (pollResult.value.status === 'completed' || pollResult.value.status === 'failed') {
      if (autoPoll.value) {
        toggleAutoPoll()
        log('Auto-poll stopped - job finished')
      }
    }
  } catch (error: any) {
    log(`Poll error: ${error.message}`, 'error')
  } finally {
    polling.value = false
  }
}

// Toggle auto-polling
const toggleAutoPoll = () => {
  autoPoll.value = !autoPoll.value

  if (autoPoll.value) {
    log('Auto-poll started (every 2s)')
    autoPollInterval = setInterval(pollJobStatus, 2000)
    pollJobStatus() // Immediate first poll
  } else {
    log('Auto-poll stopped')
    if (autoPollInterval) {
      clearInterval(autoPollInterval)
      autoPollInterval = null
    }
  }
}

// Status display helpers
const getStatusClass = (status: string) => {
  switch (status) {
    case 'queued': return 'bg-slate-700/50 border-slate-600 text-slate-300'
    case 'processing': return 'bg-blue-900/30 border-blue-600 text-blue-300'
    case 'extracting': return 'bg-yellow-900/30 border-yellow-600 text-yellow-300'
    case 'analyzing': return 'bg-purple-900/30 border-purple-600 text-purple-300'
    case 'complete': return 'bg-green-900/30 border-green-600 text-green-300'
    case 'failed': return 'bg-red-900/30 border-red-600 text-red-300'
    default: return 'bg-slate-700/50 border-slate-600 text-slate-300'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'queued': return '⏳'
    case 'processing': return '⚙️'
    case 'extracting': return '📄'
    case 'analyzing': return '🔍'
    case 'complete': return '✅'
    case 'failed': return '❌'
    default: return '❓'
  }
}

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString()
}

// Reset all state
const resetAll = () => {
  selectedFile.value = null
  fileId.value = null
  jobId.value = null
  statusUpdates.value = []
  pollResult.value = null

  if (autoPoll.value) {
    toggleAutoPoll()
  }

  log('All state reset')
}

// Helper to get user ID from localStorage
const getUserId = (): string | null => {
  try {
    const userData = localStorage.getItem('user_data')
    if (userData) {
      const parsed = JSON.parse(userData)
      return parsed.id || parsed.sub || null
    }
  } catch (e) {
    console.warn('Failed to parse user data:', e)
  }
  return null
}

// Initialize Firebase and listen for notifications
const initFirebaseListener = async () => {
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    databaseURL: config.public.firebaseDatabaseUrl,
  }

  log(`Firebase config: projectId=${firebaseConfig.projectId}, databaseURL=${firebaseConfig.databaseURL}`, 'info')

  // Check if Firebase is configured
  if (!firebaseConfig.projectId || !firebaseConfig.databaseURL) {
    log('Firebase not configured - using polling only', 'info')
    return false
  }

  try {
    // Reuse existing app or create new one
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig)
      log('Firebase app initialized', 'success')
    } else {
      firebaseApp = getApps()[0]
      log('Firebase app reused', 'success')
    }

    firebaseDb = getDatabase(firebaseApp)
    firebaseAuth = getAuth(firebaseApp)

    // Listen for auth state changes
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        firebaseAuthReady.value = true
        notificationConnected.value = true
        log(`Firebase Auth: Signed in as ${user.uid}`, 'success')
      } else {
        firebaseAuthReady.value = false
        log('Firebase Auth: Not signed in - RTDB reads may fail due to security rules', 'info')
        // Still mark as connected since we'll try to read anyway
        notificationConnected.value = true
      }
    })

    log('Firebase ready - will watch /jobs/{userId}/{jobId} when job starts', 'success')
    return true
  } catch (error: any) {
    log(`Firebase init error: ${error.message}`, 'error')
    return false
  }
}

// Watch a specific job's status at /jobs/{userId}/{jobId}
const watchJobStatus = (targetJobId: string, userId?: string) => {
  if (!firebaseDb) {
    log('Firebase not available for job watching', 'error')
    return
  }

  // Use provided userId (from API response) or fall back to localStorage
  const effectiveUserId = userId || getUserId()
  if (!effectiveUserId) {
    log('No user ID available - cannot watch job status. Make sure you are logged in.', 'error')
    return
  }

  const jobPath = `jobs/${effectiveUserId}/${targetJobId}`
  const jobRef = dbRef(firebaseDb, jobPath)

  log(`Watching RTDB path: /${jobPath}`, 'info')
  log(`User ID (Firebase Auth UID): ${effectiveUserId}`, 'info')

  // Use onValue to watch for changes on this specific job
  onValue(jobRef, (snapshot) => {
    const status = snapshot.val()
    log(`RTDB snapshot received - exists: ${snapshot.exists()}, val: ${JSON.stringify(status)?.substring(0, 100)}`, 'info')
    if (status) {
      log(`RTDB job update: ${status.status} (${status.progress}%)`, 'success')

      // Check if this status is already in our list (by timestamp to avoid duplicates)
      const exists = statusUpdates.value.some(
        u => u.status === status.status && u.timestamp === status.timestamp
      )

      if (!exists) {
        statusUpdates.value.push({
          status: status.status,
          progress: status.progress,
          timestamp: status.timestamp,
          jobId: status.jobId,
          sessionId: status.sessionId,
          documentId: status.documentId,
          error: status.error,
          results: status.results
        })
      }
    }
  }, (error) => {
    log(`Error watching job: ${error.message}`, 'error')
  })

  unsubscribeListener = () => off(jobRef)
}

// Set up notification listener on mount
onMounted(() => {
  log('Test page mounted')
  log(`API URL: ${apiUrl}`)
  log(`Notification provider: ${notificationProvider}`)

  // Initialize Firebase for real-time updates
  const firebaseReady = initFirebaseListener()
  if (!firebaseReady) {
    log('Firebase not available - use polling for status updates', 'info')
  }
})

// Cleanup on unmount
onUnmounted(() => {
  if (unsubscribeListener) {
    unsubscribeListener()
  }
  if (autoPollInterval) {
    clearInterval(autoPollInterval)
  }
})

// Page meta
useHead({
  title: 'Test Async Analyze - Dev Only'
})
</script>
