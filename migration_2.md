# Migration Guide 2: Public Library Mode (Single User)

This guide outlines how to configure the application to serve **your specific library** to all visitors without requiring them to log in. This is achieved by using a server-side "Service Account" approach where the application manages a long-lived **Refresh Token** for your account.

## Overview

Instead of asking users to log in, the server will:

1.  Store your personal `IBROADCAST_REFRESH_TOKEN` in environment variables.
2.  Use this token to automatically generate/refresh `access_token`s as needed.
3.  Serve your library content to any visitor.

## Step 1: Generate a Refresh Token

Since iBroadcast only supports OAuth 2.0 (and not direct username/password exchange for tokens), you need to perform a one-time authentication to generate a Refresh Token. The easiest way to do this without a web interface is using the **Device Code Flow**.

Generate a code_verifier and code_challenge on your app. A code_verifier is a cryptographically random set of characters between 43 and 128 in length.

```bash
code_verifier=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=')
code_challenge=$(printf "%s" "$code_verifier" | openssl dgst -sha256 -binary | openssl base64 | tr '+/' '-_' | tr -d '=')
echo "Verifier: $code_verifier"
echo "Challenge: $code_challenge"
```

### 1. Request Device Code

**Endpoint:**

```
GET https://oauth.ibroadcast.com/device/code
    ?client_id=<your_client_id>
    &code_challenge=<your_code_challenge>
    &code_challenge_method=S256
    &scope=user.library:read user.queue:read user.queue:write
```

**Response:**

```
{
  device_code: <string>, // ~64 character token
  user_code: <string>, // code user must enter to authorize this app
  verification_uri: <string>, // URI to display to user
  verification_uri_complete: <string>, // URI which can be used to generate a QR code
  interval: <int> // poll rate, seconds
  expires_in: <int> // seconds relative to now
}
```

### 2. Authorize Application

1.  Open the `verification_uri` in your browser (where you are logged in to iBroadcast).
2.  Enter the `user_code`.
3.  Approve the application.

### 3. Poll for Token

Immediately after step 1, start polling this endpoint (every 5 seconds) until you get a success response.

**Endpoint:** `POST https://oauth.ibroadcast.com/token`
**Headers:** `Content-Type: application/x-www-form-urlencoded`
**Body:**

```text
grant_type=device_code
device_code=<YOUR_DEVICE_CODE_FROM_STEP_1>
client_id=<YOUR_CLIENT_ID>
code_verifier=<YOUR_CODE_VERIFIER_FROM_BASH_SCRIPT>
```

**Success Response:**

```json
{
    "access_token": "...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "refresh_token": "LONG_STRING_HERE",
    "scope": [...]
}
```

**Save the `refresh_token`**. This is your "permanent" key.

## Step 2: Update Environment Variables

Update your `.env.local` file:

```bash
# Keep these
IBROADCAST_CLIENT_ID=your_client_id
IBROADCAST_CLIENT_SECRET=your_client_secret

# Add this (from Step 1)
IBROADCAST_REFRESH_TOKEN=your_long_refresh_token_string

# Remove this (no longer needed)
# IBROADCAST_REDIRECT_URI=...
```

## Step 3: Code Changes

### 1. Remove Login/Callback Routes

Since users don't log in, you can delete:

- `src/app/login/page.tsx`
- `src/app/api/auth/callback/route.ts`
- `src/middleware.ts` (or update it to not block access)

### 2. Update `src/lib/oauth.ts`

Modify `getValidAccessToken` (or create a new helper) to:

- Check for a cached Access Token in memory (global variable or cache).
- If missing/expired, use `IBROADCAST_REFRESH_TOKEN` to fetch a new one.
- **Crucial:** Store the new Access Token in memory, not cookies.

```typescript
let cachedAccessToken: string | null = null
let tokenExpiration: number = 0

export async function getServiceAccessToken() {
  // Check if current token is valid (with 60s buffer)
  if (cachedAccessToken && Date.now() < tokenExpiration - 60000) {
    return cachedAccessToken
  }

  if (!process.env.IBROADCAST_REFRESH_TOKEN) {
    throw new Error('IBROADCAST_REFRESH_TOKEN is not set')
  }

  // Refresh token
  const response = await fetch('https://oauth.ibroadcast.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.IBROADCAST_REFRESH_TOKEN,
      client_id: process.env.IBROADCAST_CLIENT_ID!,
      // client_secret removed as per public client flow, but include if required by your specific app settings
      // client_secret: process.env.IBROADCAST_CLIENT_SECRET!,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Failed to refresh token: ${text}`)
  }

  const data = await response.json()

  cachedAccessToken = data.access_token
  // Set expiration (Date.now() + expires_in * 1000)
  tokenExpiration = Date.now() + data.expires_in * 1000

  return cachedAccessToken
}
```

### 3. Update `src/app/actions.ts`

Update `getLibrary` and `getStreamUrl` to use `getServiceAccessToken()` instead of reading cookies.

```typescript
// src/app/actions.ts
import { getServiceAccessToken } from '@/lib/oauth'

export async function getLibrary() {
  const accessToken = await getServiceAccessToken()

  // ... existing fetch logic using accessToken ...
  // ...

  // Don't forget to return user_id as implemented previously
  return {
    // ...
    user_id: data.user.id,
  }
}

export async function getStreamUrl(track: Track, library: Library) {
  const accessToken = await getServiceAccessToken()

  const timestamp = Date.now()
  return `${library.settings.streaming_server}${track.path}?Expires=${timestamp}&Signature=${accessToken}&file_id=${track.id}&user_id=${library.user_id}&platform=Keertan&version=1.0.0`
}
```

## Security Note

- **Never expose `IBROADCAST_REFRESH_TOKEN` to the client.** It gives full access to your library.
- Since `getStreamUrl` generates a URL with `?access_token=...` that is sent to the client, users _will_ see a temporary access token. This is generally acceptable as access tokens are short-lived (1 hour), but be aware they can technically use it to make other API calls on your behalf until it expires.
