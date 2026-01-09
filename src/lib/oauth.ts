import 'server-only'

const CLIENT_ID = process.env.IBROADCAST_CLIENT_ID!
// Client secret might not be needed for public client flows (device_code),
// but if you have one, it doesn't hurt to include it if the server accepts it.
// Based on your docs, refresh doesn't explicitly ask for it, but standard OAuth often does.
// We will omit it for now as per the docs you pasted.
// const CLIENT_SECRET = process.env.IBROADCAST_CLIENT_SECRET!

const REFRESH_TOKEN = process.env.IBROADCAST_REFRESH_TOKEN!
const OAUTH_BASE_URL = 'https://oauth.ibroadcast.com'

// In-memory cache for the access token
// This resets when the server restarts, which is fine (we'll just refresh again)
let cachedAccessToken: string | null = null
let tokenExpiration: number = 0

export interface TokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
  refresh_token: string
  scope: string[]
}

export async function getServiceAccessToken(): Promise<string> {
  // 1. Check if we have a valid cached token
  // Add a 60-second buffer to be safe
  if (cachedAccessToken && Date.now() < tokenExpiration - 60000) {
    return cachedAccessToken
  }

  if (!REFRESH_TOKEN) {
    throw new Error(
      'IBROADCAST_REFRESH_TOKEN is not set in environment variables'
    )
  }

  // 2. Refresh the token
  console.log('Refreshing access token...')

  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: REFRESH_TOKEN,
    client_id: CLIENT_ID,
    // redirect_uri is listed in docs but might not be needed for device_code flow.
    // If it fails, we might need to register a dummy one or use what was used during app creation.
    // For now, we omit it as device_code flow has no redirect.
  })

  const response = await fetch(`${OAUTH_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
    cache: 'no-store', // Ensure we don't cache the refresh request
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Token refresh failed:', errorText)
    throw new Error(`Failed to refresh token: ${errorText}`)
  }

  const data: TokenResponse = await response.json()

  // 3. Update cache
  cachedAccessToken = data.access_token
  // expires_in is in seconds, convert to ms and add to current time
  tokenExpiration = Date.now() + data.expires_in * 1000

  return cachedAccessToken
}
