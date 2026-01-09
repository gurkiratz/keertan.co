# Migration Guide: Login Tokens to OAuth 2.0

**Effective Oct 21, 2025, all 3rd party app authentication is now done using OAuth 2.0. Existing apps must migrate by Dec 31, 2025 or they will cease to function.**

## Overview

This guide outlines the migration from the legacy `login_token` authentication method to OAuth 2.0 for the iBroadcast API. The current implementation uses `USER_ID` and `TOKEN` environment variables, which must be replaced with OAuth 2.0 access tokens.

## Current State Analysis

### Current Authentication Method

The application currently uses:
- **Environment Variables**: `USER_ID` and `TOKEN`
- **API Endpoint**: `https://library.ibroadcast.com/` (POST request with `user_id` and `token` in body)
- **Stream URLs**: Include `Signature=${token}&user_id=${user_id}` as query parameters

### Files Using Authentication

1. **`src/app/actions.ts`**
   - `getLibrary()`: Uses `USER_ID` and `TOKEN` in POST body
   - `getStreamUrl()`: Uses `USER_ID` and `TOKEN` in stream URL query params

2. **`src/hooks/use-library.ts`**
   - `getStreamUrl()`: Uses `USER_ID` and `TOKEN` in stream URL query params

## Prerequisites

Before starting the migration:

1. **Update App Information**
   - Go to [media.ibroadcast.com](https://media.ibroadcast.com/)
   - Click your username/email → Apps → Developers
   - Edit your app and fill out any missing fields

2. **Generate Client ID and Client Secret**
   - In the same Developer section, click "Regenerate" to generate `CLIENT_ID` and `CLIENT_SECRET`
   - Store these securely (will be needed for OAuth flow)

3. **Configure Redirect URI**
   - Set up a redirect URI for your app (e.g., `http://localhost:3000/api/auth/callback` for development)
   - This must match exactly in your OAuth requests

## Required Scopes

Based on the current functionality, you'll need to request these scopes:

- `user.library:read` - View your music library (required for `getLibrary()`)
- `user.queue:read` - View play queue (if queue functionality is used)
- `user.queue:write` - Control play queue (if queue functionality is used)

## Migration Steps

### Step 1: Set Up OAuth 2.0 Environment Variables

Add the following environment variables (replace existing `USER_ID` and `TOKEN`):

```bash
# OAuth 2.0 Configuration
IBROADCAST_CLIENT_ID=your_client_id
IBROADCAST_CLIENT_SECRET=your_client_secret
IBROADCAST_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Note: USER_ID and TOKEN will be removed after migration
```

### Step 2: Create OAuth 2.0 Authentication Utilities

Create a new file `src/lib/oauth.ts` to handle:
- PKCE code generation (code_verifier and code_challenge)
- State generation for CSRF protection
- Token storage and retrieval
- Token refresh logic
- Authorization URL generation

**Key Implementation Points:**
- Use `authorization_code` grant type (most common for web apps)
- Implement PKCE (Proof Key for Code Exchange) with SHA256
- Store tokens securely (consider using cookies or secure storage)
- Convert `expires_in` to UTC timestamp for expiration checking

### Step 3: Create OAuth Callback Route

Create `src/app/api/auth/callback/route.ts` to handle:
- Receiving authorization code from OAuth server
- Validating state parameter (CSRF protection)
- Exchanging authorization code for access token
- Storing tokens securely
- Redirecting user to appropriate page

### Step 4: Update API Request Format

**Current Format:**
```typescript
// OLD: POST with user_id and token in body
fetch('https://library.ibroadcast.com/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ user_id, token })
})
```

**New Format:**
```typescript
// NEW: POST with Bearer token in Authorization header
fetch('https://library.ibroadcast.com/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`
  },
  body: JSON.stringify({}) // Empty body or API-specific payload
})
```

### Step 5: Update Stream URL Generation

**Current Format:**
```typescript
// OLD: Query params with Signature and user_id
`${streaming_server}${path}?Expires=${expires}&Signature=${token}&user_id=${user_id}&platform=Web&version=1.0.0`
```

**New Format:**
The stream URL format may need to change. Check the iBroadcast API documentation for the new format with OAuth tokens. It may require:
- Using the access token in the Authorization header for the stream request
- Or a different query parameter format

### Step 6: Implement Token Refresh Logic

Create token refresh functionality that:
- Checks token expiration before API requests
- Automatically refreshes expired tokens using `refresh_token`
- Handles refresh failures by redirecting to re-authentication
- Updates stored tokens after successful refresh

**Refresh Endpoint:**
```
POST https://oauth.ibroadcast.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token
&refresh_token=your_refresh_token
&client_id=your_client_id
&redirect_uri=your_redirect_uri
```

### Step 7: Handle Authentication Errors

Update error handling to check for `authenticated: false` in API responses:

```typescript
const response = await fetch('https://library.ibroadcast.com/', {
  // ... request config
})

const data = await response.json()

if (data.authenticated === false) {
  // Attempt to refresh token
  // If refresh fails, redirect to login
}
```

### Step 8: Create Login/Authentication UI

Create a login page or component that:
- Initiates OAuth flow by redirecting to authorization URL
- Shows loading state during authentication
- Handles errors from OAuth server
- Provides user feedback

### Step 9: Update All API Calls

Update the following files to use OAuth tokens:

1. **`src/app/actions.ts`**
   - Replace `getLibrary()` to use Bearer token
   - Replace `getStreamUrl()` to use OAuth token format
   - Add token refresh logic

2. **`src/hooks/use-library.ts`**
   - Update `getStreamUrl()` to use OAuth token format
   - Remove direct access to `process.env.USER_ID` and `process.env.TOKEN`

### Step 10: Remove Legacy Code

After successful migration:
- Remove `USER_ID` and `TOKEN` environment variables
- Remove any references to `login_token` mode
- Clean up unused authentication code

## Implementation Details

### PKCE Code Generation (Node.js Example)

```typescript
import crypto from 'crypto'

function base64URLEncode(str: Buffer): string {
  return str
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32))
}

function generateCodeChallenge(verifier: string): string {
  return base64URLEncode(
    crypto.createHash('sha256').update(verifier).digest()
  )
}
```

### Authorization URL Format

```
https://oauth.ibroadcast.com/authorize
  ?client_id=your_client_id
  &state=<random_state>
  &response_type=code
  &code_challenge=<code_challenge>
  &code_challenge_method=S256
  &scope=user.library:read user.queue:read user.queue:write
  &redirect_uri=your_redirect_uri
```

### Token Exchange Format

```
POST https://oauth.ibroadcast.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=<authorization_code>
&client_id=<your_client_id>
&redirect_uri=<your_redirect_uri>
&code_verifier=<your_code_verifier>
```

### Token Response Format

```json
{
  "access_token": "<64_character_token>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "<64_character_token>",
  "scope": ["user.library:read", "user.queue:read", "user.queue:write"]
}
```

## Testing Checklist

- [ ] OAuth flow initiates correctly
- [ ] User can complete authorization
- [ ] Authorization code is exchanged for tokens
- [ ] Tokens are stored securely
- [ ] Library API calls work with Bearer token
- [ ] Stream URLs work with new token format
- [ ] Token refresh works automatically
- [ ] Expired tokens trigger refresh
- [ ] Failed refresh redirects to login
- [ ] CSRF protection (state validation) works
- [ ] Error handling for OAuth errors
- [ ] Error handling for API authentication failures
- [ ] Remove old `USER_ID` and `TOKEN` env vars
- [ ] Test on both development and production environments

## Security Considerations

1. **Store tokens securely**: Use httpOnly cookies or secure client-side storage
2. **Validate state parameter**: Always verify state matches to prevent CSRF
3. **Protect client secret**: Never expose `CLIENT_SECRET` in client-side code
4. **Use HTTPS**: Always use HTTPS in production
5. **Token expiration**: Implement proper token expiration checking
6. **Secure redirect URI**: Ensure redirect URI matches exactly

## Rollback Plan

If issues arise during migration:
1. Keep old `USER_ID` and `TOKEN` environment variables temporarily
2. Implement feature flag to switch between old and new auth
3. Monitor error rates and user feedback
4. Have rollback procedure ready

## Timeline

- **Deadline**: December 31, 2025
- **Recommended**: Complete migration well before deadline to allow for testing and bug fixes

## Resources

- [OAuth 2.0 Authentication Documentation](https://help.ibroadcast.com/en/developer/authentication)
- [Migration Guide](https://help.ibroadcast.com/en/developer/migrating)
- [Demo App](https://demo.ibroadcast.com/) - Reference implementation using OAuth 2.0

## Next Steps After Migration

1. Test thoroughly in development environment
2. Deploy to staging for user testing
3. Monitor for authentication errors
4. Re-submit app for review in iBroadcast Apps page
5. Remove legacy authentication code
6. Update documentation

## Notes

- The migration must be completed by **December 31, 2025**
- Apps not migrated by the deadline will cease to function
- After migration, re-submit your app for review in the Apps page
- The demo app at [demo.ibroadcast.com](https://demo.ibroadcast.com/) has been updated to use OAuth 2.0 and can serve as a reference


