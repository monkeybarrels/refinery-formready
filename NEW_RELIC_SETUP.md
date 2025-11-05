# New Relic Browser Monitoring Setup Guide - FormReady Frontend

This document provides instructions for setting up and using New Relic Browser Monitoring (Real User Monitoring - RUM) with the FormReady Nuxt.js frontend application.

## Overview

New Relic Browser provides real-time monitoring of frontend performance, user interactions, JavaScript errors, and AJAX requests. It helps identify performance bottlenecks, track user experience metrics, and understand how users interact with the application.

## Features Enabled

- **Page Load Performance**: Track initial page load, DOM processing, and rendering times
- **Route Change Performance**: Monitor SPA route transitions in Nuxt
- **AJAX/Fetch Monitoring**: Track API calls to refinery-api backend
- **JavaScript Error Tracking**: Automatic capture of frontend errors with stack traces
- **User Session Analytics**: Track user journeys and session attributes
- **Core Web Vitals**: Monitor LCP, FID, CLS for SEO and UX optimization
- **Custom Events**: Track business-specific user actions
- **Distributed Tracing**: Correlate frontend requests with backend traces

## Configuration

### Prerequisites

Before you begin, you need to:

1. **Create a Browser Application in New Relic**:
   - Log in to New Relic: https://one.newrelic.com/
   - Navigate to: **Browser** → **+ Add more**
   - Select **Pro + SPA** (for Single Page Application support)
   - Name your app: "FormReady" or "FormReady (Production)"
   - Choose **Copy/Paste JavaScript code** deployment method

2. **Extract Configuration from Browser Snippet**:

   New Relic will provide a JavaScript snippet that looks like this:

   ```html
   <script type="text/javascript">
   window.NREUM||(NREUM={});NREUM.info={
     "beacon":"bam.nr-data.net",
     "errorBeacon":"bam.nr-data.net",
     "licenseKey":"YOUR_LICENSE_KEY_HERE",
     "applicationID":"YOUR_APP_ID_HERE",
     "sa":1,
     "agent":"https://js-agent.newrelic.com/nr-spa-1.xxx.min.js"
   };
   </script>
   ```

   Extract the following values from this snippet:
   - `licenseKey` → `NEW_RELIC_BROWSER_LICENSE_KEY`
   - `applicationID` → `NEW_RELIC_BROWSER_APPLICATION_ID`
   - Account ID (from URL or account dropdown) → `NEW_RELIC_BROWSER_ACCOUNT_ID`
   - Trust key (if using distributed tracing) → `NEW_RELIC_BROWSER_TRUST_KEY`
   - Agent ID (from the agent URL, e.g., "1.xxx") → `NEW_RELIC_BROWSER_AGENT_ID`

### Environment Variables

Add the following environment variables to enable New Relic Browser monitoring:

```bash
# New Relic Browser Monitoring
NEW_RELIC_ENABLED=true

# Browser Agent Configuration (get these from New Relic UI)
NEW_RELIC_BROWSER_LICENSE_KEY=your_browser_license_key
NEW_RELIC_BROWSER_APPLICATION_ID=your_app_id
NEW_RELIC_BROWSER_ACCOUNT_ID=your_account_id
NEW_RELIC_BROWSER_TRUST_KEY=your_trust_key
NEW_RELIC_BROWSER_AGENT_ID=1.latest

# Optional: Custom beacon endpoints (use defaults if unsure)
NEW_RELIC_BROWSER_BEACON=bam.nr-data.net
NEW_RELIC_BROWSER_ERROR_BEACON=bam.nr-data.net
```

### Environment-Specific Configuration

**Development:**
```bash
NEW_RELIC_ENABLED=false  # Disabled in development to reduce overhead
```

**Staging:**
```bash
NEW_RELIC_ENABLED=true
# Create a separate Browser app in New Relic for staging
NEW_RELIC_BROWSER_APPLICATION_ID=staging_app_id
# Use the same license key and account ID
```

**Production:**
```bash
NEW_RELIC_ENABLED=true
NEW_RELIC_BROWSER_APPLICATION_ID=production_app_id
```

## Getting Browser Configuration

### Step-by-Step Guide

1. **Log in to New Relic**: https://one.newrelic.com/
2. **Create Browser Application**:
   - Click **Browser** in the left sidebar
   - Click **+ Add more** button
   - Select **Pro + SPA** (important for Nuxt.js support)
   - Name: "FormReady (Production)"
   - Deployment: **Copy/Paste JavaScript code**
   - Click **Enable**

3. **Copy Configuration Values**:
   - You'll see a JavaScript snippet
   - Extract the values as described in the Prerequisites section

4. **Enable Distributed Tracing** (Optional but Recommended):
   - In your Browser app settings
   - Navigate to **Application settings** → **Distributed tracing**
   - Enable **Distributed tracing**
   - Copy the **Trust key**

5. **Add to Environment Variables**:
   - Add all extracted values to your `.env` file
   - Deploy to Railway with these variables

## Railway Deployment

To enable New Relic Browser monitoring in Railway:

1. Go to your Railway project
2. Select your FormReady frontend service
3. Navigate to **Variables**
4. Add the New Relic environment variables:
   ```
   NEW_RELIC_ENABLED=true
   NEW_RELIC_BROWSER_LICENSE_KEY=<your_browser_license_key>
   NEW_RELIC_BROWSER_APPLICATION_ID=<your_app_id>
   NEW_RELIC_BROWSER_ACCOUNT_ID=<your_account_id>
   NEW_RELIC_BROWSER_TRUST_KEY=<your_trust_key>
   NEW_RELIC_BROWSER_AGENT_ID=1.latest
   ```
5. Redeploy your service

## Viewing Monitoring Data

Once deployed with New Relic enabled, you can view monitoring data at:

1. **Browser Applications**: https://one.newrelic.com/nr1-core
2. Click **Browser** in the left sidebar
3. Select your application (e.g., "FormReady (Production)")
4. View dashboards for:
   - **Summary**: Overall app performance and user metrics
   - **Page views**: Most popular pages and load times
   - **AJAX**: API call performance and failures
   - **JS errors**: Frontend error rates and stack traces
   - **Session traces**: Individual user session recordings
   - **Distributed tracing**: End-to-end request flow (frontend → API → processor)

## Custom Instrumentation

### Recording Custom Page Actions

Track user interactions and business events:

```typescript
// In any Vue component or composable
export default {
  methods: {
    trackDocumentUpload() {
      if (window.newrelic) {
        window.newrelic.addPageAction('documentUploaded', {
          fileName: this.fileName,
          fileSize: this.fileSize,
          documentType: 'va-decision-letter',
        });
      }
    }
  }
}
```

### Adding Custom Attributes

Add context to all page views:

```typescript
// In a Nuxt plugin or middleware
if (window.newrelic) {
  window.newrelic.setCustomAttribute('userId', user.id);
  window.newrelic.setCustomAttribute('userTier', user.tier);
  window.newrelic.setCustomAttribute('authenticated', true);
}
```

### Tracking Errors

Manually report errors with custom context:

```typescript
try {
  await analyzeDocument(file);
} catch (error) {
  // New Relic automatically captures this, but you can add custom attributes
  if (window.newrelic) {
    window.newrelic.noticeError(error, {
      documentId: file.id,
      analysisType: 'va-decision-letter',
      attemptNumber: retryCount,
    });
  }
  throw error;
}
```

### Tracking SPA Route Changes

Nuxt.js route changes are automatically tracked, but you can add custom names:

```typescript
// In a middleware or router guard
export default defineNuxtRouteMiddleware((to, from) => {
  if (window.newrelic) {
    window.newrelic.setCurrentRouteName(to.name || to.path);
  }
});
```

### Creating Custom Interactions

Track specific user flows:

```typescript
// Start tracking a multi-step interaction
const interaction = window.newrelic?.interaction();

// Add breadcrumbs as user progresses
interaction?.actionText('Step 1: Upload Document');
interaction?.setAttribute('documentType', 'va-decision-letter');

// ... user completes steps ...

interaction?.actionText('Step 2: Analyze Document');

// Save the interaction
interaction?.save();
```

## Nuxt.js-Specific Integration

### Auto-Tracked Features

The New Relic Browser agent automatically tracks:

- **Initial page load**: Server-side rendered page performance
- **SPA route changes**: Client-side navigation in Nuxt
- **Fetch/AJAX calls**: API calls using `useFetch`, `$fetch`, or `axios`
- **Vue component errors**: Uncaught exceptions in components
- **Dynamic imports**: Lazy-loaded component performance

### Composable for New Relic

Create a reusable composable for New Relic tracking:

```typescript
// composables/useNewRelic.ts
export const useNewRelic = () => {
  const trackPageAction = (name: string, attributes?: Record<string, any>) => {
    if (window.newrelic) {
      window.newrelic.addPageAction(name, attributes);
    }
  };

  const trackError = (error: Error, attributes?: Record<string, any>) => {
    if (window.newrelic) {
      window.newrelic.noticeError(error, attributes);
    }
  };

  const setUserContext = (userId: string, attributes?: Record<string, any>) => {
    if (window.newrelic) {
      window.newrelic.setCustomAttribute('userId', userId);
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          window.newrelic.setCustomAttribute(key, value);
        });
      }
    }
  };

  return {
    trackPageAction,
    trackError,
    setUserContext,
  };
};
```

Usage in components:

```vue
<script setup>
const { trackPageAction, trackError } = useNewRelic();

const uploadDocument = async (file: File) => {
  try {
    const result = await $fetch('/api/upload', {
      method: 'POST',
      body: file,
    });

    trackPageAction('documentUploaded', {
      fileName: file.name,
      fileSize: file.size,
      success: true,
    });

  } catch (error) {
    trackError(error, {
      fileName: file.name,
      operation: 'document-upload',
    });
  }
};
</script>
```

## Distributed Tracing

When both the frontend (FormReady) and backend (refinery-api) have New Relic enabled, you can trace requests end-to-end:

### Frontend → API → Processor Trace Example

```
User Action: Upload & Analyze Document (5.2s total)
├─> Browser: Upload button clicked
├─> AJAX: POST /api/analyze/anonymous (4.8s)
│   └─> API: POST /api/analyze/anonymous (4.7s)
│       └─> Processor: POST /extract (4.5s)
│           ├─> S3: Download PDF (0.5s)
│           ├─> PyMuPDF: Extract text (0.3s)
│           ├─> Groq: LLM analysis (3.2s)
│           └─> MongoDB: Save results (0.5s)
└─> Browser: Render results (0.4s)
```

### Enabling Distributed Tracing

Ensure these are set in both frontend and backend:

**Frontend (.env):**
```bash
NEW_RELIC_BROWSER_TRUST_KEY=your_trust_key
```

**Backend (refinery-api .env):**
```bash
NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=your_apm_license_key
```

**Backend (refinery-python .env):**
```bash
NEW_RELIC_ENABLED=true
NEW_RELIC_LICENSE_KEY=your_apm_license_key
```

## Performance Best Practices

1. **Enable in Production/Staging Only**: Disable in development to reduce overhead
2. **Use SPA Mode**: Ensure you selected "Pro + SPA" for Nuxt.js support
3. **Set Appropriate Sampling**: Configure session sampling in New Relic UI (default: 10%)
4. **Monitor Core Web Vitals**: Track LCP, FID, CLS for SEO optimization
5. **Track Key User Flows**: Use custom page actions for critical paths (upload, analyze, export)
6. **Filter Noise**: Exclude expected errors (404s, auth failures) in New Relic settings
7. **Use Custom Attributes Sparingly**: Avoid sending PII or excessive attributes

## Troubleshooting

### New Relic Not Reporting Data

1. **Check if enabled**: Verify `NEW_RELIC_ENABLED=true`
2. **Verify configuration**: Ensure all required variables are set correctly
3. **Check browser console**: Look for New Relic initialization messages or errors
4. **Ad blockers**: New Relic may be blocked by ad blockers in development
5. **Network connectivity**: Ensure outbound connections to `bam.nr-data.net` are allowed
6. **Check Nuxt devtools**: Verify the plugin is loaded in Nuxt devtools

### High Overhead / Slow Page Loads

If New Relic is causing performance issues:

1. Reduce session sampling in New Relic UI (e.g., 5% instead of 10%)
2. Disable session traces temporarily
3. Use async script loading (already configured)
4. Check for ad blocker conflicts causing slow timeouts

### Missing AJAX Requests

Ensure distributed tracing is enabled:

```bash
NEW_RELIC_BROWSER_TRUST_KEY=your_trust_key
```

Also check that the backend services (refinery-api, refinery-python) have New Relic APM enabled.

### JavaScript Errors Not Appearing

1. Ensure error beacon is configured:
   ```bash
   NEW_RELIC_BROWSER_ERROR_BEACON=bam.nr-data.net
   ```

2. Check error grouping settings in New Relic UI

3. Verify errors aren't being filtered out in New Relic settings

## Security Considerations

1. **Never commit license keys**: Always use environment variables
2. **Sensitive data exclusion**: Configure attribute filters in New Relic UI to exclude:
   - User passwords
   - API keys
   - Personal identifiable information (PII)
   - Authentication tokens
3. **Use environment-specific apps**: Separate Browser apps for dev/staging/production
4. **Trust key security**: Keep trust keys secure for distributed tracing

## Monitoring Key Metrics

### User Experience Metrics

Track these key frontend metrics in New Relic:

1. **Page Load Time**: Initial page load performance
2. **Route Change Time**: SPA navigation performance
3. **Time to Interactive (TTI)**: When page becomes interactive
4. **First Contentful Paint (FCP)**: When first content appears
5. **Largest Contentful Paint (LCP)**: When main content loads
6. **Cumulative Layout Shift (CLS)**: Visual stability score
7. **First Input Delay (FID)**: Input responsiveness

### Business Metrics

Track custom page actions for:

```typescript
// Document operations
trackPageAction('documentUploaded', { type, size });
trackPageAction('documentAnalyzed', { type, duration });
trackPageAction('resultsViewed', { documentId });
trackPageAction('resultsExported', { format });

// User authentication
trackPageAction('userLoggedIn', { method });
trackPageAction('userLoggedOut');

// Errors and retries
trackPageAction('analysisRetried', { attemptNumber });
trackPageAction('apiError', { endpoint, statusCode });
```

### Custom Dashboards

Create custom dashboards in New Relic to monitor:

- **Document Processing Funnel**: Upload → Analysis → Results → Export
- **Error Rates by Route**: Track errors per page/route
- **API Performance**: AJAX call timing by endpoint
- **User Engagement**: Session duration, pages per session

NRQL query examples:

```sql
-- Average page load time by route
SELECT average(duration) FROM PageView FACET pageUrl SINCE 1 day ago

-- Document upload success rate
SELECT percentage(count(*), WHERE error IS false)
FROM PageAction WHERE name = 'documentUploaded' SINCE 1 week ago

-- API error rates
SELECT count(*) FROM AjaxRequest WHERE httpResponseCode >= 400
FACET requestUrl SINCE 1 day ago

-- Core Web Vitals
SELECT percentile(largestContentfulPaint, 75) as 'LCP p75',
       percentile(firstInputDelay, 75) as 'FID p75',
       percentile(cumulativeLayoutShift, 75) as 'CLS p75'
FROM PageViewTiming SINCE 1 week ago
```

## Support

- **New Relic Docs**: https://docs.newrelic.com/docs/browser/
- **SPA Monitoring**: https://docs.newrelic.com/docs/browser/single-page-app-monitoring/
- **New Relic Support**: https://support.newrelic.com/
- **Issue Tracker**: https://github.com/monkeybarrels/refinery-docs/issues/11

## Related Documentation

- [Nuxt Configuration](./nuxt.config.ts)
- [New Relic Plugin](./plugins/newrelic.client.ts)
- [Environment Variables](.env.example)
- [Backend New Relic Setup](../refinery-api/NEW_RELIC_SETUP.md)
- [Processor New Relic Setup](../refinery-python/NEW_RELIC_SETUP.md)

## Complete Integration Example

Here's a complete example of tracking a document upload flow:

```vue
<template>
  <div>
    <input type="file" @change="handleFileUpload" accept=".pdf" />
    <button @click="analyzeDocument" :disabled="!file || analyzing">
      {{ analyzing ? 'Analyzing...' : 'Analyze Document' }}
    </button>
  </div>
</template>

<script setup>
const { trackPageAction, trackError, setUserContext } = useNewRelic();
const { $fetch } = useNuxtApp();

const file = ref(null);
const analyzing = ref(false);

// Set user context on component mount
onMounted(() => {
  const user = useCurrentUser(); // Your auth composable
  if (user.value) {
    setUserContext(user.value.id, {
      userTier: user.value.tier,
      authenticated: true,
    });
  }
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  file.value = target.files?.[0] || null;

  if (file.value) {
    trackPageAction('fileSelected', {
      fileName: file.value.name,
      fileSize: file.value.size,
      fileType: file.value.type,
    });
  }
};

const analyzeDocument = async () => {
  if (!file.value) return;

  analyzing.value = true;
  const startTime = Date.now();

  try {
    // Start a New Relic interaction for multi-step tracking
    const interaction = window.newrelic?.interaction();
    interaction?.actionText('Document Analysis Started');
    interaction?.setAttribute('fileName', file.value.name);

    // Upload document
    const uploadResult = await $fetch('/api/upload', {
      method: 'POST',
      body: file.value,
    });

    interaction?.actionText('Document Uploaded');
    trackPageAction('documentUploaded', {
      fileName: file.value.name,
      fileSize: file.value.size,
      uploadDuration: Date.now() - startTime,
    });

    // Analyze document
    const analysisResult = await $fetch('/api/analyze', {
      method: 'POST',
      body: { storageUrl: uploadResult.storageUrl },
    });

    interaction?.actionText('Analysis Completed');
    interaction?.save();

    const totalDuration = Date.now() - startTime;

    trackPageAction('documentAnalyzed', {
      fileName: file.value.name,
      totalDuration,
      success: true,
    });

    // Navigate to results
    navigateTo(`/analysis/${analysisResult.documentId}`);

  } catch (error) {
    trackError(error, {
      fileName: file.value.name,
      operation: 'document-analysis',
      duration: Date.now() - startTime,
    });

    // Show error to user
    console.error('Analysis failed:', error);
  } finally {
    analyzing.value = false;
  }
};
</script>
```

This provides comprehensive tracking of:
- User interactions (file selection, button clicks)
- API performance (upload, analysis)
- Errors with context
- Multi-step user flows
- Business metrics (success rates, durations)
