# Firebase Configuration Fix for Staging

## Problem
Frontend is using Socket.IO instead of Firebase RTDB because Firebase configuration is missing.

## Console Errors
- `Firebase not configured - missing projectId or databaseURL`
- `Firebase not available, cannot connect to notifications`
- `Cannot watch job: Firebase not available`

## Required Environment Variables

The frontend needs these `NUXT_PUBLIC_*` variables (public, safe to expose):

```bash
NUXT_PUBLIC_NOTIFICATION_PROVIDER=firebase-rtdb
NUXT_PUBLIC_FIREBASE_PROJECT_ID=refinery-authentication
NUXT_PUBLIC_FIREBASE_DATABASE_URL=https://refinery-authentication-default-rtdb.firebaseio.com
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=refinery-authentication.firebaseapp.com
NUXT_PUBLIC_FIREBASE_API_KEY=<needs-to-be-added>
```

## Values from Terraform

From `refinery-infrastructure/terraform/environments/staging/main.tf`:
- `FIREBASE_PROJECT_ID = "refinery-authentication"`
- `FIREBASE_DATABASE_URL = "https://refinery-authentication-default-rtdb.firebaseio.com"`

## Where to Add

### Option 1: GitHub Variables (Recommended for Public Values)
Add to GitHub repository variables (`Settings > Secrets and variables > Actions > Variables`):
- `FIREBASE_PROJECT_ID` = `refinery-authentication`
- `FIREBASE_DATABASE_URL` = `https://refinery-authentication-default-rtdb.firebaseio.com`
- `FIREBASE_AUTH_DOMAIN` = `refinery-authentication.firebaseapp.com`
- `FIREBASE_API_KEY` = `<get from Firebase Console>`

### Option 2: Secret Manager (If API Key is sensitive)
Fetch from Secret Manager in workflow:
```yaml
- name: Fetch Firebase Config from Secret Manager
  run: |
    gcloud secrets versions access latest --secret="FIREBASE_API_KEY_STAGING" > /tmp/firebase_api_key
    # ... etc
```

### Option 3: Direct in Workflow (For Known Public Values)
Add directly to `.env` file in `deploy-staging.yml`:
```yaml
NUXT_PUBLIC_NOTIFICATION_PROVIDER=firebase-rtdb
NUXT_PUBLIC_FIREBASE_PROJECT_ID=refinery-authentication
NUXT_PUBLIC_FIREBASE_DATABASE_URL=https://refinery-authentication-default-rtdb.firebaseio.com
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=refinery-authentication.firebaseapp.com
NUXT_PUBLIC_FIREBASE_API_KEY=${{ vars.FIREBASE_API_KEY }}
```

## How to Get Firebase API Key

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: `refinery-authentication`
3. Go to Project Settings > General
4. Scroll to "Your apps" section
5. Find Web app or create one
6. Copy the `apiKey` from the config

## Update Workflow

Add to `.github/workflows/deploy-staging.yml` in the "Create staging .env file" step:

```yaml
- name: Create staging .env file
  run: |
    cat > .env << EOF
    NUXT_PUBLIC_API_URL=${{ vars.STAGING_API_URL || 'https://api-staging.claimready.io' }}
    NUXT_PUBLIC_AUTHORIZER_URL=${{ vars.AUTHORIZER_URL || 'https://auth.claimready.io' }}
    NUXT_PUBLIC_AUTHORIZER_CLIENT_ID=${{ secrets.AUTHORIZER_CLIENT_ID }}
    NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${{ secrets.STRIPE_TEST_KEY }}
    NUXT_PUBLIC_POSTHOG_API_KEY=${{ secrets.POSTHOG_API_KEY }}
    NUXT_PUBLIC_POSTHOG_HOST=${{ vars.POSTHOG_HOST || 'https://us.i.posthog.com' }}
    # Firebase Configuration
    NUXT_PUBLIC_NOTIFICATION_PROVIDER=firebase-rtdb
    NUXT_PUBLIC_FIREBASE_PROJECT_ID=refinery-authentication
    NUXT_PUBLIC_FIREBASE_DATABASE_URL=https://refinery-authentication-default-rtdb.firebaseio.com
    NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=refinery-authentication.firebaseapp.com
    NUXT_PUBLIC_FIREBASE_API_KEY=${{ vars.FIREBASE_API_KEY }}
    EOF
```

## Verification

After deployment, check browser console:
- ✅ Should see: "Using Firebase RTDB for notifications"
- ✅ Should see: "Firebase app initialized"
- ✅ Should see: "Connected to Firebase RTDB notifications"
- ❌ Should NOT see: "Using Socket.IO for notifications"
- ❌ Should NOT see: "Firebase not configured"
