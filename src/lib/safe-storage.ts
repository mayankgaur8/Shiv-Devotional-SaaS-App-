export function safeStorageGet(key: string): string | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function safeStorageSet(key: string, value: string): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false
    window.localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

export function safeStorageParse<T>(
  key: string,
  fallback: T,
  isValid?: (value: unknown) => value is T,
): T {
  const raw = safeStorageGet(key)
  if (!raw) return fallback

  try {
    const parsed = JSON.parse(raw) as unknown
    if (isValid && !isValid(parsed)) {
      return fallback
    }
    return parsed as T
  } catch (error) {
    console.error(`Invalid JSON in localStorage for key: ${key}`, error)
    return fallback
  }
}
