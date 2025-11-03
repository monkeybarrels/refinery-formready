# Session Management & Expiration Detection

## Overview

Comprehensive session management system that prevents users from navigating protected pages with expired sessions.

## Features

### ✅ Implemented

1. **Token-based Authentication**
   - JWT tokens stored in localStorage
   - Automatic token inclusion in API calls
   - Token expiry tracking

2. **Session Expiration Detection**
   - Local expiry time validation
   - Backend session validation
   - Automatic logout on expiration

3. **Auto-Redirect on Expiry**
   - Redirects to login with session_expired flag
   - Preserves intended destination for post-login redirect
   - User-friendly expiration message

4. **Session Monitoring**
   - Periodic session validation (every 5 minutes)
   - Tab visibility detection (checks on return to tab)
   - Automatic cleanup on session end

5. **Protected Routes**
   - Global auth middleware
   - Per-page auth requirements
   - Public route exemptions

## Files Created/Modified

### New Files

1. **`composables/useAuth.ts`** - Core authentication composable
   - `isAuthenticated()` - Check local session validity
   - `validateSession()` - Verify with backend
   - `requireAuth()` - Enforce authentication on pages
   - `login()` - Store session data
   - `logout()` - Clear session and redirect
   - `setupSessionMonitoring()` - Auto-check session

2. **`middleware/auth.ts`** - Global route protection
   - Runs before navigation
   - Checks authentication status
   - Redirects unauthenticated users
   - Preserves public routes

### Modified Files

1. **`pages/auth/login.vue`**
   - Session expiration warning display
   - Redirect parameter handling
   - Updated login handler with token expiry

2. **`pages/dashboard.vue`**
   - Uses `requireAuth()` on mount
   - Sets up session monitoring
   - Updated logout handler

3. **`composables/useApi.ts`**
   - Auto-detects 401/403 responses
   - Triggers automatic logout
   - Cleaner API call handling

## Usage

### Protecting a Page

```typescript
// In any protected page (e.g., dashboard.vue, settings.vue)
onMounted(async () => {
  const { requireAuth, setupSessionMonitoring } = useAuth()

  // Require authentication
  const isAuth = await requireAuth()
  if (!isAuth) return // Already redirected

  // Set up auto-logout monitoring
  setupSessionMonitoring()

  // Continue with page logic...
})
```

### Manual Auth Check

```typescript
const { isAuthenticated } = useAuth()

if (!isAuthenticated()) {
  // User is not logged in
  navigateTo('/auth/login')
}
```

### Logout

```typescript
const { logout } = useAuth()

// Logout and redirect to login
await logout(true)

// Logout without redirect
await logout(false)
```

## Session Flow

### Login Flow
```
1. User enters credentials → POST /api/auth/login
2. Backend returns token + expiresIn
3. Frontend stores token + expiry time
4. Redirect to dashboard (or original destination)
```

### Session Validation Flow
```
1. User navigates to protected page
2. Middleware checks local token expiry
3. If valid locally → validate with backend
4. If backend returns 401/403 → logout & redirect
5. If valid → allow navigation
```

### Expiration Detection
```
Multiple detection points:
- Navigation (via middleware)
- API calls (via useApi)
- Periodic checks (every 5 minutes)
- Tab focus (when user returns)
```

### Logout Flow
```
1. User clicks logout OR auto-logout triggered
2. Call backend /api/auth/logout
3. Clear localStorage (token, expiry, user_data)
4. Redirect to /auth/login?session_expired=true
```

## Configuration

### Token Expiry Time

Default: 24 hours (86400 seconds)

Can be customized in login response:
```typescript
{
  accessToken: "jwt-token-here",
  expiresIn: 86400 // seconds
}
```

### Monitoring Interval

Default: 5 minutes

Configured in `useAuth.ts`:
```typescript
setInterval(() => {
  // Check session
}, 5 * 60 * 1000) // 5 minutes
```

### Public Routes

Configured in `middleware/auth.ts`:
```typescript
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/analyze', // Anonymous analysis
  '/results' // Anonymous results
]
```

## Security Features

1. **Token Expiry Validation**
   - Local check prevents unnecessary API calls
   - Backend validation ensures token is still valid
   - Expired tokens automatically cleared

2. **Automatic Logout**
   - Prevents stale session usage
   - Clears sensitive data from localStorage
   - Redirects to secure login page

3. **401/403 Detection**
   - Any API call returning unauthorized triggers logout
   - Prevents users from staying logged in with invalid sessions

4. **Visibility Monitoring**
   - Checks session when user returns to tab
   - Prevents long-inactive sessions from appearing valid

## Testing Scenarios

### Manual Testing

1. **Session Expiration**
   - Set short expiry time (e.g., 60 seconds)
   - Wait for expiration
   - Try to navigate → should redirect to login

2. **Token Deletion**
   - Delete `auth_token` from localStorage
   - Try to access dashboard → should redirect

3. **Backend 401**
   - Make API call with invalid token
   - Should auto-logout and redirect

4. **Redirect Preservation**
   - Try to access `/settings` without login
   - Login → should redirect to `/settings`

### Automated Testing

```bash
# Add to E2E tests
- Test session expiration redirect
- Test login with redirect parameter
- Test auto-logout on 401
- Test public route access without auth
```

## Environment Variables

None required - uses default values.

Optional customization via backend response:
- `expiresIn` - Token expiry time in seconds

## Migration Notes

**Before:**
- Simple token check in each page
- No expiry validation
- Manual session cleanup

**After:**
- Centralized auth composable
- Automatic expiry detection
- Global middleware protection
- Session monitoring

## Future Enhancements

- [ ] Refresh token support
- [ ] "Remember me" extended sessions
- [ ] Session activity tracking
- [ ] Multi-tab synchronization
- [ ] Idle timeout warnings
- [ ] Graceful session renewal

## Troubleshooting

**Issue:** Constant redirects to login
- Check token expiry time in localStorage
- Verify backend /api/auth/profile endpoint
- Check browser console for errors

**Issue:** Session not expiring
- Verify `token_expiry` is set in localStorage
- Check monitoring interval is running
- Confirm backend returns 401 for expired tokens

**Issue:** Lost redirect after login
- Check `redirect` query parameter in URL
- Verify `redirectPath` is set in login component
- Check for navigation guards interfering

## Support

For issues or questions, check:
- Browser console logs (look for 🔒 emoji)
- Network tab (401/403 responses)
- localStorage values (auth_token, token_expiry)
