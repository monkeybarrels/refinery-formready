# Session Management Testing Guide

This document describes the testing strategy for the FormReady session management system.

## Overview

The session management system consists of:
- **useAuth composable** - Core authentication logic
- **auth middleware** - Route protection
- **useApi composable** - API calls with auto-logout on 401/403
- **Protected pages** - Dashboard, documents, profile, settings, analysis

## Testing Strategy

### 1. Unit Tests

Unit tests focus on testing individual functions in isolation with mocked dependencies.

**Location**: `tests/unit/`

**Coverage**:
- ✅ Token storage and retrieval
- ✅ Session expiration detection
- ✅ Logout functionality
- ✅ Route protection logic
- ✅ Session validation

**Run**: `npm run test`

### 2. Integration Tests

Integration tests verify the interaction between multiple components.

**Location**: `tests/integration/`

**Coverage**:
- ✅ Complete login-to-expiration flow
- ✅ Tab visibility session checks
- ✅ API 401/403 auto-logout
- ✅ Multiple concurrent sessions
- ✅ localStorage corruption scenarios

**Run**: `npm run test`

### 3. E2E Tests (Manual Testing Checklist)

End-to-end tests verify the complete user experience.

**Location**: Manual testing or future Playwright tests

#### Test Scenarios:

##### Scenario 1: Happy Path Login
1. Navigate to `/auth/login`
2. Enter valid credentials
3. Click "Sign In"
4. ✅ Should redirect to `/dashboard`
5. ✅ Token should be stored in localStorage
6. ✅ Session monitoring should be active

##### Scenario 2: Protected Route Access
1. Clear localStorage (simulate logged out state)
2. Navigate directly to `/dashboard`
3. ✅ Should redirect to `/auth/login?redirect=/dashboard`
4. After login
5. ✅ Should redirect back to `/dashboard`

##### Scenario 3: Session Expiration
1. Log in successfully
2. Manually set `token_expiry` to past timestamp in localStorage
3. Wait 5 minutes (or trigger visibility change)
4. ✅ Should auto-logout and redirect to login
5. ✅ Should show "Your session has expired" message

##### Scenario 4: API 401 Response
1. Log in successfully
2. Navigate to `/dashboard`
3. Simulate API returning 401 (modify token to invalid value)
4. Trigger any API call
5. ✅ Should auto-logout immediately
6. ✅ Should redirect to login

##### Scenario 5: Tab Visibility Check
1. Log in successfully
2. Navigate to `/dashboard`
3. Switch to another tab for 10+ minutes
4. Set `token_expiry` to expired while tab is hidden
5. Switch back to the tab
6. ✅ Should detect expired session
7. ✅ Should auto-logout and redirect

##### Scenario 6: Multiple Protected Pages
Test each protected page:
- `/dashboard`
- `/documents`
- `/profile`
- `/settings`
- `/analysis/[id]`

For each page:
1. Access while logged out
2. ✅ Should redirect to login with redirect parameter
3. Access while logged in
4. ✅ Should load page successfully
5. ✅ Should have session monitoring active

##### Scenario 7: Session Monitoring Interval
1. Log in with short expiry (modify code temporarily to 30 seconds)
2. Wait 6 minutes (beyond first check interval)
3. ✅ Should detect expiration and logout

##### Scenario 8: Manual Logout
1. Log in successfully
2. Navigate to `/dashboard`
3. Click logout button
4. ✅ Should clear localStorage
5. ✅ Should redirect to `/auth/login`
6. ✅ Cannot navigate back to protected pages

### 4. Current Test Implementation Status

#### Implemented ✅
- Test infrastructure setup (Vitest, happy-dom)
- Test configuration (vitest.config.ts)
- Mock setup (localStorage, document APIs)
- Unit test structure for useAuth
- Unit test structure for auth middleware
- Integration test structure for session flows

#### Known Issues ⚠️
- Nuxt composable mocking is complex in Vitest
- Global mocks conflict with actual imports
- Requires Nuxt testing utilities for proper integration

#### Recommended Approach

Due to Nuxt's complex composable system, we recommend:

1. **Focus on manual E2E testing** for now (see scenarios above)
2. **Use Playwright** for automated E2E tests (already set up in `refinery-e2e-tests/`)
3. **Unit test pure logic** (functions that don't depend on Nuxt composables)
4. **Use Nuxt's official test utils** for composable testing when stable

### 5. Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### 6. Writing New Tests

When adding new tests:

1. **Identify the test type**: Unit, Integration, or E2E
2. **Place in correct directory**: `tests/unit/` or `tests/integration/`
3. **Mock external dependencies**: Use vi.mock() for imports
4. **Test behavior, not implementation**: Focus on outcomes
5. **Use descriptive test names**: "should redirect to login when not authenticated"

### 7. Test Coverage Goals

| Component | Target Coverage | Current Status |
|-----------|----------------|----------------|
| useAuth composable | 80%+ | Structure ready |
| auth middleware | 80%+ | Structure ready |
| useApi composable | 70%+ | Not implemented |
| Protected pages | Manual E2E | In progress |

### 8. Debugging Tests

```bash
# Run specific test file
npx vitest tests/unit/composables/useAuth.test.ts

# Run tests matching pattern
npx vitest --grep "session expiration"

# Run with verbose output
npx vitest --reporter=verbose

# Run single test
npx vitest --grep "should store token"
```

### 9. Continuous Integration

Tests can be integrated into CI/CD:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

### 10. Manual Testing Quick Start

**Quick Session Expiration Test:**

1. Open DevTools Console
2. Run:
```javascript
// Set token to expire in 10 seconds
localStorage.setItem('token_expiry', String(Date.now() + 10000))
```
3. Wait 10 seconds
4. Change tabs or wait for next check interval
5. Should auto-logout

**Quick 401 Test:**

1. Log in normally
2. Open DevTools Console
3. Run:
```javascript
// Corrupt the token
localStorage.setItem('auth_token', 'invalid-token-xyz')
```
4. Navigate to any page or refresh
5. Should auto-logout when API call fails

---

## Summary

The session management system has a comprehensive testing structure in place. While unit/integration tests need Nuxt-specific setup, the system can be thoroughly validated through:

1. Manual E2E testing using the scenarios above
2. Automated E2E tests with Playwright
3. Monitoring production logs for session-related issues

The test infrastructure is ready and can be completed once Nuxt testing utilities are properly configured.
