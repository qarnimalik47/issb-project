/**
 * API client for the mobile app. Uses JWT access tokens with automatic refresh
 * (the web app uses cookies; mobile uses the /api/auth/token endpoints prepared
 * in Phase 1). Tokens persist in AsyncStorage.
 */
import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'
import type { TokenResponse } from './types'

const BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ?? 'http://127.0.0.1:4310'

const ACCESS_KEY = 'issb_access'
const REFRESH_KEY = 'issb_refresh'

let accessToken: string | null = null
let refreshToken: string | null = null

export async function loadTokens(): Promise<boolean> {
  accessToken = await AsyncStorage.getItem(ACCESS_KEY)
  refreshToken = await AsyncStorage.getItem(REFRESH_KEY)
  return Boolean(accessToken)
}

async function persist(tokens: { accessToken: string; refreshToken: string }) {
  accessToken = tokens.accessToken
  refreshToken = tokens.refreshToken
  await AsyncStorage.multiSet([
    [ACCESS_KEY, tokens.accessToken],
    [REFRESH_KEY, tokens.refreshToken],
  ])
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid email or password')
  const data = (await res.json()) as TokenResponse
  await persist(data)
  return data
}

export async function logout(): Promise<void> {
  accessToken = null
  refreshToken = null
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY])
}

async function tryRefresh(): Promise<boolean> {
  if (!refreshToken) return false
  const res = await fetch(`${BASE_URL}/api/auth/token/refresh`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  if (!res.ok) return false
  const data = (await res.json()) as { accessToken: string; refreshToken: string }
  await persist(data)
  return true
}

/** Authenticated request with one automatic refresh-and-retry on 401. */
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const doFetch = () =>
    fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
        ...(init.headers ?? {}),
      },
    })

  let res = await doFetch()
  if (res.status === 401 && (await tryRefresh())) {
    res = await doFetch()
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`)
  }
  return (await res.json()) as T
}

export { BASE_URL }
